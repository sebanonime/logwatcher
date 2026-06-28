// uploaded:LogViewer.tsx

import React from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { LogVirtualList } from './LogVirtualList'
import { LogStatusBar } from './LogStatusBar'
import type { HighlightingRule } from '../../types'
import { useLogStore, useTabStore } from '../../store/logStore'
import { usePreferencesStore } from '../../store/preferencesStore'

interface LogViewerProps {
  sessionId: string
  hub: HubConnection
  profileHighlightingRules?: HighlightingRule[]
}

export function LogViewer({ sessionId, hub, profileHighlightingRules = [] }: LogViewerProps) {
  const { tabs, updateTab } = useTabStore()
  const { clearBuffer } = useLogStore()
  const defaultHighlights = usePreferencesStore(state => state.defaultHighlights)
  const tab = tabs.find(t => t.sessionId === sessionId)

  const isIndexing = !tab?.isIndexed && (tab?.indexTotalBytes ?? 0) > 0
  const indexProgress = isIndexing && tab?.indexTotalBytes
    ? Math.min(100, Math.round(((tab?.indexedBytes ?? 0) / tab.indexTotalBytes) * 100))
    : null
  
  // FIX CRITIQUE : On sélectionne explicitement le booléen primitif pour forcer le re-render
  const isFilteringInProgress = useTabStore(state => state.filtersInProgress[sessionId])

  return (
    <div className="log-viewer-root">
      {indexProgress !== null && (
        <div className="index-progress-bar" style={{ width: `${indexProgress}%` }} />
      )}
      {!tab?.isIndexed && indexProgress === null && (
        <div className="index-progress-bar index-progress-bar--indeterminate" />
      )}

      {/* Affichage de l'indicateur visuel de filtrage découplé de l'objet tab */}
      {isFilteringInProgress && (
        <div className="filter-progress-bar">
          <div className="filter-progress-bar__fill" />
        </div>
      )}

      {tab?.isFiltered && (
        <div className="log-filter-banner">
          <span className="log-filter-banner__label">
            Filter: {tab.filterPattern ?? '(stored filter)'}
          </span>
          <button
            className="log-filter-banner__clear"
            onClick={async () => {
              clearBuffer(sessionId)
              updateTab(sessionId, {
                totalLines: tab.contextTotalLines ?? 0,
                isFiltered: false,
                filterPattern: undefined,
                filterIsRegex: undefined,
                filterCaseSensitive: undefined,
                activeStoredFilterName: undefined,
              })
              // Reset sécurisé de la progress bar via le store global
              useTabStore.getState().setFilterInProgress(sessionId, false)
              await hub.invoke('ClearFilter', sessionId)
              
              // Also clear the filter pattern in the toolbar for the active tab
              const mainToolbarFilterInput = document.querySelector('.toolbar-filter-input') as HTMLInputElement
              if (mainToolbarFilterInput) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
                nativeInputValueSetter?.call(mainToolbarFilterInput, '')
                mainToolbarFilterInput.dispatchEvent(new Event('input', { bubbles: true }))
              }
            }}
            title="Cancel filter"
          >
            Cancel filter
          </button>
        </div>
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