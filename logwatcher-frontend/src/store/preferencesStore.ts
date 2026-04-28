import { create } from 'zustand'
import { getPreferences } from '../api/settings'
import type { HighlightingRule, PreferencesPayloadDto, ProfileDto } from '../types'

interface PreferencesState {
  defaultHighlights: HighlightingRule[]
  profiles: ProfileDto[]
  isFetching: boolean
  fetchError: string | null
  fetchPreferences: () => Promise<void>
  setPreferences: (payload: PreferencesPayloadDto) => void
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  defaultHighlights: [],
  profiles: [],
  isFetching: false,
  fetchError: null,

  fetchPreferences: async () => {
    if (get().isFetching) return
    set({ isFetching: true, fetchError: null })
    try {
      const payload = await getPreferences()
      set({
        defaultHighlights: payload.defaultHighlights ?? [],
        profiles: payload.profiles ?? [],
      })
    } catch (error) {
      set({
        fetchError: error instanceof Error ? error.message : 'Could not load preferences.',
      })
    } finally {
      set({ isFetching: false })
    }
  },

  setPreferences: (payload) => set({
    defaultHighlights: payload.defaultHighlights ?? [],
    profiles: payload.profiles ?? [],
  }),
}))
