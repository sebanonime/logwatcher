export interface AuthUiDescriptor {
  mode: 'password' | 'redirect' | 'none'
  loginUrl?: string
  logoutUrl?: string
}

export async function fetchAuthConfig(): Promise<AuthUiDescriptor> {
  const res = await fetch('/api/auth/config')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<AuthUiDescriptor>
}
