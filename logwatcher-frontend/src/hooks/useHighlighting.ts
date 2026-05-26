import { useMemo } from 'react'
import type { HighlightingRule } from '../types'
import { useUiStore } from '../store/uiStore'

export interface Segment {
  text: string
  foreColor?: string
  backColor?: string
  bold?: boolean
}

function argbToCss(argb: number | undefined): string | undefined {
  if (argb === undefined || argb === 0 || argb === -1) return undefined
  const rgb = argb & 0xFFFFFF
  return `#${rgb.toString(16).padStart(6, '0')}`
}

function resolveArgb(primary: number | undefined, fallback1: number | undefined, fallback2: number | undefined): number | undefined {
  for (const v of [primary, fallback1, fallback2]) {
    if (v !== undefined && v !== 0 && v !== -1) return v
  }
  return undefined
}

function getRuleColor(rule: HighlightingRule, theme: 'dark' | 'light') {
  const defaultBack = 'var(--surface-strong)'
  if (theme === 'dark') {
    return {
      foreColor: argbToCss(resolveArgb(rule.darkForeColorArgb, rule.lightForeColorArgb, rule.foreColorArgb)),
      backColor: argbToCss(resolveArgb(rule.darkBackColorArgb, rule.lightBackColorArgb, rule.backColorArgb)) ?? defaultBack,
    }
  }
  return {
    foreColor: argbToCss(resolveArgb(rule.lightForeColorArgb, rule.darkForeColorArgb, rule.foreColorArgb)),
    backColor: argbToCss(resolveArgb(rule.lightBackColorArgb, rule.darkBackColorArgb, rule.backColorArgb)) ?? defaultBack,
  }
}

export function useHighlighting(primaryRules: HighlightingRule[], fallbackRules: HighlightingRule[] = []) {
  const theme = useUiStore(state => state.theme)

  const sortedPrimaryRules = useMemo(
    () => [...primaryRules].sort((a, b) => {
      if (a.hightPriority !== b.hightPriority) return a.hightPriority ? -1 : 1
      return a.order - b.order
    }),
    [primaryRules]
  )

  const sortedFallbackRules = useMemo(
    () => [...fallbackRules].sort((a, b) => {
      if (a.hightPriority !== b.hightPriority) return a.hightPriority ? -1 : 1
      return a.order - b.order
    }),
    [fallbackRules]
  )

  const highlightLine = useMemo(() => (text: string): Segment[] => {
    if (!text) return [{ text }]

    const tryMatch = (rules: HighlightingRule[]) => {
      for (const rule of rules) {
        if (!rule.text) continue
        let match = false
        try {
          if (rule.isRegex) {
            const flags = rule.caseSensitive ? '' : 'i'
            match = new RegExp(rule.text, flags).test(text)
          } else {
            match = rule.caseSensitive
              ? text.includes(rule.text)
              : text.toLowerCase().includes(rule.text.toLowerCase())
          }
        } catch {
          continue
        }

        if (match) {
          const colors = getRuleColor(rule, theme)
          return [{
            text,
            foreColor: colors.foreColor,
            backColor: colors.backColor,
            bold: rule.bold,
          }]
        }
      }

      return null
    }

    const primaryMatch = tryMatch(sortedPrimaryRules)
    if (primaryMatch) return primaryMatch

    const fallbackMatch = tryMatch(sortedFallbackRules)
    if (fallbackMatch) return fallbackMatch

    return [{ text }]
  }, [sortedPrimaryRules, sortedFallbackRules, theme])

  return { highlightLine }
}
