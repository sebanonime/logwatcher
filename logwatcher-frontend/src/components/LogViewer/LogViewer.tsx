import React from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { LogVirtualList } from './LogVirtualList'
import { LogStatusBar } from './LogStatusBar'
import type { HighlightingRule } from '../../types'
import { useTabStore } from '../../store/logStore'
import { usePreferencesStore } from '../../store/preferencesStore'

interface LogViewerProps {
  sessionId: string
  hub: HubConnection
  highlightingRules?: HighlightingRule[]
}

export function LogViewer({ sessionId, hub, highlightingRules = [] }: LogViewerProps) {
  const { tabs } = useTabStore()
  const defaultHighlights = usePreferencesStore(state => state.defaultHighlights)
  const tab = tabs.find(t => t.sessionId === sessionId)
  const effectiveRules = highlightingRules.length > 0 ? highlightingRules : defaultHighlights

  return (
    <div className="log-viewer-root">
      <div className="log-viewer-body">
        <LogVirtualList
          sessionId={sessionId}
          hub={hub}
          highlightingRules={effectiveRules}
          tailMode={tab?.tailMode ?? true}
        />
      </div>
      <LogStatusBar sessionId={sessionId} />
    </div>
  )
}
