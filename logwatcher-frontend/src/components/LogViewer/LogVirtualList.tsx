import React, { useRef, useCallback, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { HubConnection } from '@microsoft/signalr'
import { useVirtualLines } from '../../hooks/useVirtualLines'
import { useHighlighting } from '../../hooks/useHighlighting'
import { useLogStore, useTabStore } from '../../store/logStore'
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
 */
export function LogVirtualList({ sessionId, hub, highlightingRules, fallbackHighlightingRules = [], tailMode }: LogVirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const { totalLines, ensureRange, getLineText } = useVirtualLines(sessionId, hub)
  const { highlightLine } = useHighlighting(highlightingRules, fallbackHighlightingRules)
  const { setSelectedLine, getSelectedLine } = useLogStore()
  const { updateTab } = useTabStore()
  const selectedLine = getSelectedLine(sessionId)
  const lastScrollTopRef = useRef(0)
  const wasNearBottomRef = useRef(true)
  const disablingTailRef = useRef(false)
  const previousSelectedLineRef = useRef<number | null>(null)

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
    if (tailMode && scrollingUp && wasNearBottomRef.current && !nearBottom && !disablingTailRef.current) {
      disablingTailRef.current = true
      updateTab(sessionId, { tailMode: false })
      try {
        await hub.invoke('SetTail', sessionId, false)
      } catch {
        // Keep local tail state off; transport errors are surfaced elsewhere.
      } finally {
        disablingTailRef.current = false
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

    const firstVisible = virtualItems[0]?.index ?? 0
    const lastVisible = virtualItems[virtualItems.length - 1]?.index ?? -1
    if (selected < firstVisible || selected > lastVisible) {
      virtualizer.scrollToIndex(selected, { align: 'center' })
    }
  }, [selectedLine?.lineNumber, totalLines, virtualItems, virtualizer])

  return (
    <div
      ref={parentRef}
      className="log-virtual-list"
      onScroll={() => { void handleScroll() }}
    >
      <div
        style={{ height: virtualizer.getTotalSize(), position: 'relative' }}
      >
        {virtualItems.map(vItem => {
          const lineNumber = vItem.index
          const text = getLineText(lineNumber)
          const segments = text !== undefined ? highlightLine(text) : undefined
          const isSelected = selectedLine?.lineNumber === lineNumber

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
                  ? () => setSelectedLine(sessionId, { lineNumber, text })
                  : undefined}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
