using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    public class LogBrowserVirtualFile
    {
        public LogBrowserVirtualFile()
        {
        }

        public LogBrowserVirtualFile(string path, string name)
        {
            Path = path;
            Name = name;
        }

        public string Path { get; set; }
        public string Name { get; set; }

        #region Override object
        public LogBrowserVirtualFile Clone()
        {
            return new LogBrowserVirtualFile(Path, Name);
        }

        #region Equals
        public bool Equals(LogBrowserVirtualFile obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            return Equals(obj.Name, Name);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != typeof(LogBrowserVirtualFile)) return false;
            return Equals((LogBrowserVirtualFile)obj);
        }

        public override int GetHashCode()
        {
            return (Name != null ? Name.GetHashCode() : 0);
        }
        #endregion

        public override string ToString()
        {
            return Name;
        } 
        #endregion

        public static int Compare(LogBrowserVirtualFile first, LogBrowserVirtualFile second)
        {
            return string.Compare(first.Name, second.Name);
        }
    }
}
