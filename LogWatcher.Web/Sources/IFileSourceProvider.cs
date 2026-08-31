#nullable enable

using LogWatcher.Web.Dto;

namespace LogWatcher.Web.Sources
{
    public record FileSourceInfo(string Path, long SizeBytes, bool Exists, DateTimeOffset LastModified);
    public record TailChunk(byte[] Bytes, bool IsReset);

    /// <summary>
    /// Abstracts file access for local, SMB, and agent sources.
    /// All file content flows through this interface as raw bytes so
    /// the LineIndexBuilder can compute exact byte offsets for each line.
    /// </summary>
    public interface IFileSourceProvider : IAsyncDisposable
    {
        string SourceType { get; }  // "local" | "smb" | "agent"

        Task<FileSourceInfo> GetFileInfoAsync(string path, CancellationToken ct = default);

        /// <summary>
        /// Streams raw bytes from <paramref name="fromByteOffset"/> to end-of-file.
        /// Used by LineIndexBuilder on initial load.
        /// </summary>
        IAsyncEnumerable<ReadOnlyMemory<byte>> ReadRawAsync(
            string path, long fromByteOffset, CancellationToken ct);

        /// <summary>
        /// Reads an exact byte range. Used for page reads after the index is built.
        /// </summary>
        Task<byte[]> ReadBytesAsync(string path, long from, int count, CancellationToken ct);

        /// <summary>
        /// Reads a contiguous byte range in a single I/O call.
        /// More efficient than multiple ReadBytesAsync calls for bulk line reads.
        /// </summary>
        Task<byte[]> ReadRangeBytesAsync(string path, long from, long to, CancellationToken ct);

        /// <summary>
        /// Streams newly appended bytes as they arrive (real-time tail).
        /// Yields a chunk with IsReset=true when the file is truncated or replaced.
        /// </summary>
        IAsyncEnumerable<TailChunk> TailAsync(
            string path, long fromByteOffset, CancellationToken ct);

        /// <summary>Directory listing for the file browser UI.</summary>
        Task<IEnumerable<RemoteFileInfoDto>> ListFilesAsync(
            string directory, string pattern, CancellationToken ct = default);

        /// <summary>
        /// Reads lines by line number. Returns null if not supported (falls back to byte-range reads).
        /// Agent sources implement this via RequestLines to avoid raw byte transfers.
        /// </summary>
        Task<LineDto[]?> ReadLinesByNumberAsync(string sessionId, int startLine, int count, CancellationToken ct)
            => Task.FromResult<LineDto[]?>(null);

        /// <summary>
        /// Builds a filter index on the source side. Returns null if not supported (falls back to stream scan).
        /// Agent sources implement this to avoid transmitting the full file to the backend.
        /// </summary>
        Task<int[]?> BuildFilterAsync(FilterOptionsDto options, string sessionId, CancellationToken ct)
            => Task.FromResult<int[]?>(null);

        /// <summary>
        /// Searches file contents on the source side. Returns null if not supported (falls back to per-file ReadRawAsync).
        /// Agent sources implement this to avoid transmitting file bytes to the backend.
        /// </summary>
        Task<FileSearchMatchDto[]?> SearchFilesAsync(string directory, string nameFilter, string pattern, bool isRegex, int maxMatchesPerFile, CancellationToken ct)
            => Task.FromResult<FileSearchMatchDto[]?>(null);
    }
}
