namespace LogWatcher.Agent;

/// <summary>
/// Reconnect loop: connects to AgentHub, re-registers on reconnect, keeps alive.
/// Retry delays: 0, 2, 5, 10, 30 seconds.
/// </summary>
public class AgentWorker : BackgroundService
{
    private readonly AgentHubConnection _hub;
    private readonly ILogger<AgentWorker> _log;

    private static readonly int[] RetryDelaysMs = [0, 2000, 5000, 10000, 30000];

    public AgentWorker(AgentHubConnection hub, ILogger<AgentWorker> log)
    {
        _hub = hub;
        _log = log;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        int attempt = 0;

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _log.LogInformation("Connecting to backend (attempt {Attempt})…", attempt + 1);
                await _hub.StartAsync(stoppingToken);

                _log.LogInformation("Connected. Agent is running.");
                attempt = 0;

                // Block until disconnected or cancelled
                await _hub.WaitForDisconnectAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _log.LogWarning(ex, "Connection failed.");
            }

            if (stoppingToken.IsCancellationRequested) break;

            int delayMs = RetryDelaysMs[Math.Min(attempt, RetryDelaysMs.Length - 1)];
            attempt++;

            _log.LogInformation("Retrying in {Delay}ms…", delayMs);
            await Task.Delay(delayMs, stoppingToken);
        }

        await _hub.StopAsync();
    }
}
