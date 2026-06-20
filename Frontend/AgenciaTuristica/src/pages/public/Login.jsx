import { useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Loader from '../../components/common/Loader'
import { mostrarLoginExitoso } from '../../utils/swal'
import styles from './Login.module.css'

const initialFormData = {
  email: '',
  password: '',
  rememberSession: true,
}

function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { error: authError, isLoading, login } = useAuth()
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!formData.email.trim() || !formData.password.trim()) {
      setFormError('Ingresa tu correo y contrasena para continuar.')
      return
    }

    try {
      const authData = await login({
        email: formData.email.trim(),
        password: formData.password,
        rememberSession: formData.rememberSession,
      })

      onLoginSuccess?.(authData)
      mostrarLoginExitoso(
        [authData.user?.nombre, authData.user?.apellido].filter(Boolean).join(' ') ||
          authData.user?.email ||
          'usuario',
      )
      navigate(location.state?.from ?? '/', { replace: true })
    } catch {
      // AuthContext already exposes the API error for the UI.
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="login-title">
        <div className={styles.formShell}>
          <div className={styles.header}>
            <span>Bienvenido de vuelta</span>
            <h2 id="login-title">Iniciar sesion</h2>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label>
              <span>Correo electronico</span>
              <input
                autoComplete="email"
                name="email"
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                type="email"
                value={formData.email}
              />
            </label>

            <label>
              <span>Contrasena</span>
              <div className={styles.passwordField}>
                <input
                  autoComplete="current-password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Tu contrasena"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                />
                <button
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((currentValue) => !currentValue)}
                  type="button"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3.3 2 22 20.7 20.7 22l-3.2-3.2A11.3 11.3 0 0 1 12 20C7 20 3.2 16.8 1 12c1-2.2 2.4-4 4.2-5.4L2 3.3 3.3 2Zm6.1 6.1 1.7 1.7A2.6 2.6 0 0 1 14.2 13l1.7 1.7A4.8 4.8 0 0 0 9.4 8.1Zm2.2 2.2 2.1 2.1v-.3a1.8 1.8 0 0 0-1.8-1.8h-.3ZM12 4c5 0 8.8 3.2 11 8a14.1 14.1 0 0 1-2.9 4.2l-2.5-2.5A5.8 5.8 0 0 0 10.3 6l-2-2A11.8 11.8 0 0 1 12 4Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 4c5 0 8.8 3.2 11 8-2.2 4.8-6 8-11 8S3.2 16.8 1 12c2.2-4.8 6-8 11-8Zm0 2C8.1 6 5 8.2 3.2 12 5 15.8 8.1 18 12 18s7-2.2 8.8-6C19 8.2 15.9 6 12 6Zm0 2.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Zm0 2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <div className={styles.options}>
              <label className={styles.checkbox}>
                <input
                  checked={formData.rememberSession}
                  name="rememberSession"
                  onChange={handleChange}
                  type="checkbox"
                />
                <span>Recordar sesion</span>
              </label>

              <a href="/forgot-password">Olvide mi contrasena</a>
            </div>

            {(formError || authError) && (
              <p className={styles.errorMessage}>{formError || authError}</p>
            )}

            <button className={styles.submitButton} disabled={isLoading} type="submit">
              {isLoading ? <Loader text="Ingresando..." variant="inline" /> : 'Iniciar sesion'}
            </button>
          </form>

          <p className={styles.registerText}>
            No tienes cuenta? <a href="/register">Crear cuenta</a>
          </p>
        </div>
      </section>
    </main>
  )
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func,
}

export default Login
