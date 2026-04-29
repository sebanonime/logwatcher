import React from 'react'
import { useLogStore, useTabStore } from '../../store/logStore'

function extractBalancedJsonCandidate(text: string, start: number): { end: number; raw: string } | null {
  const opening = text[start]
  const closing = opening === '{' ? '}' : opening === '[' ? ']' : ''
  if (!closing) return null

  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < text.length; i++) {
    const ch = text[i]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === '"') {
        inString = false
      }
      continue
    }

    if (ch === '"') {
      inString = true
      continue
    }

    if (ch === opening) depth++
    if (ch === closing) {
      depth--
      if (depth === 0) {
        return { end: i, raw: text.slice(start, i + 1) }
      }
    }
  }

  return null
}

function prettyJsonBlocks(text: string): string {
  let output = ''
  let i = 0

  while (i < text.length) {
    const ch = text[i]
    if (ch !== '{' && ch !== '[') {
      output += ch
      i++
      continue
    }

    const candidate = extractBalancedJsonCandidate(text, i)
    if (!candidate) {
      output += ch
      i++
      continue
    }

    try {
      const parsed = JSON.parse(candidate.raw)
      const pretty = JSON.stringify(parsed, null, 2)
      output += `\n${pretty}\n`
      i = candidate.end + 1
    } catch {
      output += ch
      i++
    }
  }

  return output
}

function prettyXml(xml: string): string {
  const normalized = xml.replace(/>\s*</g, '><').trim()
  const tokens = normalized.replace(/></g, '>\n<').split('\n')
  let depth = 0
  const lines: string[] = []

  for (const token of tokens) {
    const trimmed = token.trim()
    if (!trimmed) continue

    const isClosing = /^<\//.test(trimmed)
    const isSelfClosing = /\/>$/.test(trimmed)
    const isDeclaration = /^<\?/.test(trimmed) || /^<!/.test(trimmed)

    if (isClosing) depth = Math.max(0, depth - 1)
    lines.push(`${'  '.repeat(depth)}${trimmed}`)
    if (!isClosing && !isSelfClosing && !isDeclaration && /^<[^/!?][^>]*>$/.test(trimmed)) depth++
  }

  return lines.join('\n')
}

function prettyXmlBlocks(text: string): string {
  return text.replace(/<([A-Za-z_][\w:.-]*)(?:\s[^<>]*)?>[\s\S]*?<\/\1>/g, (match) => {
    try {
      return `\n${prettyXml(match)}\n`
    } catch {
      return match
    }
  })
}

function splitHumanSeparators(text: string): string {
  let out = ''
  let inDoubleQuote = false
  let inSingleQuote = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const prev = i > 0 ? text[i - 1] : ''

    if (ch === '"' && prev !== '\\' && !inSingleQuote) inDoubleQuote = !inDoubleQuote
    if (ch === '\'' && prev !== '\\' && !inDoubleQuote) inSingleQuote = !inSingleQuote

    out += ch

    if (!inDoubleQuote && !inSingleQuote && (ch === ',' || ch === ';' || ch === '|')) {
      const next = i + 1 < text.length ? text[i + 1] : ''
      if (next && next !== '\n' && next !== '\r') out += '\n'
    }
  }

  // Repeated separators like ----- or ===== become visual blocks.
  out = out.replace(/([\-_=~#*])\1{3,}/g, '\n$&\n')
  return out
}

function formatForInspect(text: string): string {
  const withJson = prettyJsonBlocks(text)
  const withXml = prettyXmlBlocks(withJson)
  return splitHumanSeparators(withXml)
}

export function SelectedLinePanel() {
  const { activeSessionId } = useTabStore()
  const { getSelectedLine } = useLogStore()

  const line = activeSessionId ? getSelectedLine(activeSessionId) : null
  const formatted = line ? formatForInspect(line.text) : null

  return (
    <div className="rail-panel-content">
      <div className="section-header-row">
        <div>
          <div className="eyebrow">Inspect</div>
        </div>
      </div>
      <div className="rail-scroll">
        {!line && (
          <div className="empty-state compact-empty-state">Click a log line to inspect it here.</div>
        )}
        {line && (
          <pre className="selected-line-content">
            {formatted}
          </pre>
        )}
      </div>
    </div>
  )
}
