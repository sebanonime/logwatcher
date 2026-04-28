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
  if (theme === 'dark') {
    return {
      foreColor: argbToCss(rule.darkForeColorArgb ?? rule.foreColorArgb),
      backColor: argbToCss(rule.darkBackColorArgb ?? rule.backColorArgb),
    }
  }

  return {
    foreColor: argbToCss(rule.lightForeColorArgb ?? rule.foreColorArgb),
    backColor: argbToCss(rule.lightBackColorArgb ?? rule.backColorArgb),
  }
}

export function useHighlighting(rules: HighlightingRule[]) {
  const theme = useUiStore(state => state.theme)

  const sortedRules = useMemo(
    () => [...rules].sort((a, b) => {
      if (a.hightPriority !== b.hightPriority) return a.hightPriority ? -1 : 1
      return a.order - b.order
    }),
    [rules]
  )

  const highlightLine = useMemo(() => (text: string): Segment[] => {
    if (!text || sortedRules.length === 0) return [{ text }]

    for (const rule of sortedRules) {
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

    return [{ text }]
  }, [sortedRules, theme])

  return { highlightLine }
}
