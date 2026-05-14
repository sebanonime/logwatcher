import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  shell,
  session,
  Rectangle,
} from 'electron'
import { join } from 'path'
import {
  existsSync,
  readFileSync,
  writeFileSync,
  statSync,
  createReadStream,
} from 'fs'
import { createInterface } from 'readline'
import { SidecarManager } from './sidecar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DesktopConfig {
  serverUrl: string
  sidecarEnabled: boolean
  windowBounds?: Partial<Rectangle>
  sidecarPort?: number
}

interface LocalPrefs {
  theme: 'dark' | 'light'
  fontFamily: string
  fontSize: number
}

interface LocalFileInfo {
  path: string
  sizeBytes: number
  totalLines: number
  lastModified: string
}

// ─── Persistence helpers ──────────────────────────────────────────────────────

const defaultConfig: DesktopConfig = {
  serverUrl: '',
  sidecarEnabled: false,
}

const defaultLocalPrefs: LocalPrefs = {
  theme: 'dark',
  fontFamily: 'Cascadia Code',
  fontSize: 13,
}

function configPath(): string {
  return join(app.getPath('userData'), 'desktop-config.json')
}

function prefsPath(): string {
  return join(app.getPath('userData'), 'local-prefs.json')
}

function readConfig(): DesktopConfig {
  try {
    if (existsSync(configPath())) {
      return { ...defaultConfig, ...JSON.parse(readFileSync(configPath(), 'utf-8')) }
    }
  } catch { /* ignore */ }
  return { ...defaultConfig }
}

function writeConfig(config: DesktopConfig): void {
  writeFileSync(configPath(), JSON.stringify(config, null, 2), 'utf-8')
}

function readLocalPrefs(): LocalPrefs {
  try {
    if (existsSync(prefsPath())) {
      return { ...defaultLocalPrefs, ...JSON.parse(readFileSync(prefsPath(), 'utf-8')) }
    }
  } catch { /* ignore */ }
  return { ...defaultLocalPrefs }
}

function writeLocalPrefs(prefs: LocalPrefs): void {
  writeFileSync(prefsPath(), JSON.stringify(prefs, null, 2), 'utf-8')
}

// ─── Window ───────────────────────────────────────────────────────────────────

let mainWindow: BrowserWindow | null = null
const sidecar = new SidecarManager()

function createWindow(): void {
  const cfg = readConfig()
  const bounds = cfg.windowBounds ?? {}

  mainWindow = new BrowserWindow({
    width: (bounds.width as number | undefined) ?? 1440,
    height: (bounds.height as number | undefined) ?? 920,
    x: bounds.x as number | undefined,
    y: bounds.y as number | undefined,
    minWidth: 900,
    minHeight: 600,
    title: 'LogWatcher Desktop',
    backgroundColor: '#07111f',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // Disable web security so the renderer can call the user-configured remote
      // backend without CORS preflight issues. The renderer only loads our own app.
      webSecurity: false,
    },
  })

  // Persist window bounds on close
  mainWindow.on('close', () => {
    if (mainWindow) {
      const b = mainWindow.getBounds()
      writeConfig({ ...readConfig(), windowBounds: b })
    }
  })

  // Open external links in OS browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(async () => {
  // ── Trust any SSL certificate (dev certs, self-signed, etc.) ─────────────
  // The user explicitly configures the server URL they trust, so this is safe.
  session.defaultSession.setCertificateVerifyProc((_request, callback) => {
    callback(0) // 0 = success, trust the certificate
  })

  registerIpcHandlers()

  const cfg = readConfig()
  if (cfg.sidecarEnabled) {
    try {
      const port = await sidecar.start()
      writeConfig({ ...readConfig(), sidecarPort: port })
    } catch (err) {
      console.error('[main] Failed to start sidecar:', err)
    }
  }

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', async () => {
  await sidecar.stop()
  if (process.platform !== 'darwin') app.quit()
})

// ─── IPC handlers ─────────────────────────────────────────────────────────────

const fileWatchers = new Map<
  string,
  { lastSize: number; timer: ReturnType<typeof setInterval> }
>()

function registerIpcHandlers(): void {
  // ── Config ────────────────────────────────────────────────────────────────
  ipcMain.on('config:getSync', (event) => {
    event.returnValue = readConfig()
  })
  ipcMain.handle('config:get', () => readConfig())
  ipcMain.handle('config:set', (_e, patch: Partial<DesktopConfig>) => {
    const next = { ...readConfig(), ...patch }
    writeConfig(next)
    return next
  })

  // ── Local prefs ───────────────────────────────────────────────────────────
  ipcMain.handle('prefs:get', () => readLocalPrefs())
  ipcMain.handle('prefs:set', (_e, patch: Partial<LocalPrefs>) => {
    const next = { ...readLocalPrefs(), ...patch }
    writeLocalPrefs(next)
    return next
  })

  // ── File dialog ───────────────────────────────────────────────────────────
  ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Open log file',
      filters: [
        { name: 'Log / Text files', extensions: ['log', 'txt', 'out', 'err', '*'] },
      ],
      properties: ['openFile'],
    })
    return result.canceled ? null : (result.filePaths[0] ?? null)
  })

  // ── Local file info ───────────────────────────────────────────────────────
  ipcMain.handle('localFile:info', async (_e, filePath: string): Promise<LocalFileInfo> => {
    const stat = statSync(filePath)
    let totalLines = 0
    await new Promise<void>((resolve, reject) => {
      const rl = createInterface({ input: createReadStream(filePath) })
      rl.on('line', () => totalLines++)
      rl.on('close', resolve)
      rl.on('error', reject)
    })
    return {
      path: filePath,
      sizeBytes: stat.size,
      totalLines,
      lastModified: stat.mtime.toISOString(),
    }
  })

  // ── Read lines (paginated) ────────────────────────────────────────────────
  ipcMain.handle(
    'localFile:read',
    async (
      _e,
      filePath: string,
      startLine: number,
      count: number
    ): Promise<Array<{ lineNumber: number; text: string }>> => {
      const lines: Array<{ lineNumber: number; text: string }> = []
      let current = 0
      await new Promise<void>((resolve, reject) => {
        const rl = createInterface({ input: createReadStream(filePath) })
        rl.on('line', (text) => {
          if (current >= startLine && current < startLine + count) {
            lines.push({ lineNumber: current, text })
          }
          if (current >= startLine + count) rl.close()
          current++
        })
        rl.on('close', resolve)
        rl.on('error', reject)
      })
      return lines
    }
  )

  // ── Watch local file for appended content ─────────────────────────────────
  ipcMain.handle('localFile:watch', (_e, filePath: string) => {
    if (fileWatchers.has(filePath)) return

    let lastSize = 0
    try { lastSize = statSync(filePath).size } catch { /* ignore */ }

    const timer = setInterval(async () => {
      try {
        const stat = statSync(filePath)
        if (stat.size <= lastSize) return

        const newLines: string[] = []
        await new Promise<void>((resolve) => {
          const stream = createReadStream(filePath, { start: lastSize })
          const rl = createInterface({ input: stream })
          rl.on('line', (l) => newLines.push(l))
          rl.on('close', resolve)
        })
        lastSize = stat.size

        const entry = fileWatchers.get(filePath)
        if (entry) entry.lastSize = lastSize

        if (mainWindow && newLines.length > 0) {
          mainWindow.webContents.send('localFile:newLines', filePath, newLines)
        }
      } catch { /* file temporarily inaccessible */ }
    }, 500)

    fileWatchers.set(filePath, { lastSize, timer })
  })

  ipcMain.handle('localFile:unwatch', (_e, filePath: string) => {
    const entry = fileWatchers.get(filePath)
    if (entry) {
      clearInterval(entry.timer)
      fileWatchers.delete(filePath)
    }
  })

  // ── Sidecar ───────────────────────────────────────────────────────────────
  ipcMain.handle('sidecar:getPort', () => sidecar.getPort())
  ipcMain.handle('sidecar:isRunning', () => sidecar.isRunning())

  ipcMain.handle('sidecar:start', async () => {
    const port = await sidecar.start()
    writeConfig({ ...readConfig(), sidecarPort: port, sidecarEnabled: true })
    return port
  })

  ipcMain.handle('sidecar:stop', async () => {
    await sidecar.stop()
    writeConfig({ ...readConfig(), sidecarEnabled: false, sidecarPort: undefined })
  })
}
