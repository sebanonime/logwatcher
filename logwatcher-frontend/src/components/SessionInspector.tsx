import React from 'react'
import { FilterHistoryPanel } from './panels/FilterHistoryPanel'
import { SelectedLinePanel } from './panels/SelectedLinePanel'
import { LineWatchdogPanel } from './panels/LineWatchdogPanel'
import { useUiStore } from '../store/uiStore'

interface SessionInspectorProps {
  onSelectPattern: (pattern: string) => void
  onApplyPattern: (pattern: string) => void
  filterRefreshTick?: number
}

export function SessionInspector({ onSelectPattern, onApplyPattern, filterRefreshTick }: SessionInspectorProps) {
  const showLineWatchdogPanel = useUiStore(state => state.showLineWatchdogPanel)

  return (
    <div className="inspector-rail">
      <section className="surface-panel rail-section inspector-fill inspector-fill--primary">
        <SelectedLinePanel />
      </section>

      <section className="surface-panel rail-section inspector-fill inspector-fill--secondary">
        <FilterHistoryPanel onSelectPattern={onSelectPattern} onApplyPattern={onApplyPattern} refreshTick={filterRefreshTick} />
      </section>

      {showLineWatchdogPanel && (
        <section className="surface-panel rail-section inspector-fill inspector-fill--secondary">
          <LineWatchdogPanel />
        </section>
      )}
    </div>
  )
}