import { useMemo } from 'react'
import type { HighlightingRule } from '../types'

export interface Segment {
  text: string
  foreColor?: string
  backColor?: string
  bold?: boolean
}

/**
 * Converts a .NET ARGB int to a CSS hex color string.
 * Handles the case where the ARGB value is 0 (transparent / not set).
 */
function argbToCss(argb: number): string | undefined {
  if (argb === 0 || argb === -1) return undefined
  // Mask to RGB (drop alpha for CSS background-color)
  const rgb = argb & 0xFFFFFF
  return `#${rgb.toString(16).padStart(6, '0')}`
}

/**
 * Compiles a set of highlighting rules into a fast match function.
 * Returns a function that splits a log line text into colored segments.
 * All computation is synchronous and runs in the render cycle — zero server cost.
 */
export function useHighlighting(rules: HighlightingRule[]) {
  const sortedRules = useMemo(
    () => [...rules].sort((a, b) => {
      // High-priority rules first, then by order ascending
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
        return [{
          text,
          foreColor: argbToCss(rule.foreColorArgb),
          backColor: argbToCss(rule.backColorArgb),
          bold: rule.bold,
        }]
      }
    }

    return [{ text }]
  }, [sortedRules])

  return { highlightLine }
}
