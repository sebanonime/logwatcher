import React, { useState, useCallback, useEffect } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '../../store/logStore'
import { usePerimeterStore } from '../../store/perimeterStore'
import { useFilterHistory } from '../../hooks/useFilterHistory'
import type { FilterOptionsDto, PerimeterDto } from '../../types'

interface MainToolbarProps {
  hub: HubConnection
  onSwitchPerimeter: () => void
  onLogout: () => void
  onFilterApplied?: () => void
  /** Pattern injected from filter history panel — consumed once and applied */
  pendingPattern?: string | null
  onPendingPatternConsumed?: () => void
}

/**
 * Top toolbar: perimeter selector + filter controls for the active log tab + tail toggle.
 */
export function MainToolbar({ hub, onSwitchPerimeter, onLogout, onFilterApplied, pendingPattern, onPendingPatternConsumed }: MainToolbarProps) {
  const { tabs, activeSessionId, updateTab } = useTabStore()
  const { perimeters, selectedPerimeterId } = usePerimeterStore()
  const { addEntry } = useFilterHistory()

  const activeTab = tabs.find(t => t.sessionId === activeSessionId)
  const tailMode = activeTab?.tailMode ?? true

  const [pattern, setPattern] = useState('')
  const [isRegex, setIsRegex] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
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
    const filter: FilterOptionsDto = { pattern: pattern.trim(), isRegex, caseSensitive }
    await hub.invoke('SetFilter', activeSessionId, filter)
    updateTab(activeSessionId, { isFiltered: true })
    setIsFiltering(false)
    onFilterApplied?.()
  }, [hub, activeSessionId, pattern, isRegex, caseSensitive, updateTab, addEntry, onFilterApplied])

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
    <div className="flex items-center gap-2 px-2 py-1 bg-gray-800 border-b border-gray-700 flex-shrink-0">
      {/* Logo + perimeter switcher */}
      <span className="font-bold text-sm text-blue-400 mr-1 shrink-0">LogWatcher</span>
      <button
        onClick={onSwitchPerimeter}
        title="Switch perimeter"
        className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600 shrink-0 max-w-[120px] truncate"
      >
        {selectedPerimeter?.name ?? 'Select…'} ▾
      </button>

      <div className="w-px h-4 bg-gray-600 mx-1" />

      {/* Filter input */}
      <input
        className="flex-1 min-w-0 bg-gray-900 text-gray-100 text-xs font-mono px-2 py-1 rounded border border-gray-600
                   focus:outline-none focus:border-blue-500 disabled:opacity-40"
        placeholder={activeTab ? 'Filter (text or regex)…' : 'Open a log to filter'}
        value={pattern}
        disabled={!activeTab}
        onChange={e => setPattern(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && applyFilter()}
      />

      {/* Regex toggle */}
      <button
        title="Regex"
        onClick={() => setIsRegex(r => !r)}
        className={`px-2 py-1 text-xs rounded font-mono shrink-0 ${isRegex ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
      >
        .*
      </button>

      {/* Case sensitive */}
      <button
        title="Case sensitive"
        onClick={() => setCaseSensitive(c => !c)}
        className={`px-2 py-1 text-xs rounded shrink-0 ${caseSensitive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
      >
        Aa
      </button>

      <button
        onClick={applyFilter}
        disabled={isFiltering || !activeTab}
        className="px-2 py-1 text-xs rounded bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-40 shrink-0"
      >
        {isFiltering ? '…' : 'Filter'}
      </button>

      {activeTab?.isFiltered && (
        <button
          onClick={clearFilter}
          className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600 shrink-0"
        >
          ✕ Clear
        </button>
      )}

      <div className="flex-1 min-w-0" />

      {/* Tail toggle */}
      {activeTab && (
        <button
          onClick={toggleTail}
          title={tailMode ? 'Following tail — click to pause' : 'Paused — click to follow tail'}
          className={`px-2 py-1 text-xs rounded shrink-0 ${tailMode ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-400'}`}
        >
          {tailMode ? '⬇ Tail' : '⏸ Paused'}
        </button>
      )}

      <div className="w-px h-4 bg-gray-600 mx-1" />

      <button
        onClick={onLogout}
        className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-400 hover:bg-gray-600 shrink-0"
      >
        Sign out
      </button>
    </div>
  )
}
