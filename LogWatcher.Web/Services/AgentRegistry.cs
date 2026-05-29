using LogWatcher.Grpc;
using LogWatcher.Web.Dto;
using System.Collections.Concurrent;

namespace LogWatcher.Web.Services
{
    public class AgentRegistry : IAgentRegistry
    {
        private record RegisteredAgent(AgentInfo Info, Func<BackendMessage, Task> Sender);

        private readonly ConcurrentDictionary<string, RegisteredAgent> _agents = new();

        private readonly ConcurrentDictionary<string, TaskCompletionSource<(long, bool)>> _fileInfoRequests = new();
        private readonly ConcurrentDictionary<string, TaskCompletionSource<RemoteFileInfoDto[]>> _listRequests = new();
        private readonly ConcurrentDictionary<string, TaskCompletionSource<int[]>> _filterRequests = new();
        private readonly ConcurrentDictionary<string, TaskCompletionSource<string[]>> _searchRequests = new();

        private readonly ConcurrentDictionary<string, TaskCompletionSource<string[]>> _pageRequests = new();

        private static readonly TimeSpan RequestTimeout = TimeSpan.FromSeconds(30);

        public void Register(string agentId, string hostname, string[] capabilities, Func<BackendMessage, Task> sender)
        {
            var info = new AgentInfo(agentId, hostname, capabilities, DateTimeOffset.UtcNow);
            _agents[agentId] = new RegisteredAgent(info, sender);
        }

        public void Unregister(string agentId) => _agents.TryRemove(agentId, out _);

        public bool IsConnected(string agentId) => _agents.ContainsKey(agentId);

        public IReadOnlyList<AgentInfo> GetAll() =>
            _agents.Values.Select(a => a.Info).ToList().AsReadOnly();

        public Task SendAsync(string agentId, BackendMessage message, CancellationToken ct = default)
        {
            if (_agents.TryGetValue(agentId, out var agent))
                return agent.Sender(message);
            return Task.CompletedTask;
        }

        // ── File info ──────────────────────────────────────────────────────

        public async Task<(long SizeBytes, bool Exists)> SendFileInfoRequestAsync(
            string agentId, string filePath, CancellationToken ct)
        {
            var requestId = Guid.NewGuid().ToString("N");
            var tcs = new TaskCompletionSource<(long, bool)>();
            _fileInfoRequests[requestId] = tcs;
            try
            {
                await SendAsync(agentId, new BackendMessage
                {
                    GetFileInfo = new GetFileInfoCmd { RequestId = requestId, FilePath = filePath }
                }, ct);
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

        // ── File list ──────────────────────────────────────────────────────

        public async Task<RemoteFileInfoDto[]> SendListFilesRequestAsync(
            string agentId, string directory, string pattern, CancellationToken ct)
        {
            var requestId = Guid.NewGuid().ToString("N");
            var tcs = new TaskCompletionSource<RemoteFileInfoDto[]>();
            _listRequests[requestId] = tcs;
            try
            {
                await SendAsync(agentId, new BackendMessage
                {
                    ListFiles = new ListFilesCmd { RequestId = requestId, Directory = directory, Pattern = pattern }
                }, ct);
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

        // ── Filter ────────────────────────────────────────────────────────

        public async Task<int[]> SendFilterRequestAsync(
            string agentId, string requestId, BuildFilterCmd cmd, CancellationToken ct)
        {
            var tcs = new TaskCompletionSource<int[]>();
            _filterRequests[requestId] = tcs;
            try
            {
                await SendAsync(agentId, new BackendMessage { BuildFilter = cmd }, ct);
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(RequestTimeout);
                cts.Token.Register(() => tcs.TrySetCanceled());
                return await tcs.Task;
            }
            finally
            {
                _filterRequests.TryRemove(requestId, out _);
            }
        }

        public Task CompleteFilterRequestAsync(string requestId, int[] matchingLines)
        {
            if (_filterRequests.TryGetValue(requestId, out var tcs))
                tcs.TrySetResult(matchingLines);
            return Task.CompletedTask;
        }

        // ── Content search ────────────────────────────────────────────────

        public async Task<string[]> SendSearchRequestAsync(
            string agentId, SearchFilesCmd cmd, CancellationToken ct)
        {
            var requestId = Guid.NewGuid().ToString("N");
            cmd.RequestId = requestId;
            var tcs = new TaskCompletionSource<string[]>();
            _searchRequests[requestId] = tcs;
            try
            {
                await SendAsync(agentId, new BackendMessage { SearchFiles = cmd }, ct);
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(RequestTimeout);
                cts.Token.Register(() => tcs.TrySetCanceled());
                return await tcs.Task;
            }
            finally
            {
                _searchRequests.TryRemove(requestId, out _);
            }
        }

        public Task CompleteSearchRequestAsync(string requestId, string[] matchingPaths)
        {
            if (_searchRequests.TryGetValue(requestId, out var tcs))
                tcs.TrySetResult(matchingPaths);
            return Task.CompletedTask;
        }

        // ── Page request ──────────────────────────────────────────────────

        public async Task<string[]> SendPageRequestAsync(
            string agentId, string sessionId, int startLine, int count, CancellationToken ct)
        {
            var key = $"{sessionId}:{startLine}";
            var tcs = new TaskCompletionSource<string[]>();
            _pageRequests[key] = tcs;
            try
            {
                await SendAsync(agentId, new BackendMessage
                {
                    RequestLines = new RequestLinesCmd { SessionId = sessionId, StartLine = startLine, Count = count }
                }, ct);
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(RequestTimeout);
                cts.Token.Register(() => tcs.TrySetCanceled());
                return await tcs.Task;
            }
            finally
            {
                _pageRequests.TryRemove(key, out _);
            }
        }

        public Task CompletePageRequestAsync(string requestKey, string[] lines)
        {
            if (_pageRequests.TryGetValue(requestKey, out var tcs))
                tcs.TrySetResult(lines);
            return Task.CompletedTask;
        }
    }
}
