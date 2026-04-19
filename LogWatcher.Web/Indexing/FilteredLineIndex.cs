using System.Runtime.InteropServices;

namespace LogWatcher.Web.Indexing
{
    /// <summary>
    /// Maps filtered line numbers → original line numbers.
    /// Used when a search filter is active: the frontend asks for "filtered line 42"
    /// and we resolve it to the real line number in LineIndex.
    ///
    /// For a 200MB file with a 10% match rate: 100K ints = ~400 KB RAM.
    /// </summary>
    public class FilteredLineIndex
    {
        private readonly List<int> _mappings = new();
        private readonly ReaderWriterLockSlim _lock = new();

        public int Count
        {
            get
            {
                _lock.EnterReadLock();
                try { return _mappings.Count; }
                finally { _lock.ExitReadLock(); }
            }
        }

        public void Add(int originalLineNumber)
        {
            _lock.EnterWriteLock();
            try { _mappings.Add(originalLineNumber); }
            finally { _lock.ExitWriteLock(); }
        }

        public int GetOriginalLine(int filteredIndex)
        {
            _lock.EnterReadLock();
            try { return _mappings[filteredIndex]; }
            finally { _lock.ExitReadLock(); }
        }

        public int[] GetOriginalLineRange(int start, int count)
        {
            _lock.EnterReadLock();
            try
            {
                int available = Math.Min(count, _mappings.Count - start);
                if (available <= 0) return Array.Empty<int>();
                var result = new int[available];
                CollectionsMarshal.AsSpan(_mappings).Slice(start, available).CopyTo(result);
                return result;
            }
            finally { _lock.ExitReadLock(); }
        }

        public void Clear()
        {
            _lock.EnterWriteLock();
            try { _mappings.Clear(); }
            finally { _lock.ExitWriteLock(); }
        }
    }
}
