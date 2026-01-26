import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../utils/api'

interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  photo?: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: { name: string; email: string; password: string; role?: string }) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const response = await api.getMe()
          if (response.success) {
            setUser(response.data)
            setToken(storedToken)
          } else {
            localStorage.removeItem('token')
            setToken(null)
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password)
    if (response.success && response.token) {
      localStorage.setItem('token', response.token)
      setToken(response.token)
      setUser(response.user)
    } else {
      throw new Error(response.message || 'Login failed')
    }
  }

  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    const response = await api.register(userData)
    if (response.success && response.token) {
      localStorage.setItem('token', response.token)
      setToken(response.token)
      setUser(response.user)
    } else {
      throw new Error(response.message || 'Registration failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    api.logout().catch(console.error)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}



