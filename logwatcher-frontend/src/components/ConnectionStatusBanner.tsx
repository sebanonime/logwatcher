import React from 'react'
import { useConnectionStore } from '../store/connectionStore'

export function ConnectionStatusBanner() {
  const status = useConnectionStore(state => state.status)

  if (status === 'connected') return null

  const isDisconnected = status === 'disconnected'
  return (
    <div className={`connection-banner ${isDisconnected ? 'connection-banner--error' : 'connection-banner--warn'}`}>
      {isDisconnected
        ? 'Connection to the server was lost. Retrying in the background…'
        : 'Reconnecting to the server…'}
    </div>
  )
}
