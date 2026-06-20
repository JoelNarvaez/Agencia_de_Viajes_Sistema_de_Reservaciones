import { Link, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import useAuth from '../../hooks/useAuth'
import useReservation from '../../hooks/useReservation'
import { isReservationPast } from '../../utils/reservationStorage'
import styles from './UserPage.module.css'

const getStatusClassName = (reservation) => {
  if (reservation.status === 'Cancelada') return styles.statusCancelled
  if (isReservationPast(reservation)) return styles.statusPast
  return ''
}

const ReservationRow = ({ reservation }) => (
  <article className={styles.reservationRow}>
    <div className={styles.reservationPackage}>
      <img src={reservation.image || '/images/packages/cancun.jpg'} alt="" />
      <div>
        <span className={`${styles.status} ${getStatusClassName(reservation)}`}>
          {isReservationPast(reservation) && reservation.status !== 'Cancelada'
            ? 'Pasada'
            : reservation.status}
        </span>
        <h2>{reservation.packageName}</h2>
        <p>{reservation.destination}</p>
      </div>
    </div>

    <div className={styles.reservationMeta}>
      <span>Fecha</span>
      <strong>{reservation.travelDate}</strong>
    </div>

    <div className={styles.reservationMeta}>
      <span>Huespedes</span>
      <strong>{reservation.totalGuests}</strong>
    </div>

    <div className={styles.reservationMeta}>
      <span>Total</span>
      <strong>${reservation.totalAmount.toLocaleString()} MXN</strong>
    </div>

    <Link className={styles.detailButton} to={`/reservations/${reservation.id}`}>
      Ver detalle
    </Link>
  </article>
)

const ReservationSection = ({ emptyText, reservations, title }) => (
  <section className={styles.reservationSection}>
    <div className={styles.reservationSectionHeader}>
      <h2>{title}</h2>
      <span>{reservations.length}</span>
    </div>
    {reservations.length > 0 ? (
      <div className={styles.reservationList}>
        {reservations.map((reservation) => (
          <ReservationRow key={reservation.id} reservation={reservation} />
        ))}
      </div>
    ) : (
      <p className={styles.sectionEmpty}>{emptyText}</p>
    )}
  </section>
)

function MyReservations() {
  const { isAuthenticated } = useAuth()
  const { error, isLoading, reservations } = useReservation({ scope: 'mine' })
  const groupedReservations = useMemo(
    () => ({
      active: reservations.filter(
        (reservation) => reservation.status !== 'Cancelada' && !isReservationPast(reservation),
      ),
      cancelled: reservations.filter((reservation) => reservation.status === 'Cancelada'),
      past: reservations.filter(
        (reservation) => reservation.status !== 'Cancelada' && isReservationPast(reservation),
      ),
    }),
    [reservations],
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

        {isLoading && <p>Cargando reservaciones...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!isLoading && reservations.length > 0 ? (
          <>
            <ReservationSection
              emptyText="No tienes reservaciones activas."
              reservations={groupedReservations.active}
              title="Activas"
            />
            <ReservationSection
              emptyText="No tienes reservaciones pasadas."
              reservations={groupedReservations.past}
              title="Pasadas"
            />
            <ReservationSection
              emptyText="No tienes reservaciones canceladas."
              reservations={groupedReservations.cancelled}
              title="Canceladas"
            />
          </>
        ) : !isLoading && (
          <div className={styles.emptyState}>
            <h2>Aun no tienes reservaciones</h2>
            <p>Cuando confirmes una reserva, podrás ver su estado, fechas, total y detalles aquí.</p>
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
