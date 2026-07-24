using Grpc.Core;
using Grpc.Net.Client;
using LogWatcher.Grpc;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Security;
using System.Text;
using System.Text.RegularExpressions;

namespace LogWatcher.Agent;

/// <summary>
/// Manages the gRPC connection to the backend AgentGateway.
/// Replaces AgentHubConnection (SignalR).
/// </summary>
public class AgentGrpcClient : IAsyncDisposable
{
    private readonly IConfiguration _config;
    private readonly AgentLineIndex _lineIndex;
    private readonly ILogger<AgentGrpcClient> _log;

    private GrpcChannel? _channel;
    private AsyncDuplexStreamingCall<AgentMessage, BackendMessage>? _call;

    // sessionId → AgentFileWatcher
    private readonly ConcurrentDictionary<string, AgentFileWatcher> _watchers = new();

    // Writer lock: WriteAsync is not thread-safe
    private readonly SemaphoreSlim _writeLock = new(1, 1);

    public AgentGrpcClient(IConfiguration config, AgentLineIndex lineIndex, ILogger<AgentGrpcClient> log)
    {
        _config = config;
        _lineIndex = lineIndex;
        _log = log;
    }

    public async Task StartAsync(CancellationToken ct)
    {
        string backendUrl = _config["Agent:BackendGrpcUrl"] ?? "https://localhost";
        int port = _config.GetValue<int>("Agent:BackendGrpcPort", 5005);
        string token = _config["Agent:Token"] ?? throw new InvalidOperationException("Agent:Token not configured.");
        string agentId = _config["Agent:AgentId"] ?? Environment.MachineName;

        var uri = new UriBuilder(backendUrl) { Port = port }.Uri;
        bool insecure = uri.Scheme == Uri.UriSchemeHttp;

        // Diagnostics: this is logged BEFORE attempting the connection so a misconfigured
        // BackendGrpcUrl (e.g. left at the default "http://localhost" when the agent runs on a
        // remote server) is immediately visible in the agent's own log, instead of only showing
        // up indirectly as "no lines displayed" on the frontend.
        _log.LogInformation(
            "Connecting to backend gRPC at {Uri} as AgentId={AgentId} (insecure={Insecure})",
            uri, agentId, insecure);

        // HTTP/2 keepalive: without this, a long-lived, mostly-idle duplex stream (agent → backend)
        // can be silently dropped by NAT/firewalls on a real network even though it works fine over
        // loopback. SocketsHttpHandler is used (instead of plain HttpClientHandler) specifically so
        // KeepAlivePingDelay/Timeout are available on both the insecure and TLS branches.
        var socketsHandler = new SocketsHttpHandler
        {
            PooledConnectionIdleTimeout = Timeout.InfiniteTimeSpan,
            KeepAlivePingDelay = TimeSpan.FromSeconds(30),
            KeepAlivePingTimeout = TimeSpan.FromSeconds(20),
            KeepAlivePingPolicy = HttpKeepAlivePingPolicy.WithActiveRequests,
            EnableMultipleHttp2Connections = true,
        };

        GrpcChannelOptions channelOptions;
        if (insecure)
        {
            // HTTP/2 cleartext — inject token via HttpClient default header
            var httpClient = new HttpClient(socketsHandler) { Timeout = Timeout.InfiniteTimeSpan, DefaultRequestHeaders = { Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token) } };
            channelOptions = new GrpcChannelOptions
            {
                HttpClient = httpClient,
                Credentials = ChannelCredentials.Insecure,
            };
        }
        else
        {
            socketsHandler.SslOptions = new SslClientAuthenticationOptions
            {
                RemoteCertificateValidationCallback = (_, _, _, _) => true,
            };
            channelOptions = new GrpcChannelOptions
            {
                HttpHandler = socketsHandler,
                Credentials = ChannelCredentials.Create(
                    new SslCredentials(),
                    CallCredentials.FromInterceptor((context, metadata) =>
                    {
                        metadata.Add("authorization", $"Bearer {token}");
                        return Task.CompletedTask;
                    }))
            };
        }

        _channel = GrpcChannel.ForAddress(uri, channelOptions);

        var client = new AgentGateway.AgentGatewayClient(_channel);
        _call = client.Connect(cancellationToken: ct);

        // Register with backend
        await SendAsync(new AgentMessage
        {
            Register = new RegisterMsg
            {
                AgentId = agentId,
                Hostname = Environment.MachineName,
                Capabilities = { "file-watch", "file-list", "file-read", "filter", "search" }
            }
        }, ct);

        _log.LogInformation("Connected to backend gRPC as {AgentId}", agentId);

        // Read commands from backend
        await foreach (var cmd in _call.ResponseStream.ReadAllAsync(ct))
            await HandleCommandAsync(cmd, ct);
    }

    private async Task HandleCommandAsync(BackendMessage cmd, CancellationToken ct)
    {
        switch (cmd.PayloadCase)
        {
            case BackendMessage.PayloadOneofCase.WatchFile:
                OnWatchFile(cmd.WatchFile);
                break;
            case BackendMessage.PayloadOneofCase.StopWatch:
                OnStopWatch(cmd.StopWatch.SessionId);
                break;
            case BackendMessage.PayloadOneofCase.GetFileInfo:
                await OnGetFileInfoAsync(cmd.GetFileInfo, ct);
                break;
            case BackendMessage.PayloadOneofCase.ListFiles:
                await OnListFilesAsync(cmd.ListFiles, ct);
                break;
            case BackendMessage.PayloadOneofCase.RequestLines:
                await OnRequestLinesAsync(cmd.RequestLines, ct);
                break;
            case BackendMessage.PayloadOneofCase.BuildFilter:
                await OnBuildFilterAsync(cmd.BuildFilter, ct);
                break;
            case BackendMessage.PayloadOneofCase.SearchFiles:
                await OnSearchFilesAsync(cmd.SearchFiles, ct);
                break;
        }
    }

    private void OnWatchFile(WatchFileCmd cmd)
    {
        // Diagnostics: confirm (a) the command was actually received by this agent, and (b) whether
        // the requested path even exists as seen by THIS process — useful when the frontend browsed
        // a path via one code path (ListFiles) and watching fails via another (WatchFile), since a
        // path/drive/permission mismatch would show up here first.
        bool exists = File.Exists(cmd.FilePath);
        _log.LogInformation(
            "WatchFile: session={SessionId} path={Path} fromOffset={FromOffset} existsOnAgent={Exists}",
            cmd.SessionId, cmd.FilePath, cmd.FromOffset, exists);
        if (!exists)
            _log.LogWarning("WatchFile: path {Path} not found on this agent's filesystem for session {SessionId}.", cmd.FilePath, cmd.SessionId);

        if (_watchers.TryRemove(cmd.SessionId, out var old))
            old.Dispose();

        var watcher = new AgentFileWatcher(cmd.SessionId, cmd.FilePath, cmd.FromOffset, cmd.Encoding, _lineIndex, _log);
        watcher.LinesReady += async (sid, lines, offsets, isInitial, isReset) =>
        {
            var msg = new AgentMessage
            {
                PushLines = new PushLinesMsg
                {
                    SessionId = sid,
                    IsInitialLoad = isInitial,
                    IsReset = isReset,
                }
            };
            msg.PushLines.Lines.AddRange(lines);
            msg.PushLines.Offsets.AddRange(offsets);
            try
            {
                await SendAsync(msg, CancellationToken.None);
                _log.LogDebug(
                    "PushLines sent: session={SessionId} count={Count} isInitial={IsInitial} isReset={IsReset}",
                    sid, lines.Length, isInitial, isReset);
            }
            catch (Exception ex)
            {
                // Most likely cause: the gRPC stream to the backend dropped (network hiccup, NAT
                // idle-timeout, backend restart) — lines were read locally but never reached the
                // backend, which is exactly the "no lines displayed" symptom on the frontend.
                _log.LogError(ex, "Failed to push {Count} line(s) to backend for session={SessionId} — connection to backend may be down.", lines.Length, sid);
            }
        };

        _watchers[cmd.SessionId] = watcher;
        watcher.Start();
    }

    private void OnStopWatch(string sessionId)
    {
        _log.LogInformation("StopWatch: {SessionId}", sessionId);
        if (_watchers.TryRemove(sessionId, out var watcher))
            watcher.Dispose();
        _lineIndex.RemoveSession(sessionId);
    }

    private async Task OnGetFileInfoAsync(GetFileInfoCmd cmd, CancellationToken ct)
    {
        try
        {
            var info = new FileInfo(cmd.FilePath);
            await SendAsync(new AgentMessage
            {
                PushFileInfo = new PushFileInfoMsg
                {
                    RequestId = cmd.RequestId,
                    Exists = info.Exists,
                    SizeBytes = info.Exists ? info.Length : 0L,
                }
            }, ct);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "GetFileInfo failed for {Path}", cmd.FilePath);
            await SendAsync(new AgentMessage
            {
                PushError = new PushErrorMsg { SessionId = cmd.RequestId, Message = ex.Message }
            }, ct);
        }
    }

    private async Task OnListFilesAsync(ListFilesCmd cmd, CancellationToken ct)
    {
        try
        {
            _log.LogInformation("ListFiles: {Dir}", cmd.Directory);
            var result = new PushFileListMsg { RequestId = cmd.RequestId };
            if (Directory.Exists(cmd.Directory))
            {
                foreach (var f in Directory.GetFiles(cmd.Directory))
                {
                    var fi = new FileInfo(f);
                    result.Files.Add(new FileEntry
                    {
                        Path = f,
                        IsDirectory = false,
                        SizeBytes = fi.Length,
                        LastModified = fi.LastWriteTimeUtc.ToString("o"),
                        HasChildren = false,
                    });
                }
                foreach (var d in Directory.GetDirectories(cmd.Directory))
                {
                    result.Files.Add(new FileEntry
                    {
                        Path = d,
                        IsDirectory = true,
                        SizeBytes = 0,
                        HasChildren = Directory.EnumerateFileSystemEntries(d).Any(),
                    });
                }
            }
            await SendAsync(new AgentMessage { PushFileList = result }, ct);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "ListFiles failed for {Dir}", cmd.Directory);
            await SendAsync(new AgentMessage
            {
                PushError = new PushErrorMsg { SessionId = cmd.RequestId, Message = ex.Message }
            }, ct);
        }
    }

    private async Task OnRequestLinesAsync(RequestLinesCmd cmd, CancellationToken ct)
    {
        try
        {
            var filePath = _lineIndex.GetFilePath(cmd.SessionId);
            if (filePath == null) return;
            var lines = _lineIndex.ReadLines(cmd.SessionId, filePath, cmd.StartLine, cmd.Count);
            var msg = new AgentMessage
            {
                PushRequested = new PushRequestedLines
                {
                    SessionId = cmd.SessionId,
                    StartLine = cmd.StartLine,
                }
            };
            msg.PushRequested.Lines.AddRange(lines);
            await SendAsync(msg, ct);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "RequestLines failed for session {SessionId}", cmd.SessionId);
        }
    }

    private async Task OnBuildFilterAsync(BuildFilterCmd cmd, CancellationToken ct)
    {
        try
        {
            var filePath = _lineIndex.GetFilePath(cmd.SessionId);
            if (filePath == null)
            {
                await SendFilterResult(cmd.RequestId, cmd.SessionId, Array.Empty<int>(), ct);
                return;
            }

            var matchingLines = BuildFilter(filePath, cmd);
            await SendFilterResult(cmd.RequestId, cmd.SessionId, matchingLines, ct);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "BuildFilter failed for session {SessionId}", cmd.SessionId);
            await SendFilterResult(cmd.RequestId, cmd.SessionId, Array.Empty<int>(), ct);
        }
    }

    private static int[] BuildFilter(string filePath, BuildFilterCmd cmd)
    {
        var pattern = cmd.Pattern ?? string.Empty;
        Regex? patternRegex = null;
        if (cmd.IsRegex && !string.IsNullOrEmpty(pattern))
        {
            var ropts = cmd.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
            patternRegex = new Regex(pattern, ropts | RegexOptions.Compiled);
        }

        var hiddenRegexes = cmd.HiddenRules
            .Where(h => h.IsActive && !string.IsNullOrWhiteSpace(h.Text) && h.IsRegex)
            .Select(h => new Regex(h.Text, (h.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase) | RegexOptions.Compiled))
            .ToList();
        var hiddenPlain = cmd.HiddenRules
            .Where(h => h.IsActive && !string.IsNullOrWhiteSpace(h.Text) && !h.IsRegex)
            .ToList();

        var result = new List<int>();
        int lineNumber = 0;

        using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite | FileShare.Delete);
        using var reader = new StreamReader(fs, new UTF8Encoding(false), true, 65536);

        string? line;
        while ((line = reader.ReadLine()) != null)
        {
            bool matches = string.IsNullOrEmpty(pattern) ||
                (patternRegex != null
                    ? patternRegex.IsMatch(line)
                    : cmd.CaseSensitive
                        ? line.Contains(pattern)
                        : line.Contains(pattern, StringComparison.OrdinalIgnoreCase));

            if (matches && !IsHidden(line, hiddenPlain, hiddenRegexes, cmd.HiddenRules))
                result.Add(lineNumber);

            lineNumber++;
        }

        return result.ToArray();
    }

    private static bool IsHidden(string text,
        IList<HiddenLineRule> plainRules,
        IList<Regex> regexRules,
        Google.Protobuf.Collections.RepeatedField<HiddenLineRule> allRules)
    {
        foreach (var rx in regexRules)
            if (rx.IsMatch(text)) return true;
        foreach (var rule in plainRules)
        {
            if (rule.CaseSensitive ? text.Contains(rule.Text) : text.Contains(rule.Text, StringComparison.OrdinalIgnoreCase))
                return true;
        }
        return false;
    }

    private async Task SendFilterResult(string requestId, string sessionId, int[] lines, CancellationToken ct)
    {
        var msg = new AgentMessage
        {
            PushFilter = new PushFilterResultMsg
            {
                RequestId = requestId,
                SessionId = sessionId,
            }
        };
        msg.PushFilter.MatchingLines.AddRange(lines);
        await SendAsync(msg, ct);
    }

    private async Task OnSearchFilesAsync(SearchFilesCmd cmd, CancellationToken ct)
    {
        try
        {
            var matchingPaths = new List<string>();
            if (Directory.Exists(cmd.Directory))
            {
                Regex? patternRegex = null;
                if (cmd.IsRegex && !string.IsNullOrWhiteSpace(cmd.Pattern))
                {
                    try { patternRegex = new Regex(cmd.Pattern, RegexOptions.IgnoreCase | RegexOptions.Compiled); }
                    catch { /* invalid regex — treat as plain */ }
                }

                foreach (var filePath in Directory.EnumerateFiles(cmd.Directory, "*", SearchOption.AllDirectories))
                {
                    if (!string.IsNullOrWhiteSpace(cmd.NameFilter) &&
                        !Path.GetFileName(filePath).Contains(cmd.NameFilter, StringComparison.OrdinalIgnoreCase))
                        continue;

                    if (await FileContainsAsync(filePath, cmd.Pattern, patternRegex))
                        matchingPaths.Add(filePath);
                }
            }

            var msg = new AgentMessage
            {
                PushSearch = new PushSearchResultMsg { RequestId = cmd.RequestId }
            };
            msg.PushSearch.MatchingPaths.AddRange(matchingPaths);
            await SendAsync(msg, ct);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "SearchFiles failed for {Dir}", cmd.Directory);
            await SendAsync(new AgentMessage
            {
                PushSearch = new PushSearchResultMsg { RequestId = cmd.RequestId }
            }, ct);
        }
    }

    private static async Task<bool> FileContainsAsync(string path, string pattern, Regex? patternRegex)
    {
        if (string.IsNullOrWhiteSpace(pattern)) return false;
        const int MaxBytes = 8 * 1024 * 1024;
        try
        {
            using var fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite | FileShare.Delete);
            var buf = new byte[Math.Min(MaxBytes, fs.Length > 0 ? (int)fs.Length : 65536)];
            int read = await fs.ReadAsync(buf.AsMemory(0, buf.Length));
            var text = Encoding.UTF8.GetString(buf, 0, read);
            return patternRegex != null
                ? patternRegex.IsMatch(text)
                : text.Contains(pattern, StringComparison.OrdinalIgnoreCase);
        }
        catch { return false; }
    }

    private async Task SendAsync(AgentMessage msg, CancellationToken ct)
    {
        if (_call == null) return;
        await _writeLock.WaitAsync(ct);
        try
        {
            await _call.RequestStream.WriteAsync(msg, ct);
        }
        finally
        {
            _writeLock.Release();
        }
    }

    public async ValueTask DisposeAsync()
    {
        foreach (var w in _watchers.Values)
            w.Dispose();
        _watchers.Clear();

        if (_call != null)
        {
            try { await _call.RequestStream.CompleteAsync(); } catch { }
            _call.Dispose();
        }

        if (_channel != null)
            await _channel.ShutdownAsync();
    }
}
