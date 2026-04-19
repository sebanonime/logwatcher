import React from 'react'
import { useLogStore, useTabStore } from '../../store/logStore'

export function SelectedLinePanel() {
  const { activeSessionId } = useTabStore()
  const { getSelectedLine } = useLogStore()

  const line = activeSessionId ? getSelectedLine(activeSessionId) : null

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      <div className="px-2 py-1 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Selected Line{line ? ` #${line.lineNumber + 1}` : ''}
        </span>
      </div>
      <div className="flex-1 overflow-auto px-2 py-1">
        {!line && (
          <div className="text-xs text-gray-600 mt-1">Click a log line to inspect it here.</div>
        )}
        {line && (
          <pre className="text-xs text-gray-200 font-mono whitespace-pre-wrap break-words leading-relaxed">
            {line.text}
          </pre>
        )}
      </div>
    </div>
  )
}
