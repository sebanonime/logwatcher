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

  // Nombre de lignes affichables dans la page courante
  const currentBufferCount = Math.min(totalLines - windowStartIndex, BUFFER_PAGE_SIZE)
  const lastScrollTopRef = useRef(0)

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
  useEffect(() => {
    if (virtualItems.length === 0) return
    const globalStart = windowStartIndex + virtualItems[0].index
    ensureRange(globalStart, virtualItems.length)
  }, [virtualItems, windowStartIndex, ensureRange])

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
    try { await hub.invoke('SetTail', sessionId, true) } catch {}

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
    right: '6px', 
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
          style={{ ...baseButtonStyle, top: '8px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-2, #2d3139)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-3, #3f4450)')}
        >
          ▲ Début
        </button>
      )}

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