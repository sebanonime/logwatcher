import React, { useRef, useCallback } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '../../store/logStore'
import { LogViewer } from '../LogViewer/LogViewer'

interface DockAreaProps {
  hub: HubConnection
}

/**
 * Tab area for open log files.
 * Shows a tab bar at top + the active LogViewer below.
 * All tabs are kept mounted (display:none when inactive) so their
 * virtual scroll state and line buffers are preserved on tab switch.
 */
export function DockArea({ hub }: DockAreaProps) {
  const { tabs, activeSessionId, setActive, removeTab } = useTabStore()
  const hubRef = useRef(hub)
  hubRef.current = hub

  const handleClose = useCallback((e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    hubRef.current.invoke('CloseLog', sessionId).catch(() => {})
    removeTab(sessionId)
  }, [removeTab])

  if (tabs.length === 0) {
    return (
      <div className="empty-state viewer-empty-state">
        Double-click a file in the explorer to open a log workspace.
      </div>
    )
  }

  return (
    <div className="dock-area">
      <div className="tab-strip" style={{ scrollbarWidth: 'none' }}>
        {tabs.map(tab => {
          const isActive = activeSessionId === tab.sessionId
          return (
            <div
              key={tab.sessionId}
              onClick={() => setActive(tab.sessionId)}
              className={`tab-pill ${isActive ? 'tab-pill--active' : ''}`}
            >
              <span className="tab-pill__meta">{tab.serverName}</span>
              <span className="tab-pill__title" title={`[${tab.serverName}] ${tab.filePath}`}>
                {tab.displayName}
              </span>
              {!tab.isIndexed && (
                <span className="tab-pill__dot">●</span>
              )}
              <button
                onClick={e => handleClose(e, tab.sessionId)}
                className="tab-pill__close"
                title="Close"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>

      <div className="dock-content">
        {tabs.map(tab => (
          <div
            key={tab.sessionId}
            className="dock-tab-view"
            style={{
              display: activeSessionId === tab.sessionId ? 'flex' : 'none',
            }}
          >
            <LogViewer
              sessionId={tab.sessionId}
              hub={hubRef.current}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
