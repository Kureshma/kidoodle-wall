import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setAuthToken } from '../api/client'

const AuthContext = createContext(null)

const STORAGE_KEY = 'kidoodle_auth'

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    const data = JSON.parse(raw)
    return { token: data.token || null, user: data.user || null }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => loadStored().token)
  const [user, setUser] = useState(() => loadStored().user)

  useEffect(() => {
    setAuthToken(token)
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [token, user])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/api/auth/register', payload)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
