import React from 'react'
import { useLogStore, useTabStore } from '../../store/logStore'

export function SelectedLinePanel() {
  const { activeSessionId } = useTabStore()
  const { getSelectedLine } = useLogStore()

  const line = activeSessionId ? getSelectedLine(activeSessionId) : null

  return (
    <div className="rail-panel-content">
      <div className="section-header-row">
        <div>
          <div className="eyebrow">Inspect</div>
        </div>
      </div>
      <div className="rail-scroll">
        {!line && (
          <div className="empty-state compact-empty-state">Click a log line to inspect it here.</div>
        )}
        {line && (
          <pre className="selected-line-content">
            {line.text}
          </pre>
        )}
      </div>
    </div>
  )
}
