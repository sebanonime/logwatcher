using System;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using LogWatcher.Common;

namespace LogWatcher.Frm
{
    public partial class Frm_FilterHistoric : FormDocContent
    {
        #region Fields

        private static readonly object SyncObj = new object();
        private static Frm_FilterHistoric _singleton;
        readonly SortableBindingList<FilterHistoric> _filterHistoricBindingList = new SortableBindingList<FilterHistoric>();

        #endregion

        #region Properties

        public static Frm_FilterHistoric Singleton
        {
            get
            {
                lock (SyncObj)
                {
                    if (_singleton == null || !_singleton.IsHandleCreated)
                        _singleton = new Frm_FilterHistoric();

                    return _singleton;
                }
            }
        }

        #endregion

        #region Constructors

        private Frm_FilterHistoric()
        {
            InitializeComponent();
        }

        #endregion

        #region GUI Event handler

        private void Frm_FilterHistoric_Shown(object sender, EventArgs e)
        {
            for (int i = 0; i < Frm_Master.Singleton.AutoCompletSource.Count; i++)
            {
                string s = Frm_Master.Singleton.AutoCompletSource[i];
                _filterHistoricBindingList.Add(new FilterHistoric(s, DateTime.Now.AddMilliseconds(i)));
            }

            _filterHistoricBindingList.Sort(CompareFilterForSort);
            filterHistoricBindingSource.DataSource = _filterHistoricBindingList;
        }

        private void Lst_FilterHistoric_Click(object sender, EventArgs e)
        {
            FilterHistoric filterTmp = Lst_FilterHistoric.SelectedItem as FilterHistoric;
            if (filterTmp != null) 
                Txt_SelectedFilter.Text = filterTmp.Critere;
        }

        private void Lst_FilterHistoric_DoubleClick(object sender, EventArgs e)
        {
            //Frm_Master.Singleton.CurrentLog.FilterData(Lst_FilterHistoric.SelectedItem.ToString());
            FilterHistoric filterTmp = Lst_FilterHistoric.SelectedItem as FilterHistoric;
            if (filterTmp != null)
                Frm_Master.Singleton.FilterLog(filterTmp.Critere, RegexOptions.IgnoreCase);
        }

        
        private void Btn_ApplyFilter_Click(object sender, EventArgs e)
        {
            Frm_Master.Singleton.FilterLog(Txt_SelectedFilter.Text, RegexOptions.IgnoreCase);
        }

        private void Btn_Search_Click(object sender, EventArgs e)
        {
            Frm_Master.Singleton.SearchLog(Txt_SelectedFilter.Text, true);
        }

        private void Txt_SelectedFilter_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)Keys.Return || e.KeyChar == (char)Keys.Enter)
            {
                Frm_Master.Singleton.FilterLog(Txt_SelectedFilter.Text, RegexOptions.IgnoreCase);
                e.Handled = true;
            }
        }

        #endregion

        #region Methods

        public void RefreshData(string newCritere)
        {
            FilterHistoric existOne = _filterHistoricBindingList.Find(new SearchFilter(newCritere).Search);
            if (existOne == null)
            {
                _filterHistoricBindingList.Add(new FilterHistoric(newCritere));
            }
            else
            {
                existOne.CritereDate = DateTime.Now;
            }
            _filterHistoricBindingList.Sort(CompareFilterForSort);
        }
        
        private static int CompareFilterForSort(FilterHistoric first, FilterHistoric second)
        {
            if (first.CritereDate < second.CritereDate)
                return 1;

            if (first.CritereDate == second.CritereDate)
                return 0;

            return -1;
        }

        #endregion

        #region Inner class

        private class SearchFilter
        {
            public string FilterToSearch { get; set; }

            /// <summary>
            /// Initialise une nouvelle instance de la classe <see cref="T:System.Object" />.
            /// </summary>
            public SearchFilter(string filter)
            {
                FilterToSearch = filter;
            }

            public bool Search(FilterHistoric filter)
            {
                return filter.Critere == FilterToSearch;
            }
        }

        #endregion

        
    }
}
