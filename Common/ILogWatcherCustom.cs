using System;
using System.Text;
using System.IO;

namespace LogWatcher.Common
{
    public interface ILogWatcherCustom
    {
        long LoadingFilePosition { get; set; }
        string Name { get; }
        string FullName { get; }
        long Size { get; }
        string SizeToDisplay { get; }
        bool PartialLoad { get; }
        bool Exist { get; }
        event EventHandler<NewRowEventArgs> NewRows;
        event EventHandler<EventArgs> EndOfLog;
        event EventHandler<EventArgs> ReloadLog;
        event EventHandler<EventArgs> InitialLoadFinished;
        void Init(string fullName, Encoding encoding);
        void Init(FileInfo logFile, Encoding encoding, bool partialLoad, long partialLoadSize, long partialLoadSizeFrom);
        void Start();
        void Stop();
        void Reset();
        void Dispose();
    }
}