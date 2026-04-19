import React, { useCallback } from 'react'
import { useBrowserStore } from '../../store/browserStore'
import { usePerimeterStore } from '../../store/perimeterStore'
import { useTabStore } from '../../store/logStore'
import { getLogHub } from '../../signalr/logHubConnection'
import type { RemoteFileInfoDto } from '../../types'

/** Extract just the last segment from a path, handling / and \ separators */
function basename(path: string): string {
  return path.split(/[/\\]/).filter(Boolean).pop() ?? path
}

function formatBytes(bytes: number): string {
  if (bytes > 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
  if (bytes > 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  if (bytes > 1e3) return `${(bytes / 1e3).toFixed(1)} KB`
  return `${bytes} B`
}

/**
 * 3-panel log browser:
 * ┌──────────────┬─────────────────┐
 * │ Root Folders │ Subfolders      │
 * │              │ [filter]        │
 * ├──────────────┴─────────────────┤
 * │ Files [filter]                 │
 * └────────────────────────────────┘
 */
export function LogBrowser() {
  const { perimeters, selectedPerimeterId } = usePerimeterStore()
  const {
    selectedRootFolder, subfolders, subfoldersFilter, selectedSubfolder,
    files, filesFilter, isLoadingSubfolders, isLoadingFiles,
    loadRoot, loadSubfolder, setSubfoldersFilter, setFilesFilter,
  } = useBrowserStore()

  const { addTab } = useTabStore()
  const selectedPerimeter = perimeters.find(p => p.id === selectedPerimeterId)

  const handleSelectRoot = useCallback((rootName: string) => {
    if (!selectedPerimeterId) return
    loadRoot(selectedPerimeterId, rootName)
  }, [selectedPerimeterId, loadRoot])

  const handleSelectSubfolder = useCallback((item: RemoteFileInfoDto) => {
    if (!selectedPerimeterId || !selectedRootFolder) return
    const subpath = basename(item.path)
    loadSubfolder(selectedPerimeterId, selectedRootFolder, subpath)
  }, [selectedPerimeterId, selectedRootFolder, loadSubfolder])

  const handleOpenFile = useCallback(async (file: RemoteFileInfoDto) => {
    if (!selectedPerimeterId || !selectedRootFolder) return

    const perimeter = perimeters.find(p => p.id === selectedPerimeterId)
    const rootFolder = perimeter?.rootFolders.find(r => r.name === selectedRootFolder)
    const server = rootFolder?.servers[0]
    if (!server) return

    const hub = getLogHub()
    const sessionId = `${server.id}_${Date.now()}`
    addTab({
      sessionId,
      serverId: server.id,
      filePath: file.path,
      displayName: basename(file.path),
      serverName: server.name,
      totalLines: 0,
      sizeBytes: 0,
      isIndexed: false,
      newLinesCount: 0,
      tailMode: true,
      isFiltered: false,
    })
    await hub.invoke('OpenLog', sessionId, server.id, file.path, { loadFromEnd: true, initialLines: 500 })
  }, [selectedPerimeterId, selectedRootFolder, perimeters, addTab])

  const filteredSubfolders = subfolders.filter(f =>
    basename(f.path).toLowerCase().includes(subfoldersFilter.toLowerCase())
  )
  const filteredFiles = files.filter(f =>
    basename(f.path).toLowerCase().includes(filesFilter.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700 overflow-hidden">
      {/* Top row: root folders | subfolders */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Root folders — fixed width column */}
        <div className="w-28 shrink-0 border-r border-gray-700 flex flex-col overflow-hidden">
          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-700 shrink-0">
            Roots
          </div>
          <div className="flex-1 overflow-y-auto">
            {selectedPerimeter?.rootFolders.map(root => (
              <div
                key={root.name}
                onClick={() => handleSelectRoot(root.name)}
                className={`px-2 py-1.5 text-xs cursor-pointer truncate hover:bg-gray-700 ${
                  selectedRootFolder === root.name ? 'bg-blue-900 text-blue-300' : 'text-gray-300'
                }`}
                title={root.name}
              >
                {root.name}
              </div>
            ))}
          </div>
        </div>

        {/* Subfolders */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-1 py-1 border-b border-gray-700 shrink-0">
            <input
              className="w-full bg-gray-800 text-gray-100 text-xs px-2 py-0.5 rounded border border-gray-600
                         focus:outline-none focus:border-blue-500"
              placeholder="Filter folders…"
              value={subfoldersFilter}
              onChange={e => setSubfoldersFilter(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoadingSubfolders && (
              <div className="px-2 py-2 text-xs text-gray-500 animate-pulse">Loading…</div>
            )}
            {filteredSubfolders.map(f => {
              const name = basename(f.path)
              return (
                <div
                  key={f.path}
                  onClick={() => handleSelectSubfolder(f)}
                  className={`px-2 py-1.5 text-xs cursor-pointer truncate hover:bg-gray-700 ${
                    selectedSubfolder === name ? 'bg-blue-900 text-blue-300' : 'text-gray-300'
                  }`}
                  title={f.path}
                >
                  📁 {name}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom: files — fixed height */}
      <div className="h-52 shrink-0 flex flex-col border-t border-gray-700">
        <div className="px-1 py-1 border-b border-gray-700 shrink-0">
          <input
            className="w-full bg-gray-800 text-gray-100 text-xs px-2 py-0.5 rounded border border-gray-600
                       focus:outline-none focus:border-blue-500"
            placeholder="Filter files…"
            value={filesFilter}
            onChange={e => setFilesFilter(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoadingFiles && (
            <div className="px-2 py-2 text-xs text-gray-500 animate-pulse">Loading…</div>
          )}
          {filteredFiles.map(f => {
            const name = basename(f.path)
            return (
              <div
                key={f.path}
                onDoubleClick={() => handleOpenFile(f)}
                className="flex items-center px-2 py-1 text-xs cursor-pointer hover:bg-gray-700 group"
                title={`Double-click to open:\n${f.path}`}
              >
                <span className="flex-1 text-gray-300 truncate group-hover:text-blue-400">📄 {name}</span>
                <span className="text-gray-600 shrink-0 ml-2">{formatBytes(f.sizeBytes)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
