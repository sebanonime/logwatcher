using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    public class StoredFilter
    {
        public string Name { get; set; }
        public string Filter { get; set; }
        public bool IsRegex { get; set; }
        public bool CaseSensitive { get; set; }
        
        public StoredFilter()
        {
        }

        public StoredFilter(string name, string filter, bool isRegex, bool caseSensitive)
        {
            Name = name;
            Filter = filter;
            IsRegex = isRegex;
            CaseSensitive = caseSensitive;
        }

        public StoredFilter Clone()
        {
            return new StoredFilter(Name, Filter, IsRegex, CaseSensitive);
        }

        public override string ToString()
        {
            return this.Name;
        }

        public bool Equals(StoredFilter obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            return Equals(obj.Name, Name);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != typeof(StoredFilter)) return false;
            return Equals((StoredFilter)obj);
        }

        public override int GetHashCode()
        {
            return (Name != null ? Name.GetHashCode() : 0);
        }

        public static int Compare(StoredFilter first, StoredFilter second)
        {
            return string.Compare(first.Name, second.Name);
        }
    }
}
