import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '@shared/store/logStore'
import { LogViewer } from '@shared/components/LogViewer/LogViewer'
import { useDesktopStore } from '../store/desktopStore'
import { LocalLogViewer } from './LocalLogViewer'

interface DesktopDockAreaProps {
  hub: HubConnection
}

/**
 * Combined dock area that shows both remote tabs (via SignalR) and
 * local file tabs (via IPC) in a single unified tab strip.
 */
export function DesktopDockArea({ hub }: DesktopDockAreaProps) {
  const { tabs: remoteTabs, activeSessionId, setActive: setActiveRemote, removeTab } = useTabStore()
  const {
    localTabs,
    activeLocalTabId,
    setActiveLocalTab,
    closeLocalTab,
  } = useDesktopStore()

  // Unified "active" — either a remote sessionId or a local tabId
  const [activeKind, setActiveKind] = useState<'remote' | 'local'>('remote')

  const hubRef = useRef(hub)
  hubRef.current = hub

  const [menu, setMenu] = useState<{
    x: number
    y: number
    kind: 'remote' | 'local'
    id: string
  } | null>(null)

  // Determine the overall active tab
  const activeRemote = remoteTabs.find((t) => t.sessionId === activeSessionId)
  const activeLocal = localTabs.find((t) => t.id === activeLocalTabId)

  const hasAnyTab = remoteTabs.length > 0 || localTabs.length > 0

  // When a new local tab opens, switch to it
  useEffect(() => {
    if (activeLocalTabId) setActiveKind('local')
  }, [activeLocalTabId])

  const handleCloseRemote = useCallback(
    (e: React.MouseEvent, sessionId: string) => {
      e.stopPropagation()
      hubRef.current.invoke('CloseLog', sessionId).catch(() => {})
      removeTab(sessionId)
    },
    [removeTab]
  )

  const handleCloseLocal = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      window.electronAPI.unwatchLocalFile(id).catch(() => {})
      closeLocalTab(id)
    },
    [closeLocalTab]
  )

  useEffect(() => {
    if (!menu) return
    const onClose = () => setMenu(null)
    window.addEventListener('mousedown', onClose)
    return () => window.removeEventListener('mousedown', onClose)
  }, [menu])

  if (!hasAnyTab) {
    return (
      <div className="dock-area">
        <div className="tab-strip" style={{ scrollbarWidth: 'none' }} />
        <div className="empty-state viewer-empty-state">
          Double-click a remote file in the browser, or{' '}
          <strong>drop a local log file</strong> here to open it.
        </div>
      </div>
    )
  }

  const isLocalActive = activeKind === 'local' && !!activeLocal
  const activeViewer =
    isLocalActive ? activeLocal : activeRemote ?? remoteTabs[0]

  return (
    <div className="dock-area">
      {/* ── Tab strip ── */}
      <div className="tab-strip" style={{ scrollbarWidth: 'none' }}>
        {/* Remote tabs */}
        {remoteTabs.map((tab) => {
          const isActive = activeKind === 'remote' && activeSessionId === tab.sessionId
          return (
            <div
              key={tab.sessionId}
              onClick={() => {
                setActiveRemote(tab.sessionId)
                setActiveKind('remote')
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                setMenu({ x: e.clientX, y: e.clientY, kind: 'remote', id: tab.sessionId })
              }}
              className={`tab-pill ${isActive ? 'tab-pill--active' : ''}`}
            >
              <span className="tab-pill__title" title={tab.displayName}>
                {tab.newLinesCount > 0 && (
                  <span className="tab-pill__badge">{tab.newLinesCount}</span>
                )}
                {tab.displayName}
              </span>
              <button
                className="tab-pill__close"
                onClick={(e) => handleCloseRemote(e, tab.sessionId)}
                aria-label={`Close ${tab.displayName}`}
              >
                ×
              </button>
            </div>
          )
        })}

        {/* Separator between remote and local tabs */}
        {remoteTabs.length > 0 && localTabs.length > 0 && (
          <div
            style={{
              width: 1,
              background: 'var(--border-strong)',
              margin: '6px 4px',
              alignSelf: 'stretch',
            }}
          />
        )}

        {/* Local tabs */}
        {localTabs.map((tab) => {
          const isActive = activeKind === 'local' && activeLocalTabId === tab.id
          return (
            <div
              key={tab.id}
              onClick={() => {
                setActiveLocalTab(tab.id)
                setActiveKind('local')
              }}
              className={`tab-pill tab-pill--local ${isActive ? 'tab-pill--active' : ''}`}
              title={tab.filePath}
            >
              <span className="tab-pill__icon" aria-hidden>📄</span>
              <span className="tab-pill__title">{tab.displayName}</span>
              <button
                className="tab-pill__close"
                onClick={(e) => handleCloseLocal(e, tab.id)}
                aria-label={`Close ${tab.displayName}`}
              >
                ×
              </button>
            </div>
          )
        })}
      </div>

      {/* ── Viewer area ── */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* Remote viewers — keep mounted for state preservation */}
        {remoteTabs.map((tab) => (
          <div
            key={tab.sessionId}
            style={{
              display:
                activeKind === 'remote' && activeSessionId === tab.sessionId
                  ? 'flex'
                  : 'none',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <LogViewer sessionId={tab.sessionId} hub={hub} />
          </div>
        ))}

        {/* Local viewers */}
        {localTabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              display:
                activeKind === 'local' && activeLocalTabId === tab.id
                  ? 'flex'
                  : 'none',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <LocalLogViewer tabId={tab.id} />
          </div>
        ))}
      </div>

      {/* Context menu */}
      {menu &&
        createPortal(
          <div
            className="tab-context-menu"
            style={{ top: menu.y, left: menu.x }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="tab-context-menu__item"
              onClick={() => {
                if (menu.kind === 'remote') {
                  hubRef.current.invoke('CloseLog', menu.id).catch(() => {})
                  removeTab(menu.id)
                } else {
                  window.electronAPI.unwatchLocalFile(menu.id).catch(() => {})
                  closeLocalTab(menu.id)
                }
                setMenu(null)
              }}
            >
              Close tab
            </button>
            {menu.kind === 'remote' && (
              <button
                className="tab-context-menu__item"
                onClick={() => {
                  const others = remoteTabs.filter((t) => t.sessionId !== menu.id)
                  others.forEach((t) => {
                    hubRef.current.invoke('CloseLog', t.sessionId).catch(() => {})
                    removeTab(t.sessionId)
                  })
                  setMenu(null)
                }}
              >
                Close other remote tabs
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
