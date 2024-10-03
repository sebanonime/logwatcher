using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using System.IO;
using System.Threading;
using System.Text.RegularExpressions;
using WeifenLuo.WinFormsUI.Docking;
using LogWatcher.LogWatcherEventArgs;
using System.Reflection;
using LogWatcher.Common;
using System.Configuration;
using Microsoft.VisualBasic.ApplicationServices;

namespace LogWatcher.Frm
{
    public partial class Frm_Master : Form
    {
        #region Fields, Delegate

        private Guid previousActiveDoc = Guid.Empty;
        private static readonly Frm_Master _singleton = new Frm_Master();

        private const string OpenWithFilterArg = "OPEN_WITH_FILTER";
        
        private readonly Dictionary<Guid, LogManager> _dicoLog = new Dictionary<Guid, LogManager>();

        private Frm_Filter _filterDiag; // = new Frm_Filter();
        private Frm_Config _configDiag = new Frm_Config();

        //private int _tabSelectedIndex = 0;
        private Guid _loadingDocId = Guid.Empty;
        //internal PluginManager.Singleton. PluginManager.Singleton. = new PluginManager.Singleton.();

        private delegate void GUIDelegate();
        

        //internal AutoCompleteStringCollection AutoCompletSource = new AutoCompleteStringCollection();

        private readonly System.Timers.Timer _DisplayInfoTimer = new System.Timers.Timer();
        public static int GuiRefreshTimer;

        #endregion


        #region Properties

        internal LogManager CurrentLog
        {
            get
            {
                Frm_Doc doc = null;
                
                if (DckPnl_Main.ActiveContent != null 
                    && !(DckPnl_Main.ActiveContent.DockHandler.Form is PluginDocContent)
                    && !(DckPnl_Main.ActiveContent.DockHandler.Form is FormDocContent))
                {
                    doc = DckPnl_Main.ActiveContent.DockHandler.Form as Frm_Doc;
                }
                else if (DckPnl_Main.ActiveDocument != null)
                {
                    doc = DckPnl_Main.ActiveDocument.DockHandler.Form as Frm_Doc;
                }

                Guid id = doc != null ? doc.Id : _loadingDocId;

                if (_dicoLog.ContainsKey(id))
                {
                    return _dicoLog[id];
                }
                
                return null;
            }
        }

        public static Frm_Master Singleton
        {
            get
            {
                return _singleton;
            }
        }

        public AutoCompleteStringCollection AutoCompletSource { get; set; }
        public List<string> LogsLoadByParam { get; set; }
        
        #endregion


        #region Constructeur

        private Frm_Master()
        {
            InitializeComponent();
            if (!int.TryParse(ConfigurationManager.AppSettings["GuiRefreshTimer"], out GuiRefreshTimer) || GuiRefreshTimer <= 0)
            {
                GuiRefreshTimer = 150;
            }

            AutoCompletSource = new AutoCompleteStringCollection();
            
        }

        #endregion


        #region Events 

        #region GUI Event Handler

        #region Main Form

        private void Frm_Master_Shown(object sender, EventArgs e)
        {
            Lbl_SelectedProfile.Text = "No Profile";
            _filterDiag = new Frm_Filter();
            LoadPluginMenu();
            
            //we load files previously loaded 
            foreach (string fileName in LogConfig.Singleton.DicoLoadedLog)
            {
                if (File.Exists(fileName))
                    OpenFile(fileName);
            }

            LoadFileFromParam(LogsLoadByParam);

            #region Windows position
            if (LogConfig.Singleton.ShowLogBrowser)
            {
                DockState state;
                try
                {
                    state = (DockState)Enum.Parse(typeof(DockState), LogConfig.Singleton.LogBrowserState, true);
                }
                catch
                {
                    state = DockState.DockLeft;
                }

                Frm_LogBrowser.Singleton.Show(DckPnl_Main, state);
            }

            if (LogConfig.Singleton.ShowFilterHistoric)
            {
                DockState state;
                try
                {
                    state = (DockState)Enum.Parse(typeof(DockState), LogConfig.Singleton.FilterHistoricState, true);
                    if (state == DockState.Unknown)
                    {
                        state = DockState.DockBottom;
                    }
                }
                catch
                {
                    state = DockState.DockBottom;
                }
                Frm_FilterHistoric.Singleton.Show(DckPnl_Main, state);
            }

            if (LogConfig.Singleton.ShowSelectedView)
            {
                DockState state;
                try
                {
                    state = (DockState)Enum.Parse(typeof(DockState), LogConfig.Singleton.SelectedViewState, true);
                }
                catch
                {
                    state = DockState.DockBottom;
                }

                Frm_SelectedView.Singleton.Show(DckPnl_Main, state);
            } 

            #endregion

            if (LogConfig.Singleton.AlwaysOnTop)
                TopMost = true;

            AutoCompletSource.Clear();
            foreach(string search in LogConfig.Singleton.DicoSearchedKeyword)
            {
                if (!string.IsNullOrEmpty(search))
                    AutoCompletSource.Add(search);
            }

            
            if (LogConfig.Singleton.LocationX > -15 && LogConfig.Singleton.LocationY > -15)
            {
                Location = new Point(LogConfig.Singleton.LocationX, LogConfig.Singleton.LocationY);
            }
            else
            {
                Location = new Point(5, 5);
            }

            WindowState = LogConfig.Singleton.FullScreen ? FormWindowState.Maximized : FormWindowState.Normal;
            if (!LogConfig.Singleton.FullScreen)
            {
                if (LogConfig.Singleton.Width > 0 && LogConfig.Singleton.Height > 0)
                {
                    Size = new Size(LogConfig.Singleton.Width, LogConfig.Singleton.Height);
                }
                else
                {
                    Size = new Size(800, 600);
                }
            }

            
            Txt_Search.AutoCompleteSource = AutoCompleteSource.CustomSource;
            Txt_Search.AutoCompleteCustomSource = AutoCompletSource;

            _DisplayInfoTimer.Elapsed += OnDisplayInfoTimer_Elapsed;
            _DisplayInfoTimer.Interval = 5000;
            _DisplayInfoTimer.AutoReset = true;
            _DisplayInfoTimer.Start();

            AlertManager.Singleton.Init();
            AlertManager.Singleton.OnAlert += OnAlert;
            AlertManager.Singleton.OnError += OnAlertError;

            
        }

        private void Frm_Master_FormClosed(object sender, FormClosedEventArgs e)
        {
            Hide();

            _DisplayInfoTimer.Stop();

            LogConfig.Singleton.DicoLoadedLog.Clear();
            LogManager[] logs = new LogManager[_dicoLog.Count];
            _dicoLog.Values.CopyTo(logs, 0);
            foreach (LogManager logTmp in logs)
            {
                if (LogConfig.Singleton.SaveLogsOnClose)
                    LogConfig.Singleton.DicoLoadedLog.Add(logTmp.LogWatch.FullName);
                CloseDocument(logTmp);
            }

            LogConfig.Singleton.DicoSearchedKeyword.Clear();
            int nbrSearch = AutoCompletSource.Count;
            for (int i = (nbrSearch > 100 ? nbrSearch - 100 : 0); i < nbrSearch; i++)
            {
                string search = AutoCompletSource[i];
                if (!string.IsNullOrEmpty(search))
                    LogConfig.Singleton.DicoSearchedKeyword.Add(search);
            }

            LogConfig.Singleton.ShowFilterHistoric = !Frm_FilterHistoric.Singleton.IsHidden;
            LogConfig.Singleton.ShowLogBrowser = !Frm_LogBrowser.Singleton.IsHidden;
            LogConfig.Singleton.ShowSelectedView = !Frm_SelectedView.Singleton.IsHidden;
            LogConfig.Singleton.LogBrowserState = Frm_LogBrowser.Singleton.DockState.ToString();
            LogConfig.Singleton.FilterHistoricState = Frm_SelectedView.Singleton.DockState.ToString();
            LogConfig.Singleton.SelectedViewState = Frm_SelectedView.Singleton.DockState.ToString();


            if (WindowState != FormWindowState.Maximized)
            {
                LogConfig.Singleton.Width = Size.Width;
                LogConfig.Singleton.Height = Size.Height;
            }
            LogConfig.Singleton.LocationX = Location.X;
            LogConfig.Singleton.LocationY = Location.Y;
            LogConfig.Singleton.FullScreen = WindowState == FormWindowState.Maximized;

            // we save the last used logs to automatically load them at the next startup
            LogConfig.Singleton.Save();
        }

        private void Main_Contener_DragEnter(object sender, DragEventArgs e)
        {
            e.Effect = e.Data.GetDataPresent(DataFormats.FileDrop) ? DragDropEffects.Copy : DragDropEffects.None;
        }

        private void Main_Contener_DragDrop(object sender, DragEventArgs e)
        {
            try
            {
                Array a = (Array)e.Data.GetData(DataFormats.FileDrop);
                if (a != null)
                {
                    //Extract string from first array element
                    for (int i = 0; i < a.Length; i++)
                    {
                        string logFileName = a.GetValue(i).ToString();
                        if ((e.KeyState & 32) == 32)
                        {
                            //string filter = new InputBox().ShowDialog("Enter your filter : ");
                            //OpenFile(logFileName, new Regex(filter, RegexOptions.IgnoreCase));
                            OpenFileWithFilter(logFileName);
                        }
                        else
                        {
                            OpenFile(logFileName);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(this, "Drag&Drop error : " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void DckPnl_Main_ActiveContentChanged(object sender, EventArgs e)
        {
            if (DckPnl_Main.ActiveContent != null)
            {
                if (CurrentLog!= null && (previousActiveDoc == Guid.Empty || previousActiveDoc != CurrentLog.Id))
                {
                    ThreadPool.QueueUserWorkItem(delegate
                                                     {
                                                         BeginInvoke(new GUIDelegate(() =>
                                                                                         {
                                                                                             ChangeGUIImage();
                                                                                             ChangeTailImage();
                                                                                             RefreshProfile();
                                                                                             DisplayLogInfo();
                                                                                             PluginManager.Singleton.UpdateCurrentLog(CurrentLog);
                                                                                         }));
                                                     });
                    previousActiveDoc = CurrentLog.Id;
                }
            }
        }

        #endregion

        #region Menu items

        #region File

        private void Btn_Open_Click(object sender, EventArgs e)
        {
            OpenFileDialog fileDiag = new OpenFileDialog();
            //fileDiag.Filter = "Log files (*.log)|*.log|All files (*.*)|*.*";
            if (CurrentLog != null)
            {
                string fileNameTmp =Path.GetFileName(CurrentLog.LogWatch.FullName);
                if (fileNameTmp != null)
                    fileDiag.InitialDirectory = CurrentLog.LogWatch.FullName.Replace(fileNameTmp, "");
            }
            fileDiag.Filter = "All files (*.*)|*.*";
            if (fileDiag.ShowDialog() == DialogResult.OK)
            {
                OpenFile(fileDiag.FileName);
            }
        }

        private void openFileWithFilterToolStripMenuItem_Click(object sender, EventArgs e)
        {
            OpenFileDialog fileDiag = new OpenFileDialog();
            //fileDiag.Filter = "Log files (*.log)|*.log|All files (*.*)|*.*";
            if (CurrentLog != null)
            {
                string fileNameTmp = Path.GetFileName(CurrentLog.LogWatch.FullName);
                if (fileNameTmp != null)
                    fileDiag.InitialDirectory = CurrentLog.LogWatch.FullName.Replace(fileNameTmp, "");
            }
            fileDiag.Filter = "All files (*.*)|*.*";
            if (fileDiag.ShowDialog() == DialogResult.OK)
            {
                OpenFileWithFilter(fileDiag.FileName);
            }
        }

        private void saveLinesInFileToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (CurrentLog != null)
            {
                SaveFileDialog diag = new SaveFileDialog();
                if (diag.ShowDialog(this) == DialogResult.OK)
                {
                    if (SaveCurrentLogInNewFile(diag.FileName))
                    {
                        MessageBox.Show(this, "All lines have been successfully saved", "File Saved", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                }
            }
            else
            {
                ShowCurrentLogError();
            }
        }

        private void openLinesInNewTabToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (CurrentLog != null)
            {
                string tempFile = Path.GetTempFileName();
                if (SaveCurrentLogInNewFile(tempFile))
                {
                    OpenFile(tempFile, CurrentLog.CurrentProfileName);
                }
            }
            else
            {
                ShowCurrentLogError();
            }
        }

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        #endregion

        #region Edit

        private void closeTabToolStripMenuItem_Click(object sender, EventArgs e)
        {
            CloseDocument(CurrentLog);
        }
        
        private void closeAllTabToolStripMenuItem_Click(object sender, EventArgs e)
        {
            foreach (var item in _dicoLog.Values)
            {
                CloseDocument(item);
            }
        }

        private void closeAllButThisToolStripMenuItem_Click(object sender, EventArgs e)
        {
            foreach (var item in _dicoLog.Values)
            {
                if (item.Id != CurrentLog.Id)
                {
                    CloseDocument(item);
                }
            }
        }


        private void goToLineToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (CurrentLog != null)
            {
                InputBox selectLine = new InputBox();
                string resu = selectLine.ShowDialog("Select line number : ");
                if (!string.IsNullOrEmpty(resu))
                {
                    int index;
                    if (int.TryParse(resu, out index))
                    {
                        if (index < CurrentLog.LogCache.Count && index > 0)
                            CurrentLog.GotoLine(index);
                        else
                            MessageBox.Show("This line number is out fo bound", "out fo bound", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                    else
                    {
                        MessageBox.Show("Input text must be a number (integer)", "Bad format", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
            else
            {
                ShowCurrentLogError();
            }
        }

        #endregion

        #region Search & Filter

        private void filterToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (CurrentLog != null)
            {
                //if (_filterDiag.IsDisposed)
                //    _filterDiag = new Frm_Filter();

                ////_filterDiag.Show(DckPnl_Main);
                //_filterDiag.Show(this);
                //Frm_Filter _filterDiag = new Frm_Filter();
                if (_filterDiag.ShowDialog(this) == DialogResult.OK)
                {
                    FilterLog(_filterDiag.Critere, _filterDiag.Options);
                }
            }
            else
            {
                ShowCurrentLogError();
            }
        }

        private void searchToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (CurrentLog != null)
            {
                //_filterDiag = new Frm_Filter(true);
                ////_filterDiag.Show(DckPnl_Main);
                //_filterDiag.Show(this);

                Frm_Search _searchDiag = new Frm_Search();
                _searchDiag.ShowDialog(this);
            }
            else
            {
                ShowCurrentLogError();
            }
        }

        private void searchNextToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SearchLog(null, false);
        }

        private void disableAllFilterToolStripMenuItem_Click(object sender, EventArgs e)
        {
            CancelAllFilter();
        }

        #endregion

        #region Tool

        private void OnFollowTail_Click(object sender, EventArgs e)
        {
            if (CurrentLog != null)
            {
                CurrentLog.Tail = !CurrentLog.Tail;
                //string imageTmp = CurrentLog.Tail ? @"E:\Soft\Appli_Perso\dotNet 2.0\LogWatcher\Temp\Images\Downloads.png" : @"E:\Soft\Appli_Perso\dotNet 2.0\LogWatcher\Temp\Images\First_Aid.png";
                //followTailToolStripMenuItem.Checked = CurrentLog.Tail;
                //Lbl_Tail.Image = new Bitmap(imageTmp);
                ChangeTailImage();
            }
            else
            {
                followTailToolStripMenuItem.Checked = false;
                ShowCurrentLogError();
            }
        }

        private void alwaysOnTopToolStripMenuItem_Click(object sender, EventArgs e)
        {
            TopMost = alwaysOnTopToolStripMenuItem.Checked;
        }

        private void ShowConfigToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //if (_configDiag.IsDisposed)
            _configDiag = new Frm_Config();

            _configDiag.Show(this);
        }

        private void logBrowserToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (Frm_LogBrowser.Singleton.IsHidden)
            {
                Frm_LogBrowser.Singleton.Show(DckPnl_Main, DockState.DockLeft);
            }
            else
            {
                Frm_LogBrowser.Singleton.Hide();
            }
            
        }

        private void selectedViewToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (Frm_SelectedView.Singleton.IsHidden)
            {
                Frm_SelectedView.Singleton.Show(DckPnl_Main, DockState.DockBottom);
                if (CurrentLog != null)
                    Frm_SelectedView.Singleton.ChangeDisplayText(CurrentLog.SelectedRowText);
            }
            else
            {
                Frm_SelectedView.Singleton.Hide();
            }
        }

        private void filterHistoricToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (Frm_FilterHistoric.Singleton.IsHidden)
            {
                Frm_FilterHistoric.Singleton.Show(DckPnl_Main, DockState.DockBottom);
            }
            else
            {
                Frm_FilterHistoric.Singleton.Hide();
            }
        }

        private void clearLogFileToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show(this, "WARNING, This action will rename the log file and recreate an empty log file.\r\nDo you realy want to do that", "Clear log", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) == DialogResult.Yes)
            {
                try
                {
                    //string fileName = CurrentLog.LogWatch.Name;
                    string fullFileName = CurrentLog.LogWatch.FullName;
                    string backupFileName = fullFileName + DateTime.Now.ToString(".yyyy-MM-dd_HH-mm-ss");
                    //FileStream fileTmp = null;
                    try
                    {
                        File.Move(fullFileName, backupFileName);
                        //fileTmp = File.Create(fullFileName);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(this, "Error during moving file : " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                    //finally
                    //{
                    //    if (fileTmp != null)
                    //        fileTmp.Close();
                    //}
                }
                catch (Exception ex)
                {
                    MessageBox.Show(this, "An error occure during renaming log file : " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        #endregion

        #region Plugin

        private void OnPluginMenuClick(object sender, EventArgs e)
        {
            if (CurrentLog != null)
            {
                ToolStripItem pluginMenu = sender as ToolStripItem;
                if (pluginMenu != null)
                {
                    if (LogConfig.Singleton.DicoPlugin.ContainsKey(pluginMenu.Text))
                    {
                        Plugin pluginTmp = LogConfig.Singleton.DicoPlugin[pluginMenu.Text];
                        try
                        {
                            PluginManager.Singleton.LoadPlugin(pluginTmp, _dicoLog, CurrentLog, DckPnl_Main);
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show(this, "Load plugin error" + ex.Message, "Plugin error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        }
                    }
                    else
                    {
                        MessageBox.Show(this, "Unknown Plugin", "Plugin Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
            else
            {
                ShowCurrentLogError();
            }
        }

        #endregion 

        #region ?

        private void aboutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            AboutBox about = new AboutBox();
            about.ShowDialog(this);
        }

        #endregion

        #endregion

        #region ToolBar

        private void Ddl_StockedFilters_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (CurrentLog != null && CurrentLog.CurrentProfile != null)
            {
                if (Ddl_StoredFilters.SelectedIndex > 0)
                {
                    StoredFilter filterTmp = CurrentLog.CurrentProfile.DicoStoredFilter[Ddl_StoredFilters.SelectedIndex - 1];
                    if (filterTmp != null)
                    {
                        FilterLogWithStoreFilter(filterTmp.Filter);
                    }
                }
                else
                {
                    CancelAllFilter();
                }
            }
            else
            {
                ShowCurrentLogError();
            }
        }

        private void Txt_Search_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return || e.KeyCode == Keys.Enter)
            {
                FilterLogWithStoreFilter(Txt_Search.Text);
            }
            if (e.KeyCode == Keys.F5)
            {
                SearchLog(Txt_Search.Text, true);
            }
            e.Handled = true;
        }

        private void Btn_Filter_Click(object sender, EventArgs e)
        {
            //ClearSelectedStoredFilter();
            FilterLogWithStoreFilter(Txt_Search.Text);
        }

        private void Btn_Search_Click(object sender, EventArgs e)
        {
            SearchLog(Txt_Search.Text, true);
        }

        private void Btn_NavigateBackward_Click(object sender, EventArgs e)
        {
            if (CurrentLog != null)
                CurrentLog.NavigateBackward();

            ChangeGUIImage();
        }

        private void Btn_NavigateForward_Click(object sender, EventArgs e)
        {
            if (CurrentLog != null)
                CurrentLog.NavigateFoward();

            ChangeGUIImage();
        }

        private void Btn_DetailView_Click(object sender, EventArgs e)
        {
            ShowDetailView();
        }

        private void Btn_ContextView_Click(object sender, EventArgs e)
        {
            ShowContextView();
        }

        private void Btn_ChangeProfile_Click(object sender, EventArgs e)
        {

            if (CurrentLog != null)
            {
                Frm_ProfileSelector profileSelector = new Frm_ProfileSelector();
                Profile selectedProfile = profileSelector.ShowProfileDialog(this);

                if (selectedProfile != null)
                {
                    DisplayLogInfo("Profile Loading ...");
                    Lbl_SelectedProfile.Text = selectedProfile.Name;

                    ThreadPool.QueueUserWorkItem(delegate
                                 {
                                     CurrentLog.CurrentProfileName = selectedProfile.Name;
                                     BeginInvoke(new GUIDelegate(() => 
                                     { 
                                         DisplayLogInfo("Profile Loaded");
                                         RefreshProfile();
                                     }));
                                 });
                }
            }
            else
            {
                Lbl_SelectedProfile.Text = "No Profile";
                ShowCurrentLogError();
            }
        }

        #endregion

        #endregion


        #region Event Handlers

        void OnDoc_Closed(object sender, FormClosedEventArgs e)
        {
            CloseDocument(CurrentLog);
        }

        private void OnAlertError(object sender, LogwatcherErrorEventArgs e)
        {
            BeginInvoke(new GUIDelegate(() => MessageBox.Show(this, e.Message, "File Alert Error", MessageBoxButtons.OK, MessageBoxIcon.Error)));
        }

        private void OnAlert(object sender, AlertEventArgs e)
        {
            BeginInvoke(new GUIDelegate(() => Frm_Alert.Singleton.Show(0, "LogWatcher Alert", e.AllMessages)));
        }

        private void OnSelectionChanged(object sender, EventArgs e)
        {
            if (Frm_SelectedView.Singleton.IsHandleCreated && CurrentLog != null)
            {
                Frm_SelectedView.Singleton.ChangeDisplayText(CurrentLog.SelectedRowText);
            }
        }

        void OnDoubleClick(object sender, EventArgs e)
        {
            switch (LogConfig.Singleton.DoubleClickAction)
            {
                case DoubleClickActions.ContextView:
                    ShowContextView();
                    break;
                case DoubleClickActions.DetailView:
                    ShowDetailView();
                    break;
                default:
                    break;
            }
        }

        private void OnDisplayInfoTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (CurrentLog != null)
            {
                SS_Main.BeginInvoke(new GUIDelegate(DisplayLogInfo));
            }
        }

        #endregion

        #endregion


        #region Methods

        
        public void OpenFile(string fileName)
        {
            OpenFile(fileName, null, null);
        }

        public void OpenFile(string fileName, string profileName)
        {
            OpenFile(fileName, profileName, null);
        }

        public void OpenFile(string fileName, Regex filter)
        {
            OpenFile(fileName, null, filter);
        }

        public void OpenFile(string fileName, string profileName, Regex filter)
        {
            #region Check if file is alredy open
            bool openThisFile = true;
            foreach (LogManager log in _dicoLog.Values)
            {
                if (log.LogWatch.FullName == fileName)
                {
                    Invoke(new GUIDelegate(delegate
                       {
                           if (MessageBox.Show("This file is already open. \r\nDo you want really want to open this file again ?", "Really ?", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.No)
                           {
                               openThisFile = false;
                           }
                       }));
                }
            }

            if (!openThisFile)
                return; 
            #endregion

            DisplayMessageInfo("Loading file ...");

            //Frm_LoadModeSelector lms = new Frm_LoadModeSelector();
            //lms.ShowDialog(this);

            FileInfo logFile = new FileInfo(fileName);
            long fileSize = logFile.Length;
            if (!logFile.Exists)
            {
                throw new FileNotFoundException("Impossible to found log file : " + fileName);
            }

            if (string.IsNullOrEmpty(profileName))
            {
                profileName = SearchProfileName(logFile);
            }

            int sizeInBytes = -1;
            bool loadOnlyEof = false;
            if (LogConfig.Singleton.LoadOnlyEof)
            {
                sizeInBytes = LogConfig.Singleton.EofSizeToLoad * 1000000;
                loadOnlyEof = true;
            }
            else if (filter == null && LogConfig.Singleton.MaxSizeToPrompt > 0 && fileSize >= LogConfig.Singleton.MaxSizeToPrompt * 1000000)
            {
                Frm_LoadModeSelector lms = new Frm_LoadModeSelector();
                string displayFileSize = Tools.DisplayFileSize(fileSize);
                DialogResult resu = lms.ShowDialog(this, displayFileSize);
                if (resu == DialogResult.OK)
                {
                    switch (lms.SelectedMode)
                    {
                        case LoadMode.AllLoadMode.EndOfFile:
                            #region manage load only end of file
                            InputBox promptSize = new InputBox();
                            string sizeStr = promptSize.ShowDialog(string.Format("Give the size to load in Mo (file to open size : {0})", displayFileSize));
                            int size;
                            if (!string.IsNullOrEmpty(sizeStr) && int.TryParse(sizeStr, out size))
                            {
                                sizeInBytes = size * 1000000;
                                loadOnlyEof = true;
                            }
                            else
                            {
                                MessageBox.Show("Incorrect input format : you must set an integer", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                                return;
                            }
                            break;
                            #endregion
                        case LoadMode.AllLoadMode.SimpleFilter:
                            #region manage load with filter
                            //if file is too big and any filter is already set
                            string caption = "Enter your filter for file " + Path.GetFileName(fileName);
                            if (_filterDiag.ShowDialog(this, caption, profileName) == DialogResult.OK)
                            {
                                OpenFile(fileName, new Regex(_filterDiag.Critere, _filterDiag.Options));
                                return;
                            }
                            break;
                            #endregion
                        default:
                            break;
                    }
                }
                else
                {
                    return;
                }
            }

            LogManager myLog = new LogManager(logFile, profileName, filter, loadOnlyEof, sizeInBytes);

            Frm_Doc docTmp = new Frm_Doc(myLog);
            docTmp.FormClosed += OnDoc_Closed;
            docTmp.Show(DckPnl_Main);

            myLog.Frm_Log = docTmp;
            _loadingDocId = docTmp.Id;
            _dicoLog.Add(docTmp.Id, myLog);
            myLog.OnSelectionChanged += OnSelectionChanged;
            myLog.OnDoubleClick += OnDoubleClick;

            ThreadPool.QueueUserWorkItem(delegate 
                                             {
                                                 PluginManager.Singleton.UpdateDicoLog(_dicoLog);

                                                 Invoke(new GUIDelegate(delegate
                                                                            {
                                                                                RefreshProfile();

                                                                                Btn_NavigateBackward.Enabled = true;
                                                                                Btn_NavigateForward.Enabled = false;
                                                                                DisplayLogInfo("File Loaded");
                                                                                _loadingDocId = Guid.Empty;
                                                                            }));

                                             });
            
        }

        public void OpenFileWithFilter(string fileName)
        {
            string profileName = SearchProfileName(new FileInfo(fileName));

            string caption = "Enter your filter for file " + Path.GetFileName(fileName);
            if (_filterDiag.ShowDialog(this, caption, profileName) == DialogResult.OK)
            {
                OpenFile(fileName, profileName, new Regex(_filterDiag.Critere, _filterDiag.Options));
            }
            else
            {
                OpenFile(fileName);
            }
        }

        public void ProcessParameters(object sender, string[] args)
        {
            LoadFileFromParam(new List<string>(args));
        }

        internal void LoadFileFromParam(List<string> args)
        {
            //we load file pass in param
            bool loadWithFilter = false;
            if (args.Contains(OpenWithFilterArg))
            {
                args.Remove(OpenWithFilterArg);
                loadWithFilter = true;
            }

            foreach (string fileName in args)
            {
                if (File.Exists(fileName))
                {
                    if (loadWithFilter)
                    {
                        OpenFileWithFilter(fileName);
                    }
                    else
                    {
                        OpenFile(fileName);
                    }

                }
            }
        }

        private static string SearchProfileName(FileSystemInfo fileInfo)
        {
            foreach (Profile profileTmp in LogConfig.Singleton.DicoProfile.Values)
            {
                string[] allParam = profileTmp.LoadingParam.Split(new char[] {';'}, StringSplitOptions.RemoveEmptyEntries);
                foreach (string str in allParam)
                {
                    try
                    {
                        if (fileInfo.FullName.Contains(str) 
                            || Regex.IsMatch(fileInfo.FullName, str, RegexOptions.IgnoreCase)
                            || Regex.IsMatch(fileInfo.Name, str, RegexOptions.IgnoreCase))
                            return profileTmp.Name;
                    }
                    catch{}
                }
            }

            return "";
        }

        private bool SaveCurrentLogInNewFile(string fileName)
        {
            StreamWriter sw = null;
            try
            {
                sw = new StreamWriter(fileName);
                for (int i = 0; i < CurrentLog.LogCache.Count; i++)
                {
                    string lineTmp = CurrentLog.LogCache[i];
                    sw.WriteLine(lineTmp);
                }
                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(this, "Save Current Log In New File : " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return false;
            }
            finally
            {
                if (sw != null)
                {
                    sw.Close();
                }
            }
        }

        public void SearchLog(string critere, bool first)
        {
            SearchLog(critere, first, RegexOptions.Compiled | RegexOptions.IgnoreCase);
        }

        public void SearchLog(string critere, bool first, RegexOptions options)
        {
            if (CurrentLog != null)
            {
                if (first)
                {
                    if (!AutoCompletSource.Contains(critere) && !String.IsNullOrEmpty(critere))
                    {
                        BeginInvoke(new GUIDelegate(() =>
                        {
                            AutoCompletSource.Add(critere);
                            Frm_FilterHistoric.Singleton.RefreshData(critere);
                        }));
                    }

                    int idxBegin = 0;
                    if (CurrentLog.GridView.SelectedCells.Count > 0)
                        idxBegin = CurrentLog.GridView.SelectedCells[0].RowIndex;

                    if (!CurrentLog.SearchFirst(idxBegin, critere, options))
                    {
                        if (idxBegin == 0)
                        {
                            CurrentLog.GridView.Focus();
                            MessageBox.Show(this, String.Format("No match found for {0}", critere), "Search", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        }
                        else
                        {
                            if (!CurrentLog.SearchFirst(0, idxBegin + 1, critere, options))
                            {
                                CurrentLog.GridView.Focus();
                                MessageBox.Show(this, String.Format("No match found for {0}", critere), "Search", MessageBoxButtons.OK, MessageBoxIcon.Information);
                            }
                        }
                    }
                }
                else
                {
                    if (!CurrentLog.SearchNext())
                    {
                        CurrentLog.GridView.Focus();
                        MessageBox.Show(this, "End of file", "Search", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                }
            }
            else
            {
                ShowCurrentLogError();
            }
        }

        private void FilterLogWithStoreFilter(string critere)
        {
            RegexOptions option = RegexOptions.IgnoreCase;
            if (Ddl_StoredFilters.SelectedIndex > 0 && !String.IsNullOrEmpty(Txt_Search.Text))
            {
                if (Ddl_StoredFilters.SelectedIndex > 0)
                {
                    StoredFilter filterTmp = CurrentLog.CurrentProfile.DicoStoredFilter[Ddl_StoredFilters.SelectedIndex - 1];
                    //option = filterTmp.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
                    if (filterTmp != null)
                    {
                        critere = String.Format("{0}.*({1})|({1}).*{0}", Txt_Search.Text, filterTmp.Filter);
                    }
                }
            }
            else if (Ddl_StoredFilters.SelectedIndex < 0)
            {
                critere = Txt_Search.Text;
            }
            else
            {
                if (Ddl_StoredFilters.SelectedIndex > 0)
                {
                    StoredFilter filterTmp = CurrentLog.CurrentProfile.DicoStoredFilter[Ddl_StoredFilters.SelectedIndex - 1];
                    if (filterTmp != null)
                    {
                        critere = filterTmp.Filter;
                        if (filterTmp.IsRegex)
                        {
                            option = filterTmp.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
                        }
                    }

                }
            }
            FilterLog(critere, option);
        }

        public void FilterLog(string critere, RegexOptions option)
        //public void FilterLog(Filter filter)
        {
            if (CurrentLog != null)
            {
                if (string.IsNullOrEmpty(critere))
                {
                    CurrentLog.CancelFilter();
                    return;
                }

                if (!AutoCompletSource.Contains(critere) && !String.IsNullOrEmpty(critere))
                {
                    BeginInvoke(new GUIDelegate(() => AutoCompletSource.Add(critere)));
                }

                ThreadPool.QueueUserWorkItem(delegate
                                                 {
                                                     CurrentLog.FilterData(critere, option);
                                                     BeginInvoke(new GUIDelegate(() =>
                                                             {
                                                                 Frm_FilterHistoric.Singleton.RefreshData(critere);
                                                                 Txt_Search.Clear();
                                                             }));
                                                 });
            }
        }

        private void CancelAllFilter()
        {
            if (CurrentLog != null)
            {
                Txt_Search.Text = "";
                Ddl_StoredFilters.Text = "";
                CurrentLog.CancelFilter();
            }
            else
            {
                ShowCurrentLogError();
            }
        }


        public void ShowContextView()
        {
            if (CurrentLog != null)
            {
                DataGridView tmp = CurrentLog.GridView;
                if (tmp.SelectedRows.Count > 0)
                {
                    Frm_ContextView ctv = new Frm_ContextView(CurrentLog.LogCache, tmp.SelectedRows[0].Index);
                    ctv.TopMost = TopMost;
                    ctv.StartPosition = FormStartPosition.CenterParent;
                    ctv.Show(this);
                }
                else
                {
                    MessageBox.Show("You must select a row", "INFO", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                }
            }
        }

        private void ShowDetailView()
        {
            if (CurrentLog != null)
            {
                DataGridView tmp = CurrentLog.GridView;
                if (tmp.SelectedRows.Count > 0)
                {
                    string valTmp = CurrentLog.LogCache[tmp.SelectedRows[0].Index];

                    //string valTmp = tmp.SelectedRows[0].Cells[0].Value.ToString();
                    Frm_DetailView dtv = new Frm_DetailView(valTmp);

                    Frm_DetailViewMaster.Singleton.AddForm(dtv, TopMost);
                }
                else
                {
                    MessageBox.Show("You must select a row", "INFO", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                }
            }
        }

        public void ChangeTailImage()
        {
            if (CurrentLog != null)
            {
                Bitmap bmpTmp = CurrentLog.Tail ?
                    new Bitmap(Assembly.GetExecutingAssembly().GetManifestResourceStream("LogWatcher.Images.Tail.png")) :
                    new Bitmap(Assembly.GetExecutingAssembly().GetManifestResourceStream("LogWatcher.Images.NoTail.png"));
                Lbl_Tail.Image = new Bitmap(bmpTmp);

                followTailToolStripMenuItem.Checked = CurrentLog.Tail;
            }
        }

        public void ChangeGUIImage()
        {
            if (CurrentLog != null)
            {
                Btn_NavigateBackward.Enabled = !CurrentLog.IsFirstNavigator;
                Btn_NavigateForward.Enabled = !CurrentLog.IsLastNavigator;
            }
        }

        private void ChangeProfileName()
        {
            if (CurrentLog != null)
            {
                Lbl_SelectedProfile.Text = string.IsNullOrEmpty(CurrentLog.CurrentProfileName) ? "No profile" : CurrentLog.CurrentProfileName;
            }
        }

        public void RefreshProfile()
        {
            if (CurrentLog != null)
            {
                ChangeProfileName();

                ReloadStoredFitler();

                //Txt_Search.Text = CurrentLog.LogCache.FilterCritere;
            }
        }

        private void ReloadStoredFitler()
        {
            if (CurrentLog != null)
            {
                Ddl_StoredFilters.Items.Clear();
                Ddl_StoredFilters.Items.Add("");
                foreach (StoredFilter filter in CurrentLog.CurrentProfile.DicoStoredFilter)
                {
                    Ddl_StoredFilters.Items.Add(filter.Name);
                }
            }
        }

        private void CloseDocument(LogManager doc2Close)
        {
            ThreadPool.QueueUserWorkItem(delegate
                                             {
                                                 BeginInvoke(new GUIDelegate(delegate
                                                                                 {
                                                                                     //doc2Close.Frm_Log.Hide();
                                                                                     ClearLogInfo();

                                                                                     if (doc2Close != null)
                                                                                     {
                                                                                         Guid log2Delete = doc2Close.Frm_Log.Id;
                                                                                         //string fileName = doc2Close.Frm_Log.TabText;
                                                                                         //doc2Close.OnLoading -= OnFileLoading;
                                                                                         //doc2Close.OnUpdateInfo -= OnUpdateInfo;
                                                                                         doc2Close.Frm_Log.FormClosed -= OnDoc_Closed;
                                                                                         doc2Close.Frm_Log.Close();
                                                                                         doc2Close.Frm_Log.Dispose();
                                                                                         doc2Close.Dispose();

                                                                                         _dicoLog.Remove(log2Delete);

                                                                                         GC.Collect();
                                                                                     }
                                                                                 }));
                                                    PluginManager.Singleton.UpdateDicoLog(_dicoLog);
                                             });
        }

        //private void TraceDicoLog()
        //{
        //    Trace.WriteLine(String.Format("  -Dico.count = {0}", _dicoLog.Count));
        //    foreach (Guid item in _dicoLog.Keys)
        //    {
        //        Trace.WriteLine(String.Format("     -Dico = {0} : {1}", item, _dicoLog[item].Frm_Log.TabText));
        //    }
        //}

        public void RefreshGUIAfterConfig(List<Profile> profileToReload)
        {

            ReloadStoredFitler();
            LoadPluginMenu();

            AlertManager.Singleton.RefreshAlert();

            if (CurrentLog != null)
            {
                foreach (LogManager log in _dicoLog.Values)
                {
                    foreach (Profile profile in profileToReload)
                    {
                        if (log.CurrentProfileName == profile.Name)
                        {
                            log.ReLoadData();
                            break; //log profile was found so we pass to the next
                        }
                    }
                }
                
                CurrentLog.GridView.Refresh();
            }

            if (Frm_LogBrowser.Singleton.IsHandleCreated)
                Frm_LogBrowser.Singleton.RefreshLogBrowser();
        }

        private void LoadPluginMenu()
        {
            ThreadPool.QueueUserWorkItem(delegate
                                             {
                                                 BeginInvoke(new GUIDelegate(delegate
                                                                                 {
                                                                                     plugginToolStripMenuItem.DropDownItems.Clear();
                                                                                     foreach (string pluginName in LogConfig.Singleton.DicoPlugin.Keys)
                                                                                     {
                                                                                         ToolStripMenuItem item = new ToolStripMenuItem(pluginName, null, new EventHandler(OnPluginMenuClick));
                                                                                         plugginToolStripMenuItem.DropDownItems.Add(item);
                                                                                     }
                                                                                 }));
                                             });
        }

        private static void ShowCurrentLogError()
        {
            MessageBox.Show("You must open at least one file", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        private void ClearLogInfo()
        {
            Lbl_Info.Text = "";
        }

        private void DisplayLogInfo()
        {
            DisplayLogInfo("");
        }

        private void DisplayLogInfo(string message)
        {
            LogManager logTmp = CurrentLog;
            if (logTmp != null && logTmp.LogWatch != null)
            {
                //logTmp.LogFile.Refresh();
                //long fileSize = logTmp.LogFile.Length;
                //string size = fileSize > 1000000 ? ((float)(fileSize / 1000000.0)).ToString("0.##") + " Mo" : ((float)(fileSize / 1000.0)).ToString("0.##") + " Ko";
                Lbl_Info.Text = String.Format("{0} - Rows={1:N0} - HiddenRows={2:N0} - Size={3} - {4}",
                                              message, logTmp.NbrRows, logTmp.NbrRowsHidden, logTmp.LogWatch.SizeToDisplay, logTmp.LogWatch.FullName);
            }
        }

        private void DisplayMessageInfo(string message)
        {
            Lbl_Info.Text = String.Format("{0}", message);
        }

        

        


        //internal void SetDocIcon(DocIcon icone)
        //{
        //    string iconTmp = "";
        //    switch (icone)
        //    {
        //        case DocIcon.Normal:
        //            iconTmp = "LogWatcher.Images.Document.ico";
        //            break;
        //        case DocIcon.Filter:
        //            iconTmp = "LogWatcher.Images.Filter.ico";
        //            break;
        //        default:
        //            iconTmp = "LogWatcher.Images.Error.ico";
        //            break;
        //    }

        //    BeginInvoke(new GUIDelegate(delegate
        //    {
        //        CurrentLog.Frm_Log.Icon = new Icon(Assembly.GetExecutingAssembly().GetManifestResourceStream(iconTmp));
        //    }));
            
        //}

        #endregion

    }
}