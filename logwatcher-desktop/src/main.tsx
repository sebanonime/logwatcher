import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { setHubBaseUrl } from '@shared/signalr/logHubConnection'

// ─── Apply theme before first render (avoids flash of unstyled content) ───────
{
  const saved = localStorage.getItem('logwatcher_theme') ?? 'dark'
  document.documentElement.dataset.theme = saved as 'dark' | 'light'
}

// ─── Intercept fetch for remote API calls ─────────────────────────────────────
// The shared frontend uses relative URLs like /api/* and /logHub.
// In the desktop app we redirect those to the configured remote server.
const api = window.electronAPI
const _serverUrl = api?.initialServerUrl ?? ''

if (_serverUrl) {
  const _origFetch = globalThis.fetch.bind(globalThis)

  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (typeof input === 'string' && input.startsWith('/')) {
      return _origFetch(_serverUrl + input, init)
    }
    if (input instanceof Request && input.url.startsWith('/')) {
      return _origFetch(new Request(_serverUrl + input.url, input), init)
    }
    return _origFetch(input, init)
  }

  // Point SignalR at the remote server
  setHubBaseUrl(_serverUrl)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
