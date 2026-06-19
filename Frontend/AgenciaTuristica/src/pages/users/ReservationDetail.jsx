import { Link, Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useReservation from '../../hooks/useReservation'
import { canCancelReservation } from '../../utils/reservationStorage'
import styles from './UserPage.module.css'

function ReservationDetail() {
  const { reservationId } = useParams()
  const { isAuthenticated } = useAuth()
  const {
    cancelReservation,
    error,
    isLoading,
    reservation,
  } = useReservation({ reservationId })
  const [cancelReason, setCancelReason] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: `/reservations/${reservationId}` }} to="/login" />
  }

  if (isLoading) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <p>Cargando reservacion...</p>
        </section>
      </main>
    )
  }

  if (!reservation) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>Reservacion</span>
            <h1>No encontrada</h1>
            <p>{error || 'No pudimos encontrar esta reservacion en tu cuenta.'}</p>
          </header>

          <div className={styles.actions}>
            <Link to="/reservations">Mis reservaciones</Link>
          </div>
        </section>
      </main>
    )
  }

  const canCancel = canCancelReservation(reservation)

  const handleCancel = async () => {
    if (!canCancel) return

    setIsCancelling(true)

    try {
      await cancelReservation({
        reason: cancelReason.trim() || 'Cancelada por el usuario',
        reservationId: reservation.id,
      })
    } catch {
      // useReservation already exposes the error message.
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Reservacion</span>
          <h1>Detalle de reserva</h1>
          <p>Consulta el estado, fechas, huespedes y politica de cancelacion.</p>
        </header>

        <div className={styles.reservationDetailGrid}>
          <article className={styles.detailPanel}>
            <div className={styles.detailPanelHeader}>
              <div>
                <span
                  className={`${styles.status} ${
                    reservation.status === 'Cancelada' ? styles.statusCancelled : ''
                  }`}
                >
                  {reservation.status}
                </span>
                <h2>{reservation.packageName}</h2>
                <p>{reservation.destination}</p>
              </div>
              <strong>${reservation.totalAmount.toLocaleString()} MXN</strong>
            </div>

            <h3>Datos de la reservacion</h3>
            <ul className={styles.detailList}>
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
            </ul>

            <h3>Pago</h3>
            <ul className={styles.detailList}>
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

          <aside className={`${styles.detailPanel} ${styles.cancellationPanel}`}>
            <div className={styles.cancellationHeader}>
              <span>Politica</span>
              <h2>Cancelacion</h2>
            </div>
            {reservation.status === 'Cancelada' ? (
              <div className={styles.cancellationNotice}>
                <strong>Reservacion cancelada</strong>
                <p>Esta reservacion ya fue cancelada y no requiere ninguna accion adicional.</p>
                {reservation.cancellationReason && <span>Motivo: {reservation.cancellationReason}</span>}
              </div>
            ) : !canCancel ? (
              <div className={styles.cancellationNotice}>
                <strong>Cancelacion no disponible</strong>
                <p>
                  La fecha limite para cancelar fue el {reservation.cancellationDeadline}. Si necesitas
                  ayuda, contacta a soporte para revisar alternativas.
                </p>
                <div className={styles.actions}>
                  <Link className={styles.secondary} to="/reservations">
                    Volver a mis reservaciones
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p>
                  Puedes cancelar esta reservacion hasta el {reservation.cancellationDeadline}. Esta accion
                  libera tus lugares y cambia el estado de la reserva.
                </p>
                <div className={styles.form}>
                  <label>
                    Motivo opcional
                    <textarea
                      onChange={(event) => setCancelReason(event.target.value)}
                      placeholder="Ej. Cambio de planes"
                      value={cancelReason}
                    />
                  </label>
                </div>
                <div className={styles.actions}>
                  {error && <p className={styles.error}>{error}</p>}
                  <button
                    className={styles.danger}
                    disabled={isCancelling}
                    type="button"
                    onClick={handleCancel}
                  >
                    {isCancelling ? 'Cancelando...' : 'Cancelar reservacion'}
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
