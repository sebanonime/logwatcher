import { contextBridge, ipcRenderer, webUtils } from 'electron'

// ─── Synchronous initial config (used for fetch intercept before React loads) ─
const initialConfig = ipcRenderer.sendSync('config:getSync') as {
  serverUrl: string
  sidecarEnabled: boolean
  sidecarPort?: number
}

// ─── Expose API to renderer ───────────────────────────────────────────────────
contextBridge.exposeInMainWorld('electronAPI', {
  /** The server URL already known at load time (no round-trip needed). */
  initialServerUrl: initialConfig.serverUrl,
  isSidecarEnabled: initialConfig.sidecarEnabled,
  initialSidecarPort: initialConfig.sidecarPort ?? null,

  // ── Config ──────────────────────────────────────────────────────────────
  getConfig: (): Promise<unknown> => ipcRenderer.invoke('config:get'),
  setConfig: (patch: Record<string, unknown>): Promise<unknown> =>
    ipcRenderer.invoke('config:set', patch),

  // ── Local user preferences (theme, font…) ───────────────────────────────
  getLocalPrefs: (): Promise<unknown> => ipcRenderer.invoke('prefs:get'),
  setLocalPrefs: (patch: Record<string, unknown>): Promise<unknown> =>
    ipcRenderer.invoke('prefs:set', patch),

  // ── File dialog ─────────────────────────────────────────────────────────
  openFileDialog: (): Promise<string | null> => ipcRenderer.invoke('dialog:openFile'),

  // Replaces the deprecated File.path property (removed in Electron 32+)
  getPathForFile: (file: File): string => webUtils.getPathForFile(file),

  // ── Local file operations ────────────────────────────────────────────────
  getLocalFileInfo: (
    path: string
  ): Promise<{ path: string; sizeBytes: number; totalLines: number; lastModified: string }> =>
    ipcRenderer.invoke('localFile:info', path),

  readLocalFile: (
    path: string,
    startLine: number,
    count: number
  ): Promise<Array<{ lineNumber: number; text: string }>> =>
    ipcRenderer.invoke('localFile:read', path, startLine, count),

  watchLocalFile: (path: string): Promise<void> =>
    ipcRenderer.invoke('localFile:watch', path),

  unwatchLocalFile: (path: string): Promise<void> =>
    ipcRenderer.invoke('localFile:unwatch', path),

  /** Subscribe to file append events. Returns an unsubscribe function. */
  onLocalFileNewLines: (
    callback: (path: string, lines: string[]) => void
  ): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, path: string, lines: string[]) =>
      callback(path, lines)
    ipcRenderer.on('localFile:newLines', handler)
    return () => ipcRenderer.removeListener('localFile:newLines', handler)
  },

  // ── Sidecar ──────────────────────────────────────────────────────────────
  getSidecarPort: (): Promise<number | null> => ipcRenderer.invoke('sidecar:getPort'),
  isSidecarRunning: (): Promise<boolean> => ipcRenderer.invoke('sidecar:isRunning'),
  startSidecar: (): Promise<number> => ipcRenderer.invoke('sidecar:start'),
  stopSidecar: (): Promise<void> => ipcRenderer.invoke('sidecar:stop'),
})
