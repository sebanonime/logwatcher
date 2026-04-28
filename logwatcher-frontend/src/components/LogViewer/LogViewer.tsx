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
  profileHighlightingRules?: HighlightingRule[]
}

export function LogViewer({ sessionId, hub, profileHighlightingRules = [] }: LogViewerProps) {
  const { tabs } = useTabStore()
  const defaultHighlights = usePreferencesStore(state => state.defaultHighlights)
  const tab = tabs.find(t => t.sessionId === sessionId)

  const isIndexing = !tab?.isIndexed && (tab?.indexTotalBytes ?? 0) > 0
  const indexProgress = isIndexing && tab?.indexTotalBytes
    ? Math.min(100, Math.round(((tab.indexedBytes ?? 0) / tab.indexTotalBytes) * 100))
    : null

  return (
    <div className="log-viewer-root">
      {indexProgress !== null && (
        <div className="index-progress-bar" style={{ width: `${indexProgress}%` }} />
      )}
      {!tab?.isIndexed && indexProgress === null && (
        <div className="index-progress-bar index-progress-bar--indeterminate" />
      )}
      <div className="log-viewer-body">
        <LogVirtualList
          sessionId={sessionId}
          hub={hub}
          highlightingRules={profileHighlightingRules}
          fallbackHighlightingRules={defaultHighlights}
          tailMode={tab?.tailMode ?? true}
        />
      </div>
      <LogStatusBar sessionId={sessionId} />
    </div>
  )
}
