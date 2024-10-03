using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.IO;
using SerializerTools;
using LogWatcher.Common;
using System.Text.RegularExpressions;
using System.Collections;

namespace LogWatcher.Frm
{
    public partial class Frm_Config : Form
    {
        #region Fields

        private const int COLUMN_HIGHLIGHT = 2;
        //private bool _hiddenLogIsModified;
        private readonly SortableBindingList<Highlighting> _levelHighlightings = new SortableBindingList<Highlighting>();
        private SortableBindingList<Highlighting> _currentProfileHighlightings = new SortableBindingList<Highlighting>();
        private BindingList<HiddenLine> _currentProfileHiddenLog = new BindingList<HiddenLine>();
        private SortableBindingList<StoredFilter> _currentProfileStoredFilter = new SortableBindingList<StoredFilter>();
        private readonly SortableBindingList<Profile> _allProfile = new SortableBindingList<Profile>();

        private readonly BindingList<Plugin> _allPlugin = new BindingList<Plugin>();

        private readonly SortableBindingList<AlertInfo> _alertBinding = new SortableBindingList<AlertInfo>();
        private readonly SortableBindingList<AlertFile> _alertFileBinding = new SortableBindingList<AlertFile>();

        private readonly SortableBindingList<LogBrowserItem> _logBrowserRealDir = new SortableBindingList<LogBrowserItem>();
        private SortableBindingList<LogBrowserVirtualFile> _currentVirtualDir = new SortableBindingList<LogBrowserVirtualFile>();
        private readonly SortableBindingList<string> _logBrowserVirtualDir = new SortableBindingList<string>();
        private readonly SortedDictionary<string, SortableBindingList<LogBrowserVirtualFile>> _logBrowserAllVirtualDir = new SortedDictionary<string, SortableBindingList<LogBrowserVirtualFile>>();

        private SimpleFont _selectedFont = new SimpleFont("Courier New", 9, FontStyle.Regular);

        #endregion

        #region Properties

        public Profile CurrentProfile
        {
            get
            {
                if (Ddl_ProfileName.SelectedIndex > -1)
                {
                    return _allProfile[Ddl_ProfileName.SelectedIndex];
                }
                
                return new Profile();
            }
        }

        #endregion

        #region Constructor

        public Frm_Config()
        {
            InitializeComponent();
            ApplyDarkMode(this.Controls);

            foreach (Highlighting highLight in LogConfig.Singleton.DicoHighlighting)
                _levelHighlightings.Add(highLight.Clone());

            foreach (Profile profileTmp in LogConfig.Singleton.DicoProfile.Values)
                _allProfile.Add(profileTmp.Clone());

            _allProfile.Sort(Profile.Compare);

            foreach (AlertInfo alert in LogConfig.Singleton.DicoAlert)
                _alertBinding.Add(alert.Clone());

            foreach (AlertFile alert in LogConfig.Singleton.DicoAlertFile)
                _alertFileBinding.Add(alert.Clone());

            foreach (Plugin pluginTmp in LogConfig.Singleton.DicoPlugin.Values)
                _allPlugin.Add(pluginTmp.Clone());

            foreach (LogBrowserItem item in LogConfig.Singleton.LogBrowser.RealDirectories)
                _logBrowserRealDir.Add(item.Clone());

            _logBrowserRealDir.Sort(LogBrowserItem.Compare);

            foreach (KeyValuePair<string, List<LogBrowserVirtualFile>> item in LogConfig.Singleton.LogBrowser.VirtualDirectories)
            {
                SortableBindingList<LogBrowserVirtualFile> mstTmp = new SortableBindingList<LogBrowserVirtualFile>();
                foreach (LogBrowserVirtualFile virtualFile in item.Value)
                    mstTmp.Add(virtualFile.Clone());

                mstTmp.Sort(LogBrowserVirtualFile.Compare);

                _logBrowserAllVirtualDir.Add(item.Key, mstTmp);
                _logBrowserVirtualDir.Add(item.Key);
            }


            // for simple config
            Cb_WrapLine.Checked = LogConfig.Singleton.WrapLine;
            Cb_SaveLogs.Checked = LogConfig.Singleton.SaveLogsOnClose;
            Cb_SingleInstance.Checked = LogConfig.Singleton.IsSingleInstance;
            Txt_ContextRowNbr.Text = LogConfig.Singleton.ContextRowNbr == 0 ? "30" : LogConfig.Singleton.ContextRowNbr.ToString();

            Rb_ContextView.Checked = LogConfig.Singleton.DoubleClickAction == DoubleClickActions.ContextView;
            Rb_DetailView.Checked = LogConfig.Singleton.DoubleClickAction == DoubleClickActions.DetailView;

            Txt_EofSizeToLoad.Text = LogConfig.Singleton.EofSizeToLoad.ToString();
            Txt_MaxSizeToPrompt.Text = LogConfig.Singleton.MaxSizeToPrompt.ToString();
            Cb_LoadOnlyEOF.Checked = LogConfig.Singleton.LoadOnlyEof;
            Cb_ShowWarnBanner.Checked = LogConfig.Singleton.ShowWarnBanner;
            Ddl_DefaultEncoding.Text = LogConfig.Singleton.DefaultEncoding;
            Txt_LogBrowserNumDays.Text = LogConfig.Singleton.ShowOnlyLogBrowserFileNumDays.ToString();
            Txt_SharedFolder.Text = LogConfig.Singleton.ProfileFolderShared;
            _selectedFont = LogConfig.Singleton.DefaultFont ?? _selectedFont;
            Lbl_Font.Text = String.Format("Name : {0}\r\n" +
                                          "   Size : {1}\r\n" +
                                          "  Style : {2}", _selectedFont.Name, _selectedFont.Size, _selectedFont.Style);


            //we bind all data source
            Ddl_LB_VirtualDir.DataSource = _logBrowserVirtualDir;
            logBrowserVirtualFileBindingSource.DataSource = _currentVirtualDir;
            logBrowserItemBindingSource.DataSource = _logBrowserRealDir;
            alertInfoBindingSource.DataSource = _alertBinding;
            alertFileBindingSource.DataSource = _alertFileBinding;
            highlightingBindingSource.DataSource = _levelHighlightings;
            profileBindingSource.DataSource = _allProfile;
            pluginBindingSource.DataSource = _allPlugin;
        }

        #endregion

        #region Events 

        #region Level Highlighting Tab

        private void Dgv_Base_RowPrePaint(object sender, DataGridViewRowPrePaintEventArgs e)
        {
            if (e.RowIndex > -1)
            {
                Highlighting tmp = (Highlighting)Dgv_Level.Rows[e.RowIndex].DataBoundItem;
                Dgv_Level.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.BackColor = tmp.BackColor;
                Dgv_Level.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.ForeColor = tmp.ForeColor;
                Dgv_Level.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.Font = new Font(LogConfig.Singleton.DefaultFont.GetFont(), tmp.Bold ? FontStyle.Bold : FontStyle.Regular);

                Dgv_Level.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.SelectionBackColor = tmp.BackColor;
                Dgv_Level.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.SelectionForeColor = tmp.ForeColor;
            }
        }

        private void Btn_ForeColor_Click(object sender, EventArgs e)
        {
            if (colorDialog1.ShowDialog(this) == DialogResult.OK)
            {
                Lbl_LevelApercu.ForeColor = colorDialog1.Color;
            }
        }

        private void Btn_BackColor_Click(object sender, EventArgs e)
        {
            if (colorDialog1.ShowDialog(this) == DialogResult.OK)
            {
                Lbl_LevelApercu.BackColor = colorDialog1.Color;
            }
        }

        private void Btn_Add_Click(object sender, EventArgs e)
        {
            if (Lbl_LevelApercu.ForeColor.A == 0)
                Lbl_LevelApercu.ForeColor = Color.Black;

            if (Lbl_LevelApercu.BackColor.A == 0)
                Lbl_LevelApercu.BackColor = Color.White;

            int selectedIndex = 0;
            if (Dgv_Level.SelectedRows.Count > 0)
            {
                selectedIndex = Dgv_Level.SelectedRows[0].Index;
            }

            _levelHighlightings.Insert(selectedIndex, new Highlighting(
                                                          selectedIndex + 1, Txt_LevelText.Text, Lbl_LevelApercu.ForeColor, Lbl_LevelApercu.BackColor, Cb_LevelCase.Checked, 
                                                          Cb_HighPriority.Checked, Cb_LHL_Bold.Checked, Cb_Level_Regex.Checked));

            ReOrderHighlightingListByOrder(_levelHighlightings, selectedIndex);

            if (Dgv_Level.RowCount > 1)
                Txt_LevelText.Text = "";
        }

        private void Btn_Delete_Click(object sender, EventArgs e)
        {
            if (Dgv_Level.SelectedRows.Count >0)
                _levelHighlightings.Remove((Highlighting)Dgv_Level.SelectedRows[0].DataBoundItem);
        }

        private void Btn_Up_Click(object sender, EventArgs e)
        {
            if (Dgv_Level.SelectedRows.Count > 0 && Dgv_Level.SelectedRows[0].Index > 0)
            {
                int idx = Dgv_Level.SelectedRows[0].Index;

                Highlighting h1 = _levelHighlightings[idx];
                Highlighting h2 = _levelHighlightings[idx-1];
                h1.Order = h2.Order;
                h2.Order += 1;
                //_levelHighlightings.Insert(idx, h2);
                //_levelHighlightings.Insert(idx-1, h1);

                //_levelHighlightings.RemoveAt(idx + 1);
                //_levelHighlightings.RemoveAt(idx + 1);

                _levelHighlightings.Sort(CompareHighlightingByOrder);
                Dgv_Level.Rows[idx - 1].Selected = true;
                Dgv_Level.FirstDisplayedScrollingRowIndex = idx - 1;

                
            }
        }

        private void Btn_Down_Click(object sender, EventArgs e)
        {
            if (Dgv_Level.SelectedRows.Count > 0 && Dgv_Level.SelectedRows[0].Index < Dgv_Level.Rows.Count - 1)
            {
                int idx = Dgv_Level.SelectedRows[0].Index;

                Highlighting h1 = _levelHighlightings[idx];
                Highlighting h2 = _levelHighlightings[idx + 1];
                h1.Order = h2.Order;
                h2.Order -= 1;
                //_levelHighlightings.Insert(idx, h2);
                //_levelHighlightings.Insert(idx + 1, h1);

                //_levelHighlightings.RemoveAt(idx + 2);
                //_levelHighlightings.RemoveAt(idx + 2);

                //Dgv_Level.Rows[idx + 1].Selected = true;

                _levelHighlightings.Sort(CompareHighlightingByOrder);
                Dgv_Level.Rows[idx + 1].Selected = true;
                Dgv_Level.FirstDisplayedScrollingRowIndex = idx + 1;

            }
        }

        private void Cb_LHL_Bold_CheckedChanged(object sender, EventArgs e)
        {
            Lbl_LevelApercu.Font = new Font(LogConfig.Singleton.DefaultFont.GetFont(), Cb_LHL_Bold.Checked ? FontStyle.Bold : FontStyle.Regular);
            if (Dgv_Level.SelectedRows.Count > 0)
            {
                Dgv_Level.SelectedRows[0].Cells[1].Style.Font = new Font(LogConfig.Singleton.DefaultFont.GetFont(), Cb_LHL_Bold.Checked ? FontStyle.Bold : FontStyle.Regular);
            }
        }

        #endregion

        #region Alert Tab

        private void Btn_AddAlert_Click(object sender, EventArgs e)
        {
            AlertInfo alertTmp = new AlertInfo(Txt_AlertSearchText.Text, Txt_AlertMessage.Text);
            if (_alertBinding.Find(i => i.SearchText == alertTmp.SearchText) != null)
            {
                MessageBox.Show(this, "An alert on the same test is already in the list", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            _alertBinding.Add(alertTmp);
            _alertBinding.Sort(AlertInfo.Compare);
        }

        private void Btn_RemoveAlert_Click(object sender, EventArgs e)
        {
            if (Dgv_Alert.SelectedRows.Count > 0)
                _alertBinding.RemoveAt(Dgv_Alert.SelectedRows[0].Index);
        }

        private void Bnt_Alert_DesactivateAll_Click(object sender, EventArgs e)
        {
            foreach (AlertInfo line in _alertBinding)
            {
                line.IsActif = false;
            }
            Dgv_Alert.Refresh();
        }

        private void Btn_Alert_ActivateAll_Click(object sender, EventArgs e)
        {
            foreach (AlertInfo line in _alertBinding)
            {
                line.IsActif = true;
            }
            Dgv_Alert.Refresh();
        }



        private void Btn_AddAlertFile_Click(object sender, EventArgs e)
        {
            AlertFile alertTmp = new AlertFile(Txt_BrowseAlertFile.Text);
            if (_alertFileBinding.Find(i => i.FilePath == alertTmp.FilePath) != null)
            {
                MessageBox.Show(this, "A directory with the same path is already in the list", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            _alertFileBinding.Add(alertTmp);
            _alertFileBinding.Sort(AlertFile.Compare);
        }

        private void Btn_RemoveAlertFile_Click(object sender, EventArgs e)
        {
            if (Dgv_AlertFile.SelectedRows.Count > 0)
                _alertFileBinding.RemoveAt(Dgv_AlertFile.SelectedRows[0].Index);
        }

        private void Bnt_AlertFile_DesactivateAll_Click(object sender, EventArgs e)
        {
            foreach (AlertFile line in _alertFileBinding)
            {
                line.IsActif= false;
            }
            Dgv_AlertFile.Refresh();
        }

        private void Btn_AlertFile_ActivateAll_Click(object sender, EventArgs e)
        {
            foreach (AlertFile line in _alertFileBinding)
            {
                line.IsActif = true;
            }
            Dgv_AlertFile.Refresh();
        }

        private void Btn_BrowseAlertFile_Click(object sender, EventArgs e)
        {
            OpenFileDialog diag = new OpenFileDialog();
            diag.Multiselect = false;
            diag.Title = "Choose the file to add supervise with alert";
            if (diag.ShowDialog(this) == DialogResult.OK)
            {
                Txt_BrowseAlertFile.Text = diag.FileName;
            }
        }

        #endregion

        #region Profile Tab

        #region Profile Common

        private void Btn_RemoveProfile_Click(object sender, EventArgs e)
        {
            if (Ddl_ProfileName.SelectedIndex > -1)
            {
                _allProfile.RemoveAt(Ddl_ProfileName.SelectedIndex);
            }
        }

        private void Btn_AddProfile_Click(object sender, EventArgs e)
        {
            InputBox InBox = new InputBox();
            string profileName;
            if ((profileName = InBox.ShowDialog("New profile name ?")) == null)
            {
                MessageBox.Show(this, "You must specify a profile name", "WARNING", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            Profile profileTmp = new Profile(profileName);
            if (TestProfile(profileTmp))
            {
                AddProfile(profileTmp);
            }
            else
                MessageBox.Show(this, "A profile with this name already exist", "create Profile", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        private void Btn_SaveProfile_Click(object sender, EventArgs e)
        {
            if (Ddl_ProfileName.SelectedIndex >= 0)
            {
                Profile profileTmp = _allProfile[Ddl_ProfileName.SelectedIndex].Clone();

                SaveFileDialog diag = new SaveFileDialog();
                diag.CheckPathExists = true;
                diag.OverwritePrompt = true;
                diag.RestoreDirectory = true;
                diag.Filter = "Logwatcher profile(*.lwp)|*.lwp";
                diag.Title = "Where do you want to save your profile";
                diag.FileName = LogConfig.CleanProfileName(profileTmp.Name);
                if (diag.ShowDialog() == DialogResult.OK)
                {
                    try
                    {
                        FileInfo file = new FileInfo(diag.FileName);
                        profileTmp.Name = file.Name.Replace(file.Extension, "");
                        XmlCustomSerializer serTmp = new XmlCustomSerializer(typeof(Profile));
                        string objserialized = serTmp.Serialize(profileTmp);
                        File.WriteAllText(diag.FileName, objserialized, Encoding.Default);
                    }
                    catch
                    {
                        MessageBox.Show("Loading configuration error occur", "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
            else
            {
                MessageBox.Show(this, "You must select a profile to save", "Save Profile", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }
        }

        private void Btn_LoadProfile_Click(object sender, EventArgs e)
        {
            OpenFileDialog diag = new OpenFileDialog();
            diag.CheckPathExists = true;
            diag.CheckFileExists = true;
            diag.Multiselect = false;
            diag.RestoreDirectory = true;
            diag.Filter = "Logwatcher profile(*.lwp)|*.lwp";
            diag.Title = "Select a profile to load";
            if (diag.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    XmlCustomSerializer deserTmp = new XmlCustomSerializer(typeof(Profile));
                    Profile profileTmp = deserTmp.Deserialize<Profile>(File.ReadAllText(diag.FileName));
                    if (!TestProfile(profileTmp))
                    {
                        if (MessageBox.Show(this, "A profile with this name already exist.\r\nDo you want to rename it ?", "Load Profile", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
                        {
                            InputBox InBox = new InputBox();
                            string profileName;
                            if ((profileName = InBox.ShowDialog("New profile name ?")) == null)
                            {
                                MessageBox.Show(this, "Profile Load was cancel", "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
                                return;
                            }
                            
                            profileTmp.Name = profileName;
                        }
                        else
                        {
                            MessageBox.Show(this, "Profile Load was cancel", "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
                            return;
                        }
                    }
                    AddProfile(profileTmp);
                }
                catch
                {
                    MessageBox.Show(this, "Loading configuration error occur", "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }

                //Stream stream = null;
                //try
                //{
                //    stream = new FileStream(diag.FileName, System.IO.FileMode.Open);
                //    BinaryFormatter formatter = new BinaryFormatter();
                //    Profile profileTmp = (Profile)formatter.Deserialize(stream);
                //    AddProfile(profileTmp);
                //}
                //finally
                //{
                //    if (stream != null)
                //        stream.Close();
                //}

            }
        }

        private void Ddl_ProfileName_SelectedIndexChanged(object sender, EventArgs e)
        {
            RefreshProfileData();
        }

        private void Btn_Browse_Click(object sender, EventArgs e)
        {
            OpenFileDialog fileDiag = new OpenFileDialog();
            if (fileDiag.ShowDialog() == DialogResult.OK)
            {
                CurrentProfile.LoadingParam = fileDiag.SafeFileName;
                Txt_FileName.Text = fileDiag.SafeFileName;
            }

            CurrentProfile.LoadingParam = Txt_FileName.Text;
        }

        private bool TestProfile(Profile profileTmp)
        {
            foreach (Profile tmp in _allProfile)
            {
                if (profileTmp.Name == tmp.Name)
                    return false;
            }

            return true;
        }

        private void Txt_FileName_Leave(object sender, EventArgs e)
        {
            CurrentProfile.LoadingParam = Txt_FileName.Text;
        }

        private void Ddl_ProfileEncoding_SelectedIndexChanged(object sender, EventArgs e)
        {
            CurrentProfile.Encoding = Ddl_ProfileEncoding.Text;
        }

        private void AddProfile(Profile profileTmp)
        {
            _allProfile.Add(profileTmp);
            Ddl_ProfileName.SelectedIndex = _allProfile.Count - 1;

            _currentProfileHiddenLog = new BindingList<HiddenLine>(profileTmp.DicoHiddenLog);
            hiddenLineBindingSource.DataSource = _currentProfileHiddenLog;

            _currentProfileHighlightings = new SortableBindingList<Highlighting>(profileTmp.DicoHighLighting);
            ProfileHighlightingBindingSource.DataSource = _currentProfileHighlightings;

            _currentProfileStoredFilter = new SortableBindingList<StoredFilter>(profileTmp.DicoStoredFilter);
            storedFilterBindingSource.DataSource = _currentProfileStoredFilter;

            Txt_ProfileHiddenLog.Text = "";
        }

        #endregion

        #region Profile Highlighting

        private void Btn_ProfileForeColor_Click(object sender, EventArgs e)
        {
            if (colorDialog1.ShowDialog(this) == DialogResult.OK)
                Lbl_ProfileApercu.ForeColor = colorDialog1.Color;
        }

        private void Btn_ProfileBackColor_Click(object sender, EventArgs e)
        {
            if (colorDialog1.ShowDialog(this) == DialogResult.OK)
                Lbl_ProfileApercu.BackColor = colorDialog1.Color;
        }

        private void Btn_ProfileAddHighlight_Click(object sender, EventArgs e)
        {
            if (Ddl_ProfileName.SelectedIndex > -1)
            {
                if (Lbl_ProfileApercu.ForeColor.A == 0)
                    Lbl_ProfileApercu.ForeColor = Color.Black;

                if (Lbl_ProfileApercu.BackColor.A == 0)
                    Lbl_ProfileApercu.BackColor = Color.White;

                int selectedIndex = 0;
                if (Dgv_Profile.SelectedRows.Count > 0)
                {
                    selectedIndex = Dgv_Profile.SelectedRows[0].Index;
                }

                //_currentProfileHighlightings.Count
                //_currentProfileHighlightings.Add(new Highlighting(selectedIndex + 1, Txt_ProfileText.Text,
                //                                                  Lbl_ProfileApercu.ForeColor,
                //                                                  Lbl_ProfileApercu.BackColor, Cb_ProfileCase.Checked,
                //                                                  Cb_PHL_Bold.Checked));

                _currentProfileHighlightings.Insert(selectedIndex, new Highlighting(selectedIndex + 1, Txt_ProfileText.Text,
                                                                                    Lbl_ProfileApercu.ForeColor,
                                                                                    Lbl_ProfileApercu.BackColor, Cb_ProfileCase.Checked,
                                                                                    Cb_PHL_Bold.Checked, Cb_PHL_Regex.Checked));

                ReOrderHighlightingListByOrder(_currentProfileHighlightings, selectedIndex);


                if (Dgv_Profile.RowCount > 1)
                    Txt_ProfileText.Text = "";
            }
            else
            {
                MessageBox.Show(this, "You must select an existing profile or create a new one", "Profile", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }
        }

        private static int CompareHighlightingByOrder(Highlighting first, Highlighting second)
        {
            if (first.Order == second.Order)
                return 0;

            return first.Order > second.Order ? 1 : -1;
        }

        


        private static void ReOrderHighlightingListByOrder(IList<Highlighting> list, int beginIndex)
        {
            //int i = 1;
            //foreach (Highlighting profileHighlighting in _currentProfileHighlightings)
            //{
            //    profileHighlighting.Order = i;
            //    i++;
            //}

            for (int i = beginIndex; i < list.Count; i++)
            {
                Highlighting current = list[i];
                current.Order = i + 1;
            }
        }

        private void Btn_ProfileDeleteHighlight_Click(object sender, EventArgs e)
        {
            if (Dgv_Profile.SelectedRows.Count > 0)
                _currentProfileHighlightings.Remove((Highlighting)Dgv_Profile.SelectedRows[0].DataBoundItem);
        }

        private void Btn_ProfileDown_Click(object sender, EventArgs e)
        {
            if (Dgv_Profile.SelectedRows.Count > 0 && Dgv_Profile.SelectedRows[0].Index < Dgv_Profile.Rows.Count - 1)
            {
                int idx = Dgv_Profile.SelectedRows[0].Index;

                Highlighting h1 = _currentProfileHighlightings[idx];
                Highlighting h2 = _currentProfileHighlightings[idx + 1];
                h1.Order = h2.Order;
                h2.Order -= 1;
                //_currentProfileHighlightings.Insert(idx, h2);
                //_currentProfileHighlightings.Insert(idx + 1, h1);

                //_currentProfileHighlightings.RemoveAt(idx + 2);
                //_currentProfileHighlightings.RemoveAt(idx + 2);
                _currentProfileHighlightings.Sort(CompareHighlightingByOrder);
                Dgv_Profile.Rows[idx + 1].Selected = true;
                Dgv_Profile.FirstDisplayedScrollingRowIndex = idx + 1;
            }
        }

        private void Btn_ProfileUp_Click(object sender, EventArgs e)
        {
            if (Dgv_Profile.SelectedRows.Count > 0 && Dgv_Profile.SelectedRows[0].Index > 0)
            {
                int idx = Dgv_Profile.SelectedRows[0].Index;

                Highlighting h1 = _currentProfileHighlightings[idx];
                Highlighting h2 = _currentProfileHighlightings[idx - 1];
                h1.Order = h2.Order;
                h2.Order += 1;
                //_currentProfileHighlightings.Insert(idx, h2);
                //_currentProfileHighlightings.Insert(idx - 1, h1);

                //_currentProfileHighlightings.RemoveAt(idx + 1);
                //_currentProfileHighlightings.RemoveAt(idx + 1);
                _currentProfileHighlightings.Sort(CompareHighlightingByOrder);
                Dgv_Profile.Rows[idx - 1].Selected = true;
                Dgv_Profile.FirstDisplayedScrollingRowIndex = idx - 1;
            }
        }

        private void Dgv_Profile_RowPrePaint(object sender, DataGridViewRowPrePaintEventArgs e)
        {
            if (e.RowIndex > -1)
            {
                Highlighting tmp = (Highlighting)Dgv_Profile.Rows[e.RowIndex].DataBoundItem;
                Dgv_Profile.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.BackColor = tmp.BackColor;
                Dgv_Profile.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.ForeColor = tmp.ForeColor;
                Dgv_Profile.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.Font = new Font(LogConfig.Singleton.DefaultFont.GetFont(), tmp.Bold ? FontStyle.Bold : FontStyle.Regular);

                Dgv_Profile.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.SelectionBackColor = tmp.BackColor;
                Dgv_Profile.Rows[e.RowIndex].Cells[COLUMN_HIGHLIGHT].Style.SelectionForeColor = tmp.ForeColor;
            }
        }

        private void Cb_PHL_Bold_CheckedChanged(object sender, EventArgs e)
        {
            Lbl_ProfileApercu.Font = new Font(LogConfig.Singleton.DefaultFont.GetFont(), Cb_PHL_Bold.Checked ? FontStyle.Bold : FontStyle.Regular);
        }

        #endregion

        #region HiddenLog

        private void Btn_AddHiddenLog_Click(object sender, EventArgs e)
        {
            if (Ddl_ProfileName.SelectedIndex > -1)
            {
                _currentProfileHiddenLog.Add(new HiddenLine(Txt_ProfileHiddenLog.Text, Cb_PHid_Actif.Checked, Cb_PHid_Regex.Checked, 
                                                            Cb_PHid_CaseSensitive.Checked));
            }
            else
            {
                MessageBox.Show(this, "You must select an existing profile or create a new one", "Profile", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }
        }

        private void Btn_DelHiddenLog_Click(object sender, EventArgs e)
        {
            if (Dgv_HiddenLines.SelectedCells.Count > 0)
                _currentProfileHiddenLog.RemoveAt(Dgv_HiddenLines.SelectedCells[0].RowIndex);
        }

        //private void Bnt_Phid_DesactivateAll_Click(object sender, EventArgs e)
        //{
        //    foreach (HiddenLine line in _currentProfileHiddenLog)
        //    {
        //        line.IsActif = false;
        //    }
        //    Dgv_HiddenLines.Refresh();
        //}

        private void Bnt_Phid_ActivateAll_Click(object sender, EventArgs e)
        {
            foreach (HiddenLine line in _currentProfileHiddenLog)
            {
                line.IsActif = true;
            }
            Dgv_HiddenLines.Refresh();
        }

        #endregion

        #region Stored Filter

        private void Btn_ProfileAddStockedFilter_Click(object sender, EventArgs e)
        {
            if (Ddl_ProfileName.SelectedIndex > -1)
            {
                StoredFilter storeTmp = new StoredFilter(Txt_ProfileFilterName.Text, Txt_ProfileFilter.Text, Cb_Psf_Regex.Checked, Cb_Psf_CaseSensitive.Checked);
                if (_currentProfileStoredFilter.Find(i => i.Name == storeTmp.Name) != null)
                {
                    MessageBox.Show(this, "This stored filter name already exist", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }
                _currentProfileStoredFilter.Add(storeTmp);
                _currentProfileStoredFilter.Sort(StoredFilter.Compare);
            }
            else
            {
                MessageBox.Show(this, "You must select an existing profile or create a new one", "Profile", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }
        }

        private void Btn_ProfileDeleteStockedFilter_Click(object sender, EventArgs e)
        {
            if (Dgv_StoredFilters.SelectedCells.Count > 0)
                _currentProfileStoredFilter.RemoveAt(Dgv_StoredFilters.SelectedCells[0].RowIndex);

            //Txt_ProfileFilter.Text = "";
            //Txt_ProfileFilterName.Text = "";
        }

        #endregion

        #endregion

        #region Option Tab

        private void Btn_SelectFont_Click(object sender, EventArgs e)
        {
            FontDialog myFont = new FontDialog();
            myFont.ShowEffects = false;
            myFont.ShowHelp = false;
            myFont.ShowApply = false;
            myFont.FontMustExist = true;
            myFont.Font = _selectedFont.GetFont();

            if (myFont.ShowDialog(this) == DialogResult.OK)
            {
                _selectedFont = new SimpleFont(myFont.Font);
                Lbl_Font.Text = String.Format("Name : {0}\r\n" +
                                              "   Size : {1}\r\n" +
                                              "  Style : {2}", _selectedFont.Name, _selectedFont.Size, _selectedFont.Style);
            }
        }

        private void Btn_ClearSearchHisto_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show(this, "Do you realy want to clear all your searched historic", "Clear historic", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                Frm_Master.Singleton.AutoCompletSource.Clear();
                MessageBox.Show(this, "Searched historic cleared", "Result", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private void Btn_BrowseSharedFolder_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog diag = new FolderBrowserDialog();
            diag.SelectedPath = Txt_SharedFolder.Text;
            if (diag.ShowDialog(this) == System.Windows.Forms.DialogResult.OK)
            {
                Txt_SharedFolder.Text = diag.SelectedPath;
            }
        }

        #endregion

        #region LogBrowser Tab

        #region Real dir

        private void Btn_LogBrowserAdd_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(Txt_LogBrowserDir.Text))
            {
                LogBrowserItem itemTmp = new LogBrowserItem(Txt_LogBrowserName.Text, Txt_LogBrowserDir.Text, string.IsNullOrEmpty(Txt_LogBrowserFilter.Text) ? "*" : Txt_LogBrowserFilter.Text);
                if (_logBrowserRealDir.Find(i=> i.Name == itemTmp.Name) != null)
                {
                    MessageBox.Show(this, "A directory with the same name already exist", "WARNING", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }
                if (_logBrowserRealDir.Find(i => i.Path == itemTmp.Path) != null)
                {
                    MessageBox.Show(this, "A directory with the same path already exist", "WARNING", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                if (_logBrowserAllVirtualDir.ContainsKey(itemTmp.Name))
                {
                    MessageBox.Show(this, "A virtual directory with the same name already exist", "WARNING", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                _logBrowserRealDir.Add(itemTmp);
            }
            else
                MessageBox.Show(this, "You must at least choose the directory to browse", "WARNING", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }

        private void Btn_LogBrowserDir_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog diag = new FolderBrowserDialog();
            if (diag.ShowDialog(this) == DialogResult.OK)
            {
                Txt_LogBrowserDir.Text = diag.SelectedPath;
            }
        }

        private void Btn_LB_DelRealDir_Click(object sender, EventArgs e)
        {
            if (Dgv_Lb_RealDir.SelectedCells.Count > 0)
            {
                int idx = Dgv_Lb_RealDir.SelectedCells[0].RowIndex;
                _logBrowserRealDir.RemoveAt(idx);
            }
            else
            {
                MessageBox.Show("You must select one row to delete");
            }
        }

        #endregion

        #region Virtual Dir

        private void Ddl_VirtualDir_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (Ddl_LB_VirtualDir.SelectedIndex >= 0 && _logBrowserAllVirtualDir.ContainsKey(Ddl_LB_VirtualDir.SelectedValue.ToString()))
            {
                _currentVirtualDir = _logBrowserAllVirtualDir[Ddl_LB_VirtualDir.SelectedValue.ToString()];
                logBrowserVirtualFileBindingSource.DataSource = _currentVirtualDir;
            }
            //else
            //{
            //    MessageBox.Show("Unknown virtual directory");
            //}
        }

        private void Btn_LB_AddVirtualDir_Click(object sender, EventArgs e)
        {
            InputBox InBox = new InputBox();
            string virtualDirName;
            if ((virtualDirName = InBox.ShowDialog("New Virtual directory name ?")) == null)
            {
                MessageBox.Show(this, "You must specify a Virtual directory name", "WARNING", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (!LogConfig.Singleton.LogBrowser.VirtualDirectories.ContainsKey(virtualDirName))
            {
                _logBrowserVirtualDir.Add(virtualDirName);
                _currentVirtualDir = new SortableBindingList<LogBrowserVirtualFile>();
                _logBrowserAllVirtualDir.Add(virtualDirName, _currentVirtualDir);
                logBrowserVirtualFileBindingSource.DataSource = _currentVirtualDir;
                Ddl_LB_VirtualDir.SelectedIndex = Ddl_LB_VirtualDir.Items.Count -1;
            }
            else
                MessageBox.Show(this, "A Virtual directory with this name already exist", "create Profile", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        private void Btn_LB_DeleteVirtualDir_Click(object sender, EventArgs e)
        {
            if (Ddl_LB_VirtualDir.SelectedIndex >= 0 && _logBrowserAllVirtualDir.ContainsKey(Ddl_LB_VirtualDir.SelectedValue.ToString()))
            {
                string key = Ddl_LB_VirtualDir.SelectedValue.ToString();
                _logBrowserAllVirtualDir.Remove(key);
                _logBrowserVirtualDir.Remove(key);

                if (Ddl_LB_VirtualDir.SelectedIndex >= 0 && _logBrowserAllVirtualDir.ContainsKey(Ddl_LB_VirtualDir.SelectedValue.ToString()))
                {
                    _currentVirtualDir = _logBrowserAllVirtualDir[Ddl_LB_VirtualDir.SelectedValue.ToString()];
                }
                else
                {
                    _currentVirtualDir = new SortableBindingList<LogBrowserVirtualFile>();
                }

                logBrowserVirtualFileBindingSource.DataSource = _currentVirtualDir;
            }
            else
            {
                MessageBox.Show("Unknown virtual directory");
            }
        }

        private void Btn_LB_AddVirtualFile_Click(object sender, EventArgs e)
        {
            if (Ddl_LB_VirtualDir.SelectedIndex > -1)
            {
                if (!string.IsNullOrEmpty(Txt_LB_FilePath.Text))
                {
                    if (string.IsNullOrEmpty(Txt_LB_FileName.Text))
                    {
                        FileInfo fileTmp = new FileInfo(Txt_LB_FilePath.Text);
                        Txt_LB_FileName.Text = fileTmp.Name;
                    }
                    LogBrowserVirtualFile tmp = new LogBrowserVirtualFile(Txt_LB_FilePath.Text, Txt_LB_FileName.Text);
                    if (_currentVirtualDir.Find(i => i.Name == tmp.Name) != null)
                    {
                        MessageBox.Show(this, "A virtual file have the same name", "Virtual directory", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        return;
                    }

                    if (_currentVirtualDir.Find(i => i.Path == tmp.Path) != null)
                    {
                        MessageBox.Show(this, "A virtual file have the same path", "Virtual directory", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        return;
                    }

                    _currentVirtualDir.Add(tmp);
                }
                else
                {
                    MessageBox.Show(this, "You must set at least the path of the file", "Virtual directory", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                }
            }
            else
            {
                MessageBox.Show(this, "You must select an existing virtual directory or create a new one", "Virtual directory", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }

        }

        private void Btn_LB_Path_Click(object sender, EventArgs e)
        {
            OpenFileDialog diag = new OpenFileDialog();
            diag.Multiselect = false;
            diag.Title = "Choose the file to add to your virtual directory";
            if (diag.ShowDialog(this) == DialogResult.OK)
            {
                Txt_LB_FilePath.Text = diag.FileName;
            }

        }

        private void Btn_LB_DelVirtualFile_Click(object sender, EventArgs e)
        {
            if (Dgv_LB_VirtualFile.SelectedCells.Count > 0)
            {
                int idx = Dgv_LB_VirtualFile.SelectedCells[0].RowIndex;
                _currentVirtualDir.RemoveAt(idx);
            }
            else
            {
                MessageBox.Show("You must select one row to delete");
            }
        }

        #endregion

        #endregion

        #region Common Tab

        private void Frm_Config_Shown(object sender, EventArgs e)
        {
            //_hiddenLogIsModified = false;

            //we load the first profile
            if (_allProfile.Count > 0)
            {
                if (Ddl_ProfileName.SelectedIndex > -1)
                {
                    if (Frm_Master.Singleton.CurrentLog != null && !String.IsNullOrEmpty(Frm_Master.Singleton.CurrentLog.CurrentProfileName))
                    {
                        Ddl_ProfileName.Text = Frm_Master.Singleton.CurrentLog.CurrentProfileName;
                    }
                    else
                    {
                        Ddl_ProfileName.SelectedIndex = 0;
                    }
                    RefreshProfileData();
                }
            }
        }

        private List<T> SortList<T>(List<T> lstTmp, Comparison<T> comparMethod)
        {
            SortableBindingList<T> sortListTmp = new SortableBindingList<T>(lstTmp);
            sortListTmp.Sort(comparMethod);
            return new List<T>(sortListTmp);
        }

        private void Btn_Ok_Click(object sender, EventArgs e)
        {
            if (!TestRegexValidity())
            {
                return;
            }


            #region We test if HiddenLine had been modified
            List<Profile> profileToReload = new List<Profile>();
            foreach (Profile profileTmp in _allProfile)
            {
                bool hiddenLogIsModified = false;
                int i = 0;
                if (!LogConfig.Singleton.DicoProfile.ContainsKey(profileTmp.Name))
                {
                    LogConfig.Singleton.DicoProfile.Add(profileTmp.Name, profileTmp);
                }

                Profile config = LogConfig.Singleton.DicoProfile[profileTmp.Name];
                if (config.DicoHiddenLog.Count != profileTmp.DicoHiddenLog.Count)
                {
                    hiddenLogIsModified = true;
                }
                else
                {
                    foreach (HiddenLine line in profileTmp.DicoHiddenLog)
                    {
                        if (!config.DicoHiddenLog[i].Equals(line))
                        {
                            hiddenLogIsModified = true;
                        }
                        i++;
                    }
                }
                if (hiddenLogIsModified)
                    profileToReload.Add(profileTmp);
            } 
            #endregion

            // save all config data

            // ************************ level Highlighting ************************************************
            LogConfig.Singleton.DicoHighlighting.Clear();
            LogConfig.Singleton.DicoHighlighting.AddRange(_levelHighlightings);

            // ************************ Profile ************************************************
            // Highlighting
            LogConfig.Singleton.DicoProfile.Clear();
            _allProfile.Sort(Profile.Compare);
            foreach (Profile profileTmp in _allProfile)
            {
                profileTmp.DicoStoredFilter = SortList(profileTmp.DicoStoredFilter, StoredFilter.Compare);
                profileTmp.DicoHiddenLog = SortList(profileTmp.DicoHiddenLog, HiddenLine.Compare);

                LogConfig.Singleton.DicoProfile.Add(profileTmp.Name, profileTmp);
            }

            // ************************ Alert ************************************************
            LogConfig.Singleton.DicoAlert.Clear();
            LogConfig.Singleton.DicoAlert.AddRange(_alertBinding);

            LogConfig.Singleton.DicoAlertFile.Clear();
            _alertFileBinding.Sort(AlertFile.Compare);
            LogConfig.Singleton.DicoAlertFile.AddRange(_alertFileBinding);

            // ************************ LogBrowser **********************************************
            // Real dir
            _logBrowserRealDir.Sort(LogBrowserItem.Compare);
            LogConfig.Singleton.LogBrowser.RealDirectories.Clear();
            LogConfig.Singleton.LogBrowser.RealDirectories.AddRange(_logBrowserRealDir);

            // Virtual dir
            LogConfig.Singleton.LogBrowser.VirtualDirectories.Clear();
            foreach (KeyValuePair<string, SortableBindingList<LogBrowserVirtualFile>> item in _logBrowserAllVirtualDir)
            {
                item.Value.Sort(LogBrowserVirtualFile.Compare);
                LogConfig.Singleton.LogBrowser.VirtualDirectories.Add(item.Key, new List<LogBrowserVirtualFile>(item.Value));
            }
            
            // ************************ plugin **********************************************
            LogConfig.Singleton.DicoPlugin.Clear();
            foreach (Plugin item in _allPlugin)
                LogConfig.Singleton.DicoPlugin.Add(item.Text, item);

            // ************************ Option **********************************************
            LogConfig.Singleton.WrapLine = Cb_WrapLine.Checked;
            LogConfig.Singleton.SaveLogsOnClose = Cb_SaveLogs.Checked;
            LogConfig.Singleton.ShowWarnBanner = Cb_ShowWarnBanner.Checked;
            LogConfig.Singleton.IsSingleInstance = Cb_SingleInstance.Checked;

            LogConfig.Singleton.ProfileFolderShared = Txt_SharedFolder.Text;

            LogConfig.Singleton.DefaultEncoding = Ddl_DefaultEncoding.Text;
            LogConfig.Singleton.DefaultFont = _selectedFont;

            LogConfig.Singleton.EofSizeToLoad = int.Parse(Txt_EofSizeToLoad.Text);
            LogConfig.Singleton.LoadOnlyEof = Cb_LoadOnlyEOF.Checked;
            LogConfig.Singleton.MaxSizeToPrompt = int.Parse(Txt_MaxSizeToPrompt.Text);
            LogConfig.Singleton.ShowOnlyLogBrowserFileNumDays = int.Parse(Txt_LogBrowserNumDays.Text);

            LogConfig.Singleton.ContextRowNbr = int.Parse(Txt_ContextRowNbr.Text);

            LogConfig.Singleton.DoubleClickAction = Rb_ContextView.Checked ? DoubleClickActions.ContextView : DoubleClickActions.DetailView;

            LogConfig.Singleton.Save();

            Hide();

            Application.DoEvents();

            Frm_Master.Singleton.RefreshGUIAfterConfig(profileToReload);

        }

        private void Btn_Cancel_Click(object sender, EventArgs e)
        {
            Hide();
        }

        #endregion

        #region Plugin

        private void Btn_PluginAdd_Click(object sender, EventArgs e)
        {
            _allPlugin.Add(new Plugin(Txt_PluginName.Text, Txt_PluginTypeName.Text));
        }

        #endregion

        #endregion

        #region Methods

        private void RefreshProfileData()
        {
            if (Ddl_ProfileName.SelectedIndex > -1)
            {
                _currentProfileHighlightings = new SortableBindingList<Highlighting>(CurrentProfile.DicoHighLighting);
                ProfileHighlightingBindingSource.DataSource = _currentProfileHighlightings;

                _currentProfileHiddenLog = new BindingList<HiddenLine>(CurrentProfile.DicoHiddenLog);
                hiddenLineBindingSource.DataSource = _currentProfileHiddenLog;

                _currentProfileStoredFilter = new SortableBindingList<StoredFilter>(CurrentProfile.DicoStoredFilter);
                storedFilterBindingSource.DataSource = _currentProfileStoredFilter;

                Txt_FileName.Text = CurrentProfile.LoadingParam;
                Ddl_ProfileEncoding.Text = CurrentProfile.Encoding;

                Profile profileTmp = Ddl_ProfileName.SelectedItem as Profile;
                if (profileTmp != null && profileTmp.Shared)
                {
                    Tab_Profile.Enabled = false;
                    Txt_FileName.Enabled = false;
                    Ddl_ProfileEncoding.Enabled = false;
                    Lbl_SharedProfile.Visible = true;
                }
                else
                {
                    Tab_Profile.Enabled = true;
                    Txt_FileName.Enabled = true;
                    Ddl_ProfileEncoding.Enabled = true;
                    Lbl_SharedProfile.Visible = false;
                }

            }

            
        }

        private bool TestRegexValidity()
        {
            StringBuilder allError = new StringBuilder();
            foreach (Profile profileTmp in _allProfile)
            {
                foreach (Highlighting highlightingTmp in profileTmp.DicoHighLighting)
                {
                    if (highlightingTmp.IsRegex && !RegexIsOk(highlightingTmp.Text))
                    {
                        allError.AppendLine(String.Format("Profile={0} - Highlight={1}", profileTmp.Name, highlightingTmp.Text));
                    }
                }

                foreach (StoredFilter filterTmp in profileTmp.DicoStoredFilter)
                {
                    if (!RegexIsOk(filterTmp.Filter))
                    {
                        allError.AppendLine(String.Format("Profile={0} - Stored Filter={1}", profileTmp.Name, filterTmp.Name));
                    }
                }
            }


            foreach (Highlighting highlightingTmp in _levelHighlightings)
            {
                if (highlightingTmp.IsRegex && !RegexIsOk(highlightingTmp.Text))
                {
                    allError.AppendLine(String.Format("Level Highlight={0}", highlightingTmp.Text));
                }
            }

            foreach (AlertInfo alert in _alertBinding)
            {
                if (!RegexIsOk(alert.SearchText))
                {
                    allError.AppendLine(String.Format("ALert SearchText={0}", alert.SearchText));
                }
            }

            if (allError.Length == 0)
                return true;
            
            MessageBox.Show("Some Regular expresion are not valid : \r\n" + allError, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return false;
        }

        private static bool RegexIsOk(string regexToTest)
        {
            try
            {
                new Regex(regexToTest);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        #endregion


        //private void ApplyDarkMode(Control component)
        //{
        //    component.BackColor = Color.Black;
        //    component.ForeColor = Color.White;

        //    if (component.Controls != null)
        //    {
        //        foreach (Control subComponent in component.Controls)
        //        {
        //            ApplyDarkMode(subComponent);
        //        }
        //    }
        //}

        private void ApplyDarkMode(Control.ControlCollection allComponents)
        {
            this.BackColor = Color.Black;
            this.ForeColor = Color.White;
            this.ApplyDarkModeToAll(allComponents);
        }

        private void ApplyDarkModeToAll(Control.ControlCollection allComponents)
        {
            foreach (Control subComponent in allComponents)
            {
                subComponent.BackColor = Color.DarkBlue;
                subComponent.ForeColor = Color.White;

                if (subComponent is Button)
                {
                    var button = (Button)subComponent;
                    button.BackColor = Color.DarkRed;
                    button.FlatStyle = FlatStyle.Flat;
                    button.FlatAppearance.BorderColor = Color.Red;
                    button.FlatAppearance.BorderSize = 1;

                }

                if (subComponent is TabPage)
                {
                    var tabPage = (TabPage)subComponent;
                    tabPage.BackColor = Color.Yellow;
                    //tabPage.UseVisualStyleBackColor = true;
                }

                

                if (subComponent.Controls != null && subComponent.Controls.Count > 0)
                {
                    ApplyDarkModeToAll(subComponent.Controls);
                }
            }
        }
    }
}