using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using WeifenLuo.WinFormsUI.Docking;

namespace LogWatcher.Frm
{
    public partial class Frm_DetailViewMaster : Form
    {
        #region Fields

        private static Frm_DetailViewMaster _singleton;
        private static readonly object SyncObj = new object();
        private bool _topMost = false;

        #endregion

        #region Properties

        public static Frm_DetailViewMaster Singleton
        {
            get
            {
                lock (SyncObj)
                {
                    if (_singleton == null || !_singleton.IsHandleCreated)
                        _singleton = new Frm_DetailViewMaster();

                    return _singleton;
                }
            }
        }

        #endregion

        private Frm_DetailViewMaster()
        {
            InitializeComponent();
        }

        public void AddForm(DockContent form, bool topMost)
        {
            if (!Visible)
            {
                Show();
            }

            StartPosition = FormStartPosition.CenterParent;
            _topMost = topMost;
            TopMost = true;
            form.TopMost = _topMost;
            form.Show(DckPnl_Detail);
        }

        private void selectAllToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Frm_DetailView dtv = DckPnl_Detail.ActiveContent.DockHandler.Form as Frm_DetailView;
            if (dtv != null)
            {
                dtv.SelectAll();
            }
        }

        private void searchToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Frm_DetailView dtv = DckPnl_Detail.ActiveContent.DockHandler.Form as Frm_DetailView;
            if (dtv != null)
            {
                dtv.Search();
            }
        }

        private void searchNextToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Frm_DetailView dtv = DckPnl_Detail.ActiveContent.DockHandler.Form as Frm_DetailView;
            if (dtv != null)
            {
                dtv.SeachNext();
            }
        }

        private void Frm_DetailViewMaster_Activated(object sender, EventArgs e)
        {
            TopMost = _topMost;
        }

        private void Frm_DetailViewMaster_Shown(object sender, EventArgs e)
        {
            TopMost = _topMost;
        }
    }
}
