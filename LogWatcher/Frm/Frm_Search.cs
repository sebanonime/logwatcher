using System;
using System.Windows.Forms;
using System.Text.RegularExpressions;
using WeifenLuo.WinFormsUI.Docking;

namespace LogWatcher.Frm
{
    public partial class Frm_Search : DockContent
    {
        public Frm_Search()
        {
            InitializeComponent();
        }

        private void Frm_Search_Shown(object sender, EventArgs e)
        {
            Txt_Search.AutoCompleteSource = AutoCompleteSource.CustomSource;
            Txt_Search.AutoCompleteCustomSource = Frm_Master.Singleton.AutoCompletSource;

            Txt_Search.Focus();
        }

        private void Btn_Ok_Click(object sender, EventArgs e)
        {
            RegexOptions optionTmp = Cb_MatchCase.Checked ? RegexOptions.None : RegexOptions.IgnoreCase;

            if (!Frm_Master.Singleton.CurrentLog.SearchFirst(CreateCritere(), optionTmp))
            {
                MessageBox.Show(this, String.Format("No match found for {0}", Txt_Search.Text), "Search", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            Visible = false;
        }

        private string CreateCritere()
        {
            string parametre = "";
            string critere = "";


            if (!String.IsNullOrEmpty(Txt_Search.Text))
            {
                if (Cb_WholeWord.Checked)
                    parametre = @"\b";

                critere = String.Format("{1}{0}{1}", Txt_Search.Text, parametre);
            }

            return critere;
        }

        private void Btn_Cancel_Click(object sender, EventArgs e)
        {
            Hide();
        }

    }
}