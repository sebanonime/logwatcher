/** Types exposed from the Electron preload script via contextBridge. */

export interface LocalFileInfo {
  path: string
  sizeBytes: number
  totalLines: number
  lastModified: string
}

export interface DesktopConfig {
  serverUrl: string
  sidecarEnabled: boolean
  windowBounds?: { x?: number; y?: number; width?: number; height?: number }
  sidecarPort?: number
}

export interface ElectronAPI {
  // Synchronously available at load time
  initialServerUrl: string
  isSidecarEnabled: boolean
  initialSidecarPort: number | null

  // Async config
  getConfig: () => Promise<DesktopConfig>
  setConfig: (patch: Partial<DesktopConfig>) => Promise<DesktopConfig>

  // Local user prefs
  getLocalPrefs: () => Promise<{ theme: string; fontFamily: string; fontSize: number }>
  setLocalPrefs: (patch: Record<string, unknown>) => Promise<void>

  // File dialog
  openFileDialog: () => Promise<string | null>
  getPathForFile: (file: File) => string

  // Local file operations
  getLocalFileInfo: (path: string) => Promise<LocalFileInfo>
  readLocalFile: (
    path: string,
    startLine: number,
    count: number
  ) => Promise<Array<{ lineNumber: number; text: string }>>
  watchLocalFile: (path: string) => Promise<void>
  unwatchLocalFile: (path: string) => Promise<void>
  onLocalFileNewLines: (
    callback: (path: string, lines: string[]) => void
  ) => () => void

  // Sidecar
  getSidecarPort: () => Promise<number | null>
  isSidecarRunning: () => Promise<boolean>
  startSidecar: () => Promise<number>
  stopSidecar: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
