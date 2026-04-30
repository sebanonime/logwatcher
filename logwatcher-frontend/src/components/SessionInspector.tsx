import React from 'react'
import { FilterHistoryPanel } from './panels/FilterHistoryPanel'
import { SelectedLinePanel } from './panels/SelectedLinePanel'

interface SessionInspectorProps {
  onSelectPattern: (pattern: string) => void
  onApplyPattern: (pattern: string) => void
  filterRefreshTick?: number
}

export function SessionInspector({ onSelectPattern, onApplyPattern, filterRefreshTick }: SessionInspectorProps) {
  return (
    <div className="inspector-rail">
      <section className="surface-panel rail-section inspector-fill inspector-fill--primary">
        <SelectedLinePanel />
      </section>

      <section className="surface-panel rail-section inspector-fill inspector-fill--secondary">
        <FilterHistoryPanel onSelectPattern={onSelectPattern} onApplyPattern={onApplyPattern} refreshTick={filterRefreshTick} />
      </section>
    </div>
  )
}