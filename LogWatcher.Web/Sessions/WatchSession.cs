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
        private List<HiddenLinePattern> _activeHiddenLines = new();
        private volatile bool _isIndexComplete;
        private Encoding _encoding;
        private CancellationTokenSource _cts = new();
        private bool _tailMode = true;
        private FilterOptionsDto _filterOptions;

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
            _encoding = ResolveEncoding(options.Encoding);
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

                // 2. Apply hidden-line filter using a fast single-pass byte stream scan.
                //    This avoids the per-batch ReadLinesAsync overhead and runs at ~500 MB/s,
                //    comparable to the indexing pass itself.
                var hiddenLines = _activeHiddenLines;
                if (hiddenLines.Any(h => h.IsActive && !string.IsNullOrWhiteSpace(h.Text)))
                {
                    var hiddenFilter = await BuildHiddenFilterFromStreamAsync(hiddenLines, ct);
                    _filterOptions = new FilterOptionsDto { Pattern = string.Empty, IsRegex = false, CaseSensitive = false, HiddenLines = hiddenLines };
                    _filterEnabled = true;
                    Volatile.Write(ref _filter, hiddenFilter);
                    Interlocked.Increment(ref _viewVersion);
                }

                _isIndexComplete = true;

                // 3. Notify the client that the index is ready
                int visibleCount = _filterEnabled ? (Volatile.Read(ref _filter)?.Count ?? _index.Count) : _index.Count;
                Console.WriteLine($"[WatchSession.RunAsync] Sending OnFileStats: TotalLines={visibleCount}, TotalBytes={_index.TotalBytes}");
                await SendToGroupAndOpeningClientAsync("OnFileStats", SessionId,
                    new FileStatsDto
                    {
                        TotalLines = visibleCount,
                        SizeBytes = _index.TotalBytes,
                        IsIndexed = true,
                        ServerId = ServerId,
                        FilePath = FilePath,
                        ViewVersion = ViewVersion
                    });

                // 3b. Push initial tail lines so client renders them immediately
                //     without relying on the pull/RequestLines mechanism.
                if (visibleCount > 0)
                {
                    int initialFrom = Math.Max(0, visibleCount - 500);
                    int initialCount = visibleCount - initialFrom;
                    var initialLines = await ReadFilteredLinesAsync(initialFrom, initialCount, ct);
                    if (initialLines.Length > 0)
                        await SendToGroupAndOpeningClientAsync(
                            "OnNewLines", SessionId, initialLines, visibleCount);
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

                    if (_tailMode && !_filterEnabled)
                    {
                        // No active filter: push new lines directly, filtering hidden lines inline
                        var newLines = await ReadLinesAsync(prevCount, newCount, ct);
                        var hiddenRules = _activeHiddenLines;
                        if (hiddenRules.Any(h => h.IsActive && !string.IsNullOrWhiteSpace(h.Text)))
                            newLines = newLines.Where(l => !IsHiddenByRules(l.Text, hiddenRules)).ToArray();
                        if (newLines.Length > 0)
                            await SendToGroupAndOpeningClientAsync("OnNewLines", SessionId, newLines, _index.Count);
                    }
                    else if (_tailMode && _filterEnabled)
                    {
                        // Filter active: apply filter inline, append to the filter index, and push directly.
                        var filter = Volatile.Read(ref _filter);
                        if (filter != null && !_isFilterBuilding)
                        {
                            var rawLines = await ReadLinesAsync(prevCount, newCount, ct);
                            var visibleLines = FilterNewLinesInline(rawLines);
                            if (visibleLines.Length > 0)
                            {
                                int filterStart = filter.Count;
                                foreach (var line in visibleLines)
                                    filter.Add(line.LineNumber);
                                var remapped = visibleLines
                                    .Select((l, i) => new LineDto { LineNumber = filterStart + i, Text = l.Text })
                                    .ToArray();
                                await SendToGroupAndOpeningClientAsync("OnNewLines", SessionId, remapped, filter.Count);
                            }
                        }
                    }

                    // Always send updated stats so SizeBytes stays current, using the correct visible count
                    int visibleForStats = _filterEnabled
                        ? (Volatile.Read(ref _filter)?.Count ?? _index.Count)
                        : _index.Count;
                    await SendToGroupAndOpeningClientAsync("OnFileStats", SessionId,
                        new FileStatsDto { TotalLines = visibleForStats, SizeBytes = _index.TotalBytes, IsIndexed = true, ServerId = ServerId, FilePath = FilePath, ViewVersion = ViewVersion });
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

        public async Task<ContextLinesDto> ReadContextLinesAsync(int selectedLine, int radius, CancellationToken ct = default)
        {
            if (_index.Count == 0)
                return new ContextLinesDto { TargetLineNumber = selectedLine, Lines = Array.Empty<LineDto>() };

            int effectiveRadius = Math.Max(0, radius);
            int targetOriginalLine = selectedLine;

            if (_filterEnabled)
            {
                var filter = Volatile.Read(ref _filter);
                if (filter != null && selectedLine >= 0 && selectedLine < filter.Count)
                    targetOriginalLine = filter.GetOriginalLine(selectedLine);
            }

            targetOriginalLine = Math.Clamp(targetOriginalLine, 0, _index.Count - 1);

            int startLine = Math.Max(0, targetOriginalLine - effectiveRadius);
            int endLine = Math.Min(_index.Count - 1, targetOriginalLine + effectiveRadius);
            int count = Math.Max(1, endLine - startLine + 1);

            var lines = await ReadLinesAsync(startLine, count, ct);
            var hiddenRules = _activeHiddenLines;
            if (hiddenRules.Count > 0)
                lines = lines.Where(line => !IsHiddenByRules(line.Text, hiddenRules)).ToArray();

            return new ContextLinesDto
            {
                TargetLineNumber = targetOriginalLine,
                Lines = lines,
            };
        }

        /// <summary>
        /// Fast single-pass scan: streams raw bytes, splits lines, decodes once,
        /// then applies pattern + hidden rules. This avoids thousands of small
        /// ReadLinesAsync calls and keeps filtering close to indexing speed.
        /// </summary>
        private async Task<FilteredLineIndex> BuildFilterFromStreamAsync(
            FilterOptionsDto options, CancellationToken ct, bool reportProgress)
        {
            var filter = new FilteredLineIndex();
            var hiddenRules = CompileHiddenPatterns((options.HiddenLines ?? new())
                .Where(h => h != null)
                .ToList());

            Regex patternRegex = null;
            var pattern = options.Pattern ?? string.Empty;
            if (options.IsRegex)
            {
                var ropts = options.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
                patternRegex = new Regex(pattern, ropts | RegexOptions.Compiled);
            }

            int total = _index.Count;
            var progress = _logHub.Clients.Group(SessionId);
            int nextProgressLine = 50_000;

            var rawStream = _provider.ReadRawAsync(FilePath, 0, ct);
            int lineNumber = 0;
            // Reuse a byte buffer for the current line to avoid per-line heap allocations.
            var lineBytes = new byte[4096];
            int lineBytesLen = 0;

            await foreach (var chunk in rawStream.WithCancellation(ct))
            {
                var bytes = chunk.ToArray(); // Span not allowed in async methods (C# 12)
                for (int i = 0; i < bytes.Length; i++)
                {
                    byte b = bytes[i];
                    if (b == (byte)'\n')
                    {
                        int end = lineBytesLen;
                        if (end > 0 && lineBytes[end - 1] == (byte)'\r') end--;

                        var text = _encoding.GetString(lineBytes, 0, end);
                        bool matchesPattern = options.IsRegex
                            ? patternRegex?.IsMatch(text) == true
                            : options.CaseSensitive
                                ? text.Contains(pattern)
                                : text.Contains(pattern, StringComparison.OrdinalIgnoreCase);

                        if (matchesPattern && !IsHiddenByCompiledRules(text, hiddenRules))
                            filter.Add(lineNumber);

                        lineNumber++;
                        if (reportProgress && lineNumber >= nextProgressLine)
                        {
                            await progress.SendAsync("OnFilterProgress", SessionId,
                                Math.Min(lineNumber, total), total, cancellationToken: ct);
                            nextProgressLine += 50_000;
                        }

                        lineBytesLen = 0;
                    }
                    else
                    {
                        if (lineBytesLen == lineBytes.Length)
                            Array.Resize(ref lineBytes, lineBytes.Length * 2);
                        lineBytes[lineBytesLen++] = b;
                    }
                }
            }

            // Handle last line with no trailing newline
            if (lineBytesLen > 0)
            {
                int end = lineBytesLen;
                if (end > 0 && lineBytes[end - 1] == (byte)'\r') end--;
                var text = _encoding.GetString(lineBytes, 0, end);
                bool matchesPattern = options.IsRegex
                    ? patternRegex?.IsMatch(text) == true
                    : options.CaseSensitive
                        ? text.Contains(pattern)
                        : text.Contains(pattern, StringComparison.OrdinalIgnoreCase);
                if (matchesPattern && !IsHiddenByCompiledRules(text, hiddenRules))
                    filter.Add(lineNumber);
            }

            if (reportProgress)
            {
                await progress.SendAsync("OnFilterProgress", SessionId, total, total, cancellationToken: ct);
            }

            return filter;
        }

        private Task<FilteredLineIndex> BuildHiddenFilterFromStreamAsync(
            List<HiddenLinePattern> hiddenLines, CancellationToken ct)
            => BuildFilterFromStreamAsync(new FilterOptionsDto
            {
                Pattern = string.Empty,
                IsRegex = false,
                CaseSensitive = false,
                HiddenLines = hiddenLines,
            }, ct, reportProgress: false);

        private record struct CompiledHiddenRule(string PlainText, bool CaseSensitive, Regex Pattern);

        private LineDto[] FilterNewLinesInline(LineDto[] lines)
        {
            var hiddenRules = _activeHiddenLines;
            var opts = _filterOptions;
            bool hasSearchPattern = opts != null && !string.IsNullOrEmpty(opts.Pattern);
            bool hasHiddenRules = hiddenRules.Any(h => h.IsActive && !string.IsNullOrWhiteSpace(h.Text));

            if (!hasSearchPattern && !hasHiddenRules) return lines;

            Regex patternRegex = null;
            if (hasSearchPattern && opts.IsRegex)
            {
                var ropts = opts.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
                patternRegex = new Regex(opts.Pattern, ropts | RegexOptions.Compiled);
            }

            return lines.Where(line =>
            {
                if (hasSearchPattern)
                {
                    bool matches = opts.IsRegex
                        ? patternRegex?.IsMatch(line.Text) == true
                        : opts.CaseSensitive
                            ? line.Text.Contains(opts.Pattern)
                            : line.Text.Contains(opts.Pattern, StringComparison.OrdinalIgnoreCase);
                    if (!matches) return false;
                }
                if (hasHiddenRules && IsHiddenByRules(line.Text, hiddenRules)) return false;
                return true;
            }).ToArray();
        }

        private static List<CompiledHiddenRule> CompileHiddenPatterns(List<HiddenLinePattern> hiddenLines)
        {
            var result = new List<CompiledHiddenRule>(hiddenLines.Count);
            foreach (var h in hiddenLines)
            {
                if (!h.IsActive || string.IsNullOrWhiteSpace(h.Text)) continue;
                Regex regex = null;
                if (h.IsRegex)
                {
                    var opts = (h.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase) | RegexOptions.Compiled;
                    regex = new Regex(h.Text, opts);
                }
                result.Add(new CompiledHiddenRule(h.IsRegex ? null : h.Text, h.CaseSensitive, regex));
            }
            return result;
        }

        private static bool IsHiddenByCompiledRules(string text, List<CompiledHiddenRule> rules)
        {
            foreach (var rule in rules)
            {
                if (rule.Pattern != null)
                {
                    if (rule.Pattern.IsMatch(text)) return true;
                }
                else if (rule.CaseSensitive)
                {
                    if (text.Contains(rule.PlainText)) return true;
                }
                else if (text.Contains(rule.PlainText, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }

        private static bool IsHiddenByRules(string text, List<HiddenLinePattern> rules)
        {
            foreach (var hidden in rules)
            {
                if (!hidden.IsActive || string.IsNullOrEmpty(hidden.Text))
                    continue;

                if (hidden.IsRegex)
                {
                    var opts = hidden.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
                    if (Regex.IsMatch(text, hidden.Text, opts))
                        return true;
                    continue;
                }

                if (hidden.CaseSensitive)
                {
                    if (text.Contains(hidden.Text))
                        return true;
                }
                else if (text.Contains(hidden.Text, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }

            return false;
        }

        public async Task ApplyFilterAsync(FilterOptionsDto options, CancellationToken ct = default)
        {
            _filterOptions = options;
            _filterEnabled = true;
            _isFilterBuilding = true;
            try
            {
                _activeHiddenLines = (options.HiddenLines ?? new())
                    .Where(hidden => hidden != null)
                    .Select(hidden => new HiddenLinePattern
                    {
                        Text = hidden.Text,
                        IsRegex = hidden.IsRegex,
                        CaseSensitive = hidden.CaseSensitive,
                        IsActive = hidden.IsActive,
                    })
                    .ToList();

                var progress = _logHub.Clients.Group(SessionId);
                var newFilter = await BuildFilterFromStreamAsync(options, ct, reportProgress: true);

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
            if (_activeHiddenLines.Any(hidden => hidden.IsActive && !string.IsNullOrWhiteSpace(hidden.Text)))
            {
                await ApplyFilterAsync(new FilterOptionsDto
                {
                    Pattern = string.Empty,
                    IsRegex = false,
                    CaseSensitive = false,
                    HiddenLines = _activeHiddenLines
                        .Select(hidden => new HiddenLinePattern
                        {
                            Text = hidden.Text,
                            IsRegex = hidden.IsRegex,
                            CaseSensitive = hidden.CaseSensitive,
                            IsActive = hidden.IsActive,
                        })
                        .ToList(),
                });
                return;
            }

            _filterEnabled = false;
            _filterOptions = null;
            Volatile.Write(ref _filter, null);
            Interlocked.Increment(ref _viewVersion);
            await _logHub.Clients.Group(SessionId).SendAsync("OnFileStats", SessionId,
                new FileStatsDto { TotalLines = _index.Count, SizeBytes = _index.TotalBytes, IsIndexed = true, ServerId = ServerId, FilePath = FilePath, ViewVersion = ViewVersion });
        }

        public void SetHiddenLines(IEnumerable<HiddenLinePattern> hiddenLines)
        {
            var patterns = (hiddenLines ?? Enumerable.Empty<HiddenLinePattern>())
                .Where(hidden => hidden != null)
                .Select(hidden => new HiddenLinePattern
                {
                    Text = hidden.Text,
                    IsRegex = hidden.IsRegex,
                    CaseSensitive = hidden.CaseSensitive,
                    IsActive = hidden.IsActive,
                })
                .ToList();
            _activeHiddenLines = patterns;

            // If the index is already complete (profile changed after initial load),
            // apply the hidden filter in the background so hidden lines disappear.
            if (_isIndexComplete)
            {
                _ = ClearFilterAsync();
            }
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

        private static Encoding ResolveEncoding(string name)
        {
            if (string.IsNullOrWhiteSpace(name) || name.Equals("Default", StringComparison.OrdinalIgnoreCase))
                return Encoding.UTF8;
            try { return Encoding.GetEncoding(name); }
            catch { return Encoding.UTF8; }
        }
    }
}
