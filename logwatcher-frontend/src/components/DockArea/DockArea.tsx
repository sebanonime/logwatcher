import React, { useRef, useCallback } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '../../store/logStore'
import { LogViewer } from '../LogViewer/LogViewer'
import { usePreferencesStore } from '../../store/preferencesStore'

interface DockAreaProps {
  hub: HubConnection
  isBrowserVisible: boolean
  onToggleBrowser: () => void
}

/**
 * Tab area for open log files.
 * Shows a tab bar at top + the active LogViewer below.
 * All tabs are kept mounted (display:none when inactive) so their
 * virtual scroll state and line buffers are preserved on tab switch.
 */
export function DockArea({ hub, isBrowserVisible, onToggleBrowser }: DockAreaProps) {
  const { tabs, activeSessionId, setActive, removeTab, updateTab } = useTabStore()
  const profiles = usePreferencesStore(state => state.profiles)
  const hubRef = useRef(hub)
  hubRef.current = hub

  const handleClose = useCallback((e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    hubRef.current.invoke('CloseLog', sessionId).catch(() => {})
    removeTab(sessionId)
  }, [removeTab])

  if (tabs.length === 0) {
    return (
      <div className="dock-area">
        <div className="tab-strip" style={{ scrollbarWidth: 'none' }}>
          <button
            className="control-button control-button--ghost tab-strip__toggle"
            onClick={onToggleBrowser}
            title={isBrowserVisible ? 'Hide explorer' : 'Show explorer'}
          >
            {isBrowserVisible ? '▤' : '▥'}
          </button>
        </div>
        <div className="empty-state viewer-empty-state">
          Double-click a file in the explorer to open a log workspace.
        </div>
      </div>
    )
  }

  return (
    <div className="dock-area">
      <div className="tab-strip" style={{ scrollbarWidth: 'none' }}>
        <button
          className="control-button control-button--ghost tab-strip__toggle"
          onClick={onToggleBrowser}
          title={isBrowserVisible ? 'Hide explorer' : 'Show explorer'}
        >
          {isBrowserVisible ? '▤' : '▥'}
        </button>
        {tabs.map(tab => {
          const isActive = activeSessionId === tab.sessionId
          const profileOptions = profiles
          const selectedProfileName = tab.activeProfileName ?? ''
          return (
            <div
              key={tab.sessionId}
              onClick={() => setActive(tab.sessionId)}
              className={`tab-pill ${isActive ? 'tab-pill--active' : ''}`}
            >
              <span className="tab-pill__title" title={tab.displayName}>
                {tab.displayName}
              </span>
              {!tab.isIndexed && (
                <span className="tab-pill__dot">●</span>
              )}
              {isActive && (
                <select
                  className="control-input tab-pill__profile"
                  value={selectedProfileName}
                  onClick={event => event.stopPropagation()}
                  onChange={async event => {
                    const nextName = event.target.value || undefined
                    updateTab(tab.sessionId, {
                      activeProfileName: nextName,
                      activeStoredFilterName: undefined,
                    })
                    try {
                      await hubRef.current.invoke('SetProfile', tab.sessionId, nextName ?? '')
                    } catch {
                      // Ignore profile switch transport errors in UI.
                    }
                  }}
                  title="Active profile"
                >
                  <option value="">Default</option>
                  {profileOptions.map(profile => (
                    <option key={profile.name} value={profile.name}>{profile.name}</option>
                  ))}
                </select>
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
