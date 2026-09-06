import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLogStore, useTabStore } from '../../store/logStore'
import { ensureFixFields } from '../../api/fix'
import type { FixFieldDto } from '../../types'

// ── Shared utils ────────────────────────────────────────────────────────────

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

interface ProtectedRange {
  start: number
  end: number
}

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

// Returns the pretty-printed text plus the ranges (in the OUTPUT string) that
// contain injected JSON. Those ranges must be left untouched by every later
// formatting pass (XML detection, KV extraction, separator splitting) so that
// e.g. a string value containing "<tag>" or a comma inside an array is never
// re-interpreted as XML or as a KV/CSV separator.
function prettyJsonBlocks(text: string): { text: string; protectedRanges: ProtectedRange[] } {
  let output = ''
  const protectedRanges: ProtectedRange[] = []
  let i = 0
  while (i < text.length) {
    const ch = text[i]
    if (ch !== '{' && ch !== '[') { output += ch; i++; continue }
    const candidate = extractBalancedJsonCandidate(text, i)
    if (!candidate) { output += ch; i++; continue }
    try {
      const parsed = JSON.parse(candidate.raw)
      const block = `\n${JSON.stringify(parsed, null, 2)}\n`
      protectedRanges.push({ start: output.length, end: output.length + block.length })
      output += block
      i = candidate.end + 1
    } catch { output += ch; i++ }
  }
  return { text: output, protectedRanges }
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

// Finds the full <tag>...</tag> block starting at `start`, correctly handling
// nested tags that share the same name (e.g. <a><a>x</a></a>) by tracking
// open/close depth instead of relying on a non-greedy regex.
function extractBalancedXmlBlock(text: string, start: number): { end: number; raw: string } | null {
  const openTagMatch = /^<([A-Za-z_][\w:.-]*)(?:\s[^<>]*)?>/.exec(text.slice(start))
  if (!openTagMatch) return null
  if (/\/>$/.test(openTagMatch[0])) return null // self-closing at the top: nothing to balance

  const tagName = openTagMatch[1]
  const escapedTag = escapeRegExp(tagName)
  const combinedRe = new RegExp(`<${escapedTag}(?:\\s[^<>]*)?/?>|</${escapedTag}\\s*>`, 'g')
  combinedRe.lastIndex = start

  let depth = 0
  let match: RegExpExecArray | null
  while ((match = combinedRe.exec(text)) !== null) {
    const token = match[0]
    if (token.startsWith('</')) {
      depth--
    } else if (!/\/>$/.test(token)) {
      depth++
    }
    // self-closing nested tags (e.g. <a/>) don't affect depth
    if (depth === 0) {
      return { end: match.index + token.length, raw: text.slice(start, match.index + token.length) }
    }
  }
  return null
}

// Pretty-prints XML blocks. Skips over any range already protected by an
// earlier pass (e.g. pretty-printed JSON) so a "<tag>"-looking string inside
// a JSON value is never mistaken for real XML. Returns the combined set of
// protected ranges (relocated JSON ranges + newly created XML ranges) so the
// next passes can skip them too.
function prettyXmlBlocks(
  text: string,
  incomingProtected: ProtectedRange[]
): { text: string; protectedRanges: ProtectedRange[] } {
  let output = ''
  const protectedRanges: ProtectedRange[] = []
  let i = 0

  const incomingAt = (pos: number) => incomingProtected.find(r => pos >= r.start && pos < r.end)

  while (i < text.length) {
    const incoming = incomingAt(i)
    if (incoming) {
      const start = output.length
      output += text.slice(i, incoming.end)
      protectedRanges.push({ start, end: output.length })
      i = incoming.end
      continue
    }

    const ch = text[i]
    if (ch !== '<') { output += ch; i++; continue }
    const rest = text.slice(i)
    if (/^<\//.test(rest) || /^<\?/.test(rest) || /^<!/.test(rest)) { output += ch; i++; continue }

    const candidate = extractBalancedXmlBlock(text, i)
    if (!candidate) { output += ch; i++; continue }
    try {
      const start = output.length
      output += `\n${prettyXml(candidate.raw)}\n`
      protectedRanges.push({ start, end: output.length })
      i = candidate.end
    } catch { output += ch; i++ }
  }

  return { text: output, protectedRanges }
}

// ── Key-value ─────────────────────────────────────────────────────────────────
//
// Real log lines are rarely "pure" key=value: they usually have a free-text
// prefix (timestamp, level, message) and/or suffix (logger name), with the
// structured fields only in the middle, e.g.:
//   2026-09-06 14:00:32.408 [TRACE] Processing request duration_ms=45,
//   status_code=200, path=/api/v1/users [com.app.queue.KafkaListener]
// So instead of requiring the WHOLE line to parse as key=value (which fails
// the moment there's any surrounding text), we scan for an embedded RUN of
// 2+ "key=value" / "key:value" tokens - separated by any mix of whitespace,
// comma, semicolon or pipe - and format only that run, leaving the rest of
// the line untouched.

// A single token, e.g. status_code=200, path=/api/v1/users, or msg="hi, x".
// The key must start with a letter/underscore so things like the "14" in a
// "14:00:32.408" timestamp are never mistaken for a key. Unquoted values
// exclude '<' and '>': without this, something like "provider: <Envelope"
// would get greedily swallowed as the value of "provider", eating straight
// into an XML tag that the XML pass already protected and pretty-printed --
// producing bogus extra line breaks around it.
const KV_TOKEN_SRC = String.raw`[A-Za-z_][\w.\-/]*\s*[=:]\s*(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s,;|<>]+)`
// A run of one or more tokens separated only by whitespace/comma/semicolon/pipe.
const KV_RUN_RE = new RegExp(`${KV_TOKEN_SRC}(?:[\\s,;|]+${KV_TOKEN_SRC})*`, 'y')

function parseKvTokens(run: string): Array<{ key: string; sep: string; value: string }> {
  const tokens: Array<{ key: string; sep: string; value: string }> = []
  const tokenRe = new RegExp(KV_TOKEN_SRC, 'g')
  let m: RegExpExecArray | null
  while ((m = tokenRe.exec(run)) !== null) {
    const kv = m[0].match(/^([A-Za-z_][\w.\-/]*)\s*([=:])\s*([\s\S]*)$/)
    if (kv) tokens.push({ key: kv[1], sep: kv[2], value: kv[3] })
  }
  return tokens
}

function formatKvTokens(tokens: Array<{ key: string; sep: string; value: string }>): string {
  const sorted = [...tokens].sort((a, b) => a.key.localeCompare(b.key))
  const maxKeyLen = sorted.reduce((max, t) => Math.max(max, t.key.length), 0)
  return sorted.map(t => `${t.key.padEnd(maxKeyLen)} ${t.sep} ${t.value}`).join('\n')
}

// Finds runs of 2+ key=value tokens and replaces each with a sorted, aligned
// block, skipping ranges already protected by the JSON/XML passes. Returns
// the combined protected ranges so the final separator pass leaves the new
// KV blocks alone too.
function prettyKvBlocks(
  text: string,
  incomingProtected: ProtectedRange[]
): { text: string; protectedRanges: ProtectedRange[] } {
  let output = ''
  const protectedRanges: ProtectedRange[] = []
  let i = 0

  const incomingAt = (pos: number) => incomingProtected.find(r => pos >= r.start && pos < r.end)

  while (i < text.length) {
    const incoming = incomingAt(i)
    if (incoming) {
      const start = output.length
      output += text.slice(i, incoming.end)
      protectedRanges.push({ start, end: output.length })
      i = incoming.end
      continue
    }

    KV_RUN_RE.lastIndex = i
    const match = KV_RUN_RE.exec(text)
    if (match) {
      const tokens = parseKvTokens(match[0])
      if (tokens.length >= 2) {
        output = output.replace(/[ \t]+$/, '') // don't leave a trailing space before the block
        const start = output.length
        output += `\n${formatKvTokens(tokens)}\n`
        protectedRanges.push({ start, end: output.length })
        i += match[0].length
        while (i < text.length && (text[i] === ' ' || text[i] === '\t')) i++ // nor a leading one after it
        continue
      }
    }

    output += text[i]
    i++
  }

  return { text: output, protectedRanges }
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

// ── Line-level orchestration ──────────────────────────────────────────────────

// Maps protected character ranges to the line indices they fall on, so lines
// coming out of the JSON/XML/KV pretty-printers (which have their own
// internal commas, colons, etc.) are never re-split by the generic separator
// pass below.
function computeProtectedLineIndices(text: string, ranges: ProtectedRange[]): Set<number> {
  const indices = new Set<number>()
  if (ranges.length === 0) return indices
  let line = 0
  for (let pos = 0; pos < text.length; pos++) {
    if (text[pos] === '\n') { line++; continue }
    if (ranges.some(r => pos >= r.start && pos < r.end)) indices.add(line)
  }
  return indices
}

function applySeparatorFormatting(text: string, protectedLines: Set<number>): string {
  return text.split('\n').map((line, idx) => {
    if (protectedLines.has(idx)) return line
    return splitHumanSeparators(line)
  }).join('\n')
}

// ── Main formatter ────────────────────────────────────────────────────────────

function formatForInspect(text: string, fixFields: FixFieldMap | null): string {
  if (fixFields && fixFields.size > 0 && looksLikeFix(text)) {
    return formatFix(text, fixFields)
  }
  const { text: withJson, protectedRanges: jsonProtected } = prettyJsonBlocks(text)
  const { text: withXml, protectedRanges: xmlProtected } = prettyXmlBlocks(withJson, jsonProtected)
  const { text: withKv, protectedRanges: kvProtected } = prettyKvBlocks(withXml, xmlProtected)
  const protectedLines = computeProtectedLineIndices(withKv, kvProtected)
  return applySeparatorFormatting(withKv, protectedLines)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SelectedLinePanel() {
  const { activeSessionId } = useTabStore()
  const { getSelectedLine } = useLogStore()
  const [search, setSearch] = useState('')
  const [activeMatch, setActiveMatch] = useState(0)
  const activeMatchRef = useRef<HTMLElement | null>(null)
  const [fixFields, setFixFields] = useState<FixFieldMap | null>(null)
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    ensureFixFields().then(fields => setFixFields(buildFixFieldMap(fields)))
  }, [])

  const line = activeSessionId ? getSelectedLine(activeSessionId) : null
  const displayText = line ? (showRaw ? line.text : formatForInspect(line.text, fixFields)) : null

  const searchRegex = useMemo(() => {
    if (!search.trim()) return null
    return new RegExp(`(${escapeRegExp(search.trim())})`, 'gi')
  }, [search])

  const matchCount = useMemo(() => {
    if (!displayText || !searchRegex) return 0
    return displayText.match(searchRegex)?.length ?? 0
  }, [displayText, searchRegex])

  useEffect(() => {
    setActiveMatch(0)
    setSearch('')
  }, [line?.lineNumber])

  useEffect(() => {
    activeMatchRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeMatch, displayText])

  const renderedContent = useMemo(() => {
    if (!displayText) return null
    if (!searchRegex) return displayText

    const parts = displayText.split(searchRegex)
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
  }, [displayText, searchRegex, activeMatch])

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
          <label className="inspect-raw-toggle">
            <input
              type="checkbox"
              checked={showRaw}
              onChange={event => setShowRaw(event.target.checked)}
            />
            Texte brut
          </label>
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
