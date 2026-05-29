using LogWatcher.Grpc;
using LogWatcher.Web.Dto;

namespace LogWatcher.Web.Services
{
    public record AgentInfo(string AgentId, string Hostname, string[] Capabilities, DateTimeOffset ConnectedAt);

    public interface IAgentRegistry
    {
        void Register(string agentId, string hostname, string[] capabilities, Func<BackendMessage, Task> sender);
        void Unregister(string agentId);
        bool IsConnected(string agentId);
        IReadOnlyList<AgentInfo> GetAll();

        Task SendAsync(string agentId, BackendMessage message, CancellationToken ct = default);

        // Request/response helpers (TaskCompletionSource pattern with 10s timeout)
        Task CompleteFileInfoRequestAsync(string requestId, long sizeBytes, bool exists);
        Task CompleteListRequestAsync(string requestId, RemoteFileInfoDto[] files);
        Task CompleteFilterRequestAsync(string requestId, int[] matchingLines);
        Task CompleteSearchRequestAsync(string requestId, string[] matchingPaths);

        Task<(long SizeBytes, bool Exists)> SendFileInfoRequestAsync(
            string agentId, string filePath, CancellationToken ct);

        Task<RemoteFileInfoDto[]> SendListFilesRequestAsync(
            string agentId, string directory, string pattern, CancellationToken ct);

        Task<int[]> SendFilterRequestAsync(
            string agentId, string requestId, BuildFilterCmd cmd, CancellationToken ct);

        Task<string[]> SendSearchRequestAsync(
            string agentId, SearchFilesCmd cmd, CancellationToken ct);

        Task<string[]> SendPageRequestAsync(
            string agentId, string sessionId, int startLine, int count, CancellationToken ct);

        Task CompletePageRequestAsync(string requestKey, string[] lines);
    }
}
