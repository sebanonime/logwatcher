using LogWatcher.Web.Config;
using LogWatcher.Web.Dto;
using LogWatcher.Web.Hubs;
using LogWatcher.Web.Services;
using Microsoft.AspNetCore.SignalR;
using System.Runtime.CompilerServices;
using System.Threading.Channels;

namespace LogWatcher.Web.Sources
{
    /// <summary>
    /// Proxies all file operations to a remote LogWatcher.Agent via AgentHub.
    /// The agent initiates an outbound connection to the backend — no inbound
    /// ports are needed on the agent's host (DMZ-friendly).
    ///
    /// Full implementation is wired in Phase 7. This stub allows the solution
    /// to compile and the session manager to instantiate agent-type sessions.
    /// </summary>
    public class AgentFileSourceProvider : IFileSourceProvider
    {
        private readonly ServerDefinition _server;
        private readonly IAgentRegistry _registry;
        private readonly IHubContext<AgentHub> _agentHub;

        // Channel receives lines pushed proactively by the agent
        private readonly Channel<TailChunk> _tailChannel =
            Channel.CreateUnbounded<TailChunk>();

        public string SourceType => "agent";

        public AgentFileSourceProvider(
            ServerDefinition server,
            IAgentRegistry registry,
            IHubContext<AgentHub> agentHub)
        {
            _server = server;
            _registry = registry;
            _agentHub = agentHub;
        }

        public async Task<FileSourceInfo> GetFileInfoAsync(string path, CancellationToken ct = default)
        {
            if (!_registry.TryGetConnectionId(_server.AgentId, out var connId))
                throw new InvalidOperationException($"Agent '{_server.AgentId}' is not connected.");

            var (sizeBytes, exists) = await _registry.SendFileInfoRequestAsync(
                connId, path,
                (reqId, p) => _agentHub.Clients.Client(connId).SendAsync("GetFileInfo", reqId, p, ct),
                ct);

            return new FileSourceInfo(path, sizeBytes, exists, DateTimeOffset.UtcNow);
        }

        public async IAsyncEnumerable<ReadOnlyMemory<byte>> ReadRawAsync(
            string path, long fromByteOffset,
            [EnumeratorCancellation] CancellationToken ct)
        {
            // Agent sends lines via PushLines → WatchSession.HandleAgentPush
            // Raw byte streaming is not used for agent sources; yield nothing here.
            // The index is built incrementally as lines arrive via AgentHub.
            await Task.CompletedTask;
            yield break;
        }

        public Task<byte[]> ReadBytesAsync(string path, long from, int count, CancellationToken ct)
        {
            // Not used for agent — lines are served via RequestLines/PushRequestedLines
            return Task.FromResult(Array.Empty<byte>());
        }

        public async IAsyncEnumerable<TailChunk> TailAsync(
            string path, long fromByteOffset,
            [EnumeratorCancellation] CancellationToken ct)
        {
            if (!_registry.TryGetConnectionId(_server.AgentId, out var connId))
                throw new InvalidOperationException($"Agent '{_server.AgentId}' is not connected.");

            // Tell the agent to start watching this file
            await _agentHub.Clients.Client(connId)
                .SendAsync("WatchFile", path, fromByteOffset, "UTF-8", ct);

            // Read chunks as they arrive from the agent (via AgentHub.PushLines → _tailChannel)
            await foreach (var chunk in _tailChannel.Reader.ReadAllAsync(ct))
                yield return chunk;
        }

        public async Task<IEnumerable<RemoteFileInfoDto>> ListFilesAsync(
            string directory, string pattern, CancellationToken ct = default)
        {
            if (!_registry.TryGetConnectionId(_server.AgentId, out var connId))
                return Enumerable.Empty<RemoteFileInfoDto>();

            return await _registry.SendListFilesRequestAsync(
                connId, directory, pattern,
                (reqId, dir, pat) => _agentHub.Clients.Client(connId).SendAsync("ListFiles", reqId, dir, pat, ct),
                ct);
        }

        /// <summary>Called by WatchSessionManager when the agent pushes new lines.</summary>
        public void PushToTail(TailChunk chunk) =>
            _tailChannel.Writer.TryWrite(chunk);

        public ValueTask DisposeAsync()
        {
            _tailChannel.Writer.TryComplete();
            return ValueTask.CompletedTask;
        }
    }
}
