using System;
using System.Windows.Forms;
using LogWatcher.Common;
using WeifenLuo.WinFormsUI.Docking;

namespace LogWatcher.Frm
{
    public partial class Frm_DetailView : DockContent
    {
        #region Fields

        private readonly string _detail;
        private int _idx;

        #endregion

        #region GUI Events

        public Frm_DetailView(string detail)
        {
            InitializeComponent();
            _detail = detail;

            Txt_Details.Text = Tools.GetAutoFormatedText(detail);
        }

        private void Btn_SeparatorOk_Click(object sender, EventArgs e)
        {
            ApplySeparator();
            Txt_Details.Text = Tools.ApplySeparator(Txt_Details.Text, Txt_Separator.Text);
        }
       
        private void Txt_Separator_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return || e.KeyCode == Keys.Enter)
            {
                ApplySeparator();
                e.Handled = true;
            }
        }

        private void Btn_SearchOk_Click(object sender, EventArgs e)
        {
            Search(0);
        }

        private void Txt_Search_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return || e.KeyCode == Keys.Enter)
            {
                Search(0);
                e.Handled = true;
            }
        }

        private void searchToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Search(0);
        }

        private void searchNextToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Search(_idx + 1);
        }

        private void Cb_ForceXml_CheckedChanged(object sender, EventArgs e)
        {
            try
            {
                if (Cb_ForceXml.Checked)
                {
                    if (Txt_Details.SelectionStart > -1 && Txt_Details.SelectionLength > 0)
                    {
                        string orgText = Txt_Details.Text;
                        int xmlStart = Txt_Details.SelectionStart;
                        int xmlEnd = Txt_Details.SelectionStart + Txt_Details.SelectionLength;

                        string xml = Txt_Details.SelectedText;//_detail.Substring(xmlStart, xmlEnd - xmlStart);

                        string formatedXml;
                        if (Tools.TryIndentXMLString(xml, out formatedXml))
                        {
                            Txt_Details.Text = "";
                            Txt_Details.Text = orgText.Substring(0, xmlStart) + "\r\n";
                            Txt_Details.Text += formatedXml;
                            Txt_Details.Text += "\r\n" + orgText.Substring(xmlEnd, orgText.Length - xmlEnd);
                        }
                        else
                        {
                            Txt_Details.Text = _detail;
                            MessageBox.Show(this, "Impossible to format selected text in XML", "Xml Format", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                            Cb_ForceXml.Checked = false;
                        }
                    }
                    else
                    {
                        MessageBox.Show(this, "You must select XML text before format it", "Xml Format", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        Cb_ForceXml.Checked = false;
                    }
                }
                else
                {
                    Txt_Details.Text = _detail;
                }
            }
            catch
            {
                Txt_Details.Text = _detail;
                MessageBox.Show(this, "Impossible to format text in XML", "Xml Format", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                Cb_ForceXml.Checked = false;
            }
        }

        private void selectAllToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            Txt_Details.SelectAll();
        }

        private void Cb_ShowOrg_CheckedChanged(object sender, EventArgs e)
        {
            if (Cb_ShowOrg.Checked)
            {
                Txt_Details.Text = _detail;
            }
            else
            {
                ApplySeparator();
            }
        }

        #endregion


        #region Methods

        private void Search(int startIdx)
        {
            string detTmp = Txt_Details.Text.ToLower();
            _idx = detTmp.IndexOf(Txt_Search.Text.ToLower(), startIdx);
            if (_idx >= 0)
            {
                Txt_Details.Focus();
                Txt_Details.Select(_idx, Txt_Search.Text.Length);
                Txt_Details.ScrollToCaret();
            }
            else
            {
                MessageBox.Show(this, "No match found", "Search", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }

        }

        //private void SearchAutoSeparator()
        //{
        //    string formating_Separator = ConfigurationManager.AppSettings["Formating_Separator"];
        //    int formating_SeparatorNumber;
        //    if (int.TryParse(ConfigurationManager.AppSettings["Formating_SeparatorNumber"], out formating_SeparatorNumber))
        //    {
        //        string[] separator = formating_Separator.Split(new[] {"OR"}, StringSplitOptions.RemoveEmptyEntries);

        //        foreach (string s in separator)
        //        {
        //            if (Txt_Details.Text.Split(new[] { s }, StringSplitOptions.None).Length >= formating_SeparatorNumber)
        //            {
        //                ApplySeparator(Txt_Details.Text);
        //            }
        //        }
        //    }
        //}

        private void ApplySeparator()
        {
            Txt_Details.Text = !string.IsNullOrEmpty(Txt_Separator.Text) ? 
                                                                             Tools.ApplySeparator(_detail, Txt_Separator.Text) : 
                                                                                                                                   Tools.GetAutoFormatedText(_detail);
            //ApplySeparator(Txt_Separator.Text);
        }

        public void SelectAll()
        {
            Txt_Details.SelectAll();
        }

        public void Search()
        {
            Search(0);
        }

        public void SeachNext()
        {
            Search(_idx + 1);
        }

        private void changeDispayedNameToolStripMenuItem_Click(object sender, EventArgs e)
        {
            InputBox InBox = new InputBox();
            string resultat;
            if ((resultat = InBox.ShowDialog("New tab name ?", TabText)) != null)
                TabText = resultat;
        }

        //private void ApplySeparator(string separator)
        //{
        //    if (String.IsNullOrEmpty(separator))
        //    {
        //        Txt_Details.Text = _detail;
        //    }
        //    else
        //    {
        //        string tmp = Txt_Details.Text;
        //        Txt_Details.Text = tmp.Replace(separator, Txt_Separator.Text + "\r\n");
        //    }
        //}

        #endregion
        
    }
}