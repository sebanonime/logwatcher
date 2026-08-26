import React, { useState } from 'react'
import type { AuthUiDescriptor } from '../api/auth'

interface LoginScreenProps {
  onLogin: (token: string) => void
  authConfig: AuthUiDescriptor
}

export function LoginScreen({ onLogin, authConfig }: LoginScreenProps) {
  if (authConfig.mode === 'redirect') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-80 shadow-xl text-center">
          <h1 className="text-sm font-bold text-blue-400 mb-4">LogWatcher — Sign in</h1>
          <a
            href={authConfig.loginUrl ?? '#'}
            className="inline-block w-full px-3 py-1.5 text-xs rounded bg-blue-700 text-white hover:bg-blue-600"
          >
            Sign in with company SSO
          </a>
        </div>
      </div>
    )
  }

  return <PasswordLoginForm onLogin={onLogin} />
}

function PasswordLoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        setError('Invalid username or password.')
        return
      }
      const data = await res.json()
      localStorage.setItem('logwatcher_token', data.token)
      onLogin(data.token)
    } catch {
      setError('Could not reach the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={submit}
        className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-80 shadow-xl"
      >
        <h1 className="text-sm font-bold text-blue-400 mb-4">LogWatcher — Sign in</h1>

        <label className="block text-xs text-gray-400 mb-1">Username</label>
        <input
          className="w-full bg-gray-900 text-gray-100 text-xs px-2 py-1.5 rounded border border-gray-600 mb-3 outline-none focus:border-blue-500"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
          autoComplete="username"
        />

        <label className="block text-xs text-gray-400 mb-1">Password</label>
        <input
          type="password"
          className="w-full bg-gray-900 text-gray-100 text-xs px-2 py-1.5 rounded border border-gray-600 mb-4 outline-none focus:border-blue-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="w-full px-3 py-1.5 text-xs rounded bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-40"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
