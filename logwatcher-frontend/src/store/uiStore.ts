import { create } from 'zustand'
import type { UserFontFamily } from '../types'

export type ThemeMode = 'dark' | 'light'

interface UiState {
  theme: ThemeMode
  fontFamily: UserFontFamily
  fontSize: number
  showLineWatchdogPanel: boolean
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setFontFamily: (fontFamily: UserFontFamily) => void
  setFontSize: (fontSize: number) => void
  setShowLineWatchdogPanel: (show: boolean) => void
}

const THEME_KEY = 'logwatcher_theme'
const FONT_FAMILY_KEY = 'logwatcher_font_family'
const FONT_SIZE_KEY = 'logwatcher_font_size'
// Admin-only, per-browser setting: shows/hides the Line Watchdog panel in the inspector rail.
// Intentionally local to this browser only (not synced server-side), same as theme/font above.
const SHOW_LINE_WATCHDOG_PANEL_KEY = 'logwatcher_show_line_watchdog_panel'

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

function readInitialShowLineWatchdogPanel(): boolean {
  return localStorage.getItem(SHOW_LINE_WATCHDOG_PANEL_KEY) === '1'
}

export const useUiStore = create<UiState>((set, get) => ({
  theme: readInitialTheme(),
  fontFamily: readInitialFontFamily(),
  fontSize: readInitialFontSize(),
  showLineWatchdogPanel: readInitialShowLineWatchdogPanel(),
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
  setShowLineWatchdogPanel: (show) => {
    localStorage.setItem(SHOW_LINE_WATCHDOG_PANEL_KEY, show ? '1' : '0')
    set({ showLineWatchdogPanel: show })
  },
}))