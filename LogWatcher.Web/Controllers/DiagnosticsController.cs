using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogWatcher.Web.Controllers
{
    /// <summary>
    /// Anomaly reports ("gap"/"stall"/"info") produced by the frontend's optional line-loss
    /// watchdog (see logwatcher-frontend/src/hooks/useLineWatchdog.ts). The watchdog is
    /// deactivated by default; when a user enables it, detected anomalies are POSTed here and
    /// persisted to logs/client-watchdog-{shortdate}.log so the record survives a browser
    /// crash/close and can be correlated with the backend's own tail-diag log by sessionId.
    /// </summary>
    public record ClientWatchdogReportDto(
        string SessionId,
        string ServerId,
        string FilePath,
        string Kind, // "gap" | "stall" | "info"
        string Details,
        DateTimeOffset ClientTimestamp);

    [ApiController]
    [Route("api/diagnostics")]
    [Authorize(Policy = "UserOnly")]
    public class DiagnosticsController : ControllerBase
    {
        private static readonly NLog.Logger _clientWatchdog = NLog.LogManager.GetLogger("ClientWatchdog");

        [HttpPost("report")]
        public IActionResult Report([FromBody] ClientWatchdogReportDto report)
        {
            if (report == null || string.IsNullOrWhiteSpace(report.SessionId))
                return BadRequest();

            var level = report.Kind?.ToLowerInvariant() switch
            {
                "gap" => NLog.LogLevel.Error,
                "stall" => NLog.LogLevel.Warn,
                _ => NLog.LogLevel.Info,
            };

            _clientWatchdog.Log(level,
                "kind={0} session={1} serverId={2} file={3} clientTimestamp={4:o} details={5}",
                report.Kind, report.SessionId, report.ServerId, report.FilePath, report.ClientTimestamp, report.Details);

            return Ok();
        }
    }
}
