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

function getRuleColor(rule: HighlightingRule, theme: 'dark' | 'light') {
  const defaultBack = 'var(--surface-strong)'
  if (theme === 'dark') {
    const back = argbToCss(rule.darkBackColorArgb ?? rule.backColorArgb)
    return {
      foreColor: argbToCss(rule.darkForeColorArgb ?? rule.foreColorArgb),
      backColor: back ?? defaultBack,
    }
  }

  const back = argbToCss(rule.lightBackColorArgb ?? rule.backColorArgb)
  return {
    foreColor: argbToCss(rule.lightForeColorArgb ?? rule.foreColorArgb),
    backColor: back ?? defaultBack,
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
