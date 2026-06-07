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
 *
 * Features:
 * - Drag & drop tab reordering
 * - Double-click to rename tab
 * - Environment color indicator on tabs and viewers
 */
export function DockArea({ hub }: DockAreaProps) {
  const { tabs, activeSessionId, setActive, removeTab, reorderTab, renameTab } = useTabStore()
  const profiles = usePreferencesStore(state => state.profiles)
  const hubRef = useRef(hub)
  hubRef.current = hub
  const [menu, setMenu] = useState<{ x: number; y: number; sessionId: string } | null>(null)
  const [renamingSessionId, setRenamingSessionId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  // Drag & drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

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

  // Focus rename input when it appears
  useEffect(() => {
    if (renamingSessionId && renameInputRef.current) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [renamingSessionId])

  const handleStartRename = useCallback((sessionId: string, currentName: string) => {
    setRenamingSessionId(sessionId)
    setRenameValue(currentName)
  }, [])

  const handleFinishRename = useCallback(() => {
    if (renamingSessionId && renameValue.trim()) {
      renameTab(renamingSessionId, renameValue.trim())
    }
    setRenamingSessionId(null)
    setRenameValue('')
  }, [renamingSessionId, renameValue, renameTab])

  const handleRenameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishRename()
    } else if (e.key === 'Escape') {
      setRenamingSessionId(null)
      setRenameValue('')
    }
    e.stopPropagation()
  }, [handleFinishRename])

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== toIndex) {
      reorderTab(dragIndex, toIndex)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }, [dragIndex, reorderTab])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

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
        {tabs.map((tab, index) => {
          const isActive = activeSessionId === tab.sessionId
          const isDragging = dragIndex === index
          const isDragOver = dragOverIndex === index && !isDragging

          return (
            <div
              key={tab.sessionId}
              draggable
              onClick={() => setActive(tab.sessionId)}
              onDoubleClick={() => handleStartRename(tab.sessionId, tab.displayName)}
              onContextMenu={event => {
                event.preventDefault()
                setMenu({ x: event.clientX, y: event.clientY, sessionId: tab.sessionId })
              }}
              onDragStart={e => handleDragStart(e, index)}
              onDragOver={e => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`tab-pill ${isActive ? 'tab-pill--active' : ''} ${isDragging ? 'tab-pill--dragging' : ''} ${isDragOver ? 'tab-pill--drag-over' : ''}`}
              style={tab.environmentColor ? {
                borderLeftColor: tab.environmentColor,
                borderLeftWidth: '3px',
              } : undefined}
            >
              {renamingSessionId === tab.sessionId ? (
                <input
                  ref={renameInputRef}
                  className="tab-pill__rename-input"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onBlur={handleFinishRename}
                  onKeyDown={handleRenameKeyDown}
                  onClick={e => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <>
                  {tab.environmentColor && (
                    <span
                      className="tab-pill__color-dot"
                      style={{ backgroundColor: tab.environmentColor }}
                      title="Environment color indicator"
                    />
                  )}
                  <span className="tab-pill__title" title={tab.displayName}>
                    {tab.displayName}
                  </span>
                  {!tab.isIndexed && (
                    <span className="tab-pill__dot">●</span>
                  )}
                </>
              )}
              {renamingSessionId !== tab.sessionId && (
                <button
                  onClick={e => handleClose(e, tab.sessionId)}
                  className="tab-pill__close"
                  title="Close"
                >
                  ×
                </button>
              )}
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
              const tab = tabs.find(t => t.sessionId === menu.sessionId)
              if (tab) handleStartRename(tab.sessionId, tab.displayName)
              setMenu(null)
            }}
          >
            Rename tab
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
          const isActive = activeSessionId === tab.sessionId
          return (
          <div
            key={tab.sessionId}
            className="dock-tab-view"
            style={{
              display: isActive ? 'flex' : 'none',
              ...(tab.environmentColor && isActive ? {
                border: `2px solid ${tab.environmentColor}`,
                borderRadius: '6px',
                overflow: 'hidden',
              } : {}),
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