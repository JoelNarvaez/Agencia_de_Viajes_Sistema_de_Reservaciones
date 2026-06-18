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

  const handleCancel = () => {
    setProfileData(initialProfile)
    setSavedMessage('')
  }

  const handleSave = (event) => {
    event.preventDefault()
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

        <form className={styles.profileCard} onSubmit={handleSave}>
          <label className={styles.profileField}>
            <span>Full Name</span>
            <input
              name="fullName"
              onChange={handleChange}
              placeholder="Tu nombre completo"
              value={profileData.fullName}
            />
          </label>

          <label className={styles.profileField}>
            <span>Email</span>
            <div className={styles.verifiedField}>
              <input
                name="email"
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                type="email"
                value={profileData.email}
              />
              <strong aria-label="Correo verificado">✓</strong>
            </div>
          </label>

          <label className={styles.profileField}>
            <span>Username</span>
            <div className={styles.verifiedField}>
              <input
                name="username"
                onChange={handleChange}
                placeholder="usuario"
                value={profileData.username}
              />
              <strong aria-label="Usuario disponible">✓</strong>
            </div>
          </label>

          <label className={styles.profileField}>
            <span>Phone Number</span>
            <input
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
            <button className={styles.deleteAccountButton} type="button">
              Eliminar cuenta
            </button>
            <div>
              <button className={styles.cancelButton} type="button" onClick={handleCancel}>
                Cancelar
              </button>
              <button className={styles.saveButton} type="submit">
                Guardar
              </button>
            </div>
          </footer>
        </form>
      </section>
    </main>
  )
}

export default Profile
