using LogWatcher.Web.Config;
using LogWatcher.Web.Dto;
using LogWatcher.Web.Services;
using LogWatcher.Web.Sessions;
using LogWatcher.Web.Sources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace LogWatcher.Web.Hubs
{
    /// <summary>
    /// Browser ↔ Backend hub.
    /// Clients authenticate with UserJwt (role=user).
    ///
    /// Inbound (browser → server):
    ///   OpenLog, CloseLog, RequestLines, SetFilter, ClearFilter, SetTail, SetProfile,
    ///   BrowseRoot
    ///
    /// Outbound (server → browser group):
    ///   OnNewLines, OnReload, OnFileStats, OnIndexProgress, OnFilterProgress, OnError
    /// </summary>
    [Authorize(Policy = "UserOnly")]
    public class LogHub : Hub
    {
        private readonly WatchSessionManager _sessions;
        private readonly ServerConfigRepository _serverConfig;
        private readonly CredentialStore _credentials;
        private readonly IAgentRegistry _agentRegistry;

        public LogHub(WatchSessionManager sessions, ServerConfigRepository serverConfig,
            CredentialStore credentials, IAgentRegistry agentRegistry)
        {
            _sessions = sessions;
            _serverConfig = serverConfig;
            _credentials = credentials;
            _agentRegistry = agentRegistry;
        }

        public async Task OpenLog(string sessionId, string serverId, string filePath, OpenLogOptionsDto options)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            await _sessions.OpenAsync(sessionId, serverId, filePath, options, Context.ConnectionId);
        }

        public async Task CloseLog(string sessionId)
        {
            _sessions.Close(sessionId, Context.ConnectionId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
        }

        public Task RequestLines(string sessionId, int startLine, int count)
            => _sessions.ServePageAsync(sessionId, startLine, count, Context.ConnectionId);

        public Task SetFilter(string sessionId, FilterOptionsDto filter)
            => _sessions.ApplyFilterAsync(sessionId, filter);

        public Task ClearFilter(string sessionId)
            => _sessions.ClearFilterAsync(sessionId);

        public Task SetTail(string sessionId, bool tail)
            => _sessions.SetTailAsync(sessionId, tail);

        public Task SetProfile(string sessionId, string profileName)
            => _sessions.SetProfileAsync(sessionId, profileName);

        public Task<ContextLinesDto> GetContextLines(string sessionId, int selectedLine, int radius)
            => _sessions.GetContextLinesAsync(sessionId, selectedLine, radius);

        /// <summary>
        /// <summary>
        /// Returns a merged directory listing from all servers in the given root folder.
        /// subpath = "" means list at the server's Host root.
        /// </summary>
        public async Task<RemoteFileInfoDto[]> BrowseRoot(
            string perimeterId, string rootFolderName, string subpath)
        {
            var servers = _serverConfig.GetServersInRoot(perimeterId, rootFolderName);
            var results = new List<RemoteFileInfoDto>();

            foreach (var server in servers)
            {
                IFileSourceProvider provider = server.Type switch
                {
                    "smb" => new LocalOrSmbFileSourceProvider(server, _credentials),
                    "agent" => new AgentFileSourceProvider(server, _agentRegistry),
                    _ => null
                };
                if (provider == null) continue;

                try
                {
                    var basePath = server.Host ?? string.Empty;
                    var dirPath = string.IsNullOrEmpty(subpath)
                        ? basePath
                        : Path.Combine(basePath, subpath).Replace('\\', '/');

                    var items = (await provider.ListFilesAsync(dirPath, "*", CancellationToken.None)).ToList();
                    foreach (var item in items)
                    {
                        item.ServerId = server.Id;
                        item.SourceName = server.Name;
                    }
                    results.AddRange(items);
                }
                catch { /* skip unreachable servers */ }
                finally
                {
                    await provider.DisposeAsync();
                }
            }

            // Directories: keep all non-empty (from all servers — no dedup, to allow showing same-named
            // folders from different sources). Files: deduplicate by name (keep first = highest-priority server).
            var dirs = results
                .Where(f => f.IsDirectory && f.HasChildren)
                .ToList();

            var files = results
                .Where(f => !f.IsDirectory)
                .GroupBy(f => Path.GetFileName(f.Path), StringComparer.OrdinalIgnoreCase)
                .Select(g => g.First())
                .ToList();

            return dirs.Concat(files)
                .OrderBy(f => !f.IsDirectory)  // directories first
                .ThenBy(f => Path.GetFileName(f.Path), StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _sessions.OnClientDisconnected(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Searches file content within a directory for lines matching <paramref name="contentPattern"/>.
        /// Only files whose names match <paramref name="nameFilter"/> (if non-empty) are searched.
        /// Sends progress updates via OnSearchProgress(scanned, total) and returns matching files.
        /// </summary>
        public async Task<RemoteFileInfoDto[]> SearchFileContent(
            string perimeterId, string rootFolderName, string subpath,
            string nameFilter, string contentPattern, bool isRegex)
        {
            var servers = _serverConfig.GetServersInRoot(perimeterId, rootFolderName);
            var matches = new List<RemoteFileInfoDto>();
            var nameSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            System.Text.RegularExpressions.Regex regex = null;
            if (isRegex && !string.IsNullOrWhiteSpace(contentPattern))
            {
                try { regex = new System.Text.RegularExpressions.Regex(contentPattern, System.Text.RegularExpressions.RegexOptions.None); }
                catch { regex = null; }
            }

            // For agent servers, delegate search to agent to avoid full file transfer.
            // For SMB servers, collect files and scan individually.
            var localFiles = new List<(RemoteFileInfoDto File, IFileSourceProvider Provider)>();
            var agentProviders = new List<IFileSourceProvider>();

            foreach (var server in servers)
            {
                IFileSourceProvider provider = server.Type switch
                {
                    "smb" => new LocalOrSmbFileSourceProvider(server, _credentials),
                    "agent" => new AgentFileSourceProvider(server, _agentRegistry),
                    _ => null
                };
                if (provider == null) continue;

                var basePath = server.Host ?? string.Empty;
                var dirPath = string.IsNullOrEmpty(subpath)
                    ? basePath
                    : Path.Combine(basePath, subpath).Replace('\\', '/');

                try
                {
                    // If provider supports remote search (agent), delegate entirely
                    var remotePaths = await provider.SearchFilesAsync(dirPath, nameFilter, contentPattern, isRegex, CancellationToken.None);
                    if (remotePaths != null)
                    {
                        agentProviders.Add(provider);
                        foreach (var path in remotePaths)
                        {
                            var fname = Path.GetFileName(path);
                            if (nameSet.Add(fname))
                                matches.Add(new RemoteFileInfoDto
                                {
                                    Path = path,
                                    IsDirectory = false,
                                    ServerId = server.Id,
                                    SourceName = server.Name,
                                    LastModified = DateTimeOffset.UtcNow,
                                });
                        }
                        continue;
                    }

                    // Local/SMB: collect candidate files for per-file scan
                    var items = (await provider.ListFilesAsync(dirPath, "*", CancellationToken.None)).ToList();
                    foreach (var item in items) { item.ServerId = server.Id; item.SourceName = server.Name; }
                    var candidates = items.Where(i => !i.IsDirectory).ToList();
                    if (!string.IsNullOrWhiteSpace(nameFilter))
                        candidates = candidates.Where(f =>
                            Path.GetFileName(f.Path).Contains(nameFilter, StringComparison.OrdinalIgnoreCase)).ToList();
                    localFiles.AddRange(candidates.Select(f => (f, provider)));
                }
                catch { /* skip unreachable servers */ }
            }

            int total = localFiles.Count;
            int scanned = 0;
            await Clients.Caller.SendAsync("OnSearchProgress", 0, total);

            foreach (var (file, provider) in localFiles)
            {
                try
                {
                    var found = await FileContainsPatternAsync(provider, file.Path, contentPattern, regex);
                    if (found)
                    {
                        var fname = Path.GetFileName(file.Path);
                        if (nameSet.Add(fname))
                            matches.Add(file);
                    }
                }
                catch { /* skip unreadable files */ }
                finally
                {
                    scanned++;
                    if (scanned % 5 == 0 || scanned == total)
                        await Clients.Caller.SendAsync("OnSearchProgress", scanned, total);
                }
            }

            foreach (var (_, provider) in localFiles.GroupBy(x => x.Provider).Select(g => g.First()))
                await provider.DisposeAsync();
            foreach (var provider in agentProviders)
                await provider.DisposeAsync();

            return matches
                .OrderBy(f => f.LastModified)
                .ToArray();
        }

        private static async Task<bool> FileContainsPatternAsync(
            IFileSourceProvider provider, string path, string pattern,
            System.Text.RegularExpressions.Regex regex)
        {
            if (string.IsNullOrWhiteSpace(pattern)) return false;

            const int MaxBytes = 8 * 1024 * 1024; // cap at 8 MB per file
            long totalRead = 0;
            var leftover = string.Empty;

            await foreach (var chunk in provider.ReadRawAsync(path, 0, CancellationToken.None))
            {
                var text = System.Text.Encoding.UTF8.GetString(chunk.Span);
                var combined = leftover + text;

                if (regex != null)
                {
                    if (regex.IsMatch(combined)) return true;
                }
                else
                {
                    if (combined.Contains(pattern, StringComparison.OrdinalIgnoreCase)) return true;
                }

                // Keep last few chars as leftover to handle matches split across chunks
                leftover = combined.Length > 512 ? combined[^512..] : combined;

                totalRead += chunk.Length;
                if (totalRead >= MaxBytes) break;
            }

            return false;
        }
    }
}
