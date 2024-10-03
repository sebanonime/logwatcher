namespace LogWatcher.Frm
{
    partial class Frm_Master
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Frm_Master));
            this.SS_Main = new System.Windows.Forms.StatusStrip();
            this.Lbl_Info = new System.Windows.Forms.ToolStripStatusLabel();
            this.Pb_Main = new System.Windows.Forms.ToolStripProgressBar();
            this.Lbl_Tail = new System.Windows.Forms.ToolStripStatusLabel();
            this.Notify_Alert = new System.Windows.Forms.NotifyIcon(this.components);
            this.Menu_Main = new System.Windows.Forms.MenuStrip();
            this.fileStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.openFileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.openFileWithFilterToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.saveLinesInFileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.openLinesInNewTabToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.editToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.closeTabToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.closeAllTabToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.closeAllButThisToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.goToLineToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.searchFilterToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.searchToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.searchNextToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.filterToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.disableAllFilterToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.optionToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.highlightingToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.followTailToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.alwaysOnTopToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.logBrowserToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.showContextToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.showDetailToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.selectedViewToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.showFilterHistoricToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.clearLogFileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.plugginToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.aboutToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.DckPnl_Main = new WeifenLuo.WinFormsUI.Docking.DockPanel();
            this.toolStripContainer1 = new System.Windows.Forms.ToolStripContainer();
            this.toolStrip1 = new System.Windows.Forms.ToolStrip();
            this.Btn_ChangeProfile = new System.Windows.Forms.ToolStripButton();
            this.Lbl_SelectedProfile = new System.Windows.Forms.ToolStripLabel();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.toolStripLabel2 = new System.Windows.Forms.ToolStripLabel();
            this.toolStripLabel3 = new System.Windows.Forms.ToolStripLabel();
            this.Ddl_StoredFilters = new System.Windows.Forms.ToolStripComboBox();
            this.toolStripLabel1 = new System.Windows.Forms.ToolStripLabel();
            this.Txt_Search = new System.Windows.Forms.ToolStripTextBox();
            this.Btn_CancelFilter = new System.Windows.Forms.ToolStripButton();
            this.Btn_Filter = new System.Windows.Forms.ToolStripButton();
            this.Btn_Search = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator2 = new System.Windows.Forms.ToolStripSeparator();
            this.Btn_NavigateBackward = new System.Windows.Forms.ToolStripButton();
            this.Btn_NavigateForward = new System.Windows.Forms.ToolStripButton();
            this.Btn_DetailView = new System.Windows.Forms.ToolStripButton();
            this.Btn_ContextView = new System.Windows.Forms.ToolStripButton();
            this.SS_Main.SuspendLayout();
            this.Menu_Main.SuspendLayout();
            this.toolStripContainer1.ContentPanel.SuspendLayout();
            this.toolStripContainer1.TopToolStripPanel.SuspendLayout();
            this.toolStripContainer1.SuspendLayout();
            this.toolStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // SS_Main
            // 
            this.SS_Main.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.Lbl_Info,
            this.Pb_Main,
            this.Lbl_Tail});
            this.SS_Main.Location = new System.Drawing.Point(0, 651);
            this.SS_Main.Name = "SS_Main";
            this.SS_Main.RenderMode = System.Windows.Forms.ToolStripRenderMode.Professional;
            this.SS_Main.Size = new System.Drawing.Size(1053, 22);
            this.SS_Main.TabIndex = 0;
            this.SS_Main.Text = "statusStrip1";
            // 
            // Lbl_Info
            // 
            this.Lbl_Info.Name = "Lbl_Info";
            this.Lbl_Info.Size = new System.Drawing.Size(996, 17);
            this.Lbl_Info.Spring = true;
            this.Lbl_Info.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // Pb_Main
            // 
            this.Pb_Main.Name = "Pb_Main";
            this.Pb_Main.Size = new System.Drawing.Size(100, 16);
            this.Pb_Main.Visible = false;
            // 
            // Lbl_Tail
            // 
            this.Lbl_Tail.Image = ((System.Drawing.Image)(resources.GetObject("Lbl_Tail.Image")));
            this.Lbl_Tail.Name = "Lbl_Tail";
            this.Lbl_Tail.Size = new System.Drawing.Size(42, 17);
            this.Lbl_Tail.Text = "Tail";
            this.Lbl_Tail.Click += new System.EventHandler(this.OnFollowTail_Click);
            // 
            // Notify_Alert
            // 
            this.Notify_Alert.Icon = ((System.Drawing.Icon)(resources.GetObject("Notify_Alert.Icon")));
            this.Notify_Alert.Text = "LogWatcher";
            // 
            // Menu_Main
            // 
            this.Menu_Main.ImeMode = System.Windows.Forms.ImeMode.Off;
            this.Menu_Main.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileStripMenuItem1,
            this.editToolStripMenuItem,
            this.searchFilterToolStripMenuItem,
            this.optionToolStripMenuItem,
            this.plugginToolStripMenuItem,
            this.toolStripMenuItem1});
            this.Menu_Main.Location = new System.Drawing.Point(0, 0);
            this.Menu_Main.Name = "Menu_Main";
            this.Menu_Main.RenderMode = System.Windows.Forms.ToolStripRenderMode.Professional;
            this.Menu_Main.Size = new System.Drawing.Size(1053, 24);
            this.Menu_Main.TabIndex = 0;
            this.Menu_Main.Text = "menuStrip1";
            // 
            // fileStripMenuItem1
            // 
            this.fileStripMenuItem1.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.openFileToolStripMenuItem,
            this.openFileWithFilterToolStripMenuItem,
            this.saveLinesInFileToolStripMenuItem,
            this.openLinesInNewTabToolStripMenuItem,
            this.exitToolStripMenuItem});
            this.fileStripMenuItem1.Name = "fileStripMenuItem1";
            this.fileStripMenuItem1.Size = new System.Drawing.Size(37, 20);
            this.fileStripMenuItem1.Text = "File";
            // 
            // openFileToolStripMenuItem
            // 
            this.openFileToolStripMenuItem.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.openFileToolStripMenuItem.ImageAlign = System.Drawing.ContentAlignment.BottomLeft;
            this.openFileToolStripMenuItem.Name = "openFileToolStripMenuItem";
            this.openFileToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.O)));
            this.openFileToolStripMenuItem.Size = new System.Drawing.Size(188, 22);
            this.openFileToolStripMenuItem.Text = "Open file";
            this.openFileToolStripMenuItem.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.openFileToolStripMenuItem.Click += new System.EventHandler(this.Btn_Open_Click);
            // 
            // openFileWithFilterToolStripMenuItem
            // 
            this.openFileWithFilterToolStripMenuItem.Name = "openFileWithFilterToolStripMenuItem";
            this.openFileWithFilterToolStripMenuItem.Size = new System.Drawing.Size(188, 22);
            this.openFileWithFilterToolStripMenuItem.Text = "Open file with filter";
            this.openFileWithFilterToolStripMenuItem.Click += new System.EventHandler(this.openFileWithFilterToolStripMenuItem_Click);
            // 
            // saveLinesInFileToolStripMenuItem
            // 
            this.saveLinesInFileToolStripMenuItem.Name = "saveLinesInFileToolStripMenuItem";
            this.saveLinesInFileToolStripMenuItem.Size = new System.Drawing.Size(188, 22);
            this.saveLinesInFileToolStripMenuItem.Text = "Save lines in new file";
            this.saveLinesInFileToolStripMenuItem.Click += new System.EventHandler(this.saveLinesInFileToolStripMenuItem_Click);
            // 
            // openLinesInNewTabToolStripMenuItem
            // 
            this.openLinesInNewTabToolStripMenuItem.Name = "openLinesInNewTabToolStripMenuItem";
            this.openLinesInNewTabToolStripMenuItem.Size = new System.Drawing.Size(188, 22);
            this.openLinesInNewTabToolStripMenuItem.Text = "Open lines in new tab";
            this.openLinesInNewTabToolStripMenuItem.Click += new System.EventHandler(this.openLinesInNewTabToolStripMenuItem_Click);
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(188, 22);
            this.exitToolStripMenuItem.Text = "Exit";
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.exitToolStripMenuItem_Click);
            // 
            // editToolStripMenuItem
            // 
            this.editToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.closeTabToolStripMenuItem,
            this.closeAllTabToolStripMenuItem,
            this.closeAllButThisToolStripMenuItem,
            this.goToLineToolStripMenuItem});
            this.editToolStripMenuItem.Name = "editToolStripMenuItem";
            this.editToolStripMenuItem.Size = new System.Drawing.Size(39, 20);
            this.editToolStripMenuItem.Text = "Edit";
            // 
            // closeTabToolStripMenuItem
            // 
            this.closeTabToolStripMenuItem.Name = "closeTabToolStripMenuItem";
            this.closeTabToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.W)));
            this.closeTabToolStripMenuItem.Size = new System.Drawing.Size(181, 22);
            this.closeTabToolStripMenuItem.Text = "Close Tab";
            this.closeTabToolStripMenuItem.Click += new System.EventHandler(this.closeTabToolStripMenuItem_Click);
            // 
            // closeAllTabToolStripMenuItem
            // 
            this.closeAllTabToolStripMenuItem.Name = "closeAllTabToolStripMenuItem";
            this.closeAllTabToolStripMenuItem.Size = new System.Drawing.Size(181, 22);
            this.closeAllTabToolStripMenuItem.Text = "Close all tab";
            this.closeAllTabToolStripMenuItem.Click += new System.EventHandler(this.closeAllTabToolStripMenuItem_Click);
            // 
            // closeAllButThisToolStripMenuItem
            // 
            this.closeAllButThisToolStripMenuItem.Name = "closeAllButThisToolStripMenuItem";
            this.closeAllButThisToolStripMenuItem.Size = new System.Drawing.Size(181, 22);
            this.closeAllButThisToolStripMenuItem.Text = "Close all tab but this";
            this.closeAllButThisToolStripMenuItem.Click += new System.EventHandler(this.closeAllButThisToolStripMenuItem_Click);
            // 
            // goToLineToolStripMenuItem
            // 
            this.goToLineToolStripMenuItem.Name = "goToLineToolStripMenuItem";
            this.goToLineToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.G)));
            this.goToLineToolStripMenuItem.Size = new System.Drawing.Size(181, 22);
            this.goToLineToolStripMenuItem.Text = "Go to line";
            this.goToLineToolStripMenuItem.Click += new System.EventHandler(this.goToLineToolStripMenuItem_Click);
            // 
            // searchFilterToolStripMenuItem
            // 
            this.searchFilterToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.searchToolStripMenuItem,
            this.searchNextToolStripMenuItem,
            this.filterToolStripMenuItem,
            this.disableAllFilterToolStripMenuItem});
            this.searchFilterToolStripMenuItem.Name = "searchFilterToolStripMenuItem";
            this.searchFilterToolStripMenuItem.Size = new System.Drawing.Size(96, 20);
            this.searchFilterToolStripMenuItem.Text = "Search && Filter";
            // 
            // searchToolStripMenuItem
            // 
            this.searchToolStripMenuItem.Name = "searchToolStripMenuItem";
            this.searchToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.F)));
            this.searchToolStripMenuItem.Size = new System.Drawing.Size(168, 22);
            this.searchToolStripMenuItem.Text = "Search";
            this.searchToolStripMenuItem.Click += new System.EventHandler(this.searchToolStripMenuItem_Click);
            // 
            // searchNextToolStripMenuItem
            // 
            this.searchNextToolStripMenuItem.Name = "searchNextToolStripMenuItem";
            this.searchNextToolStripMenuItem.ShortcutKeys = System.Windows.Forms.Keys.F3;
            this.searchNextToolStripMenuItem.Size = new System.Drawing.Size(168, 22);
            this.searchNextToolStripMenuItem.Text = "Search next";
            this.searchNextToolStripMenuItem.Click += new System.EventHandler(this.searchNextToolStripMenuItem_Click);
            // 
            // filterToolStripMenuItem
            // 
            this.filterToolStripMenuItem.Name = "filterToolStripMenuItem";
            this.filterToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)(((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.Shift)
                        | System.Windows.Forms.Keys.F)));
            this.filterToolStripMenuItem.Size = new System.Drawing.Size(168, 22);
            this.filterToolStripMenuItem.Text = "Filter";
            this.filterToolStripMenuItem.Click += new System.EventHandler(this.filterToolStripMenuItem_Click);
            // 
            // disableAllFilterToolStripMenuItem
            // 
            this.disableAllFilterToolStripMenuItem.Name = "disableAllFilterToolStripMenuItem";
            this.disableAllFilterToolStripMenuItem.ShortcutKeys = System.Windows.Forms.Keys.F8;
            this.disableAllFilterToolStripMenuItem.Size = new System.Drawing.Size(168, 22);
            this.disableAllFilterToolStripMenuItem.Text = "Cancel filter";
            this.disableAllFilterToolStripMenuItem.Click += new System.EventHandler(this.disableAllFilterToolStripMenuItem_Click);
            // 
            // optionToolStripMenuItem
            // 
            this.optionToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.highlightingToolStripMenuItem,
            this.followTailToolStripMenuItem,
            this.alwaysOnTopToolStripMenuItem,
            this.logBrowserToolStripMenuItem,
            this.showContextToolStripMenuItem,
            this.showDetailToolStripMenuItem,
            this.selectedViewToolStripMenuItem,
            this.showFilterHistoricToolStripMenuItem,
            this.clearLogFileToolStripMenuItem});
            this.optionToolStripMenuItem.Name = "optionToolStripMenuItem";
            this.optionToolStripMenuItem.Size = new System.Drawing.Size(48, 20);
            this.optionToolStripMenuItem.Text = "Tools";
            // 
            // highlightingToolStripMenuItem
            // 
            this.highlightingToolStripMenuItem.Name = "highlightingToolStripMenuItem";
            this.highlightingToolStripMenuItem.Size = new System.Drawing.Size(192, 22);
            this.highlightingToolStripMenuItem.Text = "Option";
            this.highlightingToolStripMenuItem.Click += new System.EventHandler(this.ShowConfigToolStripMenuItem_Click);
            // 
            // followTailToolStripMenuItem
            // 
            this.followTailToolStripMenuItem.CheckOnClick = true;
            this.followTailToolStripMenuItem.Name = "followTailToolStripMenuItem";
            this.followTailToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.T)));
            this.followTailToolStripMenuItem.Size = new System.Drawing.Size(192, 22);
            this.followTailToolStripMenuItem.Text = "Follow Tail";
            this.followTailToolStripMenuItem.Click += new System.EventHandler(this.OnFollowTail_Click);
            // 
            // alwaysOnTopToolStripMenuItem
            // 
            this.alwaysOnTopToolStripMenuItem.CheckOnClick = true;
            this.alwaysOnTopToolStripMenuItem.Name = "alwaysOnTopToolStripMenuItem";
            this.alwaysOnTopToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.Q)));
            this.alwaysOnTopToolStripMenuItem.Size = new System.Drawing.Size(192, 22);
            this.alwaysOnTopToolStripMenuItem.Text = "Always on top";
            this.alwaysOnTopToolStripMenuItem.Click += new System.EventHandler(this.alwaysOnTopToolStripMenuItem_Click);
            // 
            // logBrowserToolStripMenuItem
            // 
            this.logBrowserToolStripMenuItem.Name = "logBrowserToolStripMenuItem";
            this.logBrowserToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.B)));
            this.logBrowserToolStripMenuItem.Size = new System.Drawing.Size(192, 22);
            this.logBrowserToolStripMenuItem.Text = "Log Browser";
            this.logBrowserToolStripMenuItem.Click += new System.EventHandler(this.logBrowserToolStripMenuItem_Click);
            // 
            // showContextToolStripMenuItem
            // 
            this.showContextToolStripMenuItem.Name = "showContextToolStripMenuItem";
            this.showContextToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.R)));
            this.showContextToolStripMenuItem.Size = new System.Drawing.Size(192, 22);
            this.showContextToolStripMenuItem.Text = "Show context";
            this.showContextToolStripMenuItem.Click += new System.EventHandler(this.Btn_ContextView_Click);
            // 
            // showDetailToolStripMenuItem
            // 
            this.showDetailToolStripMenuItem.Name = "showDetailToolStripMenuItem";
            this.showDetailToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.D)));
            this.showDetailToolStripMenuItem.Size = new System.Drawing.Size(192, 22);
            this.showDetailToolStripMenuItem.Text = "Show detail";
            this.showDetailToolStripMenuItem.Click += new System.EventHandler(this.Btn_DetailView_Click);
            // 
            // selectedViewToolStripMenuItem
            // 
            this.selectedViewToolStripMenuItem.Name = "selectedViewToolStripMenuItem";
            this.selectedViewToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.S)));
            this.selectedViewToolStripMenuItem.Size = new System.Drawing.Size(192, 22);
            this.selectedViewToolStripMenuItem.Text = "Selected view";
            this.selectedViewToolStripMenuItem.Click += new System.EventHandler(this.selectedViewToolStripMenuItem_Click);
            // 
            // showFilterHistoricToolStripMenuItem
            // 
            this.showFilterHistoricToolStripMenuItem.Name = "showFilterHistoricToolStripMenuItem";
            this.showFilterHistoricToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.H)));
            this.showFilterHistoricToolStripMenuItem.Size = new System.Drawing.Size(192, 22);
            this.showFilterHistoricToolStripMenuItem.Text = "Filter historic";
            this.showFilterHistoricToolStripMenuItem.Click += new System.EventHandler(this.filterHistoricToolStripMenuItem_Click);
            // 
            // clearLogFileToolStripMenuItem
            // 
            this.clearLogFileToolStripMenuItem.Name = "clearLogFileToolStripMenuItem";
            this.clearLogFileToolStripMenuItem.Size = new System.Drawing.Size(192, 22);
            this.clearLogFileToolStripMenuItem.Text = "Clear Log File";
            this.clearLogFileToolStripMenuItem.Click += new System.EventHandler(this.clearLogFileToolStripMenuItem_Click);
            // 
            // plugginToolStripMenuItem
            // 
            this.plugginToolStripMenuItem.Name = "plugginToolStripMenuItem";
            this.plugginToolStripMenuItem.Size = new System.Drawing.Size(53, 20);
            this.plugginToolStripMenuItem.Text = "Plugin";
            // 
            // toolStripMenuItem1
            // 
            this.toolStripMenuItem1.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.aboutToolStripMenuItem});
            this.toolStripMenuItem1.Name = "toolStripMenuItem1";
            this.toolStripMenuItem1.Size = new System.Drawing.Size(24, 20);
            this.toolStripMenuItem1.Text = "?";
            // 
            // aboutToolStripMenuItem
            // 
            this.aboutToolStripMenuItem.Name = "aboutToolStripMenuItem";
            this.aboutToolStripMenuItem.Size = new System.Drawing.Size(107, 22);
            this.aboutToolStripMenuItem.Text = "About";
            this.aboutToolStripMenuItem.Click += new System.EventHandler(this.aboutToolStripMenuItem_Click);
            // 
            // DckPnl_Main
            // 
            this.DckPnl_Main.ActiveAutoHideContent = null;
            this.DckPnl_Main.AllowDrop = true;
            this.DckPnl_Main.Dock = System.Windows.Forms.DockStyle.Fill;
            this.DckPnl_Main.DocumentStyle = WeifenLuo.WinFormsUI.Docking.DocumentStyle.DockingWindow;
            this.DckPnl_Main.Location = new System.Drawing.Point(0, 0);
            this.DckPnl_Main.Name = "DckPnl_Main";
            this.DckPnl_Main.ShowDocumentIcon = true;
            this.DckPnl_Main.Size = new System.Drawing.Size(1053, 602);
            this.DckPnl_Main.TabIndex = 5;
            this.DckPnl_Main.ActiveContentChanged += new System.EventHandler(this.DckPnl_Main_ActiveContentChanged);
            this.DckPnl_Main.DragDrop += new System.Windows.Forms.DragEventHandler(this.Main_Contener_DragDrop);
            this.DckPnl_Main.DragEnter += new System.Windows.Forms.DragEventHandler(this.Main_Contener_DragEnter);
            // 
            // toolStripContainer1
            // 
            this.toolStripContainer1.BottomToolStripPanelVisible = false;
            // 
            // toolStripContainer1.ContentPanel
            // 
            this.toolStripContainer1.ContentPanel.Controls.Add(this.DckPnl_Main);
            this.toolStripContainer1.ContentPanel.Size = new System.Drawing.Size(1053, 602);
            this.toolStripContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.toolStripContainer1.LeftToolStripPanelVisible = false;
            this.toolStripContainer1.Location = new System.Drawing.Point(0, 24);
            this.toolStripContainer1.Name = "toolStripContainer1";
            this.toolStripContainer1.RightToolStripPanelVisible = false;
            this.toolStripContainer1.Size = new System.Drawing.Size(1053, 627);
            this.toolStripContainer1.TabIndex = 6;
            this.toolStripContainer1.Text = "toolStripContainer1";
            // 
            // toolStripContainer1.TopToolStripPanel
            // 
            this.toolStripContainer1.TopToolStripPanel.Controls.Add(this.toolStrip1);
            // 
            // toolStrip1
            // 
            this.toolStrip1.Dock = System.Windows.Forms.DockStyle.None;
            this.toolStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.Btn_ChangeProfile,
            this.Lbl_SelectedProfile,
            this.toolStripSeparator1,
            this.toolStripLabel2,
            this.toolStripLabel3,
            this.Ddl_StoredFilters,
            this.toolStripLabel1,
            this.Txt_Search,
            this.Btn_CancelFilter,
            this.Btn_Filter,
            this.Btn_Search,
            this.toolStripSeparator2,
            this.Btn_NavigateBackward,
            this.Btn_NavigateForward,
            this.Btn_DetailView,
            this.Btn_ContextView});
            this.toolStrip1.LayoutStyle = System.Windows.Forms.ToolStripLayoutStyle.HorizontalStackWithOverflow;
            this.toolStrip1.Location = new System.Drawing.Point(3, 0);
            this.toolStrip1.Name = "toolStrip1";
            this.toolStrip1.Size = new System.Drawing.Size(812, 25);
            this.toolStrip1.TabIndex = 0;
            // 
            // Btn_ChangeProfile
            // 
            this.Btn_ChangeProfile.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_ChangeProfile.Image = global::LogWatcher.Properties.Resources.RefreshDir;
            this.Btn_ChangeProfile.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_ChangeProfile.Name = "Btn_ChangeProfile";
            this.Btn_ChangeProfile.Size = new System.Drawing.Size(23, 22);
            this.Btn_ChangeProfile.Text = "toolStripButton1";
            this.Btn_ChangeProfile.ToolTipText = "Change profile  for selected log";
            this.Btn_ChangeProfile.Click += new System.EventHandler(this.Btn_ChangeProfile_Click);
            // 
            // Lbl_SelectedProfile
            // 
            this.Lbl_SelectedProfile.Name = "Lbl_SelectedProfile";
            this.Lbl_SelectedProfile.Size = new System.Drawing.Size(81, 22);
            this.Lbl_SelectedProfile.Text = "[ProfileName]";
            this.Lbl_SelectedProfile.ToolTipText = "Profile name";
            // 
            // toolStripSeparator1
            // 
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(6, 25);
            // 
            // toolStripLabel2
            // 
            this.toolStripLabel2.Name = "toolStripLabel2";
            this.toolStripLabel2.Size = new System.Drawing.Size(0, 22);
            // 
            // toolStripLabel3
            // 
            this.toolStripLabel3.Name = "toolStripLabel3";
            this.toolStripLabel3.Size = new System.Drawing.Size(38, 22);
            this.toolStripLabel3.Text = "Filters";
            // 
            // Ddl_StoredFilters
            // 
            this.Ddl_StoredFilters.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.Ddl_StoredFilters.Name = "Ddl_StoredFilters";
            this.Ddl_StoredFilters.Size = new System.Drawing.Size(125, 25);
            this.Ddl_StoredFilters.SelectedIndexChanged += new System.EventHandler(this.Ddl_StockedFilters_SelectedIndexChanged);
            // 
            // toolStripLabel1
            // 
            this.toolStripLabel1.Name = "toolStripLabel1";
            this.toolStripLabel1.Size = new System.Drawing.Size(125, 22);
            this.toolStripLabel1.Text = "Quick Search or Filter :";
            // 
            // Txt_Search
            // 
            this.Txt_Search.AutoCompleteMode = System.Windows.Forms.AutoCompleteMode.Suggest;
            this.Txt_Search.Name = "Txt_Search";
            this.Txt_Search.Size = new System.Drawing.Size(200, 25);
            this.Txt_Search.KeyUp += new System.Windows.Forms.KeyEventHandler(this.Txt_Search_KeyUp);
            // 
            // Btn_CancelFilter
            // 
            this.Btn_CancelFilter.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_CancelFilter.Image = global::LogWatcher.Properties.Resources.CancelFilter;
            this.Btn_CancelFilter.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_CancelFilter.Name = "Btn_CancelFilter";
            this.Btn_CancelFilter.Size = new System.Drawing.Size(23, 22);
            this.Btn_CancelFilter.Text = "Cancel Filter";
            this.Btn_CancelFilter.ToolTipText = "Cancel Filter (F8)";
            this.Btn_CancelFilter.Click += new System.EventHandler(this.disableAllFilterToolStripMenuItem_Click);
            // 
            // Btn_Filter
            // 
            this.Btn_Filter.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_Filter.Image = global::LogWatcher.Properties.Resources.filter;
            this.Btn_Filter.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_Filter.Name = "Btn_Filter";
            this.Btn_Filter.Size = new System.Drawing.Size(23, 22);
            this.Btn_Filter.Text = "Filter";
            this.Btn_Filter.ToolTipText = "Quick Filter (Enter)";
            this.Btn_Filter.Click += new System.EventHandler(this.Btn_Filter_Click);
            // 
            // Btn_Search
            // 
            this.Btn_Search.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_Search.Image = global::LogWatcher.Properties.Resources.Search;
            this.Btn_Search.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_Search.Name = "Btn_Search";
            this.Btn_Search.Size = new System.Drawing.Size(23, 22);
            this.Btn_Search.Text = "Search";
            this.Btn_Search.ToolTipText = "Quick Search (F5)";
            this.Btn_Search.Click += new System.EventHandler(this.Btn_Search_Click);
            // 
            // toolStripSeparator2
            // 
            this.toolStripSeparator2.Name = "toolStripSeparator2";
            this.toolStripSeparator2.Size = new System.Drawing.Size(6, 25);
            // 
            // Btn_NavigateBackward
            // 
            this.Btn_NavigateBackward.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_NavigateBackward.Image = global::LogWatcher.Properties.Resources.NavBackwardEnable;
            this.Btn_NavigateBackward.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_NavigateBackward.Name = "Btn_NavigateBackward";
            this.Btn_NavigateBackward.Size = new System.Drawing.Size(23, 24);
            this.Btn_NavigateBackward.Text = "Navigate Forward";
            this.Btn_NavigateBackward.ToolTipText = "Navigate Backward";
            this.Btn_NavigateBackward.Visible = false;
            this.Btn_NavigateBackward.Click += new System.EventHandler(this.Btn_NavigateBackward_Click);
            // 
            // Btn_NavigateForward
            // 
            this.Btn_NavigateForward.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_NavigateForward.Enabled = false;
            this.Btn_NavigateForward.Image = global::LogWatcher.Properties.Resources.NavForwardEnable;
            this.Btn_NavigateForward.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_NavigateForward.Name = "Btn_NavigateForward";
            this.Btn_NavigateForward.Size = new System.Drawing.Size(23, 22);
            this.Btn_NavigateForward.Text = "toolStripButton2";
            this.Btn_NavigateForward.Visible = false;
            this.Btn_NavigateForward.Click += new System.EventHandler(this.Btn_NavigateForward_Click);
            // 
            // Btn_DetailView
            // 
            this.Btn_DetailView.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_DetailView.Image = global::LogWatcher.Properties.Resources.Detail;
            this.Btn_DetailView.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_DetailView.Name = "Btn_DetailView";
            this.Btn_DetailView.Size = new System.Drawing.Size(23, 22);
            this.Btn_DetailView.Text = "toolStripButton3";
            this.Btn_DetailView.ToolTipText = "Detail View of the selected row (Ctrl+D)";
            this.Btn_DetailView.Click += new System.EventHandler(this.Btn_DetailView_Click);
            // 
            // Btn_ContextView
            // 
            this.Btn_ContextView.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_ContextView.Image = global::LogWatcher.Properties.Resources.Context;
            this.Btn_ContextView.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_ContextView.Name = "Btn_ContextView";
            this.Btn_ContextView.Size = new System.Drawing.Size(23, 22);
            this.Btn_ContextView.Text = "toolStripButton4";
            this.Btn_ContextView.ToolTipText = "Context View of the selected row (Ctrl+R)";
            this.Btn_ContextView.Click += new System.EventHandler(this.Btn_ContextView_Click);
            // 
            // Frm_Master
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1053, 673);
            this.Controls.Add(this.toolStripContainer1);
            this.Controls.Add(this.Menu_Main);
            this.Controls.Add(this.SS_Main);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.Menu_Main;
            this.MinimumSize = new System.Drawing.Size(600, 500);
            this.Name = "Frm_Master";
            this.StartPosition = System.Windows.Forms.FormStartPosition.Manual;
            this.Text = "LogWatcher";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.Frm_Master_FormClosed);
            this.Shown += new System.EventHandler(this.Frm_Master_Shown);
            this.SS_Main.ResumeLayout(false);
            this.SS_Main.PerformLayout();
            this.Menu_Main.ResumeLayout(false);
            this.Menu_Main.PerformLayout();
            this.toolStripContainer1.ContentPanel.ResumeLayout(false);
            this.toolStripContainer1.TopToolStripPanel.ResumeLayout(false);
            this.toolStripContainer1.TopToolStripPanel.PerformLayout();
            this.toolStripContainer1.ResumeLayout(false);
            this.toolStripContainer1.PerformLayout();
            this.toolStrip1.ResumeLayout(false);
            this.toolStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.StatusStrip SS_Main;
        private System.Windows.Forms.ToolStripStatusLabel Lbl_Info;
        private System.Windows.Forms.MenuStrip Menu_Main;
        private System.Windows.Forms.ToolStripMenuItem fileStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem openFileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem editToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem optionToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem highlightingToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem followTailToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem aboutToolStripMenuItem;
        private System.Windows.Forms.ToolStripProgressBar Pb_Main;
        private System.Windows.Forms.ToolStripStatusLabel Lbl_Tail;
        private System.Windows.Forms.ToolStripMenuItem closeTabToolStripMenuItem;
        private System.Windows.Forms.NotifyIcon Notify_Alert;
        private WeifenLuo.WinFormsUI.Docking.DockPanel DckPnl_Main;
        private System.Windows.Forms.ToolStripMenuItem alwaysOnTopToolStripMenuItem;
        private System.Windows.Forms.ToolStripContainer toolStripContainer1;
        private System.Windows.Forms.ToolStrip toolStrip1;
        private System.Windows.Forms.ToolStripTextBox Txt_Search;
        private System.Windows.Forms.ToolStripButton Btn_Filter;
        private System.Windows.Forms.ToolStripButton Btn_Search;
        private System.Windows.Forms.ToolStripLabel toolStripLabel2;
        private System.Windows.Forms.ToolStripLabel toolStripLabel1;
        private System.Windows.Forms.ToolStripButton Btn_CancelFilter;
        private System.Windows.Forms.ToolStripMenuItem logBrowserToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem searchFilterToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem searchToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem filterToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem disableAllFilterToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem searchNextToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem showContextToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem showDetailToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem plugginToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem clearLogFileToolStripMenuItem;
        private System.Windows.Forms.ToolStripLabel toolStripLabel3;
        private System.Windows.Forms.ToolStripComboBox Ddl_StoredFilters;
        private System.Windows.Forms.ToolStripMenuItem saveLinesInFileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem openLinesInNewTabToolStripMenuItem;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator2;
        private System.Windows.Forms.ToolStripButton Btn_NavigateForward;
        private System.Windows.Forms.ToolStripButton Btn_DetailView;
        private System.Windows.Forms.ToolStripButton Btn_ContextView;
        private System.Windows.Forms.ToolStripButton Btn_NavigateBackward;
        private System.Windows.Forms.ToolStripMenuItem selectedViewToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem showFilterHistoricToolStripMenuItem;
        private System.Windows.Forms.ToolStripButton Btn_ChangeProfile;
        private System.Windows.Forms.ToolStripLabel Lbl_SelectedProfile;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
        private System.Windows.Forms.ToolStripMenuItem goToLineToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem openFileWithFilterToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem closeAllTabToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem closeAllButThisToolStripMenuItem;
    }
}