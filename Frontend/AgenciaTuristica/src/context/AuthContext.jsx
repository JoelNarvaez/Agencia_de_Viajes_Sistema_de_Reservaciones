import { useState } from 'react'
import PropTypes from 'prop-types'
import { authService } from '../services/authService'
import { AUTH_STORAGE_KEY } from '../utils/constants'
import { AuthContext } from './authContextValue'

const getStoredAuth = () => {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    return storedAuth ? JSON.parse(storedAuth) : null
  } catch {
    return null
  }
}

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => getStoredAuth())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const persistAuth = (authData) => {
    if (!authData?.token) return

    setAuthState(authData)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
  }

  const login = async (credentials) => {
    setIsLoading(true)
    setError('')

    try {
      const authData = await authService.login(credentials)
      persistAuth(authData)
      return authData
    } catch (loginError) {
      const message =
        loginError.message ??
        'No se pudo iniciar sesion. Intenta de nuevo mas tarde.'
      setError(message)
      throw loginError
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    setError('')

    try {
      const authData = await authService.register(userData)
      persistAuth(authData)
      return authData
    } catch (registerError) {
      const message =
        registerError.message ??
        'No se pudo crear la cuenta. Intenta de nuevo mas tarde.'
      setError(message)
      throw registerError
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setAuthState(null)
    setError('')
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = {
    error,
    isAuthenticated: Boolean(authState?.token),
    isLoading,
    login,
    logout,
    register,
    token: authState?.token ?? null,
    user: authState?.user ?? null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthProvider
