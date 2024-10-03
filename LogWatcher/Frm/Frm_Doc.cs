using System;
using System.Drawing;
using System.Globalization;
using System.Timers;
using System.Windows.Forms;
using WeifenLuo.WinFormsUI.Docking;
using LogWatcher.LogWatcherEventArgs;
using LogWatcher.Frm;
using System.Threading;
using System.Text.RegularExpressions;

namespace LogWatcher
{
    internal partial class Frm_Doc : DockContent
    {
        #region Fields

        private bool _isFilter;
        private bool _isPartiallyLoaded;
        private int _maxValue, _currentValue;
        private delegate void GUIDelegate();
        private readonly LogManager _log;
        private readonly System.Timers.Timer _refreshTimer = new System.Timers.Timer();

        #endregion

        #region Properties

        public Guid Id { get; set; }

        public bool IsFilter
        {
            get { return _isFilter; }
            set
            {
                _isFilter = value;
                if (LogConfig.Singleton.ShowWarnBanner)
                {
                    ChangeLoadingStatus(false);
                    //if (_isFilter)
                    //{
                    //    AddFilteredBanner();
                    //}
                    //else
                    //{
                    //    Lbl_Banner.Visible = false;
                    //    if (_isPartiallyLoaded)
                    //    {
                    //        AddPartialLoadBanner();
                    //    }
                    //    if (_log.LoadWithFilter)
                    //    {
                    //        AddLoadedWithFilterBanner();
                    //    }
                    //}
                }
            }
        }

        #endregion

        #region Constructor

        internal Frm_Doc(LogManager log)
        {
            InitializeComponent();

            _log = log;
            _log.OnLoading += OnFileLoading;
            Id = Guid.NewGuid();
            TabText = log.LogWatch.Name;
            ToolTipText = log.LogWatch.FullName;

            if (LogConfig.Singleton.ShowWarnBanner && log.PartialLoad)
            {
                AddPartialLoadBanner();
                _isPartiallyLoaded = true;
            }

            if(log.LogCache.IsFiltered)
            {
                IsFilter = true;
            }

            Pnl_Container.Controls.Add(log.GridView, 0, 1);


            _refreshTimer.Elapsed += OnRefreshTimer_Elapsed;
            _refreshTimer.Interval = 100;
            _refreshTimer.AutoReset = true;
        }

        

        #endregion

        #region Event handler

        #region GUI

        private void Frm_Doc_Shown(object sender, EventArgs e)
        {
            BeginLoading("Loading file ...");
        }

        private void changeDispayedNameToolStripMenuItem_Click(object sender, EventArgs e)
        {
            InputBox InBox = new InputBox();
            string resultat;
            if ((resultat = InBox.ShowDialog("New tab name ?", TabText)) != null)
                TabText = resultat;
        }

        private void Lbl_Banner_DoubleClick(object sender, EventArgs e)
        {
            Frm_FilterViewer viewer = new Frm_FilterViewer();
            string filter = string.IsNullOrEmpty(_log.LogCache.FilterCritere) ? _log.LogCache.OriginalFilterCritere : _log.LogCache.FilterCritere;
            RegexOptions reOption = string.IsNullOrEmpty(_log.LogCache.FilterCritere) ? RegexOptions.None : _log.LogCache.FilterOption;
            if (viewer.ShowDialog(filter))
            {
                ThreadPool.QueueUserWorkItem(delegate
                                                 {
                                                     Frm_Master.Singleton.FilterLog(viewer.Filter, reOption);
                                                     //_log.FilterData(viewer.Filter);
                                                 });
                Application.DoEvents();
            }
        }

        private void Btn_StopLoading_Click(object sender, EventArgs e)
        {
            if (_log.LogCache.IsFiltered && _log.LogCache.IsLoading)
            {
                _log.LogCache.AbortFilter();
                _log.CancelFilter();
                //Lbl_Loading.Text = "Filter aborted";
            }
            else
            {
                _log.AbortLoading();
                //Lbl_Loading.Text = "Loading aborted";
            }

            ChangeLoadingStatus(false);
        }

        #endregion

        #region CallBack

        private void OnRefreshTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            if (IsHandleCreated && !IsDisposed)
            {
                BeginInvoke(new GUIDelegate(delegate
                                           {
                                               try
                                               {
                                                   Pb_Loading.Maximum = _maxValue;
                                                   Pb_Loading.Value = _currentValue;

                                                   Lbl_FileName.Text = _log.LogWatch.Name;
                                                   Lbl_FileSize.Text = _log.LogWatch.SizeToDisplay;
                                                   Lbl_Rows.Text = _log.NbrRows.ToString("N0", CultureInfo.CurrentCulture.NumberFormat);
                                                   Lbl_HiddenRows.Text = _log.NbrRowsHidden.ToString("N0", CultureInfo.CurrentCulture.NumberFormat);
                                                   string currentLine = _log.LogCache[_log.LogCache.Count - 1];
                                                   Lbl_CurrentLine.Text = currentLine.Length < 91 ? currentLine : currentLine.Substring(0, 90) + " ...";
                                                   Btn_StopLoading.Text = _log.LogCache.IsFiltered ? "Abort filter" : "Abort loading";
                                                   if (_currentValue >= _maxValue - 1)
                                                   {
                                                       Lbl_Loading.Text = "Displaying data";
                                                   }
                                               }
                                               catch
                                               {
                                                #if DEBUG
                                                   throw;
                                                #endif
                                               }
                                           }));
            }
        }

        private void OnFileLoading(object sender, LoadingEventArgs e)
        {
            _maxValue = (int)e.MaxValue;
            _currentValue = (int)e.CurrentValue;
        }

        #endregion

        #endregion

        #region Methods

        public void BeginLoading(string Message)
        {
            ChangeLoadingStatus(true, Message);
        }

        public void EndLoading()
        {
            ChangeLoadingStatus(false);
        }

        private void AddFilteredBanner()
        {
            if (IsHandleCreated && !IsDisposed)
            {
                BeginInvoke(new GUIDelegate(delegate
                {
                    Lbl_Banner.Text = string.Format("Filtered log : \"{0}\"", _log.LogCache.FilterCritere);
                    Lbl_Banner.BackColor = Color.Gold;
                    Lbl_Banner.ForeColor = Color.Black;
                    Lbl_Banner.Visible = true;
                }));
            }
        }

        private void AddPartialLoadBanner()
        {
            if (IsHandleCreated && !IsDisposed)
            {
                BeginInvoke(new GUIDelegate(delegate
                {
                    Lbl_Banner.Text = String.Format("Partially loaded log (only {0} MB)", (int)(_log.SizeToLoad / 1000000));
                    Lbl_Banner.BackColor = Color.Brown;
                    Lbl_Banner.ForeColor = Color.White;
                    Lbl_Banner.Visible = true;
                }));
            }
        }

        private void AddLoadedWithFilterBanner()
        {
            if (IsHandleCreated && !IsDisposed)
            {
                BeginInvoke(new GUIDelegate(delegate
                {
                    Lbl_Banner.Text = string.Format("File open with filter : \"{0}\"", _log.LogCache.OriginalFilterCritere);
                    Lbl_Banner.BackColor = Color.Bisque;
                    Lbl_Banner.ForeColor = Color.Black;
                    Lbl_Banner.Visible = true;
                }));
            }
        }

        private void ChangeLoadingStatus(bool isLoading)
        {
            ChangeLoadingStatus(isLoading, null);
        }

        private void ChangeLoadingStatus(bool isLoading, string message)
        {
            if (IsHandleCreated && !IsDisposed)
            {
                BeginInvoke(new GUIDelegate(delegate
                                           {
                                               Lbl_Loading.Text = message;
                                               if (isLoading)
                                               {
                                                   _currentValue = 0;
                                                   Pb_Loading.Value = 0;
                                                   Pnl_Loading.Visible = true;
                                                   Pnl_Loading.BringToFront();

                                                   Lbl_Profile.Text = !string.IsNullOrEmpty(_log.CurrentProfileName) ? _log.CurrentProfileName : "None";
                                                   Lbl_Filter.Text = !string.IsNullOrEmpty(_log.LogCache.FilterCritere) ? _log.LogCache.FilterCritere : "None";
                                                   _refreshTimer.Start();
                                               }
                                               else
                                               {
                                                   _refreshTimer.Stop();
                                                   Pnl_Loading.Visible = false;
                                                   Lbl_Banner.Visible = false;
                                                   if (_isPartiallyLoaded)
                                                       AddPartialLoadBanner();
                                                   if(_log.LoadWithFilter)
                                                       AddLoadedWithFilterBanner();
                                                   if (_isFilter)
                                                       AddFilteredBanner();
                                               }
                                           }));
            }
        }

        #endregion
    }
}

