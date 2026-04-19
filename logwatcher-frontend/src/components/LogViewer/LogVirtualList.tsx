import React, { useRef, useCallback, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { HubConnection } from '@microsoft/signalr'
import { useVirtualLines } from '../../hooks/useVirtualLines'
import { useHighlighting } from '../../hooks/useHighlighting'
import { useLogStore } from '../../store/logStore'
import { LogLine } from './LogLine'
import type { HighlightingRule } from '../../types'

const LINE_HEIGHT = 20  // px — must match LogLine height

interface LogVirtualListProps {
  sessionId: string
  hub: HubConnection
  highlightingRules: HighlightingRule[]
  tailMode: boolean
}

/**
 * The core virtual list component.
 * Uses TanStack Virtual to render only ~20-50 rows at a time regardless of file size.
 * Fetches missing line chunks from the server as the user scrolls.
 */
export function LogVirtualList({ sessionId, hub, highlightingRules, tailMode }: LogVirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const { totalLines, ensureRange, getLineText } = useVirtualLines(sessionId, hub)
  const { highlightLine } = useHighlighting(highlightingRules)
  const { setSelectedLine, getSelectedLine } = useLogStore()
  const selectedLine = getSelectedLine(sessionId)

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
    }
  }, [tailMode, totalLines, virtualizer])

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto bg-gray-950 select-text"
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
