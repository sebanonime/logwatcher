using LogWatcher.Web.Dto;
using LogWatcher.Web.Indexing;
using LogWatcher.Web.Sources;
using Microsoft.AspNetCore.SignalR;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Channels;

namespace LogWatcher.Web.Sessions
{
    /// <summary>
    /// Manages all state for one open log file (one browser tab).
    /// Handles indexing, tail, paging, and filter.
    /// </summary>
    public class WatchSession : IAsyncDisposable
    {
        public string SessionId { get; }
        public string ServerId { get; }
        public string FilePath { get; }

        private readonly IFileSourceProvider _provider;
        private readonly IHubContext<Hubs.LogHub> _logHub;
        private readonly string _openingConnectionId;
        private readonly LineIndex _index = new();
        private readonly LineIndexBuilder _builder = new();
        private FilteredLineIndex _filter;
        private Encoding _encoding;
        private CancellationTokenSource _cts = new();
        private bool _tailMode = true;

        // For agent-type providers: new lines arrive through this channel
        public Channel<(string[] Lines, long[] Offsets, bool IsReset)> AgentChannel { get; }
            = Channel.CreateUnbounded<(string[], long[], bool)>();

        public WatchSession(string sessionId, string serverId, string filePath,
            IFileSourceProvider provider, IHubContext<Hubs.LogHub> logHub,
            OpenLogOptionsDto options, string openingConnectionId)
        {
            SessionId = sessionId;
            ServerId = serverId;
            FilePath = filePath;
            _provider = provider;
            _logHub = logHub;
            _encoding = Encoding.GetEncoding(options.Encoding ?? "UTF-8");
            _openingConnectionId = openingConnectionId;
        }

        private async Task SendToGroupAndOpeningClientAsync(string method, params object[] args)
        {
            // SendCoreAsync takes object[] directly without params wrapping
            await _logHub.Clients.Group(SessionId).SendCoreAsync(method, args);
            if (!string.IsNullOrWhiteSpace(_openingConnectionId))
                await _logHub.Clients.Client(_openingConnectionId).SendCoreAsync(method, args);
        }

        /// <summary>Start indexing and tailing the file.</summary>
        public Task StartAsync() => Task.Run(RunAsync);

        private async Task RunAsync()
        {
            var ct = _cts.Token;
            try
            {
                // 1. Build the full line index
                Console.WriteLine($"[WatchSession.RunAsync] Starting for {FilePath} (ServerId={ServerId}, SessionId={SessionId})");

                var progress = new Progress<long>(bytesIndexed =>
                {
                    _logHub.Clients.Group(SessionId)
                        .SendAsync("OnIndexProgress", SessionId, bytesIndexed, _index.TotalBytes, cancellationToken: ct);
                });

                Console.WriteLine($"[WatchSession.RunAsync] Calling ReadRawAsync for {FilePath}");
                var rawStream = _provider.ReadRawAsync(FilePath, 0, ct);
                
                Console.WriteLine($"[WatchSession.RunAsync] Calling BuildAsync");
                await _builder.BuildAsync(_index, rawStream, progress, ct);
                Console.WriteLine($"[WatchSession.RunAsync] BuildAsync completed. Index.Count={_index.Count}, TotalBytes={_index.TotalBytes}");

                // 2. Notify the client that the index is ready
                Console.WriteLine($"[WatchSession.RunAsync] Sending OnFileStats: TotalLines={_index.Count}, TotalBytes={_index.TotalBytes}");
                await SendToGroupAndOpeningClientAsync("OnFileStats", SessionId,
                    new FileStatsDto
                    {
                        TotalLines = _index.Count,
                        SizeBytes = _index.TotalBytes,
                        IsIndexed = true,
                        ServerId = ServerId,
                        FilePath = FilePath
                    });

                // 2b. Push initial tail lines so client renders them immediately
                //     without relying on the pull/RequestLines mechanism.
                if (_index.Count > 0)
                {
                    int initialFrom = Math.Max(0, _index.Count - 500);
                    int initialCount = _index.Count - initialFrom;
                    var initialLines = await ReadLinesAsync(initialFrom, initialCount, ct);
                    if (initialLines.Length > 0)
                        await SendToGroupAndOpeningClientAsync(
                            "OnNewLines", SessionId, initialLines, _index.Count);
                }

                // 3. Tail new content
                await foreach (var chunk in _provider.TailAsync(FilePath, _index.TotalBytes, ct))
                {
                    if (chunk.IsReset)
                    {
                        _index.Clear();
                        _filter = null;
                        await SendToGroupAndOpeningClientAsync("OnReload", SessionId);
                        // Re-index from scratch
                        var reloadStream = _provider.ReadRawAsync(FilePath, 0, ct);
                        await _builder.BuildAsync(_index, reloadStream, null, ct);
                        await SendToGroupAndOpeningClientAsync("OnFileStats", SessionId,
                            new FileStatsDto
                            {
                                TotalLines = _index.Count,
                                SizeBytes = _index.TotalBytes,
                                IsIndexed = true,
                                ServerId = ServerId,
                                FilePath = FilePath
                            });
                        continue;
                    }

                    if (chunk.Bytes.Length == 0) continue;

                    int prevCount = _index.Count;
                    // Index the new bytes
                    await _builder.BuildAsync(_index,
                        ToAsyncEnum(chunk.Bytes), null, ct);

                    int newCount = _index.Count - prevCount;
                    if (newCount <= 0) continue;

                    // Read the new lines and push to clients
                    var newLines = await ReadLinesAsync(prevCount, newCount, ct);
                    if (_tailMode)
                    {
                        await SendToGroupAndOpeningClientAsync(
                            "OnNewLines", SessionId, newLines, _index.Count);
                    }
                    // Always send updated stats so SizeBytes stays current
                    await SendToGroupAndOpeningClientAsync("OnFileStats", SessionId,
                        new FileStatsDto { TotalLines = _index.Count, SizeBytes = _index.TotalBytes, IsIndexed = true, ServerId = ServerId, FilePath = FilePath });
                }
            }
            catch (OperationCanceledException) { }
            catch (Exception ex)
            {
                await SendToGroupAndOpeningClientAsync("OnError", SessionId, ex.Message);
            }
        }

        public async Task<LineDto[]> ReadLinesAsync(int startLine, int count, CancellationToken ct = default)
        {
            var (offsets, actual) = _index.GetRange(startLine, count);
            if (actual == 0) return Array.Empty<LineDto>();

            var results = new List<LineDto>(actual);
            for (int i = 0; i < actual; i++)
            {
                int lineNum = startLine + i;
                long offset = offsets[i];
                int byteLen = _index.GetLineByteLength(lineNum);

                // byteLen <= 0 means TotalBytes is not yet set (file not fully indexed).
                // Skip the line — the client keeps it as undefined and will retry after
                // TailAsync sets TotalBytes correctly.
                if (byteLen <= 0) continue;

                var bytes = await _provider.ReadBytesAsync(FilePath, offset, byteLen, ct);
                // Strip trailing \r\n
                int end = bytes.Length;
                while (end > 0 && (bytes[end - 1] == '\n' || bytes[end - 1] == '\r')) end--;
                results.Add(new LineDto { LineNumber = lineNum, Text = _encoding.GetString(bytes, 0, end) });
            }
            return results.ToArray();
        }

        public async Task<LineDto[]> ReadFilteredLinesAsync(int startFilteredLine, int count, CancellationToken ct = default)
        {
            if (_filter == null) return await ReadLinesAsync(startFilteredLine, count, ct);
            var origLines = _filter.GetOriginalLineRange(startFilteredLine, count);
            var results = new LineDto[origLines.Length];
            for (int i = 0; i < origLines.Length; i++)
            {
                var lines = await ReadLinesAsync(origLines[i], 1, ct);
                results[i] = lines.Length > 0 ? lines[0] : new LineDto { LineNumber = origLines[i], Text = "" };
            }
            return results;
        }

        public async Task ApplyFilterAsync(FilterOptionsDto options, CancellationToken ct = default)
        {
            var newFilter = new FilteredLineIndex();
            int total = _index.Count;
            var progress = _logHub.Clients.Group(SessionId);

            Regex regex = null;
            if (options.IsRegex)
            {
                var ropts = options.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
                regex = new Regex(options.Pattern, ropts | RegexOptions.Compiled);
            }

            for (int i = 0; i < total; i += 500)
            {
                int batch = Math.Min(500, total - i);
                var lines = await ReadLinesAsync(i, batch, ct);
                foreach (var line in lines)
                {
                    bool match = options.IsRegex
                        ? regex?.IsMatch(line.Text) == true
                        : options.CaseSensitive
                            ? line.Text.Contains(options.Pattern)
                            : line.Text.Contains(options.Pattern, StringComparison.OrdinalIgnoreCase);
                    if (match) newFilter.Add(line.LineNumber);
                }
                if (i % 50000 == 0)
                    await progress.SendAsync("OnFilterProgress", SessionId, i, total, cancellationToken: ct);
            }

            _filter = newFilter;
            await progress.SendAsync("OnFileStats", SessionId,
                new FileStatsDto { TotalLines = newFilter.Count, SizeBytes = _index.TotalBytes, IsIndexed = true, ServerId = ServerId, FilePath = FilePath },
                cancellationToken: ct);
        }

        public async Task ClearFilterAsync()
        {
            _filter = null;
            await _logHub.Clients.Group(SessionId).SendAsync("OnFileStats", SessionId,
                new FileStatsDto { TotalLines = _index.Count, SizeBytes = _index.TotalBytes, IsIndexed = true, ServerId = ServerId, FilePath = FilePath });
        }

        public void SetTail(bool tail) => _tailMode = tail;

        // Agent push handler
        public async Task HandleAgentPushAsync(string[] lines, long[] offsets, bool isInitialLoad, bool isReset)
        {
            if (isReset)
            {
                _index.Clear();
                await _logHub.Clients.Group(SessionId).SendAsync("OnReload", SessionId);
                return;
            }
            foreach (var (line, offset) in lines.Zip(offsets))
            {
                _index.AddOffset(offset);
                _index.TotalBytes = offset + _encoding.GetByteCount(line) + 1;
            }
            var dtos = lines.Select((t, i) => new LineDto
            {
                LineNumber = _index.Count - lines.Length + i,
                Text = t
            }).ToArray();

            if (_tailMode)
                await _logHub.Clients.Group(SessionId).SendAsync("OnNewLines", SessionId, dtos, _index.Count);
        }

        public void Stop() => _cts.Cancel();

        public async ValueTask DisposeAsync()
        {
            _cts.Cancel();
            await _provider.DisposeAsync();
        }

        private static async IAsyncEnumerable<ReadOnlyMemory<byte>> ToAsyncEnum(byte[] bytes)
        {
            yield return bytes.AsMemory();
            await Task.CompletedTask;
        }
    }
}
