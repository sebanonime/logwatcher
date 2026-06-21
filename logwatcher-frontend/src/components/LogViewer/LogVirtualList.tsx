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
const VIRTUAL_VIEWPORT_LINES = 40_000 // Taille maximale du buffer local du DOM

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

  // Fenêtrage glissant local
  const [windowStartIndex, setWindowStartIndex] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  
  const currentBufferCount = Math.min(totalLines, VIRTUAL_VIEWPORT_LINES)
  const lastScrollTopRef = useRef(0)
  const isAdjustingScrollRef = useRef(false)

  // Recalage automatique en fin de fichier sur activation du Tail Mode
  useEffect(() => {
    if (tailMode && totalLines > VIRTUAL_VIEWPORT_LINES) {
      setWindowStartIndex(totalLines - VIRTUAL_VIEWPORT_LINES)
      setTimeout(() => {
        if (parentRef.current) {
          parentRef.current.scrollTop = parentRef.current.scrollHeight
        }
      }, 15)
    }
  }, [tailMode, totalLines])

  const virtualizer = useVirtualizer({
    count: currentBufferCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => LINE_HEIGHT,
    overscan: 25,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    if (virtualItems.length === 0) return
    const globalStart = windowStartIndex + virtualItems[0].index
    ensureRange(globalStart, virtualItems.length)
  }, [virtualItems, windowStartIndex, ensureRange])

  // Gestionnaire de défilement transparent
  const handleScroll = useCallback(() => {
    const el = parentRef.current
    if (!el) return

    const currentTop = el.scrollTop
    setScrollTop(currentTop)
    
    const maxScroll = el.scrollHeight - el.clientHeight
    const scrollingUp = currentTop < lastScrollTopRef.current

    if (isAdjustingScrollRef.current) {
      lastScrollTopRef.current = currentTop
      isAdjustingScrollRef.current = false
      return
    }

    if (!tailMode && totalLines > VIRTUAL_VIEWPORT_LINES) {
      // Seuil haut atteint -> glissement vers le début
      if (scrollingUp && currentTop < 4000 && windowStartIndex > 0) {
        const stepLines = 4000
        const nextStart = Math.max(0, windowStartIndex - stepLines)
        const actualDeltaLines = windowStartIndex - nextStart

        isAdjustingScrollRef.current = true
        setWindowStartIndex(nextStart)
        el.scrollTop = currentTop + (actualDeltaLines * LINE_HEIGHT)
        lastScrollTopRef.current = el.scrollTop
        return
      }

      // Seuil bas atteint -> glissement vers la fin
      if (!scrollingUp && (maxScroll - currentTop) < 4000 && (windowStartIndex + VIRTUAL_VIEWPORT_LINES) < totalLines) {
        const stepLines = 4000
        const nextStart = Math.min(totalLines - VIRTUAL_VIEWPORT_LINES, stepLines + windowStartIndex)
        const actualDeltaLines = nextStart - windowStartIndex

        isAdjustingScrollRef.current = true
        setWindowStartIndex(nextStart)
        el.scrollTop = currentTop - (actualDeltaLines * LINE_HEIGHT)
        lastScrollTopRef.current = el.scrollTop
        return
      }
    }

    // Débrayage si remontée manuelle importante
    if (tailMode && scrollingUp && currentTop < maxScroll - 40) {
      updateTab(sessionId, { tailMode: false })
      hub.invoke('SetTail', sessionId, false).catch(() => {})
    }

    // Réactivation automatique si on touche le fond absolu
    const isAtAbsoluteBottom = totalLines <= VIRTUAL_VIEWPORT_LINES 
      ? (maxScroll - currentTop <= 10)
      : (windowStartIndex >= (totalLines - VIRTUAL_VIEWPORT_LINES) && (maxScroll - currentTop <= 10))

    if (!tailMode && isAtAbsoluteBottom && totalLines > 0) {
      updateTab(sessionId, { tailMode: true })
      hub.invoke('SetTail', sessionId, true).catch(() => {})
    }

    lastScrollTopRef.current = currentTop
  }, [windowStartIndex, totalLines, tailMode, sessionId, hub, updateTab])

  // ── ACTIONS DE SAUT DIRECT ─────────────────────────────────────────
  const handleGoToStart = useCallback(async () => {
    updateTab(sessionId, { tailMode: false })
    try { await hub.invoke('SetTail', sessionId, false) } catch {}

    isAdjustingScrollRef.current = true
    setWindowStartIndex(0)
    if (parentRef.current) {
      parentRef.current.scrollTop = 0
      setScrollTop(0)
      lastScrollTopRef.current = 0
    }
  }, [sessionId, hub, updateTab])

  const handleGoToEnd = useCallback(async () => {
    updateTab(sessionId, { tailMode: true })
    try { await hub.invoke('SetTail', sessionId, true) } catch {}

    if (totalLines > VIRTUAL_VIEWPORT_LINES) {
      setWindowStartIndex(totalLines - VIRTUAL_VIEWPORT_LINES)
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

  // Calcul exact de la visibilité des boutons
  const maxScrollPossible = parentRef.current ? Math.max(0, parentRef.current.scrollHeight - parentRef.current.clientHeight) : 0
  
  const showGoToStart = windowStartIndex > 0 || scrollTop > 20
  
  // Correction pour les petits fichiers : si on a du contenu scrollable et qu'on n'est pas en bas, ou si la fenêtre glissante n'a pas atteint la fin
  const showGoToEnd = totalLines > 0 && (
    totalLines > VIRTUAL_VIEWPORT_LINES 
      ? (windowStartIndex < totalLines - VIRTUAL_VIEWPORT_LINES || (maxScrollPossible - scrollTop > 20))
      : (maxScrollPossible - scrollTop > 20)
  )

  // Style sans opacité/transparence et calé à droite à 6px
  const baseButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '6px', 
    zIndex: 20,
    background: 'var(--bg-3, #3f4450)', // Couleur légèrement plus contrastée par défaut pour ressortir sur les longs textes
    color: 'var(--text-1, #ffffff)',
    border: '1px solid var(--border, #434955)',
    padding: '4px 8px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
    boxShadow: '0 2px 5px rgba(0,0,0,0.6)',
    opacity: 1, // Transparence supprimée à 100%
    transition: 'background-color 0.1s',
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* BOUTON HAUT */}
      {showGoToStart && (
        <button
          onClick={handleGoToStart}
          style={{ ...baseButtonStyle, top: '8px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-2, #2d3139)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-3, #3f4450)')}
        >
          ▲ Début
        </button>
      )}

      {/* BOUTON BAS */}
      {showGoToEnd && (
        <button
          onClick={handleGoToEnd}
          style={{ ...baseButtonStyle, bottom: '8px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-2, #2d3139)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-3, #3f4450)')}
        >
          ▼ Fin
        </button>
      )}

      {/* ZONE DE SCROLL DES LOGS */}
      <div
        ref={parentRef}
        className="log-virtual-list"
        tabIndex={0}
        onScroll={handleScroll}
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