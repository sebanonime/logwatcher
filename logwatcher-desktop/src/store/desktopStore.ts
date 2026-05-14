import { create } from 'zustand'
import type { LocalFileInfo } from '../preload.d'

// ─── Local file tab ───────────────────────────────────────────────────────────

export interface LocalTab {
  /** Unique id for this tab (same as filePath for simplicity). */
  id: string
  filePath: string
  displayName: string
  info: LocalFileInfo
  /** Lines currently buffered (sliding window). */
  buffer: Map<number, string>
  totalLines: number
  /** Scroll position — 0 = top, 1 = bottom (tail mode). */
  scrollRatio: number
  /** Tail mode — automatically follow appended lines. */
  tailMode: boolean
  filterPattern: string
  filterIsRegex: boolean
  filterCaseSensitive: boolean
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface DesktopState {
  /** Remote backend URL (e.g. https://logs.mycompany.com) */
  serverUrl: string
  setServerUrl: (url: string) => void
  clearServerUrl: () => void

  /** Local file tabs */
  localTabs: LocalTab[]
  activeLocalTabId: string | null

  openLocalTab: (info: LocalFileInfo) => void
  closeLocalTab: (id: string) => void
  setActiveLocalTab: (id: string) => void
  updateLocalTab: (id: string, patch: Partial<LocalTab>) => void
  addLocalLines: (filePath: string, lineNumber: number, lines: string[]) => void
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  serverUrl: window.electronAPI?.initialServerUrl ?? '',
  setServerUrl: (url) => set({ serverUrl: url }),
  clearServerUrl: () => {
    window.electronAPI?.setConfig({ serverUrl: '' }).catch(() => {})
    set({ serverUrl: '' })
  },

  localTabs: [],
  activeLocalTabId: null,

  openLocalTab: (info) => {
    const existing = get().localTabs.find((t) => t.filePath === info.path)
    if (existing) {
      set({ activeLocalTabId: existing.id })
      return
    }
    const tab: LocalTab = {
      id: info.path,
      filePath: info.path,
      displayName: info.path.replace(/.*[\\/]/, ''),
      info,
      buffer: new Map(),
      totalLines: info.totalLines,
      scrollRatio: 1,
      tailMode: true,
      filterPattern: '',
      filterIsRegex: false,
      filterCaseSensitive: false,
    }
    set((state) => ({
      localTabs: [...state.localTabs, tab],
      activeLocalTabId: tab.id,
    }))
  },

  closeLocalTab: (id) => {
    set((state) => {
      const next = state.localTabs.filter((t) => t.id !== id)
      const nextActive =
        state.activeLocalTabId === id
          ? (next[next.length - 1]?.id ?? null)
          : state.activeLocalTabId
      return { localTabs: next, activeLocalTabId: nextActive }
    })
  },

  setActiveLocalTab: (id) => set({ activeLocalTabId: id }),

  updateLocalTab: (id, patch) => {
    set((state) => ({
      localTabs: state.localTabs.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  },

  addLocalLines: (filePath, startLine, lines) => {
    set((state) => {
      const tab = state.localTabs.find((t) => t.filePath === filePath)
      if (!tab) return state

      const buf = new Map(tab.buffer)
      lines.forEach((text, i) => buf.set(startLine + i, text))

      // Keep a sliding window of ~5000 lines
      if (buf.size > 5000) {
        const sorted = Array.from(buf.keys()).sort((a, b) => a - b)
        sorted.slice(0, buf.size - 3000).forEach((k) => buf.delete(k))
      }

      const newTotal = Math.max(tab.totalLines, startLine + lines.length)

      return {
        localTabs: state.localTabs.map((t) =>
          t.id === tab.id ? { ...t, buffer: buf, totalLines: newTotal } : t
        ),
      }
    })
  },
}))
