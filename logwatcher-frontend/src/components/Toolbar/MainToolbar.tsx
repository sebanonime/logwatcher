import React, { useState, useCallback, useEffect, useMemo } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '../../store/logStore'
import { usePerimeterStore } from '../../store/perimeterStore'
import { useFilterHistory } from '../../hooks/useFilterHistory'
import type { FilterOptionsDto } from '../../types'
import { useLogStore } from '../../store/logStore'
import { usePreferencesStore } from '../../store/preferencesStore'

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
  const { tabs, activeSessionId, updateTab, setActive } = useTabStore()
  const { setSelectedLine, getLine } = useLogStore()
  const { perimeters, selectedPerimeterId } = usePerimeterStore()
  const profiles = usePreferencesStore(state => state.profiles)
  const { addEntry } = useFilterHistory()

  const activeTab = tabs.find(t => t.sessionId === activeSessionId)
  const activeProfile = useMemo(
    () => profiles.find(profile => profile.name === activeTab?.activeProfileName),
    [profiles, activeTab?.activeProfileName]
  )
  const activeStoredFilter = useMemo(
    () => activeProfile?.dicoStoredFilter.find(filter => filter.name === activeTab?.activeStoredFilterName),
    [activeProfile, activeTab?.activeStoredFilterName]
  )
  const tailMode = activeTab?.tailMode ?? true

  const [pattern, setPattern] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)

  const selectedPerimeter = perimeters.find(p => p.id === selectedPerimeterId)

  // Reset filter state when active tab changes
  useEffect(() => {
    setPattern('')
    setIsFiltering(false)
  }, [activeSessionId])

  useEffect(() => {
    if (activeStoredFilter) {
      setPattern(activeStoredFilter.filter ?? '')
    }
  }, [activeStoredFilter])

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

    const filterPayload = activeStoredFilter
      ? {
          pattern: activeStoredFilter.filter,
          isRegex: activeStoredFilter.isRegex,
          caseSensitive: activeStoredFilter.caseSensitive,
        }
      : {
          pattern: pattern.trim(),
          isRegex: true,
          caseSensitive: false,
        }

    setIsFiltering(true)
    addEntry(filterPayload.pattern.trim())
    const filter: FilterOptionsDto = filterPayload
    await hub.invoke('SetFilter', activeSessionId, filter)
    updateTab(activeSessionId, { isFiltered: true })
    setIsFiltering(false)
    onFilterApplied?.()
  }, [hub, activeSessionId, pattern, updateTab, addEntry, onFilterApplied, activeStoredFilter])

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

  const searchNext = useCallback(async () => {
    if (!activeTab || !activeSessionId) return
    const query = pattern.trim()
    if (!query) return

    const caseSensitive = activeStoredFilter?.caseSensitive ?? false
    const isRegex = activeStoredFilter?.isRegex ?? true

    let regex: RegExp | null = null
    if (isRegex) {
      try {
        regex = new RegExp(query, caseSensitive ? '' : 'i')
      } catch {
        return
      }
    }

    const currentLine = useLogStore.getState().getSelectedLine(activeSessionId)?.lineNumber ?? -1
    const totalLines = activeTab.totalLines
    if (totalLines <= 0) return

    const isMatch = (line: string) => {
      if (isRegex && regex) return regex.test(line)
      return caseSensitive
        ? line.includes(query)
        : line.toLowerCase().includes(query.toLowerCase())
    }

    const scanOrder: number[] = []
    for (let i = currentLine + 1; i < totalLines; i++) scanOrder.push(i)
    for (let i = 0; i <= currentLine; i++) scanOrder.push(i)

    const requestedChunks = new Set<number>()
    for (const lineNumber of scanOrder) {
      const chunkStart = Math.floor(lineNumber / 300) * 300
      if (!requestedChunks.has(chunkStart)) {
        requestedChunks.add(chunkStart)
        const chunkCount = Math.min(300, totalLines - chunkStart)
        try {
          await hub.invoke('RequestLines', activeSessionId, chunkStart, chunkCount)
        } catch {
          break
        }
      }

      const line = getLine(activeSessionId, lineNumber)
      if (line !== undefined && isMatch(line)) {
        setSelectedLine(activeSessionId, { lineNumber, text: line })
        setActive(activeSessionId)
        return
      }
    }
  }, [activeTab, activeSessionId, pattern, activeStoredFilter, hub, getLine, setSelectedLine, setActive])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'F3') return
      event.preventDefault()
      void searchNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchNext])

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
            title="Apply filter"
          >
            {isFiltering ? '…' : '⎚'}
          </button>

          <button
            onClick={searchNext}
            disabled={!activeTab || !pattern.trim()}
            className="control-button control-button--ghost"
            title="Find next (F3)"
          >
            ⌕
          </button>

          {activeTab?.isFiltered && (
            <button onClick={clearFilter} className="control-button control-button--ghost">
              X
            </button>
          )}
        </div>

        <div className="toolbar-status-cluster">
          {activeProfile && (
            <select
              className="control-input"
              value={activeTab?.activeStoredFilterName ?? ''}
              onChange={event => {
                if (!activeSessionId) return
                const nextFilterName = event.target.value || undefined
                updateTab(activeSessionId, { activeStoredFilterName: nextFilterName })
                const filter = activeProfile.dicoStoredFilter.find(item => item.name === nextFilterName)
                setPattern(filter?.filter ?? '')
              }}
              title="Stored filters"
            >
              <option value="">Stored filter</option>
              {activeProfile.dicoStoredFilter.map(filter => (
                <option key={filter.name} value={filter.name}>{filter.name}</option>
              ))}
            </select>
          )}

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

          <button onClick={onLogout} className="control-button control-button--ghost">
            Out
          </button>

          <button onClick={onOpenPreferences} className="control-button control-button--ghost" title="Preferences">
            ⚙
          </button>
        </div>
      </div>
    </header>
  )
}
