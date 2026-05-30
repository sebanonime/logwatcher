using LogWatcher.Web.Config;
using LogWatcher.Web.Dto;
using LogWatcher.Web.Hubs;
using LogWatcher.Web.Services;
using LogWatcher.Web.Sources;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace LogWatcher.Web.Sessions
{
    /// <summary>
    /// Creates, routes, and destroys WatchSession instances.
    /// One session = one open log file tab in the browser.
    /// </summary>
    public class WatchSessionManager
    {
        private readonly ConcurrentDictionary<string, WatchSession> _sessions = new();
        // Tracks which connections belong to which sessions (for cleanup on disconnect)
        private readonly ConcurrentDictionary<string, HashSet<string>> _connectionSessions = new();
        private readonly IHubContext<LogHub> _logHub;
        private readonly ServerConfigRepository _servers;
        private readonly CredentialStore _credentials;
        private readonly IAgentRegistry _agentRegistry;
        private readonly ProfileRepository _profiles;

        public WatchSessionManager(
            IHubContext<LogHub> logHub,
            ServerConfigRepository servers,
            CredentialStore credentials,
            IAgentRegistry agentRegistry,
            ProfileRepository profiles)
        {
            _logHub = logHub;
            _servers = servers;
            _credentials = credentials;
            _agentRegistry = agentRegistry;
            _profiles = profiles;
        }

        public async Task OpenAsync(string sessionId, string serverId, string filePath,
            OpenLogOptionsDto options, string connectionId)
        {
            // Reuse existing session if already open (multi-viewer scenario)
            if (_sessions.TryGetValue(sessionId, out _))
            {
                TrackConnection(connectionId, sessionId);
                return;
            }

            var server = _servers.GetById(serverId);
            if (server == null)
            {
                await _logHub.Clients.Client(connectionId)
                    .SendAsync("OnError", sessionId, $"Server '{serverId}' not found.");
                return;
            }

            IFileSourceProvider provider = server.Type switch
            {
                "smb" => new LocalOrSmbFileSourceProvider(server, _credentials),
                "agent" => new AgentFileSourceProvider(server, _agentRegistry, sessionId),
                _ => null
            };

            if (provider == null)
            {
                await _logHub.Clients.Client(connectionId)
                    .SendAsync("OnError", sessionId, $"Unknown server type '{server.Type}'.");
                return;
            }

            var session = new WatchSession(sessionId, serverId, filePath, provider, _logHub, options, connectionId);
            if (_sessions.TryAdd(sessionId, session))
            {
                TrackConnection(connectionId, sessionId);
                // Run watch loop in background so OpenLog returns immediately.
                _ = session.StartAsync();
            }
        }

        public void Close(string sessionId, string connectionId)
        {
            UntrackConnection(connectionId, sessionId);
            // Only fully close the session when no connections remain
            if (!HasActiveConnections(sessionId))
                RemoveSession(sessionId);
        }

        public async Task ServePageAsync(string sessionId, int startLine, int count, string connectionId)
        {
            if (!_sessions.TryGetValue(sessionId, out var session)) return;
            var lines = await session.ReadFilteredLinesAsync(startLine, count);
            await _logHub.Clients.Client(connectionId)
                .SendAsync("OnLines", sessionId, startLine, lines, session.ViewVersion);
        }

        public async Task ApplyFilterAsync(string sessionId, FilterOptionsDto filter)
        {
            if (_sessions.TryGetValue(sessionId, out var session))
                await session.ApplyFilterAsync(filter);
        }

        public async Task ClearFilterAsync(string sessionId)
        {
            if (_sessions.TryGetValue(sessionId, out var session))
                await session.ClearFilterAsync();
        }

        public async Task<ContextLinesDto> GetContextLinesAsync(string sessionId, int selectedLine, int radius)
        {
            if (!_sessions.TryGetValue(sessionId, out var session))
                return new ContextLinesDto();

            return await session.ReadContextLinesAsync(selectedLine, radius);
        }

        public Task SetTailAsync(string sessionId, bool tail)
        {
            if (_sessions.TryGetValue(sessionId, out var session))
                session.SetTail(tail);
            return Task.CompletedTask;
        }

        public Task SetProfileAsync(string sessionId, string profileName)
        {
            if (!_sessions.TryGetValue(sessionId, out var session))
                return Task.CompletedTask;

            if (string.IsNullOrWhiteSpace(profileName))
            {
                session.SetHiddenLines(Array.Empty<HiddenLinePattern>());
                return Task.CompletedTask;
            }

            var profile = _profiles.Get(profileName);
            var hiddenLines = profile?.DicoHiddenLog
                ?.Where(hidden => hidden != null)
                .Select(hidden => new HiddenLinePattern
                {
                    Text = hidden.Text ?? string.Empty,
                    IsRegex = hidden.IsRegex,
                    CaseSensitive = hidden.CaseSensitive,
                    IsActive = hidden.IsActif,
                })
                .ToList() ?? new List<HiddenLinePattern>();

            session.SetHiddenLines(hiddenLines);
            return Task.CompletedTask;
        }

        public void OnClientDisconnected(string connectionId)
        {
            if (_connectionSessions.TryGetValue(connectionId, out var sessions))
            {
                foreach (var sid in sessions.ToList())
                    Close(sid, connectionId);
                _connectionSessions.TryRemove(connectionId, out _);
            }
        }

        public async Task HandleAgentPushAsync(string sessionId, string[] lines, long[] offsets,
            bool isInitialLoad, bool isReset)
        {
            if (_sessions.TryGetValue(sessionId, out var session))
                await session.HandleAgentPushAsync(lines, offsets, isInitialLoad, isReset);
        }

        public Task HandleAgentPageAsync(string sessionId, int startLine, string[] lines)
        {
            var key = $"{sessionId}:{startLine}";
            return _agentRegistry.CompletePageRequestAsync(key, lines);
        }

        public Task HandleAgentErrorAsync(string sessionId, string error)
            => _logHub.Clients.Group(sessionId).SendAsync("OnError", sessionId, error);

        public void OnAgentReconnected(string agentId)
        {
            // Re-send WatchFile to all sessions that use this agent
            foreach (var session in _sessions.Values)
            {
                if (session.ServerId == agentId)
                    _ = session.StartAsync(); // Restart tail from last known position
            }
        }

        private void RemoveSession(string sessionId)
        {
            if (_sessions.TryRemove(sessionId, out var session))
                _ = session.DisposeAsync().AsTask();
        }

        private void TrackConnection(string connectionId, string sessionId)
        {
            _connectionSessions.GetOrAdd(connectionId, _ => new HashSet<string>()).Add(sessionId);
        }

        private void UntrackConnection(string connectionId, string sessionId)
        {
            if (_connectionSessions.TryGetValue(connectionId, out var set))
                set.Remove(sessionId);
        }

        private bool HasActiveConnections(string sessionId) =>
            _connectionSessions.Values.Any(s => s.Contains(sessionId));
    }
}
