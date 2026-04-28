import React, { memo } from 'react'
import type { Segment } from '../../hooks/useHighlighting'

interface LogLineProps {
  lineNumber: number
  text: string | undefined
  segments?: Segment[]
  isSelected?: boolean
  onClick?: () => void
}

/**
 * Renders a single log line.
 * If segments are provided (from useHighlighting), each segment is a colored <span>.
 * Falls back to plain text rendering for unloaded lines (shows a loading placeholder).
 */
export const LogLine = memo(function LogLine({
  lineNumber: _lineNumber,
  text,
  segments,
  isSelected,
  onClick,
}: LogLineProps) {
  if (text === undefined) {
    // Not yet loaded — show a placeholder shimmer
    return (
      <div
        className="log-row log-row--placeholder"
        style={{ minHeight: 20 }}
      >
        <span className="log-row__placeholder" />
      </div>
    )
  }

  const lineStyle = segments && segments.length > 0
    ? { backgroundColor: segments[0].backColor }
    : undefined

  const content = segments && segments.length > 0
    ? segments.map((seg, i) => (
        <span
          key={i}
          style={{
            color: seg.foreColor,
            fontWeight: seg.bold ? 'bold' : undefined,
          }}
        >
          {seg.text}
        </span>
      ))
    : text

  return (
    <div
      className={`log-row ${isSelected ? 'log-row--selected' : ''}`}
      style={{ minHeight: 20, ...lineStyle }}
      onClick={onClick}
    >
      <span className="log-row__content">{content}</span>
    </div>
  )
})
