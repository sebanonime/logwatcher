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
  lineNumber,
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
        <span className="log-row__line-number">
          {lineNumber + 1}
        </span>
        <span className="log-row__placeholder" />
      </div>
    )
  }

  const content = segments && segments.length > 0
    ? segments.map((seg, i) => (
        <span
          key={i}
          style={{
            color: seg.foreColor,
            backgroundColor: seg.backColor,
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
      style={{ minHeight: 20 }}
      onClick={onClick}
    >
      <span className="log-row__line-number">
        {lineNumber + 1}
      </span>
      <span className="log-row__content">{content}</span>
    </div>
  )
})
