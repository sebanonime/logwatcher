import React from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { LogVirtualList } from './LogVirtualList'
import { LogStatusBar } from './LogStatusBar'
import type { HighlightingRule } from '../../types'
import { useTabStore } from '../../store/logStore'

interface LogViewerProps {
  sessionId: string
  hub: HubConnection
  highlightingRules?: HighlightingRule[]
}

/**
 * Log viewer panel: virtual list + status bar.
 * The filter toolbar is now in MainToolbar (top of screen).
 * One instance per open tab.
 */
export function LogViewer({ sessionId, hub, highlightingRules = [] }: LogViewerProps) {
  const { tabs } = useTabStore()
  const tab = tabs.find(t => t.sessionId === sessionId)

  return (
    <div className="log-viewer-root">
      <div className="log-viewer-body">
        <LogVirtualList
          sessionId={sessionId}
          hub={hub}
          highlightingRules={highlightingRules}
          tailMode={tab?.tailMode ?? true}
        />
      </div>
      <LogStatusBar sessionId={sessionId} />
    </div>
  )
}
