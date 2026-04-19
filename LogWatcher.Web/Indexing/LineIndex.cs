using System.Runtime.InteropServices;

namespace LogWatcher.Web.Indexing
{
    /// <summary>
    /// Stores the byte offset of the start of every line in the file.
    /// Index[0] = offset of line 0 (always 0 for a new file).
    /// Index[N] = offset of the first byte of line N.
    ///
    /// For a 200 MB file with ~1M lines this uses ~8 MB of RAM.
    /// Thread-safe for concurrent reads + single-writer appends.
    /// </summary>
    public class LineIndex
    {
        private readonly List<long> _offsets = new(capacity: 100_000);
        private readonly ReaderWriterLockSlim _lock = new();

        public long TotalBytes { get; set; }

        public int Count
        {
            get
            {
                _lock.EnterReadLock();
                try { return _offsets.Count; }
                finally { _lock.ExitReadLock(); }
            }
        }

        public void AddOffset(long offset)
        {
            _lock.EnterWriteLock();
            try { _offsets.Add(offset); }
            finally { _lock.ExitWriteLock(); }
        }

        public long GetOffset(int lineIndex)
        {
            _lock.EnterReadLock();
            try { return _offsets[lineIndex]; }
            finally { _lock.ExitReadLock(); }
        }

        /// <summary>
        /// Returns the byte length of a line (distance to the next line start, or to TotalBytes).
        /// </summary>
        public int GetLineByteLength(int lineIndex)
        {
            _lock.EnterReadLock();
            try
            {
                long start = _offsets[lineIndex];
                long end = lineIndex + 1 < _offsets.Count ? _offsets[lineIndex + 1] : TotalBytes;
                return (int)(end - start);
            }
            finally { _lock.ExitReadLock(); }
        }

        /// <summary>Snapshot a contiguous range of offsets without holding the lock.</summary>
        public (long[] offsets, int count) GetRange(int start, int count)
        {
            _lock.EnterReadLock();
            try
            {
                int available = Math.Min(count, _offsets.Count - start);
                if (available <= 0) return (Array.Empty<long>(), 0);
                var result = new long[available];
                CollectionsMarshal.AsSpan(_offsets).Slice(start, available).CopyTo(result);
                return (result, available);
            }
            finally { _lock.ExitReadLock(); }
        }

        public void Clear()
        {
            _lock.EnterWriteLock();
            try
            {
                _offsets.Clear();
                TotalBytes = 0;
            }
            finally { _lock.ExitWriteLock(); }
        }
    }
}
