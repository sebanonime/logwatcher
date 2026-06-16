import React, { useRef, useCallback, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { HubConnection } from '@microsoft/signalr'
import { useVirtualLines } from '../../hooks/useVirtualLines'
import { useHighlighting } from '../../hooks/useHighlighting'
import { useLogStore, useTabStore } from '../../store/logStore'
import { useSelectionStore, orderedRange } from '../../store/selectionStore'
import { LogLine } from './LogLine'
import type { HighlightingRule } from '../../types'

const LINE_HEIGHT = 20  // px — must match LogLine height

interface LogVirtualListProps {
  sessionId: string
  hub: HubConnection
  highlightingRules: HighlightingRule[]
  fallbackHighlightingRules?: HighlightingRule[]
  tailMode: boolean
}

/**
 * The core virtual list component.
 * Uses TanStack Virtual to render only ~20-50 rows at a time regardless of file size.
 * Fetches missing line chunks from the server as the user scrolls.
 * Supports multi-line selection with Shift+click and Shift+arrows, and Ctrl+C copy.
 */
export function LogVirtualList({ sessionId, hub, highlightingRules, fallbackHighlightingRules = [], tailMode }: LogVirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const { totalLines, ensureRange, getLineText } = useVirtualLines(sessionId, hub)
  const { highlightLine } = useHighlighting(highlightingRules, fallbackHighlightingRules)
  const { setSelectedLine, getSelectedLine } = useLogStore()
  const { updateTab } = useTabStore()
  const selectionStore = useSelectionStore()
  const selectedLine = getSelectedLine(sessionId)
  const lastScrollTopRef = useRef(0)
  const wasNearBottomRef = useRef(true)
  const previousSelectedLineRef = useRef<number | null>(null)
  const togglingTailRef = useRef(false)
  const suppressScrollRef = useRef(false)

  const virtualizer = useVirtualizer({
    count: totalLines,
    getScrollElement: () => parentRef.current,
    estimateSize: () => LINE_HEIGHT,
    overscan: 20,
  })

  const virtualItems = virtualizer.getVirtualItems()

  // Fetch lines for the visible + overscan range
  const fetchVisible = useCallback(() => {
    if (virtualItems.length === 0) return
    const first = virtualItems[0].index
    const last = virtualItems[virtualItems.length - 1].index
    ensureRange(first, last - first + 1)
  }, [virtualItems, ensureRange])

  useEffect(() => {
    fetchVisible()
  }, [fetchVisible])

  // Auto-scroll to bottom when tail mode is on
  useEffect(() => {
    if (tailMode && totalLines > 0) {
      virtualizer.scrollToIndex(totalLines - 1, { align: 'end' })
      wasNearBottomRef.current = true
    }
  }, [tailMode, totalLines, virtualizer])

  const handleScroll = useCallback(async () => {
    const el = parentRef.current
    if (!el) return

    const currentTop = el.scrollTop
    const scrollingUp = currentTop < lastScrollTopRef.current
    const nearBottom = el.scrollHeight - el.clientHeight - currentTop <= 8

    // If user was at bottom and starts scrolling up, disable tail automatically.
    if (tailMode && scrollingUp && wasNearBottomRef.current && !nearBottom && !togglingTailRef.current) {
      togglingTailRef.current = true
      updateTab(sessionId, { tailMode: false })
      try {
        await hub.invoke('SetTail', sessionId, false)
      } catch {
        // Keep local tail state off; transport errors are surfaced elsewhere.
      } finally {
        togglingTailRef.current = false
      }
    }

    // If user reaches bottom while tail is off, re-enable tail automatically.
    if (!tailMode && nearBottom && !wasNearBottomRef.current && !togglingTailRef.current) {
      togglingTailRef.current = true
      updateTab(sessionId, { tailMode: true })
      try {
        await hub.invoke('SetTail', sessionId, true)
      } catch {
        // Keep local tail state on; transport errors are surfaced elsewhere.
      } finally {
        togglingTailRef.current = false
      }
    }

    lastScrollTopRef.current = currentTop
    wasNearBottomRef.current = nearBottom
  }, [tailMode, hub, sessionId, updateTab])

  useEffect(() => {
    const selected = selectedLine?.lineNumber
    if (selected === undefined || selected < 0 || selected >= totalLines) return

    const hasChanged = previousSelectedLineRef.current !== selected
    previousSelectedLineRef.current = selected
    if (!hasChanged) return

    if (suppressScrollRef.current) {
      suppressScrollRef.current = false
      return
    }

    const firstVisible = virtualItems[0]?.index ?? 0
    const lastVisible = virtualItems[virtualItems.length - 1]?.index ?? -1
    if (selected < firstVisible || selected > lastVisible) {
      virtualizer.scrollToIndex(selected, { align: 'center' })
    }
  }, [selectedLine?.lineNumber, totalLines, virtualItems, virtualizer])

  /**
   * Handle a click on a log line.
   * - Simple click: sets the single selected line and resets anchor.
   * - Shift+click: extends the multi-selection range from anchor to clicked line.
   */
  const handleLineClick = useCallback((lineNumber: number, text: string, shiftKey: boolean) => {
    if (shiftKey) {
      const current = getSelectedLine(sessionId)
      if (current !== null) {
        // Get existing anchor, or use current selection as anchor
        const existingSelection = selectionStore.getSelection(sessionId)
        const anchor = existingSelection?.anchor ?? current.lineNumber
        selectionStore.setSelection(sessionId, anchor, lineNumber)
        // Also keep single-selection on the focused line
        setSelectedLine(sessionId, { lineNumber, text })
        return
      }
    }
    // Simple click: reset multi-selection and set anchor
    selectionStore.clearSelection(sessionId)
    selectionStore.setSelection(sessionId, lineNumber, lineNumber)
    setSelectedLine(sessionId, { lineNumber, text })
  }, [sessionId, getSelectedLine, setSelectedLine, selectionStore])

  /**
   * Build selection state for rendering: a Set of line numbers in range.
   */
  const selectionRange = selectionStore.getSelection(sessionId)
  const selectedLinesSet = useCallback(() => {
    if (!selectionRange) {
      const sl = selectedLine?.lineNumber
      return sl !== undefined ? new Set([sl]) : new Set<number>()
    }
    const { start, end } = orderedRange(selectionRange)
    const set = new Set<number>()
    for (let i = start; i <= end; i++) set.add(i)
    return set
  }, [selectionRange, selectedLine?.lineNumber])

  const selectedSet = selectedLinesSet()

  // Keyboard handler with Shift+Up/Down and Ctrl+C
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Ctrl+C copy
      if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
        // If focus is on an input/textarea or user has a manual text selection
        // (e.g. in the Inspect panel), let the browser handle default copy behaviour
        const target = event.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
        if (window.getSelection() && !window.getSelection()!.isCollapsed) return

        const range = selectionStore.getSelection(sessionId)
        if (range) {
          const { start, end } = orderedRange(range)
          const lines: string[] = []
          for (let i = start; i <= end; i++) {
            const text = getLineText(i)
            lines.push(text ?? '')
          }
          if (lines.length > 0) {
            event.preventDefault()
            navigator.clipboard.writeText(lines.join('\n')).catch(() => {
              // Fallback: ignore clipboard errors silently
            })
          }
        }
        return
      }

      // Arrow keys
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return
      const current = getSelectedLine(sessionId)
      if (current === null) return
      event.preventDefault()
      const next = event.key === 'ArrowUp' ? current.lineNumber - 1 : current.lineNumber + 1
      if (next < 0 || next >= totalLines) return

      suppressScrollRef.current = true
      const text = getLineText(next)
      setSelectedLine(sessionId, { lineNumber: next, text: text ?? '' })

      // Shift+Arrow: extend selection
      if (event.shiftKey) {
        const existingSelection = selectionStore.getSelection(sessionId)
        if (existingSelection) {
          // Keep anchor, move focus
          selectionStore.setSelection(sessionId, existingSelection.anchor, next)
        } else {
          // Start new selection: anchor from previous
          selectionStore.setSelection(sessionId, current.lineNumber, next)
        }
      } else {
        // Without Shift: clear multi-selection
        selectionStore.clearSelection(sessionId)
        selectionStore.setSelection(sessionId, next, next)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sessionId, totalLines, getSelectedLine, getLineText, setSelectedLine, selectionStore])

  return (
    <div
      ref={parentRef}
      className="log-virtual-list"
      tabIndex={0}
      onScroll={() => { void handleScroll() }}
    >
      <div
        style={{ height: virtualizer.getTotalSize(), position: 'relative' }}
      >
        {virtualItems.map(vItem => {
          const lineNumber = vItem.index
          const text = getLineText(lineNumber)
          const segments = text !== undefined ? highlightLine(text) : undefined
          const isSelected = selectedSet.has(lineNumber)

          return (
            <div
              key={vItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vItem.start}px)`,
              }}
            >
              <LogLine
                lineNumber={lineNumber}
                text={text}
                segments={segments}
                isSelected={isSelected}
                onClick={text !== undefined
                  ? (e: React.MouseEvent) => handleLineClick(lineNumber, text, e.shiftKey)
                  : undefined}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}