using LogWatcher.Web.Dto;
using System.Collections.Concurrent;

namespace LogWatcher.Web.Services
{
    public class AgentRegistry : IAgentRegistry
    {
        private readonly ConcurrentDictionary<string, AgentInfo> _byAgentId = new();
        private readonly ConcurrentDictionary<string, string> _connectionToAgent = new();

        // Pending request/response slots
        private readonly ConcurrentDictionary<string, TaskCompletionSource<(long, bool)>> _fileInfoRequests = new();
        private readonly ConcurrentDictionary<string, TaskCompletionSource<RemoteFileInfoDto[]>> _listRequests = new();

        private static readonly TimeSpan RequestTimeout = TimeSpan.FromSeconds(10);

        public void Register(string agentId, string connectionId, string hostname, string[] capabilities)
        {
            var info = new AgentInfo(agentId, connectionId, hostname, capabilities, DateTimeOffset.UtcNow);
            _byAgentId[agentId] = info;
            _connectionToAgent[connectionId] = agentId;
        }

        public void Unregister(string agentId)
        {
            if (_byAgentId.TryRemove(agentId, out var info))
                _connectionToAgent.TryRemove(info.ConnectionId, out _);
        }

        public bool TryGetConnectionId(string agentId, out string connectionId)
        {
            if (_byAgentId.TryGetValue(agentId, out var info))
            {
                connectionId = info.ConnectionId;
                return true;
            }
            connectionId = null;
            return false;
        }

        public string GetAgentIdByConnectionId(string connectionId)
        {
            _connectionToAgent.TryGetValue(connectionId, out var agentId);
            return agentId;
        }

        public IReadOnlyList<AgentInfo> GetAll() =>
            _byAgentId.Values.ToList().AsReadOnly();

        // ── File info request ──────────────────────────────────────────────

        public async Task<(long SizeBytes, bool Exists)> SendFileInfoRequestAsync(
            string agentConnectionId, string filePath,
            Func<string, string, Task> sender, CancellationToken ct)
        {
            var requestId = Guid.NewGuid().ToString("N");
            var tcs = new TaskCompletionSource<(long, bool)>();
            _fileInfoRequests[requestId] = tcs;
            try
            {
                await sender(requestId, filePath);
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(RequestTimeout);
                cts.Token.Register(() => tcs.TrySetCanceled());
                return await tcs.Task;
            }
            finally
            {
                _fileInfoRequests.TryRemove(requestId, out _);
            }
        }

        public Task CompleteFileInfoRequestAsync(string requestId, long sizeBytes, bool exists)
        {
            if (_fileInfoRequests.TryGetValue(requestId, out var tcs))
                tcs.TrySetResult((sizeBytes, exists));
            return Task.CompletedTask;
        }

        // ── File list request ──────────────────────────────────────────────

        public async Task<RemoteFileInfoDto[]> SendListFilesRequestAsync(
            string agentConnectionId, string directory, string pattern,
            Func<string, string, string, Task> sender, CancellationToken ct)
        {
            var requestId = Guid.NewGuid().ToString("N");
            var tcs = new TaskCompletionSource<RemoteFileInfoDto[]>();
            _listRequests[requestId] = tcs;
            try
            {
                await sender(requestId, directory, pattern);
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(RequestTimeout);
                cts.Token.Register(() => tcs.TrySetCanceled());
                return await tcs.Task;
            }
            finally
            {
                _listRequests.TryRemove(requestId, out _);
            }
        }

        public Task CompleteListRequestAsync(string requestId, RemoteFileInfoDto[] files)
        {
            if (_listRequests.TryGetValue(requestId, out var tcs))
                tcs.TrySetResult(files);
            return Task.CompletedTask;
        }
    }
}
