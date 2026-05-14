import { useCallback, useEffect, useRef } from 'react'
import { useDesktopStore } from '../store/desktopStore'

const PREFETCH_AHEAD = 200
const PREFETCH_BEHIND = 100
const CHUNK_SIZE = 300

/**
 * Manages local file line loading via IPC.
 * Mirrors the pattern of useVirtualLines but uses window.electronAPI instead of SignalR.
 */
export function useLocalVirtualLines(tabId: string) {
  const { localTabs, addLocalLines } = useDesktopStore()
  const tab = localTabs.find((t) => t.id === tabId)
  const totalLines = tab?.totalLines ?? 0
  const inFlight = useRef<Set<number>>(new Set())

  // Subscribe to file append events once
  useEffect(() => {
    if (!tab) return
    const unsub = window.electronAPI.onLocalFileNewLines((path, lines) => {
      if (path !== tab.filePath) return
      // New lines appended — add at end
      addLocalLines(path, totalLines, lines)
    })
    return unsub
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab?.filePath, totalLines])

  const ensureRange = useCallback(
    (startLine: number, count: number) => {
      if (!tab || totalLines === 0) return

      const rangeStart = Math.max(0, startLine - PREFETCH_BEHIND)
      const rangeEnd = Math.min(totalLines - 1, startLine + count + PREFETCH_AHEAD)

      const buf = tab.buffer

      for (let lineNum = rangeStart; lineNum <= rangeEnd; lineNum++) {
        if (!buf.has(lineNum)) {
          const chunkStart = Math.floor(lineNum / CHUNK_SIZE) * CHUNK_SIZE
          if (!inFlight.current.has(chunkStart)) {
            inFlight.current.add(chunkStart)
            const chunkCount = Math.min(CHUNK_SIZE, totalLines - chunkStart)

            window.electronAPI
              .readLocalFile(tab.filePath, chunkStart, chunkCount)
              .then((lines) => {
                addLocalLines(
                  tab.filePath,
                  chunkStart,
                  lines.map((l) => l.text)
                )
              })
              .catch((e) => console.error('localFile:read error', e))
              .finally(() => inFlight.current.delete(chunkStart))
          }
          lineNum = chunkStart + CHUNK_SIZE - 1
        }
      }
    },
    [tab, totalLines, addLocalLines]
  )

  const getLineText = useCallback(
    (lineNumber: number): string | undefined => tab?.buffer.get(lineNumber),
    [tab]
  )

  return { ensureRange, getLineText, totalLines }
}
