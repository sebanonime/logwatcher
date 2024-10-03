using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using WeifenLuo.WinFormsUI.Docking;
using LogWatcher.Common;

namespace LogWatcher.Frm
{
    public partial class Frm_SelectedView : FormDocContent
    {
        #region Fields

        private static Frm_SelectedView _singleton;
        private static readonly object SyncObj = new object();
        private delegate void GUIDelegate();

        #endregion 

        #region Properties

        public static Frm_SelectedView Singleton
        {
            get
            {
                lock (SyncObj)
                {
                    if (_singleton == null || !_singleton.IsHandleCreated)
                        _singleton = new Frm_SelectedView();

                    return _singleton;
                }
            }
        }

        #endregion

        #region Contructor

        private Frm_SelectedView()
        {
            InitializeComponent();
        }

        #endregion

        public void ChangeDisplayText(string text)
        {
            Txt_SelectedText.Text = Tools.GetAutoFormatedText(text);
        }

        private void selectAllToolStripMenuItem_Click_1(object sender, EventArgs e)
        {
            Txt_SelectedText.SelectAll();
        }

    }
}