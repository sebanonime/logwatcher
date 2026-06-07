import { create } from 'zustand'

interface SelectionRange {
  anchor: number
  focus: number
}

interface SelectionState {
  /** Map: sessionId -> selection range */
  ranges: Record<string, SelectionRange>
  setSelection: (sessionId: string, anchor: number, focus: number) => void
  getSelection: (sessionId: string) => SelectionRange | null
  clearSelection: (sessionId: string) => void
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  ranges: {},

  setSelection: (sessionId, anchor, focus) => {
    set(state => ({
      ranges: { ...state.ranges, [sessionId]: { anchor, focus } },
    }))
  },

  getSelection: (sessionId) => {
    return get().ranges[sessionId] ?? null
  },

  clearSelection: (sessionId) => {
    set(state => {
      const { [sessionId]: _, ...rest } = state.ranges
      return { ranges: rest }
    })
  },
}))

/**
 * Helper: get the ordered start/end of a selection range.
 */
export function orderedRange(range: SelectionRange): { start: number; end: number } {
  const start = Math.min(range.anchor, range.focus)
  const end = Math.max(range.anchor, range.focus)
  return { start, end }
}