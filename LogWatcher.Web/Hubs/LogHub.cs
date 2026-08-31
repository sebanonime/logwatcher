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
                    if (!server.ShowArchives)
                        items = items.Where(i => !i.IsArchive).ToList();
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
        /// Opens a "search results" tab: scans matching files in the background for lines matching
        /// <paramref name="contentPattern"/> and streams them to the caller through the normal
        /// OnFileStats/OnLines paging surface, as if they were a single virtual log file.
        /// Only files whose names match <paramref name="nameFilter"/> (if non-empty) are searched.
        /// </summary>
        public async Task OpenSearchResults(
            string sessionId, string perimeterId, string rootFolderName, string subpath,
            string nameFilter, string contentPattern, bool isRegex)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            await _sessions.OpenSearchResultsAsync(
                sessionId, perimeterId, rootFolderName, subpath, nameFilter, contentPattern, isRegex, Context.ConnectionId);
        }

        public async Task RequestFileStats(string sessionId)
        {
            // On récupère la session via le gestionnaire injecté (_sessions)
            var session = _sessions.GetSession(sessionId);
            
            if (session != null)
            {
                await session.SendCurrentStatsAsync();
            }
        }
    }
}
