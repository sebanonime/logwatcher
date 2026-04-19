import { create } from 'zustand'
import type { PerimeterDto } from '../types'

interface PerimeterState {
  perimeters: PerimeterDto[]
  selectedPerimeterId: string | null
  isFetching: boolean
  fetchPerimeters: () => Promise<void>
  selectPerimeter: (id: string) => void
}

export const usePerimeterStore = create<PerimeterState>((set, get) => ({
  perimeters: [],
  selectedPerimeterId: null,
  isFetching: false,

  fetchPerimeters: async () => {
    if (get().isFetching) return
    set({ isFetching: true })
    try {
      const token = localStorage.getItem('logwatcher_token') ?? ''
      const res = await fetch('/api/perimeters', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data: PerimeterDto[] = await res.json()
        set({ perimeters: data })
      }
    } catch { /* ignore */ }
    finally { set({ isFetching: false }) }
  },

  selectPerimeter: (id) => set({ selectedPerimeterId: id }),
}))
