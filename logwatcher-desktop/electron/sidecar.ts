import { ChildProcess, spawn } from 'child_process'
import { join } from 'path'
import { existsSync } from 'fs'
import net from 'net'
import { app } from 'electron'

export class SidecarManager {
  private proc: ChildProcess | null = null
  private _port: number | null = null

  getPort(): number | null {
    return this._port
  }

  isRunning(): boolean {
    return this.proc !== null && this._port !== null
  }

  async start(): Promise<number> {
    if (this.proc) return this._port!

    const exePath = resolveSidecarExe()
    if (!exePath) {
      throw new Error(
        'LogWatcher.Web sidecar executable not found. ' +
          'Build the project in Release mode or run it manually.'
      )
    }

    this._port = await findFreePort()

    this.proc = spawn(exePath, [`--urls=http://localhost:${this._port}`], {
      detached: false,
      stdio: 'pipe',
      env: { ...process.env, ASPNETCORE_ENVIRONMENT: 'Production' },
    })

    this.proc.stdout?.on('data', (d) => console.log('[sidecar]', d.toString()))
    this.proc.stderr?.on('data', (d) => console.error('[sidecar]', d.toString()))

    this.proc.on('exit', (code) => {
      console.log(`[sidecar] exited with code ${code}`)
      this.proc = null
      this._port = null
    })

    await waitForReady(this._port)
    console.log(`[sidecar] ready on port ${this._port}`)
    return this._port
  }

  async stop(): Promise<void> {
    if (this.proc) {
      this.proc.kill('SIGTERM')
      this.proc = null
      this._port = null
    }
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function resolveSidecarExe(): string | null {
  const candidates = [
    // Packaged app — extracted via electron-builder extraResources
    join(app.getPath('exe'), '..', 'resources', 'sidecar', 'LogWatcher.Web.exe'),
    // Development — standalone publish output
    join(app.getAppPath(), '..', '..', 'publish', 'LogWatcher.Web', 'LogWatcher.Web.exe'),
    // Development — Release publish output (net10)
    join(app.getAppPath(), '..', '..', 'LogWatcher.Web', 'bin', 'Release', 'net10.0', 'win-x64', 'publish', 'LogWatcher.Web.exe'),
    // Development — Release publish output (net8)
    join(app.getAppPath(), '..', '..', 'LogWatcher.Web', 'bin', 'Release', 'net8.0', 'win-x64', 'publish', 'LogWatcher.Web.exe'),
  ]
  return candidates.find(existsSync) ?? null
}

async function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address()
      server.close(() => {
        if (addr && typeof addr === 'object') {
          resolve(addr.port)
        } else {
          reject(new Error('Could not determine a free port'))
        }
      })
    })
  })
}

async function waitForReady(port: number, maxAttempts = 30): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const resp = await fetch(`http://localhost:${port}/health`)
      if (resp.ok || resp.status < 500) return
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error(`Sidecar did not become ready within ${maxAttempts} seconds`)
}
