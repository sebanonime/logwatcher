# LogWatcher Web — Implementation Plan

## Context

The existing LogWatcher WinForms app (net48) monitors local log files. The goal is to convert it to a web application able to:
- Open 200MB+ log files with no browser memory overload (virtual scrolling, server-side indexing)
- Display new lines in real-time with <200ms latency (SignalR push)
- Support syntax highlighting and regex/text filtering
- Access log files on **multiple remote servers**: Windows LAN, Linux LAN, and DMZ servers — not only files local to the backend machine

Remote file access is the key driver. The solution must handle:
- **Agent-based** (all Linux servers + DMZ Windows servers): lightweight agent installed on the remote server, initiates outbound HTTPS to the backend on a **configurable port** (default 443)
- **SMB/UNC** (Windows LAN servers where agent cannot be installed): backend opens `\\server\share\file.log` directly via .NET FileStream

The existing `Common` project is reused as-is (domain models, `FileWatcherCustom`, `ILogWatcherCustom`). All WinForms coupling is abandoned.

---

## Solution Structure

```
LogWatcher.sln
├── Common/                         (existing — minimal surgery)
├── LogWatcher.Web/                 (ASP.NET Core 8 — backend API)
├── LogWatcher.Agent/               (NET 8 — remote agent service)
└── logwatcher-frontend/            (React 18 + Vite — browser UI)
```

---

## Phase 1 — Common Project Surgery

**Goal:** Strip WinForms dependencies from `Common` so it compiles in non-Windows contexts.

**Files to modify:**
- `Common/Highlighting.cs` — remove `using System.Drawing`; delete the `Color` properties (the ARGB int properties `ForeColorArgb`/`BackColorArgb` already exist and are sufficient)
- `Common/HiddenLine.cs` — replace `ConfigurationManager.AppSettings["MaxLineSize"]` with a constructor parameter (default 20000)
- `Common/ILogWatcherCustom.cs` — keep as-is; this interface is used by `FileWatcherCustom` and the Agent

All other Common files (`Profile`, `StoredFilter`, `Highlighting`, `HiddenLine`, `AlertInfo`, `AlertFile`, `FileNameManager`, `ListLog`, `Filter`) — unchanged.

---

## Phase 2 — Backend: LogWatcher.Web

### NuGet packages
- `Microsoft.AspNetCore.SignalR` (built-in)
- `Microsoft.AspNetCore.DataProtection` (credential encryption for SMB passwords)
- `System.IdentityModel.Tokens.Jwt` (agent token generation)
- `Microsoft.AspNetCore.Authentication.JwtBearer`

### Project layout

```
LogWatcher.Web/
├── Program.cs
├── appsettings.json
├── Auth/
│   ├── IAuthenticationProvider.cs   (extensibility seam for future company auth)
│   ├── JwtAuthenticationProvider.cs (current implementation)
│   └── AuthProviderFactory.cs       (resolves provider by config key)
├── Config/
│   ├── ServerDefinition.cs          { Id, Name, Host, Type, Port?, Username? }
│   ├── CredentialStore.cs           (IDataProtector-encrypted JSON)
│   └── ServerConfigRepository.cs   (reads/writes servers.json)
├── Sources/
│   ├── IFileSourceProvider.cs       (core abstraction — see below)
│   ├── LocalOrSmbFileSourceProvider.cs
│   └── AgentFileSourceProvider.cs
├── Indexing/
│   ├── LineIndex.cs                 (List<long> byte offsets, thread-safe)
│   ├── FilteredLineIndex.cs         (List<int> filtered→original line mapping)
│   └── LineIndexBuilder.cs          (scans raw bytes for \n positions)
├── Sessions/
│   ├── WatchSession.cs              (per open-file state: index, filter, tail mode)
│   └── WatchSessionManager.cs      (creates/destroys sessions, routes messages)
├── Hubs/
│   ├── LogHub.cs                    (browser ↔ backend, /logHub)
│   └── AgentHub.cs                  (agent ↔ backend, /agentHub)
├── Services/
│   ├── AgentRegistry.cs             (ConcurrentDictionary agentId→connectionId)
│   └── AlertService.cs              (reuses Common AlertManager logic)
└── Dto/
    ├── LineDto.cs                   { LineNumber, Text }
    ├── FileStatsDto.cs              { TotalLines, SizeBytes, IsIndexed }
    └── FilterOptionsDto.cs          { Pattern, IsRegex, CaseSensitive }
```

### IFileSourceProvider

The single abstraction that unifies all file access types:

```csharp
public interface IFileSourceProvider : IAsyncDisposable
{
    string SourceType { get; }  // "local" | "smb" | "agent"

    Task<FileSourceInfo> GetFileInfoAsync(string path, CancellationToken ct);

    // Streams raw bytes from fromByteOffset — fed to LineIndexBuilder
    IAsyncEnumerable<ReadOnlyMemory<byte>> ReadRawAsync(
        string path, long fromByteOffset, CancellationToken ct);

    // Reads an exact byte range — used for page reads after index is built
    Task<byte[]> ReadBytesAsync(
        string path, long from, int count, CancellationToken ct);

    // Streams newly appended bytes as they arrive
    IAsyncEnumerable<TailChunk> TailAsync(
        string path, long fromByteOffset, CancellationToken ct);

    // File browser (for UI)
    Task<IEnumerable<RemoteFileInfo>> ListFilesAsync(
        string directory, string pattern, CancellationToken ct);
}

public record TailChunk(byte[] Bytes, bool IsReset);
```

### Per-type implementation notes

**LocalOrSmbFileSourceProvider** (Type = "local" or "smb"):
- Uses `FileStream(path, Open, Read, ReadWrite|Delete)` — UNC paths (`\\server\share\file.log`) work natively with .NET's FileStream on Windows, so SMB is identical to Local at the code level
- `TailAsync`: polls with 500ms delay, compares `FileInfo.Length`, returns new bytes on change
- SMB credentials (if needed for the share): stored encrypted via `CredentialStore`, applied via Windows impersonation (`LogonUser` / `WindowsIdentity.RunImpersonated`) before opening the stream

**AgentFileSourceProvider** (Type = "agent"):
- All operations are proxied over SignalR to the remote agent
- `ReadRawAsync` / `ReadBytesAsync`: sends `RequestLines` to agent via `AgentHub`, awaits `PushRequestedLines` using a `TaskCompletionSource<T>` keyed by requestId (10s timeout)
- `TailAsync`: the agent pushes lines proactively — this method subscribes to an internal `Channel<TailChunk>` that `WatchSession.HandleAgentPush` writes to
- `GetFileInfoAsync` / `ListFilesAsync`: request/response pattern via AgentHub with 10s timeout

### Line Indexing

**LineIndex**: `List<long>` of byte offsets (one entry per line). For 200MB / ~1M lines = 8MB RAM.

**LineIndexBuilder**: scans raw bytes looking for `\n` bytes, records `position + 1` after each `\n` as the start of the next line. Scan speed ~500MB/s on SSD → a 200MB file indexes in ~400ms.

**Page reads** (after index is built):
```
GET /api/sessions/{id}/lines?from=1500000&count=200
→ lineIndex.GetOffset(1500000)  // O(1) lookup
→ provider.ReadBytesAsync(path, offset, byteCount)
→ split bytes by \n → return LineDto[]
```

**FilteredLineIndex**: `List<int>` mapping filtered line number → original line number. Built by scanning all lines for pattern matches. For server-side filter, streams through the index without loading all text into memory.

### SignalR Hubs

**AgentHub** (`/agentHub`) — `[Authorize(Policy = "AgentOnly")]` (JWT with `role=agent` claim):
- Inbound from agent: `RegisterAgent`, `PushLines`, `PushRequestedLines`, `PushFileInfo`, `PushFileList`, `PushError`
- Outbound to agent (via `Clients.Client(connectionId)`): `WatchFile`, `StopWatch`, `GetFileInfo`, `ListFiles`, `RequestLines`
- `OnDisconnectedAsync`: calls `AgentRegistry.Unregister(agentId)`, marks affected sessions as degraded

**LogHub** (`/logHub`) — `[Authorize(Policy = "UserOnly")]` (browser session):
- Inbound from browser: `OpenLog`, `CloseLog`, `RequestLines`, `SetFilter`, `ClearFilter`, `SetTail`, `SetProfile`
- Outbound to browser (via `Clients.Group(sessionId)`): `OnNewLines`, `OnReload`, `OnFileStats`, `OnIndexProgress`, `OnFilterProgress`, `OnError`

### Authentication

**Current implementation: JWT (HS256)**

Two distinct policies, two distinct token scopes — no cross-use possible:
- `AgentOnly` policy: JWT with `role=agent` claim, signed with `Jwt:AgentSecret`
- `UserOnly` policy: JWT with `role=user` claim, signed with `Jwt:UserSecret`

**Extensibility seam for future company auth (e.g. LDAP, SAML, OIDC):**

```csharp
// LogWatcher.Web/Auth/IAuthenticationProvider.cs
public interface IAuthenticationProvider
{
    string ProviderName { get; }  // "jwt", "oidc", "saml", "ldap"

    // Validates a user credential and returns a ClaimsPrincipal on success
    Task<ClaimsPrincipal?> AuthenticateUserAsync(
        HttpContext context, CancellationToken ct);

    // Adds provider-specific middleware to the pipeline
    void ConfigureServices(IServiceCollection services, IConfiguration config);
    void ConfigurePipeline(IApplicationBuilder app);
}
```

`AuthProviderFactory` reads `Auth:Provider` from `appsettings.json` (default: `"jwt"`) and resolves the correct `IAuthenticationProvider` implementation. Swapping to company auth requires only:
1. Implementing `IAuthenticationProvider` (e.g. `OidcAuthenticationProvider`)
2. Changing `Auth:Provider` in config

Agent authentication is always JWT regardless of the user auth provider — agents are machine identities, not human users.

### Server/Credentials Config

`servers.json`:
```json
[
  { "id": "srv1", "name": "DMZ App (Linux)", "host": null, "type": "agent", "agentId": "dmz-agent-01" },
  { "id": "srv2", "name": "Windows LAN", "host": "\\\\fileserver\\logs", "type": "smb" },
  { "id": "srv3", "name": "Local", "type": "local" }
]
```

`credentials.enc`: SMB passwords encrypted with `IDataProtector` (ASP.NET Core Data Protection). Never stored in plaintext. Accessed only by `CredentialStore`, never serialized to API responses.

Agent tokens: HS256 JWT signed with `Jwt:AgentSecret` from `appsettings.json`. Generated once by `POST /api/servers/{id}/agent-token`. Displayed once in the UI for copy-paste into agent's `appsettings.json`.

`appsettings.json` (backend):
```json
{
  "Auth": { "Provider": "jwt" },
  "Jwt": { "AgentSecret": "...", "UserSecret": "..." },
  "Agent": { "DefaultPort": 443 }
}
```

---

## Phase 3 — Remote Agent: LogWatcher.Agent

### NuGet packages
- `Microsoft.AspNetCore.SignalR.Client`
- `Microsoft.Extensions.Hosting.WindowsServices` (Windows Service)
- `Microsoft.Extensions.Hosting.Systemd` (Linux systemd)

### Project layout

```
LogWatcher.Agent/
├── Program.cs                      (IHostBuilder with UseWindowsService / UseSystemd)
├── appsettings.json                { BackendUrl, BackendPort, AgentId, Token, WatchDirs[] }
├── AgentWorker.cs                  (BackgroundService: connect/reconnect loop)
├── AgentHubConnection.cs           (SignalR client: handles WatchFile/StopWatch/ListFiles/RequestLines)
├── AgentFileWatcher.cs             (wraps FileWatcherCustom, emits OnLines events)
└── AgentLineIndex.cs               (per-file offset index, enables range reads)
```

### Agent behavior

1. On start: connects to `{BackendUrl}:{BackendPort}/agentHub` with `Authorization: Bearer {Token}`
   - `BackendUrl` is the full base URL (e.g. `https://logwatcher.internal`)
   - `BackendPort` overrides the URL's default port (e.g. `8443`, `443`, `5001`) — configurable per-agent deployment
2. Sends `RegisterAgent(agentId, hostname, capabilities)`
3. Receives `WatchFile(sessionId, filePath, fromOffset, encoding)`:
   - Creates `AgentFileWatcher` wrapping `FileWatcherCustom` from `Common`
   - On each `NewRows` event: calls `hub.InvokeAsync("PushLines", sessionId, lines, offsets, isInitial, false)`
   - On `ReloadLog` event: calls `hub.InvokeAsync("PushLines", sessionId, [], [], false, isReset: true)`
4. Receives `RequestLines(sessionId, startLine, count)`:
   - Uses `AgentLineIndex.GetOffset(startLine)` → seeks in file → reads `count` lines
   - Calls `hub.InvokeAsync("PushRequestedLines", sessionId, startLine, lines)`
5. On disconnect: `AgentWorker` retries with backoff (0, 2, 5, 10, 30 seconds). On reconnect, `RegisterAgent` is re-sent; backend re-sends all active `WatchFile` commands.

**Deployment:**
- Windows: `sc create LogWatcherAgent binPath= "LogWatcher.Agent.exe"` or publish as self-contained executable
- Linux: systemd unit file (`/etc/systemd/system/logwatcher-agent.service`)
- Minimum config in `appsettings.json`: `BackendUrl`, `BackendPort`, `AgentId`, `Token`
- No open inbound ports required — agent initiates outbound HTTPS to backend on the configured port

---

## Phase 4 — Frontend: React App

### NPM packages
- `@microsoft/signalr` — SignalR client
- `@tanstack/react-virtual` — virtual list (renders ~50 rows of potentially millions)
- `zustand` — state management
- `tailwindcss` — styling
- `@radix-ui/react-tabs`, `@radix-ui/react-dialog` — accessible UI primitives
- `react-colorful` — color picker for highlighting editor

### Component architecture

```
App.tsx
├── TabBar/
│   └── TabItem.tsx              (one tab per open log, shows server badge + file name)
├── LogViewer/
│   ├── LogToolbar.tsx           (filter input, highlight toggle, tail mode, profile selector)
│   ├── LogVirtualList.tsx       (TanStack Virtual container — renders only visible rows)
│   ├── LogLine.tsx              (single line: splits text into <span> segments with inline colors)
│   └── LogStatusBar.tsx         (total lines, filter matches, new-lines badge, connection status)
└── ServerManager/
    ├── ServerList.tsx            (list all servers + agent online/offline status)
    ├── ServerForm.tsx            (add/edit server: type selector, host, credentials)
    ├── FileBrowser.tsx           (tree view of remote directories per server)
    └── CredentialForm.tsx        (SMB password or agent token display)
```

### Virtual line buffer (key design)

```
Total lines known from server: 2,000,000
In-memory buffer: ~5,000 lines (sliding window around viewport)
DOM nodes rendered: ~50 (TanStack Virtual)
```

`useVirtualLines` hook:
- Knows total line count from `OnFileStats` message
- TanStack Virtual reports visible range → hook checks if those lines are in buffer
- On cache miss: `hub.invoke("RequestLines", sessionId, startLine, 300)` (prefetch 300 lines ahead/behind)
- Evicts lines far from viewport to keep memory bounded at ~5,000 lines

`useLogHub` hook:
- Connects to `/logHub` on mount
- On `OnNewLines`: appends to buffer tail; if `tailMode` is on, scrolls to bottom; otherwise shows "N new lines" badge
- On `OnReload`: clears buffer, requests fresh data from line 0 (or EOF)
- On `OnIndexProgress`: shows indexing progress bar

### Highlighting (client-side, zero server cost)

`useHighlighting(rules: Highlighting[])` hook:
- Converts ARGB ints to CSS hex: `#${(argb & 0xFFFFFF).toString(16).padStart(6, '0')}`
- `highlightLine(text: string): Segment[]` — applies rules in priority order, returns array of `{text, foreColor, backColor, bold}`
- `LogLine.tsx` renders each segment as a `<span style={{color, backgroundColor, fontWeight}}>` 
- All color computation happens in the render cycle — no API calls

### Filtering

- **Hide lines** (HiddenLine rules from profile): applied server-side when opening a session. Server builds `FilteredLineIndex` and serves only matching lines. Frontend sees a reduced `totalLines`.
- **Search filter**: user types in `LogToolbar` → debounced 300ms → `hub.invoke("SetFilter", sessionId, {pattern, isRegex, caseSensitive})` → server scans index, builds `FilteredLineIndex`, pushes `OnFilterProgress` updates → frontend replaces buffer with filtered view
- **Highlight-only mode**: filter is applied client-side on loaded lines only (marks matching lines with a highlight color, no data refetch)

---

## Implementation Phases (ordered)

| Phase | Deliverable | Prerequisite |
|---|---|---|
| 1 | Common surgery (remove System.Drawing) | — |
| 2 | Backend scaffolding: Program.cs, SignalR hubs skeleton, auth seam, local provider only | Phase 1 |
| 3 | LineIndex + LineIndexBuilder + local file page reads | Phase 2 |
| 4 | React frontend: virtual list + LogHub client + real-time local files | Phase 3 |
| 5 | Highlighting + filtering (client-side highlight, server-side filter) | Phase 4 |
| 6 | SMB provider (UNC path support + credential impersonation) | Phase 3 |
| 7 | Agent: LogWatcher.Agent project, AgentHub wiring | Phase 3 |
| 8 | Server Manager UI: add/edit servers, credential form, file browser | Phase 5 |
| 9 | Profile editor UI: highlighting rules, hidden lines, stored filters | Phase 5 |
| 10 | Alert service (reuses Common AlertManager, server-side only) | Phase 7 |

Phases 1–5 deliver a **fully working web app for local files**. Phase 6 adds SMB. Phase 7 adds agent (Linux + DMZ). Phases 8–10 add full feature parity with the WinForms app.

---

## Critical Files to Create / Modify

| File | Action |
|---|---|
| `Common/Highlighting.cs` | Remove `System.Drawing` import, delete `Color` properties |
| `Common/HiddenLine.cs` | Replace `ConfigurationManager` with ctor parameter |
| `LogWatcher.Web/Auth/IAuthenticationProvider.cs` | New — extensibility seam for company auth |
| `LogWatcher.Web/Auth/JwtAuthenticationProvider.cs` | New — current JWT implementation |
| `LogWatcher.Web/Sources/IFileSourceProvider.cs` | New — core abstraction |
| `LogWatcher.Web/Sources/LocalOrSmbFileSourceProvider.cs` | New — wraps FileStream (local + UNC) |
| `LogWatcher.Web/Sources/AgentFileSourceProvider.cs` | New — proxies to agent |
| `LogWatcher.Web/Indexing/LineIndex.cs` | New — `List<long>` with lock |
| `LogWatcher.Web/Indexing/LineIndexBuilder.cs` | New — `\n` byte scanner |
| `LogWatcher.Web/Hubs/LogHub.cs` | New — browser ↔ backend |
| `LogWatcher.Web/Hubs/AgentHub.cs` | New — agent ↔ backend |
| `LogWatcher.Web/Sessions/WatchSession.cs` | New — per-file state |
| `LogWatcher.Agent/AgentHubConnection.cs` | New — SignalR client with configurable port |
| `LogWatcher.Agent/AgentFileWatcher.cs` | New — wraps FileWatcherCustom |
| `logwatcher-frontend/src/hooks/useVirtualLines.ts` | New — buffer + fetch logic |
| `logwatcher-frontend/src/components/LogViewer/LogVirtualList.tsx` | New — TanStack Virtual |

---

## Verification

1. **Local file**: open a 200MB log file → index progress bar appears → initial last-500-lines load in <200ms → scroll to top loads chunks on demand with no jank → tail new lines appear within 200ms
2. **SMB**: point to a UNC path (`\\server\share\app.log`) → behaves identically to local; test with Windows LAN share requiring credentials
3. **Agent (Windows)**: install agent on a Windows test server → configure backend with agent's entry → copy JWT token to agent's `appsettings.json` → agent appears online in Server Manager → open file → real-time updates via WebSocket
4. **Agent (Linux)**: same as above but agent runs as systemd service; confirm `BackendPort` is honoured (test on a non-443 port)
5. **DMZ simulation**: block all inbound connections to agent host; confirm agent connects outbound to backend on the configured port → file stream works
6. **Large file scroll**: open 200MB file → scroll from end to line 0 → no OOM, browser memory stays bounded → highlight rules applied to all visible lines
7. **Filter**: apply regex filter → progress indicator shows → result shows only matching lines → clear filter restores full view
8. **Auth extensibility**: verify `Auth:Provider` config key is read at startup and that adding a second `IAuthenticationProvider` implementation doesn't require changes to hubs or sessions
