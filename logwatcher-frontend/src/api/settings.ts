import type {
  HighlightingRule,
  KnownAgentDto,
  PathStatusDto,
  PerimeterDto,
  PreferencesPayloadDto,
  ProfileDto,
  RootFolderDto,
  ServerDto,
} from '../types'

function getToken(): string {
  return localStorage.getItem('logwatcher_token') ?? ''
}

async function authFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(init?.headers ?? {}),
    },
  })

  if (response.status === 401) {
    localStorage.removeItem('logwatcher_token')
    window.location.reload()
    throw new Error('Authentication expired.')
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `HTTP ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function getLogBrowserSettings() {
  return authFetch<PerimeterDto[]>('/api/settings/log-browser')
}

export function getKnownAgents() {
  return authFetch<KnownAgentDto[]>('/api/settings/log-browser/agents')
}

export function getPathStatus(serverId: string) {
  return authFetch<PathStatusDto>(`/api/settings/log-browser/path-status/${encodeURIComponent(serverId)}`)
}

export function createPerimeter(payload: Partial<PerimeterDto>) {
  return authFetch<PerimeterDto>('/api/settings/log-browser/perimeters', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updatePerimeter(id: string, payload: Partial<PerimeterDto>) {
  return authFetch<PerimeterDto>(`/api/settings/log-browser/perimeters/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deletePerimeter(id: string) {
  return authFetch<void>(`/api/settings/log-browser/perimeters/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export function reorderPerimeters(orderedIds: string[]) {
  return authFetch<void>('/api/settings/log-browser/perimeters/reorder', {
    method: 'PUT',
    body: JSON.stringify(orderedIds),
  })
}

export function reorderRoots(perimeterId: string, orderedNames: string[]) {
  return authFetch<void>(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/reorder`, {
    method: 'PUT',
    body: JSON.stringify(orderedNames),
  })
}

export function createRoot(perimeterId: string, payload: Partial<RootFolderDto>) {
  return authFetch<RootFolderDto>(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateRoot(perimeterId: string, originalName: string, payload: Partial<RootFolderDto>) {
  return authFetch<RootFolderDto>(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(originalName)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteRoot(perimeterId: string, rootName: string) {
  return authFetch<void>(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(rootName)}`, {
    method: 'DELETE',
  })
}

export function createPath(perimeterId: string, rootName: string, payload: Partial<ServerDto>) {
  return authFetch<ServerDto>(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(rootName)}/paths`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updatePath(perimeterId: string, rootName: string, serverId: string, payload: Partial<ServerDto>) {
  return authFetch<ServerDto>(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(rootName)}/paths/${encodeURIComponent(serverId)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deletePath(perimeterId: string, rootName: string, serverId: string) {
  return authFetch<void>(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(rootName)}/paths/${encodeURIComponent(serverId)}`, {
    method: 'DELETE',
  })
}

export function getPreferences() {
  return authFetch<PreferencesPayloadDto>('/api/settings/preferences')
}

export function savePreferences(payload: PreferencesPayloadDto) {
  return authFetch<PreferencesPayloadDto>('/api/settings/preferences', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function saveDefaultHighlights(defaultHighlights: HighlightingRule[]) {
  return authFetch<void>('/api/settings/preferences/default-highlights', {
    method: 'PUT',
    body: JSON.stringify(defaultHighlights),
  })
}

export function saveProfile(profile: ProfileDto) {
  const encodedName = encodeURIComponent(profile.name)
  const method = profile.shared ? 'PUT' : 'POST'
  const url = method === 'PUT'
    ? `/api/settings/preferences/profiles/${encodedName}`
    : '/api/settings/preferences/profiles'

  return authFetch<ProfileDto>(url, {
    method,
    body: JSON.stringify(profile),
  })
}

export function updateProfile(originalName: string, profile: ProfileDto) {
  return authFetch<ProfileDto>(`/api/settings/preferences/profiles/${encodeURIComponent(originalName)}`, {
    method: 'PUT',
    body: JSON.stringify(profile),
  })
}

export function deleteProfile(name: string) {
  return authFetch<void>(`/api/settings/preferences/profiles/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  })
}
