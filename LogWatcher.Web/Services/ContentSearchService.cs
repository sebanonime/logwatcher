using System.Text;
using System.Text.RegularExpressions;
using LogWatcher.Web.Config;
using LogWatcher.Web.Dto;
using LogWatcher.Web.Sources;

namespace LogWatcher.Web.Services
{
    public class SearchLinesResult
    {
        public List<LineDto> Lines { get; init; } = new();
        public bool Truncated { get; init; }
        public int DroppedCount { get; init; }
        public int FilesMatched { get; init; }
        /// <summary>Full paths of the files that had at least one match, for scoping the Files browser list.</summary>
        public List<string> MatchedFilePaths { get; init; } = new();
    }

    /// <summary>
    /// Shared content-search logic used to open a "search results" virtual tab.
    /// Scans matching files (via SMB byte-range reads or Agent delegation), extracts
    /// the matching lines with their original 1-based line numbers, then merges all
    /// files' matches ordered by file last-modified time (oldest first, so the most
    /// recently modified file's lines end up at the bottom — like a live tail).
    /// </summary>
    public class ContentSearchService
    {
        public const int MaxMatchesPerFile = 500;
        public const int MaxTotalMatches = 5000;
        private const int MaxBytesPerFile = 8 * 1024 * 1024;

        private readonly ServerConfigRepository _serverConfig;
        private readonly CredentialStore _credentials;
        private readonly IAgentRegistry _agentRegistry;

        public ContentSearchService(ServerConfigRepository serverConfig, CredentialStore credentials, IAgentRegistry agentRegistry)
        {
            _serverConfig = serverConfig;
            _credentials = credentials;
            _agentRegistry = agentRegistry;
        }

        public async Task<SearchLinesResult> SearchAsync(
            string perimeterId, string rootFolderName, string subpath,
            string nameFilter, string contentPattern, bool isRegex,
            IProgress<(int Scanned, int Total)>? progress, CancellationToken ct)
        {
            var servers = _serverConfig.GetServersInRoot(perimeterId, rootFolderName);
            var fileMatches = new List<FileSearchMatchDto>();
            var nameSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            Regex? regex = null;
            if (isRegex && !string.IsNullOrWhiteSpace(contentPattern))
            {
                try { regex = new Regex(contentPattern, RegexOptions.IgnoreCase); }
                catch { regex = null; }
            }

            var localFiles = new List<(RemoteFileInfoDto File, IFileSourceProvider Provider)>();
            var allProviders = new List<IFileSourceProvider>();

            foreach (var server in servers)
            {
                IFileSourceProvider? provider = server.Type switch
                {
                    "smb" => new LocalOrSmbFileSourceProvider(server, _credentials),
                    "agent" => new AgentFileSourceProvider(server, _agentRegistry),
                    _ => null
                };
                if (provider == null) continue;
                allProviders.Add(provider);

                var basePath = server.Host ?? string.Empty;
                var dirPath = string.IsNullOrEmpty(subpath)
                    ? basePath
                    : Path.Combine(basePath, subpath).Replace('\\', '/');

                try
                {
                    // If the provider supports remote search (agent), delegate entirely.
                    var remoteMatches = await provider.SearchFilesAsync(dirPath, nameFilter, contentPattern, isRegex, MaxMatchesPerFile, ct);
                    if (remoteMatches != null)
                    {
                        foreach (var m in remoteMatches)
                        {
                            var fname = Path.GetFileName(m.Path);
                            if (nameSet.Add(fname))
                                fileMatches.Add(m);
                        }
                        continue;
                    }

                    // Local/SMB: collect candidate files (already name-filtered) for per-file scan.
                    var items = (await provider.ListFilesAsync(dirPath, "*", ct)).ToList();
                    var candidates = items.Where(i => !i.IsDirectory).ToList();
                    if (!string.IsNullOrWhiteSpace(nameFilter))
                        candidates = candidates.Where(f =>
                            Path.GetFileName(f.Path).Contains(nameFilter, StringComparison.OrdinalIgnoreCase)).ToList();
                    localFiles.AddRange(candidates.Select(f => (f, provider)));
                }
                catch { /* skip unreachable servers */ }
            }

            int total = localFiles.Count;
            int scanned = 0;
            progress?.Report((0, total));

            foreach (var (file, provider) in localFiles)
            {
                ct.ThrowIfCancellationRequested();
                try
                {
                    var (lines, truncated) = await ScanFileForMatchesAsync(provider, file.Path, contentPattern, regex, MaxMatchesPerFile, ct);
                    if (lines.Count > 0)
                    {
                        var fname = Path.GetFileName(file.Path);
                        if (nameSet.Add(fname))
                            fileMatches.Add(new FileSearchMatchDto
                            {
                                Path = file.Path,
                                LastModified = file.LastModified,
                                Lines = lines,
                                Truncated = truncated,
                            });
                    }
                }
                catch { /* skip unreadable files */ }
                finally
                {
                    scanned++;
                    if (scanned % 5 == 0 || scanned == total)
                        progress?.Report((scanned, total));
                }
            }

            foreach (var provider in allProviders)
                await provider.DisposeAsync();

            // Oldest file first so the most recently modified file's lines land at the bottom.
            fileMatches.Sort((a, b) => a.LastModified.CompareTo(b.LastModified));

            var virtualLines = new List<LineDto>();
            foreach (var fm in fileMatches)
            {
                var fname = Path.GetFileName(fm.Path);
                foreach (var m in fm.Lines)
                    virtualLines.Add(new LineDto { Text = $"{m.Text} [{fname}:{m.LineNumber}]" });
            }

            bool truncatedTotal = false;
            int dropped = 0;
            if (virtualLines.Count > MaxTotalMatches)
            {
                dropped = virtualLines.Count - MaxTotalMatches;
                virtualLines = virtualLines.Skip(dropped).ToList();
                truncatedTotal = true;
            }

            for (int i = 0; i < virtualLines.Count; i++)
                virtualLines[i].LineNumber = i;

            return new SearchLinesResult
            {
                Lines = virtualLines,
                Truncated = truncatedTotal || fileMatches.Any(f => f.Truncated),
                DroppedCount = dropped,
                FilesMatched = fileMatches.Count,
                MatchedFilePaths = fileMatches.Select(f => f.Path).ToList(),
            };
        }

        /// <summary>Scans a file for lines matching the pattern, tracking 1-based original line numbers across read boundaries.</summary>
        private static async Task<(List<MatchedLineDto> Lines, bool Truncated)> ScanFileForMatchesAsync(
            IFileSourceProvider provider, string path, string pattern, Regex? regex, int maxMatches, CancellationToken ct)
        {
            var result = new List<MatchedLineDto>();
            if (string.IsNullOrWhiteSpace(pattern)) return (result, false);

            long totalRead = 0;
            int lineNumber = 1;
            string carry = string.Empty;
            bool truncated = false;

            bool IsMatch(string line) => regex != null
                ? regex.IsMatch(line)
                : line.Contains(pattern, StringComparison.OrdinalIgnoreCase);

            await foreach (var chunk in provider.ReadRawAsync(path, 0, ct))
            {
                ct.ThrowIfCancellationRequested();
                var combined = carry + Encoding.UTF8.GetString(chunk.Span);
                var parts = combined.Split('\n');
                for (int i = 0; i < parts.Length - 1; i++)
                {
                    var line = parts[i].TrimEnd('\r');
                    if (IsMatch(line))
                    {
                        result.Add(new MatchedLineDto { LineNumber = lineNumber, Text = line });
                        if (result.Count >= maxMatches) { truncated = true; break; }
                    }
                    lineNumber++;
                }
                if (truncated) break;
                carry = parts[^1];

                totalRead += chunk.Length;
                if (totalRead >= MaxBytesPerFile) break;
            }

            if (!truncated && carry.Length > 0)
            {
                var line = carry.TrimEnd('\r');
                if (IsMatch(line))
                    result.Add(new MatchedLineDto { LineNumber = lineNumber, Text = line });
            }

            return (result, truncated);
        }
    }
}
