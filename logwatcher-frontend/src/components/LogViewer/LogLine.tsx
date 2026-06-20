import React, { memo } from 'react'
import type { Segment } from '../../hooks/useHighlighting'

interface LogLineProps {
  lineNumber: number
  text: string | undefined
  segments?: Segment[]
  isSelected?: boolean
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
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
  style: outerStyle,
  onClick,
}: LogLineProps) {
  if (text === undefined) {
    // Not yet loaded — show a placeholder shimmer
    return (
      <div
        className="log-row log-row--placeholder"
        style={{ minHeight: 20, ...outerStyle }}
      >
        <span className="log-row__placeholder" />
      </div>
    )
  }

  const lineStyle = segments && segments.length > 0
    ? { backgroundColor: segments[0].backColor }
    : undefined

  const selectedStyle = isSelected
    ? {
        borderLeft: '4px solid var(--accent-strong)',
      }
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
        style={{ minHeight: 20, ...lineStyle, ...outerStyle }}
        onClick={onClick}
        onMouseDown={onClick ? (e) => { if (e.button !== 0) return; onClick(e); } : undefined}
      >
      <div style={{ ...selectedStyle, width: '100%', height: '100%' }}>
        <span className="log-row__content">{content}</span>
      </div>
    </div>
  )
})
