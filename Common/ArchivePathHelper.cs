using System;
using System.IO;
using System.Linq;

namespace LogWatcher.Common
{
    /// <summary>
    /// Convention for referencing an entry inside a .zip/.7z archive using a single string path:
    ///   "&lt;archiveFilePath&gt;::&lt;internalEntryPath&gt;"
    /// A bare path ending in .zip/.7z (no separator) refers to the archive's root.
    /// The separator "::" never occurs in real Windows/UNC/Linux paths, so it is safe to search for.
    /// </summary>
    public static class ArchivePathHelper
    {
        public const string EntrySeparator = "::";

        private static readonly string[] SupportedExtensions = { ".zip", ".7z" };

        public static bool IsArchiveFile(string path)
        {
            if (string.IsNullOrEmpty(path)) return false;
            var ext = Path.GetExtension(path);
            return SupportedExtensions.Any(e => string.Equals(e, ext, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Attempts to split <paramref name="path"/> into an archive file path and an internal entry path.
        /// Returns true if <paramref name="path"/> denotes an archive (root or an entry inside one).
        /// </summary>
        public static bool TryParse(string path, out string archivePath, out string internalPath)
        {
            archivePath = null;
            internalPath = null;
            if (string.IsNullOrEmpty(path)) return false;

            int idx = path.IndexOf(EntrySeparator, StringComparison.Ordinal);
            if (idx >= 0)
            {
                archivePath = path.Substring(0, idx);
                internalPath = Normalize(path.Substring(idx + EntrySeparator.Length));
                return true;
            }

            if (IsArchiveFile(path))
            {
                archivePath = path;
                internalPath = string.Empty;
                return true;
            }

            return false;
        }

        public static string Combine(string archivePath, string internalPath)
        {
            internalPath = Normalize(internalPath);
            return string.IsNullOrEmpty(internalPath)
                ? archivePath
                : archivePath + EntrySeparator + internalPath;
        }

        /// <summary>Normalizes separators to '/' and trims leading/trailing slashes.</summary>
        public static string Normalize(string internalPath)
        {
            if (string.IsNullOrEmpty(internalPath)) return string.Empty;
            return internalPath.Replace('\\', '/').Trim('/');
        }
    }
}
