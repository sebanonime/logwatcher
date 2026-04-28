import React, { useEffect, useMemo, useState } from 'react'
import {
  createPath,
  createPerimeter,
  createRoot,
  deletePath,
  deletePerimeter,
  deleteRoot,
  getLogBrowserSettings,
  updatePath,
  updatePerimeter,
  updateRoot,
} from '../../api/settings'
import { usePerimeterStore } from '../../store/perimeterStore'
import type { PerimeterDto, RootFolderDto, ServerDto } from '../../types'

interface LogBrowserSettingsScreenProps {
  onClose: () => void
}

function emptyServer(): ServerDto {
  return {
    id: '',
    name: '',
    type: 'local',
    host: '',
    agentId: '',
    username: '',
  }
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
  }, [])

  useEffect(() => {
    setPerimeterName(selectedPerimeter?.name ?? '')
    setSelectedRootName(current => current ?? selectedPerimeter?.rootFolders[0]?.name ?? null)
  }, [selectedPerimeter])

  useEffect(() => {
    setRootName(selectedRoot?.name ?? '')
    setServerDraft(emptyServer())
  }, [selectedRoot])

  const savePerimeter = async () => {
    const trimmedName = perimeterName.trim()
    if (!trimmedName) {
      setError('Perimeter name is required.')
      return
    }

    const perimeterNameExists = perimeters.some(perimeter =>
      perimeter.id !== selectedPerimeterId && perimeter.name.localeCompare(trimmedName, undefined, { sensitivity: 'accent' }) === 0
    )
    if (perimeterNameExists) {
      setError(`Perimeter '${trimmedName}' already exists.`)
      return
    }

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
    if (!trimmedName) {
      setError('Environment name is required.')
      return
    }

    const rootNameExists = (selectedPerimeter?.rootFolders ?? []).some(root =>
      root.name !== selectedRootName && root.name.localeCompare(trimmedName, undefined, { sensitivity: 'accent' }) === 0
    )
    if (rootNameExists) {
      setError(`Environment '${trimmedName}' already exists.`)
      return
    }

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
    if (!trimmedName) {
      setError('Path name is required.')
      return
    }

    const pathNameExists = (selectedRoot?.servers ?? []).some(server =>
      server.id !== serverDraft.id && server.name.localeCompare(trimmedName, undefined, { sensitivity: 'accent' }) === 0
    )
    if (pathNameExists) {
      setError(`Path '${trimmedName}' already exists.`)
      return
    }

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

          <section className="settings-card">
            <div className="settings-card__header">
              <h3>Paths</h3>
              <button className="control-button control-button--ghost" onClick={() => setServerDraft(emptyServer())}>New</button>
            </div>
            <div className="settings-list-panel">
              {selectedRoot?.servers.map(server => (
                <button
                  key={server.id}
                  className={`settings-list-item ${serverDraft.id === server.id ? 'settings-list-item--active' : ''}`}
                  onClick={() => setServerDraft(server)}
                >
                  {server.name || server.host || server.agentId || server.id}
                </button>
              ))}
            </div>
            <div className="settings-form-grid">
              <label>
                Name
                <input className="control-input" value={serverDraft.name} onChange={event => setServerDraft({ ...serverDraft, name: event.target.value })} />
              </label>
              <label>
                Type
                <select className="control-input" value={serverDraft.type} onChange={event => setServerDraft({ ...serverDraft, type: event.target.value as ServerDto['type'] })}>
                  <option value="local">local</option>
                  <option value="smb">smb</option>
                  <option value="agent">agent</option>
                </select>
              </label>
              <label>
                Path / Host
                <input className="control-input" value={serverDraft.host ?? ''} onChange={event => setServerDraft({ ...serverDraft, host: event.target.value })} />
              </label>
              <label>
                Agent Id
                <input className="control-input" value={serverDraft.agentId ?? ''} onChange={event => setServerDraft({ ...serverDraft, agentId: event.target.value })} />
              </label>
              <label>
                Username
                <input className="control-input" value={serverDraft.username ?? ''} onChange={event => setServerDraft({ ...serverDraft, username: event.target.value })} />
              </label>
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
