namespace LogWatcher.Agent;

/// <summary>
/// Reconnect loop: connects to backend gRPC AgentGateway, re-registers on reconnect.
/// Retry delays: 0, 2, 5, 10, 30 seconds.
/// </summary>
public class AgentWorker : BackgroundService
{
    private readonly ILogger<AgentWorker> _log;
    private readonly IServiceProvider _services;

    private static readonly int[] RetryDelaysMs = [0, 2000, 5000, 10000, 30000];

    public AgentWorker(ILogger<AgentWorker> log, IServiceProvider services)
    {
        _log = log;
        _services = services;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        int attempt = 0;

        while (!stoppingToken.IsCancellationRequested)
        {
            // Create a fresh client each reconnect so gRPC channel state is clean
            await using var client = _services.GetRequiredService<AgentGrpcClient>();
            try
            {
                _log.LogInformation("Connecting to backend (attempt {Attempt})…", attempt + 1);
                await client.StartAsync(stoppingToken);
                attempt = 0;
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
    }
}
