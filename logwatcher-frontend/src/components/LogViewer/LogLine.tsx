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
        className="flex items-center px-2 h-5 font-mono text-xs text-gray-600 select-none"
        style={{ minHeight: 20 }}
      >
        <span className="w-12 text-right mr-4 text-gray-700 select-none shrink-0">
          {lineNumber + 1}
        </span>
        <span className="h-3 bg-gray-700 rounded animate-pulse w-48" />
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
      className={`flex items-center px-2 h-5 font-mono text-xs whitespace-pre cursor-pointer hover:bg-gray-800 ${
        isSelected ? 'bg-blue-900' : ''
      }`}
      style={{ minHeight: 20 }}
      onClick={onClick}
    >
      <span className="w-12 text-right mr-4 text-gray-600 select-none shrink-0">
        {lineNumber + 1}
      </span>
      <span className="overflow-hidden text-ellipsis">{content}</span>
    </div>
  )
})
