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
  isLoadingSubfolders: boolean
  isLoadingFiles: boolean

  loadRoot: (perimeterId: string, rootFolderName: string) => Promise<void>
  loadSubfolder: (perimeterId: string, rootFolderName: string, subfolderPath: string) => Promise<void>
  setSubfoldersFilter: (f: string) => void
  setFilesFilter: (f: string) => void
  reset: () => void
}

export const useBrowserStore = create<BrowserState>((set) => ({
  
  selectedRootFolder: null,
  subfolders: [],
  rootFiles: [],
  rootFilesFolderPath: null,
  subfoldersFilter: '',
  selectedSubfolder: null,
  files: [],
  filesFilter: '',
  isLoadingSubfolders: false,
  isLoadingFiles: false,

  loadRoot: async (perimeterId, rootFolderName) => {
    set({ selectedRootFolder: rootFolderName, isLoadingSubfolders: true, subfolders: [], rootFiles: [], rootFilesFolderPath: null, selectedSubfolder: null, files: [] })
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
        // If root contains files directly, expose them immediately.
        selectedSubfolder: parentDir,
        files: directFiles,
      })
    } catch { /* ignore */ }
    finally { set({ isLoadingSubfolders: false }) }
  },

  loadSubfolder: async (perimeterId, rootFolderName, subfolderPath) => {
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

  setSubfoldersFilter: (f) => set({ subfoldersFilter: f }),
  setFilesFilter: (f) => set({ filesFilter: f }),
  reset: () => set({
    selectedRootFolder: null, subfolders: [], subfoldersFilter: '',
    rootFiles: [], rootFilesFolderPath: null, selectedSubfolder: null, files: [], filesFilter: '',
  }),
}))
