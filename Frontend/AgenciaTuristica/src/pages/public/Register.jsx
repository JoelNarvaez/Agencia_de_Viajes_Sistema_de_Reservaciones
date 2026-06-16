import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import styles from './Register.module.css'

const initialFormData = {
  confirmPassword: '',
  email: '',
  fullName: '',
  password: '',
  phone: '',
  termsAccepted: false,
}

function Register({ onRegisterSuccess }) {
  const navigate = useNavigate()
  const { error: authError, isLoading, register } = useAuth()
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState('')

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Ingresa tu nombre completo.'
    if (!formData.email.trim()) return 'Ingresa tu correo electronico.'
    if (!formData.phone.trim()) return 'Ingresa tu telefono.'
    if (formData.password.length < 8) {
      return 'La contrasena debe tener al menos 8 caracteres.'
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Las contrasenas no coinciden.'
    }
    if (!formData.termsAccepted) {
      return 'Acepta los terminos para crear tu cuenta.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const validationError = validateForm()

    if (validationError) {
      setFormError(validationError)
      return
    }

    try {
      const authData = await register({
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        name: formData.fullName.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
      })

      onRegisterSuccess?.(authData)
      navigate(authData?.token ? '/' : '/login')
    } catch {
      // AuthContext exposes the API error for rendering.
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="register-title">
        <div className={styles.formShell}>
          <a className={styles.backLink} href="/">
            Volver al inicio
          </a>

          <div className={styles.header}>
            <span>Crear cuenta</span>
            <h1 id="register-title">Registrarse</h1>
            <p>Completa tus datos para empezar a organizar tus viajes.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label>
              <span>Nombre completo</span>
              <input
                autoComplete="name"
                name="fullName"
                onChange={handleChange}
                placeholder="Tu nombre"
                type="text"
                value={formData.fullName}
              />
            </label>

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
              <span>Telefono</span>
              <input
                autoComplete="tel"
                name="phone"
                onChange={handleChange}
                placeholder="Tu telefono"
                required
                type="tel"
                value={formData.phone}
              />
            </label>

            <div className={styles.passwordGrid}>
              <label>
                <span>Contrasena</span>
                <input
                  autoComplete="new-password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Minimo 8 caracteres"
                  type="password"
                  value={formData.password}
                />
              </label>

              <label>
                <span>Confirmar</span>
                <input
                  autoComplete="new-password"
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Repite tu contrasena"
                  type="password"
                  value={formData.confirmPassword}
                />
              </label>
            </div>

            <label className={styles.checkbox}>
              <input
                checked={formData.termsAccepted}
                name="termsAccepted"
                onChange={handleChange}
                type="checkbox"
              />
              <span>Acepto terminos, condiciones y politicas de privacidad.</span>
            </label>

            {(formError || authError) && (
              <p className={styles.errorMessage}>{formError || authError}</p>
            )}

            <button className={styles.submitButton} disabled={isLoading} type="submit">
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className={styles.loginText}>
            Ya tienes cuenta? <a href="/login">Iniciar sesion</a>
          </p>
        </div>
      </section>
    </main>
  )
}

Register.propTypes = {
  onRegisterSuccess: PropTypes.func,
}

export default Register
