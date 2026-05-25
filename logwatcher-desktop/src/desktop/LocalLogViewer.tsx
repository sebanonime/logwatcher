import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { LogLine } from '@shared/components/LogViewer/LogLine'
import { useHighlighting } from '@shared/hooks/useHighlighting'
import { usePreferencesStore } from '@shared/store/preferencesStore'
import { useUiStore } from '@shared/store/uiStore'
import { useDesktopStore } from '../store/desktopStore'
import { useLocalVirtualLines } from './useLocalVirtualLines'

interface LocalLogViewerProps {
  tabId: string
}

const LINE_HEIGHT = 20

/**
 * A log viewer backed by local file IPC instead of SignalR.
 * Reuses LogLine, useHighlighting, and the virtualizer for maximum code sharing.
 */
export function LocalLogViewer({ tabId }: LocalLogViewerProps) {
  const { localTabs, updateLocalTab } = useDesktopStore()
  const tab = localTabs.find((t) => t.id === tabId)
  const { defaultHighlights, profiles } = usePreferencesStore()
  const { fontFamily, fontSize } = useUiStore()

  const { ensureRange, getLineText, totalLines } = useLocalVirtualLines(tabId)

  const scrollRef = useRef<HTMLDivElement>(null)

  // Determine active profile highlights
  const profileHighlights = useMemo(() => {
    const profileName = tab?.filterPattern ? undefined : undefined // no profile for local initially
    return profiles.find((p) => p.name === profileName)?.dicoHighLighting ?? []
  }, [profiles, tab])

  const { highlightLine } = useHighlighting(profileHighlights, defaultHighlights)

  const rowCount = totalLines > 0 ? totalLines : 0

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => LINE_HEIGHT,
    overscan: 40,
  })

  const items = virtualizer.getVirtualItems()

  // Ensure lines are loaded for visible range
  useEffect(() => {
    if (items.length === 0) return
    const start = items[0].index
    const count = items[items.length - 1].index - start + 1
    ensureRange(start, count)
  }, [items, ensureRange])

  // Auto-scroll to bottom when in tail mode
  useEffect(() => {
    if (tab?.tailMode && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [tab?.tailMode, totalLines])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const atBottom = scrollHeight - scrollTop - clientHeight < LINE_HEIGHT * 2
    if (tab && atBottom !== tab.tailMode) {
      updateLocalTab(tabId, { tailMode: atBottom })
    }
  }, [tab, tabId, updateLocalTab])

  if (!tab) return null

  return (
    <div
      className="log-viewer"
      style={{
        fontFamily,
        fontSize,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Status bar */}
      <div
        className="log-status-bar"
        style={{ flexShrink: 0 }}
      >
        <span style={{ color: 'var(--text-3)', fontSize: 11 }}>
          {tab.displayName}
        </span>
        <span style={{ marginLeft: 'auto', color: 'var(--text-3)', fontSize: 11 }}>
          {totalLines.toLocaleString()} lines
          {tab.info.sizeBytes > 0 &&
            ` · ${(tab.info.sizeBytes / 1024).toFixed(1)} KB`}
          {tab.tailMode && (
            <span style={{ color: 'var(--accent)', marginLeft: 8 }}>TAIL</span>
          )}
        </span>
      </div>

      {/* Virtual scroll area */}
      <div
        ref={scrollRef}
        className="log-scroll-area"
        style={{ flex: 1, overflow: 'auto' }}
        onScroll={handleScroll}
      >
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {items.map((item) => {
            const text = getLineText(item.index)
            const segments = text !== undefined ? highlightLine(text) : undefined
            return (
              <div
                key={item.key}
                style={{
                  position: 'absolute',
                  top: item.start,
                  left: 0,
                  right: 0,
                  height: LINE_HEIGHT,
                }}
              >
                <LogLine
                  lineNumber={item.index}
                  text={text}
                  segments={segments}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
