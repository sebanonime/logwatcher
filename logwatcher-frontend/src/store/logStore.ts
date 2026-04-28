import { create } from 'zustand'
import type { LogTab, LineDto } from '../types'

interface LineBuffer {
  [lineNumber: number]: string
}

interface LogState {
  // Line buffers per session (sliding window ~5000 lines)
  buffers: Record<string, LineBuffer>
  selectedLines: Record<string, LineDto | null>
  addLines: (sessionId: string, lines: LineDto[]) => void
  addLinesAt: (sessionId: string, startLine: number, lines: LineDto[]) => void
  clearBuffer: (sessionId: string) => void
  getLine: (sessionId: string, lineNumber: number) => string | undefined
  setSelectedLine: (sessionId: string, line: LineDto | null) => void
  getSelectedLine: (sessionId: string) => LineDto | null
}

interface TabState {
  tabs: LogTab[]
  activeSessionId: string | null
  addTab: (tab: LogTab) => void
  removeTab: (sessionId: string) => void
  setActive: (sessionId: string) => void
  updateTab: (sessionId: string, patch: Partial<LogTab>) => void
}

const BUFFER_MAX = 5000
const EVICT_TO = 3000

export const useLogStore = create<LogState>((set, get) => ({
  buffers: {},
  selectedLines: {},

  addLinesAt: (sessionId, startLine, lines) => {
    set(state => {
      const buf = { ...(state.buffers[sessionId] ?? {}) }
      for (let i = 0; i < lines.length; i++) {
        buf[startLine + i] = lines[i].text
      }
      const keys = Object.keys(buf).map(Number).sort((a, b) => a - b)
      if (keys.length > BUFFER_MAX) {
        const toEvict = keys.slice(0, keys.length - EVICT_TO)
        for (const k of toEvict) delete buf[k]
      }
      return { buffers: { ...state.buffers, [sessionId]: buf } }
    })
  },

  addLines: (sessionId, lines) => {
    set(state => {
      const buf = { ...(state.buffers[sessionId] ?? {}) }
      for (const line of lines) {
        buf[line.lineNumber] = line.text
      }
      // Evict oldest entries if buffer is too large
      const keys = Object.keys(buf).map(Number).sort((a, b) => a - b)
      if (keys.length > BUFFER_MAX) {
        const toEvict = keys.slice(0, keys.length - EVICT_TO)
        for (const k of toEvict) delete buf[k]
      }
      return { buffers: { ...state.buffers, [sessionId]: buf } }
    })
  },

  clearBuffer: (sessionId) => {
    set(state => {
      const { [sessionId]: _, ...rest } = state.buffers
      return { buffers: rest }
    })
  },

  getLine: (sessionId, lineNumber) => {
    return get().buffers[sessionId]?.[lineNumber]
  },

  setSelectedLine: (sessionId, line) => {
    set(state => ({ selectedLines: { ...state.selectedLines, [sessionId]: line } }))
  },

  getSelectedLine: (sessionId) => {
    return get().selectedLines[sessionId] ?? null
  },
}))

export const useTabStore = create<TabState>((set) => ({
  tabs: [],
  activeSessionId: null,

  addTab: (tab) => set(state => ({
    tabs: [...state.tabs, tab],
    activeSessionId: tab.sessionId,
  })),

  removeTab: (sessionId) => set(state => {
    const newTabs = state.tabs.filter(t => t.sessionId !== sessionId)
    const newActive = state.activeSessionId === sessionId
      ? (newTabs[newTabs.length - 1]?.sessionId ?? null)
      : state.activeSessionId
    return { tabs: newTabs, activeSessionId: newActive }
  }),

  setActive: (sessionId) => set({ activeSessionId: sessionId }),

  updateTab: (sessionId, patch) => set(state => ({
    tabs: state.tabs.map(t => t.sessionId === sessionId ? { ...t, ...patch } : t)
  })),
}))
