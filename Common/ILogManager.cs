namespace LogWatcher.Common
{
    public interface ILogManager
    {
        event Action<LogRow> NewLine;

        event Action LoadFinished;

        Profile CurrentProfile { get; }
        //FileInfo LogFile { get; set; }
        ILogWatcherCustom LogWatch { get; }
        ListLog LogCache { get; }
        //int SelectedRowIndex { get; }
        //string SelectedRowText { get; }
        bool Tail { get; set; }

        void CancelFilter();
        //void FilterForPlugin(string critere, RegexOptions options);
        //void OpenFileForPlugin(string fileName);
    }
}
