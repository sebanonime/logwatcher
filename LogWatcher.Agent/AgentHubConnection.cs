using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR.Client;

namespace LogWatcher.Agent;

/// <summary>
/// Manages the SignalR connection to the backend AgentHub.
/// Handles all inbound hub method calls and dispatches to AgentFileWatcher.
/// </summary>
public class AgentHubConnection : IAsyncDisposable
{
    private readonly IConfiguration _config;
    private readonly AgentLineIndex _lineIndex;
    private readonly ILogger<AgentHubConnection> _log;

    private HubConnection? _conn;
    private TaskCompletionSource _disconnectTcs = new(TaskCreationOptions.RunContinuationsAsynchronously);

    // sessionId → AgentFileWatcher
    private readonly ConcurrentDictionary<string, AgentFileWatcher> _watchers = new();

    public AgentHubConnection(IConfiguration config, AgentLineIndex lineIndex, ILogger<AgentHubConnection> log)
    {
        _config = config;
        _lineIndex = lineIndex;
        _log = log;
    }

    public async Task StartAsync(CancellationToken ct)
    {
        string backendUrl = _config["Agent:BackendUrl"] ?? "https://localhost:7000";
        int port = _config.GetValue<int>("Agent:BackendPort", 443);
        string token = _config["Agent:Token"] ?? throw new InvalidOperationException("Agent:Token not configured.");

        // Build URL: replace port in BackendUrl
        var uri = new UriBuilder(backendUrl) { Port = port, Path = "/agentHub" };

        _conn = new HubConnectionBuilder()
            .WithUrl(uri.Uri, options =>
            {
                options.AccessTokenProvider = () => Task.FromResult<string?>(token);
                // Accept self-signed certs in dev if needed
                options.HttpMessageHandlerFactory = handler =>
                {
                    if (handler is HttpClientHandler h)
                        h.ServerCertificateCustomValidationCallback =
                            HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
                    return handler;
                };
            })
            .WithAutomaticReconnect([TimeSpan.Zero, TimeSpan.FromSeconds(2), TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(30)])
            .Build();

        RegisterHandlers(_conn);

        _conn.Closed += async ex =>
        {
            _log.LogWarning(ex, "Hub connection closed.");
            _disconnectTcs.TrySetResult();
            await Task.CompletedTask;
        };

        _disconnectTcs = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);

        await _conn.StartAsync(ct);

        // Register with backend
        string agentId = _config["Agent:AgentId"] ?? Environment.MachineName;
        string hostname = Environment.MachineName;
        await _conn.InvokeAsync("RegisterAgent", agentId, hostname, new[] { "file-watch", "file-list", "file-read" }, ct);
    }

    public Task WaitForDisconnectAsync(CancellationToken ct)
    {
        return _disconnectTcs.Task.WaitAsync(ct);
    }

    public async Task StopAsync()
    {
        if (_conn != null)
            await _conn.StopAsync();
    }

    private void RegisterHandlers(HubConnection conn)
    {
        conn.On<string, string, long, string>("WatchFile", OnWatchFile);
        conn.On<string>("StopWatch", OnStopWatch);
        conn.On<string, string, string>("GetFileInfo", OnGetFileInfo);
        conn.On<string, string, string>("ListFiles", OnListFiles);
        conn.On<string, int, int>("RequestLines", OnRequestLines);
    }

    private void OnWatchFile(string sessionId, string filePath, long fromOffset, string encoding)
    {
        _log.LogInformation("WatchFile: {SessionId} → {FilePath} from offset {Offset}", sessionId, filePath, fromOffset);

        if (_watchers.ContainsKey(sessionId))
        {
            _watchers[sessionId].Dispose();
            _watchers.TryRemove(sessionId, out _);
        }

        var watcher = new AgentFileWatcher(sessionId, filePath, fromOffset, encoding, _lineIndex, _log);
        watcher.LinesReady += async (sid, lines, offsets, isInitial, isReset) =>
        {
            if (_conn?.State == HubConnectionState.Connected)
                await _conn.InvokeAsync("PushLines", sid, lines, offsets, isInitial, isReset);
        };

        _watchers[sessionId] = watcher;
        watcher.Start();
    }

    private void OnStopWatch(string sessionId)
    {
        _log.LogInformation("StopWatch: {SessionId}", sessionId);
        if (_watchers.TryRemove(sessionId, out var watcher))
            watcher.Dispose();
        _lineIndex.RemoveSession(sessionId);
    }

    private async void OnGetFileInfo(string requestId, string sessionId, string filePath)
    {
        try
        {
            var info = new FileInfo(filePath);
            if (_conn?.State == HubConnectionState.Connected)
                await _conn.InvokeAsync("PushFileInfo", requestId, info.Exists, info.Exists ? info.Length : 0L, info.Exists ? info.LastWriteTimeUtc : default);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "GetFileInfo failed for {Path}", filePath);
            if (_conn?.State == HubConnectionState.Connected)
                await _conn.InvokeAsync("PushError", requestId, ex.Message);
        }
    }

    private async void OnListFiles(string requestId, string sessionId, string directory)
    {
        try
        {
            var entries = new List<object>();
            if (Directory.Exists(directory))
            {
                foreach (var f in Directory.GetFiles(directory))
                    entries.Add(new { Name = Path.GetFileName(f), Path = f, IsDirectory = false, Size = new FileInfo(f).Length });
                foreach (var d in Directory.GetDirectories(directory))
                    entries.Add(new { Name = Path.GetFileName(d), Path = d, IsDirectory = true, Size = 0L, HasChildren = Directory.EnumerateFileSystemEntries(d).Any() });
            }

            if (_conn?.State == HubConnectionState.Connected)
                await _conn.InvokeAsync("PushFileList", requestId, entries);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "ListFiles failed for {Dir}", directory);
            if (_conn?.State == HubConnectionState.Connected)
                await _conn.InvokeAsync("PushError", requestId, ex.Message);
        }
    }

    private async void OnRequestLines(string sessionId, int startLine, int count)
    {
        try
        {
            string? filePath = _lineIndex.GetFilePath(sessionId);
            if (filePath == null)
            {
                _log.LogWarning("RequestLines: no index for session {SessionId}", sessionId);
                return;
            }

            var lines = _lineIndex.ReadLines(sessionId, filePath, startLine, count);

            if (_conn?.State == HubConnectionState.Connected)
                await _conn.InvokeAsync("PushRequestedLines", sessionId, startLine, lines);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "RequestLines failed for session {SessionId}", sessionId);
        }
    }

    public async ValueTask DisposeAsync()
    {
        foreach (var w in _watchers.Values)
            w.Dispose();
        _watchers.Clear();

        if (_conn != null)
            await _conn.DisposeAsync();
    }
}
