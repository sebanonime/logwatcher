import { create } from 'zustand'
import type { RemoteFileInfoDto } from '../types'
import { getLogHub } from '../signalr/logHubConnection'
import { startLogHub } from '../signalr/logHubConnection'

interface BrowserState {
  selectedRootFolder: string | null
  subfolders: RemoteFileInfoDto[]   // directories inside the root
  rootFiles: RemoteFileInfoDto[]    // files directly inside the root path
  rootFilesFolderPath: string | null
  subfoldersFilter: string
  selectedSubfolder: string | null
  files: RemoteFileInfoDto[]        // files inside the selected subfolder
  filesFilter: string

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

  contentFilter: '',
  contentFilterIsRegex: false,
  isSearchingContent: false,
  searchProgress: null,
  contentSearchResults: null,

  isLoadingSubfolders: false,
  isLoadingFiles: false,

  loadRoot: async (perimeterId, rootFolderName) => {
    set({ selectedRootFolder: rootFolderName, isLoadingSubfolders: true, subfolders: [], rootFiles: [], rootFilesFolderPath: null, selectedSubfolder: null, files: [], contentSearchResults: null })
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
    contentFilter: '', contentFilterIsRegex: false, isSearchingContent: false, searchProgress: null, contentSearchResults: null,
  }),
}))
