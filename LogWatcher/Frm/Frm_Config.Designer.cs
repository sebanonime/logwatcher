using LogWatcher.Common;

namespace LogWatcher.Frm
{
    partial class Frm_Config
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
            System.Windows.Forms.TabControl Tabs_Config;
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Frm_Config));
            this.Tp_Profile = new System.Windows.Forms.TabPage();
            this.Pnl_ProfileCommon = new System.Windows.Forms.Panel();
            this.Lbl_SharedProfile = new System.Windows.Forms.Label();
            this.Ddl_ProfileEncoding = new System.Windows.Forms.ComboBox();
            this.profileBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.label33 = new System.Windows.Forms.Label();
            this.Btn_LoadProfile = new System.Windows.Forms.Button();
            this.Btn_SaveProfile = new System.Windows.Forms.Button();
            this.Ddl_ProfileName = new System.Windows.Forms.ComboBox();
            this.label7 = new System.Windows.Forms.Label();
            this.Txt_FileName = new System.Windows.Forms.TextBox();
            this.Btn_AddProfile = new System.Windows.Forms.Button();
            this.label9 = new System.Windows.Forms.Label();
            this.Btn_RemoveProfile = new System.Windows.Forms.Button();
            this.Btn_Browse = new System.Windows.Forms.Button();
            this.Tab_Profile = new System.Windows.Forms.TabControl();
            this.Tp_ProfileHighlighting = new System.Windows.Forms.TabPage();
            this.Cb_PHL_Regex = new System.Windows.Forms.CheckBox();
            this.ProfileHighlightingBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.Cb_PHL_Bold = new System.Windows.Forms.CheckBox();
            this.Dgv_Profile = new System.Windows.Forms.DataGridView();
            this.dataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.profileDgvOrderColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.textDataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.foreColorDataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.backColorDataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.caseSensitiveDataGridViewCheckBoxColumn1 = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.hightPriorityDataGridViewCheckBoxColumn = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.Btn_ProfileForeColor = new System.Windows.Forms.Button();
            this.Btn_ProfileBackColor = new System.Windows.Forms.Button();
            this.label8 = new System.Windows.Forms.Label();
            this.Lbl_ProfileApercu = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.Btn_ProfileAddHighlight = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.Cb_ProfileCase = new System.Windows.Forms.CheckBox();
            this.Btn_ProfileDown = new System.Windows.Forms.Button();
            this.Txt_ProfileText = new System.Windows.Forms.TextBox();
            this.Btn_ProfileDeleteHighlight = new System.Windows.Forms.Button();
            this.Btn_ProfileUp = new System.Windows.Forms.Button();
            this.Tp_ProfileHiddenLog = new System.Windows.Forms.TabPage();
            this.Bnt_Phid_ActivateAll = new System.Windows.Forms.Button();
            this.Bnt_Phid_DesactivateAll = new System.Windows.Forms.Button();
            this.Cb_PHid_Actif = new System.Windows.Forms.CheckBox();
            this.Cb_PHid_Regex = new System.Windows.Forms.CheckBox();
            this.Cb_PHid_CaseSensitive = new System.Windows.Forms.CheckBox();
            this.Dgv_HiddenLines = new System.Windows.Forms.DataGridView();
            this.isActifDataGridViewCheckBoxColumn = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.textDataGridViewTextBoxColumn3 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.CaseSensitive = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.isRegexDataGridViewCheckBoxColumn = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.hiddenLineBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.label28 = new System.Windows.Forms.Label();
            this.Btn_AddHiddenLog = new System.Windows.Forms.Button();
            this.Btn_DelHiddenLog = new System.Windows.Forms.Button();
            this.label10 = new System.Windows.Forms.Label();
            this.Txt_ProfileHiddenLog = new System.Windows.Forms.TextBox();
            this.Tp_ProfileStoredFilter = new System.Windows.Forms.TabPage();
            this.Cb_Psf_Regex = new System.Windows.Forms.CheckBox();
            this.storedFilterBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.Cb_Psf_CaseSensitive = new System.Windows.Forms.CheckBox();
            this.Dgv_StoredFilters = new System.Windows.Forms.DataGridView();
            this.nameDataGridViewTextBoxColumn2 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.filterDataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.IsRegex = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.dataGridViewCheckBoxColumn1 = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.Txt_ProfileFilterName = new System.Windows.Forms.TextBox();
            this.Txt_ProfileFilter = new System.Windows.Forms.TextBox();
            this.Btn_ProfileAddStoredFilter = new System.Windows.Forms.Button();
            this.Btn_ProfileDeleteStoredFilter = new System.Windows.Forms.Button();
            this.label31 = new System.Windows.Forms.Label();
            this.label30 = new System.Windows.Forms.Label();
            this.label29 = new System.Windows.Forms.Label();
            this.Tp_Level = new System.Windows.Forms.TabPage();
            this.Cb_Level_Regex = new System.Windows.Forms.CheckBox();
            this.highlightingBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.Cb_LHL_Bold = new System.Windows.Forms.CheckBox();
            this.label23 = new System.Windows.Forms.Label();
            this.Cb_HighPriority = new System.Windows.Forms.CheckBox();
            this.Cb_LevelCase = new System.Windows.Forms.CheckBox();
            this.Dgv_Level = new System.Windows.Forms.DataGridView();
            this.Selection = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.orderDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.textDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.backColorDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.caseSensitiveDataGridViewCheckBoxColumn = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.foreColorDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Btn_LevelDelete = new System.Windows.Forms.Button();
            this.Btn_LevelUp = new System.Windows.Forms.Button();
            this.Txt_LevelText = new System.Windows.Forms.TextBox();
            this.Btn_LevelDown = new System.Windows.Forms.Button();
            this.Lbl_Text = new System.Windows.Forms.Label();
            this.Btn_LevelAdd = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.Lbl_LevelApercu = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.Btn_LevelBackColor = new System.Windows.Forms.Button();
            this.Btn_LevelForeColor = new System.Windows.Forms.Button();
            this.Tp_LogBrowser = new System.Windows.Forms.TabPage();
            this.Tab_LogBrowser = new System.Windows.Forms.TabControl();
            this.Tp_RealDir = new System.Windows.Forms.TabPage();
            this.label27 = new System.Windows.Forms.Label();
            this.label26 = new System.Windows.Forms.Label();
            this.Btn_LB_DelRealDir = new System.Windows.Forms.Button();
            this.Dgv_Lb_RealDir = new System.Windows.Forms.DataGridView();
            this.nameDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.filterDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Path = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.logBrowserItemBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.Txt_LogBrowserDir = new System.Windows.Forms.TextBox();
            this.label12 = new System.Windows.Forms.Label();
            this.Btn_LogBrowserAdd = new System.Windows.Forms.Button();
            this.Txt_LogBrowserName = new System.Windows.Forms.TextBox();
            this.Btn_LogBrowserDir = new System.Windows.Forms.Button();
            this.Txt_LogBrowserFilter = new System.Windows.Forms.TextBox();
            this.label13 = new System.Windows.Forms.Label();
            this.Tp_VirtualDir = new System.Windows.Forms.TabPage();
            this.label25 = new System.Windows.Forms.Label();
            this.Btn_LB_DelVirtualFile = new System.Windows.Forms.Button();
            this.Btn_LB_Path = new System.Windows.Forms.Button();
            this.Txt_LB_FileName = new System.Windows.Forms.TextBox();
            this.Txt_LB_FilePath = new System.Windows.Forms.TextBox();
            this.label17 = new System.Windows.Forms.Label();
            this.label16 = new System.Windows.Forms.Label();
            this.Btn_LB_AddVirtualFile = new System.Windows.Forms.Button();
            this.Dgv_LB_VirtualFile = new System.Windows.Forms.DataGridView();
            this.nameDataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.pathDataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.logBrowserVirtualFileBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.Btn_LB_DeleteVirtualDir = new System.Windows.Forms.Button();
            this.Btn_LB_AddVirtualDir = new System.Windows.Forms.Button();
            this.Ddl_LB_VirtualDir = new System.Windows.Forms.ComboBox();
            this.label15 = new System.Windows.Forms.Label();
            this.Tp_Option = new System.Windows.Forms.TabPage();
            this.groupBox5 = new System.Windows.Forms.GroupBox();
            this.Txt_SharedFolder = new System.Windows.Forms.TextBox();
            this.Btn_BrowseSharedFolder = new System.Windows.Forms.Button();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.label39 = new System.Windows.Forms.Label();
            this.Txt_CmdOpenFile = new System.Windows.Forms.TextBox();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.Rb_ContextView = new System.Windows.Forms.RadioButton();
            this.label11 = new System.Windows.Forms.Label();
            this.Rb_DetailView = new System.Windows.Forms.RadioButton();
            this.Cb_SingleInstance = new System.Windows.Forms.CheckBox();
            this.label38 = new System.Windows.Forms.Label();
            this.Txt_LogBrowserNumDays = new System.Windows.Forms.MaskedTextBox();
            this.label37 = new System.Windows.Forms.Label();
            this.label36 = new System.Windows.Forms.Label();
            this.Txt_MaxSizeToPrompt = new System.Windows.Forms.MaskedTextBox();
            this.Ddl_DefaultEncoding = new System.Windows.Forms.ComboBox();
            this.label32 = new System.Windows.Forms.Label();
            this.Cb_ShowWarnBanner = new System.Windows.Forms.CheckBox();
            this.label22 = new System.Windows.Forms.Label();
            this.Txt_EofSizeToLoad = new System.Windows.Forms.MaskedTextBox();
            this.label21 = new System.Windows.Forms.Label();
            this.Cb_LoadOnlyEOF = new System.Windows.Forms.CheckBox();
            this.Btn_ClearSearchHisto = new System.Windows.Forms.Button();
            this.Txt_ContextRowNbr = new System.Windows.Forms.MaskedTextBox();
            this.label14 = new System.Windows.Forms.Label();
            this.Lbl_Font = new System.Windows.Forms.Label();
            this.Btn_SelectFont = new System.Windows.Forms.Button();
            this.Cb_SaveLogs = new System.Windows.Forms.CheckBox();
            this.Cb_WrapLine = new System.Windows.Forms.CheckBox();
            this.Tp_Alert = new System.Windows.Forms.TabPage();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.button1 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.button3 = new System.Windows.Forms.Button();
            this.button4 = new System.Windows.Forms.Button();
            this.Dgv_AlertFile = new System.Windows.Forms.DataGridView();
            this.actifDataGridViewCheckBoxColumn = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.filePathDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.alertFileBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.Btn_BrowseAlertFile = new System.Windows.Forms.Button();
            this.Txt_BrowseAlertFile = new System.Windows.Forms.TextBox();
            this.label34 = new System.Windows.Forms.Label();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.label35 = new System.Windows.Forms.Label();
            this.Txt_AlertSearchText = new System.Windows.Forms.TextBox();
            this.Btn_Alert_ActivateAll = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.Btn_Alert_DesactivateAll = new System.Windows.Forms.Button();
            this.Txt_AlertMessage = new System.Windows.Forms.TextBox();
            this.Dgv_Alert = new System.Windows.Forms.DataGridView();
            this.isActifDataGridViewCheckBoxColumn1 = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.searchTextDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.messageDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.alertInfoBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.label4 = new System.Windows.Forms.Label();
            this.Btn_AddAlert = new System.Windows.Forms.Button();
            this.Btn_RemoveAlert = new System.Windows.Forms.Button();
            this.label24 = new System.Windows.Forms.Label();
            this.Tp_Plugin = new System.Windows.Forms.TabPage();
            this.label20 = new System.Windows.Forms.Label();
            this.Dfv_Plugin = new System.Windows.Forms.DataGridView();
            this.textDataGridViewTextBoxColumn2 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.typeNameDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.pluginBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.Btn_PluginAdd = new System.Windows.Forms.Button();
            this.Txt_PluginTypeName = new System.Windows.Forms.TextBox();
            this.Txt_PluginName = new System.Windows.Forms.TextBox();
            this.label19 = new System.Windows.Forms.Label();
            this.label18 = new System.Windows.Forms.Label();
            this.ProfileHiddenLogBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.colorDialog1 = new System.Windows.Forms.ColorDialog();
            this.Btn_Ok = new System.Windows.Forms.Button();
            this.Btn_Cancel = new System.Windows.Forms.Button();
            this.Tt_Help = new System.Windows.Forms.ToolTip(this.components);
            Tabs_Config = new System.Windows.Forms.TabControl();
            Tabs_Config.SuspendLayout();
            this.Tp_Profile.SuspendLayout();
            this.Pnl_ProfileCommon.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.profileBindingSource)).BeginInit();
            this.Tab_Profile.SuspendLayout();
            this.Tp_ProfileHighlighting.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.ProfileHighlightingBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_Profile)).BeginInit();
            this.Tp_ProfileHiddenLog.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_HiddenLines)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.hiddenLineBindingSource)).BeginInit();
            this.Tp_ProfileStoredFilter.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.storedFilterBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_StoredFilters)).BeginInit();
            this.Tp_Level.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.highlightingBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_Level)).BeginInit();
            this.Tp_LogBrowser.SuspendLayout();
            this.Tab_LogBrowser.SuspendLayout();
            this.Tp_RealDir.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_Lb_RealDir)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.logBrowserItemBindingSource)).BeginInit();
            this.Tp_VirtualDir.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_LB_VirtualFile)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.logBrowserVirtualFileBindingSource)).BeginInit();
            this.Tp_Option.SuspendLayout();
            this.groupBox5.SuspendLayout();
            this.groupBox4.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.Tp_Alert.SuspendLayout();
            this.groupBox2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_AlertFile)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.alertFileBindingSource)).BeginInit();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_Alert)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.alertInfoBindingSource)).BeginInit();
            this.Tp_Plugin.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dfv_Plugin)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pluginBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.ProfileHiddenLogBindingSource)).BeginInit();
            this.SuspendLayout();
            // 
            // Tabs_Config
            // 
            Tabs_Config.Controls.Add(this.Tp_Profile);
            Tabs_Config.Controls.Add(this.Tp_Level);
            Tabs_Config.Controls.Add(this.Tp_LogBrowser);
            Tabs_Config.Controls.Add(this.Tp_Option);
            Tabs_Config.Controls.Add(this.Tp_Alert);
            Tabs_Config.Controls.Add(this.Tp_Plugin);
            Tabs_Config.Dock = System.Windows.Forms.DockStyle.Top;
            Tabs_Config.Location = new System.Drawing.Point(0, 0);
            Tabs_Config.Name = "Tabs_Config";
            Tabs_Config.SelectedIndex = 0;
            Tabs_Config.Size = new System.Drawing.Size(792, 611);
            Tabs_Config.TabIndex = 0;
            // 
            // Tp_Profile
            // 
            this.Tp_Profile.Controls.Add(this.Pnl_ProfileCommon);
            this.Tp_Profile.Controls.Add(this.Tab_Profile);
            this.Tp_Profile.Location = new System.Drawing.Point(4, 22);
            this.Tp_Profile.Name = "Tp_Profile";
            this.Tp_Profile.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_Profile.Size = new System.Drawing.Size(784, 585);
            this.Tp_Profile.TabIndex = 1;
            this.Tp_Profile.Text = "Profile";
            this.Tp_Profile.UseVisualStyleBackColor = true;
            // 
            // Pnl_ProfileCommon
            // 
            this.Pnl_ProfileCommon.Controls.Add(this.Lbl_SharedProfile);
            this.Pnl_ProfileCommon.Controls.Add(this.Ddl_ProfileEncoding);
            this.Pnl_ProfileCommon.Controls.Add(this.label33);
            this.Pnl_ProfileCommon.Controls.Add(this.Btn_LoadProfile);
            this.Pnl_ProfileCommon.Controls.Add(this.Btn_SaveProfile);
            this.Pnl_ProfileCommon.Controls.Add(this.Ddl_ProfileName);
            this.Pnl_ProfileCommon.Controls.Add(this.label7);
            this.Pnl_ProfileCommon.Controls.Add(this.Txt_FileName);
            this.Pnl_ProfileCommon.Controls.Add(this.Btn_AddProfile);
            this.Pnl_ProfileCommon.Controls.Add(this.label9);
            this.Pnl_ProfileCommon.Controls.Add(this.Btn_RemoveProfile);
            this.Pnl_ProfileCommon.Controls.Add(this.Btn_Browse);
            this.Pnl_ProfileCommon.Location = new System.Drawing.Point(3, 5);
            this.Pnl_ProfileCommon.Name = "Pnl_ProfileCommon";
            this.Pnl_ProfileCommon.Size = new System.Drawing.Size(774, 104);
            this.Pnl_ProfileCommon.TabIndex = 31;
            // 
            // Lbl_SharedProfile
            // 
            this.Lbl_SharedProfile.BackColor = System.Drawing.Color.Red;
            this.Lbl_SharedProfile.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.Lbl_SharedProfile.Location = new System.Drawing.Point(668, 78);
            this.Lbl_SharedProfile.Name = "Lbl_SharedProfile";
            this.Lbl_SharedProfile.Size = new System.Drawing.Size(100, 23);
            this.Lbl_SharedProfile.TabIndex = 39;
            this.Lbl_SharedProfile.Text = "Shared Profile";
            this.Lbl_SharedProfile.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.Lbl_SharedProfile.Visible = false;
            // 
            // Ddl_ProfileEncoding
            // 
            this.Ddl_ProfileEncoding.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.profileBindingSource, "Encoding", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Ddl_ProfileEncoding.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.Ddl_ProfileEncoding.FormattingEnabled = true;
            this.Ddl_ProfileEncoding.Items.AddRange(new object[] {
            "Default",
            "ASCII",
            "BigEndianUnicode",
            "Unicode",
            "UTF32",
            "UTF7",
            "UTF8"});
            this.Ddl_ProfileEncoding.Location = new System.Drawing.Point(68, 75);
            this.Ddl_ProfileEncoding.Name = "Ddl_ProfileEncoding";
            this.Ddl_ProfileEncoding.Size = new System.Drawing.Size(121, 21);
            this.Ddl_ProfileEncoding.TabIndex = 38;
            this.Ddl_ProfileEncoding.SelectedIndexChanged += new System.EventHandler(this.Ddl_ProfileEncoding_SelectedIndexChanged);
            // 
            // profileBindingSource
            // 
            this.profileBindingSource.DataSource = typeof(LogWatcher.Common.Profile);
            // 
            // label33
            // 
            this.label33.AutoSize = true;
            this.label33.Location = new System.Drawing.Point(7, 78);
            this.label33.Name = "label33";
            this.label33.Size = new System.Drawing.Size(58, 13);
            this.label33.TabIndex = 37;
            this.label33.Text = "Encoding :";
            // 
            // Btn_LoadProfile
            // 
            this.Btn_LoadProfile.Location = new System.Drawing.Point(481, 2);
            this.Btn_LoadProfile.Name = "Btn_LoadProfile";
            this.Btn_LoadProfile.Size = new System.Drawing.Size(78, 23);
            this.Btn_LoadProfile.TabIndex = 36;
            this.Btn_LoadProfile.Text = "Load Profile";
            this.Tt_Help.SetToolTip(this.Btn_LoadProfile, "Load a previous saved profile to your logwatcher config");
            this.Btn_LoadProfile.UseVisualStyleBackColor = true;
            this.Btn_LoadProfile.Click += new System.EventHandler(this.Btn_LoadProfile_Click);
            // 
            // Btn_SaveProfile
            // 
            this.Btn_SaveProfile.Location = new System.Drawing.Point(400, 3);
            this.Btn_SaveProfile.Name = "Btn_SaveProfile";
            this.Btn_SaveProfile.Size = new System.Drawing.Size(78, 22);
            this.Btn_SaveProfile.TabIndex = 35;
            this.Btn_SaveProfile.Text = "Save profile";
            this.Tt_Help.SetToolTip(this.Btn_SaveProfile, "Save profile in xml file to send to another logwatcher user");
            this.Btn_SaveProfile.UseVisualStyleBackColor = true;
            this.Btn_SaveProfile.Click += new System.EventHandler(this.Btn_SaveProfile_Click);
            // 
            // Ddl_ProfileName
            // 
            this.Ddl_ProfileName.DataSource = this.profileBindingSource;
            this.Ddl_ProfileName.DisplayMember = "Name";
            this.Ddl_ProfileName.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.Ddl_ProfileName.FormattingEnabled = true;
            this.Ddl_ProfileName.Location = new System.Drawing.Point(70, 3);
            this.Ddl_ProfileName.Name = "Ddl_ProfileName";
            this.Ddl_ProfileName.Size = new System.Drawing.Size(166, 21);
            this.Ddl_ProfileName.TabIndex = 23;
            this.Ddl_ProfileName.SelectedIndexChanged += new System.EventHandler(this.Ddl_ProfileName_SelectedIndexChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(-1, 6);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(71, 13);
            this.label7.TabIndex = 24;
            this.label7.Text = "Profile name :";
            // 
            // Txt_FileName
            // 
            this.Txt_FileName.Location = new System.Drawing.Point(10, 48);
            this.Txt_FileName.Name = "Txt_FileName";
            this.Txt_FileName.Size = new System.Drawing.Size(386, 20);
            this.Txt_FileName.TabIndex = 27;
            this.Tt_Help.SetToolTip(this.Txt_FileName, "With this option, selected profile will be automatically apply to file if critere" +
        " match. \r\nYou can set a critere by filename (without path) or by path (without f" +
        "ilename)");
            this.Txt_FileName.Leave += new System.EventHandler(this.Txt_FileName_Leave);
            // 
            // Btn_AddProfile
            // 
            this.Btn_AddProfile.Location = new System.Drawing.Point(238, 2);
            this.Btn_AddProfile.Name = "Btn_AddProfile";
            this.Btn_AddProfile.Size = new System.Drawing.Size(78, 23);
            this.Btn_AddProfile.TabIndex = 25;
            this.Btn_AddProfile.Text = "Add profile";
            this.Btn_AddProfile.UseVisualStyleBackColor = true;
            this.Btn_AddProfile.Click += new System.EventHandler(this.Btn_AddProfile_Click);
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(7, 32);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(694, 13);
            this.label9.TabIndex = 28;
            this.label9.Text = "Automatically load profile if path or file name match with criterious below (simp" +
    "le string or regex) .You can set several criterious by using \';\' character";
            // 
            // Btn_RemoveProfile
            // 
            this.Btn_RemoveProfile.Location = new System.Drawing.Point(319, 2);
            this.Btn_RemoveProfile.Name = "Btn_RemoveProfile";
            this.Btn_RemoveProfile.Size = new System.Drawing.Size(78, 23);
            this.Btn_RemoveProfile.TabIndex = 26;
            this.Btn_RemoveProfile.Text = "Delete profile";
            this.Btn_RemoveProfile.UseVisualStyleBackColor = true;
            this.Btn_RemoveProfile.Click += new System.EventHandler(this.Btn_RemoveProfile_Click);
            // 
            // Btn_Browse
            // 
            this.Btn_Browse.Location = new System.Drawing.Point(397, 48);
            this.Btn_Browse.Name = "Btn_Browse";
            this.Btn_Browse.Size = new System.Drawing.Size(24, 20);
            this.Btn_Browse.TabIndex = 29;
            this.Btn_Browse.Text = "...";
            this.Btn_Browse.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            this.Btn_Browse.UseVisualStyleBackColor = true;
            this.Btn_Browse.Click += new System.EventHandler(this.Btn_Browse_Click);
            // 
            // Tab_Profile
            // 
            this.Tab_Profile.Controls.Add(this.Tp_ProfileHighlighting);
            this.Tab_Profile.Controls.Add(this.Tp_ProfileHiddenLog);
            this.Tab_Profile.Controls.Add(this.Tp_ProfileStoredFilter);
            this.Tab_Profile.Location = new System.Drawing.Point(3, 111);
            this.Tab_Profile.Name = "Tab_Profile";
            this.Tab_Profile.SelectedIndex = 0;
            this.Tab_Profile.Size = new System.Drawing.Size(778, 468);
            this.Tab_Profile.TabIndex = 30;
            // 
            // Tp_ProfileHighlighting
            // 
            this.Tp_ProfileHighlighting.Controls.Add(this.Cb_PHL_Regex);
            this.Tp_ProfileHighlighting.Controls.Add(this.Cb_PHL_Bold);
            this.Tp_ProfileHighlighting.Controls.Add(this.Dgv_Profile);
            this.Tp_ProfileHighlighting.Controls.Add(this.Btn_ProfileForeColor);
            this.Tp_ProfileHighlighting.Controls.Add(this.Btn_ProfileBackColor);
            this.Tp_ProfileHighlighting.Controls.Add(this.label8);
            this.Tp_ProfileHighlighting.Controls.Add(this.Lbl_ProfileApercu);
            this.Tp_ProfileHighlighting.Controls.Add(this.label6);
            this.Tp_ProfileHighlighting.Controls.Add(this.Btn_ProfileAddHighlight);
            this.Tp_ProfileHighlighting.Controls.Add(this.label5);
            this.Tp_ProfileHighlighting.Controls.Add(this.Cb_ProfileCase);
            this.Tp_ProfileHighlighting.Controls.Add(this.Btn_ProfileDown);
            this.Tp_ProfileHighlighting.Controls.Add(this.Txt_ProfileText);
            this.Tp_ProfileHighlighting.Controls.Add(this.Btn_ProfileDeleteHighlight);
            this.Tp_ProfileHighlighting.Controls.Add(this.Btn_ProfileUp);
            this.Tp_ProfileHighlighting.Location = new System.Drawing.Point(4, 22);
            this.Tp_ProfileHighlighting.Name = "Tp_ProfileHighlighting";
            this.Tp_ProfileHighlighting.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_ProfileHighlighting.Size = new System.Drawing.Size(770, 442);
            this.Tp_ProfileHighlighting.TabIndex = 0;
            this.Tp_ProfileHighlighting.Text = "Highlighting";
            this.Tp_ProfileHighlighting.UseVisualStyleBackColor = true;
            // 
            // Cb_PHL_Regex
            // 
            this.Cb_PHL_Regex.AutoSize = true;
            this.Cb_PHL_Regex.DataBindings.Add(new System.Windows.Forms.Binding("Checked", this.ProfileHighlightingBindingSource, "IsRegEx", true));
            this.Cb_PHL_Regex.Location = new System.Drawing.Point(176, 76);
            this.Cb_PHL_Regex.Name = "Cb_PHL_Regex";
            this.Cb_PHL_Regex.Size = new System.Drawing.Size(117, 17);
            this.Cb_PHL_Regex.TabIndex = 24;
            this.Cb_PHL_Regex.Text = "Regular Expression";
            this.Cb_PHL_Regex.UseVisualStyleBackColor = true;
            // 
            // ProfileHighlightingBindingSource
            // 
            this.ProfileHighlightingBindingSource.DataSource = typeof(LogWatcher.Common.Highlighting);
            // 
            // Cb_PHL_Bold
            // 
            this.Cb_PHL_Bold.AutoSize = true;
            this.Cb_PHL_Bold.DataBindings.Add(new System.Windows.Forms.Binding("Checked", this.ProfileHighlightingBindingSource, "Bold", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Cb_PHL_Bold.Location = new System.Drawing.Point(122, 77);
            this.Cb_PHL_Bold.Name = "Cb_PHL_Bold";
            this.Cb_PHL_Bold.Size = new System.Drawing.Size(47, 17);
            this.Cb_PHL_Bold.TabIndex = 23;
            this.Cb_PHL_Bold.Text = "Bold";
            this.Cb_PHL_Bold.UseVisualStyleBackColor = true;
            this.Cb_PHL_Bold.CheckedChanged += new System.EventHandler(this.Cb_PHL_Bold_CheckedChanged);
            // 
            // Dgv_Profile
            // 
            this.Dgv_Profile.AllowUserToAddRows = false;
            this.Dgv_Profile.AllowUserToDeleteRows = false;
            this.Dgv_Profile.AllowUserToResizeColumns = false;
            this.Dgv_Profile.AllowUserToResizeRows = false;
            this.Dgv_Profile.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Dgv_Profile.AutoGenerateColumns = false;
            this.Dgv_Profile.BackgroundColor = System.Drawing.Color.White;
            this.Dgv_Profile.ColumnHeadersVisible = false;
            this.Dgv_Profile.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.dataGridViewTextBoxColumn1,
            this.profileDgvOrderColumn,
            this.textDataGridViewTextBoxColumn1,
            this.foreColorDataGridViewTextBoxColumn1,
            this.backColorDataGridViewTextBoxColumn1,
            this.caseSensitiveDataGridViewCheckBoxColumn1,
            this.hightPriorityDataGridViewCheckBoxColumn});
            this.Dgv_Profile.DataSource = this.ProfileHighlightingBindingSource;
            this.Dgv_Profile.Location = new System.Drawing.Point(6, 128);
            this.Dgv_Profile.MultiSelect = false;
            this.Dgv_Profile.Name = "Dgv_Profile";
            this.Dgv_Profile.ReadOnly = true;
            this.Dgv_Profile.RowHeadersVisible = false;
            this.Dgv_Profile.RowHeadersWidthSizeMode = System.Windows.Forms.DataGridViewRowHeadersWidthSizeMode.DisableResizing;
            this.Dgv_Profile.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.Dgv_Profile.Size = new System.Drawing.Size(761, 308);
            this.Dgv_Profile.TabIndex = 10;
            this.Dgv_Profile.RowPrePaint += new System.Windows.Forms.DataGridViewRowPrePaintEventHandler(this.Dgv_Profile_RowPrePaint);
            // 
            // dataGridViewTextBoxColumn1
            // 
            this.dataGridViewTextBoxColumn1.HeaderText = "Selection";
            this.dataGridViewTextBoxColumn1.Name = "dataGridViewTextBoxColumn1";
            this.dataGridViewTextBoxColumn1.ReadOnly = true;
            this.dataGridViewTextBoxColumn1.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.dataGridViewTextBoxColumn1.Width = 10;
            // 
            // profileDgvOrderColumn
            // 
            this.profileDgvOrderColumn.DataPropertyName = "Order";
            this.profileDgvOrderColumn.HeaderText = "Order";
            this.profileDgvOrderColumn.Name = "profileDgvOrderColumn";
            this.profileDgvOrderColumn.ReadOnly = true;
            this.profileDgvOrderColumn.Visible = false;
            // 
            // textDataGridViewTextBoxColumn1
            // 
            this.textDataGridViewTextBoxColumn1.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.textDataGridViewTextBoxColumn1.DataPropertyName = "Text";
            this.textDataGridViewTextBoxColumn1.HeaderText = "Text";
            this.textDataGridViewTextBoxColumn1.Name = "textDataGridViewTextBoxColumn1";
            this.textDataGridViewTextBoxColumn1.ReadOnly = true;
            this.textDataGridViewTextBoxColumn1.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // foreColorDataGridViewTextBoxColumn1
            // 
            this.foreColorDataGridViewTextBoxColumn1.DataPropertyName = "ForeColor";
            this.foreColorDataGridViewTextBoxColumn1.HeaderText = "ForeColor";
            this.foreColorDataGridViewTextBoxColumn1.Name = "foreColorDataGridViewTextBoxColumn1";
            this.foreColorDataGridViewTextBoxColumn1.ReadOnly = true;
            this.foreColorDataGridViewTextBoxColumn1.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.foreColorDataGridViewTextBoxColumn1.Visible = false;
            // 
            // backColorDataGridViewTextBoxColumn1
            // 
            this.backColorDataGridViewTextBoxColumn1.DataPropertyName = "BackColor";
            this.backColorDataGridViewTextBoxColumn1.HeaderText = "BackColor";
            this.backColorDataGridViewTextBoxColumn1.Name = "backColorDataGridViewTextBoxColumn1";
            this.backColorDataGridViewTextBoxColumn1.ReadOnly = true;
            this.backColorDataGridViewTextBoxColumn1.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.backColorDataGridViewTextBoxColumn1.Visible = false;
            // 
            // caseSensitiveDataGridViewCheckBoxColumn1
            // 
            this.caseSensitiveDataGridViewCheckBoxColumn1.DataPropertyName = "CaseSensitive";
            this.caseSensitiveDataGridViewCheckBoxColumn1.HeaderText = "CaseSensitive";
            this.caseSensitiveDataGridViewCheckBoxColumn1.Name = "caseSensitiveDataGridViewCheckBoxColumn1";
            this.caseSensitiveDataGridViewCheckBoxColumn1.ReadOnly = true;
            this.caseSensitiveDataGridViewCheckBoxColumn1.Visible = false;
            // 
            // hightPriorityDataGridViewCheckBoxColumn
            // 
            this.hightPriorityDataGridViewCheckBoxColumn.DataPropertyName = "HightPriority";
            this.hightPriorityDataGridViewCheckBoxColumn.HeaderText = "HightPriority";
            this.hightPriorityDataGridViewCheckBoxColumn.Name = "hightPriorityDataGridViewCheckBoxColumn";
            this.hightPriorityDataGridViewCheckBoxColumn.ReadOnly = true;
            this.hightPriorityDataGridViewCheckBoxColumn.Visible = false;
            // 
            // Btn_ProfileForeColor
            // 
            this.Btn_ProfileForeColor.Location = new System.Drawing.Point(101, 25);
            this.Btn_ProfileForeColor.Name = "Btn_ProfileForeColor";
            this.Btn_ProfileForeColor.Size = new System.Drawing.Size(43, 23);
            this.Btn_ProfileForeColor.TabIndex = 17;
            this.Btn_ProfileForeColor.Text = "color";
            this.Btn_ProfileForeColor.UseVisualStyleBackColor = true;
            this.Btn_ProfileForeColor.Click += new System.EventHandler(this.Btn_ProfileForeColor_Click);
            // 
            // Btn_ProfileBackColor
            // 
            this.Btn_ProfileBackColor.Location = new System.Drawing.Point(101, 48);
            this.Btn_ProfileBackColor.Name = "Btn_ProfileBackColor";
            this.Btn_ProfileBackColor.Size = new System.Drawing.Size(43, 23);
            this.Btn_ProfileBackColor.TabIndex = 18;
            this.Btn_ProfileBackColor.Text = "color";
            this.Btn_ProfileBackColor.UseVisualStyleBackColor = true;
            this.Btn_ProfileBackColor.Click += new System.EventHandler(this.Btn_ProfileBackColor_Click);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(3, 53);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(98, 13);
            this.label8.TabIndex = 16;
            this.label8.Text = "Background Color :";
            // 
            // Lbl_ProfileApercu
            // 
            this.Lbl_ProfileApercu.BackColor = System.Drawing.Color.White;
            this.Lbl_ProfileApercu.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.Lbl_ProfileApercu.DataBindings.Add(new System.Windows.Forms.Binding("BackColor", this.ProfileHighlightingBindingSource, "BackColor", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Lbl_ProfileApercu.DataBindings.Add(new System.Windows.Forms.Binding("ForeColor", this.ProfileHighlightingBindingSource, "ForeColor", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Lbl_ProfileApercu.Location = new System.Drawing.Point(150, 27);
            this.Lbl_ProfileApercu.Name = "Lbl_ProfileApercu";
            this.Lbl_ProfileApercu.Size = new System.Drawing.Size(117, 39);
            this.Lbl_ProfileApercu.TabIndex = 19;
            this.Lbl_ProfileApercu.Text = "Apercu";
            this.Lbl_ProfileApercu.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(40, 30);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(61, 13);
            this.label6.TabIndex = 14;
            this.label6.Text = "Fore Color :";
            // 
            // Btn_ProfileAddHighlight
            // 
            this.Btn_ProfileAddHighlight.Location = new System.Drawing.Point(6, 99);
            this.Btn_ProfileAddHighlight.Name = "Btn_ProfileAddHighlight";
            this.Btn_ProfileAddHighlight.Size = new System.Drawing.Size(52, 23);
            this.Btn_ProfileAddHighlight.TabIndex = 20;
            this.Btn_ProfileAddHighlight.Text = "Add";
            this.Btn_ProfileAddHighlight.UseVisualStyleBackColor = true;
            this.Btn_ProfileAddHighlight.Click += new System.EventHandler(this.Btn_ProfileAddHighlight_Click);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(67, 6);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(34, 13);
            this.label5.TabIndex = 11;
            this.label5.Text = "Text :";
            // 
            // Cb_ProfileCase
            // 
            this.Cb_ProfileCase.AutoSize = true;
            this.Cb_ProfileCase.Checked = true;
            this.Cb_ProfileCase.CheckState = System.Windows.Forms.CheckState.Checked;
            this.Cb_ProfileCase.DataBindings.Add(new System.Windows.Forms.Binding("Checked", this.ProfileHighlightingBindingSource, "CaseSensitive", true));
            this.Cb_ProfileCase.Location = new System.Drawing.Point(15, 76);
            this.Cb_ProfileCase.Name = "Cb_ProfileCase";
            this.Cb_ProfileCase.Size = new System.Drawing.Size(96, 17);
            this.Cb_ProfileCase.TabIndex = 22;
            this.Cb_ProfileCase.Text = "Case Sensitive";
            this.Cb_ProfileCase.UseVisualStyleBackColor = true;
            // 
            // Btn_ProfileDown
            // 
            this.Btn_ProfileDown.Location = new System.Drawing.Point(165, 99);
            this.Btn_ProfileDown.Name = "Btn_ProfileDown";
            this.Btn_ProfileDown.Size = new System.Drawing.Size(56, 23);
            this.Btn_ProfileDown.TabIndex = 15;
            this.Btn_ProfileDown.Text = "Down";
            this.Btn_ProfileDown.UseVisualStyleBackColor = true;
            this.Btn_ProfileDown.Click += new System.EventHandler(this.Btn_ProfileDown_Click);
            // 
            // Txt_ProfileText
            // 
            this.Txt_ProfileText.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.ProfileHighlightingBindingSource, "Text", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Txt_ProfileText.Location = new System.Drawing.Point(101, 3);
            this.Txt_ProfileText.Name = "Txt_ProfileText";
            this.Txt_ProfileText.Size = new System.Drawing.Size(663, 20);
            this.Txt_ProfileText.TabIndex = 12;
            // 
            // Btn_ProfileDeleteHighlight
            // 
            this.Btn_ProfileDeleteHighlight.Location = new System.Drawing.Point(64, 99);
            this.Btn_ProfileDeleteHighlight.Name = "Btn_ProfileDeleteHighlight";
            this.Btn_ProfileDeleteHighlight.Size = new System.Drawing.Size(52, 23);
            this.Btn_ProfileDeleteHighlight.TabIndex = 21;
            this.Btn_ProfileDeleteHighlight.Text = "Delete";
            this.Btn_ProfileDeleteHighlight.UseVisualStyleBackColor = true;
            this.Btn_ProfileDeleteHighlight.Click += new System.EventHandler(this.Btn_ProfileDeleteHighlight_Click);
            // 
            // Btn_ProfileUp
            // 
            this.Btn_ProfileUp.Location = new System.Drawing.Point(227, 99);
            this.Btn_ProfileUp.Name = "Btn_ProfileUp";
            this.Btn_ProfileUp.Size = new System.Drawing.Size(55, 23);
            this.Btn_ProfileUp.TabIndex = 13;
            this.Btn_ProfileUp.Text = "Up";
            this.Btn_ProfileUp.UseVisualStyleBackColor = true;
            this.Btn_ProfileUp.Click += new System.EventHandler(this.Btn_ProfileUp_Click);
            // 
            // Tp_ProfileHiddenLog
            // 
            this.Tp_ProfileHiddenLog.Controls.Add(this.Bnt_Phid_ActivateAll);
            this.Tp_ProfileHiddenLog.Controls.Add(this.Bnt_Phid_DesactivateAll);
            this.Tp_ProfileHiddenLog.Controls.Add(this.Cb_PHid_Actif);
            this.Tp_ProfileHiddenLog.Controls.Add(this.Cb_PHid_Regex);
            this.Tp_ProfileHiddenLog.Controls.Add(this.Cb_PHid_CaseSensitive);
            this.Tp_ProfileHiddenLog.Controls.Add(this.Dgv_HiddenLines);
            this.Tp_ProfileHiddenLog.Controls.Add(this.label28);
            this.Tp_ProfileHiddenLog.Controls.Add(this.Btn_AddHiddenLog);
            this.Tp_ProfileHiddenLog.Controls.Add(this.Btn_DelHiddenLog);
            this.Tp_ProfileHiddenLog.Controls.Add(this.label10);
            this.Tp_ProfileHiddenLog.Controls.Add(this.Txt_ProfileHiddenLog);
            this.Tp_ProfileHiddenLog.Location = new System.Drawing.Point(4, 22);
            this.Tp_ProfileHiddenLog.Name = "Tp_ProfileHiddenLog";
            this.Tp_ProfileHiddenLog.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_ProfileHiddenLog.Size = new System.Drawing.Size(770, 442);
            this.Tp_ProfileHiddenLog.TabIndex = 1;
            this.Tp_ProfileHiddenLog.Text = "Hidden Log";
            this.Tp_ProfileHiddenLog.UseVisualStyleBackColor = true;
            // 
            // Bnt_Phid_ActivateAll
            // 
            this.Bnt_Phid_ActivateAll.Location = new System.Drawing.Point(287, 79);
            this.Bnt_Phid_ActivateAll.Name = "Bnt_Phid_ActivateAll";
            this.Bnt_Phid_ActivateAll.Size = new System.Drawing.Size(157, 23);
            this.Bnt_Phid_ActivateAll.TabIndex = 35;
            this.Bnt_Phid_ActivateAll.Text = "Activate all hidden lines";
            this.Bnt_Phid_ActivateAll.UseVisualStyleBackColor = true;
            this.Bnt_Phid_ActivateAll.Click += new System.EventHandler(this.Bnt_Phid_ActivateAll_Click);
            // 
            // Bnt_Phid_DesactivateAll
            // 
            this.Bnt_Phid_DesactivateAll.Location = new System.Drawing.Point(124, 79);
            this.Bnt_Phid_DesactivateAll.Name = "Bnt_Phid_DesactivateAll";
            this.Bnt_Phid_DesactivateAll.Size = new System.Drawing.Size(157, 23);
            this.Bnt_Phid_DesactivateAll.TabIndex = 34;
            this.Bnt_Phid_DesactivateAll.Text = "Desactivate all hidden lines";
            this.Bnt_Phid_DesactivateAll.UseVisualStyleBackColor = true;
            this.Bnt_Phid_DesactivateAll.Click += new System.EventHandler(this.Bnt_Alert_DesactivateAll_Click);
            // 
            // Cb_PHid_Actif
            // 
            this.Cb_PHid_Actif.AutoSize = true;
            this.Cb_PHid_Actif.Checked = true;
            this.Cb_PHid_Actif.CheckState = System.Windows.Forms.CheckState.Checked;
            this.Cb_PHid_Actif.Location = new System.Drawing.Point(9, 53);
            this.Cb_PHid_Actif.Name = "Cb_PHid_Actif";
            this.Cb_PHid_Actif.Size = new System.Drawing.Size(47, 17);
            this.Cb_PHid_Actif.TabIndex = 32;
            this.Cb_PHid_Actif.Text = "Actif";
            this.Cb_PHid_Actif.UseVisualStyleBackColor = true;
            // 
            // Cb_PHid_Regex
            // 
            this.Cb_PHid_Regex.AutoSize = true;
            this.Cb_PHid_Regex.Location = new System.Drawing.Point(164, 53);
            this.Cb_PHid_Regex.Name = "Cb_PHid_Regex";
            this.Cb_PHid_Regex.Size = new System.Drawing.Size(117, 17);
            this.Cb_PHid_Regex.TabIndex = 31;
            this.Cb_PHid_Regex.Text = "Regular Expression";
            this.Cb_PHid_Regex.UseVisualStyleBackColor = true;
            // 
            // Cb_PHid_CaseSensitive
            // 
            this.Cb_PHid_CaseSensitive.AutoSize = true;
            this.Cb_PHid_CaseSensitive.Location = new System.Drawing.Point(62, 53);
            this.Cb_PHid_CaseSensitive.Name = "Cb_PHid_CaseSensitive";
            this.Cb_PHid_CaseSensitive.Size = new System.Drawing.Size(96, 17);
            this.Cb_PHid_CaseSensitive.TabIndex = 30;
            this.Cb_PHid_CaseSensitive.Text = "Case Sensitive";
            this.Cb_PHid_CaseSensitive.UseVisualStyleBackColor = false;
            // 
            // Dgv_HiddenLines
            // 
            this.Dgv_HiddenLines.AllowUserToAddRows = false;
            this.Dgv_HiddenLines.AllowUserToDeleteRows = false;
            this.Dgv_HiddenLines.AllowUserToResizeColumns = false;
            this.Dgv_HiddenLines.AllowUserToResizeRows = false;
            this.Dgv_HiddenLines.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Dgv_HiddenLines.AutoGenerateColumns = false;
            this.Dgv_HiddenLines.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.Dgv_HiddenLines.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.AllCells;
            this.Dgv_HiddenLines.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.Dgv_HiddenLines.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.isActifDataGridViewCheckBoxColumn,
            this.textDataGridViewTextBoxColumn3,
            this.CaseSensitive,
            this.isRegexDataGridViewCheckBoxColumn});
            this.Dgv_HiddenLines.DataSource = this.hiddenLineBindingSource;
            this.Dgv_HiddenLines.EditMode = System.Windows.Forms.DataGridViewEditMode.EditOnEnter;
            this.Dgv_HiddenLines.Location = new System.Drawing.Point(9, 108);
            this.Dgv_HiddenLines.MultiSelect = false;
            this.Dgv_HiddenLines.Name = "Dgv_HiddenLines";
            this.Dgv_HiddenLines.RowHeadersVisible = false;
            this.Dgv_HiddenLines.RowHeadersWidthSizeMode = System.Windows.Forms.DataGridViewRowHeadersWidthSizeMode.DisableResizing;
            this.Dgv_HiddenLines.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.CellSelect;
            this.Dgv_HiddenLines.Size = new System.Drawing.Size(755, 328);
            this.Dgv_HiddenLines.TabIndex = 29;
            // 
            // isActifDataGridViewCheckBoxColumn
            // 
            this.isActifDataGridViewCheckBoxColumn.DataPropertyName = "IsActif";
            this.isActifDataGridViewCheckBoxColumn.FillWeight = 10.90433F;
            this.isActifDataGridViewCheckBoxColumn.HeaderText = "Actif";
            this.isActifDataGridViewCheckBoxColumn.IndeterminateValue = "true";
            this.isActifDataGridViewCheckBoxColumn.Name = "isActifDataGridViewCheckBoxColumn";
            this.isActifDataGridViewCheckBoxColumn.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            // 
            // textDataGridViewTextBoxColumn3
            // 
            this.textDataGridViewTextBoxColumn3.DataPropertyName = "Text";
            this.textDataGridViewTextBoxColumn3.FillWeight = 155.0431F;
            this.textDataGridViewTextBoxColumn3.HeaderText = "Text";
            this.textDataGridViewTextBoxColumn3.Name = "textDataGridViewTextBoxColumn3";
            this.textDataGridViewTextBoxColumn3.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            // 
            // CaseSensitive
            // 
            this.CaseSensitive.DataPropertyName = "CaseSensitive";
            this.CaseSensitive.FillWeight = 29.0308F;
            this.CaseSensitive.HeaderText = "Case Sensitive";
            this.CaseSensitive.Name = "CaseSensitive";
            this.CaseSensitive.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            // 
            // isRegexDataGridViewCheckBoxColumn
            // 
            this.isRegexDataGridViewCheckBoxColumn.DataPropertyName = "IsRegex";
            this.isRegexDataGridViewCheckBoxColumn.FillWeight = 33.78449F;
            this.isRegexDataGridViewCheckBoxColumn.HeaderText = "Regular Expression";
            this.isRegexDataGridViewCheckBoxColumn.Name = "isRegexDataGridViewCheckBoxColumn";
            this.isRegexDataGridViewCheckBoxColumn.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            // 
            // hiddenLineBindingSource
            // 
            this.hiddenLineBindingSource.DataSource = typeof(LogWatcher.Common.HiddenLine);
            // 
            // label28
            // 
            this.label28.Location = new System.Drawing.Point(10, 7);
            this.label28.Name = "label28";
            this.label28.Size = new System.Drawing.Size(754, 18);
            this.label28.TabIndex = 25;
            this.label28.Text = "All line that will match with specify keyword will be not loaded in logwatcher.";
            // 
            // Btn_AddHiddenLog
            // 
            this.Btn_AddHiddenLog.Location = new System.Drawing.Point(8, 79);
            this.Btn_AddHiddenLog.Name = "Btn_AddHiddenLog";
            this.Btn_AddHiddenLog.Size = new System.Drawing.Size(52, 23);
            this.Btn_AddHiddenLog.TabIndex = 22;
            this.Btn_AddHiddenLog.Text = "Add";
            this.Btn_AddHiddenLog.UseVisualStyleBackColor = true;
            this.Btn_AddHiddenLog.Click += new System.EventHandler(this.Btn_AddHiddenLog_Click);
            // 
            // Btn_DelHiddenLog
            // 
            this.Btn_DelHiddenLog.Location = new System.Drawing.Point(66, 79);
            this.Btn_DelHiddenLog.Name = "Btn_DelHiddenLog";
            this.Btn_DelHiddenLog.Size = new System.Drawing.Size(52, 23);
            this.Btn_DelHiddenLog.TabIndex = 23;
            this.Btn_DelHiddenLog.Text = "Delete";
            this.Btn_DelHiddenLog.UseVisualStyleBackColor = true;
            this.Btn_DelHiddenLog.Click += new System.EventHandler(this.Btn_DelHiddenLog_Click);
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(6, 31);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(34, 13);
            this.label10.TabIndex = 13;
            this.label10.Text = "Text :";
            // 
            // Txt_ProfileHiddenLog
            // 
            this.Txt_ProfileHiddenLog.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_ProfileHiddenLog.Location = new System.Drawing.Point(41, 28);
            this.Txt_ProfileHiddenLog.Name = "Txt_ProfileHiddenLog";
            this.Txt_ProfileHiddenLog.Size = new System.Drawing.Size(723, 20);
            this.Txt_ProfileHiddenLog.TabIndex = 14;
            // 
            // Tp_ProfileStoredFilter
            // 
            this.Tp_ProfileStoredFilter.Controls.Add(this.Cb_Psf_Regex);
            this.Tp_ProfileStoredFilter.Controls.Add(this.Cb_Psf_CaseSensitive);
            this.Tp_ProfileStoredFilter.Controls.Add(this.Dgv_StoredFilters);
            this.Tp_ProfileStoredFilter.Controls.Add(this.Txt_ProfileFilterName);
            this.Tp_ProfileStoredFilter.Controls.Add(this.Txt_ProfileFilter);
            this.Tp_ProfileStoredFilter.Controls.Add(this.Btn_ProfileAddStoredFilter);
            this.Tp_ProfileStoredFilter.Controls.Add(this.Btn_ProfileDeleteStoredFilter);
            this.Tp_ProfileStoredFilter.Controls.Add(this.label31);
            this.Tp_ProfileStoredFilter.Controls.Add(this.label30);
            this.Tp_ProfileStoredFilter.Controls.Add(this.label29);
            this.Tp_ProfileStoredFilter.Location = new System.Drawing.Point(4, 22);
            this.Tp_ProfileStoredFilter.Name = "Tp_ProfileStoredFilter";
            this.Tp_ProfileStoredFilter.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_ProfileStoredFilter.Size = new System.Drawing.Size(770, 442);
            this.Tp_ProfileStoredFilter.TabIndex = 2;
            this.Tp_ProfileStoredFilter.Text = "Stored Filters";
            this.Tp_ProfileStoredFilter.UseVisualStyleBackColor = true;
            // 
            // Cb_Psf_Regex
            // 
            this.Cb_Psf_Regex.AutoSize = true;
            this.Cb_Psf_Regex.DataBindings.Add(new System.Windows.Forms.Binding("Checked", this.storedFilterBindingSource, "IsRegex", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Cb_Psf_Regex.Location = new System.Drawing.Point(113, 79);
            this.Cb_Psf_Regex.Name = "Cb_Psf_Regex";
            this.Cb_Psf_Regex.Size = new System.Drawing.Size(117, 17);
            this.Cb_Psf_Regex.TabIndex = 33;
            this.Cb_Psf_Regex.Text = "Regular Expression";
            this.Cb_Psf_Regex.UseVisualStyleBackColor = true;
            this.Cb_Psf_Regex.Visible = false;
            // 
            // storedFilterBindingSource
            // 
            this.storedFilterBindingSource.DataSource = typeof(LogWatcher.Common.StoredFilter);
            // 
            // Cb_Psf_CaseSensitive
            // 
            this.Cb_Psf_CaseSensitive.AutoSize = true;
            this.Cb_Psf_CaseSensitive.DataBindings.Add(new System.Windows.Forms.Binding("Checked", this.storedFilterBindingSource, "CaseSensitive", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Cb_Psf_CaseSensitive.Location = new System.Drawing.Point(11, 79);
            this.Cb_Psf_CaseSensitive.Name = "Cb_Psf_CaseSensitive";
            this.Cb_Psf_CaseSensitive.Size = new System.Drawing.Size(96, 17);
            this.Cb_Psf_CaseSensitive.TabIndex = 32;
            this.Cb_Psf_CaseSensitive.Text = "Case Sensitive";
            this.Cb_Psf_CaseSensitive.UseVisualStyleBackColor = false;
            this.Cb_Psf_CaseSensitive.Visible = false;
            // 
            // Dgv_StoredFilters
            // 
            this.Dgv_StoredFilters.AllowUserToAddRows = false;
            this.Dgv_StoredFilters.AllowUserToDeleteRows = false;
            this.Dgv_StoredFilters.AllowUserToResizeRows = false;
            this.Dgv_StoredFilters.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Dgv_StoredFilters.AutoGenerateColumns = false;
            this.Dgv_StoredFilters.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.Dgv_StoredFilters.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.Dgv_StoredFilters.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.nameDataGridViewTextBoxColumn2,
            this.filterDataGridViewTextBoxColumn1,
            this.IsRegex,
            this.dataGridViewCheckBoxColumn1});
            this.Dgv_StoredFilters.DataSource = this.storedFilterBindingSource;
            this.Dgv_StoredFilters.EditMode = System.Windows.Forms.DataGridViewEditMode.EditOnEnter;
            this.Dgv_StoredFilters.Location = new System.Drawing.Point(11, 131);
            this.Dgv_StoredFilters.Name = "Dgv_StoredFilters";
            this.Dgv_StoredFilters.RowHeadersVisible = false;
            this.Dgv_StoredFilters.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.CellSelect;
            this.Dgv_StoredFilters.Size = new System.Drawing.Size(753, 304);
            this.Dgv_StoredFilters.TabIndex = 28;
            // 
            // nameDataGridViewTextBoxColumn2
            // 
            this.nameDataGridViewTextBoxColumn2.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.nameDataGridViewTextBoxColumn2.DataPropertyName = "Name";
            this.nameDataGridViewTextBoxColumn2.FillWeight = 53.57771F;
            this.nameDataGridViewTextBoxColumn2.HeaderText = "Name";
            this.nameDataGridViewTextBoxColumn2.Name = "nameDataGridViewTextBoxColumn2";
            // 
            // filterDataGridViewTextBoxColumn1
            // 
            this.filterDataGridViewTextBoxColumn1.DataPropertyName = "Filter";
            this.filterDataGridViewTextBoxColumn1.FillWeight = 214.3109F;
            this.filterDataGridViewTextBoxColumn1.HeaderText = "Filter";
            this.filterDataGridViewTextBoxColumn1.Name = "filterDataGridViewTextBoxColumn1";
            // 
            // IsRegex
            // 
            this.IsRegex.DataPropertyName = "IsRegex";
            this.IsRegex.FillWeight = 24.11651F;
            this.IsRegex.HeaderText = "IsRegex";
            this.IsRegex.Name = "IsRegex";
            this.IsRegex.Visible = false;
            // 
            // dataGridViewCheckBoxColumn1
            // 
            this.dataGridViewCheckBoxColumn1.DataPropertyName = "CaseSensitive";
            this.dataGridViewCheckBoxColumn1.FillWeight = 32.99492F;
            this.dataGridViewCheckBoxColumn1.HeaderText = "CaseSensitive";
            this.dataGridViewCheckBoxColumn1.Name = "dataGridViewCheckBoxColumn1";
            this.dataGridViewCheckBoxColumn1.Visible = false;
            // 
            // Txt_ProfileFilterName
            // 
            this.Txt_ProfileFilterName.Location = new System.Drawing.Point(77, 30);
            this.Txt_ProfileFilterName.Name = "Txt_ProfileFilterName";
            this.Txt_ProfileFilterName.Size = new System.Drawing.Size(686, 20);
            this.Txt_ProfileFilterName.TabIndex = 27;
            // 
            // Txt_ProfileFilter
            // 
            this.Txt_ProfileFilter.Location = new System.Drawing.Point(77, 53);
            this.Txt_ProfileFilter.Name = "Txt_ProfileFilter";
            this.Txt_ProfileFilter.Size = new System.Drawing.Size(686, 20);
            this.Txt_ProfileFilter.TabIndex = 26;
            // 
            // Btn_ProfileAddStoredFilter
            // 
            this.Btn_ProfileAddStoredFilter.Location = new System.Drawing.Point(8, 102);
            this.Btn_ProfileAddStoredFilter.Name = "Btn_ProfileAddStoredFilter";
            this.Btn_ProfileAddStoredFilter.Size = new System.Drawing.Size(52, 23);
            this.Btn_ProfileAddStoredFilter.TabIndex = 24;
            this.Btn_ProfileAddStoredFilter.Text = "Add";
            this.Btn_ProfileAddStoredFilter.UseVisualStyleBackColor = true;
            this.Btn_ProfileAddStoredFilter.Click += new System.EventHandler(this.Btn_ProfileAddStockedFilter_Click);
            // 
            // Btn_ProfileDeleteStoredFilter
            // 
            this.Btn_ProfileDeleteStoredFilter.Location = new System.Drawing.Point(66, 102);
            this.Btn_ProfileDeleteStoredFilter.Name = "Btn_ProfileDeleteStoredFilter";
            this.Btn_ProfileDeleteStoredFilter.Size = new System.Drawing.Size(52, 23);
            this.Btn_ProfileDeleteStoredFilter.TabIndex = 25;
            this.Btn_ProfileDeleteStoredFilter.Text = "Delete";
            this.Btn_ProfileDeleteStoredFilter.UseVisualStyleBackColor = true;
            this.Btn_ProfileDeleteStoredFilter.Click += new System.EventHandler(this.Btn_ProfileDeleteStockedFilter_Click);
            // 
            // label31
            // 
            this.label31.AutoSize = true;
            this.label31.Location = new System.Drawing.Point(36, 56);
            this.label31.Name = "label31";
            this.label31.Size = new System.Drawing.Size(35, 13);
            this.label31.TabIndex = 10;
            this.label31.Text = "Filter :";
            // 
            // label30
            // 
            this.label30.AutoSize = true;
            this.label30.Location = new System.Drawing.Point(7, 33);
            this.label30.Name = "label30";
            this.label30.Size = new System.Drawing.Size(64, 13);
            this.label30.TabIndex = 9;
            this.label30.Text = "Filter name :";
            // 
            // label29
            // 
            this.label29.AutoSize = true;
            this.label29.Location = new System.Drawing.Point(7, 7);
            this.label29.Name = "label29";
            this.label29.Size = new System.Drawing.Size(294, 13);
            this.label29.TabIndex = 8;
            this.label29.Text = "Here, you can save your prefered filter for the selected profile";
            // 
            // Tp_Level
            // 
            this.Tp_Level.Controls.Add(this.Cb_Level_Regex);
            this.Tp_Level.Controls.Add(this.Cb_LHL_Bold);
            this.Tp_Level.Controls.Add(this.label23);
            this.Tp_Level.Controls.Add(this.Cb_HighPriority);
            this.Tp_Level.Controls.Add(this.Cb_LevelCase);
            this.Tp_Level.Controls.Add(this.Dgv_Level);
            this.Tp_Level.Controls.Add(this.Btn_LevelDelete);
            this.Tp_Level.Controls.Add(this.Btn_LevelUp);
            this.Tp_Level.Controls.Add(this.Txt_LevelText);
            this.Tp_Level.Controls.Add(this.Btn_LevelDown);
            this.Tp_Level.Controls.Add(this.Lbl_Text);
            this.Tp_Level.Controls.Add(this.Btn_LevelAdd);
            this.Tp_Level.Controls.Add(this.label2);
            this.Tp_Level.Controls.Add(this.Lbl_LevelApercu);
            this.Tp_Level.Controls.Add(this.label3);
            this.Tp_Level.Controls.Add(this.Btn_LevelBackColor);
            this.Tp_Level.Controls.Add(this.Btn_LevelForeColor);
            this.Tp_Level.Location = new System.Drawing.Point(4, 22);
            this.Tp_Level.Name = "Tp_Level";
            this.Tp_Level.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_Level.Size = new System.Drawing.Size(784, 585);
            this.Tp_Level.TabIndex = 0;
            this.Tp_Level.Text = "Level Highlighting";
            this.Tp_Level.UseVisualStyleBackColor = true;
            // 
            // Cb_Level_Regex
            // 
            this.Cb_Level_Regex.AutoSize = true;
            this.Cb_Level_Regex.DataBindings.Add(new System.Windows.Forms.Binding("Checked", this.highlightingBindingSource, "IsRegEx", true));
            this.Cb_Level_Regex.Location = new System.Drawing.Point(288, 131);
            this.Cb_Level_Regex.Name = "Cb_Level_Regex";
            this.Cb_Level_Regex.Size = new System.Drawing.Size(117, 17);
            this.Cb_Level_Regex.TabIndex = 25;
            this.Cb_Level_Regex.Text = "Regular Expression";
            this.Cb_Level_Regex.UseVisualStyleBackColor = true;
            // 
            // highlightingBindingSource
            // 
            this.highlightingBindingSource.DataSource = typeof(LogWatcher.Common.Highlighting);
            // 
            // Cb_LHL_Bold
            // 
            this.Cb_LHL_Bold.AutoSize = true;
            this.Cb_LHL_Bold.DataBindings.Add(new System.Windows.Forms.Binding("Checked", this.highlightingBindingSource, "Bold", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Cb_LHL_Bold.Location = new System.Drawing.Point(127, 131);
            this.Cb_LHL_Bold.Name = "Cb_LHL_Bold";
            this.Cb_LHL_Bold.Size = new System.Drawing.Size(47, 17);
            this.Cb_LHL_Bold.TabIndex = 12;
            this.Cb_LHL_Bold.Text = "Bold";
            this.Cb_LHL_Bold.UseVisualStyleBackColor = true;
            this.Cb_LHL_Bold.CheckedChanged += new System.EventHandler(this.Cb_LHL_Bold_CheckedChanged);
            // 
            // label23
            // 
            this.label23.AutoSize = true;
            this.label23.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label23.Location = new System.Drawing.Point(14, 16);
            this.label23.Name = "label23";
            this.label23.Size = new System.Drawing.Size(612, 13);
            this.label23.TabIndex = 11;
            this.label23.Text = "Here you can set your level Highlighting (DEBUG, INFO, ERROR, ...).  For highligh" +
    "ting specific to an application, go to Profile tab";
            // 
            // Cb_HighPriority
            // 
            this.Cb_HighPriority.AutoSize = true;
            this.Cb_HighPriority.Checked = true;
            this.Cb_HighPriority.CheckState = System.Windows.Forms.CheckState.Checked;
            this.Cb_HighPriority.DataBindings.Add(new System.Windows.Forms.Binding("Checked", this.highlightingBindingSource, "HightPriority", true));
            this.Cb_HighPriority.Location = new System.Drawing.Point(200, 131);
            this.Cb_HighPriority.Name = "Cb_HighPriority";
            this.Cb_HighPriority.Size = new System.Drawing.Size(82, 17);
            this.Cb_HighPriority.TabIndex = 10;
            this.Cb_HighPriority.Text = "High Priority";
            this.Tt_Help.SetToolTip(this.Cb_HighPriority, "Activate this option if you want selected level highlighting was shown even if a " +
        "profile Highlighting match with.\r\nIt could be useful for High level (ERROR, FATA" +
        "L, ...)");
            this.Cb_HighPriority.UseVisualStyleBackColor = true;
            // 
            // Cb_LevelCase
            // 
            this.Cb_LevelCase.AutoSize = true;
            this.Cb_LevelCase.Checked = true;
            this.Cb_LevelCase.CheckState = System.Windows.Forms.CheckState.Checked;
            this.Cb_LevelCase.DataBindings.Add(new System.Windows.Forms.Binding("Checked", this.highlightingBindingSource, "CaseSensitive", true));
            this.Cb_LevelCase.Location = new System.Drawing.Point(15, 131);
            this.Cb_LevelCase.Name = "Cb_LevelCase";
            this.Cb_LevelCase.Size = new System.Drawing.Size(96, 17);
            this.Cb_LevelCase.TabIndex = 9;
            this.Cb_LevelCase.Text = "Case Sensitive";
            this.Cb_LevelCase.UseVisualStyleBackColor = true;
            // 
            // Dgv_Level
            // 
            this.Dgv_Level.AllowUserToAddRows = false;
            this.Dgv_Level.AllowUserToDeleteRows = false;
            this.Dgv_Level.AllowUserToResizeColumns = false;
            this.Dgv_Level.AllowUserToResizeRows = false;
            this.Dgv_Level.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Dgv_Level.AutoGenerateColumns = false;
            this.Dgv_Level.BackgroundColor = System.Drawing.Color.White;
            this.Dgv_Level.ColumnHeadersVisible = false;
            this.Dgv_Level.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Selection,
            this.orderDataGridViewTextBoxColumn,
            this.textDataGridViewTextBoxColumn,
            this.backColorDataGridViewTextBoxColumn,
            this.caseSensitiveDataGridViewCheckBoxColumn,
            this.foreColorDataGridViewTextBoxColumn});
            this.Dgv_Level.DataSource = this.highlightingBindingSource;
            this.Dgv_Level.Location = new System.Drawing.Point(6, 183);
            this.Dgv_Level.MultiSelect = false;
            this.Dgv_Level.Name = "Dgv_Level";
            this.Dgv_Level.ReadOnly = true;
            this.Dgv_Level.RowHeadersVisible = false;
            this.Dgv_Level.RowHeadersWidthSizeMode = System.Windows.Forms.DataGridViewRowHeadersWidthSizeMode.DisableResizing;
            this.Dgv_Level.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.Dgv_Level.Size = new System.Drawing.Size(772, 396);
            this.Dgv_Level.TabIndex = 0;
            this.Dgv_Level.RowPrePaint += new System.Windows.Forms.DataGridViewRowPrePaintEventHandler(this.Dgv_Base_RowPrePaint);
            // 
            // Selection
            // 
            this.Selection.HeaderText = "Selection";
            this.Selection.Name = "Selection";
            this.Selection.ReadOnly = true;
            this.Selection.Width = 10;
            // 
            // orderDataGridViewTextBoxColumn
            // 
            this.orderDataGridViewTextBoxColumn.DataPropertyName = "Order";
            this.orderDataGridViewTextBoxColumn.HeaderText = "Order";
            this.orderDataGridViewTextBoxColumn.Name = "orderDataGridViewTextBoxColumn";
            this.orderDataGridViewTextBoxColumn.ReadOnly = true;
            this.orderDataGridViewTextBoxColumn.Visible = false;
            // 
            // textDataGridViewTextBoxColumn
            // 
            this.textDataGridViewTextBoxColumn.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.textDataGridViewTextBoxColumn.DataPropertyName = "Text";
            this.textDataGridViewTextBoxColumn.HeaderText = "Text";
            this.textDataGridViewTextBoxColumn.Name = "textDataGridViewTextBoxColumn";
            this.textDataGridViewTextBoxColumn.ReadOnly = true;
            // 
            // backColorDataGridViewTextBoxColumn
            // 
            this.backColorDataGridViewTextBoxColumn.DataPropertyName = "BackColor";
            this.backColorDataGridViewTextBoxColumn.HeaderText = "BackColor";
            this.backColorDataGridViewTextBoxColumn.Name = "backColorDataGridViewTextBoxColumn";
            this.backColorDataGridViewTextBoxColumn.ReadOnly = true;
            this.backColorDataGridViewTextBoxColumn.Visible = false;
            // 
            // caseSensitiveDataGridViewCheckBoxColumn
            // 
            this.caseSensitiveDataGridViewCheckBoxColumn.DataPropertyName = "CaseSensitive";
            this.caseSensitiveDataGridViewCheckBoxColumn.HeaderText = "CaseSensitive";
            this.caseSensitiveDataGridViewCheckBoxColumn.Name = "caseSensitiveDataGridViewCheckBoxColumn";
            this.caseSensitiveDataGridViewCheckBoxColumn.ReadOnly = true;
            this.caseSensitiveDataGridViewCheckBoxColumn.Visible = false;
            // 
            // foreColorDataGridViewTextBoxColumn
            // 
            this.foreColorDataGridViewTextBoxColumn.DataPropertyName = "ForeColor";
            this.foreColorDataGridViewTextBoxColumn.HeaderText = "ForeColor";
            this.foreColorDataGridViewTextBoxColumn.Name = "foreColorDataGridViewTextBoxColumn";
            this.foreColorDataGridViewTextBoxColumn.ReadOnly = true;
            this.foreColorDataGridViewTextBoxColumn.Visible = false;
            // 
            // Btn_LevelDelete
            // 
            this.Btn_LevelDelete.Location = new System.Drawing.Point(64, 154);
            this.Btn_LevelDelete.Name = "Btn_LevelDelete";
            this.Btn_LevelDelete.Size = new System.Drawing.Size(52, 23);
            this.Btn_LevelDelete.TabIndex = 8;
            this.Btn_LevelDelete.Text = "Delete";
            this.Btn_LevelDelete.UseVisualStyleBackColor = true;
            this.Btn_LevelDelete.Click += new System.EventHandler(this.Btn_Delete_Click);
            // 
            // Btn_LevelUp
            // 
            this.Btn_LevelUp.Location = new System.Drawing.Point(227, 154);
            this.Btn_LevelUp.Name = "Btn_LevelUp";
            this.Btn_LevelUp.Size = new System.Drawing.Size(55, 23);
            this.Btn_LevelUp.TabIndex = 1;
            this.Btn_LevelUp.Text = "Up";
            this.Btn_LevelUp.UseVisualStyleBackColor = true;
            this.Btn_LevelUp.Click += new System.EventHandler(this.Btn_Up_Click);
            // 
            // Txt_LevelText
            // 
            this.Txt_LevelText.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.highlightingBindingSource, "Text", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Txt_LevelText.Location = new System.Drawing.Point(116, 45);
            this.Txt_LevelText.Name = "Txt_LevelText";
            this.Txt_LevelText.Size = new System.Drawing.Size(166, 20);
            this.Txt_LevelText.TabIndex = 1;
            // 
            // Btn_LevelDown
            // 
            this.Btn_LevelDown.Location = new System.Drawing.Point(165, 154);
            this.Btn_LevelDown.Name = "Btn_LevelDown";
            this.Btn_LevelDown.Size = new System.Drawing.Size(56, 23);
            this.Btn_LevelDown.TabIndex = 2;
            this.Btn_LevelDown.Text = "Down";
            this.Btn_LevelDown.UseVisualStyleBackColor = true;
            this.Btn_LevelDown.Click += new System.EventHandler(this.Btn_Down_Click);
            // 
            // Lbl_Text
            // 
            this.Lbl_Text.AutoSize = true;
            this.Lbl_Text.Location = new System.Drawing.Point(75, 48);
            this.Lbl_Text.Name = "Lbl_Text";
            this.Lbl_Text.Size = new System.Drawing.Size(34, 13);
            this.Lbl_Text.TabIndex = 0;
            this.Lbl_Text.Text = "Text :";
            // 
            // Btn_LevelAdd
            // 
            this.Btn_LevelAdd.Location = new System.Drawing.Point(6, 154);
            this.Btn_LevelAdd.Name = "Btn_LevelAdd";
            this.Btn_LevelAdd.Size = new System.Drawing.Size(52, 23);
            this.Btn_LevelAdd.TabIndex = 7;
            this.Btn_LevelAdd.Text = "Add";
            this.Btn_LevelAdd.UseVisualStyleBackColor = true;
            this.Btn_LevelAdd.Click += new System.EventHandler(this.Btn_Add_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(49, 77);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(61, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Fore Color :";
            // 
            // Lbl_LevelApercu
            // 
            this.Lbl_LevelApercu.BackColor = System.Drawing.Color.White;
            this.Lbl_LevelApercu.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.Lbl_LevelApercu.DataBindings.Add(new System.Windows.Forms.Binding("BackColor", this.highlightingBindingSource, "BackColor", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Lbl_LevelApercu.DataBindings.Add(new System.Windows.Forms.Binding("ForeColor", this.highlightingBindingSource, "ForeColor", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Lbl_LevelApercu.Location = new System.Drawing.Point(165, 77);
            this.Lbl_LevelApercu.Name = "Lbl_LevelApercu";
            this.Lbl_LevelApercu.Size = new System.Drawing.Size(117, 39);
            this.Lbl_LevelApercu.TabIndex = 6;
            this.Lbl_LevelApercu.Text = "Apercu";
            this.Lbl_LevelApercu.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 103);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(98, 13);
            this.label3.TabIndex = 3;
            this.label3.Text = "Background Color :";
            // 
            // Btn_LevelBackColor
            // 
            this.Btn_LevelBackColor.Location = new System.Drawing.Point(116, 98);
            this.Btn_LevelBackColor.Name = "Btn_LevelBackColor";
            this.Btn_LevelBackColor.Size = new System.Drawing.Size(43, 23);
            this.Btn_LevelBackColor.TabIndex = 5;
            this.Btn_LevelBackColor.Text = "color";
            this.Btn_LevelBackColor.UseVisualStyleBackColor = true;
            this.Btn_LevelBackColor.Click += new System.EventHandler(this.Btn_BackColor_Click);
            // 
            // Btn_LevelForeColor
            // 
            this.Btn_LevelForeColor.Location = new System.Drawing.Point(116, 72);
            this.Btn_LevelForeColor.Name = "Btn_LevelForeColor";
            this.Btn_LevelForeColor.Size = new System.Drawing.Size(43, 23);
            this.Btn_LevelForeColor.TabIndex = 4;
            this.Btn_LevelForeColor.Text = "color";
            this.Btn_LevelForeColor.UseVisualStyleBackColor = true;
            this.Btn_LevelForeColor.Click += new System.EventHandler(this.Btn_ForeColor_Click);
            // 
            // Tp_LogBrowser
            // 
            this.Tp_LogBrowser.Controls.Add(this.Tab_LogBrowser);
            this.Tp_LogBrowser.Location = new System.Drawing.Point(4, 22);
            this.Tp_LogBrowser.Name = "Tp_LogBrowser";
            this.Tp_LogBrowser.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_LogBrowser.Size = new System.Drawing.Size(784, 585);
            this.Tp_LogBrowser.TabIndex = 4;
            this.Tp_LogBrowser.Text = "Log Browser";
            this.Tp_LogBrowser.UseVisualStyleBackColor = true;
            // 
            // Tab_LogBrowser
            // 
            this.Tab_LogBrowser.Controls.Add(this.Tp_RealDir);
            this.Tab_LogBrowser.Controls.Add(this.Tp_VirtualDir);
            this.Tab_LogBrowser.Location = new System.Drawing.Point(8, 6);
            this.Tab_LogBrowser.Name = "Tab_LogBrowser";
            this.Tab_LogBrowser.SelectedIndex = 0;
            this.Tab_LogBrowser.Size = new System.Drawing.Size(768, 573);
            this.Tab_LogBrowser.TabIndex = 9;
            // 
            // Tp_RealDir
            // 
            this.Tp_RealDir.Controls.Add(this.label27);
            this.Tp_RealDir.Controls.Add(this.label26);
            this.Tp_RealDir.Controls.Add(this.Btn_LB_DelRealDir);
            this.Tp_RealDir.Controls.Add(this.Dgv_Lb_RealDir);
            this.Tp_RealDir.Controls.Add(this.Txt_LogBrowserDir);
            this.Tp_RealDir.Controls.Add(this.label12);
            this.Tp_RealDir.Controls.Add(this.Btn_LogBrowserAdd);
            this.Tp_RealDir.Controls.Add(this.Txt_LogBrowserName);
            this.Tp_RealDir.Controls.Add(this.Btn_LogBrowserDir);
            this.Tp_RealDir.Controls.Add(this.Txt_LogBrowserFilter);
            this.Tp_RealDir.Controls.Add(this.label13);
            this.Tp_RealDir.Location = new System.Drawing.Point(4, 22);
            this.Tp_RealDir.Name = "Tp_RealDir";
            this.Tp_RealDir.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_RealDir.Size = new System.Drawing.Size(760, 547);
            this.Tp_RealDir.TabIndex = 0;
            this.Tp_RealDir.Text = "Real Directory";
            this.Tp_RealDir.UseVisualStyleBackColor = true;
            // 
            // label27
            // 
            this.label27.AutoSize = true;
            this.label27.Location = new System.Drawing.Point(417, 57);
            this.label27.Name = "label27";
            this.label27.Size = new System.Drawing.Size(337, 13);
            this.label27.TabIndex = 11;
            this.label27.Text = "It\'s regular expression but you can set \"*.log\" to display all log file type.";
            // 
            // label26
            // 
            this.label26.AutoSize = true;
            this.label26.Location = new System.Drawing.Point(18, 7);
            this.label26.Name = "label26";
            this.label26.Size = new System.Drawing.Size(313, 13);
            this.label26.TabIndex = 10;
            this.label26.Text = "Here you can set the real directories listed in LogBrowser window";
            // 
            // Btn_LB_DelRealDir
            // 
            this.Btn_LB_DelRealDir.Location = new System.Drawing.Point(88, 116);
            this.Btn_LB_DelRealDir.Name = "Btn_LB_DelRealDir";
            this.Btn_LB_DelRealDir.Size = new System.Drawing.Size(75, 23);
            this.Btn_LB_DelRealDir.TabIndex = 9;
            this.Btn_LB_DelRealDir.Text = "Delete";
            this.Btn_LB_DelRealDir.UseVisualStyleBackColor = true;
            this.Btn_LB_DelRealDir.Click += new System.EventHandler(this.Btn_LB_DelRealDir_Click);
            // 
            // Dgv_Lb_RealDir
            // 
            this.Dgv_Lb_RealDir.AllowUserToAddRows = false;
            this.Dgv_Lb_RealDir.AllowUserToDeleteRows = false;
            this.Dgv_Lb_RealDir.AllowUserToResizeRows = false;
            this.Dgv_Lb_RealDir.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Dgv_Lb_RealDir.AutoGenerateColumns = false;
            this.Dgv_Lb_RealDir.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.AllCells;
            this.Dgv_Lb_RealDir.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.AllCells;
            this.Dgv_Lb_RealDir.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.Dgv_Lb_RealDir.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.nameDataGridViewTextBoxColumn,
            this.filterDataGridViewTextBoxColumn,
            this.Path});
            this.Dgv_Lb_RealDir.DataSource = this.logBrowserItemBindingSource;
            this.Dgv_Lb_RealDir.EditMode = System.Windows.Forms.DataGridViewEditMode.EditOnEnter;
            this.Dgv_Lb_RealDir.Location = new System.Drawing.Point(6, 145);
            this.Dgv_Lb_RealDir.MultiSelect = false;
            this.Dgv_Lb_RealDir.Name = "Dgv_Lb_RealDir";
            this.Dgv_Lb_RealDir.RowHeadersVisible = false;
            this.Dgv_Lb_RealDir.RowHeadersWidthSizeMode = System.Windows.Forms.DataGridViewRowHeadersWidthSizeMode.DisableResizing;
            this.Dgv_Lb_RealDir.RowTemplate.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            this.Dgv_Lb_RealDir.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.CellSelect;
            this.Dgv_Lb_RealDir.Size = new System.Drawing.Size(748, 396);
            this.Dgv_Lb_RealDir.TabIndex = 6;
            // 
            // nameDataGridViewTextBoxColumn
            // 
            this.nameDataGridViewTextBoxColumn.DataPropertyName = "Name";
            this.nameDataGridViewTextBoxColumn.HeaderText = "Name";
            this.nameDataGridViewTextBoxColumn.Name = "nameDataGridViewTextBoxColumn";
            this.nameDataGridViewTextBoxColumn.Width = 60;
            // 
            // filterDataGridViewTextBoxColumn
            // 
            this.filterDataGridViewTextBoxColumn.DataPropertyName = "Filter";
            this.filterDataGridViewTextBoxColumn.HeaderText = "Filter";
            this.filterDataGridViewTextBoxColumn.Name = "filterDataGridViewTextBoxColumn";
            this.filterDataGridViewTextBoxColumn.Width = 54;
            // 
            // Path
            // 
            this.Path.DataPropertyName = "Path";
            this.Path.HeaderText = "Path";
            this.Path.Name = "Path";
            this.Path.Width = 54;
            // 
            // logBrowserItemBindingSource
            // 
            this.logBrowserItemBindingSource.DataSource = typeof(LogWatcher.Common.LogBrowserItem);
            // 
            // Txt_LogBrowserDir
            // 
            this.Txt_LogBrowserDir.Location = new System.Drawing.Point(76, 79);
            this.Txt_LogBrowserDir.Name = "Txt_LogBrowserDir";
            this.Txt_LogBrowserDir.Size = new System.Drawing.Size(678, 20);
            this.Txt_LogBrowserDir.TabIndex = 8;
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(35, 31);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(35, 13);
            this.label12.TabIndex = 0;
            this.label12.Text = "Name";
            // 
            // Btn_LogBrowserAdd
            // 
            this.Btn_LogBrowserAdd.Location = new System.Drawing.Point(6, 116);
            this.Btn_LogBrowserAdd.Name = "Btn_LogBrowserAdd";
            this.Btn_LogBrowserAdd.Size = new System.Drawing.Size(75, 23);
            this.Btn_LogBrowserAdd.TabIndex = 7;
            this.Btn_LogBrowserAdd.Text = "Add";
            this.Btn_LogBrowserAdd.UseVisualStyleBackColor = true;
            this.Btn_LogBrowserAdd.Click += new System.EventHandler(this.Btn_LogBrowserAdd_Click);
            // 
            // Txt_LogBrowserName
            // 
            this.Txt_LogBrowserName.Location = new System.Drawing.Point(76, 28);
            this.Txt_LogBrowserName.Name = "Txt_LogBrowserName";
            this.Txt_LogBrowserName.Size = new System.Drawing.Size(678, 20);
            this.Txt_LogBrowserName.TabIndex = 1;
            // 
            // Btn_LogBrowserDir
            // 
            this.Btn_LogBrowserDir.Location = new System.Drawing.Point(6, 77);
            this.Btn_LogBrowserDir.Name = "Btn_LogBrowserDir";
            this.Btn_LogBrowserDir.Size = new System.Drawing.Size(66, 23);
            this.Btn_LogBrowserDir.TabIndex = 3;
            this.Btn_LogBrowserDir.Text = "Directory";
            this.Btn_LogBrowserDir.UseVisualStyleBackColor = true;
            this.Btn_LogBrowserDir.Click += new System.EventHandler(this.Btn_LogBrowserDir_Click);
            // 
            // Txt_LogBrowserFilter
            // 
            this.Txt_LogBrowserFilter.Location = new System.Drawing.Point(76, 54);
            this.Txt_LogBrowserFilter.Name = "Txt_LogBrowserFilter";
            this.Txt_LogBrowserFilter.Size = new System.Drawing.Size(335, 20);
            this.Txt_LogBrowserFilter.TabIndex = 5;
            this.Tt_Help.SetToolTip(this.Txt_LogBrowserFilter, resources.GetString("Txt_LogBrowserFilter.ToolTip"));
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(41, 57);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(29, 13);
            this.label13.TabIndex = 4;
            this.label13.Text = "Filter";
            // 
            // Tp_VirtualDir
            // 
            this.Tp_VirtualDir.Controls.Add(this.label25);
            this.Tp_VirtualDir.Controls.Add(this.Btn_LB_DelVirtualFile);
            this.Tp_VirtualDir.Controls.Add(this.Btn_LB_Path);
            this.Tp_VirtualDir.Controls.Add(this.Txt_LB_FileName);
            this.Tp_VirtualDir.Controls.Add(this.Txt_LB_FilePath);
            this.Tp_VirtualDir.Controls.Add(this.label17);
            this.Tp_VirtualDir.Controls.Add(this.label16);
            this.Tp_VirtualDir.Controls.Add(this.Btn_LB_AddVirtualFile);
            this.Tp_VirtualDir.Controls.Add(this.Dgv_LB_VirtualFile);
            this.Tp_VirtualDir.Controls.Add(this.Btn_LB_DeleteVirtualDir);
            this.Tp_VirtualDir.Controls.Add(this.Btn_LB_AddVirtualDir);
            this.Tp_VirtualDir.Controls.Add(this.Ddl_LB_VirtualDir);
            this.Tp_VirtualDir.Controls.Add(this.label15);
            this.Tp_VirtualDir.Location = new System.Drawing.Point(4, 22);
            this.Tp_VirtualDir.Name = "Tp_VirtualDir";
            this.Tp_VirtualDir.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_VirtualDir.Size = new System.Drawing.Size(760, 547);
            this.Tp_VirtualDir.TabIndex = 1;
            this.Tp_VirtualDir.Text = "Virtual Directory";
            this.Tp_VirtualDir.UseVisualStyleBackColor = true;
            // 
            // label25
            // 
            this.label25.Location = new System.Drawing.Point(10, 7);
            this.label25.Name = "label25";
            this.label25.Size = new System.Drawing.Size(743, 33);
            this.label25.TabIndex = 12;
            this.label25.Text = resources.GetString("label25.Text");
            // 
            // Btn_LB_DelVirtualFile
            // 
            this.Btn_LB_DelVirtualFile.Location = new System.Drawing.Point(92, 140);
            this.Btn_LB_DelVirtualFile.Name = "Btn_LB_DelVirtualFile";
            this.Btn_LB_DelVirtualFile.Size = new System.Drawing.Size(75, 23);
            this.Btn_LB_DelVirtualFile.TabIndex = 11;
            this.Btn_LB_DelVirtualFile.Text = "Delete";
            this.Btn_LB_DelVirtualFile.UseVisualStyleBackColor = true;
            this.Btn_LB_DelVirtualFile.Click += new System.EventHandler(this.Btn_LB_DelVirtualFile_Click);
            // 
            // Btn_LB_Path
            // 
            this.Btn_LB_Path.Location = new System.Drawing.Point(726, 79);
            this.Btn_LB_Path.Name = "Btn_LB_Path";
            this.Btn_LB_Path.Size = new System.Drawing.Size(27, 23);
            this.Btn_LB_Path.TabIndex = 10;
            this.Btn_LB_Path.Text = "...";
            this.Btn_LB_Path.UseVisualStyleBackColor = true;
            this.Btn_LB_Path.Click += new System.EventHandler(this.Btn_LB_Path_Click);
            // 
            // Txt_LB_FileName
            // 
            this.Txt_LB_FileName.Location = new System.Drawing.Point(67, 107);
            this.Txt_LB_FileName.Name = "Txt_LB_FileName";
            this.Txt_LB_FileName.Size = new System.Drawing.Size(686, 20);
            this.Txt_LB_FileName.TabIndex = 9;
            // 
            // Txt_LB_FilePath
            // 
            this.Txt_LB_FilePath.Location = new System.Drawing.Point(67, 81);
            this.Txt_LB_FilePath.Name = "Txt_LB_FilePath";
            this.Txt_LB_FilePath.Size = new System.Drawing.Size(656, 20);
            this.Txt_LB_FilePath.TabIndex = 8;
            // 
            // label17
            // 
            this.label17.AutoSize = true;
            this.label17.Location = new System.Drawing.Point(7, 110);
            this.label17.Name = "label17";
            this.label17.Size = new System.Drawing.Size(58, 13);
            this.label17.TabIndex = 7;
            this.label17.Text = "File name :";
            // 
            // label16
            // 
            this.label16.AutoSize = true;
            this.label16.Location = new System.Drawing.Point(7, 84);
            this.label16.Name = "label16";
            this.label16.Size = new System.Drawing.Size(54, 13);
            this.label16.TabIndex = 6;
            this.label16.Text = "File Path :";
            // 
            // Btn_LB_AddVirtualFile
            // 
            this.Btn_LB_AddVirtualFile.Location = new System.Drawing.Point(10, 140);
            this.Btn_LB_AddVirtualFile.Name = "Btn_LB_AddVirtualFile";
            this.Btn_LB_AddVirtualFile.Size = new System.Drawing.Size(75, 23);
            this.Btn_LB_AddVirtualFile.TabIndex = 5;
            this.Btn_LB_AddVirtualFile.Text = "Add";
            this.Btn_LB_AddVirtualFile.UseVisualStyleBackColor = true;
            this.Btn_LB_AddVirtualFile.Click += new System.EventHandler(this.Btn_LB_AddVirtualFile_Click);
            // 
            // Dgv_LB_VirtualFile
            // 
            this.Dgv_LB_VirtualFile.AllowUserToAddRows = false;
            this.Dgv_LB_VirtualFile.AllowUserToDeleteRows = false;
            this.Dgv_LB_VirtualFile.AllowUserToResizeRows = false;
            this.Dgv_LB_VirtualFile.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Dgv_LB_VirtualFile.AutoGenerateColumns = false;
            this.Dgv_LB_VirtualFile.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.Dgv_LB_VirtualFile.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.AllCells;
            this.Dgv_LB_VirtualFile.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.Dgv_LB_VirtualFile.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.nameDataGridViewTextBoxColumn1,
            this.pathDataGridViewTextBoxColumn1});
            this.Dgv_LB_VirtualFile.DataSource = this.logBrowserVirtualFileBindingSource;
            this.Dgv_LB_VirtualFile.EditMode = System.Windows.Forms.DataGridViewEditMode.EditOnEnter;
            this.Dgv_LB_VirtualFile.Location = new System.Drawing.Point(9, 169);
            this.Dgv_LB_VirtualFile.Name = "Dgv_LB_VirtualFile";
            this.Dgv_LB_VirtualFile.RowHeadersVisible = false;
            this.Dgv_LB_VirtualFile.RowHeadersWidthSizeMode = System.Windows.Forms.DataGridViewRowHeadersWidthSizeMode.DisableResizing;
            this.Dgv_LB_VirtualFile.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.CellSelect;
            this.Dgv_LB_VirtualFile.Size = new System.Drawing.Size(745, 372);
            this.Dgv_LB_VirtualFile.TabIndex = 4;
            // 
            // nameDataGridViewTextBoxColumn1
            // 
            this.nameDataGridViewTextBoxColumn1.DataPropertyName = "Name";
            this.nameDataGridViewTextBoxColumn1.FillWeight = 50F;
            this.nameDataGridViewTextBoxColumn1.HeaderText = "Name";
            this.nameDataGridViewTextBoxColumn1.Name = "nameDataGridViewTextBoxColumn1";
            // 
            // pathDataGridViewTextBoxColumn1
            // 
            this.pathDataGridViewTextBoxColumn1.DataPropertyName = "Path";
            this.pathDataGridViewTextBoxColumn1.HeaderText = "Path";
            this.pathDataGridViewTextBoxColumn1.Name = "pathDataGridViewTextBoxColumn1";
            // 
            // logBrowserVirtualFileBindingSource
            // 
            this.logBrowserVirtualFileBindingSource.DataSource = typeof(LogWatcher.Common.LogBrowserVirtualFile);
            // 
            // Btn_LB_DeleteVirtualDir
            // 
            this.Btn_LB_DeleteVirtualDir.Location = new System.Drawing.Point(459, 51);
            this.Btn_LB_DeleteVirtualDir.Name = "Btn_LB_DeleteVirtualDir";
            this.Btn_LB_DeleteVirtualDir.Size = new System.Drawing.Size(52, 23);
            this.Btn_LB_DeleteVirtualDir.TabIndex = 3;
            this.Btn_LB_DeleteVirtualDir.Text = "Delete";
            this.Btn_LB_DeleteVirtualDir.UseVisualStyleBackColor = true;
            this.Btn_LB_DeleteVirtualDir.Click += new System.EventHandler(this.Btn_LB_DeleteVirtualDir_Click);
            // 
            // Btn_LB_AddVirtualDir
            // 
            this.Btn_LB_AddVirtualDir.Location = new System.Drawing.Point(412, 51);
            this.Btn_LB_AddVirtualDir.Name = "Btn_LB_AddVirtualDir";
            this.Btn_LB_AddVirtualDir.Size = new System.Drawing.Size(41, 23);
            this.Btn_LB_AddVirtualDir.TabIndex = 2;
            this.Btn_LB_AddVirtualDir.Text = "Add";
            this.Btn_LB_AddVirtualDir.UseVisualStyleBackColor = true;
            this.Btn_LB_AddVirtualDir.Click += new System.EventHandler(this.Btn_LB_AddVirtualDir_Click);
            // 
            // Ddl_LB_VirtualDir
            // 
            this.Ddl_LB_VirtualDir.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.Ddl_LB_VirtualDir.FormattingEnabled = true;
            this.Ddl_LB_VirtualDir.Location = new System.Drawing.Point(127, 51);
            this.Ddl_LB_VirtualDir.Name = "Ddl_LB_VirtualDir";
            this.Ddl_LB_VirtualDir.Size = new System.Drawing.Size(278, 21);
            this.Ddl_LB_VirtualDir.TabIndex = 1;
            this.Ddl_LB_VirtualDir.SelectedIndexChanged += new System.EventHandler(this.Ddl_VirtualDir_SelectedIndexChanged);
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(10, 54);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(114, 13);
            this.label15.TabIndex = 0;
            this.label15.Text = "Virtual directory name :";
            // 
            // Tp_Option
            // 
            this.Tp_Option.Controls.Add(this.groupBox5);
            this.Tp_Option.Controls.Add(this.groupBox4);
            this.Tp_Option.Controls.Add(this.groupBox3);
            this.Tp_Option.Controls.Add(this.Cb_SingleInstance);
            this.Tp_Option.Controls.Add(this.label38);
            this.Tp_Option.Controls.Add(this.Txt_LogBrowserNumDays);
            this.Tp_Option.Controls.Add(this.label37);
            this.Tp_Option.Controls.Add(this.label36);
            this.Tp_Option.Controls.Add(this.Txt_MaxSizeToPrompt);
            this.Tp_Option.Controls.Add(this.Ddl_DefaultEncoding);
            this.Tp_Option.Controls.Add(this.label32);
            this.Tp_Option.Controls.Add(this.Cb_ShowWarnBanner);
            this.Tp_Option.Controls.Add(this.label22);
            this.Tp_Option.Controls.Add(this.Txt_EofSizeToLoad);
            this.Tp_Option.Controls.Add(this.label21);
            this.Tp_Option.Controls.Add(this.Cb_LoadOnlyEOF);
            this.Tp_Option.Controls.Add(this.Btn_ClearSearchHisto);
            this.Tp_Option.Controls.Add(this.Txt_ContextRowNbr);
            this.Tp_Option.Controls.Add(this.label14);
            this.Tp_Option.Controls.Add(this.Lbl_Font);
            this.Tp_Option.Controls.Add(this.Btn_SelectFont);
            this.Tp_Option.Controls.Add(this.Cb_SaveLogs);
            this.Tp_Option.Controls.Add(this.Cb_WrapLine);
            this.Tp_Option.Location = new System.Drawing.Point(4, 22);
            this.Tp_Option.Name = "Tp_Option";
            this.Tp_Option.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_Option.Size = new System.Drawing.Size(784, 585);
            this.Tp_Option.TabIndex = 3;
            this.Tp_Option.Text = "Option";
            this.Tp_Option.UseVisualStyleBackColor = true;
            // 
            // groupBox5
            // 
            this.groupBox5.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.groupBox5.Controls.Add(this.Txt_SharedFolder);
            this.groupBox5.Controls.Add(this.Btn_BrowseSharedFolder);
            this.groupBox5.Location = new System.Drawing.Point(20, 250);
            this.groupBox5.Name = "groupBox5";
            this.groupBox5.Size = new System.Drawing.Size(760, 50);
            this.groupBox5.TabIndex = 45;
            this.groupBox5.TabStop = false;
            this.groupBox5.Text = "Shared folder :";
            // 
            // Txt_SharedFolder
            // 
            this.Txt_SharedFolder.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_SharedFolder.Location = new System.Drawing.Point(32, 21);
            this.Txt_SharedFolder.Name = "Txt_SharedFolder";
            this.Txt_SharedFolder.Size = new System.Drawing.Size(722, 20);
            this.Txt_SharedFolder.TabIndex = 42;
            // 
            // Btn_BrowseSharedFolder
            // 
            this.Btn_BrowseSharedFolder.Location = new System.Drawing.Point(4, 19);
            this.Btn_BrowseSharedFolder.Name = "Btn_BrowseSharedFolder";
            this.Btn_BrowseSharedFolder.Size = new System.Drawing.Size(22, 23);
            this.Btn_BrowseSharedFolder.TabIndex = 44;
            this.Btn_BrowseSharedFolder.Text = "...";
            this.Btn_BrowseSharedFolder.UseVisualStyleBackColor = true;
            this.Btn_BrowseSharedFolder.Click += new System.EventHandler(this.Btn_BrowseSharedFolder_Click);
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.label39);
            this.groupBox4.Controls.Add(this.Txt_CmdOpenFile);
            this.groupBox4.Location = new System.Drawing.Point(19, 509);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(753, 56);
            this.groupBox4.TabIndex = 41;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "LogBrowser alternative reader";
            this.groupBox4.Visible = false;
            // 
            // label39
            // 
            this.label39.AutoSize = true;
            this.label39.Location = new System.Drawing.Point(7, 22);
            this.label39.Name = "label39";
            this.label39.Size = new System.Drawing.Size(250, 13);
            this.label39.TabIndex = 40;
            this.label39.Text = "Alternative reader command line ({0} for file name) : ";
            // 
            // Txt_CmdOpenFile
            // 
            this.Txt_CmdOpenFile.Location = new System.Drawing.Point(262, 19);
            this.Txt_CmdOpenFile.Name = "Txt_CmdOpenFile";
            this.Txt_CmdOpenFile.Size = new System.Drawing.Size(485, 20);
            this.Txt_CmdOpenFile.TabIndex = 39;
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.Rb_ContextView);
            this.groupBox3.Controls.Add(this.label11);
            this.groupBox3.Controls.Add(this.Rb_DetailView);
            this.groupBox3.Location = new System.Drawing.Point(20, 306);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(407, 55);
            this.groupBox3.TabIndex = 37;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Double click actions";
            // 
            // Rb_ContextView
            // 
            this.Rb_ContextView.AutoSize = true;
            this.Rb_ContextView.Location = new System.Drawing.Point(307, 24);
            this.Rb_ContextView.Name = "Rb_ContextView";
            this.Rb_ContextView.Size = new System.Drawing.Size(86, 17);
            this.Rb_ContextView.TabIndex = 36;
            this.Rb_ContextView.Text = "Context view";
            this.Rb_ContextView.UseVisualStyleBackColor = true;
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(11, 26);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(212, 13);
            this.label11.TabIndex = 34;
            this.label11.Text = "Select the action executed on double click ";
            // 
            // Rb_DetailView
            // 
            this.Rb_DetailView.AutoSize = true;
            this.Rb_DetailView.Checked = true;
            this.Rb_DetailView.Location = new System.Drawing.Point(229, 24);
            this.Rb_DetailView.Name = "Rb_DetailView";
            this.Rb_DetailView.Size = new System.Drawing.Size(77, 17);
            this.Rb_DetailView.TabIndex = 35;
            this.Rb_DetailView.TabStop = true;
            this.Rb_DetailView.Text = "Detail view";
            this.Rb_DetailView.UseVisualStyleBackColor = true;
            // 
            // Cb_SingleInstance
            // 
            this.Cb_SingleInstance.AutoSize = true;
            this.Cb_SingleInstance.Checked = true;
            this.Cb_SingleInstance.CheckState = System.Windows.Forms.CheckState.Checked;
            this.Cb_SingleInstance.Location = new System.Drawing.Point(24, 112);
            this.Cb_SingleInstance.Name = "Cb_SingleInstance";
            this.Cb_SingleInstance.Size = new System.Drawing.Size(236, 17);
            this.Cb_SingleInstance.TabIndex = 33;
            this.Cb_SingleInstance.Text = "Use always the same instance of logwatcher";
            this.Cb_SingleInstance.UseVisualStyleBackColor = true;
            // 
            // label38
            // 
            this.label38.AutoSize = true;
            this.label38.Location = new System.Drawing.Point(218, 487);
            this.label38.Name = "label38";
            this.label38.Size = new System.Drawing.Size(29, 13);
            this.label38.TabIndex = 32;
            this.label38.Text = "days";
            // 
            // Txt_LogBrowserNumDays
            // 
            this.Txt_LogBrowserNumDays.AsciiOnly = true;
            this.Txt_LogBrowserNumDays.Location = new System.Drawing.Point(176, 483);
            this.Txt_LogBrowserNumDays.Mask = "9999";
            this.Txt_LogBrowserNumDays.Name = "Txt_LogBrowserNumDays";
            this.Txt_LogBrowserNumDays.Size = new System.Drawing.Size(36, 20);
            this.Txt_LogBrowserNumDays.TabIndex = 31;
            // 
            // label37
            // 
            this.label37.AutoSize = true;
            this.label37.Location = new System.Drawing.Point(19, 487);
            this.label37.Name = "label37";
            this.label37.Size = new System.Drawing.Size(150, 13);
            this.label37.TabIndex = 30;
            this.label37.Text = "Logbrowser filter file older than";
            // 
            // label36
            // 
            this.label36.Location = new System.Drawing.Point(22, 461);
            this.label36.Name = "label36";
            this.label36.Size = new System.Drawing.Size(246, 13);
            this.label36.TabIndex = 29;
            this.label36.Text = "Maximum size (in MB) to prompt load selction mode";
            // 
            // Txt_MaxSizeToPrompt
            // 
            this.Txt_MaxSizeToPrompt.AsciiOnly = true;
            this.Txt_MaxSizeToPrompt.Location = new System.Drawing.Point(274, 458);
            this.Txt_MaxSizeToPrompt.Mask = "9999";
            this.Txt_MaxSizeToPrompt.Name = "Txt_MaxSizeToPrompt";
            this.Txt_MaxSizeToPrompt.Size = new System.Drawing.Size(36, 20);
            this.Txt_MaxSizeToPrompt.TabIndex = 28;
            this.Txt_MaxSizeToPrompt.Text = "200";
            // 
            // Ddl_DefaultEncoding
            // 
            this.Ddl_DefaultEncoding.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.Ddl_DefaultEncoding.FormattingEnabled = true;
            this.Ddl_DefaultEncoding.Items.AddRange(new object[] {
            "Default",
            "ASCII",
            "BigEndianUnicode",
            "Unicode",
            "UTF32",
            "UTF7",
            "UTF8"});
            this.Ddl_DefaultEncoding.Location = new System.Drawing.Point(119, 20);
            this.Ddl_DefaultEncoding.Name = "Ddl_DefaultEncoding";
            this.Ddl_DefaultEncoding.Size = new System.Drawing.Size(121, 21);
            this.Ddl_DefaultEncoding.TabIndex = 27;
            // 
            // label32
            // 
            this.label32.AutoSize = true;
            this.label32.Location = new System.Drawing.Point(24, 23);
            this.label32.Name = "label32";
            this.label32.Size = new System.Drawing.Size(94, 13);
            this.label32.TabIndex = 26;
            this.label32.Text = "Default encoding :";
            // 
            // Cb_ShowWarnBanner
            // 
            this.Cb_ShowWarnBanner.AutoSize = true;
            this.Cb_ShowWarnBanner.Location = new System.Drawing.Point(19, 367);
            this.Cb_ShowWarnBanner.Name = "Cb_ShowWarnBanner";
            this.Cb_ShowWarnBanner.Size = new System.Drawing.Size(511, 17);
            this.Cb_ShowWarnBanner.TabIndex = 25;
            this.Cb_ShowWarnBanner.Text = "Show Warning Banner (This banner is shown at the top of the file when log is part" +
    "ially loaded or filtered)";
            this.Cb_ShowWarnBanner.UseVisualStyleBackColor = true;
            // 
            // label22
            // 
            this.label22.AutoSize = true;
            this.label22.Location = new System.Drawing.Point(165, 428);
            this.label22.Name = "label22";
            this.label22.Size = new System.Drawing.Size(234, 13);
            this.label22.TabIndex = 23;
            this.label22.Text = "logwatcher load only the last XX Mega of the file";
            // 
            // Txt_EofSizeToLoad
            // 
            this.Txt_EofSizeToLoad.AsciiOnly = true;
            this.Txt_EofSizeToLoad.Location = new System.Drawing.Point(123, 425);
            this.Txt_EofSizeToLoad.Mask = "9999";
            this.Txt_EofSizeToLoad.Name = "Txt_EofSizeToLoad";
            this.Txt_EofSizeToLoad.Size = new System.Drawing.Size(36, 20);
            this.Txt_EofSizeToLoad.TabIndex = 22;
            // 
            // label21
            // 
            this.label21.AutoSize = true;
            this.label21.Location = new System.Drawing.Point(19, 428);
            this.label21.Name = "label21";
            this.label21.Size = new System.Drawing.Size(98, 13);
            this.label21.TabIndex = 21;
            this.label21.Text = "Size to load (in MB)";
            // 
            // Cb_LoadOnlyEOF
            // 
            this.Cb_LoadOnlyEOF.AutoSize = true;
            this.Cb_LoadOnlyEOF.Location = new System.Drawing.Point(22, 404);
            this.Cb_LoadOnlyEOF.Name = "Cb_LoadOnlyEOF";
            this.Cb_LoadOnlyEOF.Size = new System.Drawing.Size(121, 17);
            this.Cb_LoadOnlyEOF.TabIndex = 19;
            this.Cb_LoadOnlyEOF.Text = "Load only end of file";
            this.Cb_LoadOnlyEOF.UseVisualStyleBackColor = true;
            // 
            // Btn_ClearSearchHisto
            // 
            this.Btn_ClearSearchHisto.Location = new System.Drawing.Point(23, 168);
            this.Btn_ClearSearchHisto.Name = "Btn_ClearSearchHisto";
            this.Btn_ClearSearchHisto.Size = new System.Drawing.Size(148, 23);
            this.Btn_ClearSearchHisto.TabIndex = 18;
            this.Btn_ClearSearchHisto.Text = "Clear search/Filter Historic";
            this.Btn_ClearSearchHisto.UseVisualStyleBackColor = true;
            this.Btn_ClearSearchHisto.Click += new System.EventHandler(this.Btn_ClearSearchHisto_Click);
            // 
            // Txt_ContextRowNbr
            // 
            this.Txt_ContextRowNbr.AsciiOnly = true;
            this.Txt_ContextRowNbr.Location = new System.Drawing.Point(134, 142);
            this.Txt_ContextRowNbr.Mask = "999";
            this.Txt_ContextRowNbr.Name = "Txt_ContextRowNbr";
            this.Txt_ContextRowNbr.Size = new System.Drawing.Size(38, 20);
            this.Txt_ContextRowNbr.TabIndex = 17;
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(21, 145);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(107, 13);
            this.label14.TabIndex = 15;
            this.label14.Text = "Context row number :";
            // 
            // Lbl_Font
            // 
            this.Lbl_Font.AutoSize = true;
            this.Lbl_Font.Location = new System.Drawing.Point(106, 195);
            this.Lbl_Font.Name = "Lbl_Font";
            this.Lbl_Font.Size = new System.Drawing.Size(28, 13);
            this.Lbl_Font.TabIndex = 14;
            this.Lbl_Font.Text = "Font";
            // 
            // Btn_SelectFont
            // 
            this.Btn_SelectFont.Location = new System.Drawing.Point(24, 209);
            this.Btn_SelectFont.Name = "Btn_SelectFont";
            this.Btn_SelectFont.Size = new System.Drawing.Size(75, 23);
            this.Btn_SelectFont.TabIndex = 13;
            this.Btn_SelectFont.Text = "Select font";
            this.Btn_SelectFont.UseVisualStyleBackColor = true;
            this.Btn_SelectFont.Click += new System.EventHandler(this.Btn_SelectFont_Click);
            // 
            // Cb_SaveLogs
            // 
            this.Cb_SaveLogs.AutoSize = true;
            this.Cb_SaveLogs.Location = new System.Drawing.Point(24, 89);
            this.Cb_SaveLogs.Name = "Cb_SaveLogs";
            this.Cb_SaveLogs.Size = new System.Drawing.Size(459, 17);
            this.Cb_SaveLogs.TabIndex = 12;
            this.Cb_SaveLogs.Text = "Save opened log on close (This option will automatically load all opened file at " +
    "the next start)";
            this.Cb_SaveLogs.UseVisualStyleBackColor = true;
            // 
            // Cb_WrapLine
            // 
            this.Cb_WrapLine.AutoSize = true;
            this.Cb_WrapLine.Location = new System.Drawing.Point(24, 57);
            this.Cb_WrapLine.Name = "Cb_WrapLine";
            this.Cb_WrapLine.Size = new System.Drawing.Size(165, 17);
            this.Cb_WrapLine.TabIndex = 11;
            this.Cb_WrapLine.Text = "Wrap Line (bad Performance)";
            this.Cb_WrapLine.UseVisualStyleBackColor = true;
            this.Cb_WrapLine.Visible = false;
            // 
            // Tp_Alert
            // 
            this.Tp_Alert.Controls.Add(this.groupBox2);
            this.Tp_Alert.Controls.Add(this.groupBox1);
            this.Tp_Alert.Controls.Add(this.label24);
            this.Tp_Alert.Location = new System.Drawing.Point(4, 22);
            this.Tp_Alert.Name = "Tp_Alert";
            this.Tp_Alert.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_Alert.Size = new System.Drawing.Size(784, 585);
            this.Tp_Alert.TabIndex = 2;
            this.Tp_Alert.Text = "Alert";
            this.Tp_Alert.UseVisualStyleBackColor = true;
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.button1);
            this.groupBox2.Controls.Add(this.button2);
            this.groupBox2.Controls.Add(this.button3);
            this.groupBox2.Controls.Add(this.button4);
            this.groupBox2.Controls.Add(this.Dgv_AlertFile);
            this.groupBox2.Controls.Add(this.Btn_BrowseAlertFile);
            this.groupBox2.Controls.Add(this.Txt_BrowseAlertFile);
            this.groupBox2.Controls.Add(this.label34);
            this.groupBox2.Location = new System.Drawing.Point(6, 47);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(770, 194);
            this.groupBox2.TabIndex = 38;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Alert files";
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(292, 37);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(116, 23);
            this.button1.TabIndex = 40;
            this.button1.Text = "Activate all alerts";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.Btn_AlertFile_ActivateAll_Click);
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(170, 37);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(116, 23);
            this.button2.TabIndex = 39;
            this.button2.Text = "Desactivate all alerts";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.Bnt_AlertFile_DesactivateAll_Click);
            // 
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(8, 38);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(75, 23);
            this.button3.TabIndex = 37;
            this.button3.Text = "Add";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.Btn_AddAlertFile_Click);
            // 
            // button4
            // 
            this.button4.Location = new System.Drawing.Point(89, 38);
            this.button4.Name = "button4";
            this.button4.Size = new System.Drawing.Size(75, 23);
            this.button4.TabIndex = 38;
            this.button4.Text = "Delete";
            this.button4.UseVisualStyleBackColor = true;
            this.button4.Click += new System.EventHandler(this.Btn_RemoveAlertFile_Click);
            // 
            // Dgv_AlertFile
            // 
            this.Dgv_AlertFile.AllowUserToAddRows = false;
            this.Dgv_AlertFile.AllowUserToDeleteRows = false;
            this.Dgv_AlertFile.AllowUserToResizeColumns = false;
            this.Dgv_AlertFile.AllowUserToResizeRows = false;
            this.Dgv_AlertFile.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Dgv_AlertFile.AutoGenerateColumns = false;
            this.Dgv_AlertFile.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.Dgv_AlertFile.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.AllCells;
            this.Dgv_AlertFile.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.Dgv_AlertFile.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.actifDataGridViewCheckBoxColumn,
            this.filePathDataGridViewTextBoxColumn});
            this.Dgv_AlertFile.DataSource = this.alertFileBindingSource;
            this.Dgv_AlertFile.EditMode = System.Windows.Forms.DataGridViewEditMode.EditOnEnter;
            this.Dgv_AlertFile.Location = new System.Drawing.Point(8, 67);
            this.Dgv_AlertFile.MultiSelect = false;
            this.Dgv_AlertFile.Name = "Dgv_AlertFile";
            this.Dgv_AlertFile.RowHeadersVisible = false;
            this.Dgv_AlertFile.RowHeadersWidthSizeMode = System.Windows.Forms.DataGridViewRowHeadersWidthSizeMode.DisableResizing;
            this.Dgv_AlertFile.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.Dgv_AlertFile.Size = new System.Drawing.Size(750, 121);
            this.Dgv_AlertFile.TabIndex = 31;
            // 
            // actifDataGridViewCheckBoxColumn
            // 
            this.actifDataGridViewCheckBoxColumn.DataPropertyName = "IsActif";
            this.actifDataGridViewCheckBoxColumn.FillWeight = 10F;
            this.actifDataGridViewCheckBoxColumn.HeaderText = "Actif";
            this.actifDataGridViewCheckBoxColumn.Name = "actifDataGridViewCheckBoxColumn";
            // 
            // filePathDataGridViewTextBoxColumn
            // 
            this.filePathDataGridViewTextBoxColumn.DataPropertyName = "FilePath";
            this.filePathDataGridViewTextBoxColumn.FillWeight = 161.4213F;
            this.filePathDataGridViewTextBoxColumn.HeaderText = "FilePath";
            this.filePathDataGridViewTextBoxColumn.Name = "filePathDataGridViewTextBoxColumn";
            // 
            // alertFileBindingSource
            // 
            this.alertFileBindingSource.DataSource = typeof(LogWatcher.Common.AlertFile);
            // 
            // Btn_BrowseAlertFile
            // 
            this.Btn_BrowseAlertFile.Location = new System.Drawing.Point(731, 10);
            this.Btn_BrowseAlertFile.Name = "Btn_BrowseAlertFile";
            this.Btn_BrowseAlertFile.Size = new System.Drawing.Size(27, 23);
            this.Btn_BrowseAlertFile.TabIndex = 11;
            this.Btn_BrowseAlertFile.Text = "...";
            this.Btn_BrowseAlertFile.UseVisualStyleBackColor = true;
            this.Btn_BrowseAlertFile.Click += new System.EventHandler(this.Btn_BrowseAlertFile_Click);
            // 
            // Txt_BrowseAlertFile
            // 
            this.Txt_BrowseAlertFile.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_BrowseAlertFile.Location = new System.Drawing.Point(40, 12);
            this.Txt_BrowseAlertFile.Name = "Txt_BrowseAlertFile";
            this.Txt_BrowseAlertFile.Size = new System.Drawing.Size(691, 20);
            this.Txt_BrowseAlertFile.TabIndex = 2;
            // 
            // label34
            // 
            this.label34.AutoSize = true;
            this.label34.Location = new System.Drawing.Point(5, 15);
            this.label34.Name = "label34";
            this.label34.Size = new System.Drawing.Size(29, 13);
            this.label34.TabIndex = 3;
            this.label34.Text = "File :";
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.label35);
            this.groupBox1.Controls.Add(this.Txt_AlertSearchText);
            this.groupBox1.Controls.Add(this.Btn_Alert_ActivateAll);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.Btn_Alert_DesactivateAll);
            this.groupBox1.Controls.Add(this.Txt_AlertMessage);
            this.groupBox1.Controls.Add(this.Dgv_Alert);
            this.groupBox1.Controls.Add(this.label4);
            this.groupBox1.Controls.Add(this.Btn_AddAlert);
            this.groupBox1.Controls.Add(this.Btn_RemoveAlert);
            this.groupBox1.Location = new System.Drawing.Point(6, 247);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(770, 332);
            this.groupBox1.TabIndex = 37;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Alert Condition";
            // 
            // label35
            // 
            this.label35.AutoSize = true;
            this.label35.Location = new System.Drawing.Point(516, 76);
            this.label35.Name = "label35";
            this.label35.Size = new System.Drawing.Size(248, 13);
            this.label35.TabIndex = 37;
            this.label35.Text = "Alert are regular expresssion and not case sensitive";
            // 
            // Txt_AlertSearchText
            // 
            this.Txt_AlertSearchText.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_AlertSearchText.Location = new System.Drawing.Point(81, 19);
            this.Txt_AlertSearchText.Name = "Txt_AlertSearchText";
            this.Txt_AlertSearchText.Size = new System.Drawing.Size(683, 20);
            this.Txt_AlertSearchText.TabIndex = 0;
            // 
            // Btn_Alert_ActivateAll
            // 
            this.Btn_Alert_ActivateAll.Location = new System.Drawing.Point(365, 71);
            this.Btn_Alert_ActivateAll.Name = "Btn_Alert_ActivateAll";
            this.Btn_Alert_ActivateAll.Size = new System.Drawing.Size(116, 23);
            this.Btn_Alert_ActivateAll.TabIndex = 36;
            this.Btn_Alert_ActivateAll.Text = "Activate all alerts";
            this.Btn_Alert_ActivateAll.UseVisualStyleBackColor = true;
            this.Btn_Alert_ActivateAll.Click += new System.EventHandler(this.Btn_Alert_ActivateAll_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(9, 22);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(71, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "Search Text :";
            // 
            // Btn_Alert_DesactivateAll
            // 
            this.Btn_Alert_DesactivateAll.Location = new System.Drawing.Point(243, 71);
            this.Btn_Alert_DesactivateAll.Name = "Btn_Alert_DesactivateAll";
            this.Btn_Alert_DesactivateAll.Size = new System.Drawing.Size(116, 23);
            this.Btn_Alert_DesactivateAll.TabIndex = 35;
            this.Btn_Alert_DesactivateAll.Text = "Desactivate all alerts";
            this.Btn_Alert_DesactivateAll.UseVisualStyleBackColor = true;
            this.Btn_Alert_DesactivateAll.Click += new System.EventHandler(this.Bnt_Alert_DesactivateAll_Click);
            // 
            // Txt_AlertMessage
            // 
            this.Txt_AlertMessage.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_AlertMessage.Location = new System.Drawing.Point(81, 45);
            this.Txt_AlertMessage.Name = "Txt_AlertMessage";
            this.Txt_AlertMessage.Size = new System.Drawing.Size(683, 20);
            this.Txt_AlertMessage.TabIndex = 2;
            // 
            // Dgv_Alert
            // 
            this.Dgv_Alert.AllowUserToAddRows = false;
            this.Dgv_Alert.AllowUserToDeleteRows = false;
            this.Dgv_Alert.AllowUserToResizeColumns = false;
            this.Dgv_Alert.AllowUserToResizeRows = false;
            this.Dgv_Alert.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Dgv_Alert.AutoGenerateColumns = false;
            this.Dgv_Alert.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.Dgv_Alert.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.AllCells;
            this.Dgv_Alert.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.Dgv_Alert.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.isActifDataGridViewCheckBoxColumn1,
            this.searchTextDataGridViewTextBoxColumn,
            this.messageDataGridViewTextBoxColumn});
            this.Dgv_Alert.DataSource = this.alertInfoBindingSource;
            this.Dgv_Alert.EditMode = System.Windows.Forms.DataGridViewEditMode.EditOnEnter;
            this.Dgv_Alert.Location = new System.Drawing.Point(6, 101);
            this.Dgv_Alert.MultiSelect = false;
            this.Dgv_Alert.Name = "Dgv_Alert";
            this.Dgv_Alert.RowHeadersVisible = false;
            this.Dgv_Alert.RowHeadersWidthSizeMode = System.Windows.Forms.DataGridViewRowHeadersWidthSizeMode.DisableResizing;
            this.Dgv_Alert.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.Dgv_Alert.Size = new System.Drawing.Size(758, 225);
            this.Dgv_Alert.TabIndex = 30;
            // 
            // isActifDataGridViewCheckBoxColumn1
            // 
            this.isActifDataGridViewCheckBoxColumn1.DataPropertyName = "IsActif";
            this.isActifDataGridViewCheckBoxColumn1.FillWeight = 13.0032F;
            this.isActifDataGridViewCheckBoxColumn1.HeaderText = "Actif";
            this.isActifDataGridViewCheckBoxColumn1.Name = "isActifDataGridViewCheckBoxColumn1";
            // 
            // searchTextDataGridViewTextBoxColumn
            // 
            this.searchTextDataGridViewTextBoxColumn.DataPropertyName = "SearchText";
            this.searchTextDataGridViewTextBoxColumn.FillWeight = 121.58F;
            this.searchTextDataGridViewTextBoxColumn.HeaderText = "Search Text";
            this.searchTextDataGridViewTextBoxColumn.Name = "searchTextDataGridViewTextBoxColumn";
            // 
            // messageDataGridViewTextBoxColumn
            // 
            this.messageDataGridViewTextBoxColumn.DataPropertyName = "Message";
            this.messageDataGridViewTextBoxColumn.FillWeight = 121.58F;
            this.messageDataGridViewTextBoxColumn.HeaderText = "Alert message";
            this.messageDataGridViewTextBoxColumn.Name = "messageDataGridViewTextBoxColumn";
            // 
            // alertInfoBindingSource
            // 
            this.alertInfoBindingSource.AllowNew = true;
            this.alertInfoBindingSource.DataSource = typeof(LogWatcher.Common.AlertInfo);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(1, 48);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(79, 13);
            this.label4.TabIndex = 3;
            this.label4.Text = "Alert message :";
            // 
            // Btn_AddAlert
            // 
            this.Btn_AddAlert.Location = new System.Drawing.Point(81, 72);
            this.Btn_AddAlert.Name = "Btn_AddAlert";
            this.Btn_AddAlert.Size = new System.Drawing.Size(75, 23);
            this.Btn_AddAlert.TabIndex = 5;
            this.Btn_AddAlert.Text = "Add";
            this.Btn_AddAlert.UseVisualStyleBackColor = true;
            this.Btn_AddAlert.Click += new System.EventHandler(this.Btn_AddAlert_Click);
            // 
            // Btn_RemoveAlert
            // 
            this.Btn_RemoveAlert.Location = new System.Drawing.Point(162, 72);
            this.Btn_RemoveAlert.Name = "Btn_RemoveAlert";
            this.Btn_RemoveAlert.Size = new System.Drawing.Size(75, 23);
            this.Btn_RemoveAlert.TabIndex = 6;
            this.Btn_RemoveAlert.Text = "Delete";
            this.Btn_RemoveAlert.UseVisualStyleBackColor = true;
            this.Btn_RemoveAlert.Click += new System.EventHandler(this.Btn_RemoveAlert_Click);
            // 
            // label24
            // 
            this.label24.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label24.Location = new System.Drawing.Point(9, 7);
            this.label24.Name = "label24";
            this.label24.Size = new System.Drawing.Size(767, 36);
            this.label24.TabIndex = 7;
            this.label24.Text = resources.GetString("label24.Text");
            // 
            // Tp_Plugin
            // 
            this.Tp_Plugin.Controls.Add(this.label20);
            this.Tp_Plugin.Controls.Add(this.Dfv_Plugin);
            this.Tp_Plugin.Controls.Add(this.Btn_PluginAdd);
            this.Tp_Plugin.Controls.Add(this.Txt_PluginTypeName);
            this.Tp_Plugin.Controls.Add(this.Txt_PluginName);
            this.Tp_Plugin.Controls.Add(this.label19);
            this.Tp_Plugin.Controls.Add(this.label18);
            this.Tp_Plugin.Location = new System.Drawing.Point(4, 22);
            this.Tp_Plugin.Name = "Tp_Plugin";
            this.Tp_Plugin.Padding = new System.Windows.Forms.Padding(3);
            this.Tp_Plugin.Size = new System.Drawing.Size(784, 585);
            this.Tp_Plugin.TabIndex = 5;
            this.Tp_Plugin.Text = "Plugin";
            this.Tp_Plugin.UseVisualStyleBackColor = true;
            // 
            // label20
            // 
            this.label20.AutoSize = true;
            this.label20.Location = new System.Drawing.Point(-3, 69);
            this.label20.Name = "label20";
            this.label20.Size = new System.Drawing.Size(163, 13);
            this.label20.TabIndex = 6;
            this.label20.Text = " (ex : \"Full name type, assembly\")";
            // 
            // Dfv_Plugin
            // 
            this.Dfv_Plugin.AllowUserToAddRows = false;
            this.Dfv_Plugin.AllowUserToResizeRows = false;
            this.Dfv_Plugin.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Dfv_Plugin.AutoGenerateColumns = false;
            this.Dfv_Plugin.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.Dfv_Plugin.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.Dfv_Plugin.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.textDataGridViewTextBoxColumn2,
            this.typeNameDataGridViewTextBoxColumn});
            this.Dfv_Plugin.DataSource = this.pluginBindingSource;
            this.Dfv_Plugin.EditMode = System.Windows.Forms.DataGridViewEditMode.EditOnEnter;
            this.Dfv_Plugin.Location = new System.Drawing.Point(9, 126);
            this.Dfv_Plugin.MultiSelect = false;
            this.Dfv_Plugin.Name = "Dfv_Plugin";
            this.Dfv_Plugin.RowHeadersVisible = false;
            this.Dfv_Plugin.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.Dfv_Plugin.Size = new System.Drawing.Size(769, 453);
            this.Dfv_Plugin.TabIndex = 5;
            // 
            // textDataGridViewTextBoxColumn2
            // 
            this.textDataGridViewTextBoxColumn2.DataPropertyName = "Text";
            this.textDataGridViewTextBoxColumn2.HeaderText = "Text";
            this.textDataGridViewTextBoxColumn2.Name = "textDataGridViewTextBoxColumn2";
            this.textDataGridViewTextBoxColumn2.ReadOnly = true;
            // 
            // typeNameDataGridViewTextBoxColumn
            // 
            this.typeNameDataGridViewTextBoxColumn.DataPropertyName = "TypeName";
            this.typeNameDataGridViewTextBoxColumn.HeaderText = "TypeName";
            this.typeNameDataGridViewTextBoxColumn.Name = "typeNameDataGridViewTextBoxColumn";
            this.typeNameDataGridViewTextBoxColumn.ReadOnly = true;
            // 
            // pluginBindingSource
            // 
            this.pluginBindingSource.DataSource = typeof(LogWatcher.Common.Plugin);
            // 
            // Btn_PluginAdd
            // 
            this.Btn_PluginAdd.Location = new System.Drawing.Point(9, 96);
            this.Btn_PluginAdd.Name = "Btn_PluginAdd";
            this.Btn_PluginAdd.Size = new System.Drawing.Size(75, 23);
            this.Btn_PluginAdd.TabIndex = 4;
            this.Btn_PluginAdd.Text = "Add";
            this.Btn_PluginAdd.UseVisualStyleBackColor = true;
            this.Btn_PluginAdd.Click += new System.EventHandler(this.Btn_PluginAdd_Click);
            // 
            // Txt_PluginTypeName
            // 
            this.Txt_PluginTypeName.Location = new System.Drawing.Point(165, 46);
            this.Txt_PluginTypeName.Name = "Txt_PluginTypeName";
            this.Txt_PluginTypeName.Size = new System.Drawing.Size(611, 20);
            this.Txt_PluginTypeName.TabIndex = 3;
            // 
            // Txt_PluginName
            // 
            this.Txt_PluginName.Location = new System.Drawing.Point(166, 22);
            this.Txt_PluginName.Name = "Txt_PluginName";
            this.Txt_PluginName.Size = new System.Drawing.Size(610, 20);
            this.Txt_PluginName.TabIndex = 2;
            // 
            // label19
            // 
            this.label19.AutoSize = true;
            this.label19.Location = new System.Drawing.Point(92, 49);
            this.label19.Name = "label19";
            this.label19.Size = new System.Drawing.Size(68, 13);
            this.label19.TabIndex = 1;
            this.label19.Text = "Type Name :";
            // 
            // label18
            // 
            this.label18.AutoSize = true;
            this.label18.Location = new System.Drawing.Point(36, 25);
            this.label18.Name = "label18";
            this.label18.Size = new System.Drawing.Size(124, 13);
            this.label18.TabIndex = 0;
            this.label18.Text = "Name (Display in menu) :";
            // 
            // ProfileHiddenLogBindingSource
            // 
            this.ProfileHiddenLogBindingSource.DataSource = typeof(string);
            // 
            // Btn_Ok
            // 
            this.Btn_Ok.Location = new System.Drawing.Point(632, 633);
            this.Btn_Ok.Name = "Btn_Ok";
            this.Btn_Ok.Size = new System.Drawing.Size(75, 23);
            this.Btn_Ok.TabIndex = 1;
            this.Btn_Ok.Text = "OK";
            this.Btn_Ok.UseVisualStyleBackColor = true;
            this.Btn_Ok.Click += new System.EventHandler(this.Btn_Ok_Click);
            // 
            // Btn_Cancel
            // 
            this.Btn_Cancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.Btn_Cancel.Location = new System.Drawing.Point(713, 633);
            this.Btn_Cancel.Name = "Btn_Cancel";
            this.Btn_Cancel.Size = new System.Drawing.Size(75, 23);
            this.Btn_Cancel.TabIndex = 2;
            this.Btn_Cancel.Text = "Cancel";
            this.Btn_Cancel.UseVisualStyleBackColor = true;
            this.Btn_Cancel.Click += new System.EventHandler(this.Btn_Cancel_Click);
            // 
            // Tt_Help
            // 
            this.Tt_Help.AutoPopDelay = 60000;
            this.Tt_Help.InitialDelay = 500;
            this.Tt_Help.IsBalloon = true;
            this.Tt_Help.ReshowDelay = 100;
            this.Tt_Help.ShowAlways = true;
            this.Tt_Help.ToolTipIcon = System.Windows.Forms.ToolTipIcon.Info;
            this.Tt_Help.ToolTipTitle = "Logwatcher Help";
            this.Tt_Help.UseAnimation = false;
            this.Tt_Help.UseFading = false;
            // 
            // Frm_Config
            // 
            this.AcceptButton = this.Btn_Ok;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.Btn_Cancel;
            this.ClientSize = new System.Drawing.Size(792, 668);
            this.Controls.Add(this.Btn_Cancel);
            this.Controls.Add(this.Btn_Ok);
            this.Controls.Add(Tabs_Config);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Frm_Config";
            this.ShowIcon = false;
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Configuration";
            this.Shown += new System.EventHandler(this.Frm_Config_Shown);
            Tabs_Config.ResumeLayout(false);
            this.Tp_Profile.ResumeLayout(false);
            this.Pnl_ProfileCommon.ResumeLayout(false);
            this.Pnl_ProfileCommon.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.profileBindingSource)).EndInit();
            this.Tab_Profile.ResumeLayout(false);
            this.Tp_ProfileHighlighting.ResumeLayout(false);
            this.Tp_ProfileHighlighting.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.ProfileHighlightingBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_Profile)).EndInit();
            this.Tp_ProfileHiddenLog.ResumeLayout(false);
            this.Tp_ProfileHiddenLog.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_HiddenLines)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.hiddenLineBindingSource)).EndInit();
            this.Tp_ProfileStoredFilter.ResumeLayout(false);
            this.Tp_ProfileStoredFilter.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.storedFilterBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_StoredFilters)).EndInit();
            this.Tp_Level.ResumeLayout(false);
            this.Tp_Level.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.highlightingBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_Level)).EndInit();
            this.Tp_LogBrowser.ResumeLayout(false);
            this.Tab_LogBrowser.ResumeLayout(false);
            this.Tp_RealDir.ResumeLayout(false);
            this.Tp_RealDir.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_Lb_RealDir)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.logBrowserItemBindingSource)).EndInit();
            this.Tp_VirtualDir.ResumeLayout(false);
            this.Tp_VirtualDir.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_LB_VirtualFile)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.logBrowserVirtualFileBindingSource)).EndInit();
            this.Tp_Option.ResumeLayout(false);
            this.Tp_Option.PerformLayout();
            this.groupBox5.ResumeLayout(false);
            this.groupBox5.PerformLayout();
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            this.Tp_Alert.ResumeLayout(false);
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_AlertFile)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.alertFileBindingSource)).EndInit();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_Alert)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.alertInfoBindingSource)).EndInit();
            this.Tp_Plugin.ResumeLayout(false);
            this.Tp_Plugin.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Dfv_Plugin)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pluginBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.ProfileHiddenLogBindingSource)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TabPage Tp_Level;
        private System.Windows.Forms.TabPage Tp_Profile;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox Txt_LevelText;
        private System.Windows.Forms.Label Lbl_Text;
        private System.Windows.Forms.Button Btn_LevelForeColor;
        private System.Windows.Forms.ColorDialog colorDialog1;
        private System.Windows.Forms.Button Btn_LevelBackColor;
        private System.Windows.Forms.Label Lbl_LevelApercu;
        private System.Windows.Forms.Button Btn_LevelAdd;
        private System.Windows.Forms.DataGridView Dgv_Level;
        private System.Windows.Forms.Button Btn_LevelUp;
        private System.Windows.Forms.Button Btn_LevelDown;
        private System.Windows.Forms.Button Btn_LevelDelete;
        private System.Windows.Forms.Button Btn_Ok;
        private System.Windows.Forms.Button Btn_Cancel;
        private System.Windows.Forms.CheckBox Cb_LevelCase;
        private System.Windows.Forms.BindingSource highlightingBindingSource;
        private System.Windows.Forms.TabPage Tp_Alert;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox Txt_AlertMessage;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button Btn_AddAlert;
        private System.Windows.Forms.BindingSource alertInfoBindingSource;
        private System.Windows.Forms.TextBox Txt_AlertSearchText;
        private System.Windows.Forms.Button Btn_RemoveAlert;
        private System.Windows.Forms.TabPage Tp_Option;
        private System.Windows.Forms.CheckBox Cb_ProfileCase;
        private System.Windows.Forms.DataGridView Dgv_Profile;
        private System.Windows.Forms.Button Btn_ProfileDeleteHighlight;
        private System.Windows.Forms.Button Btn_ProfileUp;
        private System.Windows.Forms.TextBox Txt_ProfileText;
        private System.Windows.Forms.Button Btn_ProfileDown;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Button Btn_ProfileAddHighlight;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label Lbl_ProfileApercu;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Button Btn_ProfileBackColor;
        private System.Windows.Forms.Button Btn_ProfileForeColor;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.ComboBox Ddl_ProfileName;
        private System.Windows.Forms.BindingSource ProfileHighlightingBindingSource;
        private System.Windows.Forms.Button Btn_AddProfile;
        private System.Windows.Forms.Button Btn_RemoveProfile;
        private System.Windows.Forms.CheckBox Cb_HighPriority;
        private System.Windows.Forms.CheckBox Cb_WrapLine;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.TextBox Txt_FileName;
        private System.Windows.Forms.Button Btn_Browse;
        private System.Windows.Forms.TabControl Tab_Profile;
        private System.Windows.Forms.TabPage Tp_ProfileHighlighting;
        private System.Windows.Forms.TabPage Tp_ProfileHiddenLog;
        private System.Windows.Forms.Panel Pnl_ProfileCommon;
        private System.Windows.Forms.Button Btn_AddHiddenLog;
        private System.Windows.Forms.Button Btn_DelHiddenLog;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.TextBox Txt_ProfileHiddenLog;
        private System.Windows.Forms.BindingSource profileBindingSource;
        private System.Windows.Forms.BindingSource ProfileHiddenLogBindingSource;
        private System.Windows.Forms.CheckBox Cb_SaveLogs;
        private System.Windows.Forms.Button Btn_SelectFont;
        private System.Windows.Forms.Label Lbl_Font;
        private System.Windows.Forms.Button Btn_SaveProfile;
        private System.Windows.Forms.Button Btn_LoadProfile;
        private System.Windows.Forms.TabPage Tp_LogBrowser;
        private System.Windows.Forms.Button Btn_LogBrowserDir;
        private System.Windows.Forms.TextBox Txt_LogBrowserName;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.TextBox Txt_LogBrowserFilter;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.DataGridView Dgv_Lb_RealDir;
        private System.Windows.Forms.BindingSource logBrowserItemBindingSource;
        private System.Windows.Forms.DataGridViewTextBoxColumn pathDataGridViewTextBoxColumn;
        private System.Windows.Forms.Button Btn_LogBrowserAdd;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.MaskedTextBox Txt_ContextRowNbr;
        private System.Windows.Forms.TextBox Txt_LogBrowserDir;
        private System.Windows.Forms.TabControl Tab_LogBrowser;
        private System.Windows.Forms.TabPage Tp_RealDir;
        private System.Windows.Forms.TabPage Tp_VirtualDir;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.Button Btn_LB_DeleteVirtualDir;
        private System.Windows.Forms.Button Btn_LB_AddVirtualDir;
        private System.Windows.Forms.ComboBox Ddl_LB_VirtualDir;
        private System.Windows.Forms.DataGridView Dgv_LB_VirtualFile;
        private System.Windows.Forms.BindingSource logBrowserVirtualFileBindingSource;
        private System.Windows.Forms.Label label17;
        private System.Windows.Forms.Label label16;
        private System.Windows.Forms.Button Btn_LB_AddVirtualFile;
        private System.Windows.Forms.TextBox Txt_LB_FileName;
        private System.Windows.Forms.TextBox Txt_LB_FilePath;
        private System.Windows.Forms.Button Btn_LB_Path;
        private System.Windows.Forms.TabPage Tp_Plugin;
        private System.Windows.Forms.Label label18;
        private System.Windows.Forms.DataGridView Dfv_Plugin;
        private System.Windows.Forms.DataGridViewTextBoxColumn textDataGridViewTextBoxColumn2;
        private System.Windows.Forms.DataGridViewTextBoxColumn typeNameDataGridViewTextBoxColumn;
        private System.Windows.Forms.BindingSource pluginBindingSource;
        private System.Windows.Forms.Button Btn_PluginAdd;
        private System.Windows.Forms.TextBox Txt_PluginTypeName;
        private System.Windows.Forms.TextBox Txt_PluginName;
        private System.Windows.Forms.Label label19;
        private System.Windows.Forms.Label label20;
        private System.Windows.Forms.Button Btn_ClearSearchHisto;
        private System.Windows.Forms.MaskedTextBox Txt_EofSizeToLoad;
        private System.Windows.Forms.Label label21;
        private System.Windows.Forms.CheckBox Cb_LoadOnlyEOF;
        private System.Windows.Forms.Label label22;
        private System.Windows.Forms.CheckBox Cb_ShowWarnBanner;
        private System.Windows.Forms.Label label23;
        private System.Windows.Forms.Button Btn_LB_DelVirtualFile;
        private System.Windows.Forms.Button Btn_LB_DelRealDir;
        private System.Windows.Forms.CheckBox Cb_LHL_Bold;
        private System.Windows.Forms.CheckBox Cb_PHL_Bold;
        private System.Windows.Forms.DataGridViewTextBoxColumn Selection;
        private System.Windows.Forms.DataGridViewTextBoxColumn orderDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn textDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn backColorDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewCheckBoxColumn caseSensitiveDataGridViewCheckBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn foreColorDataGridViewTextBoxColumn;
        private System.Windows.Forms.ToolTip Tt_Help;
        private System.Windows.Forms.Label label24;
        private System.Windows.Forms.Label label25;
        private System.Windows.Forms.Label label26;
        private System.Windows.Forms.Label label27;
        private System.Windows.Forms.Label label28;
        private System.Windows.Forms.TabPage Tp_ProfileStoredFilter;
        private System.Windows.Forms.Label label31;
        private System.Windows.Forms.Label label30;
        private System.Windows.Forms.Label label29;
        private System.Windows.Forms.Button Btn_ProfileAddStoredFilter;
        private System.Windows.Forms.Button Btn_ProfileDeleteStoredFilter;
        private System.Windows.Forms.BindingSource storedFilterBindingSource;
        private System.Windows.Forms.TextBox Txt_ProfileFilter;
        private System.Windows.Forms.TextBox Txt_ProfileFilterName;
        private System.Windows.Forms.DataGridView Dgv_StoredFilters;
        private System.Windows.Forms.DataGridViewTextBoxColumn nameDataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewTextBoxColumn pathDataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewTextBoxColumn profileDgvOrderColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn textDataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewTextBoxColumn foreColorDataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewTextBoxColumn backColorDataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewCheckBoxColumn caseSensitiveDataGridViewCheckBoxColumn1;
        private System.Windows.Forms.DataGridViewCheckBoxColumn hightPriorityDataGridViewCheckBoxColumn;
        private System.Windows.Forms.CheckBox Cb_PHL_Regex;
        private System.Windows.Forms.CheckBox Cb_Level_Regex;
        private System.Windows.Forms.DataGridView Dgv_HiddenLines;
        private System.Windows.Forms.BindingSource hiddenLineBindingSource;
        private System.Windows.Forms.CheckBox Cb_PHid_Actif;
        private System.Windows.Forms.CheckBox Cb_PHid_Regex;
        private System.Windows.Forms.CheckBox Cb_PHid_CaseSensitive;
        private System.Windows.Forms.CheckBox Cb_Psf_Regex;
        private System.Windows.Forms.CheckBox Cb_Psf_CaseSensitive;
        private System.Windows.Forms.Button Bnt_Phid_DesactivateAll;
        private System.Windows.Forms.DataGridView Dgv_Alert;
        private System.Windows.Forms.DataGridViewCheckBoxColumn isActifDataGridViewCheckBoxColumn1;
        private System.Windows.Forms.DataGridViewTextBoxColumn searchTextDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn messageDataGridViewTextBoxColumn;
        private System.Windows.Forms.Button Btn_Alert_DesactivateAll;
        private System.Windows.Forms.Button Btn_Alert_ActivateAll;
        private System.Windows.Forms.Button Bnt_Phid_ActivateAll;
        private System.Windows.Forms.ComboBox Ddl_DefaultEncoding;
        private System.Windows.Forms.Label label32;
        private System.Windows.Forms.ComboBox Ddl_ProfileEncoding;
        private System.Windows.Forms.Label label33;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.TextBox Txt_BrowseAlertFile;
        private System.Windows.Forms.Label label34;
        private System.Windows.Forms.Button Btn_BrowseAlertFile;
        private System.Windows.Forms.BindingSource alertFileBindingSource;
        private System.Windows.Forms.DataGridView Dgv_AlertFile;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.Button button3;
        private System.Windows.Forms.Button button4;
        private System.Windows.Forms.DataGridViewCheckBoxColumn actifDataGridViewCheckBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn filePathDataGridViewTextBoxColumn;
        private System.Windows.Forms.Label label35;
        private System.Windows.Forms.Label label36;
        private System.Windows.Forms.MaskedTextBox Txt_MaxSizeToPrompt;
        private System.Windows.Forms.Label label38;
        private System.Windows.Forms.MaskedTextBox Txt_LogBrowserNumDays;
        private System.Windows.Forms.Label label37;
        private System.Windows.Forms.DataGridViewTextBoxColumn nameDataGridViewTextBoxColumn2;
        private System.Windows.Forms.DataGridViewTextBoxColumn filterDataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewCheckBoxColumn IsRegex;
        private System.Windows.Forms.DataGridViewCheckBoxColumn dataGridViewCheckBoxColumn1;
        private System.Windows.Forms.DataGridViewCheckBoxColumn isActifDataGridViewCheckBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn textDataGridViewTextBoxColumn3;
        private System.Windows.Forms.DataGridViewCheckBoxColumn CaseSensitive;
        private System.Windows.Forms.DataGridViewCheckBoxColumn isRegexDataGridViewCheckBoxColumn;
        private System.Windows.Forms.CheckBox Cb_SingleInstance;
        private System.Windows.Forms.DataGridViewTextBoxColumn nameDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn filterDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn Path;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.RadioButton Rb_ContextView;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.RadioButton Rb_DetailView;
        private System.Windows.Forms.TextBox Txt_CmdOpenFile;
        private System.Windows.Forms.Label label39;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.TextBox Txt_SharedFolder;
        private System.Windows.Forms.Button Btn_BrowseSharedFolder;
        private System.Windows.Forms.GroupBox groupBox5;
        private System.Windows.Forms.Label Lbl_SharedProfile;
    }
}