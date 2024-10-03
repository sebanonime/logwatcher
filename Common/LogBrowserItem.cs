using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    [Serializable]
    public class LogBrowserItem
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public string Filter { get; set; }

        public LogBrowserItem()
        {
        }

        public LogBrowserItem(string name, string path, string filter)
        {
            Name = name;
            Path = path;
            Filter = filter;
        }

        #region Override object
        public LogBrowserItem Clone()
        {
            return new LogBrowserItem(Name, Path, Filter);
        }

        public bool Equals(LogBrowserItem obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            return Equals(obj.Name, Name);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != typeof(LogBrowserItem)) return false;
            return Equals((LogBrowserItem)obj);
        }

        public override int GetHashCode()
        {
            return (Name != null ? Name.GetHashCode() : 0);
        }

        public override string ToString()
        {
            return Name;
        } 
        #endregion

        public static int Compare(LogBrowserItem first, LogBrowserItem second)
        {
            return string.Compare(first.Name, second.Name);
        }
    }
}
