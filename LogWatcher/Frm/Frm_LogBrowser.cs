using System;
using System.Collections.Generic;
using System.Windows.Forms;
using System.IO;
using WeifenLuo.WinFormsUI.Docking;
using System.Threading;
using LogWatcher.Common;
using System.Text.RegularExpressions;
using System.Configuration;
using System.Diagnostics;
using LogWatcher.Common.ThreadDispatcher;
using System.Drawing;

namespace LogWatcher.Frm
{
    public partial class Frm_LogBrowser : FormDocContent
    {
        #region Fields

        private const int IMG_VIRTUAL_DIR = 1;
        private const int IMG_FILE = 2;
        private const int IMG_REAL_DIR = 3;
        

        private static Frm_LogBrowser _singleton;
        private static readonly object _syncObjSingleton = new object();
        private readonly object _syncObjLoadCache = new object();
        private Regex _currentFilter;
        private Stopwatch chrono;
        private bool _initialLoad;
        private bool _initialLoadFinished;
        private readonly System.Timers.Timer _refreshTimer = new System.Timers.Timer();
        private readonly System.Timers.Timer _refreshFileSizeTimer = new System.Timers.Timer();
        private readonly Dictionary<string, string> _allFileSize = new Dictionary<string, string>();
        private readonly SortedDictionary<string, SortedDictionary<string, RealFileInfo>> _realDirCache = new SortedDictionary<string, SortedDictionary<string, RealFileInfo>>();
        private bool _showAllFiles, _showFileSize;
        private const string NODE_BIDON = "- Logwatcher Bidon -";
        //SimpleDispatcher _dispatcher = new SimpleDispatcher(10, "LogBrowser");
        


        private delegate void GUIDelegate();

        #endregion 

        #region Properties

        public static Frm_LogBrowser Singleton
        {
            get 
            {
                lock (_syncObjSingleton)
                {
                    if (_singleton == null || !_singleton.IsHandleCreated)
                        _singleton = new Frm_LogBrowser();

                    return _singleton;
                }
            }
        }

        #endregion

        #region Contructor

        private Frm_LogBrowser()
        {
            InitializeComponent();

            _initialLoadFinished = false;
            //_dispatcher.TaskFinished += OnTaskFinished;

            LoadRealDirInCache();
        }

        #endregion

        #region Event Handler

        #region GUI event handler

        private void Frm_LogBrowser_Shown(object sender, EventArgs e)
        {
            if (_initialLoadFinished)
                RefreshLogBrowser();
            else
                Lbl_Loading.Visible = true;

            int refreshTimer;
            if (!int.TryParse(ConfigurationManager.AppSettings["LogBrowserRefreshTimer"], out refreshTimer))
            {
                refreshTimer = 60000;
            }

            if (refreshTimer > 0)
            {
                _refreshTimer.Elapsed += OnRefreshTimer_Elapsed;
                _refreshTimer.AutoReset = true;
                _refreshTimer.Interval = refreshTimer;
                _refreshTimer.Start();
            }

            bool.TryParse(ConfigurationManager.AppSettings["ShowFileSize"], out _showFileSize);
            if (_showFileSize)
            {
                _refreshFileSizeTimer.Elapsed += OnRefreshFileSizeTimer_Elapsed;
                _refreshFileSizeTimer.AutoReset = true;
            }
        }

        private void Frm_LogBrowser_FormClosed(object sender, FormClosedEventArgs e)
        {
            Hide();

            ThreadPool.QueueUserWorkItem(delegate
            {
                _refreshTimer.Stop();
                _refreshFileSizeTimer.Stop();
            });
        }

        private void Btn_Refresh_Click(object sender, EventArgs e)
        {
            Lbl_Loading.Visible = true;
            LoadRealDirInCache();
        }

        private void Tv_LogBrowser_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            if (Tv_LogBrowser.SelectedNode != null)
            {
                string fileName = Tv_LogBrowser.SelectedNode.Name;

                fileName = FileNameManager.GetRealFileName(fileName);

                if (!string.IsNullOrEmpty(fileName))
                {
                    if (File.Exists(fileName))
                        Frm_Master.Singleton.OpenFile(fileName);
                    else
                        MessageBox.Show(this, "This file don't exist", "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void Cb_Lb_ShowAll_CheckedChanged(object sender, EventArgs e)
        {
            _showAllFiles = Cb_Lb_ShowAll.Checked;
            RefreshLogBrowser();
        }

        private void Tv_LogBrowser_BeforeExpand(object sender, TreeViewCancelEventArgs e)
        {
            RefreshNode(e.Node);
        }

        private void OpenContainFolder_Click(object sender, EventArgs e)
        {
            bool isFile = Path.HasExtension(Tv_LogBrowser.SelectedNode.Name);
            string dirName = isFile ? Path.GetDirectoryName(Tv_LogBrowser.SelectedNode.Name) : Tv_LogBrowser.SelectedNode.Name;
            
            ThreadPool.QueueUserWorkItem(delegate
                    {
                        if (Directory.Exists(dirName))
                        {
                            Process myProcess = new Process();
                            myProcess.StartInfo.UseShellExecute = false;
                            myProcess.StartInfo.FileName = "explorer.exe";
                            myProcess.StartInfo.Arguments = dirName;
                            myProcess.StartInfo.CreateNoWindow = true;
                            myProcess.Start();
                        }
                        else
                        {
                            Invoke(new GUIDelegate(() =>
                            {
                                MessageBox.Show("Path not found : " + dirName);
                            }));
                        }
                                                         
                    });


            
        }

        private void OpenWithFilter_Click(object sender, EventArgs e)
        {
            if (Tv_LogBrowser.SelectedNode != null)
            {
                string fileName = Tv_LogBrowser.SelectedNode.Name;

                fileName = FileNameManager.GetRealFileName(fileName);

                if (!string.IsNullOrEmpty(fileName))
                {
                    if (File.Exists(fileName))
                        Frm_Master.Singleton.OpenFileWithFilter(fileName);
                    else
                        MessageBox.Show(this, "This file don't exist", "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void Tv_LogBrowser_MouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
            {
                Tv_LogBrowser.SelectedNode = Tv_LogBrowser.GetNodeAt(e.X, e.Y);
            }
        }

        #endregion

        #region Timer Event handler

        private void OnRefreshTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            //_refreshTimer.Interval = 10000;
            //RefreshLogBrowser(false);
            LoadRealDirInCache();
        }

        private void OnRefreshFileSizeTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            _refreshFileSizeTimer.Interval = 60000;

            string[] allPath = new string[_allFileSize.Count];
            
            _allFileSize.Keys.CopyTo(allPath, 0);
            for (int i = 0; i < allPath.Length; i++)
            {
                FileInfo info = new FileInfo(allPath[i]);
                string size = GetRealFileSize(info);

                //lock (_sync)
                {
                    if (_allFileSize.ContainsKey(allPath[i]))
                    {
                        _allFileSize[allPath[i]] = size;
                    }
                }
            }
        }
        

        #endregion

        #endregion

        #region Methods

        public void RefreshLogBrowser()
        {
            RefreshLogBrowser(true);
        }

        public void RefreshLogBrowser(bool initialLoad)
        {
            _initialLoad = initialLoad;
            if (initialLoad)
                Tv_LogBrowser.Nodes.Clear();

            Frm_Master.Singleton.Invoke(new GUIDelegate(delegate
            {
                if (Tv_LogBrowser.IsHandleCreated)
                {
                    try
                    {
                        #region virtual dir

                        SortedList<string, string> sortedVirtual = new SortedList<string, string>();
                        foreach (string key in LogConfig.Singleton.LogBrowser.VirtualDirectories.Keys)
                        {
                            if (!sortedVirtual.ContainsKey(key))
                            {
                                sortedVirtual.Add(key, key);
                            }
                        }

                        foreach (string dirname in sortedVirtual.Values)
                        {
                            if (!Tv_LogBrowser.Nodes.ContainsKey(dirname))
                            {
                                TreeNode nodeParent = Tv_LogBrowser.Nodes.Add(dirname, dirname, IMG_VIRTUAL_DIR, IMG_VIRTUAL_DIR);
                                nodeParent.Nodes.Add(NODE_BIDON, NODE_BIDON);
                            }
                        }

                        #endregion

                        #region real dir

                        SortedList<string, LogBrowserItem> sortedRealDir = new SortedList<string, LogBrowserItem>();
                        foreach (LogBrowserItem item in LogConfig.Singleton.LogBrowser.RealDirectories)
                        {
                            if (!sortedRealDir.ContainsKey(item.Name))
                            {
                                sortedRealDir.Add(item.Name, item);
                            }
                        }

                        foreach (LogBrowserItem item in sortedRealDir.Values)
                        {
                            TreeNode[] nodes = Tv_LogBrowser.Nodes.Find(item.Name, false);
                            if (nodes.Length == 0)
                            {
                                if (_realDirCache.ContainsKey(item.Name))
                                {
                                    TreeNode nodeParent = Tv_LogBrowser.Nodes.Add(item.Name, item.Name, IMG_REAL_DIR, IMG_REAL_DIR);
                                    nodeParent.ContextMenuStrip = CtxMenu_Folder;
                                    nodeParent.Nodes.Add(NODE_BIDON, NODE_BIDON);
                                }
                            }
                            else
                            {
                                if (nodes.Length == 1)
                                {
                                    RefreshNode(nodes[0]);
                                }
                            }
                        }

                        #endregion

                        Lbl_Loading.Visible = false;
                    }
                    catch
                    {
#if DEBUG
                        throw;
#endif
                    }
                }
            }));

        }

        private void RefreshNode(TreeNode nodeSelected)
        {
            if (nodeSelected.Nodes.ContainsKey(NODE_BIDON))
            {
                nodeSelected.Nodes[NODE_BIDON].Remove();
            }

            if (nodeSelected.ImageIndex == IMG_VIRTUAL_DIR) // virtual
            {
                #region Virtual directory
                if (LogConfig.Singleton.LogBrowser.VirtualDirectories.ContainsKey(nodeSelected.FullPath))
                {
                    List<LogBrowserVirtualFile> item = LogConfig.Singleton.LogBrowser.VirtualDirectories[nodeSelected.FullPath];

                    //copy all item in a sorted list to display item alphabetic order
                    SortedList<string, LogBrowserVirtualFile> sortedVirtualFile = new SortedList<string, LogBrowserVirtualFile>();
                    foreach (LogBrowserVirtualFile virtualFile in item)
                    {
                        if (!sortedVirtualFile.ContainsKey(virtualFile.Name))
                        {
                            sortedVirtualFile.Add(virtualFile.Name, virtualFile);
                        }
                    }

                    foreach (LogBrowserVirtualFile virtualFile in sortedVirtualFile.Values)
                    {
                        TreeNode nodeTmp;
                        if (nodeSelected.Nodes.ContainsKey(virtualFile.Path))
                        {
                            nodeTmp = nodeSelected.Nodes[virtualFile.Path];
                            nodeTmp.Text = GetFileName(virtualFile);
                        }
                        else
                        {
                            nodeTmp = nodeSelected.Nodes.Add(virtualFile.Path, GetFileName(virtualFile), IMG_FILE, IMG_FILE);
                        }
                        nodeTmp.ContextMenuStrip = CtxMenu_File;
                    }
                }
                #endregion
            }
            else // for real dir
            {
                #region Real directory
                SortedDictionary<string, RealFileInfo> allFile;
                if (_realDirCache.TryGetValue(nodeSelected.Name, out allFile))
                {
                    string previousVisibleNodeKey = null;
                    // we add or update files
                    foreach (RealFileInfo fileTmp in allFile.Values)
                    {
                        if (_showAllFiles || fileTmp.Visible)
                        {
                            TreeNode nodeTmp;
                            if (!nodeSelected.Nodes.ContainsKey(fileTmp.Path)) // le fichier n'existe pas on le rajoute donc
                            {
                                int idxPrevious = string.IsNullOrEmpty(previousVisibleNodeKey) ? 0 :
                                    nodeSelected.Nodes.IndexOfKey(previousVisibleNodeKey) + 1;
                                nodeTmp = nodeSelected.Nodes.Insert(idxPrevious, fileTmp.Path, fileTmp.Name, IMG_FILE, IMG_FILE);
                                nodeTmp.ContextMenuStrip = CtxMenu_File;
                            }
                            previousVisibleNodeKey = fileTmp.Path;
                        }
                    }

                    // we remove delete file from tree
                    List<RealFileInfo> all = new List<RealFileInfo>(allFile.Values);
                    foreach (TreeNode item in nodeSelected.Nodes)
                    {
                        if (!all.Exists(x => x.Path == item.Name))
                        {
                            item.Remove();
                        }
                    }
                }
                #endregion
            }
        }

        private void FillLogBrower(TreeNode items, DirectoryInfo dir)
        {
            #region code for directories

            foreach (DirectoryInfo dirTmp in dir.GetDirectories())
            {
                TreeNode dirNode = new TreeNode(dirTmp.Name, IMG_REAL_DIR, IMG_REAL_DIR);
                dirNode.Name = dirTmp.FullName;
                //dirNode.ContextMenuStrip = Cms_CtxMenuFolder;
                FillLogBrower(dirNode, dirTmp);
                //ContextMenuStrip oo = new ContextMenuStrip(Cms_LogBrowserCtxMenu);
                if (!items.Nodes.ContainsKey(dirTmp.Name))
                {
                    TreeNode tmp = items.Nodes.Add(dirNode.Name, dirNode.Text, dirNode.ImageIndex, dirNode.SelectedImageIndex);
                    tmp.ContextMenuStrip = CtxMenu_Folder;

                    TreeNode[] tabNode = new TreeNode[dirNode.Nodes.Count];
                    dirNode.Nodes.CopyTo(tabNode, 0);
                    tmp.Nodes.AddRange(tabNode);
                }
            }

            #endregion

            #region code for files

            foreach (FileInfo fileTmp in dir.GetFiles())
            {
                if (_showAllFiles || _currentFilter.IsMatch(fileTmp.Name))
                {
                    TreeNode fileNode = items.Nodes.Add(fileTmp.FullName, GetFileName(fileTmp), IMG_FILE, IMG_FILE);
                    //fileNode.ContextMenuStrip = CtxMenu_File;
                }
            }

            #endregion
        }    

        //private static void AddOrUpdateNodes(TreeNodeCollection cacheNode, TreeNodeCollection tvNode)
        //{
        //    //tvNode.Text = cacheNode.Text;
        //    foreach (TreeNode tmp in cacheNode)
        //    {
        //        if (tvNode.ContainsKey(tmp.Name))
        //        {
        //            tvNode[tmp.Name].Text = tmp.Text;
        //            tvNode[tmp.Name].Name = tmp.Name;
        //            AddOrUpdateNodes(tmp.Nodes, tvNode[tmp.Name].Nodes);
        //        }
        //        else
        //        {
        //            tvNode.Add(tmp.Name, tmp.Text, tmp.ImageIndex, tmp.SelectedImageIndex);
        //            //AddOrUpdateNodes(tmp.Nodes, nodeTmp.Nodes);
        //        }
        //    }
        //}

        #region Manage file size
        private string GetFileName(LogBrowserVirtualFile virtualFile)
        {
            if (_showFileSize)
            {
                return String.Format("{0} ({1})", virtualFile.Name, GetFileSize(new FileInfo(virtualFile.Path)));
            }

            return virtualFile.Name;
        }

        private string GetFileName(FileSystemInfo fileTmp)
        {
            if (_showFileSize)
            {
                return String.Format("{0} ({1})", fileTmp.Name, GetFileSize(fileTmp));
            }

            return fileTmp.Name;
        }

        private string GetFileSize(FileSystemInfo fileTmp)
        {
            string size;
            if (_allFileSize.TryGetValue(fileTmp.FullName, out size))
            {
                return size;
            }

            _allFileSize.Add(fileTmp.FullName, "?");
            return "?";
        }

        private static string GetRealFileSize(FileInfo fileTmp)
        {
            if (fileTmp.Exists)
            {
                fileTmp.Refresh();
                return Tools.DisplayFileSize(fileTmp.Length);
            }

            return "?";
        } 
        #endregion

        private void LoadRealDirInCache()
        {
            ThreadPool.QueueUserWorkItem(delegate
                {
                    try
                    {
                        ManualResetEvent[] allMrs = new ManualResetEvent[LogConfig.Singleton.LogBrowser.RealDirectories.Count];
                        for (int i = 0; i < LogConfig.Singleton.LogBrowser.RealDirectories.Count; i++)
                        {
                            allMrs[i] = new ManualResetEvent(false);
                            LogBrowserItem item = LogConfig.Singleton.LogBrowser.RealDirectories[i].Clone();

                            if (item.Path == null)
                            {
                                allMrs[i].Set();
                            }
                            else
                            {
                                ThreadPool.QueueUserWorkItem(delegate(object state)
                                {
                                    try
                                    {
                                        SortedDictionary<string, RealFileInfo> allFile = new SortedDictionary<string, RealFileInfo>();

                                        string[] allDir = item.Path.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
                                        List<string> allPath = new List<string>();
                                        foreach (string pathTmp in allDir)
                                        {
                                            if (!string.IsNullOrEmpty(pathTmp.Trim()))
                                                allPath.Add(pathTmp.Trim());
                                        }

                                        foreach (string path in allPath)
                                        {
                                            DirectoryInfo infoTmp = new DirectoryInfo(path);
                                            if (infoTmp.Exists)
                                            {
                                                searchLogsInDir(item, infoTmp, ref allFile);
                                            }
                                        }

                                        if (allFile.Count > 0)
                                        {
                                            _realDirCache[item.Name] = allFile;
                                        }

                                        ManualResetEvent mrsTmp = state as ManualResetEvent;
                                        if (mrsTmp != null)
                                        {
                                            mrsTmp.Set();
                                        }
                                    }
                                    catch (UnauthorizedAccessException)
                                    {
                                    }
                                    catch (Exception ex)
                                    {
                                        Trace.WriteLine(String.Format("{0} {1} : LoadRealDirInCache2 {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), ex));
                                    }

                                }, allMrs[i]);
                            }
                        }

                        if (allMrs.Length > 0 && WaitHandle.WaitAll(allMrs))
                        {
                            RefreshLogBrowser(false);
                            _initialLoadFinished = true;
                        }
                    }
                    catch (UnauthorizedAccessException)
                    {
                    }
                    catch (Exception ex)
                    {
                        Trace.WriteLine(String.Format("{0} {1} : LoadRealDirInCache {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), ex));
                    }
                });
        }

        private void searchLogsInDir(LogBrowserItem item, DirectoryInfo infoTmp, ref SortedDictionary<string, RealFileInfo> allFile)
        {
            foreach (DirectoryInfo dirTmp in infoTmp.GetDirectories())
            {
                searchLogsInDir(item, dirTmp, ref allFile);
            }

            foreach (FileInfo fileTmp in infoTmp.GetFiles())
            {
                #region Check if file is visible
                bool visible;
                try
                {
                    visible = Regex.IsMatch(fileTmp.Name, item.Filter);
                    if (visible && LogConfig.Singleton.ShowOnlyLogBrowserFileNumDays > 0)
                        visible = DateTime.Now.Subtract(fileTmp.LastWriteTime).TotalDays <= LogConfig.Singleton.ShowOnlyLogBrowserFileNumDays;
                }
                catch (Exception)
                {
#if DEBUG
                    //throw;
#endif
                    visible = true;
                }
                #endregion

                string key = fileTmp.Name;
                if (allFile.ContainsKey(key))
                {
                    int i=1;
                    while (true)
	                {
                        key = string.Format("{0}_{1}", key, i);
                        if (!allFile.ContainsKey(key))
                        {
                            break;
                        }
                        i++;
                    }
                }
                allFile[key] = new RealFileInfo(Path.Combine(infoTmp.FullName, fileTmp.Name), GetFileName(fileTmp), visible);
            }
        }

        #endregion

        class RealFileInfo
        {
            public string Path { get; set; }
            public string Name{ get; set; }
            public bool Visible { get; set; }

            public RealFileInfo(string path, string name, bool visible)
            {
                Path = path;
                Name = name;
                Visible = visible;
            }
        }
    }
}