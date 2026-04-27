import { create } from 'zustand'
import type { PerimeterDto } from '../types'

interface PerimeterState {
  perimeters: PerimeterDto[]
  selectedPerimeterId: string | null
  isFetching: boolean
  fetchError: string | null
  fetchPerimeters: () => Promise<void>
  selectPerimeter: (id: string) => void
}

export const usePerimeterStore = create<PerimeterState>((set, get) => ({
  perimeters: [],
  selectedPerimeterId: null,
  isFetching: false,
  fetchError: null,

  fetchPerimeters: async () => {
    if (get().isFetching) return
    set({ isFetching: true, fetchError: null })
    try {
      const token = localStorage.getItem('logwatcher_token') ?? ''
      const res = await fetch('/api/perimeters', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data: PerimeterDto[] = await res.json()
        set({ perimeters: data })
      } else if (res.status === 401) {
        // Token expired or invalid — force re-login
        localStorage.removeItem('logwatcher_token')
        window.location.reload()
      } else {
        set({ fetchError: `Failed to load perimeters (HTTP ${res.status})` })
      }
    } catch (e) {
      set({ fetchError: 'Network error — could not reach server' })
    }
    finally { set({ isFetching: false }) }
  },

  selectPerimeter: (id) => set({ selectedPerimeterId: id }),
}))
