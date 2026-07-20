import React, { useRef, useCallback, useEffect, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { HubConnection } from '@microsoft/signalr'
import { useVirtualLines } from '../../hooks/useVirtualLines'
import { useHighlighting } from '../../hooks/useHighlighting'
import { useLogStore, useTabStore } from '../../store/logStore'
import { useSelectionStore, orderedRange } from '../../store/selectionStore'
import { LogLine } from './LogLine'
import type { HighlightingRule } from '../../types'

const LINE_HEIGHT = 20  // px
const BUFFER_PAGE_SIZE = 40_000 // Taille de la page locale dans le DOM

interface LogVirtualListProps {
  sessionId: string
  hub: HubConnection
  highlightingRules: HighlightingRule[]
  fallbackHighlightingRules?: HighlightingRule[]
  tailMode: boolean
}

export function LogVirtualList({ sessionId, hub, highlightingRules, fallbackHighlightingRules = [], tailMode }: LogVirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const { totalLines, ensureRange, getLineText } = useVirtualLines(sessionId, hub)
  const { highlightLine } = useHighlighting(highlightingRules, fallbackHighlightingRules)
  const { setSelectedLine, getSelectedLine } = useLogStore()
  const { updateTab, activeSessionId } = useTabStore()
  const selectionStore = useSelectionStore()
  
  const activeSessionIdRef = useRef(activeSessionId)
  activeSessionIdRef.current = activeSessionId

  // L'index global de départ de notre pagination/buffer
  const [windowStartIndex, setWindowStartIndex] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  // AJUSTEMENT SÉCURISÉ : Nombre de lignes affichables dans la page courante (garanti >= 0)
  const currentBufferCount = Math.max(0, Math.min(totalLines - windowStartIndex, BUFFER_PAGE_SIZE))
  const lastScrollTopRef = useRef(0)

  // EFFET OPTIONNEL/RECOMMANDÉ : Gestion de la réinitialisation lors du File Rolling
  useEffect(() => {
    if (totalLines < windowStartIndex) {
      setWindowStartIndex(0)
      setScrollTop(0)
      lastScrollTopRef.current = 0
      
      if (parentRef.current) {
        parentRef.current.scrollTop = 0
      }
      
      // Force la recalculation des dimensions internes du virtualiseur
      virtualizer.measure()
    }
  }, [totalLines, windowStartIndex])

  // Gestion du Tail Mode (Suivi de fin de fichier)
  useEffect(() => {
    if (tailMode && totalLines > BUFFER_PAGE_SIZE) {
      setWindowStartIndex(totalLines - BUFFER_PAGE_SIZE)
      setTimeout(() => {
        if (parentRef.current) {
          parentRef.current.scrollTop = parentRef.current.scrollHeight
        }
      }, 15)
    }
  }, [tailMode, totalLines])

  // Virtualiseur standard, sans aucune modification de comportement
  const virtualizer = useVirtualizer({
    count: Math.max(0, currentBufferCount),
    getScrollElement: () => parentRef.current,
    estimateSize: () => LINE_HEIGHT,
    overscan: 25,
  })

  const virtualItems = virtualizer.getVirtualItems()

  // Déclenchement du fetch SignalR (via useVirtualLines)
  const persistentGapsRef = useRef<Map<number, number>>(new Map())
  useEffect(() => {
    if (virtualItems.length === 0) return
    const globalStart = windowStartIndex + virtualItems[0].index
    ensureRange(globalStart, virtualItems.length)

    // TEMP DIAGNOSTIC (missing-lines investigation): flag lines that stay undefined
    // in the buffer for longer than expected while visible on screen.
    const now = Date.now()
    const buf = useLogStore.getState().buffers[sessionId] ?? {}
    const gaps = persistentGapsRef.current
    const stillVisible = new Set<number>()
    for (const vItem of virtualItems) {
      const lineNum = windowStartIndex + vItem.index
      if (lineNum < 0 || lineNum >= totalLines) continue
      // Ignore the last line: the backend index keeps one empty "pending" trailing line whenever the
      // file currently ends with a newline, which legitimately has no content until more is written.
      if (lineNum >= totalLines - 1) continue
      stillVisible.add(lineNum)
      if (buf[lineNum] === undefined) {
        if (!gaps.has(lineNum)) gaps.set(lineNum, now)
      } else {
        gaps.delete(lineNum)
      }
    }
    for (const [lineNum, firstSeen] of gaps) {
      if (!stillVisible.has(lineNum)) { gaps.delete(lineNum); continue }
      if (now - firstSeen > 2000) {
        console.warn(`[LogVirtualList] Persistent gap: line ${lineNum} still missing after 2s (session ${sessionId})`)
        gaps.delete(lineNum)
      }
    }
  }, [virtualItems, windowStartIndex, ensureRange, sessionId, totalLines])

  // ── GESTION DE LA RECONNEXION SIGNALR (Sortie de veille du navigateur) ──
  useEffect(() => {
    const handleReconnected = () => {
      console.log(`[LogVirtualList] Reconnexion détectée pour la session ${sessionId}. Resynchronisation...`)
      
      // Si on était en train de suivre la fin du fichier, on force le backend à 
      // relancer le tail pour récupérer tout ce qu'on a manqué pendant la veille.
      if (tailMode) {
        hub.invoke('SetTail', sessionId, true).catch(err => 
          console.error('[LogVirtualList] Erreur lors de la resynchronisation du Tail:', err)
        )
      } else {
        // Optionnel : si tu as une méthode côté serveur pour forcer le renvoi des FileStats, 
        // tu peux l'appeler ici pour mettre à jour la taille totale de l'index.
        // hub.invoke('RequestFileStats', sessionId).catch(() => {})
      }
    }

    // On écoute l'événement global qu'on a dispatché depuis logHubConnection.ts
    window.addEventListener('logwatcher-reconnected', handleReconnected)

    return () => {
      window.removeEventListener('logwatcher-reconnected', handleReconnected)
    }
  }, [hub, sessionId, tailMode])

  // Gestion du scroll simplifiée (Infinite Scroll par page)
  const handleScroll = useCallback(() => {
    const el = parentRef.current
    if (!el) return

    const currentTop = el.scrollTop
    setScrollTop(currentTop)

    const maxScroll = el.scrollHeight - el.clientHeight
    const scrollingUp = currentTop < lastScrollTopRef.current

    // INFINITE SCROLL : Si on arrive près du bas de la page courante, on pousse la fenêtre vers le bas
    if (!scrollingUp && maxScroll - currentTop < 200 && (windowStartIndex + BUFFER_PAGE_SIZE) < totalLines) {
      const step = 5000
      const oldStartIndex = windowStartIndex
      
      setWindowStartIndex(prev => {
        const nextIndex = Math.min(totalLines - BUFFER_PAGE_SIZE, prev + step)
        const effectiveStep = nextIndex - oldStartIndex // Nombre réel de lignes sautées
        
        if (effectiveStep > 0) {
          // On ajuste immédiatement le scrollTop du DOM pour compenser le changement d'index
          // On recule le scroll de (lignes sautées * hauteur d'une ligne)
          const scrollCompensation = effectiveStep * LINE_HEIGHT
          el.scrollTop = currentTop - scrollCompensation
          lastScrollTopRef.current = currentTop - scrollCompensation
        }
        
        return nextIndex
      })
      return // On sort pour éviter d'exécuter la logique de Tail mode sur un scroll technique
    }

    // Débrayage du mode Tail si remontée manuelle
    if (tailMode && scrollingUp && currentTop < maxScroll - 40) {
      updateTab(sessionId, { tailMode: false })
      hub.invoke('SetTail', sessionId, false).catch(() => {})
    }

    // Réactivation du mode Tail si fond absolu atteint
    const isAtAbsoluteBottom = (windowStartIndex + currentBufferCount >= totalLines) && (maxScroll - currentTop <= 10)
    if (!tailMode && isAtAbsoluteBottom && totalLines > 0) {
      updateTab(sessionId, { tailMode: true })
      hub.invoke('SetTail', sessionId, true).catch(() => {})
    }

    lastScrollTopRef.current = currentTop
  }, [windowStartIndex, currentBufferCount, totalLines, tailMode, sessionId, hub, updateTab])

  const handleCopy = useCallback((e: React.ClipboardEvent) => {
    const selectionRange = selectionStore.getSelection(sessionId)
    if (!selectionRange) return

    // Empêche le comportement de copie par défaut (qui copierait du texte partiel ou mal formatté du DOM)
    e.preventDefault()

    // Récupération des lignes dans le bon ordre (du plus petit index au plus grand)
    const { start, end } = orderedRange(selectionRange)
    const linesToCopy: string[] = []

    for (let i = start; i <= end; i++) {
      const text = getLineText(i)
      if (text !== undefined) {
        linesToCopy.push(text)
      }
    }

    // Jointure avec des retours à la ligne système
    const textToClipboard = linesToCopy.join('\n')

    // Injection dans le presse-papier
    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', textToClipboard)
    } else if (navigator.clipboard) {
      // Fallback moderne au cas où l'événement synchrone n'a pas accès au clipboardData
      navigator.clipboard.writeText(textToClipboard).catch(() => {})
    }
  }, [sessionId, selectionStore, getLineText])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault() // Évite le scroll natif du container par défaut

    const selectedLine = getSelectedLine(sessionId)
    let nextLineNumber = selectedLine ? selectedLine.lineNumber : 0

    if (e.key === 'ArrowDown') {
      nextLineNumber = Math.min(totalLines - 1, nextLineNumber + 1)
    } else if (e.key === 'ArrowUp') {
      nextLineNumber = Math.max(0, nextLineNumber - 1)
    }

    // Si on change effectivement de ligne
    if (!selectedLine || nextLineNumber !== selectedLine.lineNumber) {
      const text = getLineText(nextLineNumber) ?? ''

      if (e.shiftKey) {
        // MULTI-SÉLECTION (Shift + Up/Down)
        const existingSelection = selectionStore.getSelection(sessionId)
        const anchor = existingSelection?.anchor ?? (selectedLine?.lineNumber ?? nextLineNumber)
        selectionStore.setSelection(sessionId, anchor, nextLineNumber)
      } else {
        // SÉLECTION SIMPLE
        selectionStore.clearSelection(sessionId)
        selectionStore.setSelection(sessionId, nextLineNumber, nextLineNumber)
      }

      // Met à jour la ligne active (le curseur)
      setSelectedLine(sessionId, { lineNumber: nextLineNumber, text })

      // ── GESTION DU SCROLL AUTOMATIQUE ──
      // 1. Vérifier si la cible est en dehors du buffer local actuel
      if (nextLineNumber < windowStartIndex) {
        // On recule la fenêtre vers le haut
        const newStart = Math.max(0, nextLineNumber - 10) // marge de 10 lignes
        setWindowStartIndex(newStart)
        
        // On laisse le useEffect du virtualItems se déclencher et on scroll après coup
        setTimeout(() => {
          virtualizer.scrollToIndex(nextLineNumber - newStart, { align: 'start' })
        }, 0)
      } else if (nextLineNumber >= windowStartIndex + currentBufferCount) {
        // On avance la fenêtre vers le bas
        const newStart = Math.min(totalLines - BUFFER_PAGE_SIZE, nextLineNumber - BUFFER_PAGE_SIZE + 20)
        setWindowStartIndex(newStart)

        setTimeout(() => {
          virtualizer.scrollToIndex(nextLineNumber - newStart, { align: 'end' })
        }, 0)
      } else {
        // La ligne est dans le buffer local, utilisation directe du virtualiseur
        const localIndex = nextLineNumber - windowStartIndex
        virtualizer.scrollToIndex(localIndex, { align: 'auto' })
      }
    }
  }, [
    sessionId,
    totalLines,
    windowStartIndex,
    currentBufferCount,
    getSelectedLine,
    getLineText,
    selectionStore,
    setSelectedLine,
    virtualizer
  ])

  // ── ACTIONS DES BOUTONS DE SAUT EXPLICITE ─────────────────────────────────
  const handleGoToStart = useCallback(async () => {
    updateTab(sessionId, { tailMode: false })
    try { await hub.invoke('SetTail', sessionId, false) } catch {}

    setWindowStartIndex(0)
    if (parentRef.current) {
      parentRef.current.scrollTop = 0
      setScrollTop(0)
      lastScrollTopRef.current = 0
    }
  }, [sessionId, hub, updateTab])

  const handleGoToEnd = useCallback(async () => {
    updateTab(sessionId, { tailMode: true })
    try { 
      await hub.invoke('SetTail', sessionId, true) 
      await hub.invoke('RequestFileStats', sessionId)
    } catch {}

    if (totalLines > BUFFER_PAGE_SIZE) {
      setWindowStartIndex(totalLines - BUFFER_PAGE_SIZE)
    }
    setTimeout(() => {
      if (parentRef.current) {
        parentRef.current.scrollTop = parentRef.current.scrollHeight
        setScrollTop(parentRef.current.scrollHeight)
      }
    }, 15)
  }, [sessionId, hub, totalLines, updateTab])

  useEffect(() => {
    if (tailMode && parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight
    }
  }, [tailMode, totalLines, windowStartIndex])

  const handleLineClick = useCallback((lineNumber: number, text: string, shiftKey: boolean) => {
    if (shiftKey) {
      const current = getSelectedLine(sessionId)
      if (current !== null) {
        const existingSelection = selectionStore.getSelection(sessionId)
        const anchor = existingSelection?.anchor ?? current.lineNumber
        selectionStore.setSelection(sessionId, anchor, lineNumber)
        setSelectedLine(sessionId, { lineNumber, text })
        return
      }
    }
    selectionStore.clearSelection(sessionId)
    selectionStore.setSelection(sessionId, lineNumber, lineNumber)
    setSelectedLine(sessionId, { lineNumber, text })
    parentRef.current?.focus()
  }, [sessionId, getSelectedLine, setSelectedLine, selectionStore])

  const selectionRange = selectionStore.getSelection(sessionId)
  const selectedSet = (() => {
    const selectedLine = getSelectedLine(sessionId)
    if (!selectionRange) {
      const sl = selectedLine?.lineNumber
      return sl !== undefined ? new Set([sl]) : new Set<number>()
    }
    const { start, end } = orderedRange(selectionRange)
    const set = new Set<number>()
    for (let i = start; i <= end; i++) set.add(i)
    return set
  })()

  // Visibilité des boutons
  const maxScrollPossible = parentRef.current ? Math.max(0, parentRef.current.scrollHeight - parentRef.current.clientHeight) : 0
  
  const showGoToStart = windowStartIndex > 0 || scrollTop > 20
  const showGoToEnd = totalLines > 0 && (
    totalLines > BUFFER_PAGE_SIZE 
      ? (windowStartIndex + currentBufferCount < totalLines || (maxScrollPossible - scrollTop > 20))
      : (maxScrollPossible - scrollTop > 20)
  )

  const baseButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '8px', 
    zIndex: 20,
    background: 'var(--bg-3, #3f4450)',
    color: 'var(--text-1, #ffffff)',
    border: '1px solid var(--border, #434955)',
    padding: '4px 8px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
    boxShadow: '0 2px 5px rgba(0,0,0,0.6)',
    opacity: 1,
    transition: 'background-color 0.1s',
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {showGoToStart && (
        <button
          onClick={handleGoToStart}
          style={{ ...baseButtonStyle, top: '7px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-2, #2d3139)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-3, #3f4450)')}
        >
          ▲ Start
        </button>
      )}

      {showGoToEnd && (
        <button
          onClick={handleGoToEnd}
          style={{ ...baseButtonStyle, bottom: '7px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-2, #2d3139)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-3, #3f4450)')}
        >
          ▼ End
        </button>
      )}

      <div
        ref={parentRef}
        className="log-virtual-list"
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onCopy={handleCopy}
        onMouseDown={e => { if (e.shiftKey) e.preventDefault() }}
        style={{ flex: 1, outline: 'none' }}
      >
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
          {virtualItems.map(vItem => {
            const globalLineNumber = windowStartIndex + vItem.index
            if (globalLineNumber < 0 || globalLineNumber >= totalLines) return null

            const text = getLineText(globalLineNumber)
            const segments = text !== undefined ? highlightLine(text) : undefined
            const isSelected = selectedSet.has(globalLineNumber)

            return (
              <LogLine
                key={vItem.key}
                lineNumber={globalLineNumber}
                text={text}
                segments={segments}
                isSelected={isSelected}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${vItem.start}px)`,
                  height: LINE_HEIGHT,
                }}
                onClick={(e: React.MouseEvent) => handleLineClick(globalLineNumber, text ?? '', e.shiftKey)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}