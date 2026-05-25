"use strict";
const electron = require("electron");
const initialConfig = electron.ipcRenderer.sendSync("config:getSync");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  /** The server URL already known at load time (no round-trip needed). */
  initialServerUrl: initialConfig.serverUrl,
  isSidecarEnabled: initialConfig.sidecarEnabled,
  initialSidecarPort: initialConfig.sidecarPort ?? null,
  // ── Config ──────────────────────────────────────────────────────────────
  getConfig: () => electron.ipcRenderer.invoke("config:get"),
  setConfig: (patch) => electron.ipcRenderer.invoke("config:set", patch),
  // ── Local user preferences (theme, font…) ───────────────────────────────
  getLocalPrefs: () => electron.ipcRenderer.invoke("prefs:get"),
  setLocalPrefs: (patch) => electron.ipcRenderer.invoke("prefs:set", patch),
  // ── File dialog ─────────────────────────────────────────────────────────
  openFileDialog: () => electron.ipcRenderer.invoke("dialog:openFile"),
  // Replaces the deprecated File.path property (removed in Electron 32+)
  getPathForFile: (file) => electron.webUtils.getPathForFile(file),
  // ── Local file operations ────────────────────────────────────────────────
  getLocalFileInfo: (path) => electron.ipcRenderer.invoke("localFile:info", path),
  readLocalFile: (path, startLine, count) => electron.ipcRenderer.invoke("localFile:read", path, startLine, count),
  watchLocalFile: (path) => electron.ipcRenderer.invoke("localFile:watch", path),
  unwatchLocalFile: (path) => electron.ipcRenderer.invoke("localFile:unwatch", path),
  /** Subscribe to file append events. Returns an unsubscribe function. */
  onLocalFileNewLines: (callback) => {
    const handler = (_event, path, lines) => callback(path, lines);
    electron.ipcRenderer.on("localFile:newLines", handler);
    return () => electron.ipcRenderer.removeListener("localFile:newLines", handler);
  },
  // ── Sidecar ──────────────────────────────────────────────────────────────
  getSidecarPort: () => electron.ipcRenderer.invoke("sidecar:getPort"),
  isSidecarRunning: () => electron.ipcRenderer.invoke("sidecar:isRunning"),
  startSidecar: () => electron.ipcRenderer.invoke("sidecar:start"),
  stopSidecar: () => electron.ipcRenderer.invoke("sidecar:stop")
});
