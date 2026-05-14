import React, { useEffect, useState } from 'react'
import { useLogHub } from '@shared/hooks/useLogHub'
import { usePerimeterStore } from '@shared/store/perimeterStore'
import { LoginScreen } from '@shared/components/LoginScreen'
import { PreferencesScreen } from '@shared/components/settings/PreferencesScreen'
import { LogBrowserSettingsScreen } from '@shared/components/settings/LogBrowserSettingsScreen'
import { usePreferencesStore } from '@shared/store/preferencesStore'
import { ServerConfigScreen } from './desktop/ServerConfigScreen'
import { DesktopLayout } from './desktop/DesktopLayout'
import { useDesktopStore } from './store/desktopStore'
import { setHubBaseUrl } from '@shared/signalr/logHubConnection'
import { stopLogHub } from '@shared/signalr/logHubConnection'

// ─── Root app ─────────────────────────────────────────────────────────────────

export default function App() {
  const { serverUrl, setServerUrl, clearServerUrl } = useDesktopStore()
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('logwatcher_token'))

  // When the server URL changes (e.g. from the config screen) update the hub
  useEffect(() => {
    setHubBaseUrl(serverUrl)
  }, [serverUrl])

  // First launch — no server configured yet
  if (!serverUrl) {
    return (
      <ServerConfigScreen
        onSave={(url) => {
          window.electronAPI.setConfig({ serverUrl: url })
          setServerUrl(url)
          // Also apply to the fetch override immediately
          setHubBaseUrl(url)
          const origFetch = globalThis.fetch.bind(globalThis)
          globalThis.fetch = (input, init) => {
            if (typeof input === 'string' && input.startsWith('/')) {
              return origFetch(url + input, init)
            }
            return origFetch(input, init)
          }
        }}
      />
    )
  }

  if (!token) {
    return (
      <LoginScreen
        onLogin={(t) => {
          localStorage.setItem('logwatcher_token', t)
          setToken(t)
        }}
      />
    )
  }

  return (
    <LoggedInApp
      onLogout={() => {
        localStorage.removeItem('logwatcher_token')
        stopLogHub().catch(() => {})
        setToken(null)
      }}
      onChangeServer={() => {
        localStorage.removeItem('logwatcher_token')
        stopLogHub().catch(() => {})
        setToken(null)
        clearServerUrl()
      }}
    />
  )
}

// ─── Logged-in shell ──────────────────────────────────────────────────────────

function LoggedInApp({ onLogout, onChangeServer }: { onLogout: () => void; onChangeServer: () => void }) {
  const hub = useLogHub()
  const { fetchPerimeters, perimeters, selectPerimeter } = usePerimeterStore()
  const { fetchPreferences } = usePreferencesStore()
  const [showPreferences, setShowPreferences] = useState(false)
  const [showLogBrowserSettings, setShowLogBrowserSettings] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    fetchPerimeters().catch(() => {})
  }, [fetchPerimeters])

  useEffect(() => {
    fetchPreferences().catch(() => {})
  }, [fetchPreferences])

  useEffect(() => {
    if (isInitialized || !perimeters.length) return
    const last = localStorage.getItem('logwatcher_last_perimeter')
    const target = perimeters.find((p) => p.id === last) ?? perimeters[0]
    if (target) selectPerimeter(target.id)
    setIsInitialized(true)
  }, [perimeters, isInitialized, selectPerimeter])

  return (
    <>
      <DesktopLayout
        hub={hub}
        onOpenPreferences={() => setShowPreferences(true)}
        onOpenLogBrowserSettings={() => setShowLogBrowserSettings(true)}
        onLogout={onLogout}
        onChangeServer={onChangeServer}
      />
      {showPreferences && <PreferencesScreen onClose={() => setShowPreferences(false)} />}
      {showLogBrowserSettings && (
        <LogBrowserSettingsScreen onClose={() => setShowLogBrowserSettings(false)} />
      )}
    </>
  )
}
