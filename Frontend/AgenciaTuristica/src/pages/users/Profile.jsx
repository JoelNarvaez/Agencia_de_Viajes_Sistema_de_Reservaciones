import { useMemo, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { getUserReservations } from '../../utils/reservationStorage'
import styles from './UserPage.module.css'

const getInitialProfile = (user) => {
  const fullName =
    [user?.nombre, user?.apellido].filter(Boolean).join(' ') ||
    user?.name ||
    'Usuario'

  return {
    email: user?.email ?? '',
    fullName,
    phone: user?.phone ?? '',
    username: user?.username ?? user?.email?.split('@')[0] ?? '',
  }
}

function Profile() {
  const { user } = useAuth()
  const initialProfile = useMemo(() => getInitialProfile(user), [user])
  const [profileData, setProfileData] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const reservations = getUserReservations(user?.email ?? 'usuario-local')

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfileData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
    setSavedMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isEditing) {
      setIsEditing(true)
      setSavedMessage('')
      return
    }

    setIsEditing(false)
    setSavedMessage('Cambios guardados de forma local.')
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

          {savedMessage && <p className={styles.successMessage}>{savedMessage}</p>}

          <footer className={styles.profileActions}>
            <button className={styles.saveButton} type="submit">
              {isEditing ? 'Guardar' : 'Editar'}
            </button>
          </footer>
        </form>
      </section>
    </main>
  )
}

export default Profile
