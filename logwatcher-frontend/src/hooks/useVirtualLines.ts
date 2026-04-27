import { useCallback, useEffect, useRef } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useLogStore } from '../store/logStore'
import { useTabStore } from '../store/logStore'

const PREFETCH_AHEAD = 150   // lines to load ahead of viewport
const PREFETCH_BEHIND = 150  // lines to load behind viewport

/**
 * Manages the virtual line buffer for a single log session.
 * - Requests chunks from the server when lines are not in the buffer.
 * - Evicts lines far from the viewport to cap memory.
 */
export function useVirtualLines(sessionId: string, hub: HubConnection) {
  const { getLine, buffers } = useLogStore()
  const { tabs, updateTab } = useTabStore()
  const tab = tabs.find(t => t.sessionId === sessionId)
  const totalLines = tab?.totalLines ?? 0

  // Track in-flight requests to avoid duplicate fetches
  const inFlight = useRef<Set<number>>(new Set())

  const ensureRange = useCallback((startLine: number, count: number) => {
    if (!sessionId || totalLines === 0) return

    const rangeStart = Math.max(0, startLine - PREFETCH_BEHIND)
    const rangeEnd = Math.min(totalLines - 1, startLine + count + PREFETCH_AHEAD)
    const rangeCount = rangeEnd - rangeStart + 1

    // Check if any lines in range are missing
    const buf = buffers[sessionId] ?? {}
    const hasMissing = Array.from({ length: rangeCount }, (_, i) => rangeStart + i)
      .some(n => buf[n] === undefined)

    if (!hasMissing) return

    // Deduplicate: one request per 300-line chunk
    const chunkStart = Math.floor(rangeStart / 300) * 300
    if (inFlight.current.has(chunkStart)) return

    inFlight.current.add(chunkStart)
    const chunkEnd = Math.min(totalLines - 1, chunkStart + 299)
    const chunkCount = chunkEnd - chunkStart + 1

    hub.invoke('RequestLines', sessionId, chunkStart, chunkCount)
      .then(() => updateTab(sessionId, { errorMessage: undefined }))
      .catch((e) => {
        const msg = e instanceof Error ? e.message : 'Failed to request lines from server'
        updateTab(sessionId, { errorMessage: msg })
      })
      .finally(() => inFlight.current.delete(chunkStart))
  }, [sessionId, totalLines, buffers, hub, updateTab])

  const getLineText = useCallback((lineNumber: number): string | undefined => {
    return getLine(sessionId, lineNumber)
  }, [getLine, sessionId])

  return { totalLines, ensureRange, getLineText }
}
