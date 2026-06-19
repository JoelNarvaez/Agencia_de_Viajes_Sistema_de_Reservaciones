import { useContext, useEffect, useMemo } from 'react'
import { ReservationContext } from '../context/reservationContextValue'
import useAuth from './useAuth'

function useReservation({ reservationId, scope } = {}) {
  const context = useContext(ReservationContext)
  const { token } = useAuth()

  if (!context) {
    throw new Error('useReservation debe usarse dentro de ReservationProvider')
  }

  const {
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
  } = context

  useEffect(() => {
    if (!token) return

    if (scope === 'mine' && !loadedScopes.mine) {
      loadMine()
      return
    }

    if (scope === 'admin' && !loadedScopes.admin) {
      loadAdmin()
      return
    }

    if (reservationId && !reservationById[reservationId]) {
      loadById(reservationId)
    }
  }, [loadAdmin, loadById, loadMine, loadedScopes.admin, loadedScopes.mine, reservationById, reservationId, scope, token])

  const reservations = useMemo(() => {
    if (scope === 'admin') return adminReservations
    return myReservations
  }, [adminReservations, myReservations, scope])

  return {
    cancelReservation,
    clearReservationError,
    error,
    isLoading,
    loadAdmin,
    loadById,
    loadMine,
    reservation: reservationId ? reservationById[reservationId] ?? null : null,
    reservations,
  }
}

export default useReservation
