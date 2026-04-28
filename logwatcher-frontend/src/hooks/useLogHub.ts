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
  const { addLines, clearBuffer } = useLogStore()
  const { updateTab } = useTabStore()

  useEffect(() => {
    if (started.current) return
    started.current = true

    const hub = getLogHub()

    hub.on('OnNewLines', (sessionId: string, lines: LineDto[], totalLines: number) => {
      addLines(sessionId, lines)
      updateTab(sessionId, { totalLines, errorMessage: undefined })
    })

    hub.on('OnLines', (sessionId: string, lines: LineDto[]) => {
      addLines(sessionId, lines)
      updateTab(sessionId, { errorMessage: undefined })
    })

    hub.on('OnFileStats', (sessionId: string, stats: FileStatsDto) => {
      updateTab(sessionId, {
        totalLines: stats.totalLines,
        sizeBytes: stats.sizeBytes,
        isIndexed: stats.isIndexed,
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
  }, [addLines, clearBuffer, updateTab])

  return getLogHub()
}
