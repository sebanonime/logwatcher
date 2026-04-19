import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
