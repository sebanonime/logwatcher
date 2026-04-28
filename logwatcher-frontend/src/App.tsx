import React, { useEffect, useState } from 'react'
import { useLogHub } from './hooks/useLogHub'
import { usePerimeterStore } from './store/perimeterStore'
import { LoginScreen } from './components/LoginScreen'
import { PerimeterSelector } from './components/PerimeterSelector'
import { MainLayout } from './components/MainLayout'
import { PreferencesScreen } from './components/settings/PreferencesScreen'
import { LogBrowserSettingsScreen } from './components/settings/LogBrowserSettingsScreen'
import { usePreferencesStore } from './store/preferencesStore'
import type { PerimeterDto } from './types'

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('logwatcher_token'))

  if (!token) {
    return <LoginScreen onLogin={setToken} />
  }

  return <LoggedInApp onLogout={() => { localStorage.removeItem('logwatcher_token'); setToken(null) }} />
}

function LoggedInApp({ onLogout }: { onLogout: () => void }) {
  const hub = useLogHub()
  const { selectedPerimeterId, selectPerimeter } = usePerimeterStore()
  const { fetchPreferences } = usePreferencesStore()
  const [showPerimeterSelector, setShowPerimeterSelector] = useState(!selectedPerimeterId)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showLogBrowserSettings, setShowLogBrowserSettings] = useState(false)

  useEffect(() => {
    fetchPreferences().catch(() => {})
  }, [fetchPreferences])

  const handleSelectPerimeter = (p: PerimeterDto) => {
    selectPerimeter(p.id)
    setShowPerimeterSelector(false)
  }

  if (showPerimeterSelector) {
    return <PerimeterSelector onSelect={handleSelectPerimeter} />
  }

  return (
    <>
      <MainLayout
        hub={hub}
        onSwitchPerimeter={() => setShowPerimeterSelector(true)}
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
