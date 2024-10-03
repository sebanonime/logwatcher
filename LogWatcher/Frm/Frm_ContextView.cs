using System;
using System.Drawing;
using System.Windows.Forms;
using System.Threading;
using LogWatcher.Common;
using System.Configuration;

namespace LogWatcher.Frm
{
    public partial class Frm_ContextView : Form
    {
        #region Fields

        private readonly ListLog _allLog;
        private int _selectedIndex;
        private readonly int _nbrRowsInContext;
        private readonly int _nbrRowsInContextDiv2;
        private readonly int _selectedIndexOrg;
        private int _previousAndNextInc;
        private int _maxLineSize;

        private delegate void GUIDelegate();

        #endregion 


        #region Constructor

        public Frm_ContextView(ListLog allLog, int selecteIndex)
        {
            InitializeComponent();

            string maxLineSizeStr = ConfigurationManager.AppSettings["MaxLineSize"];
            if (!int.TryParse(maxLineSizeStr, out _maxLineSize))
            {
                _maxLineSize = 20000;
            }

            Dgv_ContextView.DefaultCellStyle.Font = LogConfig.Singleton.DefaultFont.GetFont();
            _nbrRowsInContext = LogConfig.Singleton.ContextRowNbr;

            if (_nbrRowsInContext == 0)
            {
                _nbrRowsInContext = 50;
                LogConfig.Singleton.ContextRowNbr = 50;
            }
            //Frm_Master.Singleton.CurrentLog.LogCache.
            _allLog = allLog;

            //if (allLog.IsFiltered)
            _selectedIndex = allLog.GetRealIndexOfFilterIndex(selecteIndex);
            _selectedIndexOrg = _selectedIndex;
            //else
            //    _selectedIndex = selecteIndex;

            _nbrRowsInContextDiv2 = (_nbrRowsInContext / 2);
            _previousAndNextInc = _nbrRowsInContext;
        }

        #endregion


        #region Event Handler

        private void Frm_ContextView_Shown(object sender, EventArgs e)
        {
            LoadContext();
        }

        private void Btn_Previous_Click(object sender, EventArgs e)
        {
            //_selectedIndexOrg = _selectedIndex - _nbrRowsInContextDiv2;
            _selectedIndex = _selectedIndex - _previousAndNextInc;
            if (_selectedIndex <= _nbrRowsInContextDiv2)
            {
                _selectedIndex = _nbrRowsInContextDiv2;
                Btn_Previous.Enabled = false;
            }

            Btn_Next.Enabled = true;
            LoadContext();
        }

        private void Btn_Next_Click(object sender, EventArgs e)
        {
            //_selectedIndexOrg = _selectedIndex - _nbrRowsInContextDiv2;
            //_selectedIndexOrg = _selectedIndexOrg > 0 ? _selectedIndexOrg : 0;

            _selectedIndex = _selectedIndex + _previousAndNextInc;
            int logCount = _allLog.CountAll - 1;
            if (_selectedIndex >= logCount - _nbrRowsInContextDiv2)
            {
                _selectedIndex = logCount - _nbrRowsInContextDiv2;
                Btn_Next.Enabled = false;
            }

            Btn_Previous.Enabled = true;
            LoadContext();
        }

        private void Btn_DetailView_Click(object sender, EventArgs e)
        {
            ShowDetailView();
        }

        private void detailViewToolStripMenuItem_Click(object sender, EventArgs e)
        {
            ShowDetailView();
        }


        #endregion


        #region Methods

        private void LoadContext()
        {
            ThreadPool.QueueUserWorkItem(delegate
                                             {
                                                 BeginInvoke(new GUIDelegate(() => Dgv_ContextView.Rows.Clear()));

                                                 int startIdx = _selectedIndex - _nbrRowsInContextDiv2;
                                                 startIdx = startIdx < 0 ? 0 : startIdx;

                                                 int endIdx = _selectedIndex + _nbrRowsInContextDiv2;
                                                 endIdx = endIdx > _allLog.CountAll - 1 ? _allLog.CountAll - 1 : endIdx;

                                                 int selectedIdxTmp = 0;
                                                 for (int i = startIdx; i <= endIdx; i++)
                                                 {
                                                     string messFull = _allLog.GetDataWithoutFilter(i, true);
                                                     string mess = messFull.Length > _maxLineSize && _maxLineSize > 0 ? messFull.Substring(0, _maxLineSize) : messFull;
                                                     
                                                     Highlighting resu = Frm_Master.Singleton.CurrentLog.GiveMeRowColor(LogConfig.Singleton.DicoHighlighting, mess, true);
                                                     AddRow(mess, resu.ForeColor, resu.BackColor);

                                                     if (i < _selectedIndex)
                                                         selectedIdxTmp++;
                                                 }

                                                 //if (_selectedIndex == _selectedIndexOrg 
                                                 //    || _selectedIndex - _nbrRowsInContextDiv2 >= _selectedIndexOrg)
                                                 //if (_selectedIndexOrg > 0)
                                                 //{

                                                 // ici on traite l'affichage de la ligne selectionné initialement
                                                     BeginInvoke(new GUIDelegate(delegate
                                                     {
                                                         int selectedIndexInCtx = _selectedIndexOrg - startIdx;
                                                         if (Dgv_ContextView.RowCount > 0 && selectedIndexInCtx >= 0 && Dgv_ContextView.RowCount > selectedIndexInCtx)
                                                         {
                                                             Dgv_ContextView.Rows[0].Selected = false;
                                                             Dgv_ContextView.Rows[selectedIndexInCtx].Selected = true;

                                                             Dgv_ContextView.FirstDisplayedScrollingRowIndex = selectedIndexInCtx - 10 > 0 ? selectedIndexInCtx - 10 : selectedIndexInCtx;

                                                             DataGridViewAdvancedBorderStyle tmp = new DataGridViewAdvancedBorderStyle();
                                                             tmp.All = DataGridViewAdvancedCellBorderStyle.OutsetDouble;

                                                             DataGridViewCellStyle cellTmp = new DataGridViewCellStyle();
                                                             cellTmp.Font = new Font("Arial", 12, FontStyle.Bold);
                                                             cellTmp.BackColor = Color.BlueViolet;
                                                             cellTmp.ForeColor = Color.HotPink;
                                                             Dgv_ContextView.Rows[selectedIndexInCtx].Cells[0].Style = cellTmp;
                                                             Dgv_ContextView.Rows[selectedIndexInCtx].Cells[0].AdjustCellBorderStyle(tmp, tmp, false, false, false, false);
                                                             //Dgv_ContextView.CellBorderStyle = DataGridViewCellBorderStyle.Raised;
                                                             //Dgv_ContextView.GridColor = Color.Red;
                                                         }
                                                     }));
                                                 //}
                                             });
        }

        private void AddRow(string message, Color foreColor, Color backColor)
        {
            DataGridViewRow rowTmp = new DataGridViewRow();
            rowTmp.CreateCells(Dgv_ContextView, message);

            rowTmp.Cells[0].Style.BackColor = backColor;
            rowTmp.Cells[0].Style.ForeColor = foreColor;

            BeginInvoke(new GUIDelegate(() => Dgv_ContextView.Rows.Add(rowTmp)));
        }

        private void ShowDetailView()
        {
            DataGridView tmp = Dgv_ContextView;
            if (tmp.SelectedRows.Count > 0)
            {
                
                string valTmp = tmp.SelectedRows[0].Cells[0].Value.ToString();
                Frm_DetailView dtv = new Frm_DetailView(valTmp);
                //dtv.TopMost = TopMost;
                //dtv.StartPosition = FormStartPosition.CenterParent;
                //dtv.Show(this);
                Frm_DetailViewMaster.Singleton.AddForm(dtv, TopMost);
            }
            else
            {
                MessageBox.Show("You must select a row", "INFO", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }
        }

        #endregion

        private void Btn_Cancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        //private void Dgv_ContextView_CellPainting(object sender, DataGridViewCellPaintingEventArgs e)
        //{
        //    if (e.RowIndex == 2)
        //    {
        //        Pen p = new Pen(Color.Red);
        //        e.Graphics.FillRectangle(new SolidBrush(Color.Red), e.CellBounds);
        //        e.Graphics.DrawRectangle(p, e.CellBounds);
        //        e.Graphics.DrawRectangle(p, new Rectangle(e.CellBounds.X, e.CellBounds.Y, e.CellBounds.Width, e.CellBounds.Height));

        //    }
        //}

    }
}