using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Timers;

namespace LogWatcher.Common
{
    public class FileWatcherCustom : ILogWatcherCustom
    {
        #region Fields

        private Timer _fileWatcherTimer = new Timer();
        private long filePositionBeginOrg;
        private bool _abort;
        private readonly object objSync = new object();
        private long _previousLength;
        private long _loadingMaxValue;
        private Encoding _encoding;
        private bool _isLoaded;
        private bool _isFirstLine;
        private bool _isLastLine;
        private bool _isReseted;
        private FileInfo _logFile;


        #endregion


        #region Properties

        public long loadingMaxValue
        {
            [DebuggerStepThrough]
            get { return _loadingMaxValue; }
        }

        public long LoadingFilePosition { get; set; }
        public string Name { get; private set; }
        public string FullName { get; private set; }

        public long Size
        {
            get
            {
                _logFile.Refresh();
                if (_logFile.Exists)
                {
                    return _logFile.Length;
                }

                return 0;
            }
        }

        public string SizeToDisplay
        {
            get
            {
                long fileSize = Size;
                return Tools.DisplayFileSize(fileSize);
            }
        }

        public bool Exist
        {
            get
            {
                _logFile.Refresh();
                return _logFile.Exists;
            }
        }

        public bool PartialLoad { get; private set; }

        #endregion

        #region Event

        public event EventHandler<NewRowEventArgs> NewRows;
        public event EventHandler<EventArgs> EndOfLog;
        public event EventHandler<EventArgs> ReloadLog;
        public event EventHandler<EventArgs> InitialLoadFinished;

        #endregion

        #region Constructors
        
        #endregion

        #region Event handler

        private void OnFileWatcherTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            lock (objSync)
            {
                if (_fileWatcherTimer != null)
                    _fileWatcherTimer.Stop();

                LoadData();

                if (_fileWatcherTimer!=null)
                    _fileWatcherTimer.Start();
            }
        }

        #endregion

        #region Methods

        public void Init(string fullName, Encoding encoding)
        {
            Init(new FileInfo(fullName), encoding, false, 0, 0);
        }

        public void Init(FileInfo logFile, Encoding encoding, bool partialLoad, long partialLoadSize, long partialLoadSizeFrom)
        {
            //if (!File.Exists(fullName))
            //{
            //    throw new FileNotFoundException("Impossible to found log file : " + fullName);
            //}

            _logFile = logFile;
            PartialLoad = partialLoad;
            filePositionBeginOrg = partialLoadSize;
            LoadingFilePosition = (PartialLoad && logFile.Length > filePositionBeginOrg) ? logFile.Length - filePositionBeginOrg : 0;
            _loadingMaxValue = 0;
            _previousLength = 0;
            _encoding = encoding;
            _isLoaded = false;
            _isFirstLine = true;
            _isLastLine = false;
            Name = logFile.Name;
            FullName = logFile.FullName;

            _fileWatcherTimer.Elapsed += OnFileWatcherTimer_Elapsed;
            _fileWatcherTimer.Interval = 500;
            _fileWatcherTimer.AutoReset = true;
        }

        public void Start()
        {
            _abort = false;
            if (_fileWatcherTimer != null && !_fileWatcherTimer.Enabled)
                _fileWatcherTimer.Start();
        }

        public void Stop()
        {
            if (_fileWatcherTimer != null)
                _fileWatcherTimer.Stop();
            _abort = true;
        }

        public void Reset(string newFileName)
        {
            if (_fileWatcherTimer != null)
                _fileWatcherTimer.Stop();
            FullName = newFileName;
            _logFile = new FileInfo(newFileName);
            Reset();
        }

        public void Reset()
        {
            if (_fileWatcherTimer != null)
                _fileWatcherTimer.Stop();

            LoadingFilePosition = (PartialLoad && _logFile.Length > filePositionBeginOrg) ? _logFile.Length - filePositionBeginOrg : 0;
            _loadingMaxValue = 0;
            _previousLength = 0;
            _isFirstLine = true;
            _isLastLine = false;
            _isLoaded = false;
            _abort = false;

            if (_fileWatcherTimer != null)
                _fileWatcherTimer.Start();
        }

        private void LoadData()
        {
            try
            {
                _isLastLine = false;
                Encoding encoding = _encoding;

                _logFile.Refresh();
                if (_logFile.Exists && _logFile.Length >= _previousLength) // on test si la taille du fichier est inférieur a la précédente (si oui c'est que le fichier a changé ou a été vidé)
                {
                    _isReseted = false;
                    _previousLength = _logFile.Length;
                    using (StreamReader sr = new StreamReader(new BufferedStream(new FileStream(_logFile.FullName, FileMode.Open,
                                                                                                FileAccess.Read, FileShare.ReadWrite | FileShare.Delete)), encoding, false))
                    {
                        _loadingMaxValue = (int)(sr.BaseStream.Length / 2);
                        if (sr.BaseStream.Length == LoadingFilePosition)// le fichier n'a pas changer, donc on quitte
                        {
                            return;
                        }
                        if (sr.BaseStream.Length > LoadingFilePosition)
                        {
                            sr.BaseStream.Position = LoadingFilePosition;
                        }
                        else // le fichier à été supprimer ou a completement changer donc on le recharge completement
                        {
                            _isReseted = true;
                            Reset();
                            RaiseReloadFileEvent();
                        }

                        if (!_isLoaded && !sr.EndOfStream)
                        {
                            if (PartialLoad)
                            {
                                sr.ReadLine(); // For partial load first line is always cut so we skip it
                            }
                        }

                        while (!sr.EndOfStream && !_abort)
                        {
                            string mess = sr.ReadLine();

                            if (!String.IsNullOrEmpty(mess))
                            {
                                if (sr.EndOfStream)
                                {
                                    _isLastLine = true;
                                }
                                RaiseNewRowsEvent(mess);
                            }
                            LoadingFilePosition = sr.BaseStream.Position;
                            _isFirstLine = false;
                        }

                    }

                    if (EndOfLog != null)
                        EndOfLog(this, new EventArgs());

                    if (!_isLoaded && InitialLoadFinished != null)
                    {
                        InitialLoadFinished(this, new EventArgs());
                    }

                    _isLoaded = true;
                }
                else
                {
                    if (!_isReseted)
                    {
                        _isReseted = true;
                        Reset();
                        RaiseReloadFileEvent();
                    }
                }
            }
            catch (Exception ex)
            {
                Trace.WriteLine(String.Format("{0} {1} : {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), ex));
            }
        }

        private void RaiseNewRowsEvent(string newLine)
        {
            if (NewRows != null)
                NewRows(this, new NewRowEventArgs(newLine, !_isLoaded, _isFirstLine, _isLastLine));
        }

        private void RaiseReloadFileEvent()
        {
            if (ReloadLog != null)
                ReloadLog(this, new EventArgs());
        }

        #endregion

        public void Dispose()
        {
                Stop();
                _fileWatcherTimer.Close();
                _fileWatcherTimer = null;
        }

        
    }

    public class NewRowEventArgs : EventArgs
    {
        private readonly string newLine;
        public bool IsFirstPass { get; set; }
        public bool IsFirstLine { get; set; }
        public bool IsLastLine { get; set; }

        public string NewLine
        {
            get { return newLine; }
        }

        /// <summary>
        /// Initialise une nouvelle instance de la classe <see cref="T:System.EventArgs" />.
        /// </summary>
        public NewRowEventArgs(string newLine, bool isFirstPass, bool isFirstLine, bool isLastLine)
        {
            this.newLine = newLine;
            IsFirstPass = isFirstPass;
            IsFirstLine = isFirstLine;
            IsLastLine = isLastLine;
        }
    }
}
