import type { FixFieldDto } from '../types'

function getToken(): string {
  return localStorage.getItem('logwatcher_token') ?? ''
}

let _cachedFields: FixFieldDto[] | null = null

export async function ensureFixFields(): Promise<FixFieldDto[]> {
  if (_cachedFields !== null) return _cachedFields

  try {
    const response = await fetch('/api/fix/fields', {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (!response.ok) return []
    const data = await response.json() as { fields: FixFieldDto[] }
    _cachedFields = data.fields ?? []
  } catch {
    _cachedFields = []
  }

  return _cachedFields
}
