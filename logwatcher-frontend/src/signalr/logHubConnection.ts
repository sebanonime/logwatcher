import * as signalR from '@microsoft/signalr'
import { useConnectionStore } from '../store/connectionStore'

let connection: signalR.HubConnection | null = null
let _hubBaseUrl = ''
let retryTimer: ReturnType<typeof setInterval> | null = null

function stopBackgroundRetry(): void {
  if (retryTimer !== null) {
    clearInterval(retryTimer)
    retryTimer = null
  }
}

/** SignalR's own automatic-reconnect gives up after its retry list is exhausted (onclose fires);
 * this keeps trying silently in the background so the app recovers once the backend is back. */
function startBackgroundRetry(): void {
  if (retryTimer !== null) return
  retryTimer = setInterval(() => {
    startLogHub().catch(() => {})
  }, 10000)
}

/** Override the hub base URL (used by the desktop app to point to a remote server). */
export function setHubBaseUrl(url: string): void {
  if (_hubBaseUrl !== url) {
    _hubBaseUrl = url
    connection = null // force reconnect with new URL
  }
}

export function getHubBaseUrl(): string {
  return _hubBaseUrl
}

export function getLogHub(): signalR.HubConnection {
  if (!connection) {
    const hubUrl = _hubBaseUrl ? `${_hubBaseUrl}/logHub` : '/logHub'
    connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('logwatcher_token') ?? '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    // --- AJOUT POUR GÉRER LA RECONNEXION ---

    connection.onreconnecting((error) => {
      console.warn('[SignalR] Connexion perdue (mise en veille ou réseau). Reconnexion en cours...', error)
      useConnectionStore.getState().setStatus('reconnecting')
    })

    connection.onreconnected((connectionId) => {
      console.info(`[SignalR] Reconnexion réussie (ID: ${connectionId}).`)
      stopBackgroundRetry()
      useConnectionStore.getState().setStatus('connected')

      // On diffuse un événement global au navigateur.
      // Les composants React pourront l'écouter pour forcer un rafraîchissement.
      window.dispatchEvent(new CustomEvent('logwatcher-reconnected'))
    })

    // ---------------------------------------

    connection.onclose((error) => {
      console.warn('[SignalR] Connexion fermée (reconnexion automatique épuisée).', error)
      useConnectionStore.getState().setStatus('disconnected')
      startBackgroundRetry()
    })
  }
  return connection
}

export async function startLogHub(): Promise<void> {
  const hub = getLogHub()
  if (hub.state === signalR.HubConnectionState.Disconnected) {
    await hub.start()
    stopBackgroundRetry()
    useConnectionStore.getState().setStatus('connected')
  }
}

export async function stopLogHub(): Promise<void> {
  stopBackgroundRetry()
  if (connection) {
    await connection.stop()
    connection = null
  }
}
