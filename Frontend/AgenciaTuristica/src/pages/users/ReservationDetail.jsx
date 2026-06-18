import { Link, Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import {
  canCancelReservation,
  getReservationById,
  updateReservation,
} from '../../utils/reservationStorage'
import styles from './UserPage.module.css'

function ReservationDetail() {
  const { reservationId } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [cancelReason, setCancelReason] = useState('')
  const [reservation, setReservation] = useState(() => getReservationById(reservationId))

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: `/reservations/${reservationId}` }} to="/login" />
  }

  if (!reservation || reservation.userEmail !== (user?.email ?? 'usuario-local')) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>Reservacion</span>
            <h1>No encontrada</h1>
            <p>No pudimos encontrar esta reservacion en tu cuenta.</p>
          </header>

          <div className={styles.actions}>
            <Link to="/reservations">Mis reservaciones</Link>
          </div>
        </section>
      </main>
    )
  }

  const canCancel = canCancelReservation(reservation)

  const handleCancel = () => {
    if (!canCancel) return

    const updatedReservation = updateReservation(reservation.id, (currentReservation) => ({
      ...currentReservation,
      cancellationReason: cancelReason.trim() || 'Cancelada por el usuario',
      cancelledAt: new Date().toISOString(),
      status: 'Cancelada',
    }))
    setReservation(updatedReservation)
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Reservacion</span>
          <h1>Detalle de reserva</h1>
          <p>Consulta el estado, fechas, huespedes y politica de cancelacion.</p>
        </header>

        <div className={styles.summaryGrid}>
          <article className={styles.card}>
            <span className={styles.status}>{reservation.status}</span>
            <ul className={styles.detailList}>
              <li>
                <span>Paquete</span>
                <strong>{reservation.packageName}</strong>
              </li>
              <li>
                <span>Destino</span>
                <strong>{reservation.destination}</strong>
              </li>
              <li>
                <span>Fecha</span>
                <strong>{reservation.travelDate}</strong>
              </li>
              <li>
                <span>Huespedes</span>
                <strong>{reservation.totalGuests}</strong>
              </li>
              <li>
                <span>Total</span>
                <strong>${reservation.totalAmount.toLocaleString()} MXN</strong>
              </li>
              <li>
                <span>Pago</span>
                <strong>{reservation.payment?.status ?? 'Pendiente'}</strong>
              </li>
              {reservation.payment?.reference && (
                <li>
                  <span>Referencia</span>
                  <strong>{reservation.payment.reference}</strong>
                </li>
              )}
              {reservation.payment?.cardLast4 && (
                <li>
                  <span>Tarjeta</span>
                  <strong>**** {reservation.payment.cardLast4}</strong>
                </li>
              )}
              <li>
                <span>Cancelar hasta</span>
                <strong>{reservation.cancellationDeadline}</strong>
              </li>
            </ul>

            <div className={styles.actions}>
              <Link to={`/packages/${reservation.packageId}`}>Ver paquete</Link>
              <Link className={styles.secondary} to="/reservations">
                Mis reservaciones
              </Link>
            </div>
          </article>

          <aside className={styles.card}>
            <h2>Cancelacion</h2>
            {reservation.status === 'Cancelada' ? (
              <p>Esta reservacion fue cancelada.</p>
            ) : (
              <>
                <p>
                  {canCancel
                    ? 'Puedes cancelar esta reservacion porque aun esta dentro del plazo permitido.'
                    : 'Ya no se puede cancelar desde la app porque paso la fecha limite.'}
                </p>
                <div className={styles.form}>
                  <label>
                    Motivo opcional
                    <textarea
                      disabled={!canCancel}
                      onChange={(event) => setCancelReason(event.target.value)}
                      placeholder="Ej. Cambio de planes"
                      value={cancelReason}
                    />
                  </label>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.danger}
                    disabled={!canCancel}
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancelar reservacion
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}

export default ReservationDetail
