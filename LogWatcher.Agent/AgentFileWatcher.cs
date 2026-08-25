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

    // Cap lines per PushLines message so a large initial load (or a huge burst of new lines)
    // never approaches the gRPC message-size limit in a single message.
    private const int MaxLinesPerPush = 2000;

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

                    _log.LogDebug(
                        "session={SessionId} path={Path} currentSize={CurrentSize} position={Position} linesRead={LinesRead}",
                        _sessionId, _filePath, currentSize, _position, lines.Length);

                    if (lines.Length > 0)
                    {
                        bool isInitial = !sentInitial;
                        await EmitChunkedAsync(lines, offsets, isInitial, ct);
                        if (isInitial)
                            _log.LogInformation(
                                "WatchFile: session={SessionId} path={Path} initial load complete — {LinesRead} line(s), position={Position}",
                                _sessionId, _filePath, lines.Length, _position);
                        sentInitial = true;
                    }
                    else if (!sentInitial)
                    {
                        // File exists but no lines read yet (e.g. fromOffset == EOF)
                        _log.LogInformation(
                            "WatchFile: session={SessionId} path={Path} initial load complete — file has no complete line yet at offset {Position}",
                            _sessionId, _filePath, _position);
                        sentInitial = true;
                    }
                    else
                    {
                        // File grew (currentSize > _position) but ReadNewLines() produced zero
                        // lines — e.g. the new bytes have no trailing newline yet. Not necessarily
                        // a bug, but worth a trace so a persistent stall shows up here.
                        _log.LogDebug(
                            "session={SessionId} path={Path} grew from {Position} to {CurrentSize} but no complete line was read yet.",
                            _sessionId, _filePath, _position, currentSize);
                    }
                }
                else if (!sentInitial)
                {
                    // File hasn't grown from initial offset — send empty initial signal
                    await EmitAsync(Array.Empty<string>(), Array.Empty<long>(), true, false, ct);
                    _log.LogInformation(
                        "WatchFile: session={SessionId} path={Path} initial load complete — file unchanged at offset {Position}, nothing to send",
                        _sessionId, _filePath, _position);
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

            long available = fs.Length - fs.Position;
            if (available <= 0) return (lines.ToArray(), offsets.ToArray());

            byte[] buffer = new byte[available];
            int bytesRead = 0;
            while (bytesRead < buffer.Length)
            {
                int n = fs.Read(buffer, bytesRead, buffer.Length - bytesRead);
                if (n == 0) break;
                bytesRead += n;
            }

            // Skip BOM at the very start of the file (only relevant on the first read from offset 0).
            int idx = 0;
            if (_position == 0)
            {
                byte[] preamble = _encoding.GetPreamble();
                if (preamble.Length > 0 && bytesRead >= preamble.Length)
                {
                    bool match = true;
                    for (int i = 0; i < preamble.Length; i++)
                        if (buffer[i] != preamble[i]) { match = false; break; }
                    if (match) idx = preamble.Length;
                }
            }

            while (idx < bytesRead)
            {
                int lineStart = idx;

                // Scan forward until we find a newline byte (0x0A).
                // This is safe for UTF-8/ASCII: 0x0A never appears as part of a multi-byte sequence.
                while (idx < bytesRead && buffer[idx] != 0x0A) idx++;

                if (idx >= bytesRead)
                {
                    // No newline found — partial/incomplete line at the end of the buffer.
                    // Leave it for the next poll cycle by not advancing _position past this point.
                    idx = lineStart;
                    break;
                }

                // Strip the carriage return from Windows-style CRLF line endings.
                int contentEnd = idx; // idx is pointing at '\n' (0x0A)
                if (contentEnd > lineStart && buffer[contentEnd - 1] == 0x0D)
                    contentEnd--;

                // The byte offset of this line's start in the file is exact.
                long lineOffset = _position + lineStart;
                string text = _encoding.GetString(buffer, lineStart, contentEnd - lineStart);

                offsets.Add(lineOffset);
                lines.Add(text);
                _lineIndex.AddLine(_sessionId, _filePath, lineOffset);

                idx++; // advance past '\n'
            }

            // Advance the file position by exactly the number of bytes consumed (complete lines only).
            _position += idx;
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

    private async Task EmitChunkedAsync(string[] lines, long[] offsets, bool isInitial, CancellationToken ct)
    {
        if (lines.Length <= MaxLinesPerPush)
        {
            await EmitAsync(lines, offsets, isInitial, isReset: false, ct);
            return;
        }

        for (int i = 0; i < lines.Length; i += MaxLinesPerPush)
        {
            int n = Math.Min(MaxLinesPerPush, lines.Length - i);
            await EmitAsync(lines[i..(i + n)], offsets[i..(i + n)], isInitial, isReset: false, ct);
        }
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
