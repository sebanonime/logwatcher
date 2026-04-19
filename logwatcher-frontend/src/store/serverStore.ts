import { create } from 'zustand'
import type { ServerDto } from '../types'

interface ServerState {
  servers: ServerDto[]
  setServers: (servers: ServerDto[]) => void
  fetchServers: () => Promise<void>
}

export const useServerStore = create<ServerState>((set) => ({
  servers: [],
  setServers: (servers) => set({ servers }),
  fetchServers: async () => {
    try {
      const res = await fetch('/api/servers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('logwatcher_token') ?? ''}` }
      })
      if (res.ok) {
        const data: ServerDto[] = await res.json()
        set({ servers: data })
      }
    } catch {
      // ignore
    }
  }
}))
