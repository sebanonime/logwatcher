import React, { useEffect, useMemo, useState } from 'react'
import {
  createPath,
  createPerimeter,
  createRoot,
  deletePath,
  deletePerimeter,
  deleteRoot,
  getKnownAgents,
  getLogBrowserSettings,
  getPathStatus,
  updatePath,
  updatePerimeter,
  updateRoot,
} from '../../api/settings'
import { usePerimeterStore } from '../../store/perimeterStore'
import type { KnownAgentDto, PerimeterDto, ServerDto } from '../../types'

interface LogBrowserSettingsScreenProps {
  onClose: () => void
}

function emptyServer(): ServerDto {
  return { id: '', name: '', type: 'smb', host: '', agentId: '', username: '' }
}

function StatusDot({ status }: { status: 'online' | 'offline' | 'unknown' }) {
  return <span className={`status-dot status-dot--${status}`} title={status} />
}

export function LogBrowserSettingsScreen({ onClose }: LogBrowserSettingsScreenProps) {
  const { fetchPerimeters } = usePerimeterStore()
  const [perimeters, setPerimeters] = useState<PerimeterDto[]>([])
  const [selectedPerimeterId, setSelectedPerimeterId] = useState<string | null>(null)
  const [selectedRootName, setSelectedRootName] = useState<string | null>(null)
  const [perimeterName, setPerimeterName] = useState('')
  const [rootName, setRootName] = useState('')
  const [serverDraft, setServerDraft] = useState<ServerDto>(emptyServer())
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [knownAgents, setKnownAgents] = useState<KnownAgentDto[]>([])
  const [pathStatuses, setPathStatuses] = useState<Record<string, { online?: boolean; accessible?: boolean }>>({})

  const selectedPerimeter = useMemo(
    () => perimeters.find(perimeter => perimeter.id === selectedPerimeterId) ?? null,
    [perimeters, selectedPerimeterId]
  )
  const selectedRoot = useMemo(
    () => selectedPerimeter?.rootFolders.find(root => root.name === selectedRootName) ?? null,
    [selectedPerimeter, selectedRootName]
  )

  const load = async () => {
    const nextPerimeters = await getLogBrowserSettings()
    setPerimeters(nextPerimeters)
    setSelectedPerimeterId(current => current ?? nextPerimeters[0]?.id ?? null)
  }

  useEffect(() => {
    load().catch(loadError => setError(loadError instanceof Error ? loadError.message : 'Failed to load browser settings.'))
    getKnownAgents().then(setKnownAgents).catch(() => {})

    const interval = setInterval(() => {
      getKnownAgents().then(setKnownAgents).catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setPerimeterName(selectedPerimeter?.name ?? '')
    setSelectedRootName(current => current ?? selectedPerimeter?.rootFolders[0]?.name ?? null)
  }, [selectedPerimeter])

  useEffect(() => {
    setRootName(selectedRoot?.name ?? '')
    setServerDraft(emptyServer())
    setPathStatuses({})

    if (!selectedRoot) return

    const smbServers = selectedRoot.servers.filter(s => s.type === 'smb')
    smbServers.forEach(server => {
      getPathStatus(server.id)
        .then(status => setPathStatuses(prev => ({ ...prev, [server.id]: status })))
        .catch(() => {})
    })
  }, [selectedRoot])

  const knownAgentsMap = useMemo(
    () => new Map(knownAgents.map(a => [a.agentId, a])),
    [knownAgents]
  )

  function getServerStatusDot(server: ServerDto): 'online' | 'offline' | 'unknown' {
    if (server.type === 'agent') {
      if (!server.agentId) return 'unknown'
      const agent = knownAgentsMap.get(server.agentId)
      if (!agent) return 'unknown'
      return agent.online ? 'online' : 'offline'
    }
    if (server.type === 'smb') {
      const s = pathStatuses[server.id]
      if (s === undefined) return 'unknown'
      return s.accessible ? 'online' : 'offline'
    }
    return 'unknown'
  }

  const savePerimeter = async () => {
    const trimmedName = perimeterName.trim()
    if (!trimmedName) { setError('Perimeter name is required.'); return }

    const perimeterNameExists = perimeters.some(perimeter =>
      perimeter.id !== selectedPerimeterId && perimeter.name.localeCompare(trimmedName, undefined, { sensitivity: 'accent' }) === 0
    )
    if (perimeterNameExists) { setError(`Perimeter '${trimmedName}' already exists.`); return }

    setIsSaving(true)
    setError(null)
    try {
      if (selectedPerimeter) {
        await updatePerimeter(selectedPerimeter.id, { ...selectedPerimeter, name: trimmedName })
      } else {
        await createPerimeter({ name: trimmedName })
      }
      await load()
      await fetchPerimeters()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save perimeter.')
    } finally {
      setIsSaving(false)
    }
  }

  const saveRoot = async () => {
    if (!selectedPerimeterId) return
    const trimmedName = rootName.trim()
    if (!trimmedName) { setError('Environment name is required.'); return }

    const rootNameExists = (selectedPerimeter?.rootFolders ?? []).some(root =>
      root.name !== selectedRootName && root.name.localeCompare(trimmedName, undefined, { sensitivity: 'accent' }) === 0
    )
    if (rootNameExists) { setError(`Environment '${trimmedName}' already exists.`); return }

    setIsSaving(true)
    setError(null)
    try {
      if (selectedRoot) {
        await updateRoot(selectedPerimeterId, selectedRoot.name, { name: trimmedName })
      } else {
        await createRoot(selectedPerimeterId, { name: trimmedName, servers: [] })
      }
      await load()
      await fetchPerimeters()
      setSelectedRootName(trimmedName)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save root.')
    } finally {
      setIsSaving(false)
    }
  }

  const savePath = async () => {
    if (!selectedPerimeterId || !selectedRootName) return
    const trimmedName = serverDraft.name.trim()
    if (!trimmedName) { setError('Path name is required.'); return }

    const pathNameExists = (selectedRoot?.servers ?? []).some(server =>
      server.id !== serverDraft.id && server.name.localeCompare(trimmedName, undefined, { sensitivity: 'accent' }) === 0
    )
    if (pathNameExists) { setError(`Path '${trimmedName}' already exists.`); return }

    setIsSaving(true)
    setError(null)
    try {
      const payload = { ...serverDraft, name: trimmedName }
      if (serverDraft.id) {
        await updatePath(selectedPerimeterId, selectedRootName, serverDraft.id, payload)
      } else {
        await createPath(selectedPerimeterId, selectedRootName, payload)
      }
      await load()
      await fetchPerimeters()
      setServerDraft(emptyServer())
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save path.')
    } finally {
      setIsSaving(false)
    }
  }

  const type = serverDraft.type

  return (
    <div className="settings-overlay">
      <div className="settings-screen">
        <div className="settings-screen__header">
          <div>
            <h2>LogBrowser settings</h2>
            <p>Select or create a perimeter, then a root, then add or edit paths.</p>
          </div>
          <button className="control-button control-button--ghost" onClick={onClose}>Close</button>
        </div>

        {error && <div className="settings-error">{error}</div>}

        <div className="settings-three-columns">
          {/* ── Perimeters ── */}
          <section className="settings-card">
            <div className="settings-card__header">
              <h3>Perimeters</h3>
              <button className="control-button control-button--ghost" onClick={() => { setSelectedPerimeterId(null); setPerimeterName(''); }}>New</button>
            </div>
            <div className="settings-list-panel">
              {perimeters.map(perimeter => (
                <button
                  key={perimeter.id}
                  className={`settings-list-item ${selectedPerimeterId === perimeter.id ? 'settings-list-item--active' : ''}`}
                  onClick={() => setSelectedPerimeterId(perimeter.id)}
                >
                  {perimeter.name}
                </button>
              ))}
            </div>
            <div className="settings-section-divider" />
            <div className="settings-form-grid">
              <label>
                Name
                <input className="control-input" value={perimeterName} onChange={event => setPerimeterName(event.target.value)} />
              </label>
            </div>
            <div className="settings-actions-row">
              <button className="control-button control-button--primary" onClick={savePerimeter} disabled={isSaving || !perimeterName.trim()}>Save</button>
              <button className="control-button control-button--ghost" disabled={!selectedPerimeterId || isSaving} onClick={async () => {
                if (!selectedPerimeterId) return
                await deletePerimeter(selectedPerimeterId)
                await load()
                await fetchPerimeters()
              }}>Delete</button>
            </div>
          </section>

          {/* ── Environments ── */}
          <section className="settings-card">
            <div className="settings-card__header">
              <h3>Environments</h3>
              <button className="control-button control-button--ghost" onClick={() => { setSelectedRootName(null); setRootName(''); }}>New</button>
            </div>
            <div className="settings-list-panel">
              {selectedPerimeter?.rootFolders.map(root => (
                <button
                  key={root.name}
                  className={`settings-list-item ${selectedRootName === root.name ? 'settings-list-item--active' : ''}`}
                  onClick={() => setSelectedRootName(root.name)}
                >
                  {root.name}
                </button>
              ))}
            </div>
            <div className="settings-section-divider" />
            <div className="settings-form-grid">
              <label>
                Environment name
                <input className="control-input" value={rootName} onChange={event => setRootName(event.target.value)} />
              </label>
            </div>
            <div className="settings-actions-row">
              <button className="control-button control-button--primary" onClick={saveRoot} disabled={isSaving || !selectedPerimeterId || !rootName.trim()}>Save</button>
              <button className="control-button control-button--ghost" disabled={!selectedPerimeterId || !selectedRootName || isSaving} onClick={async () => {
                if (!selectedPerimeterId || !selectedRootName) return
                await deleteRoot(selectedPerimeterId, selectedRootName)
                await load()
                await fetchPerimeters()
              }}>Delete</button>
            </div>
          </section>

          {/* ── Paths ── */}
          <section className="settings-card">
            <div className="settings-card__header">
              <h3>Paths</h3>
              <button className="control-button control-button--ghost" onClick={() => setServerDraft(emptyServer())}>New</button>
            </div>
            <div className="settings-list-panel">
              {selectedRoot?.servers.map(server => (
                <button
                  key={server.id}
                  className={`settings-list-item settings-list-item--with-dot ${serverDraft.id === server.id ? 'settings-list-item--active' : ''}`}
                  onClick={() => setServerDraft(server)}
                >
                  <StatusDot status={getServerStatusDot(server)} />
                  <span>{server.name || server.host || server.agentId || server.id}</span>
                </button>
              ))}
            </div>
            <div className="settings-section-divider" />
            <div className="settings-form-grid settings-form-grid--stacked">
              <label>
                Name
                <input className="control-input" value={serverDraft.name} onChange={event => setServerDraft({ ...serverDraft, name: event.target.value })} />
              </label>
              <label>
                Type
                <select className="control-input" value={serverDraft.type} onChange={event => setServerDraft({ ...serverDraft, type: event.target.value as ServerDto['type'] })}>
                  <option value="smb">smb</option>
                  <option value="agent">agent</option>
                </select>
              </label>

              {type === 'smb' && (
                <label>
                  Path
                  <input className="control-input" placeholder={'\\\\server\\share'} value={serverDraft.host ?? ''} onChange={event => setServerDraft({ ...serverDraft, host: event.target.value })} />
                </label>
              )}
              {type === 'smb' && (
                <label>
                  Username (optional)
                  <input className="control-input" value={serverDraft.username ?? ''} onChange={event => setServerDraft({ ...serverDraft, username: event.target.value })} />
                </label>
              )}

              {type === 'agent' && (
                <>
                  <label>
                    Agent
                    {knownAgents.length > 0 ? (
                      <select
                        className="control-input"
                        value={serverDraft.agentId ?? ''}
                        onChange={event => setServerDraft({ ...serverDraft, agentId: event.target.value })}
                      >
                        <option value="">— select agent —</option>
                        {knownAgents.map(agent => (
                          <option key={agent.agentId} value={agent.agentId}>
                            {agent.hostname} ({agent.agentId}){agent.online ? ' ●' : ' ○'}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="control-input"
                        placeholder="agent-id"
                        value={serverDraft.agentId ?? ''}
                        onChange={event => setServerDraft({ ...serverDraft, agentId: event.target.value })}
                      />
                    )}
                  </label>
                  <label>
                    Path (on agent)
                    <input className="control-input" placeholder="/var/log or C:\logs" value={serverDraft.host ?? ''} onChange={event => setServerDraft({ ...serverDraft, host: event.target.value })} />
                  </label>
                </>
              )}
            </div>
            <div className="settings-actions-row">
              <button className="control-button control-button--primary" onClick={savePath} disabled={isSaving || !selectedPerimeterId || !selectedRootName || !serverDraft.name.trim()}>Save</button>
              <button className="control-button control-button--ghost" disabled={!selectedPerimeterId || !selectedRootName || !serverDraft.id || isSaving} onClick={async () => {
                if (!selectedPerimeterId || !selectedRootName || !serverDraft.id) return
                await deletePath(selectedPerimeterId, selectedRootName, serverDraft.id)
                await load()
                await fetchPerimeters()
                setServerDraft(emptyServer())
              }}>Delete</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
