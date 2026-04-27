import React from 'react'
import { useTabStore } from '../store/logStore'
import { FilterHistoryPanel } from './panels/FilterHistoryPanel'
import { SelectedLinePanel } from './panels/SelectedLinePanel'

interface SessionInspectorProps {
  onSelectPattern: (pattern: string) => void
  filterRefreshTick?: number
}

export function SessionInspector({ onSelectPattern, filterRefreshTick }: SessionInspectorProps) {
  const { tabs, activeSessionId } = useTabStore()
  const activeTab = tabs.find(tab => tab.sessionId === activeSessionId)

  return (
    <div className="inspector-rail">
      <section className="surface-panel rail-section rail-section--hero">
        <div className="eyebrow">Workspace</div>
        <div className="inspector-title">Session intelligence</div>
        <p className="inspector-copy">
          The WinForms app concentrates around profile-driven viewing, fast filtering, and line inspection.
          This rail keeps those tools together and reserves clear space for the profile and highlighting workflows still missing on the web backend.
        </p>

        {activeTab ? (
          <div className="metric-grid">
            <div className="metric-card">
              <span className="metric-label">Server</span>
              <span className="metric-value">{activeTab.serverName}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Lines</span>
              <span className="metric-value">{activeTab.totalLines.toLocaleString()}</span>
            </div>
            <div className="metric-card metric-card--wide">
              <span className="metric-label">Open file</span>
              <span className="metric-value metric-value--path" title={activeTab.filePath}>{activeTab.filePath}</span>
            </div>
          </div>
        ) : (
          <div className="empty-state compact-empty-state">Open a log to see session details and context tools.</div>
        )}
      </section>

      <section className="surface-panel rail-section">
        <div className="section-header-row">
          <div>
            <div className="eyebrow">Parity</div>
            <div className="section-title">Profiles and highlighting</div>
          </div>
          <span className="status-pill status-pill--warn">Backend gap</span>
        </div>
        <ul className="feature-list">
          <li>Real profile switching is not implemented server-side yet. The SignalR method is currently a placeholder.</li>
          <li>Per-profile highlighting and stored hidden-line rules exist in the WinForms config, but are not exposed to the web client.</li>
          <li>The redesigned shell leaves a dedicated control zone so those features can be added without another UX rewrite.</li>
        </ul>
      </section>

      <section className="surface-panel rail-section inspector-fill">
        <SelectedLinePanel />
      </section>

      <section className="surface-panel rail-section inspector-fill">
        <FilterHistoryPanel onSelectPattern={onSelectPattern} refreshTick={filterRefreshTick} />
      </section>
    </div>
  )
}