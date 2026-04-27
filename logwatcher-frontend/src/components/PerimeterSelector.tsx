import React, { useEffect } from 'react'
import { usePerimeterStore } from '../store/perimeterStore'
import type { PerimeterDto } from '../types'

interface PerimeterSelectorProps {
  onSelect: (perimeter: PerimeterDto) => void
}

/**
 * Full-screen perimeter chooser shown after login (and when switching perimeters).
 */
export function PerimeterSelector({ onSelect }: PerimeterSelectorProps) {
  const { perimeters, isFetching, fetchError, fetchPerimeters } = usePerimeterStore()

  useEffect(() => { fetchPerimeters() }, [fetchPerimeters])

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-blue-400 mb-1">LogWatcher</h1>
        <p className="text-sm text-gray-400">Select a perimeter to continue</p>
      </div>

      {isFetching && (
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      )}

      {!isFetching && fetchError && (
        <p className="text-red-400 text-sm">{fetchError}</p>
      )}

      {!isFetching && !fetchError && perimeters.length === 0 && (
        <p className="text-gray-500 text-sm">No perimeters configured.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl w-full px-8">
        {perimeters.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-blue-500
                       rounded-lg p-5 text-left transition-colors group"
          >
            <div className="text-base font-semibold text-gray-100 group-hover:text-blue-400 mb-1">
              {p.name}
            </div>
            <div className="text-xs text-gray-500">
              {p.rootFolders.length} root folder{p.rootFolders.length !== 1 ? 's' : ''} ·{' '}
              {p.rootFolders.reduce((n, r) => n + r.servers.length, 0)} server{
                p.rootFolders.reduce((n, r) => n + r.servers.length, 0) !== 1 ? 's' : ''}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
