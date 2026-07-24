import React, { useState } from 'react'
import { useLineWatchdog, isWatchdogEnabled, setWatchdogEnabled } from '../../hooks/useLineWatchdog'
import { useTabStore } from '../../store/logStore'

/**
 * Optional diagnostic overlay for the line-loss / stall watchdog (see useLineWatchdog.ts).
 * Deactivated by default (persisted in localStorage) — kept permanently as low-cost, opt-in
 * tooling rather than removed after the initial soak-test investigation.
 */
export function LineWatchdogPanel() {
  const [enabled, setEnabled] = useState(isWatchdogEnabled())
  const activeSessionId = useTabStore(state => state.activeSessionId)
  const { sessions, exportJson } = useLineWatchdog(enabled)

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    setWatchdogEnabled(next)
  }

  const active = activeSessionId ? sessions[activeSessionId] : undefined
  const statusVariant = !active ? 'ok' : active.stalled ? 'danger' : active.gapCount > 0 ? 'danger' : 'ok'
  const statusLabel = !active ? 'NO DATA' : active.stalled ? 'STALLED' : active.gapCount > 0 ? 'GAP DETECTED' : 'OK'

  return (
    <div className="watchdog-panel">
      <div className="watchdog-panel__header">
        <strong>Line Watchdog</strong>
        <label className="watchdog-panel__toggle">
          <input type="checkbox" checked={enabled} onChange={toggle} />
          Enabled
        </label>
      </div>

      {!enabled && (
        <p className="watchdog-panel__hint">
          Disabled by default. Enable to track missing/stalled lines for the active tab
          (expects AutoLogGen-style lines starting with "&lt;number&gt; | ...").
        </p>
      )}

      {enabled && !active && (
        <p className="watchdog-panel__hint">No lines observed yet for the active tab.</p>
      )}

      {enabled && active && (
        <div className="watchdog-panel__body">
          <span className={`status-pill status-pill--${statusVariant}`}>{statusLabel}</span>

          <ul className="watchdog-panel__stats">
            <li>Lines seen: {active.linesSeen}</li>
            <li>Last content line #: {active.lastContentLineNumber ?? '—'}</li>
            <li>Last received: {new Date(active.lastLineAt).toLocaleTimeString()}</li>
            <li>Gaps: {active.gapCount}</li>
            <li>Stalls: {active.stallCount}</li>
          </ul>

          <ul className="watchdog-panel__events">
            {active.events.slice().reverse().map((e, i) => (
              <li key={i} className={`watchdog-panel__event watchdog-panel__event--${e.kind}`}>
                <span className="watchdog-panel__event-ts">{new Date(e.ts).toLocaleTimeString()}</span> {e.message}
              </li>
            ))}
            {active.events.length === 0 && <li className="watchdog-panel__hint">No anomalies recorded.</li>}
          </ul>

          <button onClick={exportJson} className="control-button control-button--ghost">Export JSON</button>
        </div>
      )}
    </div>
  )
}
