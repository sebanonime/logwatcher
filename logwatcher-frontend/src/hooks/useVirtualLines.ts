import { useCallback, useEffect, useRef } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useLogStore } from '../store/logStore'
import { useTabStore } from '../store/logStore'

const PREFETCH_AHEAD = 300   // lines to load ahead of viewport
const PREFETCH_BEHIND = 100  // lines to load behind viewport
const CHUNK_SIZE = 500        // lines per server request

/**
 * Manages the virtual line buffer for a single log session.
 * - Requests ALL missing chunks in the visible+prefetch range on each call.
 * - Starts from the first missing line so already-loaded chunks are never re-requested.
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

    const buf = buffers[sessionId] ?? {}

    // Walk the range; for each missing line, request its chunk, then skip to end of chunk.
    // This ensures ALL missing chunks in the range are fetched, not just the first one.
    for (let lineNum = rangeStart; lineNum <= rangeEnd; lineNum++) {
      if (buf[lineNum] === undefined) {
        const chunkStart = Math.floor(lineNum / CHUNK_SIZE) * CHUNK_SIZE
        if (!inFlight.current.has(chunkStart)) {
          inFlight.current.add(chunkStart)
          const chunkEnd = Math.min(totalLines - 1, chunkStart + CHUNK_SIZE - 1)
          const chunkCount = chunkEnd - chunkStart + 1

          hub.invoke('RequestLines', sessionId, chunkStart, chunkCount)
            .then(() => updateTab(sessionId, { errorMessage: undefined }))
            .catch((e) => {
              const msg = e instanceof Error ? e.message : 'Failed to request lines from server'
              updateTab(sessionId, { errorMessage: msg })
            })
            .finally(() => inFlight.current.delete(chunkStart))
        }
        // Skip to end of this chunk to avoid redundant checks within the same chunk
        lineNum = chunkStart + CHUNK_SIZE - 1
      }
    }
  }, [sessionId, totalLines, buffers, hub, updateTab])

  const getLineText = useCallback((lineNumber: number): string | undefined => {
    return getLine(sessionId, lineNumber)
  }, [getLine, sessionId])

  return { totalLines, ensureRange, getLineText }
}
