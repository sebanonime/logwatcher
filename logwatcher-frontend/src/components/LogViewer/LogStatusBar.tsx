import React from 'react'
import { useTabStore } from '../../store/logStore'

interface LogStatusBarProps {
  sessionId: string
}

export function LogStatusBar({ sessionId }: LogStatusBarProps) {
  const { tabs } = useTabStore()
  const tab = tabs.find(t => t.sessionId === sessionId)
  if (!tab) return null

  return (
    <div className="log-status-bar">
      <span className="status-pill">{tab.totalLines.toLocaleString()} lines</span>
      <span className="status-pill">{formatBytes(tab.sizeBytes)}</span>
      {!tab.isIndexed && <span className="status-pill status-pill--warn">Indexing…</span>}
      {tab.isFiltered && <span className="status-pill">Filtered</span>}
      {tab.newLinesCount > 0 && (
        <span className="status-pill status-pill--ok">+{tab.newLinesCount} new lines</span>
      )}
      {tab.errorMessage && (
        <span className="status-pill status-pill--danger" title={tab.errorMessage}>{tab.errorMessage}</span>
      )}
      <span className="flex-1" />
      <span className="log-status-path">{tab.serverName} · {tab.filePath}</span>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes > 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
  if (bytes > 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  if (bytes > 1e3) return `${(bytes / 1e3).toFixed(1)} KB`
  return `${bytes} B`
}
