import { useState } from 'react'
import PropTypes from 'prop-types'
import useAuth from '../../hooks/useAuth'
import styles from './Login.module.css'

const initialFormData = {
  email: '',
  password: '',
  rememberSession: true,
}

function Login({ onLoginSuccess }) {
  const { error: authError, isLoading, login } = useAuth()
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState('')

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
    } catch {
      // AuthContext already exposes the API error for the UI.
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="login-title">
        <div className={styles.formShell}>
          <a className={styles.backLink} href="/">Volver al inicio</a>

          <div className={styles.header}>
            <span>Bienvenido de vuelta</span>
            <h2 id="login-title">Iniciar sesion</h2>
            <p>Ingresa a tu cuenta para continuar.</p>
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
              <input
                autoComplete="current-password"
                name="password"
                onChange={handleChange}
                placeholder="Tu contrasena"
                type="password"
                value={formData.password}
              />
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
              {isLoading ? 'Ingresando...' : 'Iniciar sesion'}
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
