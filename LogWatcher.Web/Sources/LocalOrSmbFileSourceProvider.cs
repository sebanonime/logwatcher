using LogWatcher.Common;
using LogWatcher.Web.Config;
using LogWatcher.Web.Dto;
using System.Runtime.CompilerServices;

namespace LogWatcher.Web.Sources
{
    /// <summary>
    /// Handles local and SMB/UNC paths (e.g. \\server\share\logs\app.log or C:\logs).
    /// UNC paths are natively supported by .NET's FileStream on Windows — no extra code is needed.
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

        /// <summary>
        /// Resolves an archive-entry composite path ("archive.zip::internal/entry.log") to a real,
        /// locally readable file path by extracting the entry to a cached temp file. Non-archive paths
        /// are returned unchanged, so every existing byte-offset based read/tail method below needs no
        /// further archive-awareness.
        /// </summary>
        private static string ResolvePath(string path)
        {
            if (ArchivePathHelper.TryParse(path, out var archivePath, out var internalPath) && !string.IsNullOrEmpty(internalPath))
                return ArchiveEntryCache.Resolve(archivePath, internalPath);
            return path;
        }

        public Task<FileSourceInfo> GetFileInfoAsync(string path, CancellationToken ct = default)
        {
            path = ResolvePath(path);
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
            path = ResolvePath(path);
            using var fs = OpenReadStream(path);
            fs.Position = fromByteOffset;
            var buffer = new byte[BufferSize];
            int read;
            while ((read = await fs.ReadAsync(buffer, 0, buffer.Length, ct)) > 0)
            {
                yield return buffer.AsMemory(0, read);
            }
        }

        public async Task<byte[]> ReadBytesAsync(string path, long from, int count, CancellationToken ct)
        {
            path = ResolvePath(path);
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
            path = ResolvePath(path);
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

        public async IAsyncEnumerable<TailChunk> TailAsync(string path, long fromByteOffset, [EnumeratorCancellation] CancellationToken ct)
        {
            path = ResolvePath(path);
            long position = fromByteOffset;
            long previousSize = fromByteOffset;

            while (!ct.IsCancellationRequested)
            {
                long currentLength = 0;
                bool fileExists = true;
                
                // Variables pour stocker le résultat hors du try/catch
                bool hasChunkToYield = false;
                TailChunk chunkToYield = default;
                bool drainFast = false;

                try
                {
                    // L'appel à OpenReadStream force Windows à interroger 
                    // le serveur SMB distant, contournant ainsi le cache
                    using var fs = OpenReadStream(path);
                    currentLength = fs.Length;

                    if (currentLength < previousSize)
                    {
                        // Le fichier a été supprimé ou tronqué
                        position = 0;
                        previousSize = 0;
                        chunkToYield = new TailChunk(Array.Empty<byte>(), IsReset: true);
                        hasChunkToYield = true;
                    }
                    else if (currentLength > position)
                    {
                        int toRead = (int)Math.Min(currentLength - position, BufferSize);
                        var buf = new byte[toRead];
                        
                        fs.Position = position;
                        int read = await fs.ReadAsync(buf, 0, toRead, ct);
                        
                        if (read > 0)
                        {
                            position += read;
                            previousSize = currentLength;
                            chunkToYield = new TailChunk(buf[..read], IsReset: false);
                            hasChunkToYield = true;
                            drainFast = true;
                        }
                    }
                    else 
                    {
                        previousSize = currentLength;
                    }
                }
                catch (FileNotFoundException)
                {
                    fileExists = false;
                }
                catch (DirectoryNotFoundException)
                {
                    fileExists = false;
                }
                catch (Exception)
                {
                    // En SMB, le fichier peut être brièvement verrouillé. 
                    // On ignore pour retenter à la prochaine boucle.
                }

                if (!fileExists)
                {
                    position = 0;
                    previousSize = 0;
                    chunkToYield = new TailChunk(Array.Empty<byte>(), IsReset: true);
                    hasChunkToYield = true;
                }

                // Le yield return se fait en toute sécurité HORS du bloc try/catch
                if (hasChunkToYield)
                {
                    yield return chunkToYield;
                    
                    if (drainFast)
                    {
                        continue; // On draine le buffer sans attendre
                    }
                }

                await Task.Delay(PollIntervalMs, ct);
            }
        }

        public Task<IEnumerable<RemoteFileInfoDto>> ListFilesAsync(
            string directory, string pattern, CancellationToken ct = default)
        {
            if (ArchivePathHelper.TryParse(directory, out var archivePath, out var internalDir))
            {
                var entries = ArchiveEntryCache.ListEntries(archivePath, internalDir)
                    .Select(e => new RemoteFileInfoDto
                    {
                        Path = ArchivePathHelper.Combine(archivePath, string.IsNullOrEmpty(internalDir) ? e.Name : internalDir + "/" + e.Name),
                        IsDirectory = e.IsDirectory,
                        SizeBytes = e.SizeBytes,
                        LastModified = e.LastModified,
                        HasChildren = e.IsDirectory,
                    });
                return Task.FromResult((IEnumerable<RemoteFileInfoDto>)entries.ToList());
            }

            var dir = new DirectoryInfo(directory);
            if (!dir.Exists)
                return Task.FromResult(Enumerable.Empty<RemoteFileInfoDto>());

            var files = dir.GetFileSystemInfos(string.IsNullOrEmpty(pattern) ? "*" : pattern)
                .Select(f => new RemoteFileInfoDto
                {
                    Path = f.FullName,
                    IsDirectory = f is DirectoryInfo,
                    IsArchive = f is FileInfo && ArchivePathHelper.IsArchiveFile(f.FullName),
                    SizeBytes = f is FileInfo fi ? fi.Length : 0,
                    LastModified = f.LastWriteTimeUtc,
                    HasChildren = f is DirectoryInfo d ? d.EnumerateFileSystemInfos().Any() : ArchivePathHelper.IsArchiveFile(f.FullName)
                });

            return Task.FromResult(files);
        }

        private FileStream OpenReadStream(string path)
        {
            // L'ajout de FileOptions.SequentialScan indique au cache de l'OS 
            // que nous allons lire le fichier du début à la fin (parfait pour le filtrage).
            return new FileStream(
                path, 
                FileMode.Open, 
                FileAccess.Read,
                FileShare.ReadWrite | FileShare.Delete,
                BufferSize, // Reste à 1 Mo, c'est très bien pour SMB
                FileOptions.Asynchronous | FileOptions.SequentialScan);
        }

        public ValueTask DisposeAsync() => ValueTask.CompletedTask;
    }
}
