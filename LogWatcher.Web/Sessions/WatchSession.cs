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
        private volatile bool _filterEnabled;
        private volatile bool _isFilterBuilding;
        private int _viewVersion;
        private Encoding _encoding;
        private CancellationTokenSource _cts = new();
        private bool _tailMode = true;

        public int ViewVersion => Volatile.Read(ref _viewVersion);

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
                        FilePath = FilePath,
                        ViewVersion = ViewVersion
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
                        Volatile.Write(ref _filter, null);
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
                                FilePath = FilePath,
                                ViewVersion = ViewVersion
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
                        new FileStatsDto { TotalLines = _index.Count, SizeBytes = _index.TotalBytes, IsIndexed = true, ServerId = ServerId, FilePath = FilePath, ViewVersion = ViewVersion });
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

            // Calculate the byte span covering all requested lines in one go
            long firstOffset = offsets[0];
            int lastLineNum = startLine + actual - 1;
            int lastByteLen = _index.GetLineByteLength(lastLineNum);
            if (lastByteLen <= 0) lastByteLen = 0;
            long lastOffset = offsets[actual - 1];
            long endOffset = lastOffset + lastByteLen;

            if (endOffset <= firstOffset)
                return Array.Empty<LineDto>();

            // Single I/O read for the whole chunk
            var block = await _provider.ReadRangeBytesAsync(FilePath, firstOffset, endOffset, ct);

            var results = new List<LineDto>(actual);
            for (int i = 0; i < actual; i++)
            {
                int lineNum = startLine + i;
                int byteLen = _index.GetLineByteLength(lineNum);
                if (byteLen <= 0) continue;

                // Position within the block
                int blockOffset = (int)(offsets[i] - firstOffset);
                if (blockOffset < 0 || blockOffset + byteLen > block.Length) continue;

                // Strip trailing \r\n
                int end = byteLen;
                while (end > 0 && blockOffset + end - 1 < block.Length &&
                       (block[blockOffset + end - 1] == '\n' || block[blockOffset + end - 1] == '\r'))
                    end--;

                results.Add(new LineDto { LineNumber = lineNum, Text = _encoding.GetString(block, blockOffset, end) });
            }
            return results.ToArray();
        }

        public async Task<LineDto[]> ReadFilteredLinesAsync(int startFilteredLine, int count, CancellationToken ct = default)
        {
            if (_isFilterBuilding) return Array.Empty<LineDto>();
            if (!_filterEnabled) return await ReadLinesAsync(startFilteredLine, count, ct);
            var filter = Volatile.Read(ref _filter);
            if (filter == null) return Array.Empty<LineDto>();
            var origLines = filter.GetOriginalLineRange(startFilteredLine, count);
            if (origLines.Length == 0) return Array.Empty<LineDto>();

            // Read in contiguous spans to minimise I/O calls.
            // Group consecutive original line numbers into runs and read each run at once.
            var allResults = new Dictionary<int, LineDto>(origLines.Length);

            int runStart = 0;
            while (runStart < origLines.Length)
            {
                int runEnd = runStart;
                // Extend run while lines are close enough (within 50 lines of each other)
                while (runEnd + 1 < origLines.Length &&
                       origLines[runEnd + 1] - origLines[runEnd] <= 50)
                    runEnd++;

                int spanFirst = origLines[runStart];
                int spanCount = origLines[runEnd] - origLines[runStart] + 1;
                var chunk = await ReadLinesAsync(spanFirst, spanCount, ct);
                foreach (var line in chunk)
                    allResults[line.LineNumber] = line;

                runStart = runEnd + 1;
            }

            var results = new LineDto[origLines.Length];
            for (int i = 0; i < origLines.Length; i++)
            {
                results[i] = allResults.TryGetValue(origLines[i], out var dto)
                    ? dto
                    : new LineDto { LineNumber = origLines[i], Text = "" };
                // Remap LineNumber to filtered index so the frontend buffer key
                // matches the virtual list row index (0, 1, 2...).
                results[i].LineNumber = startFilteredLine + i;
            }
            return results;
        }

        public async Task ApplyFilterAsync(FilterOptionsDto options, CancellationToken ct = default)
        {
            _filterEnabled = true;
            _isFilterBuilding = true;
            try
            {
                var newFilter = new FilteredLineIndex();
                int total = _index.Count;
                var progress = _logHub.Clients.Group(SessionId);

                Regex patternRegex = null;
                if (options.IsRegex)
                {
                    var ropts = options.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
                    patternRegex = new Regex(options.Pattern, ropts | RegexOptions.Compiled);
                }

                // Compile hidden line regex patterns
                var hiddenPatterns = new List<Regex>();
                foreach (var hidden in options.HiddenLines ?? new())
                {
                    if (!hidden.IsActive) continue;
                    if (hidden.IsRegex)
                    {
                        var ropts = hidden.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
                        hiddenPatterns.Add(new Regex(hidden.Text, ropts | RegexOptions.Compiled));
                    }
                }

                for (int i = 0; i < total; i += 500)
                {
                    int batch = Math.Min(500, total - i);
                    var lines = await ReadLinesAsync(i, batch, ct);
                    foreach (var line in lines)
                    {
                        // Check if line matches filter pattern
                        bool matchesPattern = options.IsRegex
                            ? patternRegex?.IsMatch(line.Text) == true
                            : options.CaseSensitive
                                ? line.Text.Contains(options.Pattern)
                                : line.Text.Contains(options.Pattern, StringComparison.OrdinalIgnoreCase);

                        if (!matchesPattern) continue;

                        // Check if line matches any hidden line pattern
                        bool isHidden = false;
                        int hiddenIndex = 0;
                        foreach (var hidden in options.HiddenLines ?? new())
                        {
                            if (!hidden.IsActive)
                            {
                                if (hidden.IsRegex) hiddenIndex++;
                                continue;
                            }

                            bool hiddenMatch = hidden.IsRegex
                                ? hiddenPatterns[hiddenIndex]?.IsMatch(line.Text) == true
                                : hidden.CaseSensitive
                                    ? line.Text.Contains(hidden.Text)
                                    : line.Text.Contains(hidden.Text, StringComparison.OrdinalIgnoreCase);

                            if (hiddenMatch)
                            {
                                isHidden = true;
                                break;
                            }

                            if (hidden.IsRegex) hiddenIndex++;
                        }

                        if (!isHidden)
                            newFilter.Add(line.LineNumber);
                    }
                    if (i % 50000 == 0)
                        await progress.SendAsync("OnFilterProgress", SessionId, i, total, cancellationToken: ct);
                }

                Volatile.Write(ref _filter, newFilter);
                Interlocked.Increment(ref _viewVersion);
                await progress.SendAsync("OnFileStats", SessionId,
                    new FileStatsDto { TotalLines = newFilter.Count, SizeBytes = _index.TotalBytes, IsIndexed = true, ServerId = ServerId, FilePath = FilePath, ViewVersion = ViewVersion },
                    cancellationToken: ct);
            }
            finally
            {
                _isFilterBuilding = false;
            }
        }

        public async Task ClearFilterAsync()
        {
            _filterEnabled = false;
            Volatile.Write(ref _filter, null);
            Interlocked.Increment(ref _viewVersion);
            await _logHub.Clients.Group(SessionId).SendAsync("OnFileStats", SessionId,
                new FileStatsDto { TotalLines = _index.Count, SizeBytes = _index.TotalBytes, IsIndexed = true, ServerId = ServerId, FilePath = FilePath, ViewVersion = ViewVersion });
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
