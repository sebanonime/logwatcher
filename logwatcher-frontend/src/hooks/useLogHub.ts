// uploaded:useLogHub.ts

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
    const lastReopenAt: Record<string, number> = {}

    hub.on('OnNewLines', (sessionId: string, lines: LineDto[], totalLines: number) => {
      addLines(sessionId, lines)
      updateTab(sessionId, { totalLines, errorMessage: undefined })
    })

    hub.on('OnLines', (sessionId: string, startLine: number, lines: LineDto[], viewVersion?: number) => {
      const tab = useTabStore.getState().tabs.find(t => t.sessionId === sessionId)
      if (typeof viewVersion === 'number' && typeof tab?.viewVersion === 'number' && viewVersion !== tab.viewVersion) {
        // TEMP DIAGNOSTIC (missing-lines investigation): message discarded because the
        // view changed (filter/reload) between the request and this response.
        console.warn(
          `[LogHub] OnLines dropped (viewVersion mismatch) session=${sessionId} startLine=${startLine} count=${lines.length} responseVersion=${viewVersion} tabVersion=${tab?.viewVersion}`
        )
        return
      }

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
        // Le filtrage est terminé, on désactive l'indicateur sur le tab
        isFiltering: false,
        filterProgress: undefined,
      })
      // FIX: clear the dedicated filtersInProgress flag so LogViewer hides the progress bar.
      // hub.invoke('SetFilter') returns immediately when the server accepts the command,
      // but actual filtering happens asynchronously. OnFileStats is the real signal of completion.
      useTabStore.getState().setFilterInProgress(sessionId, false)
    })

    hub.on('OnReload', async (sessionId: string) => {
      const currentTab = useTabStore.getState().tabs.find(t => t.sessionId === sessionId)
      console.info('[LogHub] OnReload received for session', sessionId, 'tab found:', !!currentTab)
      if (!currentTab) return

      // Reset the frontend view immediately (clear buffer + remount the virtual list).
      clearBuffer(sessionId)
      updateTab(sessionId, {
        totalLines: 0,
        isIndexed: false,
        newLinesCount: 0,
        reloadNonce: (currentTab.reloadNonce ?? 0) + 1,
        viewVersion: undefined,
        contextStartLine: undefined,
        contextTotalLines: undefined,
        isFiltering: false,
        filterProgress: undefined,
        tailMode: true,
      })

      // ROBUST RECOVERY: fully recreate the backend session (CloseLog + OpenLog) — exactly what a
      // manual close/reopen does, which is the only reliably-working recovery. Debounced to avoid
      // tight reopen loops if the file keeps rolling rapidly.
      const now = Date.now()
      if (now - (lastReopenAt[sessionId] ?? 0) < 3000) {
        console.info('[LogHub] OnReload reopen debounced for', sessionId)
        return
      }
      lastReopenAt[sessionId] = now

      try {
        await hub.invoke('CloseLog', sessionId)
        await hub.invoke('OpenLog', sessionId, currentTab.serverId, currentTab.filePath, {
          loadFromEnd: true,
          initialLines: 500,
          profileName: currentTab.activeProfileName,
        })
        if (currentTab.activeProfileName) {
          await hub.invoke('SetProfile', sessionId, currentTab.activeProfileName)
        }
        console.info('[LogHub] Session reopened after roll:', sessionId)
      } catch (e) {
        console.error('[LogHub] Failed to reopen session after roll:', sessionId, e)
      }
    })

    hub.on('OnIndexProgress', (sessionId: string, bytesIndexed: number, totalBytes: number) => {
      updateTab(sessionId, { indexedBytes: bytesIndexed, indexTotalBytes: totalBytes })
    })

    hub.on('OnFilterProgress', (sessionId: string, processed: number, total: number) => {
      updateTab(sessionId, {
        filterProgress: total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : undefined,
      })
    })

    hub.on('OnError', (sessionId: string, message: string) => {
      console.error(`[LogHub] session=${sessionId}:`, message)
      // En cas d'erreur aussi, on stoppe l'indicateur sur le tab ET dans filtersInProgress
      updateTab(sessionId, { errorMessage: message, isFiltering: false, filterProgress: undefined })
      useTabStore.getState().setFilterInProgress(sessionId, false)
    })

    // On reconnect, re-join all active session groups so the client
    // keeps receiving server→client pushes (OnNewLines, OnReload, etc.).
    // Search-result tabs are static snapshots served by the backend from memory — they don't
    // represent a real file to (re)open, so re-invoking OpenLog for them would just error out.
    hub.onreconnected(() => {
      const allTabs = useTabStore.getState().tabs
      for (const tab of allTabs) {
        if (tab.isSearchResults) continue
        try {
          hub.invoke('OpenLog', tab.sessionId, tab.serverId, tab.filePath, {
            encoding: 'UTF-8',
            loadFromEnd: true,
          }).catch(() => {})
        } catch { /* ignore - best effort */ }
      }
    })

    // Fallback: if the connection stays in Reconnecting for >30s,
    // try a full restart (rare edge-case with proxy timeouts).
    hub.onclose(async (err) => {
      if (err) {
        console.warn('[LogHub] Connection closed with error, restarting...', err.message)
        await new Promise(r => setTimeout(r, 1000))
        startLogHub().catch(console.error)
      }
    })

    startLogHub().catch(console.error)

    return () => {
      // Don't stop the hub on cleanup — it's a singleton for the app lifetime
    }
  }, [addLines, addLinesAt, clearBuffer, updateTab])

  return getLogHub()
}