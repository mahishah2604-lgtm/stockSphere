import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMe, login as loginRequest, register as registerRequest } from '../services/api'
import type { User } from '../types'

type AuthContextValue = {
  user: User | null
  token: string | null
  loading: boolean
  login: (payload: { email: string; password: string }) => Promise<void>
  register: (payload: {
    username: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    let mounted = true

    async function restoreSession() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await getMe()
        if (mounted) setUser(currentUser)
      } catch {
        localStorage.removeItem('token')
        if (mounted) {
          setUser(null)
          setToken(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    restoreSession()

    return () => {
      mounted = false
    }
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      async login(payload) {
        const data = await loginRequest(payload)
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(data.user)
      },
      async register(payload) {
        const data = await registerRequest(payload)
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(data.user)
      },
      logout() {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      },
    }),
    [loading, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
