import { create } from 'zustand'
import type { RemoteFileInfoDto } from '../types'
import { getLogHub } from '../signalr/logHubConnection'

interface BrowserState {
  selectedRootFolder: string | null
  subfolders: RemoteFileInfoDto[]   // directories inside the root
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
  subfoldersFilter: '',
  selectedSubfolder: null,
  files: [],
  filesFilter: '',
  isLoadingSubfolders: false,
  isLoadingFiles: false,

  loadRoot: async (perimeterId, rootFolderName) => {
    set({ selectedRootFolder: rootFolderName, isLoadingSubfolders: true, subfolders: [], selectedSubfolder: null, files: [] })
    try {
      const hub = getLogHub()
      const items: RemoteFileInfoDto[] = await hub.invoke('BrowseRoot', perimeterId, rootFolderName, '')
      set({ subfolders: items.filter(i => i.isDirectory) })
    } catch { /* ignore */ }
    finally { set({ isLoadingSubfolders: false }) }
  },

  loadSubfolder: async (perimeterId, rootFolderName, subfolderPath) => {
    set({ selectedSubfolder: subfolderPath, isLoadingFiles: true, files: [] })
    try {
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
    selectedSubfolder: null, files: [], filesFilter: '',
  }),
}))
