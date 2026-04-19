import React, { useState, useCallback, useEffect } from 'react'
import { useFilterHistory } from '../../hooks/useFilterHistory'

interface FilterHistoryPanelProps {
  /** Called when user clicks a history entry — populate filter input */
  onSelectPattern: (pattern: string) => void
  /** Increment this to force a re-read of localStorage after filter applied */
  refreshTick?: number
}

export function FilterHistoryPanel({ onSelectPattern, refreshTick }: FilterHistoryPanelProps) {
  const { getHistory, clear } = useFilterHistory()
  const [history, setHistory] = useState<string[]>([])

  // Re-read from localStorage whenever refreshTick changes or on mount
  useEffect(() => {
    setHistory(getHistory())
  }, [getHistory, refreshTick])

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter History</span>
        {history.length > 0 && (
          <button
            onClick={() => { clear(); setHistory([]) }}
            className="text-xs text-gray-600 hover:text-gray-400"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 && (
          <div className="px-2 py-2 text-xs text-gray-600">No filter history yet.</div>
        )}
        {history.map((pattern, i) => (
          <div
            key={i}
            onClick={() => onSelectPattern(pattern)}
            className="px-2 py-1 text-xs font-mono text-gray-400 hover:bg-gray-700 hover:text-blue-400 cursor-pointer truncate"
            title={pattern}
          >
            {pattern}
          </div>
        ))}
      </div>
    </div>
  )
}
