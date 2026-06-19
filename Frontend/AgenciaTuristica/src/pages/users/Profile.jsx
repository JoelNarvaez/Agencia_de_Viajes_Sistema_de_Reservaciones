import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useReservation from '../../hooks/useReservation'
import { userService } from '../../services/userService'
import styles from './UserPage.module.css'

const getInitialProfile = (user) => {
  const fullName =
    [user?.nombre, user?.apellido].filter(Boolean).join(' ') ||
    user?.name ||
    'Usuario'

  return {
    email: user?.email ?? '',
    fullName,
    phone: user?.telefono ?? user?.phone ?? '',
    username: user?.username ?? user?.email?.split('@')[0] ?? '',
  }
}

function Profile() {
  const { isAuthenticated, token, updateUser, user } = useAuth()
  const { reservations } = useReservation({ scope: 'mine' })
  const initialProfile = useMemo(() => getInitialProfile(user), [user])
  const [profileData, setProfileData] = useState(initialProfile)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    if (!token) return

    let isMounted = true

    const loadProfile = async () => {
      try {
        const profile = await userService.getProfile(token)
        if (!isMounted) return

        updateUser(profile)
        setProfileData(getInitialProfile(profile))
      } catch (loadError) {
        if (isMounted) setError(loadError.message ?? 'No se pudo cargar el perfil.')
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [token, updateUser])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfileData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
    setSavedMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isEditing) {
      setIsEditing(true)
      setSavedMessage('')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const [nombre = '', ...apellidoParts] = profileData.fullName.trim().split(/\s+/)
      const updatedUser = await userService.updateProfile({
        profile: {
          apellido: apellidoParts.join(' '),
          nombre,
          telefono: profileData.phone,
        },
        token,
      })

      updateUser(updatedUser)
      setProfileData(getInitialProfile(updatedUser))
      setIsEditing(false)
      setSavedMessage('Cambios guardados.')
    } catch (saveError) {
      setError(saveError.message ?? 'No se pudo guardar el perfil.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: '/profile' }} to="/login" />
  }

  return (
    <main className={styles.page}>
      <section className={styles.profileShell}>
        <header className={styles.profileHeader}>
          <span className={styles.eyebrow}>Cuenta</span>
          <h1>Mi perfil</h1>
          <p>Administra tus datos personales para tus proximas reservaciones.</p>
        </header>

        <form className={styles.profileCard} onSubmit={handleSubmit}>
          <label className={styles.profileField}>
            <span>Full Name</span>
            <input
              disabled={!isEditing}
              name="fullName"
              onChange={handleChange}
              placeholder="Tu nombre completo"
              value={profileData.fullName}
            />
          </label>

          <label className={styles.profileField}>
            <span>Email</span>
            <input
              disabled
              name="email"
              placeholder="correo@ejemplo.com"
              type="email"
              value={profileData.email}
            />
          </label>

          <label className={styles.profileField}>
            <span>Username</span>
            <input
              disabled={!isEditing}
              name="username"
              onChange={handleChange}
              placeholder="usuario"
              value={profileData.username}
            />
          </label>

          <label className={styles.profileField}>
            <span>Phone Number</span>
            <input
              disabled={!isEditing}
              name="phone"
              onChange={handleChange}
              placeholder="+52 449 000 0000"
              value={profileData.phone}
            />
          </label>

          <div className={styles.profileStats}>
            <span>Reservaciones</span>
            <strong>{reservations.length}</strong>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {savedMessage && <p className={styles.successMessage}>{savedMessage}</p>}

          <footer className={styles.profileActions}>
            <button className={styles.saveButton} type="submit">
              {isSaving ? 'Guardando...' : isEditing ? 'Guardar' : 'Editar'}
            </button>
          </footer>
        </form>
      </section>
    </main>
  )
}

export default Profile
