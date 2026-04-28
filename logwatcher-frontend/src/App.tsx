import React, { useEffect, useState } from 'react'
import { useLogHub } from './hooks/useLogHub'
import { usePerimeterStore } from './store/perimeterStore'
import { LoginScreen } from './components/LoginScreen'
import { MainLayout } from './components/MainLayout'
import { PreferencesScreen } from './components/settings/PreferencesScreen'
import { LogBrowserSettingsScreen } from './components/settings/LogBrowserSettingsScreen'
import { usePreferencesStore } from './store/preferencesStore'

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('logwatcher_token'))

  if (!token) {
    return <LoginScreen onLogin={setToken} />
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
        onSwitchPerimeter={() => {}}
        onOpenPreferences={() => setShowPreferences(true)}
        onOpenLogBrowserSettings={() => setShowLogBrowserSettings(true)}
        onLogout={onLogout}
      />
      {showPreferences && <PreferencesScreen onClose={() => setShowPreferences(false)} />}
      {showLogBrowserSettings && <LogBrowserSettingsScreen onClose={() => setShowLogBrowserSettings(false)} />}
    </>
  )
}

export default App
