using LogWatcher.Web.Dto;

namespace LogWatcher.Web.Sessions
{
    /// <summary>
    /// Common surface shared by all "open tab" sessions: a live tailed file (<see cref="WatchSession"/>)
    /// or a static content-search result set (<see cref="SearchResultSession"/>).
    /// </summary>
    public interface IWatchSession : IAsyncDisposable
    {
        string SessionId { get; }
        string ServerId { get; }
        string FilePath { get; }
        int ViewVersion { get; }

        Task<LineDto[]> ReadFilteredLinesAsync(int startFilteredLine, int count, CancellationToken ct = default);
        Task<ContextLinesDto> ReadContextLinesAsync(int selectedLine, int radius, CancellationToken ct = default);
        Task ApplyFilterAsync(FilterOptionsDto options, CancellationToken ct = default);
        Task ClearFilterAsync();
        void SetHiddenLines(IEnumerable<HiddenLinePattern> hiddenLines);
        void SetTail(bool tail);
        Task SendCurrentStatsAsync();
    }
}
