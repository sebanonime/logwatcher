import { create } from 'zustand'
import type { UserFontFamily } from '../types'

export type ThemeMode = 'dark' | 'light'

interface UiState {
  theme: ThemeMode
  fontFamily: UserFontFamily
  fontSize: number
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setFontFamily: (fontFamily: UserFontFamily) => void
  setFontSize: (fontSize: number) => void
}

const THEME_KEY = 'logwatcher_theme'
const FONT_FAMILY_KEY = 'logwatcher_font_family'
const FONT_SIZE_KEY = 'logwatcher_font_size'

function readInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(THEME_KEY)
  return saved === 'light' ? 'light' : 'dark'
}

function readInitialFontFamily(): UserFontFamily {
  const saved = localStorage.getItem(FONT_FAMILY_KEY)
  return saved === 'Consolas' || saved === 'Segoe UI' || saved === 'Bahnschrift'
    ? saved
    : 'Cascadia Code'
}

function readInitialFontSize(): number {
  const parsed = Number(localStorage.getItem(FONT_SIZE_KEY))
  return Number.isFinite(parsed) && parsed >= 10 && parsed <= 22 ? parsed : 11
}

export const useUiStore = create<UiState>((set, get) => ({
  theme: readInitialTheme(),
  fontFamily: readInitialFontFamily(),
  fontSize: readInitialFontSize(),
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme)
    set({ theme })
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(THEME_KEY, next)
    set({ theme: next })
  },
  setFontFamily: (fontFamily) => {
    localStorage.setItem(FONT_FAMILY_KEY, fontFamily)
    set({ fontFamily })
  },
  setFontSize: (fontSize) => {
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize))
    set({ fontSize })
  },
}))