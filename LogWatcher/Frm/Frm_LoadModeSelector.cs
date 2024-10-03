using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using LogWatcher.Common;

namespace LogWatcher.Frm
{
    public partial class Frm_LoadModeSelector : Form
    {
        private BindingList<LoadMode> _lstMode = new BindingList<LoadMode>();

        public LoadMode.AllLoadMode SelectedMode { get; set; }

        public Frm_LoadModeSelector()
        {
            InitializeComponent();

            //_lstMode.Add(new LoadMode(LoadMode.AllLoadMode.EndOfFile, "Load Only the end of file", ""));
            //_lstMode.Add(new LoadMode(LoadMode.AllLoadMode.SimpleFilter, "Load Only rows match with filter", ""));
            //_lstMode.Add(new LoadMode(LoadMode.AllLoadMode.Full, "Normal : load full file", ""));
            

            //loadModeBindingSource.DataSource = _lstMode;
            //_lstMode.Add(new LoadMode(LoadMode.AllLoadMode.StartAtPosition, "Load Only the end of file", ""));
        }

        public DialogResult ShowDialog(IWin32Window owner, String FileSize)
        {
            Lbl_FileSize.Text = string.Format("File size : {0}", FileSize);
            return ShowDialog(owner);
        }

        private void Frm_LoadModeSelector_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)Keys.NumPad1|| e.KeyChar == (char)Keys.D1)
            {
                Rb_Eof.Checked = true;
            }

            if (e.KeyChar == (char)Keys.NumPad2 || e.KeyChar == (char)Keys.D2)
            {
                Rb_Filter.Checked = true;
            }

            if (e.KeyChar == (char)Keys.NumPad3 || e.KeyChar == (char)Keys.D3)
            {
                Rb_Full.Checked = true;
            }

            if (/*e.KeyChar == (char)Keys.Return || e.KeyChar == (char)Keys.Enter
                ||*/ e.KeyChar == (char)Keys.NumPad1 || e.KeyChar == (char)Keys.D1
                || e.KeyChar == (char)Keys.NumPad2 || e.KeyChar == (char)Keys.D2
                || e.KeyChar == (char)Keys.NumPad3|| e.KeyChar == (char)Keys.D3)
            {
                SetLoadMode();
                //e.Handled = true;
                //Close();
            }
        }

        private void Btn_Ok_Click(object sender, EventArgs e)
        {
            SetLoadMode();
        }

        private void SetLoadMode()
        {
            LoadMode.AllLoadMode lm;
            if (Rb_Eof.Checked)
                lm = LoadMode.AllLoadMode.EndOfFile;
            else if (Rb_Filter.Checked)
                lm = LoadMode.AllLoadMode.SimpleFilter;
            else if (Rb_Full.Checked)
                lm = LoadMode.AllLoadMode.Full;
            else
                lm = LoadMode.AllLoadMode.Full;


            SelectedMode = lm;
        }

        private void Btn_Cancel_Click(object sender, EventArgs e)
        {
            Close();
        }

        
    }
}
