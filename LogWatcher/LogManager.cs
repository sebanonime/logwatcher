using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Windows.Forms;
using System.Drawing;
using System.Threading;
using System.Text.RegularExpressions;
using System.Collections;
using LogWatcher.Frm;
using LogWatcher.LogWatcherEventArgs;
using LogWatcher.Common;
using Timer=System.Timers.Timer;
using LogWatcher.Common.ThreadDispatcher;
using System.Configuration;

namespace LogWatcher
{
    internal class LogManager : ILogManager
    {
        #region Struct, Fields, Const


        //public const int COLUMN_META = 0;
        public const int COLUMN_DATA = 0;

        private readonly Highlighting DEFAULT_COLOR = new Highlighting(0, "", Color.Black, Color.White);

        private string _currentProfileName;

        private Regex _filterRegex;
        private Regex _startupFilter;

        private bool _tail;
        //private bool _isFirstPass = true;
        private int _maxLineSize;
        private readonly Queue<string> _alerts = new Queue<string>();

        private long _loadingMaxValue;

        private int _lastSearchIdx;
        private int _endSearchIdx;
        private int _nbrDisplayedRows;
        private int _scrollPosition;
        private int? _selectedRowIndexBeforeFilter;

        private readonly RollingList<int> _allSelectedRows = new RollingList<int>(100);

        private readonly Timer _loadingTimer = new Timer();
        private Timer _refreshGuiTimer = new Timer();
        //private readonly System.Timers.Timer _alertTimer = new System.Timers.Timer();

        private readonly Frm_Master _parent;
        private bool _refreshGUI;
        private bool _isFullLoading;

        private readonly object _syncObj = new object();
        private bool _isDiposed;
        private bool _activatePluggin;

        private Stopwatch _chrono;

        private delegate void LoadDataDelegate();

        //private SequencerDispatcher _lineDispatcher;
        //private SimpleDispatcher _simpleLineDispatcher;

        #endregion


        #region LogManager Events

        public event EventHandler<LoadingEventArgs> OnLoading;
        //public event EventHandler<AlertEventArgs> OnUpdateInfo;
        public event EventHandler<EventArgs> OnSelectionChanged;
        public event EventHandler<EventArgs> OnDoubleClick;
        
        #endregion


        #region Properties

        public ILogWatcherCustom LogWatch { get; private set; }

        //public FileInfo LogFile { get; set; }

        public ListLog LogCache { get; private set; }

        internal Frm_Doc Frm_Log { get; set; }

        public Guid Id { get; private set; }

        public bool Tail
        {
            get { return _tail; }
            set
            {
                if (GridView.RowCount > 0)
                    GridView.FirstDisplayedScrollingRowIndex = GridView.RowCount - 1;
                _tail = value;
            }
        }

        internal DataGridView GridView { get; private set; }

        public Profile CurrentProfile
        {
            get
            {
                if (LogConfig.Singleton.DicoProfile.ContainsKey(CurrentProfileName))
                    return LogConfig.Singleton.DicoProfile[CurrentProfileName];

                return new Profile("");
            }
        }

        internal string CurrentProfileName
        {
            get { return _currentProfileName; }
            set 
            {
                _currentProfileName = value;
                ReLoadData();
            }
        }

        internal long NbrRows
        {
            get
            {
                return LogCache != null ? LogCache.Count : 0;
            }
        }

        internal int NbrRowsHidden { get; private set; }

        internal bool IsFirstNavigator
        {
            get { return _allSelectedRows.IsFirst; }
        }

        internal bool IsLastNavigator
        {
            get { return _allSelectedRows.IsLast; }
        }

        internal bool PartialLoad { get; set; }
        internal int SizeToLoad { get; set; }

        internal bool LoadWithFilter { get; set; }

        public int SelectedRowIndex
        {
            get
            {
                int idx = 0;
                if (GridView.SelectedRows.Count > 0)
                {
                    idx = GridView.SelectedRows[0].Index;
                    _allSelectedRows.Add(idx);
                }
                return idx;
            }
        }

        public string SelectedRowText
        {
            get
            {
                string resu = "";
                if (GridView.SelectedRows.Count > 0 && GridView.SelectedRows[0].Cells[0].Value != null)
                {
                    resu = LogCache[GridView.SelectedRows[0].Index];
                    //resu = GridView.SelectedRows[0].Cells[0].Value.ToString();
                }

                return resu;
            }
        }

        

        #endregion


        #region Constructor

        //public LogManager(string logFullName, string profileName, Regex filter) :
        //    this(logFullName, profileName, null, LogConfig.Singleton.LoadOnlyEof, LogConfig.Singleton.EofSizeToLoad) { }

        public LogManager(FileInfo logFile, string profileName, Regex filter, bool loadOnlyEof, int sizeToLoad)
        {
            string _activatePlugginStr = ConfigurationManager.AppSettings["ActivatePluggin"];
            if (!string.IsNullOrEmpty(_activatePlugginStr))
                bool.TryParse(_activatePlugginStr, out _activatePluggin);

            
            string maxLineSizeStr = ConfigurationManager.AppSettings["MaxLineSize"];
            if (!int.TryParse(maxLineSizeStr, out _maxLineSize))
            {
                _maxLineSize = 20000;
            }

            //Trace.WriteLine(string.Format("{0} : start", DateTime.Now.Ticks.ToString()));
            //_chrono = Stopwatch.StartNew();
            _startupFilter = filter;
            SizeToLoad = sizeToLoad;
            LoadWithFilter = _startupFilter != null;
            _currentProfileName = profileName;
            PartialLoad = loadOnlyEof;
            LogCache = new ListLog(filter != null ? filter.ToString() : string.Empty, CurrentProfile.DicoHiddenLog);
            GridView = new DataGridView();
            //_lineDispatcher = new SequencerDispatcher(4, "LineDispatcher");
            //_lineDispatcher.TaskFinished += new EventHandler<TaskFinishedEventArgs>(OnDispatcher_TaskFinished);
            //_lineDispatcher.UnhandleError += new EventHandler<DispatcherErrorEventArgs>(OnDispatcher_UnhandleError);

            //_simpleLineDispatcher = new SimpleDispatcher(1, "SimpleLineDispatcher");
            //_simpleLineDispatcher.TaskFinished += OnDispatcher_TaskFinished;

            //chrono = Stopwatch.StartNew();
            Id = Guid.NewGuid();
            _parent = Frm_Master.Singleton;
            //LogFile = new FileInfo(logFullName);

            Init();

            //FileInfo logFile = new FileInfo(logFullName);
            
            //_alertTimer.Elapsed += OnAlertTimer_Elapsed;
            //_alertTimer.Interval = 5000;
            //_alertTimer.AutoReset = true;

            _loadingTimer.Elapsed += OnLoadingTimer_Elapsed;
            _loadingTimer.Interval = 50;
            _loadingTimer.AutoReset = true;

            LogWatch = CreateNewLogWatcherCustom(logFile, loadOnlyEof, sizeToLoad);
            LogWatch.Start();

            InitialiseRefreshGuiTimer();
            //_refreshGuiTimer.Start();
        }

        
        private void InitialiseRefreshGuiTimer()
        {
            _refreshGuiTimer = new Timer();
            _refreshGuiTimer.Elapsed += OnRefreshGuiTimer_Elapsed;
            _refreshGuiTimer.Interval = Frm_Master.GuiRefreshTimer;
            _refreshGuiTimer.AutoReset = true;
        }

        private ILogWatcherCustom CreateNewLogWatcherCustom(FileInfo logFile, bool loadOnlyEof, int sizeInBytes)
        {
            //int sizeInBytes = LogConfig.Singleton.EofSizeToLoad * 1000000;
            //int sizeInBytes = sizeToLoad * 1000000;

            Encoding encoding = GetEncoding();
            ILogWatcherCustom fileWatcherTmp = new FileWatcherCustom();
            fileWatcherTmp.Init(logFile, encoding, loadOnlyEof, sizeInBytes, 0);

            fileWatcherTmp.NewRows += OnNewRows;
            fileWatcherTmp.ReloadLog += OnReloadFile;
            fileWatcherTmp.EndOfLog += OnEndOfFile;
            fileWatcherTmp.InitialLoadFinished += OnInitialLoadFinished;

            return fileWatcherTmp;
        }

        private Encoding GetEncoding()
        {
            Encoding encoding;
            if (CurrentProfile.Encoding != null)
            {
                encoding = LogConfig.Singleton.MapEncoding(CurrentProfile.Encoding);
            }
            else
            {
                encoding = LogConfig.Singleton.DefaultEncoding != null
                               ? LogConfig.Singleton.MapEncoding(LogConfig.Singleton.DefaultEncoding)
                               : Encoding.Default;
            }
            return encoding;
        }

        #endregion


        #region Events Handlers

        #region GUI

        private void OnCellValueNeeded(object sender, DataGridViewCellValueEventArgs e)
        {
            #region Pour afficher la bonne valeur
            string val = string.Empty;
            if (e.RowIndex < LogCache.Count)
            {
                
                if (e.ColumnIndex == COLUMN_DATA)
                {
                    val = LogCache[e.RowIndex];
                    e.Value = val.Length > _maxLineSize && _maxLineSize > 0 ? val.Substring(0, _maxLineSize) : val;
                }
                //else if (e.ColumnIndex == COLUMN_META)
                //{
                //    e.Value = e.RowIndex;
                //    GridView[e.ColumnIndex, e.RowIndex].Style.BackColor = Color.Aqua;
                //    GridView[e.ColumnIndex, e.RowIndex].Style.ForeColor = Color.White;
                //}
            }

            #endregion

            #region pour le WrapLine

            GridView[e.ColumnIndex, e.RowIndex].Style.WrapMode = DataGridViewTriState.False;

            #endregion

            //#region Pour la couleur des lignes

            //Highlighting resu = GiveMeRowColor(LogConfig.Singleton.DicoHighlighting, e.Value.ToString(), true);
            //if (resu != null)
            //{
            //    GridView[e.ColumnIndex, e.RowIndex].Style.BackColor = resu.BackColor;
            //    GridView[e.ColumnIndex, e.RowIndex].Style.ForeColor = resu.ForeColor;
            //    GridView[e.ColumnIndex, e.RowIndex].Style.Font = new Font(LogConfig.Singleton.DefaultFont.GetFont(), resu.Bold ? FontStyle.Bold : FontStyle.Regular);
            //}

            //#endregion

            if (_tail && GridView.RowCount > 0 && e.RowIndex < LogCache.Count /*- _dgv.DisplayedRowCount(false)*/)
            {
                GridView.FirstDisplayedScrollingRowIndex = GridView.RowCount - 1;
            }
        }

        private void OnCellFormatting(object sender, DataGridViewCellFormattingEventArgs e)
        {
            #region Pour la couleur des lignes

            if (e.Value != null)
            {
                Highlighting resu = GiveMeRowColor(LogConfig.Singleton.DicoHighlighting, e.Value.ToString(), true);
                if (resu != null)
                {
                    e.CellStyle.BackColor = resu.BackColor;
                    e.CellStyle.ForeColor = resu.ForeColor;
                    e.CellStyle.Font = new Font(LogConfig.Singleton.DefaultFont.GetFont(), resu.Bold ? FontStyle.Bold : FontStyle.Regular);
                }
            }

            #endregion
        }

        private void OnDgv_Scroll(object sender, ScrollEventArgs e)
        {
            if (e.ScrollOrientation == ScrollOrientation.VerticalScroll)
            {
                //we activate scroll when it's at the last line else we desactivate it
                _nbrDisplayedRows = GridView.DisplayedRowCount(true);
                _scrollPosition = e.NewValue;
                _tail = e.NewValue + _nbrDisplayedRows >= NbrRows;
                _parent.ChangeTailImage();
            }
        }

        void OnDgvSelectionChanged(object sender, EventArgs e)
        {
            if (OnSelectionChanged != null)
                OnSelectionChanged(this, new EventArgs());
        }

        void OnDgv_DoubleClick(object sender, EventArgs e)
        {
            if (OnDoubleClick != null)
                OnDoubleClick(this, new EventArgs());
        }

        #endregion

        #region Timers

        private void OnRefreshGuiTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            //chrono.Stop();
            //chrono = Stopwatch.StartNew();

            if (_refreshGUI)
            {
                _refreshGUI = false;
                UpdateGridView();
            }
        }

        private void OnLoadingTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            int loadingPos;
            if (LogCache.IsLoading)
            {
                loadingPos = LogCache.LoadingPosition;
            }
            else
            {
                loadingPos = (int)(LogWatch.LoadingFilePosition / 2);
            }

            RaiseLoadingEvent(loadingPos, _loadingMaxValue);
        }

        #endregion

        #region File event

        private void OnReloadFile(object sender, EventArgs e)
        {
            ExecuteReloadFile();
        }

        private void OnNewRows(object sender, NewRowEventArgs e)
        {
            ExecuteNewLines(e, false);
        }

        void OnEndOfFile(object sender, EventArgs e)
        {
            if (!_isFullLoading) //:-)
                DisplayLines();
        }

        void OnInitialLoadFinished(object sender, EventArgs e)
        {
            Frm_Log.EndLoading();

            lock (_syncObj)
            {
                if (_refreshGuiTimer != null)
                    _refreshGuiTimer.Start();

                if (_loadingTimer != null)
                    _loadingTimer.Stop();
            }
            
            _chrono.Stop();
            //Trace.WriteLine(string.Format("{0} : {1} - count={2} - countAll={3}", DateTime.Now.Ticks.ToString(), _chrono.Elapsed.ToString(), LogCache.Count, LogCache.CountAll));
        }

        #endregion

        #endregion

        #region Methods

        private void Init()
        {
            // Enable virtual mode.
            GridView.VirtualMode = true;

            // Connect the virtual-mode events to event handlers. 
            GridView.CellValueNeeded += OnCellValueNeeded;
            GridView.Scroll += OnDgv_Scroll;
            GridView.DoubleClick += OnDgv_DoubleClick;

            GridView.SelectionChanged += OnDgvSelectionChanged;
            GridView.CellFormatting += OnCellFormatting;

            DataGridViewTextBoxColumn MessageNameColumn = new DataGridViewTextBoxColumn
              {
                  HeaderText = "Message",
                  Name = "Message",
                  ValueType = typeof (String),
                  AutoSizeMode = DataGridViewAutoSizeColumnMode.None,
                  Width = 20000
              };

            //DataGridViewTextBoxColumn MetaDataColumn = new DataGridViewTextBoxColumn
            //{
            //    HeaderText = "Meta",
            //    Name = "Meta",
            //    ValueType = typeof(String),
            //    AutoSizeMode = DataGridViewAutoSizeColumnMode.None,
            //    Width = 50,
            //};

            //GridView.Columns.Add(MetaDataColumn);
            GridView.Columns.Add(MessageNameColumn);
            
            // defini l'apparence du datagridview
            GridView.ReadOnly = true;
            GridView.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            GridView.Dock = DockStyle.Fill;
            GridView.CausesValidation = false;
            GridView.RowHeadersVisible = false;
            GridView.ColumnHeadersVisible = false;
            GridView.AllowUserToResizeRows = false;
            GridView.AllowUserToResizeColumns = false;
            GridView.AllowUserToAddRows = false;
            GridView.AllowUserToDeleteRows = false;
            GridView.CellBorderStyle = DataGridViewCellBorderStyle.None;
            GridView.RowTemplate.DefaultCellStyle.Font = LogConfig.Singleton.DefaultFont.GetFont();

            GridView.Margin = new Padding(0);

            GridView.ClipboardCopyMode = DataGridViewClipboardCopyMode.EnableWithoutHeaderText;


            GridView.RowTemplate.DefaultCellStyle.WrapMode = DataGridViewTriState.False;
            GridView.AutoSizeRowsMode = DataGridViewAutoSizeRowsMode.None;
            GridView.RowTemplate.Height = 18;
            //GridView.Columns[COLUMN_DATA].AutoSizeMode = DataGridViewAutoSizeColumnMode.None;
            //GridView.Columns[COLUMN_DATA].Width = 20000;
        }

        private void ExecuteReloadFile()
        {
            ReLoadData();
        }

        private void ExecuteNewLines(NewRowEventArgs e, bool isReloading)
        {
            try
            {
                #region Treat First line

                if ((e.IsFirstPass && e.IsFirstLine) || isReloading)
                {
                    //_isFullLoading = true;
                    _chrono = Stopwatch.StartNew();
                    _loadingMaxValue = LogWatch.Size/2;

                    //if (_refreshGuiTimer == null && !_isDiposed)
                    //{
                    //    InitialiseRefreshGuiTimer();
                    //}

                    //if (!_isDiposed && _refreshGuiTimer != null && !_refreshGuiTimer.Enabled)
                    //{
                    //    _refreshGuiTimer.Start();
                    //}
                    if (_isDiposed)
                        return;

                    if (_loadingTimer != null)
                        _loadingTimer.Start();
                }

                #endregion

                bool visible = true;
                // for loading with a startup filter
                if (_startupFilter != null)
                {
                    visible = _startupFilter.IsMatch(e.NewLine);
                }
                else
                {
                    visible = TestLineVisibility(e.NewLine); // perf bad
                }

                if (visible && !string.IsNullOrEmpty(e.NewLine))
                {
                    LogCache.Add(e.NewLine);
                    if (_activatePluggin)
                        PluginManager.Singleton.RaiseNewLineEvent(e.NewLine);  //perf bad
                }
                else
                {
                    NbrRowsHidden++;
                }

                #region Treat last line

                if (e.IsLastLine) // we treat the last line
                {
                    if (e.IsFirstPass || isReloading)
                    {
                        RaiseLoadingEvent(_loadingMaxValue, _loadingMaxValue);
                    }
                }

                #endregion
            }
            catch (Exception ex)
            {
                Trace.WriteLine(String.Format("{0} {1} : {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), ex));
            }
        }

        private void DisplayLines()
        {
            lock (_syncObj)
            {
                _refreshGUI = true;
                lock (_syncObj)
                {
                    if (_refreshGuiTimer == null && !_isDiposed)
                    {
                        InitialiseRefreshGuiTimer();
                    }

                    if (!_isDiposed && _refreshGuiTimer != null && !_refreshGuiTimer.Enabled)
                    {
                        _refreshGuiTimer.Start();
                    }
                }
            }

            //if (Frm_Log.IsHandleCreated && !Frm_Log.IsDisposed)
            //{
            //    Frm_Log.BeginInvoke(new LoadDataDelegate(delegate
            //                                                    {
            //                                                        //long pp = LogCache.Count == 0 ? 1 : LogCache.Count;
            //                                                        //GridView.RowCount = (int)pp;
            //                                                        //GridView.Refresh();
            //                                                        Frm_Log.EndLoading();
            //                                                    }));
            //}

            //if (_loadingTimer != null)
            //    _loadingTimer.Stop();
        }

        internal void ReLoadData()
        {
            if (LogCache.Count > 0)
            {
                //Trace.WriteLine(string.Format("{0} : Reload data - ProfileName={1}", DateTime.Now.Ticks.ToString(), CurrentProfileName));
                //_chrono = Stopwatch.StartNew();
                _refreshGuiTimer.Stop();
                _loadingTimer.Stop();
                
                Frm_Log.BeginLoading(LogWatch.Exist ? "Reloading ..." : "File not found !!");

                NbrRowsHidden = 0;
                LogCache.Clear();
                LogWatch.Reset();
            }
        }

        public Highlighting GiveMeRowColor(IList myList, string mess, bool forLevel)
        {
            foreach (Highlighting item in myList)
            {
                if (item.TestHighlighting(mess))
                {
                    if (forLevel)
                    {
                        if (item.HightPriority) // || CurrentProfile == null
                        {
                            return item;
                        }
                        
                        Highlighting profileItem = GiveMeRowColor(CurrentProfile.DicoHighLighting, mess, false);

                        if (profileItem == null)
                            return item;

                        return profileItem;
                    }
                    
                    return item;
                }
            }

            //this test is usefull when an item is not in level highlighting
            if (forLevel)
            {
                foreach (Highlighting item in CurrentProfile.DicoHighLighting)
                {
                    if (item.TestHighlighting(mess))
                        return item;
                }
            }

            if (forLevel)
                return DEFAULT_COLOR;

            return null;
        }

        #region Test Methods

        private bool TestLineVisibility(string message)
        {
            foreach (HiddenLine lineTmp in CurrentProfile.DicoHiddenLog)
            {
                if (!lineTmp.IsVisible(message))
                {
                    return false;
                }
            }

            return true;
        }


        #endregion

        #region Methods for filter

        public void FilterData(String Critere, RegexOptions option)
        {
            try
            {
                Frm_Log.BeginLoading("Filter running ...");
                if (!LogCache.IsFiltered && GridView.SelectedRows.Count > 0)
                {
                    _selectedRowIndexBeforeFilter = GridView.SelectedRows[0].Index;
                }

                LogCache.RemoveFilter();
                _loadingMaxValue = LogCache.Count;

                _refreshGuiTimer.Stop();
                _loadingTimer.Start();

                int resu;
                if ((resu = LogCache.ApplyFilter(Critere, option)) < 0)
                {
                    MessageBox.Show("Regular expression error", "Filter", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    
                    LogCache.RemoveFilter();
                    _loadingTimer.Stop();
                    Frm_Log.EndLoading();
                    _refreshGuiTimer.Start();
                    return;
                }

                UpdateGridView();

                if (resu == -2) // abort loading was pressed
                {
                    Frm_Log.EndLoading();
                    //_refreshGuiTimer.Start();
                    return;
                }

                _loadingTimer.Stop();
                
                RaiseLoadingEvent(_loadingMaxValue, _loadingMaxValue);
                Frm_Log.IsFilter = true;
                Frm_Log.EndLoading();

                _refreshGuiTimer.Start();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error : " + ex.Message, "Filter", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        public void CancelFilter()
        {
            LogCache.RemoveFilter();
            //IsFilter = false;
            UpdateGridView();
            //_parent.SetDocIcon(DocIcon.Normal);
            Frm_Log.IsFilter = false;
        }

        #endregion

        #region Methods for search

        private bool SearchText()
        {
            for (int i = _lastSearchIdx; i < _endSearchIdx; i++)
            {
                if (_filterRegex.IsMatch(LogCache[i]))
                {
                    GridView.FirstDisplayedScrollingRowIndex = i - 10 > 0 ? i - 10 : 0;

                    foreach (DataGridViewRow row in GridView.SelectedRows)
                    {
                        row.Selected = false;
                    }

                    GridView.Rows[i].Selected = true;
                    _lastSearchIdx = i + 1;
                    return true;
                }
            }
            _lastSearchIdx = 0;
            return false;
        }

        public bool SearchFirst(string text2Search)
        {
            return SearchFirst(text2Search, RegexOptions.IgnoreCase);
        }

        public bool SearchFirst(string text2Search, RegexOptions option)
        {
            return SearchFirst(0, text2Search, option);
        }

        public bool SearchFirst(int idxBegin, string text2Search, RegexOptions option)
        {
            return SearchFirst(idxBegin, LogCache.Count, text2Search, option);
        }

        public bool SearchFirst(int idxBegin, int idxEnd, string text2Search, RegexOptions option)
        {
            _endSearchIdx = idxEnd;
            _lastSearchIdx = idxBegin;
            try
            {
                _filterRegex = new Regex(text2Search, RegexOptions.Compiled | option);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Regular expression error : " + ex.Message, "Search", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return true;
            }

            return SearchText();
        }

        public bool SearchNext()
        {
            if (_filterRegex == null)
                return false;

            return SearchText();
        }

        #endregion

        #region Method to Navigate

        public bool NavigateBackward()
        {
            if (_allSelectedRows.Count > 0)
            {
                foreach (DataGridViewRow rowTmp in GridView.SelectedRows)
                {
                    rowTmp.Selected = false;
                }

                int idx = _allSelectedRows.PreviousItem;
                GridView.FirstDisplayedScrollingRowIndex = idx;
                GridView.Rows[idx].Selected = true;

                if (_allSelectedRows.IsFirst)
                    return false;
            }
            return true;
        }

        public bool NavigateFoward()
        {
            if (_allSelectedRows.Count > 0)
            {
                foreach (DataGridViewRow rowTmp in GridView.SelectedRows)
                {
                    rowTmp.Selected = false;
                }

                int idx = _allSelectedRows.NextItem;
                GridView.FirstDisplayedScrollingRowIndex = idx;
                GridView.Rows[idx].Selected = true;

                if (_allSelectedRows.IsLast)
                    return false;
            }
            return true;
        }

        public void GotoLine(int index)
        {
            index--;
            if (GridView.Rows.Count >= index)
            {
                foreach (DataGridViewRow rowTmp in GridView.SelectedRows)
                {
                    rowTmp.Selected = false;
                }

                int moveToLine = index - (_nbrDisplayedRows / 2);
                if (moveToLine > 0 && moveToLine < GridView.Rows.Count)
                    GridView.FirstDisplayedScrollingRowIndex = moveToLine;

                GridView.Rows[index].Selected = true;
            }
        }



        #endregion

        #region Methods for Plugin

        public void FilterForPlugin(string critere, RegexOptions options)
        {
            try
            {
                Frm_Master.Singleton.FilterLog(critere, options);
            }
            catch(Exception ex)
            {
                MessageBox.Show(string.Format("En error occured with the pluggin durring filter : Critere={0}\r\nMessage={1}", 
                    critere, ex.Message));
            }
        }

        public void OpenFileForPlugin(string fileName)
        {

            if (_parent.IsHandleCreated && !_parent.IsDisposed)
            {
                _parent.BeginInvoke(new LoadDataDelegate(() =>
                 {
                     try
                     {
                         Frm_Master.Singleton.OpenFile(fileName);
                     }
                     catch (Exception ex)
                     {
                         MessageBox.Show(string.Format("En error occured with the pluggin durring open file : filename={0}\r\nMessage={1}",
                                                       fileName, ex.Message));
                     }
                 }));
            }
        }

        #endregion

        public void AbortLoading()
        {
            LogWatch.Stop();
        }

        private void UpdateGridView()
        {
            if (Frm_Master.Singleton.IsHandleCreated && !Frm_Master.Singleton.IsDisposed)
            {
                Frm_Master.Singleton.BeginInvoke(new LoadDataDelegate(RefreshGridView));
            }
        }

        private void RefreshGridView()
        {
            if (GridView.RowCount > LogCache.Count)
            {
                GridView.Rows.Clear();
                GridView.RowCount = 0;
            }

            if (LogCache.Count > 0 && GridView.RowCount != LogCache.Count)
            {
                GridView.RowCount = LogCache.Count == 0 ? 1 : LogCache.Count;
                RefreshScrollPosition();
            }

            if (!_isDiposed && _refreshGuiTimer != null && !_refreshGuiTimer.Enabled)
                _refreshGuiTimer.Start();
        }

        private void RefreshScrollPosition()
        {
            ThreadPool.QueueUserWorkItem(delegate
            {
                if (Frm_Log.IsHandleCreated && !Frm_Log.IsDisposed)
                {
                    Frm_Log.BeginInvoke(new LoadDataDelegate(delegate
                    {
                        if (!_tail && GridView.RowCount > _scrollPosition
                            && GridView.FirstDisplayedScrollingRowIndex != _scrollPosition)
                        {
                            try
                            {
                                GridView.FirstDisplayedScrollingRowIndex = _scrollPosition;
                            }
                            catch 
                            {
#if DEBUG
                                throw;
#endif
                            }
                        }

                        // when filter is cancel, we return to last selectionned row
                        if (!LogCache.IsFiltered && _selectedRowIndexBeforeFilter.HasValue && GridView.Rows.Count > _selectedRowIndexBeforeFilter)
                        {
                            GridView.Rows[_selectedRowIndexBeforeFilter.Value].Selected = true;
                            GridView.FirstDisplayedScrollingRowIndex = _selectedRowIndexBeforeFilter.Value;
                            _selectedRowIndexBeforeFilter = null;
                        }
                    }));
                }
            });
        }

        private void RaiseLoadingEvent(long currentValue, long maxValue)
        {
            if (currentValue <= maxValue)
            {
                EventHandler<LoadingEventArgs> tmp = OnLoading;
                if (tmp != null)
                    tmp(this, new LoadingEventArgs(currentValue, maxValue));
            }
        }

        public void Dispose()
        {
            _isDiposed = true;
            if (LogCache != null)
            {
                LogCache.Clear();
                LogCache.Dispose();
            }

            if (_alerts != null)
                _alerts.Clear();

            if (GridView != null)
            {
                GridView.CellValueNeeded -= OnCellValueNeeded;
                GridView.Scroll -= OnDgv_Scroll;
                GridView.Rows.Clear();
            }

            LogWatch.Dispose();

            //if (_alertTimer != null)
            //{
            //    _alertTimer.Stop();
            //    _alertTimer.Dispose();
            //}

            lock (_syncObj)
            {
                if (_loadingTimer != null)
                {
                    _loadingTimer.Stop();
                    _loadingTimer.Dispose();
                }


                if (_refreshGuiTimer != null)
                {
                    _refreshGuiTimer.Stop();
                    _refreshGuiTimer.Dispose();
                }
            }

            //Trace.WriteLine("LogManager Dispose");
            //We wait the last timer callBack end
            //if (!_resetEvent.WaitOne(500, false))
            //    Trace.WriteLine("LogManager Dispose Timeout");

            //lock (OBJ_SYNC)
            //{
            //    _logs = null;
            //    _dgv = null;
            //    _alerts = null;

            //    _fileWatcherTimer = null;
            //    _alertTimer = null;
            //    _loadingTimer = null;

            //    _resetEvent = null;
            //    _filterRegex = null;
            //    //GC.Collect();
            //}
        }

        #endregion
    }
}

