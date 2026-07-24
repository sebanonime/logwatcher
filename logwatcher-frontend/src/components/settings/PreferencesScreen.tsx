import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getPreferences, savePreferences } from '../../api/settings'
import { usePreferencesStore } from '../../store/preferencesStore'
import { useUiStore } from '../../store/uiStore'
import type {
  HiddenLineDto,
  HighlightingRule,
  PreferencesPayloadDto,
  ProfileDto,
  StoredFilterDto,
  UserFontFamily,
} from '../../types'

interface PreferencesScreenProps {
  onClose: () => void
}

const FONT_OPTIONS: UserFontFamily[] = ['Cascadia Code', 'Consolas', 'Segoe UI', 'Bahnschrift']

function emptyHighlight(order: number): HighlightingRule {
  return {
    order,
    text: '',
    foreColorArgb: -1,
    backColorArgb: 0,
    darkForeColorArgb: -1,
    darkBackColorArgb: 0,
    lightForeColorArgb: 0,
    lightBackColorArgb: 0,
    bold: false,
    hightPriority: false,
    caseSensitive: false,
    isRegex: false,
  }
}

function emptyHiddenLine(): HiddenLineDto {
  return { isActif: true, text: '', caseSensitive: false, isRegex: false }
}

function emptyStoredFilter(order: number): StoredFilterDto {
  return { name: `Filter ${order + 1}`, filter: '', isRegex: true, caseSensitive: false }
}

function emptyProfile(name = 'New Profile'): ProfileDto {
  return { name, loadingParam: '', encoding: 'UTF-8', shared: false, dicoHighLighting: [], dicoHiddenLog: [], dicoStoredFilter: [] }
}

function argbToHex(argb: number | undefined, fallback: string): string {
  if (argb === undefined || argb === 0 || argb === -1) return fallback
  const rgb = argb & 0xFFFFFF
  return `#${rgb.toString(16).padStart(6, '0')}`
}

function hexToArgb(hex: string): number {
  const rgb = Number.parseInt(hex.replace('#', ''), 16) & 0xFFFFFF
  return (0xFF000000 | rgb) >> 0
}

function argbToCss(argb: number | undefined, fallback: string): string {
  if (argb === undefined || argb === -1 || argb === 0) return fallback
  const r = (argb >> 16) & 0xFF
  const g = (argb >> 8) & 0xFF
  const b = argb & 0xFF
  return `rgb(${r},${g},${b})`
}

function isColorSet(argb: number | undefined): boolean {
  return argb !== undefined && argb !== 0 && argb !== -1
}

function resolveColor(primary: number | undefined, fallback1: number | undefined, fallback2: number | undefined, defaultCss: string): string {
  for (const v of [primary, fallback1, fallback2]) {
    if (isColorSet(v)) return argbToCss(v, defaultCss)
  }
  return defaultCss
}

function ColorSwatch({ value, fallback, onChange, canClear, onClear, title }: {
  value: number | undefined
  fallback: string
  onChange: (argb: number) => void
  canClear?: boolean
  onClear?: () => void
  title?: string
}) {
  const id = React.useId()
  const isEmpty = !value || value === 0
  const hex = argbToHex(value, fallback)
  const cssColor = argbToCss(value, fallback)
  return (
    <span className="color-swatch-wrap" title={title}>
      <label htmlFor={id} className="color-swatch-label" style={{ background: cssColor, borderColor: isEmpty ? 'var(--border-strong)' : cssColor }}>
        {isEmpty && <span className="color-swatch-empty">—</span>}
      </label>
      <input id={id} type="color" className="color-swatch-input" value={hex} onChange={e => onChange(hexToArgb(e.target.value))} />
      {canClear && !isEmpty && (
        <button type="button" className="color-swatch-clear" title="Clear" onClick={onClear}>✕</button>
      )}
    </span>
  )
}

function HighlightListEditor({ title, rules, onChange }: {
  title: string
  rules: HighlightingRule[]
  onChange: (rules: HighlightingRule[]) => void
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(rules.length > 0 ? 0 : null)
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map())

  useEffect(() => {
    if (rules.length === 0) { setSelectedIndex(null); return }
    if (selectedIndex === null || selectedIndex >= rules.length) setSelectedIndex(0)
  }, [rules, selectedIndex])

  const updateRule = (index: number, patch: Partial<HighlightingRule>) =>
    onChange(rules.map((rule, i) => i === index ? { ...rule, ...patch } : rule))

  const removeRule = (index: number) => {
    const next = rules.filter((_, i) => i !== index).map((r, i) => ({ ...r, order: i }))
    onChange(next)
    setSelectedIndex(next.length === 0 ? null : selectedIndex !== null && selectedIndex >= next.length ? next.length - 1 : selectedIndex)
  }

  const moveRule = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= rules.length) return
    const next = [...rules]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next.map((r, i) => ({ ...r, order: i })))
    setSelectedIndex(target)
    requestAnimationFrame(() => {
      itemRefs.current.get(target)?.scrollIntoView({ block: 'nearest' })
    })
  }

  const addRule = () => {
    onChange([...rules, emptyHighlight(rules.length)])
    setSelectedIndex(rules.length)
  }

  const cloneRule = () => {
    if (selectedIndex === null) return
    const clone = { ...rules[selectedIndex] }
    const next = [
      ...rules.slice(0, selectedIndex + 1),
      clone,
      ...rules.slice(selectedIndex + 1),
    ].map((r, i) => ({ ...r, order: i }))
    onChange(next)
    setSelectedIndex(selectedIndex + 1)
  }

  const selectedRule = selectedIndex === null ? null : (rules[selectedIndex] ?? null)

  return (
    <section className="settings-card">
      <div className="settings-card__header highlight-toolbar-row">
        <input className="control-input highlight-pattern-input" value={selectedRule?.text ?? ''}
          placeholder="Pattern"
          disabled={!selectedRule}
          onChange={e => selectedIndex !== null && updateRule(selectedIndex, { text: e.target.value })} />
        <label className="settings-inline-check">
          <input type="checkbox" checked={selectedRule?.isRegex ?? false} disabled={!selectedRule}
            onChange={e => selectedIndex !== null && updateRule(selectedIndex, { isRegex: e.target.checked })} />Regex</label>
        <label className="settings-inline-check">
          <input type="checkbox" checked={selectedRule?.caseSensitive ?? false} disabled={!selectedRule}
            onChange={e => selectedIndex !== null && updateRule(selectedIndex, { caseSensitive: e.target.checked })} />Case</label>
        <label className="settings-inline-check">
          <input type="checkbox" checked={selectedRule?.bold ?? false} disabled={!selectedRule}
            onChange={e => selectedIndex !== null && updateRule(selectedIndex, { bold: e.target.checked })} />Bold</label>
        <label className="settings-inline-check">
          <input type="checkbox" checked={selectedRule?.hightPriority ?? false} disabled={!selectedRule}
            onChange={e => selectedIndex !== null && updateRule(selectedIndex, { hightPriority: e.target.checked })} />Priority</label>
        <div className="highlight-reorder-controls">
          <button className="highlight-reorder-btn-main" title="Move up"
            disabled={selectedIndex === null || selectedIndex === 0}
            onClick={() => selectedIndex !== null && moveRule(selectedIndex, -1)}>▲</button>
          <button className="highlight-reorder-btn-main" title="Move down"
            disabled={selectedIndex === null || selectedIndex === rules.length - 1}
            onClick={() => selectedIndex !== null && moveRule(selectedIndex, 1)}>▼</button>
        </div>
        <button className="control-button control-button--ghost" onClick={addRule}>Add</button>
        <button className="control-button control-button--ghost" onClick={cloneRule}
          disabled={selectedIndex === null}>Clone</button>
        <button className="control-button control-button--ghost"
          onClick={() => selectedIndex !== null && removeRule(selectedIndex)}
          disabled={selectedIndex === null}>Delete</button>
      </div>

      {selectedRule ? (
        <div className="highlight-editor-pane">
          <div className="highlight-theme-inline-row">
            <div className="highlight-theme-cell highlight-theme-cell--dark">
              <span className="highlight-theme-badge">◑</span>
              <span className="highlight-theme-field-label">Text</span>
              <ColorSwatch value={selectedRule.darkForeColorArgb || selectedRule.foreColorArgb} fallback="#ffffff"
                title="Dark theme text color"
                onChange={v => updateRule(selectedIndex!, { darkForeColorArgb: v, foreColorArgb: v })}
                canClear={isColorSet(selectedRule.darkForeColorArgb)}
                onClear={() => updateRule(selectedIndex!, { darkForeColorArgb: -1, foreColorArgb: -1 })} />
              <span className="highlight-theme-field-label">Background</span>
              <ColorSwatch value={selectedRule.darkBackColorArgb || selectedRule.backColorArgb || undefined} fallback="#1b2533"
                title="Dark theme background (empty = none)"
                onChange={v => updateRule(selectedIndex!, { darkBackColorArgb: v, backColorArgb: v })}
                canClear onClear={() => updateRule(selectedIndex!, { darkBackColorArgb: 0, backColorArgb: 0 })} />
            </div>
            <div className="highlight-theme-cell highlight-theme-cell--light">
              <span className="highlight-theme-badge">◐</span>
              <span className="highlight-theme-field-label">Text</span>
              <ColorSwatch value={selectedRule.lightForeColorArgb || undefined} fallback="#000000"
                title="Light theme text color (empty = use dark)"
                onChange={v => updateRule(selectedIndex!, { lightForeColorArgb: v })}
                canClear={!!(selectedRule.lightForeColorArgb)}
                onClear={() => updateRule(selectedIndex!, { lightForeColorArgb: 0 })} />
              <span className="highlight-theme-field-label">Background</span>
              <ColorSwatch value={selectedRule.lightBackColorArgb || undefined} fallback="#ffffff"
                title="Light theme background (empty = none)"
                onChange={v => updateRule(selectedIndex!, { lightBackColorArgb: v })}
                canClear onClear={() => updateRule(selectedIndex!, { lightBackColorArgb: 0 })} />
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state compact-empty-state">Select or add a highlight rule.</div>
      )}

      <div className="highlight-editor-list">
        {rules.length === 0 && <div className="empty-state compact-empty-state">No highlights configured.</div>}
        {rules.map((rule, index) => {
          const darkHasFore = isColorSet(rule.darkForeColorArgb) || isColorSet(rule.foreColorArgb)
          const lightHasFore = isColorSet(rule.lightForeColorArgb)
          return (
          <div key={`${title}-${index}`}
            ref={el => { if (el) itemRefs.current.set(index, el); else itemRefs.current.delete(index) }}
            className={`highlight-editor-row highlight-editor-row--compact ${selectedIndex === index ? 'highlight-editor-row--active' : ''}`}
            onClick={() => setSelectedIndex(index)}>
            <div className="highlight-preview">
              <div className={`highlight-preview-swatch highlight-preview-swatch--dark${!darkHasFore ? ' highlight-preview-swatch--fallback' : ''}`}>
                <span className="highlight-preview-label" title={!darkHasFore ? 'No dark colors — using fallback' : undefined}>{darkHasFore ? '◑' : '~◑'}</span>
                <span className="highlight-preview-text" style={{
                  color: resolveColor(rule.darkForeColorArgb, rule.lightForeColorArgb, rule.foreColorArgb, '#ffffff'),
                  backgroundColor: resolveColor(rule.darkBackColorArgb, rule.lightBackColorArgb, rule.backColorArgb, 'transparent'),
                  fontWeight: rule.bold ? 'bold' : undefined,
                }}>{rule.text || 'Sample text'}</span>
              </div>
              <div className={`highlight-preview-swatch highlight-preview-swatch--light${!lightHasFore ? ' highlight-preview-swatch--fallback' : ''}`}>
                <span className="highlight-preview-label" title={!lightHasFore ? 'No light colors — using fallback' : undefined}>{lightHasFore ? '◐' : '~◐'}</span>
                <span className="highlight-preview-text" style={{
                  color: resolveColor(rule.lightForeColorArgb, rule.darkForeColorArgb, rule.foreColorArgb, '#000000'),
                  backgroundColor: resolveColor(rule.lightBackColorArgb, rule.darkBackColorArgb, rule.backColorArgb, 'transparent'),
                  fontWeight: rule.bold ? 'bold' : undefined,
                }}>{rule.text || 'Sample text'}</span>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}

export function PreferencesScreen({ onClose }: PreferencesScreenProps) {
  const { defaultHighlights, profiles, setPreferences } = usePreferencesStore()
  const { theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize, showLineWatchdogPanel, setShowLineWatchdogPanel } = useUiStore()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'prefs' | 'highlights' | 'profiles' | 'admin'>('profiles')
  const [defaultsDraft, setDefaultsDraft] = useState<HighlightingRule[]>([])
  const [profilesDraft, setProfilesDraft] = useState<ProfileDto[]>([])
  const [themeDraft, setThemeDraft] = useState<'dark' | 'light'>(theme)
  const [fontFamilyDraft, setFontFamilyDraft] = useState<UserFontFamily>(fontFamily)
  const [fontSizeDraft, setFontSizeDraft] = useState<number>(fontSize)
  const [showLineWatchdogPanelDraft, setShowLineWatchdogPanelDraft] = useState<boolean>(showLineWatchdogPanel)
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number | null>(null)
  const [selectedStoredFilterIndex, setSelectedStoredFilterIndex] = useState<number | null>(null)
  const [activeProfileTab, setActiveProfileTab] = useState<'highlight' | 'hidden' | 'stored'>('highlight')

  useEffect(() => {
    getPreferences()
      .then((payload) => {
        setPreferences(payload)
        setDefaultsDraft(payload.defaultHighlights ?? [])
        setProfilesDraft(payload.profiles ?? [])
        setThemeDraft(theme)
        setFontFamilyDraft(fontFamily)
        setFontSizeDraft(fontSize)
        setSelectedProfileIndex(payload.profiles.length > 0 ? 0 : null)
        setSelectedStoredFilterIndex(payload.profiles[0]?.dicoStoredFilter?.length ? 0 : null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load preferences.'))
  }, [setPreferences, theme, fontFamily, fontSize])

  useEffect(() => { setDefaultsDraft(defaultHighlights) }, [defaultHighlights])

  useEffect(() => {
    setProfilesDraft(profiles)
    if (profiles.length > 0 && selectedProfileIndex === null) setSelectedProfileIndex(0)
  }, [profiles]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedProfileIndex === null) { setSelectedStoredFilterIndex(null); return }
    const filters = profilesDraft[selectedProfileIndex]?.dicoStoredFilter ?? []
    setSelectedStoredFilterIndex(filters.length > 0 ? 0 : null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfileIndex])

  const selectedProfile = useMemo(
    () => selectedProfileIndex === null ? null : (profilesDraft[selectedProfileIndex] ?? null),
    [profilesDraft, selectedProfileIndex]
  )

  const selectedStoredFilter = useMemo(() => {
    if (!selectedProfile || selectedStoredFilterIndex === null) return null
    return selectedProfile.dicoStoredFilter?.[selectedStoredFilterIndex] ?? null
  }, [selectedProfile, selectedStoredFilterIndex])

  const updateSelectedProfile = (patch: Partial<ProfileDto>) => {
    if (selectedProfileIndex === null || !selectedProfile) return
    setProfilesDraft(profilesDraft.map((p, i) => i === selectedProfileIndex ? { ...p, ...patch } : p))
  }

  const updateSelectedStoredFilter = (patch: Partial<StoredFilterDto>) => {
    if (!selectedProfile || selectedStoredFilterIndex === null) return
    const current = selectedProfile.dicoStoredFilter ?? []
    updateSelectedProfile({ dicoStoredFilter: current.map((item, i) => i === selectedStoredFilterIndex ? { ...item, ...patch } : item) })
  }

  const createProfile = () => {
    const profile = emptyProfile(`Profile ${profilesDraft.length + 1}`)
    setProfilesDraft([...profilesDraft, profile])
    setSelectedProfileIndex(profilesDraft.length)
    setSelectedStoredFilterIndex(null)
  }

  const removeSelectedProfile = () => {
    if (selectedProfileIndex === null) return
    const next = profilesDraft.filter((_, i) => i !== selectedProfileIndex)
    setProfilesDraft(next)
    setSelectedProfileIndex(next.length > 0 ? 0 : null)
    setSelectedStoredFilterIndex(next[0]?.dicoStoredFilter?.length ? 0 : null)
  }

  const addHiddenLine = () => {
    if (!selectedProfile) return
    updateSelectedProfile({ dicoHiddenLog: [...(selectedProfile.dicoHiddenLog ?? []), emptyHiddenLine()] })
  }

  const updateHiddenLine = (index: number, patch: Partial<HiddenLineDto>) => {
    if (!selectedProfile) return
    updateSelectedProfile({ dicoHiddenLog: (selectedProfile.dicoHiddenLog ?? []).map((l, i) => i === index ? { ...l, ...patch } : l) })
  }

  const removeHiddenLine = (index: number) => {
    if (!selectedProfile) return
    updateSelectedProfile({ dicoHiddenLog: (selectedProfile.dicoHiddenLog ?? []).filter((_, i) => i !== index) })
  }

  const addStoredFilter = () => {
    if (!selectedProfile) return
    const current = selectedProfile.dicoStoredFilter ?? []
    const next = [...current, emptyStoredFilter(current.length)]
    updateSelectedProfile({ dicoStoredFilter: next })
    setSelectedStoredFilterIndex(next.length - 1)
  }

  const removeStoredFilter = () => {
    if (!selectedProfile || selectedStoredFilterIndex === null) return
    const next = (selectedProfile.dicoStoredFilter ?? []).filter((_, i) => i !== selectedStoredFilterIndex)
    updateSelectedProfile({ dicoStoredFilter: next })
    setSelectedStoredFilterIndex(next.length > 0 ? 0 : null)
  }

  const saveAll = async () => {
    setIsSaving(true)
    setError(null)
    try {
      const payload: PreferencesPayloadDto = { defaultHighlights: defaultsDraft, profiles: profilesDraft }
      const saved = await savePreferences(payload)
      setTheme(themeDraft)
      setFontFamily(fontFamilyDraft)
      setFontSize(fontSizeDraft)
      setShowLineWatchdogPanel(showLineWatchdogPanelDraft)
      setPreferences(saved)
      setDefaultsDraft(saved.defaultHighlights ?? [])
      setProfilesDraft(saved.profiles ?? [])
      setSelectedProfileIndex(saved.profiles.length > 0 ? 0 : null)
      setSelectedStoredFilterIndex(saved.profiles[0]?.dicoStoredFilter?.length ? 0 : null)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save preferences.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="settings-overlay">
      <div className="settings-screen">
        <div className="settings-screen__header">
          <div>
            <h2>Preferences</h2>
          </div>
          <div className="settings-actions-row">
            <button className="control-button control-button--primary" onClick={saveAll} disabled={isSaving}>Save</button>
            <button className="control-button control-button--ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>

        {error && <div className="settings-error">{error}</div>}

        <div className="settings-tab-bar">
          <button className={`settings-tab-btn ${activeTab === 'profiles' ? 'settings-tab-btn--active' : ''}`} onClick={() => setActiveTab('profiles')}>Profiles</button>
          <button className={`settings-tab-btn ${activeTab === 'highlights' ? 'settings-tab-btn--active' : ''}`} onClick={() => setActiveTab('highlights')}>Default highlights</button>
          <button className={`settings-tab-btn ${activeTab === 'prefs' ? 'settings-tab-btn--active' : ''}`} onClick={() => setActiveTab('prefs')}>User preferences</button>
          <button className={`settings-tab-btn ${activeTab === 'admin' ? 'settings-tab-btn--active' : ''}`} onClick={() => setActiveTab('admin')}>Admin</button>
        </div>

        <div className="settings-tab-content">
          {activeTab === 'prefs' && (
            <section className="settings-card">
              <div className="settings-form-grid">
                <label>Theme
                  <select className="control-input" value={themeDraft} onChange={e => setThemeDraft(e.target.value as 'dark' | 'light')}>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </label>
                <label>Font
                  <select className="control-input" value={fontFamilyDraft} onChange={e => setFontFamilyDraft(e.target.value as UserFontFamily)}>
                    {FONT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
                <label>Text size
                  <input className="control-input" type="number" min={10} max={22} value={fontSizeDraft} onChange={e => setFontSizeDraft(Number(e.target.value))} />
                </label>
              </div>
            </section>
          )}

          {activeTab === 'highlights' && (
            <HighlightListEditor title="Default highlights" rules={defaultsDraft} onChange={setDefaultsDraft} />
          )}

          {activeTab === 'admin' && (
            <section className="settings-card">
              <label className="settings-inline-check">
                <input
                  type="checkbox"
                  checked={showLineWatchdogPanelDraft}
                  onChange={e => setShowLineWatchdogPanelDraft(e.target.checked)}
                />
                Show Line Watchdog panel
              </label>
              <p className="control-label">
                Displays the diagnostic Line Watchdog panel in the inspector rail (missing/stalled line
                detection). This only affects your own browser — other users are not impacted.
              </p>
            </section>
          )}

          {activeTab === 'profiles' && (
            <section className="settings-card settings-profiles-card">
              <div className="settings-split-layout">
                <div className="settings-list-column">
                  <div className="settings-list-actions">
                    <button className="control-button control-button--ghost" onClick={createProfile}>New</button>
                    <button className="control-button control-button--ghost" onClick={removeSelectedProfile} disabled={!selectedProfile}>Delete</button>
                  </div>
                  <div className="settings-list-panel">
                    {profilesDraft.map((profile, index) => (
                      <button key={`${profile.name}-${index}`}
                        className={`settings-list-item ${selectedProfileIndex === index ? 'settings-list-item--active' : ''}`}
                        onClick={() => { setSelectedProfileIndex(index); setSelectedStoredFilterIndex(profile.dicoStoredFilter?.length ? 0 : null) }}>
                        {profile.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="settings-detail-panel">
                  {selectedProfile ? (
                    <>
                      <div className="settings-form-grid">
                        <label>Profile name
                          <input className="control-input" value={selectedProfile.name} onChange={e => updateSelectedProfile({ name: e.target.value })} />
                        </label>
                        <label>Encoding
                          <input className="control-input" value={selectedProfile.encoding ?? 'UTF-8'} onChange={e => updateSelectedProfile({ encoding: e.target.value })} />
                        </label>
                        <label>File pattern (to load profile automatically)
                          <input className="control-input" value={selectedProfile.loadingParam ?? ''} onChange={e => updateSelectedProfile({ loadingParam: e.target.value })} />
                        </label>
                      </div>

                      <div className="settings-actions-row profile-tabs">
                        <button className={`control-chip ${activeProfileTab === 'highlight' ? 'control-chip--active' : ''}`} onClick={() => setActiveProfileTab('highlight')}>Highlight</button>
                        <button className={`control-chip ${activeProfileTab === 'hidden' ? 'control-chip--active' : ''}`} onClick={() => setActiveProfileTab('hidden')}>Hidden lines</button>
                        <button className={`control-chip ${activeProfileTab === 'stored' ? 'control-chip--active' : ''}`} onClick={() => setActiveProfileTab('stored')}>Stored filter</button>
                      </div>

                      {activeProfileTab === 'highlight' && (
                        <HighlightListEditor title="Profile highlights"
                          rules={selectedProfile.dicoHighLighting ?? []}
                          onChange={rules => updateSelectedProfile({ dicoHighLighting: rules })} />
                      )}

                      {activeProfileTab === 'hidden' && (
                        <section className="settings-card">
                          <div className="settings-card__header">
                            <button className="control-button control-button--ghost" onClick={addHiddenLine}>Add</button>
                          </div>
                          <div className="settings-list-panel">
                            {(selectedProfile.dicoHiddenLog ?? []).length === 0 && <div className="empty-state compact-empty-state">No hidden lines configured.</div>}
                            {(selectedProfile.dicoHiddenLog ?? []).map((line, index) => (
                              <div key={`hidden-${index}`} className="settings-row-line">
                                <input className="control-input" value={line.text} placeholder="Pattern" onChange={e => updateHiddenLine(index, { text: e.target.value })} />
                                <label className="settings-inline-check"><input type="checkbox" checked={line.isRegex} onChange={e => updateHiddenLine(index, { isRegex: e.target.checked })} />Regex</label>
                                <label className="settings-inline-check"><input type="checkbox" checked={line.caseSensitive} onChange={e => updateHiddenLine(index, { caseSensitive: e.target.checked })} />Case</label>
                                <label className="settings-inline-check"><input type="checkbox" checked={line.isActif} onChange={e => updateHiddenLine(index, { isActif: e.target.checked })} />Active</label>
                                <button className="control-button control-button--ghost" onClick={() => removeHiddenLine(index)}>Delete</button>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {activeProfileTab === 'stored' && (
                        <section className="settings-card">
                          <div className="settings-card__header">
                            <div className="settings-actions-row">
                              <button className="control-button control-button--ghost" onClick={addStoredFilter}>Add</button>
                              <button className="control-button control-button--ghost" onClick={removeStoredFilter} disabled={!selectedStoredFilter}>Delete</button>
                            </div>
                          </div>
                          <div className="settings-form-grid">
                            <label>Stored filter
                              <select className="control-input" value={selectedStoredFilterIndex ?? ''}
                                onChange={e => setSelectedStoredFilterIndex(e.target.value === '' ? null : Number(e.target.value))}>
                                <option value="">Select a filter</option>
                                {(selectedProfile.dicoStoredFilter ?? []).map((f, i) => (
                                  <option key={`${f.name}-${i}`} value={i}>{f.name}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                          {selectedStoredFilter ? (
                            <div className="settings-form-grid settings-form-grid--stacked">
                              <label>Name
                                <input className="control-input" value={selectedStoredFilter.name} onChange={e => updateSelectedStoredFilter({ name: e.target.value })} />
                              </label>
                              <label>Filter
                                <textarea className="control-input settings-stored-filter-textarea" rows={3} value={selectedStoredFilter.filter} onChange={e => updateSelectedStoredFilter({ filter: e.target.value })} />
                              </label>
                              <div className="highlight-flags-row">
                                <label className="settings-inline-check"><input type="checkbox" checked={selectedStoredFilter.isRegex} onChange={e => updateSelectedStoredFilter({ isRegex: e.target.checked })} />Regex</label>
                                <label className="settings-inline-check"><input type="checkbox" checked={selectedStoredFilter.caseSensitive} onChange={e => updateSelectedStoredFilter({ caseSensitive: e.target.checked })} />Case sensitive</label>
                              </div>
                            </div>
                          ) : (
                            <div className="empty-state compact-empty-state">Select or create a stored filter.</div>
                          )}
                        </section>
                      )}
                    </>
                  ) : (
                    <div className="empty-state compact-empty-state">Select or create a profile.</div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
