import { Link, Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useReservation from '../../hooks/useReservation'
import styles from './UserPage.module.css'

function UserDashboard() {
  const { isAuthenticated } = useAuth()
  const { reservations } = useReservation({ scope: 'mine' })

  const activeReservations = reservations.filter((reservation) => reservation.status !== 'Cancelada')

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: '/user' }} to="/login" />
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Panel</span>
          <h1>Mi cuenta</h1>
          <p>Accesos rapidos para administrar tu perfil y tus proximas reservaciones.</p>
        </header>

        <div className={styles.grid}>
          <article className={styles.card}>
            <h2>Perfil</h2>
            <p>Revisa los datos principales de tu cuenta.</p>
            <div className={styles.actions}>
              <Link to="/profile">Ver perfil</Link>
            </div>
          </article>

          <article className={styles.card}>
            <h2>Reservaciones</h2>
            <p>
              Tienes {activeReservations.length} reservaciones activas y {reservations.length} en total.
            </p>
            <div className={styles.actions}>
              <Link to="/reservations">Ver reservaciones</Link>
            </div>
          </article>

          <article className={styles.card}>
            <h2>Nuevo viaje</h2>
            <p>Explora paquetes disponibles y comienza una nueva reserva.</p>
            <div className={styles.actions}>
              <Link to="/packages">Ver paquetes</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default UserDashboard
