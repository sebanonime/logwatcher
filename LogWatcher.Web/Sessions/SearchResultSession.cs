using System.Text.RegularExpressions;
using LogWatcher.Web.Dto;
using LogWatcher.Web.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace LogWatcher.Web.Sessions
{
    /// <summary>
    /// A static "virtual" session that serves the results of a content search as if they were
    /// a single log file. The line set is computed once (by ContentSearchService) and never
    /// changes afterwards; filtering/clearing operate over that in-memory snapshot.
    /// </summary>
    public class SearchResultSession : IWatchSession
    {
        public string SessionId { get; }
        public string ServerId => string.Empty;
        public string FilePath => string.Empty;

        private int _viewVersion;
        public int ViewVersion => Volatile.Read(ref _viewVersion);

        private readonly IHubContext<LogHub> _logHub;
        private readonly string _openingConnectionId;
        private readonly CancellationTokenSource _cts = new();

        private volatile LineDto[] _allLines = Array.Empty<LineDto>();
        private volatile int[] _filterIndices; // null = no filter active

        public CancellationToken ScanCancellationToken => _cts.Token;

        public SearchResultSession(string sessionId, IHubContext<LogHub> logHub, string openingConnectionId)
        {
            SessionId = sessionId;
            _logHub = logHub;
            _openingConnectionId = openingConnectionId;
        }

        /// <summary>Called once by WatchSessionManager after the background search scan completes.</summary>
        public void SetResults(List<LineDto> lines) => _allLines = lines.ToArray();

        public Task<LineDto[]> ReadFilteredLinesAsync(int startFilteredLine, int count, CancellationToken ct = default)
        {
            var indices = _filterIndices;
            var all = _allLines;
            int total = indices?.Length ?? all.Length;
            if (startFilteredLine >= total || count <= 0)
                return Task.FromResult(Array.Empty<LineDto>());

            int end = Math.Min(total, startFilteredLine + count);
            var result = new LineDto[end - startFilteredLine];
            for (int i = startFilteredLine; i < end; i++)
            {
                var src = all[indices != null ? indices[i] : i];
                result[i - startFilteredLine] = new LineDto { LineNumber = i, Text = src.Text };
            }
            return Task.FromResult(result);
        }

        public Task<ContextLinesDto> ReadContextLinesAsync(int selectedLine, int radius, CancellationToken ct = default)
        {
            var indices = _filterIndices;
            var all = _allLines;
            int total = indices?.Length ?? all.Length;
            int start = Math.Max(0, selectedLine - radius);
            int end = Math.Min(total - 1, selectedLine + radius);
            if (start > end)
                return Task.FromResult(new ContextLinesDto { TargetLineNumber = selectedLine, Lines = Array.Empty<LineDto>() });

            var lines = new LineDto[end - start + 1];
            for (int i = start; i <= end; i++)
            {
                var src = all[indices != null ? indices[i] : i];
                lines[i - start] = new LineDto { LineNumber = i, Text = src.Text };
            }
            return Task.FromResult(new ContextLinesDto { TargetLineNumber = selectedLine, Lines = lines });
        }

        public Task ApplyFilterAsync(FilterOptionsDto options, CancellationToken ct = default)
        {
            var all = _allLines;
            int[] indices;

            if (string.IsNullOrWhiteSpace(options?.Pattern))
            {
                indices = null;
            }
            else
            {
                Regex regex = null;
                if (options.IsRegex)
                {
                    try
                    {
                        regex = new Regex(options.Pattern, options.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase);
                    }
                    catch { regex = null; }
                }

                var comparison = options.CaseSensitive ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase;
                var matched = new List<int>();
                for (int i = 0; i < all.Length; i++)
                {
                    bool isMatch = regex != null
                        ? regex.IsMatch(all[i].Text)
                        : all[i].Text.Contains(options.Pattern, comparison);
                    if (isMatch) matched.Add(i);
                }
                indices = matched.ToArray();
            }

            _filterIndices = indices;
            Interlocked.Increment(ref _viewVersion);

            return SendStatsAsync(indices?.Length ?? all.Length);
        }

        public Task ClearFilterAsync()
        {
            _filterIndices = null;
            Interlocked.Increment(ref _viewVersion);
            return SendStatsAsync(_allLines.Length);
        }

        public void SetHiddenLines(IEnumerable<HiddenLinePattern> hiddenLines)
        {
            // Search-result tabs don't support hidden-line profiles.
        }

        public void SetTail(bool tail)
        {
            // Search-result tabs are static snapshots; tailing does not apply.
        }

        public Task SendCurrentStatsAsync()
        {
            var indices = _filterIndices;
            return SendStatsAsync(indices?.Length ?? _allLines.Length);
        }

        private async Task SendStatsAsync(int totalLines)
        {
            var stats = new FileStatsDto
            {
                TotalLines = totalLines,
                SizeBytes = 0,
                IsIndexed = true,
                ServerId = ServerId,
                FilePath = FilePath,
                ViewVersion = ViewVersion,
            };
            await _logHub.Clients.Group(SessionId).SendAsync("OnFileStats", SessionId, stats);
            if (!string.IsNullOrWhiteSpace(_openingConnectionId))
                await _logHub.Clients.Client(_openingConnectionId).SendAsync("OnFileStats", SessionId, stats);
        }

        public ValueTask DisposeAsync()
        {
            _cts.Cancel();
            _cts.Dispose();
            return ValueTask.CompletedTask;
        }
    }
}
