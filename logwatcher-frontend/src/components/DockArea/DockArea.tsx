import React, { useRef, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '../../store/logStore'
import { LogViewer } from '../LogViewer/LogViewer'
import { usePreferencesStore } from '../../store/preferencesStore'

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
  const profiles = usePreferencesStore(state => state.profiles)
  const hubRef = useRef(hub)
  hubRef.current = hub
  const [menu, setMenu] = useState<{ x: number; y: number; sessionId: string } | null>(null)

  const handleClose = useCallback((e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    hubRef.current.invoke('CloseLog', sessionId).catch(() => {})
    removeTab(sessionId)
  }, [removeTab])

  const handleCloseMany = useCallback((sessionIds: string[]) => {
    for (const sessionId of sessionIds) {
      hubRef.current.invoke('CloseLog', sessionId).catch(() => {})
      removeTab(sessionId)
    }
  }, [removeTab])

  useEffect(() => {
    if (!menu) return
    const onClose = () => setMenu(null)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(null)
    }

    window.addEventListener('mousedown', onClose)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onClose)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menu])

  if (tabs.length === 0) {
    return (
      <div className="dock-area">
        <div className="tab-strip" style={{ scrollbarWidth: 'none' }} />
        <div className="empty-state viewer-empty-state">
          Double-click a file in the explorer to open a log workspace.
        </div>
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
              onContextMenu={event => {
                event.preventDefault()
                setMenu({ x: event.clientX, y: event.clientY, sessionId: tab.sessionId })
              }}
              className={`tab-pill ${isActive ? 'tab-pill--active' : ''}`}
            >
              <span className="tab-pill__title" title={tab.displayName}>
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

      {menu && createPortal(
        <div
          className="tab-context-menu"
          style={{
            left: `${Math.max(8, Math.min(menu.x + 8, window.innerWidth - 176))}px`,
            top: `${Math.max(8, Math.min(menu.y + 8, window.innerHeight - 112))}px`,
          }}
          onMouseDown={event => event.stopPropagation()}
        >
          <button
            className="tab-context-menu__item"
            onClick={() => {
              handleCloseMany([menu.sessionId])
              setMenu(null)
            }}
          >
            Close tab
          </button>
          <button
            className="tab-context-menu__item"
            onClick={() => {
              const others = tabs.filter(t => t.sessionId !== menu.sessionId).map(t => t.sessionId)
              handleCloseMany(others)
              setActive(menu.sessionId)
              setMenu(null)
            }}
          >
            Close all other tabs
          </button>
          <button
            className="tab-context-menu__item"
            onClick={() => {
              handleCloseMany(tabs.map(t => t.sessionId))
              setMenu(null)
            }}
          >
            Close all tabs
          </button>
        </div>,
        document.body
      )}

      <div className="dock-content">
        {tabs.map(tab => {
          const activeProfile = profiles.find(profile => profile.name === tab.activeProfileName)
          const highlightingRules = activeProfile?.dicoHighLighting ?? []
          return (
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
              profileHighlightingRules={highlightingRules}
            />
          </div>
          )
        })}
      </div>
    </div>
  )
}
