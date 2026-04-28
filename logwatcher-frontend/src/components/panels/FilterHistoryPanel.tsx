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
    <div className="rail-panel-content">
      <div className="section-header-row">
        <div>
          <div className="eyebrow">Filter history</div>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => { clear(); setHistory([]) }}
            className="control-button control-button--ghost"
          >
            Clear
          </button>
        )}
      </div>
      <div className="rail-scroll">
        {history.length === 0 && (
          <div className="empty-state compact-empty-state">No filter history yet.</div>
        )}
        {history.map((pattern, i) => (
          <button
            key={i}
            onClick={() => onSelectPattern(pattern)}
            className="history-chip"
            title={pattern}
          >
            {pattern}
          </button>
        ))}
      </div>
    </div>
  )
}
