import { useEffect, useRef } from 'react'
import { getLogHub, startLogHub } from '../signalr/logHubConnection'
import { useLogStore, useTabStore } from '../store/logStore'
import type { LineDto, FileStatsDto } from '../types'

/**
 * Connects to LogHub, wires up server→client messages, and keeps the store updated.
 * Call once at the top of the app.
 */
export function useLogHub() {
  const started = useRef(false)
  const { addLines, addLinesAt, clearBuffer } = useLogStore()
  const { updateTab } = useTabStore()

  useEffect(() => {
    if (started.current) return
    started.current = true

    const hub = getLogHub()

    hub.on('OnNewLines', (sessionId: string, lines: LineDto[], totalLines: number) => {
      addLines(sessionId, lines)
      updateTab(sessionId, { totalLines, errorMessage: undefined })
    })

    hub.on('OnLines', (sessionId: string, startLine: number, lines: LineDto[], viewVersion?: number) => {
      const tab = useTabStore.getState().tabs.find(t => t.sessionId === sessionId)
      if (typeof viewVersion === 'number' && typeof tab?.viewVersion === 'number' && viewVersion !== tab.viewVersion)
        return

      if (typeof tab?.contextStartLine === 'number' && typeof tab?.contextTotalLines === 'number') {
        const localStart = startLine - tab.contextStartLine
        const localEnd = localStart + lines.length - 1
        if (localEnd >= 0 && localStart < tab.contextTotalLines) {
          const first = Math.max(0, -localStart)
          const lastExclusive = Math.min(lines.length, tab.contextTotalLines - localStart)
          const clipped = lines.slice(first, lastExclusive)
          addLinesAt(sessionId, Math.max(0, localStart), clipped)
        }
      } else {
        addLinesAt(sessionId, startLine, lines)
      }

      if (typeof viewVersion === 'number') {
        updateTab(sessionId, { errorMessage: undefined, viewVersion })
      } else {
        updateTab(sessionId, { errorMessage: undefined })
      }
    })

    hub.on('OnFileStats', (sessionId: string, stats: FileStatsDto) => {
      const tab = useTabStore.getState().tabs.find(t => t.sessionId === sessionId)
      if (typeof tab?.viewVersion === 'number' && tab.viewVersion !== stats.viewVersion)
        clearBuffer(sessionId)

      const visibleTotal = typeof tab?.contextTotalLines === 'number'
        ? tab.contextTotalLines
        : stats.totalLines

      updateTab(sessionId, {
        totalLines: visibleTotal,
        sizeBytes: stats.sizeBytes,
        isIndexed: stats.isIndexed,
        viewVersion: stats.viewVersion,
      })
    })

    hub.on('OnReload', (sessionId: string) => {
      clearBuffer(sessionId)
      updateTab(sessionId, { totalLines: 0, isIndexed: false, newLinesCount: 0 })
    })

    hub.on('OnIndexProgress', (sessionId: string, bytesIndexed: number, totalBytes: number) => {
      updateTab(sessionId, { indexedBytes: bytesIndexed, indexTotalBytes: totalBytes })
    })

    hub.on('OnFilterProgress', (_sessionId: string, _processed: number, _total: number) => {
      // Future: show filter progress indicator
    })

    hub.on('OnError', (sessionId: string, message: string) => {
      console.error(`[LogHub] session=${sessionId}:`, message)
      updateTab(sessionId, { errorMessage: message })
    })

    startLogHub().catch(console.error)

    return () => {
      // Don't stop the hub on cleanup — it's a singleton for the app lifetime
    }
  }, [addLines, addLinesAt, clearBuffer, updateTab])

  return getLogHub()
}
