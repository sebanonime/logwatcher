using System;
using System.Text;
using System.Windows.Forms;
using System.Text.RegularExpressions;
using LogWatcher.Common;
using System.Collections.Generic;

namespace LogWatcher.Frm
{
    public partial class Frm_Filter : Form
    {
        private string _profileName;

        public string Critere { get; private set; }
        public RegexOptions Options { get; private set; }

        public Frm_Filter()
        {
            InitializeComponent();
            Txt_ManualFilter.AutoCompleteCustomSource = Frm_Master.Singleton.AutoCompletSource;
        }

        public DialogResult ShowDialog(IWin32Window owner, string caption, string profileName)
        {
            chkLstBox_StoredFilter.Items.Clear();
            Text = caption;
            _profileName = profileName;
            return ShowDialog(owner);
        }

        private void Frm_Filter_Shown(object sender, EventArgs e)
        {
            Txt_ManualFilter.AutoCompleteSource = AutoCompleteSource.CustomSource;
            Txt_ManualFilter.AutoCompleteCustomSource = Frm_Master.Singleton.AutoCompletSource;

            if (Frm_Master.Singleton.CurrentLog != null && !String.IsNullOrEmpty(Frm_Master.Singleton.CurrentLog.CurrentProfileName))
            {
                Btn_ProfileName.Text = Frm_Master.Singleton.CurrentLog.CurrentProfileName;

                FillStoreFilterList(Frm_Master.Singleton.CurrentLog.CurrentProfile.DicoStoredFilter);
            }
            else if (!string.IsNullOrEmpty(_profileName))
            {
                Btn_ProfileName.Text = _profileName;
                Profile profileTmp;
                if (LogConfig.Singleton.DicoProfile.TryGetValue(_profileName, out profileTmp))
                {
                    FillStoreFilterList(profileTmp.DicoStoredFilter);
                }
            }
            else
            {
                Btn_ProfileName.Text = "None";
            }

            Txt_ManualFilter.Select(0, Txt_ManualFilter.Text.Length);
            Txt_ManualFilter.Focus();
        }

        private void FillStoreFilterList(List<StoredFilter> list)
        {
            chkLstBox_StoredFilter.Items.Clear();
            foreach (StoredFilter filter in list)
            {
                chkLstBox_StoredFilter.Items.Add(filter);
            }
            //if (chkLstBox_StoredFilter.Items.Count != Frm_Master.Singleton.CurrentLog.CurrentProfile.DicoStoredFilter.Count)
            //{
            //    chkLstBox_StoredFilter.Items.Clear();
            //    foreach (StoredFilter filter in Frm_Master.Singleton.CurrentLog.CurrentProfile.DicoStoredFilter)
            //    {
            //        chkLstBox_StoredFilter.Items.Add(filter);
            //    }
            //}
            //else
            //{
            //    for (int i = 0; i < Frm_Master.Singleton.CurrentLog.CurrentProfile.DicoStoredFilter.Count; i++)
            //    {
            //        chkLstBox_StoredFilter.Items[i] = Frm_Master.Singleton.CurrentLog.CurrentProfile.DicoStoredFilter[i];
            //    }
            //}
        }

        private void Btn_Ok_Click(object sender, EventArgs e)
        {
            Critere = CreateCritere();
            Options = Cb_MatchCase.Checked ? RegexOptions.Compiled : RegexOptions.IgnoreCase | RegexOptions.Compiled;
            //Frm_Master.Singleton.FilterLog(CreateCritere(), optionTmp);

            Hide();
        }

        private void Btn_Cancel_Click(object sender, EventArgs e)
        {
            Hide();
        }

        private void Btn_ProfileName_Click(object sender, EventArgs e)
        {
            Frm_ProfileSelector profileSelector = new Frm_ProfileSelector();
            Profile selectedProfile = profileSelector.ShowProfileDialog(this);
            if (selectedProfile != null)
            {
                Btn_ProfileName.Text = selectedProfile.Name;
                FillStoreFilterList(selectedProfile.DicoStoredFilter);
            }
        }

        private string CreateCritere()
        {
            string parametre = "";
            StringBuilder critere = new StringBuilder();
            string filterManu = "", storedFilters = "", fullCritere;

            if (!String.IsNullOrEmpty(Txt_ManualFilter.Text))
            {
                if (critere.Length > 0)
                    critere.Append(".*");

                if (Cb_WholeWord.Checked)
                    parametre = @"\b";

                filterManu = String.Format("{1}{0}{1}", Txt_ManualFilter.Text, parametre);
            }

            if (chkLstBox_StoredFilter.CheckedItems.Count > 0)
            {
                
                critere.Append("(");
                foreach (StoredFilter filter in chkLstBox_StoredFilter.CheckedItems)
                {
                    critere.AppendFormat("{0}|", filter.Filter);
                }

                if (critere.Length > 0)
                {
                    storedFilters = critere.Replace('|', ')', critere.Length - 1, 1).ToString();
                }
            }

            if (!String.IsNullOrEmpty(filterManu) && !String.IsNullOrEmpty(storedFilters))
            {
                fullCritere = String.Format("{0}.*{1}|{1}.*{0}", filterManu, storedFilters);
            }
            else if (String.IsNullOrEmpty(filterManu) && !String.IsNullOrEmpty(storedFilters))
            {
                fullCritere = storedFilters;
            }
            else if (!String.IsNullOrEmpty(filterManu) && String.IsNullOrEmpty(storedFilters))
            {
                fullCritere = filterManu;
            }
            else
            {
                fullCritere = "";
            }

            return fullCritere;
        }
    }
}