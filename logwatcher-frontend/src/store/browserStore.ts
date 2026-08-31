import { create } from 'zustand'
import type { RemoteFileInfoDto } from '../types'
import { getLogHub } from '../signalr/logHubConnection'
import { startLogHub } from '../signalr/logHubConnection'
import { useTabStore } from './logStore'

function archiveBasename(path: string): string {
  return path.split(/[/\\]/).filter(Boolean).pop() ?? path
}

export interface ArchiveBreadcrumb {
  label: string
  path: string
}

interface BrowserState {
  selectedRootFolder: string | null
  subfolders: RemoteFileInfoDto[]   // directories inside the root
  rootFiles: RemoteFileInfoDto[]    // files directly inside the root path
  rootFilesFolderPath: string | null
  subfoldersFilter: string
  selectedSubfolder: string | null
  files: RemoteFileInfoDto[]        // files inside the selected subfolder
  filesFilter: string

  // Archive (zip/7z) drill-down within the Files panel
  archiveBreadcrumb: ArchiveBreadcrumb[]   // [] = not currently browsing an archive
  archiveEntries: RemoteFileInfoDto[]      // dirs + files at the current internal archive path
  isLoadingArchive: boolean

  // Content search (opens a static "search results" tab instead of listing matching files here)
  contentFilter: string
  contentFilterIsRegex: boolean
  // Paths of the files that matched the last content search; also used to narrow the Files list. null = no active filter.
  matchedSearchFiles: string[] | null

  isLoadingSubfolders: boolean
  isLoadingFiles: boolean

  loadRoot: (perimeterId: string, rootFolderName: string) => Promise<void>
  loadSubfolder: (perimeterId: string, rootFolderName: string, subfolderPath: string) => Promise<void>
  refreshFiles: (perimeterId: string, rootFolderName: string, subfolderPath: string) => Promise<void>
  enterArchive: (perimeterId: string, rootFolderName: string, file: RemoteFileInfoDto) => Promise<RemoteFileInfoDto | null>
  enterArchiveFolder: (perimeterId: string, rootFolderName: string, folder: RemoteFileInfoDto) => Promise<void>
  goToArchiveBreadcrumb: (perimeterId: string, rootFolderName: string, index: number) => Promise<void>
  exitArchive: () => void
  setSubfoldersFilter: (f: string) => void
  setFilesFilter: (f: string) => void
  setContentFilter: (f: string) => void
  setContentFilterIsRegex: (v: boolean) => void
  openSearchResultsTab: (perimeterId: string, rootFolderName: string, subfolderPath: string | null) => Promise<void>
  clearMatchedSearchFiles: () => void
  reset: () => void
}

export const useBrowserStore = create<BrowserState>((set, get) => ({

  selectedRootFolder: null,
  subfolders: [],
  rootFiles: [],
  rootFilesFolderPath: null,
  subfoldersFilter: '',
  selectedSubfolder: null,
  files: [],
  filesFilter: '',

  archiveBreadcrumb: [],
  archiveEntries: [],
  isLoadingArchive: false,

  contentFilter: '',
  contentFilterIsRegex: false,
  matchedSearchFiles: null,

  isLoadingSubfolders: false,
  isLoadingFiles: false,

  loadRoot: async (perimeterId, rootFolderName) => {
    set({ selectedRootFolder: rootFolderName, isLoadingSubfolders: true, subfolders: [], rootFiles: [], rootFilesFolderPath: null, selectedSubfolder: null, files: [], archiveBreadcrumb: [], archiveEntries: [], matchedSearchFiles: null })
    try {
      await startLogHub()
      const hub = getLogHub()
      const items: RemoteFileInfoDto[] = await hub.invoke('BrowseRoot', perimeterId, rootFolderName, '')
      const directories = items.filter(i => i.isDirectory)
      const directFiles = items.filter(i => !i.isDirectory)
      const parentDir = directFiles.length > 0
        ? directFiles[0].path.replace(/[\\/][^\\/]+$/, '')
        : null
      set({
        subfolders: directories,
        rootFiles: directFiles,
        rootFilesFolderPath: parentDir,
        selectedSubfolder: parentDir,
        files: directFiles,
      })
    } catch { /* ignore */ }
    finally { set({ isLoadingSubfolders: false }) }
  },

  loadSubfolder: async (perimeterId, rootFolderName, subfolderPath) => {
    set({ archiveBreadcrumb: [], archiveEntries: [], matchedSearchFiles: null })
    if (subfolderPath === rootFolderName) {
      set(state => ({ selectedSubfolder: state.rootFilesFolderPath ?? subfolderPath, files: state.rootFiles, isLoadingFiles: false }))
      return
    }

    if (subfolderPath && subfolderPath === (useBrowserStore.getState().rootFilesFolderPath ?? '')) {
      set(state => ({ selectedSubfolder: subfolderPath, files: state.rootFiles, isLoadingFiles: false }))
      return
    }

    set({ selectedSubfolder: subfolderPath, isLoadingFiles: true, files: [] })
    try {
      await startLogHub()
      const hub = getLogHub()
      const items: RemoteFileInfoDto[] = await hub.invoke('BrowseRoot', perimeterId, rootFolderName, subfolderPath)
      set({ files: items.filter(i => !i.isDirectory) })
    } catch { /* ignore */ }
    finally { set({ isLoadingFiles: false }) }
  },

  refreshFiles: async (perimeterId, rootFolderName, subfolderPath) => {
    try {
      await startLogHub()
      const hub = getLogHub()
      const items: RemoteFileInfoDto[] = await hub.invoke('BrowseRoot', perimeterId, rootFolderName, subfolderPath)
      set({ files: items.filter(i => !i.isDirectory) })
    } catch { /* ignore */ }
  },

  enterArchive: async (perimeterId, rootFolderName, file) => {
    set({ isLoadingArchive: true, archiveBreadcrumb: [{ label: archiveBasename(file.path), path: file.path }], archiveEntries: [] })
    try {
      await startLogHub()
      const hub = getLogHub()
      const items: RemoteFileInfoDto[] = await hub.invoke('BrowseRoot', perimeterId, rootFolderName, file.path)
      // If the archive contains a single file at its root (no subfolders), skip the listing and open it directly.
      if (items.length === 1 && !items[0].isDirectory) {
        set({ archiveBreadcrumb: [], archiveEntries: [], isLoadingArchive: false })
        return items[0]
      }
      set({ archiveEntries: items })
      return null
    } catch {
      return null
    }
    finally { set({ isLoadingArchive: false }) }
  },

  enterArchiveFolder: async (perimeterId, rootFolderName, folder) => {
    set(state => ({ isLoadingArchive: true, archiveBreadcrumb: [...state.archiveBreadcrumb, { label: archiveBasename(folder.path), path: folder.path }], archiveEntries: [] }))
    try {
      await startLogHub()
      const hub = getLogHub()
      const items: RemoteFileInfoDto[] = await hub.invoke('BrowseRoot', perimeterId, rootFolderName, folder.path)
      set({ archiveEntries: items })
    } catch { /* ignore */ }
    finally { set({ isLoadingArchive: false }) }
  },

  goToArchiveBreadcrumb: async (perimeterId, rootFolderName, index) => {
    const crumb = get().archiveBreadcrumb[index]
    if (!crumb) return
    set(state => ({ isLoadingArchive: true, archiveBreadcrumb: state.archiveBreadcrumb.slice(0, index + 1), archiveEntries: [] }))
    try {
      await startLogHub()
      const hub = getLogHub()
      const items: RemoteFileInfoDto[] = await hub.invoke('BrowseRoot', perimeterId, rootFolderName, crumb.path)
      set({ archiveEntries: items })
    } catch { /* ignore */ }
    finally { set({ isLoadingArchive: false }) }
  },

  exitArchive: () => set({ archiveBreadcrumb: [], archiveEntries: [] }),

  setSubfoldersFilter: (f) => set({ subfoldersFilter: f }),
  setFilesFilter: (f) => set({ filesFilter: f }),
  setContentFilter: (f) => set({ contentFilter: f }),
  setContentFilterIsRegex: (v) => set({ contentFilterIsRegex: v }),

  openSearchResultsTab: async (perimeterId, rootFolderName, subfolderPath) => {
    const { contentFilter, contentFilterIsRegex, filesFilter } = get()
    if (!contentFilter.trim()) return

    const sessionId = `search_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const displayName = `🔍 ${contentFilter}`

    useTabStore.getState().addTab({
      sessionId,
      serverId: '',
      filePath: '',
      displayName,
      serverName: rootFolderName,
      totalLines: 0,
      sizeBytes: 0,
      isIndexed: false,
      newLinesCount: 0,
      tailMode: false,
      isFiltered: false,
      isSearchResults: true,
    })

    try {
      await startLogHub()
      const hub = getLogHub()

      const onMatched = (resultSessionId: string, matchedPaths: string[]) => {
        if (resultSessionId !== sessionId) return
        set({ matchedSearchFiles: matchedPaths })
        hub.off('OnSearchFilesMatched', onMatched)
      }
      hub.on('OnSearchFilesMatched', onMatched)

      await hub.invoke(
        'OpenSearchResults',
        sessionId,
        perimeterId,
        rootFolderName,
        subfolderPath ?? '',
        filesFilter,
        contentFilter,
        contentFilterIsRegex,
      )
    } catch (e) {
      useTabStore.getState().removeTab(sessionId)
      console.error('Failed to open search results tab', e)
    }
  },

  clearMatchedSearchFiles: () => set({ matchedSearchFiles: null }),

  reset: () => set({
    selectedRootFolder: null, subfolders: [], subfoldersFilter: '',
    rootFiles: [], rootFilesFolderPath: null, selectedSubfolder: null, files: [], filesFilter: '',
    archiveBreadcrumb: [], archiveEntries: [],
    contentFilter: '', contentFilterIsRegex: false, matchedSearchFiles: null,
  }),
}))
