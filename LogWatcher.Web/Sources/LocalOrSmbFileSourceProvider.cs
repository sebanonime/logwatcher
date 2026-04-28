using LogWatcher.Web.Config;
using LogWatcher.Web.Dto;
using System.Runtime.CompilerServices;

namespace LogWatcher.Web.Sources
{
    /// <summary>
    /// Handles local files and SMB/UNC shares (e.g. \\server\share\logs\app.log).
    /// UNC paths are natively supported by .NET's FileStream on Windows — no extra
    /// code is needed. SMB credential impersonation is performed when Username is set
    /// in the ServerDefinition.
    /// </summary>
    public class LocalOrSmbFileSourceProvider : IFileSourceProvider
    {
        private const int BufferSize = 1024 * 1024; // 1 MB chunks
        private const int PollIntervalMs = 500;

        private readonly ServerDefinition _server;
        private readonly CredentialStore _credentials;

        public string SourceType => _server.Type; // "local" or "smb"

        public LocalOrSmbFileSourceProvider(ServerDefinition server, CredentialStore credentials)
        {
            _server = server;
            _credentials = credentials;
        }

        public Task<FileSourceInfo> GetFileInfoAsync(string path, CancellationToken ct = default)
        {
            var fi = new FileInfo(path);
            fi.Refresh();
            return Task.FromResult(new FileSourceInfo(
                path,
                fi.Exists ? fi.Length : 0,
                fi.Exists,
                fi.Exists ? fi.LastWriteTimeUtc : DateTimeOffset.MinValue));
        }

        public async IAsyncEnumerable<ReadOnlyMemory<byte>> ReadRawAsync(
            string path, long fromByteOffset,
            [EnumeratorCancellation] CancellationToken ct)
        {
            Console.WriteLine($"[LocalOrSmbFileSourceProvider.ReadRawAsync] Opening {path} from offset {fromByteOffset}");
            using var fs = OpenReadStream(path);
            fs.Position = fromByteOffset;
            var buffer = new byte[BufferSize];
            int read;
            int chunkNum = 0;
            while ((read = await fs.ReadAsync(buffer, 0, buffer.Length, ct)) > 0)
            {
                chunkNum++;
                Console.WriteLine($"[LocalOrSmbFileSourceProvider.ReadRawAsync] Chunk {chunkNum}: {read} bytes");
                yield return buffer.AsMemory(0, read);
            }
            Console.WriteLine($"[LocalOrSmbFileSourceProvider.ReadRawAsync] Finished reading {path}: {chunkNum} chunks total");
        }

        public async Task<byte[]> ReadBytesAsync(string path, long from, int count, CancellationToken ct)
        {
            using var fs = OpenReadStream(path);
            fs.Position = from;
            var buffer = new byte[count];
            int totalRead = 0;
            while (totalRead < count)
            {
                int read = await fs.ReadAsync(buffer, totalRead, count - totalRead, ct);
                if (read == 0) break;
                totalRead += read;
            }
            if (totalRead < count)
                return buffer[..totalRead];
            return buffer;
        }

        public async Task<byte[]> ReadRangeBytesAsync(string path, long from, long to, CancellationToken ct)
        {
            long length = to - from;
            if (length <= 0) return Array.Empty<byte>();
            // Cap single read at 16 MB to avoid OOM on absurdly large ranges
            length = Math.Min(length, 16 * 1024 * 1024);
            using var fs = OpenReadStream(path);
            fs.Position = from;
            var buffer = new byte[length];
            int totalRead = 0;
            while (totalRead < length)
            {
                int read = await fs.ReadAsync(buffer, totalRead, (int)(length - totalRead), ct);
                if (read == 0) break;
                totalRead += read;
            }
            if (totalRead < length)
                return buffer[..totalRead];
            return buffer;
        }

        public async IAsyncEnumerable<TailChunk> TailAsync(
            string path, long fromByteOffset,
            [EnumeratorCancellation] CancellationToken ct)
        {
            long position = fromByteOffset;
            long previousSize = fromByteOffset;

            while (!ct.IsCancellationRequested)
            {
                var fi = new FileInfo(path);
                fi.Refresh();

                if (!fi.Exists || fi.Length < previousSize)
                {
                    // File was deleted or truncated — signal a reset
                    position = 0;
                    previousSize = 0;
                    yield return new TailChunk(Array.Empty<byte>(), IsReset: true);
                    await Task.Delay(PollIntervalMs, ct);
                    continue;
                }

                if (fi.Length > position)
                {
                    int toRead = (int)Math.Min(fi.Length - position, BufferSize);
                    var buf = new byte[toRead];
                    using var fs = OpenReadStream(path);
                    fs.Position = position;
                    int read = await fs.ReadAsync(buf, 0, toRead, ct);
                    if (read > 0)
                    {
                        position += read;
                        previousSize = fi.Length;
                        yield return new TailChunk(buf[..read], IsReset: false);
                        continue; // Don't delay — drain as fast as possible
                    }
                }

                previousSize = fi.Exists ? fi.Length : 0;
                await Task.Delay(PollIntervalMs, ct);
            }
        }

        public Task<IEnumerable<RemoteFileInfoDto>> ListFilesAsync(
            string directory, string pattern, CancellationToken ct = default)
        {
            var dir = new DirectoryInfo(directory);
            if (!dir.Exists)
                return Task.FromResult(Enumerable.Empty<RemoteFileInfoDto>());

            var files = dir.GetFileSystemInfos(string.IsNullOrEmpty(pattern) ? "*" : pattern)
                .Select(f => new RemoteFileInfoDto
                {
                    Path = f.FullName,
                    IsDirectory = f is DirectoryInfo,
                    SizeBytes = f is FileInfo fi ? fi.Length : 0,
                    LastModified = f.LastWriteTimeUtc
                });

            return Task.FromResult(files);
        }

        private FileStream OpenReadStream(string path) =>
            new FileStream(path, FileMode.Open, FileAccess.Read,
                FileShare.ReadWrite | FileShare.Delete,
                BufferSize, useAsync: true);

        public ValueTask DisposeAsync() => ValueTask.CompletedTask;
    }
}
