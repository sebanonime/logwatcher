import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLogStore, useTabStore } from '../../store/logStore'
import { ensureFixFields } from '../../api/fix'
import type { FixFieldDto } from '../../types'

// ── FIX protocol ──────────────────────────────────────────────────────────────

type FixFieldMap = Map<number, FixFieldDto>

function buildFixFieldMap(fields: FixFieldDto[]): FixFieldMap {
  return new Map(fields.map(f => [f.number, f]))
}

function looksLikeFix(text: string): boolean {
  // SOH delimiter or visible pipe-separated FIX with BeginString field
  if (text.includes('\u0001')) return true
  // Heuristic: "8=FIX." present and multiple tagId= patterns
  if (/\b8=FIX\b/.test(text)) return true
  return false
}

function formatFix(text: string, fields: FixFieldMap): string {
  // Detect delimiter: SOH (\u0001) or | used as visible substitute
  const hasSoh = text.includes('\u0001')
  const delimiter = hasSoh ? '\u0001' : '|'
  const rawPairs = text.split(delimiter).filter(s => s.trim().length > 0)

  const parsed: Array<{ tag: number; value: string } | string> = rawPairs.map(pair => {
    const eqIdx = pair.indexOf('=')
    if (eqIdx <= 0) return pair
    const tagStr = pair.slice(0, eqIdx).trim()
    const tag = parseInt(tagStr, 10)
    if (isNaN(tag)) return pair
    return { tag, value: pair.slice(eqIdx + 1) }
  })

  // Compute alignment width
  const maxLabel = parsed.reduce((max, item) => {
    if (typeof item === 'string') return max
    const field = fields.get(item.tag)
    const label = field ? `[${item.tag}] ${field.name}` : `[${item.tag}]`
    return Math.max(max, label.length)
  }, 0)

  return parsed.map(item => {
    if (typeof item === 'string') return item
    const field = fields.get(item.tag)
    const label = field ? `[${item.tag}] ${field.name}` : `[${item.tag}]`
    const valueDesc = field?.values.find(v => v.enum === item.value)?.description
    const valueStr = valueDesc ? `${item.value} [${valueDesc}]` : item.value
    return `${label.padEnd(maxLabel)} : ${valueStr}`
  }).join('\n')
}

// ── JSON ──────────────────────────────────────────────────────────────────────

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
      if (escaped) { escaped = false }
      else if (ch === '\\') { escaped = true }
      else if (ch === '"') { inString = false }
      continue
    }
    if (ch === '"') { inString = true; continue }
    if (ch === opening) depth++
    if (ch === closing) {
      depth--
      if (depth === 0) return { end: i, raw: text.slice(start, i + 1) }
    }
  }
  return null
}

function prettyJsonBlocks(text: string): string {
  let output = ''
  let i = 0
  while (i < text.length) {
    const ch = text[i]
    if (ch !== '{' && ch !== '[') { output += ch; i++; continue }
    const candidate = extractBalancedJsonCandidate(text, i)
    if (!candidate) { output += ch; i++; continue }
    try {
      const parsed = JSON.parse(candidate.raw)
      output += `\n${JSON.stringify(parsed, null, 2)}\n`
      i = candidate.end + 1
    } catch { output += ch; i++ }
  }
  return output
}

// ── XML ───────────────────────────────────────────────────────────────────────

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
    try { return `\n${prettyXml(match)}\n` } catch { return match }
  })
}

// ── Key-value ─────────────────────────────────────────────────────────────────

const KV_PAIR_RE = /^[\w.\-/]+\s*[=:]\s*/
// Separator between pairs: , ; | or space-padded dash
const KV_SEP_RE = /\s*[,;|]\s*|\s+-\s+/

function looksLikeKeyValueLine(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed || trimmed.length < 5) return false
  const parts = trimmed.split(KV_SEP_RE).filter(p => p.trim().length > 0)
  if (parts.length < 2) return false
  const kvCount = parts.filter(p => KV_PAIR_RE.test(p.trim())).length
  return kvCount >= 2 && kvCount / parts.length >= 0.6
}

function formatKeyValueLine(line: string): string {
  const parts = line.trim().split(KV_SEP_RE).filter(p => p.trim().length > 0)
  type Pair = { key: string; sep: string; value: string }
  const pairs: Pair[] = []

  for (const p of parts) {
    const m = p.trim().match(/^([\w.\-/]+)\s*([=:])\s*(.*)$/)
    if (!m) return line
    pairs.push({ key: m[1], sep: m[2], value: m[3] })
  }

  const maxKeyLen = pairs.reduce((max, p) => Math.max(max, p.key.length), 0)
  return pairs.map(p => `${p.key.padEnd(maxKeyLen)} ${p.sep} ${p.value}`).join('\n')
}

function applyKeyValueFormatting(text: string): string {
  return text.split('\n').map(line =>
    looksLikeKeyValueLine(line) ? formatKeyValueLine(line) : line
  ).join('\n')
}

// ── General separator splitting ───────────────────────────────────────────────

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

  out = out.replace(/([-_=~#*])\1{3,}/g, '\n$&\n')
  return out
}

// ── Main formatter ────────────────────────────────────────────────────────────

function formatForInspect(text: string, fixFields: FixFieldMap | null): string {
  if (fixFields && fixFields.size > 0 && looksLikeFix(text)) {
    return formatFix(text, fixFields)
  }
  const withJson = prettyJsonBlocks(text)
  const withXml = prettyXmlBlocks(withJson)
  const withKv = applyKeyValueFormatting(withXml)
  // Only apply generic separator splitting when KV didn't already reformat
  if (withKv !== withXml) return withKv
  return splitHumanSeparators(withXml)
}

// ── Component ─────────────────────────────────────────────────────────────────

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function SelectedLinePanel() {
  const { activeSessionId } = useTabStore()
  const { getSelectedLine } = useLogStore()
  const [search, setSearch] = useState('')
  const [activeMatch, setActiveMatch] = useState(0)
  const activeMatchRef = useRef<HTMLElement | null>(null)
  const [fixFields, setFixFields] = useState<FixFieldMap | null>(null)

  useEffect(() => {
    ensureFixFields().then(fields => setFixFields(buildFixFieldMap(fields)))
  }, [])

  const line = activeSessionId ? getSelectedLine(activeSessionId) : null
  const formatted = line ? formatForInspect(line.text, fixFields) : null

  const searchRegex = useMemo(() => {
    if (!search.trim()) return null
    return new RegExp(`(${escapeRegExp(search.trim())})`, 'gi')
  }, [search])

  const matchCount = useMemo(() => {
    if (!formatted || !searchRegex) return 0
    return formatted.match(searchRegex)?.length ?? 0
  }, [formatted, searchRegex])

  useEffect(() => {
    setActiveMatch(0)
    setSearch('')
  }, [line?.lineNumber])

  useEffect(() => {
    activeMatchRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeMatch, formatted])

  const renderedContent = useMemo(() => {
    if (!formatted) return null
    if (!searchRegex) return formatted

    const parts = formatted.split(searchRegex)
    let currentMatch = -1

    return parts.map((part, index) => {
      if (!part) return null
      if (index % 2 === 1) {
        currentMatch++
        const isActive = currentMatch === activeMatch
        return (
          <mark
            key={`m-${index}`}
            className={`inspect-match ${isActive ? 'inspect-match--active' : ''}`}
            ref={element => { if (isActive) activeMatchRef.current = element }}
          >
            {part}
          </mark>
        )
      }
      return <React.Fragment key={`t-${index}`}>{part}</React.Fragment>
    })
  }, [formatted, searchRegex, activeMatch])

  const goNextMatch = () => {
    if (matchCount <= 0) return
    setActiveMatch(previous => (previous + 1) % matchCount)
  }

  return (
    <div className="rail-panel-content">
      <div className="section-header-row">
        <div>
          <div className="eyebrow">Inspect</div>
        </div>
        <div className="inspect-search-row">
          <input
            className="control-input inspect-search-input"
            placeholder="Search in details..."
            value={search}
            onChange={event => setSearch(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === 'F3') {
                event.preventDefault()
                goNextMatch()
              }
            }}
          />
          {matchCount > 0 && (
            <button className="control-button control-button--ghost inspect-search-next" onClick={goNextMatch} title="Next match">
              {activeMatch + 1}/{matchCount}
            </button>
          )}
        </div>
      </div>
      <div className="rail-scroll">
        {!line && (
          <div className="empty-state compact-empty-state">Click a log line to inspect it here.</div>
        )}
        {line && (
          <pre className="selected-line-content">
            {renderedContent}
          </pre>
        )}
      </div>
    </div>
  )
}
