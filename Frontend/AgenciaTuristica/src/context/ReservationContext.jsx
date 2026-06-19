import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { reservationService } from '../services/reservationService'
import useAuth from '../hooks/useAuth'
import { ReservationContext } from './reservationContextValue'

function ReservationProvider({ children }) {
  const { token } = useAuth()
  const [adminReservations, setAdminReservations] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadedScopes, setLoadedScopes] = useState({
    admin: false,
    mine: false,
  })
  const [myReservations, setMyReservations] = useState([])
  const [reservationById, setReservationById] = useState({})

  const clearReservationError = useCallback(() => {
    setError('')
  }, [])

  const loadMine = useCallback(async () => {
    if (!token) return []

    setIsLoading(true)
    setError('')

    try {
      const reservations = await reservationService.getMine(token)
      setMyReservations(reservations)
      setLoadedScopes((currentScopes) => ({ ...currentScopes, mine: true }))
      return reservations
    } catch (loadError) {
      const message = loadError.message ?? 'No se pudieron cargar tus reservaciones.'
      setError(message)
      setMyReservations([])
      setLoadedScopes((currentScopes) => ({ ...currentScopes, mine: false }))
      return []
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const loadAdmin = useCallback(async () => {
    if (!token) return []

    setIsLoading(true)
    setError('')

    try {
      const reservations = await reservationService.getAdmin(token)
      setAdminReservations(reservations)
      setLoadedScopes((currentScopes) => ({ ...currentScopes, admin: true }))
      return reservations
    } catch (loadError) {
      const message = loadError.message ?? 'No se pudieron cargar las reservaciones.'
      setError(message)
      setAdminReservations([])
      setLoadedScopes((currentScopes) => ({ ...currentScopes, admin: false }))
      return []
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const loadById = useCallback(
    async (reservationId) => {
      if (!token || !reservationId) return null

      setIsLoading(true)
      setError('')

      try {
        const reservation = await reservationService.getById(reservationId, token)
        setReservationById((currentReservations) => ({
          ...currentReservations,
          [reservation.id]: reservation,
        }))
        return reservation
      } catch (loadError) {
        const message = loadError.message ?? 'No pudimos cargar esta reservacion.'
        setError(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [token],
  )

  const cancelReservation = useCallback(
    async ({ reason, reservationId }) => {
      if (!token || !reservationId) return null

      setError('')

      try {
        const updatedReservation = await reservationService.cancel({
          reason,
          reservationId,
          token,
        })

        setReservationById((currentReservations) => ({
          ...currentReservations,
          [updatedReservation.id]: updatedReservation,
        }))
        setMyReservations((currentReservations) =>
          currentReservations.map((reservation) =>
            reservation.id === updatedReservation.id ? updatedReservation : reservation,
          ),
        )
        setAdminReservations((currentReservations) =>
          currentReservations.map((reservation) =>
            reservation.id === updatedReservation.id ? updatedReservation : reservation,
          ),
        )
        return updatedReservation
      } catch (cancelError) {
        const message = cancelError.message ?? 'No se pudo cancelar la reservacion.'
        setError(message)
        throw cancelError
      }
    },
    [token],
  )

  const value = useMemo(
    () => ({
      adminReservations,
      cancelReservation,
      clearReservationError,
      error,
      isLoading,
      loadedScopes,
      loadAdmin,
      loadById,
      loadMine,
      myReservations,
      reservationById,
    }),
    [
      adminReservations,
      cancelReservation,
      clearReservationError,
      error,
      isLoading,
      loadedScopes,
      loadAdmin,
      loadById,
      loadMine,
      myReservations,
      reservationById,
    ],
  )

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>
}

ReservationProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ReservationProvider
