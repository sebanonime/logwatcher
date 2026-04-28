import React, { useState, useCallback, useEffect } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '../../store/logStore'
import { usePerimeterStore } from '../../store/perimeterStore'
import { useFilterHistory } from '../../hooks/useFilterHistory'
import type { FilterOptionsDto } from '../../types'
import { useUiStore } from '../../store/uiStore'

interface MainToolbarProps {
  hub: HubConnection
  onSwitchPerimeter: () => void
  onOpenPreferences: () => void
  onLogout: () => void
  onFilterApplied?: () => void
  pendingPattern?: string | null
  onPendingPatternConsumed?: () => void
}

/**
 * Top toolbar: perimeter selector + filter controls for the active log tab + tail toggle.
 */
export function MainToolbar({ hub, onSwitchPerimeter, onOpenPreferences, onLogout, onFilterApplied, pendingPattern, onPendingPatternConsumed }: MainToolbarProps) {
  const { tabs, activeSessionId, updateTab } = useTabStore()
  const { perimeters, selectedPerimeterId } = usePerimeterStore()
  const { addEntry } = useFilterHistory()
  const { theme, toggleTheme } = useUiStore()

  const activeTab = tabs.find(t => t.sessionId === activeSessionId)
  const tailMode = activeTab?.tailMode ?? true

  const [pattern, setPattern] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)

  const selectedPerimeter = perimeters.find(p => p.id === selectedPerimeterId)

  // Reset filter state when active tab changes
  useEffect(() => {
    setPattern('')
    setIsFiltering(false)
  }, [activeSessionId])

  // Consume pattern injected from filter history panel
  useEffect(() => {
    if (pendingPattern) {
      setPattern(pendingPattern)
      onPendingPatternConsumed?.()
    }
  }, [pendingPattern, onPendingPatternConsumed])

  const applyFilter = useCallback(async () => {
    if (!activeSessionId) return
    if (!pattern.trim()) {
      await hub.invoke('ClearFilter', activeSessionId)
      updateTab(activeSessionId, { isFiltered: false })
      return
    }
    setIsFiltering(true)
    addEntry(pattern.trim())
    const filter: FilterOptionsDto = { pattern: pattern.trim(), isRegex: true, caseSensitive: false }
    await hub.invoke('SetFilter', activeSessionId, filter)
    updateTab(activeSessionId, { isFiltered: true })
    setIsFiltering(false)
    onFilterApplied?.()
  }, [hub, activeSessionId, pattern, updateTab, addEntry, onFilterApplied])

  const clearFilter = useCallback(async () => {
    if (!activeSessionId) return
    setPattern('')
    await hub.invoke('ClearFilter', activeSessionId)
    updateTab(activeSessionId, { isFiltered: false })
  }, [hub, activeSessionId, updateTab])

  const toggleTail = useCallback(async () => {
    if (!activeSessionId) return
    const next = !tailMode
    await hub.invoke('SetTail', activeSessionId, next)
    updateTab(activeSessionId, { tailMode: next })
  }, [hub, activeSessionId, tailMode, updateTab])

  return (
    <header className="chrome-bar">
      <div className="chrome-brand">
        <div className="brand-title">LogWatcher Web</div>
      </div>

      <div className="chrome-controls">
        <button onClick={onSwitchPerimeter} title="Switch perimeter" className="control-button control-button--ghost">
          <span className="control-value">{selectedPerimeter?.name ?? 'Perimeter'}</span>
        </button>

        <div className="toolbar-filter-cluster">
          <input
            className="control-input toolbar-filter-input"
            placeholder={activeTab ? 'Regex filter…' : 'Open a log to enable filtering'}
            value={pattern}
            disabled={!activeTab}
            onChange={e => setPattern(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyFilter()}
          />

          <button
            onClick={applyFilter}
            disabled={isFiltering || !activeTab}
            className="control-button control-button--primary"
          >
            {isFiltering ? '...' : 'Go'}
          </button>

          {activeTab?.isFiltered && (
            <button onClick={clearFilter} className="control-button control-button--ghost">
              X
            </button>
          )}
        </div>

        <div className="toolbar-status-cluster">
          {activeTab && (
            <button onClick={toggleTail} className={`status-pill status-pill--action ${tailMode ? 'status-pill--ok' : ''}`}>
              {tailMode ? 'Tail' : 'Pause'}
            </button>
          )}

          {activeTab?.errorMessage && (
            <span className="status-pill status-pill--danger" title={activeTab.errorMessage}>
              {activeTab.errorMessage}
            </span>
          )}

          <button onClick={onOpenPreferences} className="control-button control-button--ghost">
            Prefs
          </button>

          <button onClick={toggleTheme} className="control-button control-button--ghost">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <button onClick={onLogout} className="control-button control-button--ghost">
            Out
          </button>
        </div>
      </div>
    </header>
  )
}
