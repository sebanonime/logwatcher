import React, { useState } from 'react'
import { useLogHub } from './hooks/useLogHub'
import { usePerimeterStore } from './store/perimeterStore'
import { LoginScreen } from './components/LoginScreen'
import { PerimeterSelector } from './components/PerimeterSelector'
import { MainLayout } from './components/MainLayout'
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
  const [showPerimeterSelector, setShowPerimeterSelector] = useState(!selectedPerimeterId)

  const handleSelectPerimeter = (p: PerimeterDto) => {
    selectPerimeter(p.id)
    setShowPerimeterSelector(false)
  }

  if (showPerimeterSelector) {
    return <PerimeterSelector onSelect={handleSelectPerimeter} />
  }

  return (
    <MainLayout
      hub={hub}
      onSwitchPerimeter={() => setShowPerimeterSelector(true)}
      onLogout={onLogout}
    />
  )
}

export default App
