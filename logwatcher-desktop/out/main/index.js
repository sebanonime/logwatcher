"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const child_process = require("child_process");
const net = require("net");
class SidecarManager {
  proc = null;
  _port = null;
  getPort() {
    return this._port;
  }
  isRunning() {
    return this.proc !== null && this._port !== null;
  }
  async start() {
    if (this.proc) return this._port;
    const exePath = resolveSidecarExe();
    if (!exePath) {
      throw new Error(
        "LogWatcher.Web sidecar executable not found. Build the project in Release mode or run it manually."
      );
    }
    this._port = await findFreePort();
    this.proc = child_process.spawn(exePath, [`--urls=http://localhost:${this._port}`], {
      detached: false,
      stdio: "pipe",
      env: { ...process.env, ASPNETCORE_ENVIRONMENT: "Production" }
    });
    this.proc.stdout?.on("data", (d) => console.log("[sidecar]", d.toString()));
    this.proc.stderr?.on("data", (d) => console.error("[sidecar]", d.toString()));
    this.proc.on("exit", (code) => {
      console.log(`[sidecar] exited with code ${code}`);
      this.proc = null;
      this._port = null;
    });
    await waitForReady(this._port);
    console.log(`[sidecar] ready on port ${this._port}`);
    return this._port;
  }
  async stop() {
    if (this.proc) {
      this.proc.kill("SIGTERM");
      this.proc = null;
      this._port = null;
    }
  }
}
function resolveSidecarExe() {
  const candidates = [
    // Packaged app — extracted via electron-builder extraResources
    path.join(electron.app.getPath("exe"), "..", "resources", "sidecar", "LogWatcher.Web.exe"),
    // Development — Release publish output
    path.join(electron.app.getAppPath(), "..", "..", "LogWatcher.Web", "bin", "Release", "net8.0", "win-x64", "publish", "LogWatcher.Web.exe"),
    // Development — Debug build
    path.join(electron.app.getAppPath(), "..", "..", "LogWatcher.Web", "bin", "Debug", "net8.0", "LogWatcher.Web.exe")
  ];
  return candidates.find(fs.existsSync) ?? null;
}
async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      server.close(() => {
        if (addr && typeof addr === "object") {
          resolve(addr.port);
        } else {
          reject(new Error("Could not determine a free port"));
        }
      });
    });
  });
}
async function waitForReady(port, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const resp = await fetch(`http://localhost:${port}/health`);
      if (resp.ok || resp.status < 500) return;
    } catch {
    }
    await new Promise((r) => setTimeout(r, 1e3));
  }
  throw new Error(`Sidecar did not become ready within ${maxAttempts} seconds`);
}
const defaultConfig = {
  serverUrl: "",
  sidecarEnabled: false
};
const defaultLocalPrefs = {
  theme: "dark",
  fontFamily: "Cascadia Code",
  fontSize: 13
};
function configPath() {
  return path.join(electron.app.getPath("userData"), "desktop-config.json");
}
function prefsPath() {
  return path.join(electron.app.getPath("userData"), "local-prefs.json");
}
function readConfig() {
  try {
    if (fs.existsSync(configPath())) {
      return { ...defaultConfig, ...JSON.parse(fs.readFileSync(configPath(), "utf-8")) };
    }
  } catch {
  }
  return { ...defaultConfig };
}
function writeConfig(config) {
  fs.writeFileSync(configPath(), JSON.stringify(config, null, 2), "utf-8");
}
function readLocalPrefs() {
  try {
    if (fs.existsSync(prefsPath())) {
      return { ...defaultLocalPrefs, ...JSON.parse(fs.readFileSync(prefsPath(), "utf-8")) };
    }
  } catch {
  }
  return { ...defaultLocalPrefs };
}
function writeLocalPrefs(prefs) {
  fs.writeFileSync(prefsPath(), JSON.stringify(prefs, null, 2), "utf-8");
}
let mainWindow = null;
const sidecar = new SidecarManager();
function createWindow() {
  const cfg = readConfig();
  const bounds = cfg.windowBounds ?? {};
  mainWindow = new electron.BrowserWindow({
    width: bounds.width ?? 1440,
    height: bounds.height ?? 920,
    x: bounds.x,
    y: bounds.y,
    minWidth: 900,
    minHeight: 600,
    title: "LogWatcher Desktop",
    backgroundColor: "#07111f",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // Disable web security so the renderer can call the user-configured remote
      // backend without CORS preflight issues. The renderer only loads our own app.
      webSecurity: false
    }
  });
  mainWindow.on("close", () => {
    if (mainWindow) {
      const b = mainWindow.getBounds();
      writeConfig({ ...readConfig(), windowBounds: b });
    }
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    electron.shell.openExternal(url);
    return { action: "deny" };
  });
  if (process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(async () => {
  electron.session.defaultSession.setCertificateVerifyProc((_request, callback) => {
    callback(0);
  });
  registerIpcHandlers();
  const cfg = readConfig();
  if (cfg.sidecarEnabled) {
    try {
      const port = await sidecar.start();
      writeConfig({ ...readConfig(), sidecarPort: port });
    } catch (err) {
      console.error("[main] Failed to start sidecar:", err);
    }
  }
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", async () => {
  await sidecar.stop();
  if (process.platform !== "darwin") electron.app.quit();
});
const fileWatchers = /* @__PURE__ */ new Map();
function registerIpcHandlers() {
  electron.ipcMain.on("config:getSync", (event) => {
    event.returnValue = readConfig();
  });
  electron.ipcMain.handle("config:get", () => readConfig());
  electron.ipcMain.handle("config:set", (_e, patch) => {
    const next = { ...readConfig(), ...patch };
    writeConfig(next);
    return next;
  });
  electron.ipcMain.handle("prefs:get", () => readLocalPrefs());
  electron.ipcMain.handle("prefs:set", (_e, patch) => {
    const next = { ...readLocalPrefs(), ...patch };
    writeLocalPrefs(next);
    return next;
  });
  electron.ipcMain.handle("dialog:openFile", async () => {
    const result = await electron.dialog.showOpenDialog({
      title: "Open log file",
      filters: [
        { name: "Log / Text files", extensions: ["log", "txt", "out", "err", "*"] }
      ],
      properties: ["openFile"]
    });
    return result.canceled ? null : result.filePaths[0] ?? null;
  });
  electron.ipcMain.handle("localFile:info", async (_e, filePath) => {
    const stat = fs.statSync(filePath);
    let totalLines = 0;
    await new Promise((resolve, reject) => {
      const rl = readline.createInterface({ input: fs.createReadStream(filePath) });
      rl.on("line", () => totalLines++);
      rl.on("close", resolve);
      rl.on("error", reject);
    });
    return {
      path: filePath,
      sizeBytes: stat.size,
      totalLines,
      lastModified: stat.mtime.toISOString()
    };
  });
  electron.ipcMain.handle(
    "localFile:read",
    async (_e, filePath, startLine, count) => {
      const lines = [];
      let current = 0;
      await new Promise((resolve, reject) => {
        const rl = readline.createInterface({ input: fs.createReadStream(filePath) });
        rl.on("line", (text) => {
          if (current >= startLine && current < startLine + count) {
            lines.push({ lineNumber: current, text });
          }
          if (current >= startLine + count) rl.close();
          current++;
        });
        rl.on("close", resolve);
        rl.on("error", reject);
      });
      return lines;
    }
  );
  electron.ipcMain.handle("localFile:watch", (_e, filePath) => {
    if (fileWatchers.has(filePath)) return;
    let lastSize = 0;
    try {
      lastSize = fs.statSync(filePath).size;
    } catch {
    }
    const timer = setInterval(async () => {
      try {
        const stat = fs.statSync(filePath);
        if (stat.size <= lastSize) return;
        const newLines = [];
        await new Promise((resolve) => {
          const stream = fs.createReadStream(filePath, { start: lastSize });
          const rl = readline.createInterface({ input: stream });
          rl.on("line", (l) => newLines.push(l));
          rl.on("close", resolve);
        });
        lastSize = stat.size;
        const entry = fileWatchers.get(filePath);
        if (entry) entry.lastSize = lastSize;
        if (mainWindow && newLines.length > 0) {
          mainWindow.webContents.send("localFile:newLines", filePath, newLines);
        }
      } catch {
      }
    }, 500);
    fileWatchers.set(filePath, { lastSize, timer });
  });
  electron.ipcMain.handle("localFile:unwatch", (_e, filePath) => {
    const entry = fileWatchers.get(filePath);
    if (entry) {
      clearInterval(entry.timer);
      fileWatchers.delete(filePath);
    }
  });
  electron.ipcMain.handle("sidecar:getPort", () => sidecar.getPort());
  electron.ipcMain.handle("sidecar:isRunning", () => sidecar.isRunning());
  electron.ipcMain.handle("sidecar:start", async () => {
    const port = await sidecar.start();
    writeConfig({ ...readConfig(), sidecarPort: port, sidecarEnabled: true });
    return port;
  });
  electron.ipcMain.handle("sidecar:stop", async () => {
    await sidecar.stop();
    writeConfig({ ...readConfig(), sidecarEnabled: false, sidecarPort: void 0 });
  });
}
