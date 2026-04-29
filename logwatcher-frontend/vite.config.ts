import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as { version: string }
const buildStamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 12)
const appBuildId = `${packageJson.version}+${buildStamp}`

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_BUILD__: JSON.stringify(appBuildId),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'https://localhost:7000', secure: false, changeOrigin: true },
      '/logHub': { target: 'https://localhost:7000', secure: false, changeOrigin: true, ws: true },
      '/agentHub': { target: 'https://localhost:7000', secure: false, changeOrigin: true, ws: true },
    }
  },
  build: {
    outDir: '../LogWatcher.Web/wwwroot',
    emptyOutDir: true,
  }
})
