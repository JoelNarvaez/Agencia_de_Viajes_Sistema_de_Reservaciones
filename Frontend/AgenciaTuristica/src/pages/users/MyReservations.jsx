import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import ReservationCard from '../../components/reservations/ReservationCard'
import useAuth from '../../hooks/useAuth'
import { getUserReservations } from '../../utils/reservationStorage'
import styles from './UserPage.module.css'

function MyReservations() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const reservations = useMemo(
    () => getUserReservations(user?.email ?? 'usuario-local'),
    [user?.email],
  )

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: '/reservations' }} to="/login" />
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Mis viajes</span>
          <h1>Mis reservaciones</h1>
          <p>Consulta tus reservas confirmadas, canceladas o pendientes.</p>
        </header>

        {reservations.length > 0 ? (
          <div className={styles.cardsGrid}>
            {reservations.map((reservation) => (
              <ReservationCard
                destination={reservation.destination}
                image={reservation.image}
                key={reservation.id}
                packageName={reservation.packageName}
                people={reservation.totalGuests}
                status={reservation.status}
                total={reservation.totalAmount}
                travelDate={reservation.travelDate}
                onViewDetail={() => navigate(`/reservations/${reservation.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>Aun no tienes reservaciones</h2>
            <p>Cuando confirmes una reserva, podras ver su estado, fechas, total y detalles aqui.</p>
            <div className={styles.actions}>
              <Link to="/packages">Ver paquetes</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default MyReservations
