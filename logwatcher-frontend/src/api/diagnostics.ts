export interface ClientWatchdogReport {
  sessionId: string
  serverId: string
  filePath: string
  kind: 'gap' | 'stall' | 'info'
  details: string
  clientTimestamp: string
}

function getToken(): string {
  return localStorage.getItem('logwatcher_token') ?? ''
}

/**
 * Best-effort POST of a line-watchdog anomaly to the backend, persisted to
 * logs/client-watchdog-{shortdate}.log (see LogWatcher.Web/Controllers/DiagnosticsController.cs).
 * Failures are intentionally swallowed by the caller — this is a diagnostic side-channel and
 * must never affect the log viewer itself.
 */
export async function reportWatchdogEvent(report: ClientWatchdogReport): Promise<void> {
  await fetch('/api/diagnostics/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(report),
  })
}
