using LogWatcher.Grpc;
using LogWatcher.Web.Config;
using LogWatcher.Web.Dto;
using LogWatcher.Web.Services;
using System.Runtime.CompilerServices;
using System.Threading.Channels;

namespace LogWatcher.Web.Sources
{
    /// <summary>
    /// Proxies all file operations to a remote LogWatcher.Agent via gRPC.
    /// Filter and content search are performed locally on the agent to avoid
    /// transmitting the full file over the network.
    /// </summary>
    public class AgentFileSourceProvider : IFileSourceProvider
    {
        private readonly ServerDefinition _server;
        private readonly IAgentRegistry _registry;
        private readonly string _sessionId;

        // Channel receives lines pushed proactively by the agent
        private readonly Channel<TailChunk> _tailChannel =
            Channel.CreateUnbounded<TailChunk>();

        public string SourceType => "agent";

        public AgentFileSourceProvider(ServerDefinition server, IAgentRegistry registry, string sessionId = "")
        {
            _server = server;
            _registry = registry;
            _sessionId = sessionId;
        }

        public async Task<FileSourceInfo> GetFileInfoAsync(string path, CancellationToken ct = default)
        {
            if (!_registry.IsConnected(_server.AgentId))
                throw new InvalidOperationException($"Agent '{_server.AgentId}' is not connected.");

            var (sizeBytes, exists) = await _registry.SendFileInfoRequestAsync(_server.AgentId, path, ct);
            return new FileSourceInfo(path, sizeBytes, exists, DateTimeOffset.UtcNow);
        }

        public async IAsyncEnumerable<ReadOnlyMemory<byte>> ReadRawAsync(
            string path, long fromByteOffset,
            [EnumeratorCancellation] CancellationToken ct)
        {
            // Raw byte streaming not used for agent sources — lines arrive via PushLines.
            await Task.CompletedTask;
            yield break;
        }

        public Task<byte[]> ReadBytesAsync(string path, long from, int count, CancellationToken ct)
            => Task.FromResult(Array.Empty<byte>());

        public Task<byte[]> ReadRangeBytesAsync(string path, long from, long to, CancellationToken ct)
            => Task.FromResult(Array.Empty<byte>());

        public async IAsyncEnumerable<TailChunk> TailAsync(
            string path, long fromByteOffset,
            [EnumeratorCancellation] CancellationToken ct)
        {
            if (!_registry.IsConnected(_server.AgentId))
                throw new InvalidOperationException($"Agent '{_server.AgentId}' is not connected.");

            await _registry.SendAsync(_server.AgentId, new BackendMessage
            {
                WatchFile = new WatchFileCmd
                {
                    SessionId = _sessionId,
                    FilePath = path,
                    FromOffset = fromByteOffset,
                    Encoding = "UTF-8",
                }
            }, ct);

            await foreach (var chunk in _tailChannel.Reader.ReadAllAsync(ct))
                yield return chunk;
        }

        public async Task<IEnumerable<RemoteFileInfoDto>> ListFilesAsync(
            string directory, string pattern, CancellationToken ct = default)
        {
            if (!_registry.IsConnected(_server.AgentId))
                return Enumerable.Empty<RemoteFileInfoDto>();

            return await _registry.SendListFilesRequestAsync(_server.AgentId, directory, pattern, ct);
        }

        public async Task<LineDto[]?> ReadLinesByNumberAsync(string sessionId, int startLine, int count, CancellationToken ct)
        {
            if (!_registry.IsConnected(_server.AgentId))
                return null;

            var lines = await _registry.SendPageRequestAsync(_server.AgentId, sessionId, startLine, count, ct);
            return lines.Select((text, i) => new LineDto { LineNumber = startLine + i, Text = text }).ToArray();
        }

        public async Task<int[]?> BuildFilterAsync(FilterOptionsDto options, string sessionId, CancellationToken ct)
        {
            if (!_registry.IsConnected(_server.AgentId))
                return null;

            var requestId = Guid.NewGuid().ToString("N");
            var cmd = new BuildFilterCmd
            {
                RequestId = requestId,
                SessionId = sessionId,
                Pattern = options.Pattern ?? string.Empty,
                IsRegex = options.IsRegex,
                CaseSensitive = options.CaseSensitive,
            };

            foreach (var h in options.HiddenLines ?? new())
            {
                if (h == null) continue;
                cmd.HiddenRules.Add(new HiddenLineRule
                {
                    Text = h.Text ?? string.Empty,
                    IsRegex = h.IsRegex,
                    CaseSensitive = h.CaseSensitive,
                    IsActive = h.IsActive,
                });
            }

            return await _registry.SendFilterRequestAsync(_server.AgentId, requestId, cmd, ct);
        }

        public async Task<FileSearchMatchDto[]?> SearchFilesAsync(
            string directory, string nameFilter, string pattern, bool isRegex, int maxMatchesPerFile, CancellationToken ct)
        {
            if (!_registry.IsConnected(_server.AgentId))
                return null;

            return await _registry.SendSearchRequestAsync(_server.AgentId, new SearchFilesCmd
            {
                Directory = directory,
                NameFilter = nameFilter ?? string.Empty,
                Pattern = pattern ?? string.Empty,
                IsRegex = isRegex,
                MaxMatchesPerFile = maxMatchesPerFile,
            }, ct);
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
