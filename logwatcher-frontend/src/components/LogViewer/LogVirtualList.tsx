import React, { useRef, useCallback, useEffect, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { HubConnection } from '@microsoft/signalr'
import { useVirtualLines } from '../../hooks/useVirtualLines'
import { useHighlighting } from '../../hooks/useHighlighting'
import { useLogStore, useTabStore } from '../../store/logStore'
import { useSelectionStore, orderedRange } from '../../store/selectionStore'
import { LogLine } from './LogLine'
import type { HighlightingRule } from '../../types'

const LINE_HEIGHT = 20  // px — must match LogLine height

/**
 * Browser engines cap element height at roughly 33 million pixels (Chrome/Edge)
 * or 17 million pixels (Firefox). For huge files we need to map the real scroll
 * position proportionally into the virtualizer's coordinate space.
 *
 * When the total virtual height exceeds BROWSER_CAP_PX we:
 *  1. Cap the inner container height at BROWSER_CAP_PX.
 *  2. Override observeElementOffset so the virtualizer receives a *virtual* offset
 *     proportional to the real scroll position across the full logical height.
 *  3. Override scrollToFn so programmatic scrolls are mapped back to the capped DOM.
 *  4. Scale each item's translateY by `domScale` when rendering.
 */
const BROWSER_CAP_PX = 15_000_000  // safe upper bound for all major browsers

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
  const { updateTab, activeSessionId } = useTabStore()
  const selectionStore = useSelectionStore()
  const activeSessionIdRef = useRef(activeSessionId)
  activeSessionIdRef.current = activeSessionId
  const selectedLine = getSelectedLine(sessionId)
  const lastScrollTopRef = useRef(0)
  const wasNearBottomRef = useRef(true)
  const previousSelectedLineRef = useRef<number | null>(null)
  const togglingTailRef = useRef(false)

  // Current virtual scroll offset (used for key-navigation viewport checks)
  const virtualOffsetRef = useRef(0)

  // Tick used to force a re-render when the parent container is resized/shown
  const [, setLayoutTick] = useState(0)

  // ── Proxy-scroll helpers for huge files ──────────────────────────────────
  // rawTotalHeight is the logical height (may exceed browser cap).
  const rawTotalHeight = totalLines * LINE_HEIGHT
  const needsProxy = rawTotalHeight > BROWSER_CAP_PX
  // domScale = DOM height / logical height  (1.0 when proxy not needed)
  const domScale = needsProxy ? BROWSER_CAP_PX / rawTotalHeight : 1
  const domHeight = needsProxy ? BROWSER_CAP_PX : rawTotalHeight

  // Virtualizer ref so the ResizeObserver can call measure() without stale closure
  const virtualizerRef = useRef<{ measure: () => void } | null>(null)

  // Observe container size; any resize/visibility change triggers a re-measure
  useEffect(() => {
    const el = parentRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      // Calling measure() re-calculates item positions with the new container size.
      // This fixes lines disappearing after a tab position/layout change.
      virtualizerRef.current?.measure()
      setLayoutTick(t => t + 1)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const virtualizer = useVirtualizer({
    count: totalLines,
    getScrollElement: () => parentRef.current,
    estimateSize: () => LINE_HEIGHT,
    overscan: 30,

    // ── Override 1: map real DOM scroll → virtual offset ──────────────────
    // observeElementOffset receives the Virtualizer instance; DOM element is at .scrollElement.
    observeElementOffset: (instance, cb) => {
      const el = instance.scrollElement
      if (!el) return
      const handler = () => {
        const realMax = Math.max(1, el.scrollHeight - el.clientHeight)
        const virtualMax = Math.max(1, rawTotalHeight - el.clientHeight)
        const virtualOffset = (el.scrollTop / realMax) * virtualMax
        virtualOffsetRef.current = virtualOffset
        cb(virtualOffset, false)
      }
      el.addEventListener('scroll', handler, { passive: true })
      // Also call immediately to initialise
      handler()
      return () => el.removeEventListener('scroll', handler)
    },

    // ── Override 2: map virtual offset → real DOM scroll ─────────────────
    scrollToFn: (offset, _options, _instance) => {
      const el = parentRef.current
      if (!el) return
      const realMax = Math.max(1, el.scrollHeight - el.clientHeight)
      const virtualMax = Math.max(1, rawTotalHeight - el.clientHeight)
      el.scrollTop = (offset / virtualMax) * realMax
    },
  })

  // Keep ref in sync
  virtualizerRef.current = virtualizer

  const virtualItems = virtualizer.getVirtualItems()

  // Fetch lines for the visible + overscan range
  const fetchVisible = useCallback(() => {
    if (virtualItems.length === 0) return
    const startLine = virtualItems[0].index
    const lastItem = virtualItems[virtualItems.length - 1]
    const endLine = lastItem.index
    const lineCount = endLine - startLine + 1
    ensureRange(startLine, lineCount)
  }, [virtualItems, ensureRange])

  useEffect(() => {
    fetchVisible()
  }, [fetchVisible])

  // Also fetch on totalLines change (covers initial load of large files)
  useEffect(() => {
    if (totalLines > 0) {
      fetchVisible()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalLines])

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

  // Scroll to keep the selected line visible
  useEffect(() => {
    const selected = selectedLine?.lineNumber
    if (selected === undefined || selected < 0 || selected >= totalLines) return

    const hasChanged = previousSelectedLineRef.current !== selected
    previousSelectedLineRef.current = selected
    if (!hasChanged) return

    if (virtualItems.length === 0) return

    const firstVisibleLine = virtualItems[0].index
    const lastVisibleLine = virtualItems[virtualItems.length - 1].index

    if (selected < firstVisibleLine || selected > lastVisibleLine) {
      virtualizer.scrollToIndex(selected, { align: 'auto' })
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
        const existingSelection = selectionStore.getSelection(sessionId)
        const anchor = existingSelection?.anchor ?? current.lineNumber
        selectionStore.setSelection(sessionId, anchor, lineNumber)
        setSelectedLine(sessionId, { lineNumber, text })
        return
      }
    }
    // Simple click: reset multi-selection and set anchor
    selectionStore.clearSelection(sessionId)
    selectionStore.setSelection(sessionId, lineNumber, lineNumber)
    setSelectedLine(sessionId, { lineNumber, text })
    // Transfer focus to the virtual list container so keyboard events work
    parentRef.current?.focus()
  }, [sessionId, getSelectedLine, setSelectedLine, selectionStore])

  /**
   * Build selection state for rendering: a Set of line numbers in range.
   */
  const selectionRange = selectionStore.getSelection(sessionId)
  const selectedSet = (() => {
    if (!selectionRange) {
      const sl = selectedLine?.lineNumber
      return sl !== undefined ? new Set([sl]) : new Set<number>()
    }
    const { start, end } = orderedRange(selectionRange)
    const set = new Set<number>()
    for (let i = start; i <= end; i++) set.add(i)
    return set
  })()

  // Keyboard handler: Arrow Up/Down (with optional Shift), Ctrl+C
  // Only active when this tab is the active session to avoid multi-tab conflicts.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard events for the currently active tab
      if (activeSessionIdRef.current !== sessionId) return

      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable) return

      // Ctrl+C copy
      if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
        if (window.getSelection() && !window.getSelection()!.isCollapsed) return
        const range = selectionStore.getSelection(sessionId)
        if (range) {
          const { start, end } = orderedRange(range)
          const lines: string[] = []
          for (let i = start; i <= end; i++) lines.push(getLineText(i) ?? '')
          if (lines.length > 0) {
            event.preventDefault()
            navigator.clipboard.writeText(lines.join('\n')).catch(() => {})
          }
        }
        return
      }

      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return

      const current = getSelectedLine(sessionId)
      if (current === null) return
      event.preventDefault()

      const isUp = event.key === 'ArrowUp'
      let next = isUp ? current.lineNumber - 1 : current.lineNumber + 1

      // Clamp: stay on first / last line
      if (next < 0) next = 0
      if (totalLines > 0 && next >= totalLines) next = totalLines - 1

      // Already at the boundary in that direction — nothing to do (#2 fix: stays on last line)
      if (next === current.lineNumber) return

      const text = getLineText(next) ?? ''
      setSelectedLine(sessionId, { lineNumber: next, text })

      if (event.shiftKey) {
        const existingSelection = selectionStore.getSelection(sessionId)
        if (existingSelection) {
          selectionStore.setSelection(sessionId, existingSelection.anchor, next)
        } else {
          selectionStore.setSelection(sessionId, current.lineNumber, next)
        }
      } else {
        selectionStore.clearSelection(sessionId)
        selectionStore.setSelection(sessionId, next, next)
      }

      // Scroll the viewport so the new selected line is always visible.
      // Fix #3: use the VIRTUAL offset (not virtualItems[0].index which includes overscan)
      // to determine the true first visible line.
      const el = parentRef.current
      if (el && virtualItems.length > 0) {
        // True first visible line based on current virtual scroll offset
        const firstTrueVisible = Math.floor(virtualOffsetRef.current / LINE_HEIGHT)
        const clientLinesVisible = Math.floor(el.clientHeight / LINE_HEIGHT)
        const lastTrueVisible = firstTrueVisible + clientLinesVisible - 1

        if (isUp && next < firstTrueVisible) {
          // Key up on the first visible line: scroll to reveal previous line (#3 fix)
          virtualizer.scrollToIndex(next, { align: 'start' })
        } else if (!isUp && next > lastTrueVisible) {
          virtualizer.scrollToIndex(next, { align: 'end' })
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sessionId, totalLines, getSelectedLine, getLineText, setSelectedLine, selectionStore, virtualItems, virtualizer])

  return (
    <div
      ref={parentRef}
      className="log-virtual-list"
      tabIndex={0}
      onScroll={() => { void handleScroll() }}
      // Prevent browser text-selection when shift-clicking rows
      onMouseDown={e => { if (e.shiftKey) e.preventDefault() }}
    >
      {/*
        Inner container height is capped at BROWSER_CAP_PX when the logical height
        exceeds browser limits. Item positions are scaled by domScale so they stay
        within the capped height.  The virtualizer still operates in logical space;
        only the DOM presentation is scaled.
      */}
      <div
        style={{ height: domHeight, position: 'relative' }}
      >
        {virtualItems.map(vItem => {
          const lineNumber = vItem.index
          if (lineNumber < 0 || lineNumber >= totalLines) return null

          const text = getLineText(lineNumber)
          const segments = text !== undefined ? highlightLine(text) : undefined
          const isSelected = selectedSet.has(lineNumber)

          // Scale the item's top offset into the capped DOM coordinate space
          const scaledTop = vItem.start * domScale

          return (
            <LogLine
              key={vItem.key}
              lineNumber={lineNumber}
              text={text}
              segments={segments}
              isSelected={isSelected}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${scaledTop}px)`,
                height: LINE_HEIGHT,
              }}
              onClick={(e: React.MouseEvent) => handleLineClick(lineNumber, text ?? '', e.shiftKey)}
            />
          )
        })}
      </div>
    </div>
  )
}
