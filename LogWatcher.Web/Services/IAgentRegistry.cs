using LogWatcher.Web.Dto;

namespace LogWatcher.Web.Services
{
    public record AgentInfo(string AgentId, string ConnectionId, string Hostname, string[] Capabilities, DateTimeOffset ConnectedAt);

    public interface IAgentRegistry
    {
        void Register(string agentId, string connectionId, string hostname, string[] capabilities);
        void Unregister(string agentId);
        bool TryGetConnectionId(string agentId, out string connectionId);
        string GetAgentIdByConnectionId(string connectionId);
        IReadOnlyList<AgentInfo> GetAll();

        // Request/response helpers (TaskCompletionSource pattern with 10s timeout)
        Task CompleteFileInfoRequestAsync(string requestId, long sizeBytes, bool exists);
        Task CompleteListRequestAsync(string requestId, RemoteFileInfoDto[] files);

        Task<(long SizeBytes, bool Exists)> SendFileInfoRequestAsync(
            string agentConnectionId, string filePath, Func<string, string, Task> sender, CancellationToken ct);

        Task<RemoteFileInfoDto[]> SendListFilesRequestAsync(
            string agentConnectionId, string directory, string pattern,
            Func<string, string, string, Task> sender, CancellationToken ct);
    }
}
