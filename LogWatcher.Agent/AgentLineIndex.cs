using System.Collections.Concurrent;
using System.Text;

namespace LogWatcher.Agent;

/// <summary>
/// Per-session line index: stores byte offsets for each line in a watched file.
/// Enables O(1) random-access reads by line number.
/// </summary>
public class AgentLineIndex
{
    private readonly ConcurrentDictionary<string, SessionIndex> _sessions = new();

    public void AddLine(string sessionId, string filePath, long byteOffset)
    {
        var idx = _sessions.GetOrAdd(sessionId, _ => new SessionIndex(filePath));
        idx.AddOffset(byteOffset);
    }

    public void ResetSession(string sessionId)
    {
        if (_sessions.TryGetValue(sessionId, out var idx))
            idx.Reset();
    }

    public void RemoveSession(string sessionId)
    {
        _sessions.TryRemove(sessionId, out _);
    }

    public string? GetFilePath(string sessionId)
    {
        return _sessions.TryGetValue(sessionId, out var idx) ? idx.FilePath : null;
    }

    /// <summary>
    /// Reads <paramref name="count"/> lines starting at <paramref name="startLine"/> (0-based).
    /// Falls back to sequential scan if startLine is not in index.
    /// </summary>
    public string[] ReadLines(string sessionId, string filePath, int startLine, int count)
    {
        if (!_sessions.TryGetValue(sessionId, out var idx))
            return Array.Empty<string>();

        long? startOffset = idx.GetOffset(startLine);

        try
        {
            using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite | FileShare.Delete);

            if (startOffset.HasValue)
                fs.Seek(startOffset.Value, SeekOrigin.Begin);

            using var reader = new StreamReader(fs, new UTF8Encoding(false), true, 65536, leaveOpen: true);

            // If no index entry, skip to startLine sequentially
            if (!startOffset.HasValue)
            {
                for (int i = 0; i < startLine; i++)
                {
                    if (reader.ReadLine() == null) return Array.Empty<string>();
                }
            }

            var lines = new List<string>(count);
            for (int i = 0; i < count; i++)
            {
                string? line = reader.ReadLine();
                if (line == null) break;
                lines.Add(line);
            }

            return lines.ToArray();
        }
        catch
        {
            return Array.Empty<string>();
        }
    }

    private sealed class SessionIndex
    {
        private readonly List<long> _offsets = new();
        private readonly object _lock = new();

        public string FilePath { get; }

        public SessionIndex(string filePath)
        {
            FilePath = filePath;
        }

        public void AddOffset(long offset)
        {
            lock (_lock) _offsets.Add(offset);
        }

        public void Reset()
        {
            lock (_lock) _offsets.Clear();
        }

        public long? GetOffset(int lineIndex)
        {
            lock (_lock)
            {
                if (lineIndex < 0 || lineIndex >= _offsets.Count)
                    return null;
                return _offsets[lineIndex];
            }
        }
    }
}
