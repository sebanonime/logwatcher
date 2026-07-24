using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using SharpCompress.Archives;

namespace LogWatcher.Common
{
    public readonly struct ArchiveEntryInfo
    {
        public string Name { get; }
        public bool IsDirectory { get; }
        public long SizeBytes { get; }
        public DateTimeOffset LastModified { get; }

        public ArchiveEntryInfo(string name, bool isDirectory, long sizeBytes, DateTimeOffset lastModified)
        {
            Name = name;
            IsDirectory = isDirectory;
            SizeBytes = sizeBytes;
            LastModified = lastModified;
        }
    }

    /// <summary>
    /// Reads .zip/.7z archives (via SharpCompress) and caches extracted entries as real temp files
    /// so the rest of the pipeline (byte-offset line indexing, tailing, range reads) can treat an
    /// archive entry exactly like a normal file, with no further archive-aware code.
    /// </summary>
    public static class ArchiveEntryCache
    {
        private static readonly ConcurrentDictionary<string, string> _extracted = new(StringComparer.OrdinalIgnoreCase);
        private static readonly string _cacheRoot = Path.Combine(Path.GetTempPath(), "logwatcher-archives");

        /// <summary>
        /// Lists the direct children (files and folders) of <paramref name="internalDir"/> inside the archive.
        /// </summary>
        public static IEnumerable<ArchiveEntryInfo> ListEntries(string archivePath, string internalDir)
        {
            internalDir = ArchivePathHelper.Normalize(internalDir);
            var prefix = string.IsNullOrEmpty(internalDir) ? string.Empty : internalDir + "/";

            using var archive = ArchiveFactory.OpenArchive(archivePath);
            var seenDirs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var entry in archive.Entries)
            {
                var key = entry.Key?.Replace('\\', '/');
                if (string.IsNullOrEmpty(key)) continue;
                if (!key.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)) continue;

                var rest = key.Substring(prefix.Length);
                if (string.IsNullOrEmpty(rest)) continue;

                int slash = rest.IndexOf('/');
                if (slash >= 0)
                {
                    var dirName = rest.Substring(0, slash);
                    if (seenDirs.Add(dirName))
                        yield return new ArchiveEntryInfo(dirName, true, 0, entry.LastModifiedTime ?? DateTimeOffset.MinValue);
                }
                else if (!entry.IsDirectory)
                {
                    yield return new ArchiveEntryInfo(rest, false, entry.Size, entry.LastModifiedTime ?? DateTimeOffset.MinValue);
                }
            }
        }

        /// <summary>
        /// Extracts <paramref name="internalPath"/> from <paramref name="archivePath"/> to a cached local
        /// temp file (once per archive mtime) and returns that file's path.
        /// </summary>
        public static string Resolve(string archivePath, string internalPath)
        {
            internalPath = ArchivePathHelper.Normalize(internalPath);
            long archiveTicks = File.Exists(archivePath) ? File.GetLastWriteTimeUtc(archivePath).Ticks : 0;
            var cacheKey = $"{archivePath}|{archiveTicks}|{internalPath}";

            if (_extracted.TryGetValue(cacheKey, out var existing) && File.Exists(existing))
                return existing;

            Directory.CreateDirectory(_cacheRoot);
            var hash = Math.Abs(cacheKey.GetHashCode()).ToString("x8");
            var extension = Path.GetExtension(internalPath);
            var tempFile = Path.Combine(_cacheRoot, $"{hash}{extension}");

            using (var archive = ArchiveFactory.OpenArchive(archivePath))
            {
                var normalized = internalPath.Replace('\\', '/');
                var entry = archive.Entries.FirstOrDefault(e =>
                    !e.IsDirectory && string.Equals(e.Key?.Replace('\\', '/'), normalized, StringComparison.OrdinalIgnoreCase));
                if (entry == null)
                    throw new FileNotFoundException($"Entry '{internalPath}' not found in archive '{archivePath}'.");

                using var entryStream = entry.OpenEntryStream();
                using var fileStream = new FileStream(tempFile, FileMode.Create, FileAccess.Write, FileShare.None);
                entryStream.CopyTo(fileStream);
            }

            _extracted[cacheKey] = tempFile;
            return tempFile;
        }
    }
}
