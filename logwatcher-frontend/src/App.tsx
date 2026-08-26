import React, { useEffect, useState } from 'react'
import { useLogHub } from './hooks/useLogHub'
import { usePerimeterStore } from './store/perimeterStore'
import { LoginScreen } from './components/LoginScreen'
import { MainLayout } from './components/MainLayout'
import { PreferencesScreen } from './components/settings/PreferencesScreen'
import { LogBrowserSettingsScreen } from './components/settings/LogBrowserSettingsScreen'
import { usePreferencesStore } from './store/preferencesStore'
import { fetchAuthConfig, type AuthUiDescriptor } from './api/auth'

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('logwatcher_token'))
  const [authConfig, setAuthConfig] = useState<AuthUiDescriptor | null>(null)

  useEffect(() => {
    // Redirect-mode (company SSO) callback lands back here as "/?token=...".
    const urlToken = new URLSearchParams(window.location.search).get('token')
    if (urlToken) {
      localStorage.setItem('logwatcher_token', urlToken)
      window.history.replaceState({}, '', window.location.pathname)
      setToken(urlToken)
    }

    // Falls back to the password form if the backend predates this endpoint.
    fetchAuthConfig().then(setAuthConfig).catch(() => setAuthConfig({ mode: 'password' }))
  }, [])

  if (!authConfig) return null

  if (!token && authConfig.mode !== 'none') {
    return <LoginScreen onLogin={setToken} authConfig={authConfig} />
  }

  return <LoggedInApp onLogout={() => { localStorage.removeItem('logwatcher_token'); setToken(null) }} />
}

function LoggedInApp({ onLogout }: { onLogout: () => void }) {
  const hub = useLogHub()
  const { selectPerimeter, perimeters, fetchPerimeters } = usePerimeterStore()
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
    const lastPerimeterId = localStorage.getItem('logwatcher_last_perimeter')
    const perimeterToSelect = perimeters.find(p => p.id === lastPerimeterId) || perimeters[0]
    if (perimeterToSelect) {
      selectPerimeter(perimeterToSelect.id)
    }
    setIsInitialized(true)
  }, [perimeters, isInitialized, selectPerimeter])

  return (
    <>
      <MainLayout
        hub={hub}
        onOpenPreferences={() => setShowPreferences(true)}
        onOpenLogBrowserSettings={() => setShowLogBrowserSettings(true)}
      />
      {showPreferences && <PreferencesScreen onClose={() => setShowPreferences(false)} />}
      {showLogBrowserSettings && <LogBrowserSettingsScreen onClose={() => setShowLogBrowserSettings(false)} />}
    </>
  )
}

export default App
