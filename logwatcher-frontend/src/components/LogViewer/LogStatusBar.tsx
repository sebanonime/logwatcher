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
    <div className="flex items-center gap-4 px-2 py-0.5 bg-gray-900 border-t border-gray-700 text-xs text-gray-500 flex-shrink-0">
      <span>{tab.totalLines.toLocaleString()} lines</span>
      <span>{formatBytes(tab.sizeBytes)}</span>
      {!tab.isIndexed && <span className="text-yellow-500 animate-pulse">Indexing…</span>}
      {tab.isFiltered && <span className="text-blue-400">Filtered</span>}
      {tab.newLinesCount > 0 && (
        <span className="text-green-400">+{tab.newLinesCount} new lines</span>
      )}
      <span className="flex-1" />
      <span className="text-gray-600">{tab.serverName} · {tab.filePath}</span>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes > 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
  if (bytes > 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  if (bytes > 1e3) return `${(bytes / 1e3).toFixed(1)} KB`
  return `${bytes} B`
}
