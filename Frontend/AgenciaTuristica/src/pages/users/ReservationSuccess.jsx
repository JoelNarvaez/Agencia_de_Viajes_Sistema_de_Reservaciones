import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { reservationService } from '../../services/reservationService'
import styles from './UserPage.module.css'

function ReservationSuccess() {
  const [searchParams] = useSearchParams()
  const { token } = useAuth()
  const reservationId = searchParams.get('reservationId')
  const [reservation, setReservation] = useState(null)

  useEffect(() => {
    if (!reservationId || !token) return

    let isMounted = true

    const loadReservation = async () => {
      try {
        const reservationDetail = await reservationService.getById(reservationId, token)
        if (isMounted) setReservation(reservationDetail)
      } catch {
        if (isMounted) setReservation(null)
      }
    }

    loadReservation()

    return () => {
      isMounted = false
    }
  }, [reservationId, token])

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Reservacion creada</span>
          <h1>Reserva confirmada</h1>
          <p>Tu reservacion ya se guardo y puedes consultarla desde mis reservaciones.</p>
        </header>

        {reservation && (
          <article className={styles.card}>
            <ul className={styles.detailList}>
              <li>
                <span>Paquete</span>
                <strong>{reservation.packageName}</strong>
              </li>
              <li>
                <span>Fecha</span>
                <strong>{reservation.travelDate}</strong>
              </li>
              <li>
                <span>Total</span>
                <strong>${reservation.totalAmount.toLocaleString()} MXN</strong>
              </li>
              <li>
                <span>Pago</span>
                <strong>{reservation.payment?.status ?? 'Aprobado'}</strong>
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
            </ul>
          </article>
        )}

        <div className={styles.actions}>
          {reservation && <Link to={`/reservations/${reservation.id}`}>Ver detalle</Link>}
          <Link className={styles.secondary} to="/reservations">
            Mis reservaciones
          </Link>
          <Link className={styles.secondary} to="/packages">
            Ver mas paquetes
          </Link>
        </div>
      </section>
    </main>
  )
}

export default ReservationSuccess
