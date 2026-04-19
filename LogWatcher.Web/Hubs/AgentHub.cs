using LogWatcher.Web.Dto;
using LogWatcher.Web.Services;
using LogWatcher.Web.Sessions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace LogWatcher.Web.Hubs
{
    /// <summary>
    /// Agent ↔ Backend hub.
    /// Agents authenticate with AgentJwt (role=agent).
    /// Completely separate from LogHub — a browser session cannot connect here.
    ///
    /// Inbound (agent → server):
    ///   RegisterAgent, PushLines, PushRequestedLines, PushFileInfo, PushFileList, PushError
    ///
    /// Outbound (server → agent, via Clients.Client(connectionId)):
    ///   WatchFile, StopWatch, GetFileInfo, ListFiles, RequestLines
    /// </summary>
    [Authorize(Policy = "AgentOnly")]
    public class AgentHub : Hub
    {
        private readonly IAgentRegistry _registry;
        private readonly WatchSessionManager _sessions;

        public AgentHub(IAgentRegistry registry, WatchSessionManager sessions)
        {
            _registry = registry;
            _sessions = sessions;
        }

        // ── Inbound from Agent ─────────────────────────────────────────────

        public Task RegisterAgent(string agentId, string hostname, string[] capabilities)
        {
            _registry.Register(agentId, Context.ConnectionId, hostname, capabilities);
            _sessions.OnAgentReconnected(agentId);
            return Task.CompletedTask;
        }

        public Task PushLines(
            string sessionId, string[] lines, long[] byteOffsets, bool isInitialLoad, bool isReset)
            => _sessions.HandleAgentPushAsync(sessionId, lines, byteOffsets, isInitialLoad, isReset);

        public Task PushRequestedLines(string sessionId, int startLine, string[] lines)
            => _sessions.HandleAgentPageAsync(sessionId, startLine, lines);

        public Task PushFileInfo(string requestId, long sizeBytes, bool exists)
            => _registry.CompleteFileInfoRequestAsync(requestId, sizeBytes, exists);

        public Task PushFileList(string requestId, RemoteFileInfoDto[] files)
            => _registry.CompleteListRequestAsync(requestId, files);

        public Task PushError(string sessionId, string errorMessage)
            => _sessions.HandleAgentErrorAsync(sessionId, errorMessage);

        // ── Disconnect ─────────────────────────────────────────────────────

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var agentId = _registry.GetAgentIdByConnectionId(Context.ConnectionId);
            if (agentId != null)
                _registry.Unregister(agentId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
