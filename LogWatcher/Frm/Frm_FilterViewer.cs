using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace LogWatcher.Frm
{
    public partial class Frm_FilterViewer : Form
    {
        private bool applyFilter;
        public string Filter { get; private set; }

        public Frm_FilterViewer()
        {
            InitializeComponent();
        }

        #region GUI Event handler

        private void Btn_Apply_Click(object sender, EventArgs e)
        {
            applyFilter = true;
            Filter = Txt_Filter.Text;
            Close();
        }

        private void Btn_Cancel_Click(object sender, EventArgs e)
        {
            applyFilter = false;
            Filter = null;
            Close();
        }

        private void Txt_Filter_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)Keys.Return || e.KeyChar == (char)Keys.Enter)
            {
                applyFilter = true;
                Filter = Txt_Filter.Text;
                e.Handled = true;
                Close();
            }

            if (e.KeyChar == (char)Keys.Escape)
            {
                e.Handled = true;
                Close();
            }
        }

        #endregion

        #region Methods

        public bool ShowDialog(String filter)
        {
            Txt_Filter.Text = filter;
            ShowDialog();
            return applyFilter;
        } 
        #endregion
    }
}
