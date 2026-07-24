import { create } from 'zustand'
import type { RemoteFileInfoDto } from '../types'
import { getLogHub } from '../signalr/logHubConnection'
import { startLogHub } from '../signalr/logHubConnection'

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

  // Content search
  contentFilter: string
  contentFilterIsRegex: boolean
  isSearchingContent: boolean
  searchProgress: { scanned: number; total: number } | null
  contentSearchResults: RemoteFileInfoDto[] | null  // null = no search active

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
  searchContent: (perimeterId: string, rootFolderName: string, subfolderPath: string | null) => Promise<void>
  clearContentSearch: () => void
  clearSearchResults: () => void
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
  isSearchingContent: false,
  searchProgress: null,
  contentSearchResults: null,

  isLoadingSubfolders: false,
  isLoadingFiles: false,

  loadRoot: async (perimeterId, rootFolderName) => {
    set({ selectedRootFolder: rootFolderName, isLoadingSubfolders: true, subfolders: [], rootFiles: [], rootFilesFolderPath: null, selectedSubfolder: null, files: [], contentSearchResults: null, archiveBreadcrumb: [], archiveEntries: [] })
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
    set({ archiveBreadcrumb: [], archiveEntries: [] })
    if (subfolderPath === rootFolderName) {
      set(state => ({ selectedSubfolder: state.rootFilesFolderPath ?? subfolderPath, files: state.rootFiles, isLoadingFiles: false, contentSearchResults: null }))
      return
    }

    if (subfolderPath && subfolderPath === (useBrowserStore.getState().rootFilesFolderPath ?? '')) {
      set(state => ({ selectedSubfolder: subfolderPath, files: state.rootFiles, isLoadingFiles: false, contentSearchResults: null }))
      return
    }

    set({ selectedSubfolder: subfolderPath, isLoadingFiles: true, files: [], contentSearchResults: null })
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

  searchContent: async (perimeterId, rootFolderName, subfolderPath) => {
    const { contentFilter, contentFilterIsRegex, filesFilter } = get()
    if (!contentFilter.trim()) return

    set({ isSearchingContent: true, searchProgress: { scanned: 0, total: 0 }, contentSearchResults: null })

    await startLogHub()
    const hub = getLogHub()

    const progressHandler = (scanned: number, total: number) => {
      set({ searchProgress: { scanned, total } })
    }
    hub.on('OnSearchProgress', progressHandler)

    try {
      const results: RemoteFileInfoDto[] = await hub.invoke(
        'SearchFileContent',
        perimeterId,
        rootFolderName,
        subfolderPath ?? '',
        filesFilter,
        contentFilter,
        contentFilterIsRegex,
      )
      set({ contentSearchResults: results })
    } catch { /* ignore */ }
    finally {
      hub.off('OnSearchProgress', progressHandler)
      set({ isSearchingContent: false, searchProgress: null })
    }
  },

  clearContentSearch: () => set({ contentSearchResults: null, contentFilter: '', searchProgress: null }),
  clearSearchResults: () => set({ contentSearchResults: null }),

  reset: () => set({
    selectedRootFolder: null, subfolders: [], subfoldersFilter: '',
    rootFiles: [], rootFilesFolderPath: null, selectedSubfolder: null, files: [], filesFilter: '',
    archiveBreadcrumb: [], archiveEntries: [],
    contentFilter: '', contentFilterIsRegex: false, isSearchingContent: false, searchProgress: null, contentSearchResults: null,
  }),
}))
