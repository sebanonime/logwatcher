using System.Text;

namespace LogWatcher.Agent;

/// <summary>
/// Watches a single file for new content and emits lines to the hub.
/// Uses polling with FileSystemWatcher as a hint to avoid missed events.
/// </summary>
public class AgentFileWatcher : IDisposable
{
    public delegate Task LinesReadyHandler(string sessionId, string[] lines, long[] offsets, bool isInitial, bool isReset);
    public event LinesReadyHandler? LinesReady;

    private readonly string _sessionId;
    private readonly string _filePath;
    private readonly AgentLineIndex _lineIndex;
    private readonly ILogger _log;
    private readonly Encoding _encoding;

    private long _position;
    private FileSystemWatcher? _fsw;
    private CancellationTokenSource? _cts;
    private Task? _watchTask;

    // Track last known file size to detect rotation/truncation
    private long _lastKnownSize;

    public AgentFileWatcher(string sessionId, string filePath, long fromOffset, string encoding,
        AgentLineIndex lineIndex, ILogger log)
    {
        _sessionId = sessionId;
        _filePath = filePath;
        _lineIndex = lineIndex;
        _log = log;
        _position = fromOffset;
        _encoding = GetEncoding(encoding);
    }

    public void Start()
    {
        _cts = new CancellationTokenSource();
        _watchTask = Task.Run(() => WatchLoopAsync(_cts.Token));

        // FileSystemWatcher as a wakeup hint (optional, best-effort)
        try
        {
            string? dir = Path.GetDirectoryName(_filePath);
            string? name = Path.GetFileName(_filePath);
            if (dir != null && name != null && Directory.Exists(dir))
            {
                _fsw = new FileSystemWatcher(dir, name)
                {
                    NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.Size,
                    EnableRaisingEvents = true
                };
            }
        }
        catch
        {
            // FSW is optional — polling handles everything
        }
    }

    private async Task WatchLoopAsync(CancellationToken ct)
    {
        bool sentInitial = false;

        while (!ct.IsCancellationRequested)
        {
            try
            {
                if (!File.Exists(_filePath))
                {
                    await Task.Delay(2000, ct);
                    continue;
                }

                long currentSize = new FileInfo(_filePath).Length;

                // Detect file rotation/truncation
                if (sentInitial && currentSize < _lastKnownSize)
                {
                    _log.LogInformation("File {Path} truncated/rotated, resetting.", _filePath);
                    _position = 0;
                    _lineIndex.ResetSession(_sessionId);
                    await EmitAsync(Array.Empty<string>(), Array.Empty<long>(), false, isReset: true, ct);
                    sentInitial = false;
                    _lastKnownSize = 0;
                }

                if (currentSize > _position)
                {
                    var (lines, offsets) = ReadNewLines();
                    _lastKnownSize = currentSize;

                    if (lines.Length > 0)
                    {
                        await EmitAsync(lines, offsets, !sentInitial, isReset: false, ct);
                        sentInitial = true;
                    }
                    else if (!sentInitial)
                    {
                        // File exists but no lines read yet (e.g. fromOffset == EOF)
                        sentInitial = true;
                    }
                }
                else if (!sentInitial)
                {
                    // File hasn't grown from initial offset — send empty initial signal
                    await EmitAsync(Array.Empty<string>(), Array.Empty<long>(), true, false, ct);
                    sentInitial = true;
                    _lastKnownSize = currentSize;
                }
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _log.LogWarning(ex, "Error reading {Path}", _filePath);
            }

            await Task.Delay(500, ct);
        }
    }

    private (string[] lines, long[] offsets) ReadNewLines()
    {
        var lines = new List<string>();
        var offsets = new List<long>();

        try
        {
            using var fs = new FileStream(_filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite | FileShare.Delete);
            fs.Seek(_position, SeekOrigin.Begin);

            using var reader = new StreamReader(fs, _encoding, detectEncodingFromByteOrderMarks: true, bufferSize: 65536, leaveOpen: true);

            string? line;
            while ((line = reader.ReadLine()) != null)
            {
                long offset = _position;
                offsets.Add(offset);
                lines.Add(line);

                // Advance position by byte length of line + newline
                _position += _encoding.GetByteCount(line) + 1; // +1 for \n
                // Note: on Windows files with \r\n, this may be slightly off — handled by seeking on next read

                _lineIndex.AddLine(_sessionId, _filePath, offset);
            }

            // Sync to actual stream position (handles \r\n correctly)
            _position = fs.Position - reader.CurrentEncoding.GetPreamble().Length;
            // Actually: just use the stream position after reading
            _position = fs.Position;
        }
        catch (Exception ex)
        {
            _log.LogWarning(ex, "ReadNewLines failed for {Path}", _filePath);
        }

        return (lines.ToArray(), offsets.ToArray());
    }

    private Task EmitAsync(string[] lines, long[] offsets, bool isInitial, bool isReset, CancellationToken ct)
    {
        return LinesReady?.Invoke(_sessionId, lines, offsets, isInitial, isReset) ?? Task.CompletedTask;
    }

    private static Encoding GetEncoding(string encoding)
    {
        return (encoding?.ToLowerInvariant()) switch
        {
            "utf-8" or "utf8" => new UTF8Encoding(false),
            "utf-16" or "utf16" or "unicode" => Encoding.Unicode,
            "latin1" or "iso-8859-1" => Encoding.Latin1,
            _ => new UTF8Encoding(false),
        };
    }

    public void Dispose()
    {
        _cts?.Cancel();
        _fsw?.Dispose();
        _cts?.Dispose();
        _watchTask = null;
    }
}
