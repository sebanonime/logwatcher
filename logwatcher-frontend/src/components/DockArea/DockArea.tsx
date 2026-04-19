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
      <div className="flex items-center justify-center h-full text-gray-600 text-sm select-none">
        Double-click a file in the browser to open a log
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center bg-gray-800 border-b border-gray-700 overflow-x-auto flex-shrink-0"
           style={{ scrollbarWidth: 'none' }}>
        {tabs.map(tab => {
          const isActive = activeSessionId === tab.sessionId
          return (
            <div
              key={tab.sessionId}
              onClick={() => setActive(tab.sessionId)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono cursor-pointer
                          whitespace-nowrap border-r border-gray-700 flex-shrink-0 select-none
                          ${isActive
                            ? 'bg-gray-950 text-white border-t-2 border-t-blue-500'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
            >
              <span className="max-w-[180px] truncate" title={`[${tab.serverName}] ${tab.filePath}`}>
                [{tab.serverName}] {tab.displayName}
              </span>
              {!tab.isIndexed && (
                <span className="text-yellow-500 animate-pulse ml-1">●</span>
              )}
              <button
                onClick={e => handleClose(e, tab.sessionId)}
                className="ml-1 text-gray-500 hover:text-white w-4 h-4 flex items-center
                           justify-center rounded hover:bg-gray-600 flex-shrink-0"
                title="Close"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>

      {/* Log viewers — all mounted, only active one visible */}
      <div className="flex-1 min-h-0 relative">
        {tabs.map(tab => (
          <div
            key={tab.sessionId}
            style={{
              position: 'absolute',
              inset: 0,
              display: activeSessionId === tab.sessionId ? 'flex' : 'none',
              flexDirection: 'column',
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
