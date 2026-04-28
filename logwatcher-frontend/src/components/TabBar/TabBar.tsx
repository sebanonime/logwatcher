import React from 'react'
import { useTabStore } from '../../store/logStore'

interface TabBarProps {
  onClose: (sessionId: string) => void
}

export function TabBar({ onClose }: TabBarProps) {
  const { tabs, activeSessionId, setActive } = useTabStore()

  if (tabs.length === 0) return null

  return (
    <div className="flex overflow-x-auto bg-gray-800 border-b border-gray-700 flex-shrink-0">
      {tabs.map(tab => (
        <div
          key={tab.sessionId}
          onClick={() => setActive(tab.sessionId)}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono cursor-pointer border-r border-gray-700 whitespace-nowrap select-none ${
            tab.sessionId === activeSessionId
              ? 'bg-gray-900 text-white border-t-2 border-t-blue-500'
              : 'text-gray-400 hover:bg-gray-700'
          }`}
        >
          {/* Server type badge */}
          <span className={`px-1 rounded text-[10px] ${
            tab.serverName === 'Local' ? 'bg-gray-700' :
            tab.sessionId.startsWith('agent') ? 'bg-purple-900' : 'bg-teal-900'
          }`}>
            {tab.serverName}
          </span>

          {/* File name */}
          <span className="max-w-[180px] truncate" title={tab.displayName}>
            {tab.displayName}
          </span>

          {/* New lines badge */}
          {tab.newLinesCount > 0 && (
            <span className="bg-green-700 text-white px-1 rounded text-[10px]">
              +{tab.newLinesCount}
            </span>
          )}

          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); onClose(tab.sessionId) }}
            className="ml-1 text-gray-500 hover:text-white"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
