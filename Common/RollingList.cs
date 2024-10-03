using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    public class RollingList<T>
    {
        #region Fields

        int _nbrMax = 0;
        int _idx = 0;
        List<T> MyRollingList = new List<T>();

        #endregion


        #region ¨Properties

        public T NextItem
        {
            get
            {
                _idx++;
                IsLast = false;
                IsFirst = false;

                if (_idx == MyRollingList.Count -1)
                    IsLast = true;
                else if (_idx >= MyRollingList.Count || _idx < 0)
                    _idx = 0;

                T tmp = MyRollingList[_idx];
                
                return tmp;
            }
        }

        public T PreviousItem
        {
            get
            {
                _idx--;
                IsFirst = false;
                IsLast = false;

                if (_idx == 0)
                    IsFirst = true;
                else if (_idx >= MyRollingList.Count || _idx < 0)
                    _idx = MyRollingList.Count - 1;

                T tmp = MyRollingList[_idx];
                
                return tmp;
            }
        }

        public int Count
        {
            get { return MyRollingList.Count; }
        }

        public bool IsFirst { get; set; }
        public bool IsLast { get; set; }


        #endregion


        #region Constructor

        public RollingList(int nbrMax)
        {
            _nbrMax = nbrMax;
            IsFirst = false;
            IsLast = true;
        }

        #endregion


        #region Methods

        public void Add(T item)
        {
            MyRollingList.Add(item);
            _idx = MyRollingList.Count - 1;

            if (MyRollingList.Count > _nbrMax)
                MyRollingList.RemoveAt(0);
        }

        #endregion
    }
}
