import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

// ─── Read saved server URL so the dev-server proxy is pre-configured ──────────
function getSavedServerUrl(): string {
  const appData = process.env.APPDATA ?? join(homedir(), '.config')
  const cfgPath = join(appData, 'logwatcher-desktop', 'desktop-config.json')
  try {
    if (existsSync(cfgPath)) {
      const parsed = JSON.parse(readFileSync(cfgPath, 'utf-8')) as { serverUrl?: string }
      return typeof parsed.serverUrl === 'string' ? parsed.serverUrl.replace(/\/$/, '') : ''
    }
  } catch { /* ignore */ }
  return ''
}

const _savedServerUrl = getSavedServerUrl()
if (_savedServerUrl) {
  console.log(`[electron-vite] Renderer proxy → ${_savedServerUrl}`)
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main.ts'),
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload.ts'),
        },
      },
    },
  },
  renderer: {
    root: resolve(__dirname, 'src'),
    server: _savedServerUrl
      ? {
          proxy: {
            '/api': { target: _savedServerUrl, secure: false, changeOrigin: true },
            '/logHub': { target: _savedServerUrl, secure: false, changeOrigin: true, ws: true },
            '/agentHub': { target: _savedServerUrl, secure: false, changeOrigin: true, ws: true },
          },
        }
      : undefined,
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src'),
        // Shared frontend source — components, stores, types, hooks, api
        '@shared': resolve(__dirname, '../logwatcher-frontend/src'),
      },
    },
    plugins: [react()],
    css: {
      postcss: resolve(__dirname, '.'),
    },
  },
})
