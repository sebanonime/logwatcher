import { useCallback, useEffect, useRef, useState } from 'react'
import { getLogHub } from '../signalr/logHubConnection'
import { useTabStore } from '../store/logStore'
import { reportWatchdogEvent } from '../api/diagnostics'
import type { LineDto } from '../types'

/**
 * Frontend line-loss watchdog (deactivated by default — see /memories/session/plan.md).
 *
 * Parses the sequential line number that AutoLogGen embeds in every line it writes
 * ("{lineNumber} | {timestamp} | [{category}] ...") and compares it against what this tab
 * actually receives over SignalR. This is intentionally independent from the backend's own
 * LineDto.lineNumber (the position in the file) so a genuine backend-side numbering bug can't
 * mask a real content gap.
 *
 * Detects two kinds of anomalies:
 *  - "gap": a content line number was skipped (a line was lost somewhere in the pipeline).
 *  - "stall": no OnNewLines has arrived for longer than STALL_THRESHOLD_MS while the tab is
 *    tailing. This is a *symptom*, not proof the source file stopped growing — cross-reference
 *    with AutoLogGen's own soak-schedule.log to tell an intentional idle window apart from a
 *    genuine stuck-viewer bug.
 *
 * Does nothing (no hub subscriptions, no timers) when `enabled` is false.
 */

const STORAGE_KEY = 'logwatcher_diagnostics_watchdog_enabled'
const STALL_CHECK_INTERVAL_MS = 5000
const STALL_THRESHOLD_MS = 15000
const EVENT_RING_SIZE = 20

const CONTENT_LINE_NUMBER_RE = /^\s*(\d+)\s*\|/

export interface WatchdogEvent {
  ts: number
  kind: 'gap' | 'stall' | 'info'
  message: string
}

export interface WatchdogSessionState {
  lastContentLineNumber: number | null
  lastLineAt: number
  linesSeen: number
  gapCount: number
  stallCount: number
  stalled: boolean
  events: WatchdogEvent[]
}

export function isWatchdogEnabled(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1'
}

export function setWatchdogEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
}

function parseContentLineNumber(text: string): number | null {
  const m = CONTENT_LINE_NUMBER_RE.exec(text)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
}

export function useLineWatchdog(enabled: boolean) {
  const sessionsRef = useRef<Record<string, WatchdogSessionState>>({})
  const [, bump] = useState(0)
  const forceRender = useCallback(() => bump(n => n + 1), [])

  const ensureSession = useCallback((sessionId: string): WatchdogSessionState => {
    let s = sessionsRef.current[sessionId]
    if (!s) {
      s = {
        lastContentLineNumber: null,
        lastLineAt: Date.now(),
        linesSeen: 0,
        gapCount: 0,
        stallCount: 0,
        stalled: false,
        events: [],
      }
      sessionsRef.current[sessionId] = s
    }
    return s
  }, [])

  const recordEvent = useCallback((sessionId: string, kind: WatchdogEvent['kind'], message: string) => {
    const s = ensureSession(sessionId)
    s.events = [...s.events.slice(-(EVENT_RING_SIZE - 1)), { ts: Date.now(), kind, message }]
    if (kind === 'gap') s.gapCount++
    if (kind === 'stall') s.stallCount++

    const tab = useTabStore.getState().tabs.find(t => t.sessionId === sessionId)
    reportWatchdogEvent({
      sessionId,
      serverId: tab?.serverId ?? '',
      filePath: tab?.filePath ?? '',
      kind,
      details: message,
      clientTimestamp: new Date().toISOString(),
    }).catch(() => { /* best-effort — diagnostic side-channel only */ })

    forceRender()
  }, [ensureSession, forceRender])

  useEffect(() => {
    if (!enabled) return

    const hub = getLogHub()

    const onNewLines = (sessionId: string, lines: LineDto[]) => {
      const s = ensureSession(sessionId)
      s.lastLineAt = Date.now()
      if (s.stalled) {
        s.stalled = false
        recordEvent(sessionId, 'info', 'Line flow resumed after a stall')
      }
      for (const line of lines) {
        s.linesSeen++
        const n = parseContentLineNumber(line.text)
        if (n == null) continue
        if (s.lastContentLineNumber != null && n > s.lastContentLineNumber + 1) {
          const missing = n - s.lastContentLineNumber - 1
          recordEvent(sessionId, 'gap',
            `Expected content line #${s.lastContentLineNumber + 1}, got #${n} (${missing} line(s) missing)`)
        }
        if (s.lastContentLineNumber == null || n > s.lastContentLineNumber) s.lastContentLineNumber = n
      }
      forceRender()
    }

    const onReload = (sessionId: string) => {
      const s = ensureSession(sessionId)
      recordEvent(sessionId, 'info', 'OnReload received (file rolled) — line sequence reset is expected')
      s.lastContentLineNumber = null
    }

    hub.on('OnNewLines', onNewLines)
    hub.on('OnReload', onReload)

    const stallTimer = setInterval(() => {
      const now = Date.now()
      const tabs = useTabStore.getState().tabs
      for (const [sessionId, s] of Object.entries(sessionsRef.current)) {
        const tab = tabs.find(t => t.sessionId === sessionId)
        if (!tab?.tailMode) continue
        if (!s.stalled && now - s.lastLineAt > STALL_THRESHOLD_MS) {
          s.stalled = true
          recordEvent(sessionId, 'stall',
            `No new lines received for ${Math.round((now - s.lastLineAt) / 1000)}s while tailing`)
        }
      }
    }, STALL_CHECK_INTERVAL_MS)

    return () => {
      hub.off('OnNewLines', onNewLines)
      hub.off('OnReload', onReload)
      clearInterval(stallTimer)
    }
  }, [enabled, ensureSession, recordEvent, forceRender])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(sessionsRef.current, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `line-watchdog-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return { sessions: sessionsRef.current, exportJson }
}
