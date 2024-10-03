using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Threading;

namespace LogWatcher.Common
{
    public class ListLog : IDisposable
    {
        #region Fields

        private class LogData
        {
            public bool Visible { get; set; }
            public string Value { get; set; }
            public int IndexInFullList { get; set; }

            public LogData(string value, bool visible, int indexInFullList)
            {
                Visible = visible;
                Value = value;
                IndexInFullList = indexInFullList;
            }
        }

        private List<LogData> _allLog = new List<LogData>();
        private List<LogData> _filterLog = new List<LogData>();
        private List<long> _hiddenLog = new List<long>();
        private List<HiddenLine> _allHiddenLine;
        private Regex _filterRegex;
        private bool _abortFilter;
        private int _numRowsFiltering;

        #endregion

        #region Properties

        public string this[int index]
        {
            get
            {
                string resu;
                if (IsFiltered)
                {
                    lock (this)
                    {
                        if (index >= 0 && index < _filterLog.Count)
                        {
                            resu = _filterLog[index].Value;
                        }
                        else
                        {
                            resu = ""; // "*********** LOGWATCHER LINE ERROR ************";
                        }
                        //else if (!(_filterLog.Count == 0 && index ==0))
                        //{
                        //    Trace.WriteLine(String.Format("{0} {1} : LOGWATCHER LINE ERROR - index={2} - filterLog.Count={3}",
                        //                                  DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), index, _filterLog.Count));
                        //}
                    }
                }
                else
                {
                    lock (this)
                    {
                        if (index >= 0 && index < _allLog.Count)
                        {
                            resu = _allLog[index].Value;
                        }
                        else
                        {
                            resu = ""; // "*********** LOGWATCHER LINE ERROR ************";
                        }
                        //else if (!(_allLog.Count == 0 && index == 0))
                        //{
                        //    resu = "*********** LOGWATCHER LINE ERROR ************";
                        //    Trace.WriteLine(String.Format("{0} {1} : LOGWATCHER LINE ERROR - index={2} - allLog.Count={3}",
                        //        DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), index, _allLog.Count));
                        //}
                    }
                }

                return resu;
            }
        }

        public bool IsFiltered { get; set; }

        public bool IsLoading { get; set; }

        /// <summary>
        /// Count number of log. Value depends if it's filter or not and if there is hidden log
        /// </summary>
        public int Count
        {
            get
            {
                if (IsFiltered)
                {
                    if (IsLoading)
                        return _numRowsFiltering;
                    
                    return _filterLog!=null ? _filterLog.Count : 0;
                }

                return _allLog!=null ? _allLog.Count : 0;
            }
        }

        /// <summary>
        /// Count all log (hidden log are include)
        /// </summary>
        public int CountAll
        {
            get
            {
                return _allLog.Count;
            }
        }
      
        public int LoadingPosition { get; set; }

        public string FilterCritere 
        {
            get
            {
                return _filterRegex != null ? _filterRegex.ToString() : null;
            }
        }

        public RegexOptions FilterOption
        {
            get
            {
                return _filterRegex != null ? _filterRegex.Options : RegexOptions.None;
            }
        }

        public string OriginalFilterCritere { get; set; }

        #endregion

        #region Constructor

        public ListLog()
        {
            LoadingPosition = 0;
        }

        public ListLog(string originalCritere, List<HiddenLine> allHiddenLine)
        {
            LoadingPosition = 0;
            _allHiddenLine = allHiddenLine;
            OriginalFilterCritere = originalCritere;
        }

        #endregion

        #region Methods

        public void Add(string mess)
        {
            lock (this)
            {
                if (_allLog != null && !string.IsNullOrEmpty(mess))
                {
                    LogData dataTmp = new LogData(mess, true, _allLog.Count);
                    if (IsFiltered && TestWithCritere(mess))
                    {
                        if (_filterLog != null)
                        {
                            _filterLog.Add(dataTmp);
                        }
                    }

                    _allLog.Add(dataTmp);
                }
            }
        }

        public void Remove(string mess)
        {
            lock (this)
            {
                int idx = _allLog.FindIndex(i => i != null ? i.Value == mess : false);
                if (idx >= 0)
                {
                    _allLog.RemoveAt(idx);
                }
            }
        }

        public void Clear()
        {
            lock (this)
            {
                _allLog.Clear();
                _filterLog.Clear();
                _hiddenLog.Clear();
            }
        }

        public string GetDataWithoutFilter(int index, bool showHiddenLine)
        {
            string resu = "";
            if (showHiddenLine)
            {
                resu = _allLog[index].Value;
            }
            else
            {
                int nbr = SearchIndexWithHiddenLine(index);
                if (nbr >= 0 && nbr < _allLog.Count)
                    resu = _allLog[nbr].Value;
            }

            return resu;
        }

        public int GetRealIndexOfFilterIndex(int index)
        {
            return IsFiltered ? _filterLog[index].IndexInFullList : SearchIndexWithHiddenLine(index);
        }

        #region Methods for hidden logs

        private int SearchIndexWithHiddenLine(int index)
        {
            int resu = 0;
            for (int i = 0; i < _hiddenLog.Count; i++)
            {
                if (_hiddenLog[i] > index + resu)
                {
                    if (index + resu >= _allLog.Count - 1)
                        return _allLog.Count - 1;

                    break;
                }
                resu = i + 1;
            }

            return index + resu;
        }

        //public void RefreshHiddenLogs(List<string> profileHiddenlog)
        //{
        //    IsLoading = true;
        //    _hiddenLog.Clear();
        //    if (profileHiddenlog.Count > 0)
        //    {
        //        for (int i = 0; i < _allLog.Count; i++)
        //        {
        //            LoadingPosition++;
        //            if (TestHiddenLine(profileHiddenlog, _allLog[i].Value))
        //            {
        //                _hiddenLog.Add(i);
        //            }
        //        }
        //    }

        //    IsLoading = false;
        //}

        //private bool TestHiddenLine(IEnumerable<string> profileHiddenlog, string message)
        //{
        //    foreach (string strTmp in profileHiddenlog)
        //    {
        //        if (message.Contains(strTmp))
        //            return true;
        //    }

        //    return false;
        //}

        #endregion

        #region Methods for Filter

        public int ApplyFilter(string critere, RegexOptions option)
        {
            _numRowsFiltering = 0;
            _abortFilter = false;
            IsLoading = true;
            IsFiltered = true;
            //FilterCritere = critere;
            try
            {
                _filterRegex = new Regex(critere, RegexOptions.Compiled | option);
            }
            catch
            {
                return -1;
            }

            LoadingPosition = 0;

            try
            {
                _filterLog = _allLog.FindAll(FilterList);
                IsLoading = false;
                return _filterLog.Count;
            }
            catch (AbortFilterException)
            {
                IsFiltered = false;
                IsLoading = false;
                return -2;
            }
        }

        public void AbortFilter()
        {
            _abortFilter = true;
        }

        public void RemoveFilter()
        {
            _filterLog.Clear();
            IsFiltered = false;
        }

        private bool FilterList(LogData log2Test)
        {
            if (_abortFilter)
                throw new AbortFilterException();

            LoadingPosition++;

            bool resu = log2Test.Visible ? TestWithCritere(log2Test.Value) : false;
            if (resu)
                _numRowsFiltering++;

            return resu;
        }

        private bool TestWithCritere(string str2Test)
        {
            return _filterRegex.IsMatch(str2Test);
        }

        #endregion

        #endregion

        #region IDisposable Membres

        public void Dispose()
        {
            if (_allLog != null)
            {
                _allLog.Clear();
                _allLog = null;
            }

            if (_filterLog != null)
            {
                _filterLog.Clear();
                _filterLog = null;
            }

            if (_hiddenLog != null)
            {
                _hiddenLog.Clear();
                _hiddenLog = null;
            }

            _filterRegex = null;

        }

        #endregion

        class AbortFilterException : Exception
        {
        }
    }

    
}
