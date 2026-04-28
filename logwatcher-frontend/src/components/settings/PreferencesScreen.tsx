import React, { useEffect, useMemo, useState } from 'react'
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
    lightForeColorArgb: -16777216,
    lightBackColorArgb: 0,
    bold: false,
    hightPriority: false,
    caseSensitive: false,
    isRegex: false,
  }
}

function emptyHiddenLine(): HiddenLineDto {
  return {
    isActif: true,
    text: '',
    caseSensitive: false,
    isRegex: false,
  }
}

function emptyStoredFilter(order: number): StoredFilterDto {
  return {
    name: `Filter ${order + 1}`,
    filter: '',
    isRegex: true,
    caseSensitive: false,
  }
}

function emptyProfile(name = 'New Profile'): ProfileDto {
  return {
    name,
    loadingParam: '',
    encoding: 'UTF-8',
    shared: false,
    dicoHighLighting: [],
    dicoHiddenLog: [],
    dicoStoredFilter: [],
  }
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

function HighlightListEditor({
  title,
  rules,
  onChange,
}: {
  title: string
  rules: HighlightingRule[]
  onChange: (rules: HighlightingRule[]) => void
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(rules.length > 0 ? 0 : null)

  useEffect(() => {
    if (rules.length === 0) {
      setSelectedIndex(null)
      return
    }
    if (selectedIndex === null || selectedIndex >= rules.length)
      setSelectedIndex(0)
  }, [rules, selectedIndex])

  const updateRule = (index: number, patch: Partial<HighlightingRule>) => {
    onChange(rules.map((rule, current) => current === index ? { ...rule, ...patch } : rule))
  }

  const removeRule = (index: number) => {
    const nextRules = rules.filter((_, current) => current !== index).map((rule, order) => ({ ...rule, order }))
    onChange(nextRules)
    if (nextRules.length === 0) {
      setSelectedIndex(null)
    } else if (selectedIndex !== null && selectedIndex >= nextRules.length) {
      setSelectedIndex(nextRules.length - 1)
    }
  }

  const addRule = () => {
    onChange([...rules, emptyHighlight(rules.length)])
    setSelectedIndex(rules.length)
  }

  const selectedRule = selectedIndex === null ? null : (rules[selectedIndex] ?? null)
  const darkBgAuto = selectedRule ? !selectedRule.darkBackColorArgb : true
  const lightBgAuto = selectedRule ? !selectedRule.lightBackColorArgb : true

  return (
    <section className="settings-card">
      <div className="settings-card__header">
        <h3>{title}</h3>
        <div className="settings-actions-row">
          <button className="control-button control-button--ghost" onClick={addRule}>Add highlight</button>
          <button
            className="control-button control-button--ghost"
            onClick={() => selectedIndex !== null && removeRule(selectedIndex)}
            disabled={selectedIndex === null}
          >
            Delete selected
          </button>
        </div>
      </div>

      {selectedRule ? (
        <div className="highlight-editor-pane">
          <div className="highlight-editor-controls">
            <input
              className="control-input"
              value={selectedRule.text}
              placeholder="Pattern"
              onChange={event => updateRule(selectedIndex!, { text: event.target.value })}
            />
            <label className="settings-inline-check"><input type="checkbox" checked={selectedRule.isRegex} onChange={event => updateRule(selectedIndex!, { isRegex: event.target.checked })} />Regex</label>
            <label className="settings-inline-check"><input type="checkbox" checked={selectedRule.caseSensitive} onChange={event => updateRule(selectedIndex!, { caseSensitive: event.target.checked })} />Case</label>
            <label className="settings-inline-check"><input type="checkbox" checked={selectedRule.bold} onChange={event => updateRule(selectedIndex!, { bold: event.target.checked })} />Bold</label>
            <label className="settings-inline-check"><input type="checkbox" checked={selectedRule.hightPriority} onChange={event => updateRule(selectedIndex!, { hightPriority: event.target.checked })} />Priority</label>
            <div className="highlight-color-pair">
              <span>Dark</span>
              <input
                type="color"
                value={argbToHex(selectedRule.darkForeColorArgb ?? selectedRule.foreColorArgb, '#ffffff')}
                onChange={event => updateRule(selectedIndex!, { darkForeColorArgb: hexToArgb(event.target.value) })}
              />
              <input
                type="color"
                value={argbToHex(selectedRule.darkBackColorArgb, '#1b2533')}
                disabled={darkBgAuto}
                onChange={event => updateRule(selectedIndex!, { darkBackColorArgb: hexToArgb(event.target.value) })}
              />
              <label className="settings-inline-check"><input type="checkbox" checked={darkBgAuto} onChange={event => updateRule(selectedIndex!, { darkBackColorArgb: event.target.checked ? 0 : hexToArgb('#1b2533') })} />Auto BG</label>
            </div>
            <div className="highlight-color-pair">
              <span>Light</span>
              <input
                type="color"
                value={argbToHex(selectedRule.lightForeColorArgb ?? selectedRule.foreColorArgb, '#000000')}
                onChange={event => updateRule(selectedIndex!, { lightForeColorArgb: hexToArgb(event.target.value) })}
              />
              <input
                type="color"
                value={argbToHex(selectedRule.lightBackColorArgb, '#ffffff')}
                disabled={lightBgAuto}
                onChange={event => updateRule(selectedIndex!, { lightBackColorArgb: hexToArgb(event.target.value) })}
              />
              <label className="settings-inline-check"><input type="checkbox" checked={lightBgAuto} onChange={event => updateRule(selectedIndex!, { lightBackColorArgb: event.target.checked ? 0 : hexToArgb('#ffffff') })} />Auto BG</label>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state compact-empty-state">Select or add a highlight rule.</div>
      )}

      <div className="highlight-editor-list">
        {rules.length === 0 && <div className="empty-state compact-empty-state">No highlights configured.</div>}
        {rules.map((rule, index) => {
          return (
            <button
              type="button"
              key={`${title}-${index}`}
              className={`highlight-editor-row highlight-editor-row--compact ${selectedIndex === index ? 'highlight-editor-row--active' : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
              <div className="highlight-preview">
                <div className="highlight-preview-swatch highlight-preview-swatch--dark">
                  <span className="highlight-preview-label">◑ Dark</span>
                  <span className="highlight-preview-text" style={{
                    color: argbToCss(rule.darkForeColorArgb ?? rule.foreColorArgb, '#ffffff'),
                    backgroundColor: argbToCss(rule.darkBackColorArgb, '#1b2533'),
                    fontWeight: rule.bold ? 'bold' : undefined,
                  }}>{rule.text || 'Sample text'}</span>
                </div>
                <div className="highlight-preview-swatch highlight-preview-swatch--light">
                  <span className="highlight-preview-label">◐ Light</span>
                  <span className="highlight-preview-text" style={{
                    color: argbToCss(rule.lightForeColorArgb ?? rule.foreColorArgb, '#000000'),
                    backgroundColor: argbToCss(rule.lightBackColorArgb, '#ffffff'),
                    fontWeight: rule.bold ? 'bold' : undefined,
                  }}>{rule.text || 'Sample text'}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function PreferencesScreen({ onClose }: PreferencesScreenProps) {
  const { defaultHighlights, profiles, setPreferences } = usePreferencesStore()
  const { theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize } = useUiStore()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [defaultsDraft, setDefaultsDraft] = useState<HighlightingRule[]>([])
  const [profilesDraft, setProfilesDraft] = useState<ProfileDto[]>([])
  const [themeDraft, setThemeDraft] = useState<'dark' | 'light'>(theme)
  const [fontFamilyDraft, setFontFamilyDraft] = useState<UserFontFamily>(fontFamily)
  const [fontSizeDraft, setFontSizeDraft] = useState<number>(fontSize)
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
      .catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : 'Failed to load preferences.'))
  }, [setPreferences, theme, fontFamily, fontSize])

  useEffect(() => {
    setDefaultsDraft(defaultHighlights)
  }, [defaultHighlights])

  useEffect(() => {
    setProfilesDraft(profiles)
    if (profiles.length > 0 && selectedProfileIndex === null) {
      setSelectedProfileIndex(0)
    }
  }, [profiles, selectedProfileIndex])

  useEffect(() => {
    if (selectedProfileIndex === null) {
      setSelectedStoredFilterIndex(null)
      return
    }

    const storedFilters = profilesDraft[selectedProfileIndex]?.dicoStoredFilter ?? []
    setSelectedStoredFilterIndex(storedFilters.length > 0 ? 0 : null)
  }, [selectedProfileIndex, profilesDraft])

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
    setProfilesDraft(profilesDraft.map((profile, index) =>
      index === selectedProfileIndex ? { ...profile, ...patch } : profile
    ))
  }

  const updateSelectedStoredFilter = (patch: Partial<StoredFilterDto>) => {
    if (!selectedProfile || selectedStoredFilterIndex === null) return
    const current = selectedProfile.dicoStoredFilter ?? []
    updateSelectedProfile({
      dicoStoredFilter: current.map((item, index) =>
        index === selectedStoredFilterIndex ? { ...item, ...patch } : item
      ),
    })
  }

  const createProfile = () => {
    const baseName = `Profile ${profilesDraft.length + 1}`
    const profile = emptyProfile(baseName)
    setProfilesDraft([...profilesDraft, profile])
    setSelectedProfileIndex(profilesDraft.length)
    setSelectedStoredFilterIndex(null)
  }

  const removeSelectedProfile = () => {
    if (selectedProfileIndex === null) return
    const nextProfiles = profilesDraft.filter((_, index) => index !== selectedProfileIndex)
    setProfilesDraft(nextProfiles)
    setSelectedProfileIndex(nextProfiles.length > 0 ? 0 : null)
    setSelectedStoredFilterIndex(nextProfiles[0]?.dicoStoredFilter?.length ? 0 : null)
  }

  const addHiddenLine = () => {
    if (!selectedProfile) return
    updateSelectedProfile({ dicoHiddenLog: [...(selectedProfile.dicoHiddenLog ?? []), emptyHiddenLine()] })
  }

  const updateHiddenLine = (index: number, patch: Partial<HiddenLineDto>) => {
    if (!selectedProfile) return
    updateSelectedProfile({
      dicoHiddenLog: (selectedProfile.dicoHiddenLog ?? []).map((line, current) =>
        current === index ? { ...line, ...patch } : line
      ),
    })
  }

  const removeHiddenLine = (index: number) => {
    if (!selectedProfile) return
    updateSelectedProfile({
      dicoHiddenLog: (selectedProfile.dicoHiddenLog ?? []).filter((_, current) => current !== index),
    })
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
    const next = (selectedProfile.dicoStoredFilter ?? []).filter((_, index) => index !== selectedStoredFilterIndex)
    updateSelectedProfile({ dicoStoredFilter: next })
    setSelectedStoredFilterIndex(next.length > 0 ? 0 : null)
  }

  const saveAll = async () => {
    setIsSaving(true)
    setError(null)
    try {
      const payload: PreferencesPayloadDto = {
        defaultHighlights: defaultsDraft,
        profiles: profilesDraft,
      }
      const saved = await savePreferences(payload)
      setTheme(themeDraft)
      setFontFamily(fontFamilyDraft)
      setFontSize(fontSizeDraft)
      setPreferences(saved)
      setDefaultsDraft(saved.defaultHighlights ?? [])
      setProfilesDraft(saved.profiles ?? [])
      setSelectedProfileIndex(saved.profiles.length > 0 ? 0 : null)
      setSelectedStoredFilterIndex(saved.profiles[0]?.dicoStoredFilter?.length ? 0 : null)
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save preferences.')
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
            <p>Manage user display preferences and shared highlights/profiles.</p>
          </div>
          <div className="settings-actions-row">
            <button className="control-button control-button--primary" onClick={saveAll} disabled={isSaving}>Save</button>
            <button className="control-button control-button--ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>

        {error && <div className="settings-error">{error}</div>}

        <div className="settings-grid">
          <section className="settings-card">
            <div className="settings-card__header">
              <h3>User preferences</h3>
            </div>
            <div className="settings-form-grid">
              <label>
                Theme
                <select className="control-input" value={themeDraft} onChange={event => setThemeDraft(event.target.value as 'dark' | 'light')}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
              <label>
                Font
                <select className="control-input" value={fontFamilyDraft} onChange={event => setFontFamilyDraft(event.target.value as UserFontFamily)}>
                  {FONT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label>
                Text size
                <input className="control-input" type="number" min={10} max={22} value={fontSizeDraft} onChange={event => setFontSizeDraft(Number(event.target.value))} />
              </label>
            </div>
          </section>

          <HighlightListEditor title="Default highlights" rules={defaultsDraft} onChange={setDefaultsDraft} />

          <section className="settings-card settings-card--split">
            <div className="settings-card__header">
              <h3>Profiles</h3>
              <div className="settings-actions-row">
                <button className="control-button control-button--ghost" onClick={createProfile}>New</button>
                <button className="control-button control-button--ghost" onClick={removeSelectedProfile} disabled={!selectedProfile}>Delete</button>
              </div>
            </div>
            <div className="settings-split-layout">
              <div className="settings-list-panel">
                {profilesDraft.map((profile, index) => (
                  <button
                    key={`${profile.name}-${index}`}
                    className={`settings-list-item ${selectedProfileIndex === index ? 'settings-list-item--active' : ''}`}
                    onClick={() => {
                      setSelectedProfileIndex(index)
                      setSelectedStoredFilterIndex(profile.dicoStoredFilter?.length ? 0 : null)
                    }}
                  >
                    {profile.name}
                  </button>
                ))}
              </div>
              <div className="settings-detail-panel">
                {selectedProfile ? (
                  <>
                    <div className="settings-form-grid">
                      <label>
                        Profile name
                        <input className="control-input" value={selectedProfile.name} onChange={event => updateSelectedProfile({ name: event.target.value })} />
                      </label>
                      <label>
                        Encoding
                        <input className="control-input" value={selectedProfile.encoding ?? 'UTF-8'} onChange={event => updateSelectedProfile({ encoding: event.target.value })} />
                      </label>
                      <label>
                        Loading param
                        <input className="control-input" value={selectedProfile.loadingParam ?? ''} onChange={event => updateSelectedProfile({ loadingParam: event.target.value })} />
                      </label>
                    </div>

                    <div className="settings-actions-row profile-tabs">
                      <button className={`control-chip ${activeProfileTab === 'highlight' ? 'control-chip--active' : ''}`} onClick={() => setActiveProfileTab('highlight')}>Highlight</button>
                      <button className={`control-chip ${activeProfileTab === 'hidden' ? 'control-chip--active' : ''}`} onClick={() => setActiveProfileTab('hidden')}>Hidden lines</button>
                      <button className={`control-chip ${activeProfileTab === 'stored' ? 'control-chip--active' : ''}`} onClick={() => setActiveProfileTab('stored')}>Stored filter</button>
                    </div>

                    {activeProfileTab === 'highlight' && (
                      <HighlightListEditor
                        title="Profile highlights"
                        rules={selectedProfile.dicoHighLighting ?? []}
                        onChange={rules => updateSelectedProfile({ dicoHighLighting: rules })}
                      />
                    )}

                    {activeProfileTab === 'hidden' && (
                      <section className="settings-card">
                        <div className="settings-card__header">
                          <h3>Hidden lines</h3>
                          <button className="control-button control-button--ghost" onClick={addHiddenLine}>Add hidden line</button>
                        </div>
                        <div className="settings-list-panel">
                          {(selectedProfile.dicoHiddenLog ?? []).length === 0 && <div className="empty-state compact-empty-state">No hidden lines configured.</div>}
                          {(selectedProfile.dicoHiddenLog ?? []).map((line, index) => (
                            <div key={`${selectedProfile.name}-hidden-${index}`} className="settings-row-line">
                              <input className="control-input" value={line.text} placeholder="Pattern" onChange={event => updateHiddenLine(index, { text: event.target.value })} />
                              <label className="settings-inline-check"><input type="checkbox" checked={line.isRegex} onChange={event => updateHiddenLine(index, { isRegex: event.target.checked })} />Regex</label>
                              <label className="settings-inline-check"><input type="checkbox" checked={line.caseSensitive} onChange={event => updateHiddenLine(index, { caseSensitive: event.target.checked })} />Case</label>
                              <label className="settings-inline-check"><input type="checkbox" checked={line.isActif} onChange={event => updateHiddenLine(index, { isActif: event.target.checked })} />Active</label>
                              <button className="control-button control-button--ghost" onClick={() => removeHiddenLine(index)}>Delete</button>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {activeProfileTab === 'stored' && (
                      <section className="settings-card">
                        <div className="settings-card__header">
                          <h3>Stored filters</h3>
                          <div className="settings-actions-row">
                            <button className="control-button control-button--ghost" onClick={addStoredFilter}>Add</button>
                            <button className="control-button control-button--ghost" onClick={removeStoredFilter} disabled={!selectedStoredFilter}>Delete</button>
                          </div>
                        </div>
                        <div className="settings-form-grid">
                          <label>
                            Stored filter
                            <select
                              className="control-input"
                              value={selectedStoredFilterIndex ?? ''}
                              onChange={event => setSelectedStoredFilterIndex(event.target.value === '' ? null : Number(event.target.value))}
                            >
                              <option value="">Select a filter</option>
                              {(selectedProfile.dicoStoredFilter ?? []).map((filter, index) => (
                                <option key={`${filter.name}-${index}`} value={index}>{filter.name}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        {selectedStoredFilter ? (
                          <div className="settings-row-line settings-row-line--stacked">
                            <label>
                              Name
                              <input className="control-input" value={selectedStoredFilter.name} onChange={event => updateSelectedStoredFilter({ name: event.target.value })} />
                            </label>
                            <label>
                              Filter
                              <input className="control-input" value={selectedStoredFilter.filter} onChange={event => updateSelectedStoredFilter({ filter: event.target.value })} />
                            </label>
                            <label className="settings-inline-check"><input type="checkbox" checked={selectedStoredFilter.isRegex} onChange={event => updateSelectedStoredFilter({ isRegex: event.target.checked })} />Regex</label>
                            <label className="settings-inline-check"><input type="checkbox" checked={selectedStoredFilter.caseSensitive} onChange={event => updateSelectedStoredFilter({ caseSensitive: event.target.checked })} />Case sensitive</label>
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
        </div>
      </div>
    </div>
  )
}
