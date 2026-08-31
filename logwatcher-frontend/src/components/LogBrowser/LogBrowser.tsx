import React, { useCallback, useEffect, useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { useBrowserStore } from '../../store/browserStore'
import { usePerimeterStore } from '../../store/perimeterStore'
import { useTabStore } from '../../store/logStore'
import { getLogHub } from '../../signalr/logHubConnection'
import { startLogHub } from '../../signalr/logHubConnection'
import { usePreferencesStore } from '../../store/preferencesStore'
import type { ProfileDto, RemoteFileInfoDto } from '../../types'

/** Extract just the last segment from a path, handling / and \ separators */
function basename(path: string): string {
  return path.split(/[/\\]/).filter(Boolean).pop() ?? path
}

/** Returns true if the filename looks like a rolled log (e.g. app_01.log, app.2.log) */
function isRolledFile(path: string): boolean {
  const name = basename(path)
  // Match: name_N.ext or name.N.ext where N is one or more digits
  return /[_\.]\d+\.[^./\\]+$/.test(name)
}

function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toTimeString().slice(0, 8)
  } catch { return '' }
}

function matchProfile(profiles: ProfileDto[], filePath: string): ProfileDto | null {
  const fileName = basename(filePath)
  for (const profile of profiles) {
    const params = (profile.loadingParam ?? '')
      .split(';')
      .map(param => param.trim())
      .filter(Boolean)

    for (const param of params) {
      try {
        if (filePath.includes(param)) return profile
        if (new RegExp(param, 'i').test(filePath)) return profile
        if (new RegExp(param, 'i').test(fileName)) return profile
      } catch {
        continue
      }
    }
  }

  return null
}

/**
 * 3-panel log browser:
 * ┌──────────────┬─────────────────┐
 * │ Root Folders │ Subfolders      │
 * │              │ [filter]        │
 * ├──────────────┴─────────────────┤
 * │ Files [name filter] [content filter] [Search]  │
 * └────────────────────────────────┘
 */
export function LogBrowser({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { perimeters, selectedPerimeterId, selectPerimeter } = usePerimeterStore()
  const {
    selectedRootFolder, subfolders, rootFiles, rootFilesFolderPath, subfoldersFilter, selectedSubfolder,
    files, filesFilter, isLoadingSubfolders, isLoadingFiles,
    archiveBreadcrumb, archiveEntries, isLoadingArchive,
    contentFilter, contentFilterIsRegex, matchedSearchFiles,
    loadRoot, loadSubfolder, refreshFiles, enterArchive, enterArchiveFolder, goToArchiveBreadcrumb, exitArchive,
    setSubfoldersFilter, setFilesFilter,
    setContentFilter, setContentFilterIsRegex, openSearchResultsTab, clearMatchedSearchFiles,
  } = useBrowserStore()

  const { tabs, addTab, removeTab, setActive } = useTabStore()
  const profiles = usePreferencesStore(state => state.profiles)
  const selectedPerimeter = perimeters.find(p => p.id === selectedPerimeterId)
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const [showCurrentOnly, setShowCurrentOnly] = useState(false)

  // Auto-refresh file list every 15s without clearing the existing list
  useEffect(() => {
    if (!selectedPerimeterId || !selectedRootFolder || !selectedSubfolder) return
    const id = setInterval(() => {
      refreshFiles(selectedPerimeterId, selectedRootFolder, selectedSubfolder)
    }, 15000)
    return () => clearInterval(id)
  }, [selectedPerimeterId, selectedRootFolder, selectedSubfolder, refreshFiles])

  const handlePerimeterChange = useCallback((newPerimeterId: string) => {
    selectPerimeter(newPerimeterId)
    localStorage.setItem('logwatcher_last_perimeter', newPerimeterId)
  }, [selectPerimeter])

  const handleSelectRoot = useCallback((rootName: string) => {
    if (!selectedPerimeterId) return
    loadRoot(selectedPerimeterId, rootName)
  }, [selectedPerimeterId, loadRoot])

  const handleSelectSubfolder = useCallback((item: RemoteFileInfoDto) => {
    if (!selectedPerimeterId || !selectedRootFolder) return
    const subpath = item.path
    loadSubfolder(selectedPerimeterId, selectedRootFolder, subpath)
  }, [selectedPerimeterId, selectedRootFolder, loadSubfolder])

  const handleEnterArchiveFolder = useCallback((folder: RemoteFileInfoDto) => {
    if (!selectedPerimeterId || !selectedRootFolder) return
    enterArchiveFolder(selectedPerimeterId, selectedRootFolder, folder)
  }, [selectedPerimeterId, selectedRootFolder, enterArchiveFolder])

  const handleArchiveBreadcrumbClick = useCallback((index: number) => {
    if (!selectedPerimeterId || !selectedRootFolder) return
    goToArchiveBreadcrumb(selectedPerimeterId, selectedRootFolder, index)
  }, [selectedPerimeterId, selectedRootFolder, goToArchiveBreadcrumb])

  const handleOpenFile = useCallback(async (file: RemoteFileInfoDto) => {
    if (!selectedPerimeterId || !selectedRootFolder) return

    const perimeter = perimeters.find(p => p.id === selectedPerimeterId)
    const rootFolder = perimeter?.rootFolders.find(r => r.name === selectedRootFolder)
    const server = rootFolder?.servers.find(s => s.id === file.serverId)
      ?? rootFolder?.servers[0]
    if (!server) return

    const existingTab = tabs.find(tab => tab.serverId === server.id && tab.filePath === file.path)
    if (existingTab) {
      const shouldOpenAnother = window.confirm(`'${basename(file.path)}' is already open. Open another tab?`)
      if (!shouldOpenAnother) {
        setActive(existingTab.sessionId)
        return
      }
    }

    const hub = getLogHub()
    const sessionId = `${server.id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const matchedProfile = matchProfile(profiles, file.path)
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
      activeProfileName: matchedProfile?.name,
      environmentColor: rootFolder?.environmentColor,
    })
    try {
      await startLogHub()
      await hub.invoke('OpenLog', sessionId, server.id, file.path, {
        loadFromEnd: true,
        initialLines: 500,
        profileName: matchedProfile?.name,
        encoding: matchedProfile?.encoding,
      })
      if (matchedProfile?.name) {
        await hub.invoke('SetProfile', sessionId, matchedProfile.name)
      }
    } catch (e) {
      removeTab(sessionId)
      console.error('Failed to open log session', e)
    }
  }, [selectedPerimeterId, selectedRootFolder, perimeters, profiles, tabs, addTab, removeTab, setActive])

  const handleEnterArchive = useCallback(async (file: RemoteFileInfoDto) => {
    if (!selectedPerimeterId || !selectedRootFolder) return
    const onlyFile = await enterArchive(selectedPerimeterId, selectedRootFolder, file)
    if (onlyFile) handleOpenFile(onlyFile)
  }, [selectedPerimeterId, selectedRootFolder, enterArchive, handleOpenFile])

  const handleSearchAndClose = useCallback(() => {
    if (!selectedPerimeterId || !selectedRootFolder) return
    openSearchResultsTab(selectedPerimeterId, selectedRootFolder, selectedSubfolder)
    setShowSearchPopup(false)
  }, [selectedPerimeterId, selectedRootFolder, selectedSubfolder, openSearchResultsTab])

  const virtualRootFolder: RemoteFileInfoDto | null = rootFilesFolderPath && rootFiles.length > 0
    ? {
        path: rootFilesFolderPath,
        isDirectory: true,
        sizeBytes: 0,
        lastModified: rootFiles[0]?.lastModified ?? new Date().toISOString(),
        serverId: rootFiles[0]?.serverId ?? '',
        hasChildren: true,
      }
    : null

  const displayedSubfolders = virtualRootFolder ? [virtualRootFolder, ...subfolders] : subfolders

  const filteredSubfolders = displayedSubfolders.filter(f =>
    basename(f.path).toLowerCase().includes(subfoldersFilter.toLowerCase())
  )

  // Detect basenames that appear more than once so we can show a disambiguation hint.
  const subfoldersBasenameCounts = displayedSubfolders.reduce<Record<string, number>>((acc, f) => {
    const name = basename(f.path)
    acc[name] = (acc[name] ?? 0) + 1
    return acc
  }, {})

  // Determine which file list to display
  const baseFiles = files
    .filter(f => !matchedSearchFiles || matchedSearchFiles.includes(f.path))
    .filter(f => basename(f.path).toLowerCase().includes(filesFilter.toLowerCase()))
  const displayedFiles = showCurrentOnly ? baseFiles.filter(f => !isRolledFile(f.path)) : baseFiles

  return (
    <div className="browser-shell">
      <div className="browser-toolbar">
        <span className="section-label">LogBrowser</span>
        <button className="control-button control-button--ghost browser-toolbar__button" onClick={onOpenSettings} title="LogBrowser settings">
          <span aria-hidden>⚙</span>
        </button>
      </div>
      <div className="browser-content-split">
        <Group orientation="vertical" style={{ height: '100%' }}>
          <Panel defaultSize={40} minSize={24}>
            <div className="browser-columns">
              <div className="browser-column browser-column--roots">
                <div className="browser-stack-list">
                  <div className="browser-stack-block">
                    <div className="section-label">Perimeter</div>
                    <div className="browser-list browser-list--uniform">
                      {perimeters.length === 0 && (
                        <div className="empty-state compact-empty-state browser-empty-state">No perimeter available.</div>
                      )}
                      {perimeters.map(perimeter => (
                        <button
                          key={perimeter.id}
                          onClick={() => handlePerimeterChange(perimeter.id)}
                          className={`browser-item browser-item--block ${selectedPerimeterId === perimeter.id ? 'browser-item--active' : ''}`}
                          title={perimeter.name}
                        >
                          <span className="browser-item-title">{perimeter.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="browser-stack-block browser-stack-block--fill">
                    <div className="section-label">Environment</div>
                    <div className="browser-list browser-list--uniform">
                      {selectedPerimeter?.rootFolders.map(root => (
                        <button
                          key={root.name}
                          onClick={() => handleSelectRoot(root.name)}
                          className={`browser-item browser-item--block ${selectedRootFolder === root.name ? 'browser-item--active' : ''}`}
                          title={root.name}
                        >
                          <span className="browser-item-title">{root.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="browser-column browser-column--folders">
                <div className="section-label">Folders</div>
                <div className="browser-filter-row">
                  <input
                    className="control-input browser-inline-filter"
                    placeholder="Filter folders…"
                    value={subfoldersFilter}
                    onChange={e => setSubfoldersFilter(e.target.value)}
                  />
                </div>
                <div className="browser-list browser-list--uniform">
                  {isLoadingSubfolders && (
                    <div className="empty-state compact-empty-state browser-empty-state">Loading folders…</div>
                  )}
                  {filteredSubfolders.map(f => {
                    const name = basename(f.path)
                    const isDuplicate = (subfoldersBasenameCounts[name] ?? 0) > 1
                    const parentName = basename(f.path.replace(/[/\\][^/\\]+$/, ''))
                    const hint = isDuplicate ? (f.sourceName || parentName || null) : null
                    return (
                      <button
                        key={`${f.serverId}:${f.path}`}
                        onClick={() => handleSelectSubfolder(f)}
                        className={`browser-item browser-item--block ${selectedSubfolder === f.path ? 'browser-item--active' : ''}`}
                        title={f.path}
                      >
                        <span className="browser-item-title">{name}</span>
                        {hint && (
                          <span style={{ color: 'var(--color-text-muted, #888)', marginLeft: '0.4em', fontSize: '0.85em' }}>
                            ({hint})
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </Panel>

          <Separator className="browser-split-separator" />

          <Panel defaultSize={60} minSize={28}>
            <div className="browser-files surface-panel">
              <div className="browser-files-header">
                <div>
                  <div className="section-label">
                    Files
                    {matchedSearchFiles && (
                      <>
                        <span className="browser-search-badge">{matchedSearchFiles.length} matched</span>
                        <button
                          className="browser-clear-results-btn"
                          onClick={clearMatchedSearchFiles}
                          title="Clear search results filter"
                          aria-label="Clear search results filter"
                        >✕</button>
                      </>
                    )}
                  </div>
                  <div className="section-subtitle">Double-click to open</div>
                </div>
                <div className="browser-files-filter-row">
                  <div className="browser-files-filter-wrap">
                    <input
                      className="control-input browser-files-filter"
                      placeholder="Filter by name…"
                      value={filesFilter}
                      onChange={e => { setFilesFilter(e.target.value); clearMatchedSearchFiles() }}
                    />
                    {filesFilter && (
                      <button
                        className="browser-files-filter-clear"
                        onClick={() => { setFilesFilter(''); clearMatchedSearchFiles() }}
                        title="Clear filter"
                        aria-label="Clear filter"
                      >×</button>
                    )}
                  </div>
                  <div className="browser-search-popup-anchor">
                    <button
                      className={`control-button ${showSearchPopup || matchedSearchFiles ? 'control-button--primary' : 'control-button--ghost'} browser-search-toggle`}
                      title="Search in file contents"
                      onClick={() => setShowSearchPopup(v => !v)}
                    >⌕</button>
                    {showSearchPopup && (
                      <>
                        <div className="browser-search-backdrop" onClick={() => setShowSearchPopup(false)} />
                        <div className="browser-search-popup">
                          <div className="browser-search-popup-header">
                            <span>Search in file contents</span>
                            <button className="control-button control-button--ghost browser-search-popup-close" onClick={() => setShowSearchPopup(false)}>✕</button>
                          </div>
                          <div className="browser-search-popup-body">
                            <input
                              className="control-input"
                              placeholder="Content pattern…"
                              value={contentFilter}
                              autoFocus
                              onChange={e => setContentFilter(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSearchAndClose()}
                            />
                            <div className="browser-search-popup-row">
                              <label className="settings-inline-check">
                                <input type="checkbox" checked={contentFilterIsRegex} onChange={e => setContentFilterIsRegex(e.target.checked)} />
                                Regex
                              </label>
                              <button
                                className="control-button control-button--primary"
                                onClick={handleSearchAndClose}
                                disabled={!contentFilter.trim() || !selectedRootFolder}
                              >
                                Search
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {archiveBreadcrumb.length > 0 && (
                <div className="browser-archive-breadcrumb">
                  <button className="browser-archive-crumb" onClick={exitArchive} title="Exit archive">⤺ Files</button>
                  {archiveBreadcrumb.map((crumb, i) => (
                    <span key={crumb.path}>
                      <span className="browser-archive-sep">/</span>
                      <button className="browser-archive-crumb" onClick={() => handleArchiveBreadcrumbClick(i)}>{crumb.label}</button>
                    </span>
                  ))}
                </div>
              )}

              <div className="browser-file-list browser-file-list--uniform">
                {archiveBreadcrumb.length > 0 ? (
                  <>
                    {isLoadingArchive && (
                      <div className="empty-state compact-empty-state browser-empty-state">Loading archive…</div>
                    )}
                    {archiveEntries.map(f => {
                      const name = basename(f.path)
                      const modTime = formatTime(f.lastModified)
                      return (
                        <button
                          key={f.path}
                          onDoubleClick={() => f.isDirectory ? handleEnterArchiveFolder(f) : handleOpenFile(f)}
                          className="browser-file-row browser-file-row--uniform"
                          title={`Double-click to ${f.isDirectory ? 'open folder' : 'open file'}:\n${f.path}`}
                        >
                          <span className="browser-item-title">{f.isDirectory ? '📁 ' : ''}{name}</span>
                          {!f.isDirectory && modTime && <span className="browser-file-time">{modTime}</span>}
                        </button>
                      )
                    })}
                  </>
                ) : (
                  <>
                    {isLoadingFiles && (
                      <div className="empty-state compact-empty-state browser-empty-state">Loading files…</div>
                    )}
                    {displayedFiles.map(f => {
                      const name = basename(f.path)
                      const rolled = isRolledFile(f.path)
                      const modTime = formatTime(f.lastModified)
                      return (
                        <button
                          key={f.path}
                          onDoubleClick={() => f.isArchive ? handleEnterArchive(f) : handleOpenFile(f)}
                          className={`browser-file-row browser-file-row--uniform ${rolled ? 'browser-file-row--rolled' : ''}`}
                          title={`Double-click to open:\n${f.path}`}
                        >
                          <span className="browser-item-title">{f.isArchive ? '🗜 ' : ''}{name}</span>
                          {modTime && <span className="browser-file-time">{modTime}</span>}
                        </button>
                      )
                    })}
                  </>
                )}
              </div>
              <div className="browser-files-footer">
                <label className="settings-inline-check">
                  <input type="checkbox" checked={showCurrentOnly} onChange={e => setShowCurrentOnly(e.target.checked)} />
                  Current files only
                </label>
              </div>
            </div>
          </Panel>
        </Group>
      </div>
    </div>
  )
}
