using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace LogWatcher.Common
{
    public class SortableBindingList<T> : BindingList<T>
    {
        public SortableBindingList()
        {
        }

        public SortableBindingList(IList<T> list) : base(list)
        {
        }

        #region Sorting

        private bool _isSorted;

        protected override bool SupportsSortingCore
        {
            get { return true; }
        }

        public void Sort(Comparison<T> comparer)
        {
            // Get list to sort
            List<T> items = Items as List<T>;

            // Apply and set the sort, if items to sort
            if (items != null)
            {
                //PropertyComparer<T> pc = new PropertyComparer<T>(property, direction);
                items.Sort(comparer);
                _isSorted = true;
            }
            else
            {
                _isSorted = false;
            }

            // Let bound controls know they should refresh their views
            OnListChanged(new ListChangedEventArgs(ListChangedType.Reset, -1));
        }

        public T Find(Predicate<T> match)
        {
            List<T> items = Items as List<T>;

            if (items != null)
            {
                T resu = items.Find(match);
                return resu;
            }

            throw new NotSupportedException("This Type is not supported");
        }

        protected override void ApplySortCore(PropertyDescriptor property, ListSortDirection direction)
        {
            // Get list to sort
            List<T> items = Items as List<T>;

            // Apply and set the sort, if items to sort
            if (items != null)
            {
                PropertyComparer<T> pc = new PropertyComparer<T>(property, direction);
                items.Sort(pc);
                _isSorted = true;
            }
            else
            {
                _isSorted = false;
            }

            // Let bound controls know they should refresh their views
            OnListChanged(new ListChangedEventArgs(ListChangedType.Reset, -1));
        }

        protected override bool IsSortedCore
        {
            get { return _isSorted; }
        }

        protected override void RemoveSortCore()
        {
            _isSorted = false;
        }

        #endregion

        #region Persistence

        // NOTE: BindingList<T> is not serializable but List<T> is

        public void Save(string filename)
        {
            BinaryFormatter formatter = new BinaryFormatter();
            using (FileStream stream = new FileStream(filename, FileMode.Create))
            {
                // Serialize data list items
                formatter.Serialize(stream, Items);
            }
        }

        public void Load(string filename)
        {

            ClearItems();

            if (File.Exists(filename))
            {
                BinaryFormatter formatter = new BinaryFormatter();
                using (FileStream stream = new FileStream(filename, FileMode.Open))
                {
                    // Deserialize data list items
                    ((List<T>)Items).AddRange((IEnumerable<T>)formatter.Deserialize(stream));
                }
            }

            // Let bound controls know they should refresh their views
            OnListChanged(new ListChangedEventArgs(ListChangedType.Reset, -1));
        }

        #endregion
    }
}
