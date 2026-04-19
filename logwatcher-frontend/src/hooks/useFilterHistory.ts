import { useCallback } from 'react'

const STORAGE_KEY = 'logwatcher_filter_history'
const MAX_ENTRIES = 50

export function useFilterHistory() {
  const getHistory = useCallback((): string[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    } catch {
      return []
    }
  }, [])

  const addEntry = useCallback((pattern: string) => {
    if (!pattern.trim()) return
    const current = getHistory().filter(p => p !== pattern)
    const next = [pattern, ...current].slice(0, MAX_ENTRIES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [getHistory])

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { getHistory, addEntry, clear }
}
