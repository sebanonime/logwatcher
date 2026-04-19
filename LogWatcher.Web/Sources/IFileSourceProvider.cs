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
        /// Streams newly appended bytes as they arrive (real-time tail).
        /// Yields a chunk with IsReset=true when the file is truncated or replaced.
        /// </summary>
        IAsyncEnumerable<TailChunk> TailAsync(
            string path, long fromByteOffset, CancellationToken ct);

        /// <summary>Directory listing for the file browser UI.</summary>
        Task<IEnumerable<RemoteFileInfoDto>> ListFilesAsync(
            string directory, string pattern, CancellationToken ct = default);
    }
}
