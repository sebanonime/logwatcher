import React, { useEffect, useMemo, useState } from 'react'
import {
  deleteProfile,
  getPreferences,
  saveDefaultHighlights,
  updateProfile,
} from '../../api/settings'
import { usePreferencesStore } from '../../store/preferencesStore'
import { useUiStore } from '../../store/uiStore'
import type { HighlightingRule, PreferencesPayloadDto, ProfileDto, UserFontFamily } from '../../types'

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
  if (argb === undefined || argb === -1) return fallback
  if (argb === 0) return 'transparent'
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
  const updateRule = (index: number, patch: Partial<HighlightingRule>) => {
    onChange(rules.map((rule, current) => current === index ? { ...rule, ...patch } : rule))
  }

  const removeRule = (index: number) => {
    onChange(rules.filter((_, current) => current !== index).map((rule, order) => ({ ...rule, order })))
  }

  const addRule = () => {
    onChange([...rules, emptyHighlight(rules.length)])
  }

  return (
    <section className="settings-card">
      <div className="settings-card__header">
        <h3>{title}</h3>
        <button className="control-button control-button--ghost" onClick={addRule}>Add highlight</button>
      </div>
      <div className="highlight-editor-list">
        {rules.length === 0 && <div className="empty-state compact-empty-state">No highlights configured.</div>}
        {rules.map((rule, index) => (
          <div key={`${title}-${index}`} className="highlight-editor-row">
            <div className="highlight-editor-controls">
            <input
              className="control-input"
              value={rule.text}
              placeholder="Pattern"
              onChange={event => updateRule(index, { text: event.target.value })}
            />
            <label className="settings-inline-check"><input type="checkbox" checked={rule.isRegex} onChange={event => updateRule(index, { isRegex: event.target.checked })} />Regex</label>
            <label className="settings-inline-check"><input type="checkbox" checked={rule.caseSensitive} onChange={event => updateRule(index, { caseSensitive: event.target.checked })} />Case</label>
            <label className="settings-inline-check"><input type="checkbox" checked={rule.bold} onChange={event => updateRule(index, { bold: event.target.checked })} />Bold</label>
            <label className="settings-inline-check"><input type="checkbox" checked={rule.hightPriority} onChange={event => updateRule(index, { hightPriority: event.target.checked })} />Priority</label>
            <div className="highlight-color-pair">
              <span>Dark</span>
              <input type="color" value={argbToHex(rule.darkForeColorArgb ?? rule.foreColorArgb, '#ffffff')} onChange={event => updateRule(index, { darkForeColorArgb: hexToArgb(event.target.value) })} />
              <input type="color" value={argbToHex(rule.darkBackColorArgb ?? rule.backColorArgb, '#000000')} onChange={event => updateRule(index, { darkBackColorArgb: hexToArgb(event.target.value) })} />
            </div>
            <div className="highlight-color-pair">
              <span>Light</span>
              <input type="color" value={argbToHex(rule.lightForeColorArgb ?? rule.foreColorArgb, '#000000')} onChange={event => updateRule(index, { lightForeColorArgb: hexToArgb(event.target.value) })} />
              <input type="color" value={argbToHex(rule.lightBackColorArgb ?? rule.backColorArgb, '#ffffff')} onChange={event => updateRule(index, { lightBackColorArgb: hexToArgb(event.target.value) })} />
            </div>
            <button className="control-button control-button--ghost" onClick={() => removeRule(index)}>Delete</button>
            </div>
            <div className="highlight-preview">
              <div className="highlight-preview-swatch highlight-preview-swatch--dark">
                <span className="highlight-preview-label">◑ Dark</span>
                <span className="highlight-preview-text" style={{
                  color: argbToCss(rule.darkForeColorArgb ?? rule.foreColorArgb, '#ffffff'),
                  backgroundColor: argbToCss(rule.darkBackColorArgb ?? rule.backColorArgb, 'transparent'),
                  fontWeight: rule.bold ? 'bold' : undefined,
                }}>{rule.text || 'Sample text'}</span>
              </div>
              <div className="highlight-preview-swatch highlight-preview-swatch--light">
                <span className="highlight-preview-label">◐ Light</span>
                <span className="highlight-preview-text" style={{
                  color: argbToCss(rule.lightForeColorArgb ?? rule.foreColorArgb, '#000000'),
                  backgroundColor: argbToCss(rule.lightBackColorArgb ?? rule.backColorArgb, 'transparent'),
                  fontWeight: rule.bold ? 'bold' : undefined,
                }}>{rule.text || 'Sample text'}</span>
              </div>
            </div>
          </div>
        ))}
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
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number | null>(null)
  const [selectedProfileOriginalName, setSelectedProfileOriginalName] = useState<string | null>(null)

  useEffect(() => {
    getPreferences()
      .then((payload) => {
        setPreferences(payload)
        setDefaultsDraft(payload.defaultHighlights ?? [])
        setProfilesDraft(payload.profiles ?? [])
        setSelectedProfileIndex(payload.profiles.length > 0 ? 0 : null)
        setSelectedProfileOriginalName(payload.profiles[0]?.name ?? null)
      })
      .catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : 'Failed to load preferences.'))
  }, [setPreferences])

  useEffect(() => {
    setDefaultsDraft(defaultHighlights)
  }, [defaultHighlights])

  useEffect(() => {
    setProfilesDraft(profiles)
    if (profiles.length > 0 && selectedProfileIndex === null) {
      setSelectedProfileIndex(0)
      setSelectedProfileOriginalName(profiles[0].name)
    }
  }, [profiles, selectedProfileIndex])

  const selectedProfile = useMemo(
    () => selectedProfileIndex === null ? null : (profilesDraft[selectedProfileIndex] ?? null),
    [profilesDraft, selectedProfileIndex]
  )

  const updateSelectedProfile = (patch: Partial<ProfileDto>) => {
    if (selectedProfileIndex === null || !selectedProfile) return
    setProfilesDraft(profilesDraft.map((profile, index) =>
      index === selectedProfileIndex ? { ...profile, ...patch } : profile
    ))
  }

  const createProfile = () => {
    const baseName = `Profile ${profilesDraft.length + 1}`
    const profile = emptyProfile(baseName)
    setProfilesDraft([...profilesDraft, profile])
    setSelectedProfileIndex(profilesDraft.length)
    setSelectedProfileOriginalName(profile.name)
  }

  const removeSelectedProfile = async () => {
    if (!selectedProfile) return
    setIsSaving(true)
    try {
      await deleteProfile(selectedProfile.name)
      const nextProfiles = profilesDraft.filter(profile => profile.name !== selectedProfile.name)
      const payload: PreferencesPayloadDto = { defaultHighlights: defaultsDraft, profiles: nextProfiles }
      setPreferences(payload)
      setProfilesDraft(nextProfiles)
      setSelectedProfileIndex(nextProfiles.length > 0 ? 0 : null)
      setSelectedProfileOriginalName(nextProfiles[0]?.name ?? null)
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const saveDefaults = async () => {
    setIsSaving(true)
    try {
      await saveDefaultHighlights(defaultsDraft)
      setPreferences({ defaultHighlights: defaultsDraft, profiles: profilesDraft })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save default highlights.')
    } finally {
      setIsSaving(false)
    }
  }

  const saveSelectedProfile = async () => {
    if (!selectedProfile) return
    setIsSaving(true)
    try {
      await updateProfile(selectedProfileOriginalName ?? selectedProfile.name, selectedProfile)
      setSelectedProfileOriginalName(selectedProfile.name)
      setPreferences({ defaultHighlights: defaultsDraft, profiles: profilesDraft })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save profile.')
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
          <button className="control-button control-button--ghost" onClick={onClose}>Close</button>
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
                <select className="control-input" value={theme} onChange={event => setTheme(event.target.value as 'dark' | 'light')}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
              <label>
                Font
                <select className="control-input" value={fontFamily} onChange={event => setFontFamily(event.target.value as UserFontFamily)}>
                  {FONT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label>
                Text size
                <input className="control-input" type="number" min={10} max={22} value={fontSize} onChange={event => setFontSize(Number(event.target.value))} />
              </label>
            </div>
          </section>

          <HighlightListEditor title="Default highlights" rules={defaultsDraft} onChange={setDefaultsDraft} />

          <section className="settings-card settings-card--split">
            <div className="settings-card__header">
              <h3>Profiles</h3>
              <div className="settings-actions-row">
                <button className="control-button control-button--ghost" onClick={createProfile}>New</button>
                <button className="control-button control-button--ghost" onClick={removeSelectedProfile} disabled={!selectedProfile || isSaving}>Delete</button>
                <button className="control-button control-button--primary" onClick={saveSelectedProfile} disabled={!selectedProfile || isSaving}>Save profile</button>
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
                      setSelectedProfileOriginalName(profile.name)
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
                    <HighlightListEditor
                      title="Profile highlights"
                      rules={selectedProfile.dicoHighLighting ?? []}
                      onChange={rules => updateSelectedProfile({ dicoHighLighting: rules })}
                    />
                  </>
                ) : (
                  <div className="empty-state compact-empty-state">Select or create a profile.</div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="settings-screen__footer">
          <button className="control-button control-button--primary" onClick={saveDefaults} disabled={isSaving}>Save default highlights</button>
        </div>
      </div>
    </div>
  )
}
