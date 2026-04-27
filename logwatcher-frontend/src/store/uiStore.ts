import { create } from 'zustand'

export type ThemeMode = 'dark' | 'light'

interface UiState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const STORAGE_KEY = 'logwatcher_theme'

function readInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'light' ? 'light' : 'dark'
}

export const useUiStore = create<UiState>((set, get) => ({
  theme: readInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, theme)
    set({ theme })
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    set({ theme: next })
  },
}))