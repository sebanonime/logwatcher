import { useCallback, useRef } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useLogStore, useTabStore } from '../store/logStore'

const PREFETCH_AHEAD = 400   // lignes à charger en avance
const PREFETCH_BEHIND = 200  // lignes à retenir en arrière du viewport
const CHUNK_SIZE = 500       // lignes par bloc de requête serveur

/**
 * Gère le chargement asynchrone des lignes de logs par morceaux (chunks).
 * Synchronisé avec le mode fenêtré pour éviter les requêtes redondantes.
 */
export function useVirtualLines(sessionId: string, hub: HubConnection) {
  const { getLine, buffers } = useLogStore()
  const { tabs, updateTab } = useTabStore()
  const tab = tabs.find(t => t.sessionId === sessionId)
  const totalLines = tab?.contextTotalLines ?? tab?.totalLines ?? 0
  const sourceOffset = tab?.contextStartLine ?? 0

  // Suivi des requêtes en cours pour éviter les doublons
  const inFlight = useRef<Set<number>>(new Set())

  const ensureRange = useCallback((startLine: number, count: number) => {
    if (!sessionId || totalLines === 0) return

    const rangeStart = Math.max(0, startLine - PREFETCH_BEHIND)
    const rangeEnd = Math.min(totalLines - 1, startLine + count + PREFETCH_AHEAD)

    const buf = buffers[sessionId] ?? {}

    // Parcours de la plage visible + préchargement
    for (let lineNum = rangeStart; lineNum <= rangeEnd; lineNum++) {
      if (buf[lineNum] === undefined) {
        const chunkStart = Math.floor(lineNum / CHUNK_SIZE) * CHUNK_SIZE
        
        if (!inFlight.current.has(chunkStart)) {
          inFlight.current.add(chunkStart)
          
          const chunkEnd = Math.min(totalLines - 1, chunkStart + CHUNK_SIZE - 1)
          const chunkCount = chunkEnd - chunkStart + 1
          const sourceChunkStart = chunkStart + sourceOffset

          hub.invoke('RequestLines', sessionId, sourceChunkStart, chunkCount)
            .then(() => updateTab(sessionId, { errorMessage: undefined }))
            .catch((e) => {
              const msg = e instanceof Error ? e.message : 'Failed to request lines from server'
              updateTab(sessionId, { errorMessage: msg })
            })
            .finally(() => inFlight.current.delete(chunkStart))
        }
        
        // On saute à la fin du chunk actuel pour maximiser l'efficacité de la boucle
        lineNum = chunkStart + CHUNK_SIZE - 1
      }
    }
  }, [sessionId, totalLines, buffers, hub, updateTab, sourceOffset])

  const getLineText = useCallback((lineNumber: number): string | undefined => {
    return getLine(sessionId, lineNumber)
  }, [getLine, sessionId])

  return { totalLines, ensureRange, getLineText }
}