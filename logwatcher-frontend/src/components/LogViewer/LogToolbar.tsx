import React, { useState, useCallback } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '../../store/logStore'
import type { FilterOptionsDto } from '../../types'

interface LogToolbarProps {
  sessionId: string
  hub: HubConnection
}

/**
 * Filter bar + tail toggle for a single log session.
 */
export function LogToolbar({ sessionId, hub }: LogToolbarProps) {
  const [pattern, setPattern] = useState('')
  const [isRegex, setIsRegex] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)

  const { tabs, updateTab } = useTabStore()
  const tab = tabs.find(t => t.sessionId === sessionId)
  const tailMode = tab?.tailMode ?? true

  const applyFilter = useCallback(async () => {
    if (!pattern.trim()) {
      await hub.invoke('ClearFilter', sessionId)
      updateTab(sessionId, { isFiltered: false })
      setIsFiltering(false)
      return
    }
    setIsFiltering(true)
    const filter: FilterOptionsDto = { pattern: pattern.trim(), isRegex, caseSensitive }
    await hub.invoke('SetFilter', sessionId, filter)
    updateTab(sessionId, { isFiltered: true })
    setIsFiltering(false)
  }, [hub, sessionId, pattern, isRegex, caseSensitive, updateTab])

  const clearFilter = useCallback(async () => {
    setPattern('')
    await hub.invoke('ClearFilter', sessionId)
    updateTab(sessionId, { isFiltered: false })
  }, [hub, sessionId, updateTab])

  const toggleTail = useCallback(async () => {
    const next = !tailMode
    await hub.invoke('SetTail', sessionId, next)
    updateTab(sessionId, { tailMode: next })
  }, [hub, sessionId, tailMode, updateTab])

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-gray-800 border-b border-gray-700 flex-shrink-0">
      {/* Filter input */}
      <input
        className="flex-1 bg-gray-900 text-gray-100 text-xs font-mono px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
        placeholder="Filter (text or /regex/)..."
        value={pattern}
        onChange={e => setPattern(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && applyFilter()}
      />

      {/* Regex toggle */}
      <button
        title="Regex"
        onClick={() => setIsRegex(r => !r)}
        className={`px-2 py-1 text-xs rounded font-mono ${isRegex ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
      >
        .*
      </button>

      {/* Case sensitive toggle */}
      <button
        title="Case sensitive"
        onClick={() => setCaseSensitive(c => !c)}
        className={`px-2 py-1 text-xs rounded ${caseSensitive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
      >
        Aa
      </button>

      {/* Apply/Clear */}
      <button
        onClick={applyFilter}
        disabled={isFiltering}
        className="px-2 py-1 text-xs rounded bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {isFiltering ? '...' : 'Filter'}
      </button>

      {tab?.isFiltered && (
        <button
          onClick={clearFilter}
          className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          ✕ Clear
        </button>
      )}

      <div className="flex-1" />

      {/* Tail toggle */}
      <button
        onClick={toggleTail}
        title={tailMode ? 'Following tail — click to pause' : 'Paused — click to follow tail'}
        className={`px-2 py-1 text-xs rounded ${tailMode ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-400'}`}
      >
        {tailMode ? '⬇ Tail' : '⏸ Paused'}
      </button>
    </div>
  )
}
