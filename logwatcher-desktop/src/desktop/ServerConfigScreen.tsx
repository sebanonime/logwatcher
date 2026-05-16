import React, { useState } from 'react'

interface ServerConfigScreenProps {
  onSave: (serverUrl: string) => void
}

export function ServerConfigScreen({ onSave }: ServerConfigScreenProps) {
  const [url, setUrl] = useState('')
  const [sidecarMode, setSidecarMode] = useState(false)
  const [sidecarStarting, setSidecarStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    let finalUrl = url.trim().replace(/\/$/, '')
    if (!finalUrl) {
      setError('Please enter the server URL.')
      return
    }
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl
    }
    // Keep only scheme + host + port, strip any path the user may have pasted
    try {
      const parsed = new URL(finalUrl)
      finalUrl = parsed.origin
    } catch {
      setError('Invalid URL format.')
      return
    }

    // Quick connectivity check
    try {
      const res = await fetch(`${finalUrl}/health`)
      if (!res.ok && res.status >= 500) {
        setError(`Server responded with ${res.status}. Check the URL and try again.`)
        return
      }
    } catch {
      setError(
        'Could not reach the server. Make sure the URL is correct and the server is running.'
      )
      return
    }

    onSave(finalUrl)
  }

  async function handleStartSidecar() {
    setSidecarStarting(true)
    setError(null)
    try {
      const port = await window.electronAPI.startSidecar()
      const sidecarUrl = `http://localhost:${port}`
      setUrl(sidecarUrl)
      onSave(sidecarUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start sidecar.')
    } finally {
      setSidecarStarting(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--app-bg)',
      }}
    >
      <div
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: '40px 48px',
          minWidth: 480,
          boxShadow: 'var(--shadow)',
        }}
      >
        <h1 style={{ margin: '0 0 8px', color: 'var(--text-1)', fontSize: 22 }}>
          LogWatcher Desktop
        </h1>
        <p style={{ margin: '0 0 32px', color: 'var(--text-3)', fontSize: 13 }}>
          Connect to a LogWatcher.Web backend to get started.
        </p>

        {/* Remote server form */}
        <form onSubmit={handleConnect} style={{ display: sidecarMode ? 'none' : 'block' }}>
          <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 12, marginBottom: 6 }}>
            Remote server URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://logs.mycompany.com"
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--border-strong)',
              background: 'var(--surface-3)',
              color: 'var(--text-1)',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 12, margin: '8px 0 0' }}>{error}</p>
          )}
          <button
            type="submit"
            style={{
              marginTop: 20,
              width: '100%',
              padding: '9px',
              borderRadius: 6,
              border: 'none',
              background: 'var(--accent)',
              color: '#07111f',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Connect
          </button>
        </form>

        {/* Sidecar mode */}
        <div style={{ marginTop: 24, borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
          <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '0 0 12px' }}>
            Or start a local backend (sidecar mode) — requires LogWatcher.Web to be installed
            alongside this app.
          </p>
          <button
            type="button"
            disabled={sidecarStarting}
            onClick={handleStartSidecar}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: 6,
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              color: 'var(--text-2)',
              fontSize: 13,
              cursor: sidecarStarting ? 'wait' : 'pointer',
            }}
          >
            {sidecarStarting ? 'Starting sidecar…' : 'Start local backend (sidecar)'}
          </button>
          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 12, margin: '8px 0 0' }}>{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
