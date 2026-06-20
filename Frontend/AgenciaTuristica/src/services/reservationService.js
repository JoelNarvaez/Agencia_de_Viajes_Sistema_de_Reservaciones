import { apiRequest } from './apiClient'
import { formatDisplayDate, getDaysBetween, toDateInput } from '../utils/formatDate'
import {
  formatGuestBreakdown,
  getCapacityGuests,
  getCompanionGuests,
  getVisibleGuestTotal,
  normalizeGuestCounts,
} from '../utils/pricing'

const normalizeStatus = (status) => {
  // Convierte estados de BD a etiquetas consistentes para la UI.
  const normalizedStatus = String(status ?? 'pendiente').toLowerCase()
  if (normalizedStatus === 'cancelada') return 'Cancelada'
  if (normalizedStatus === 'pagada') return 'Pagada'
  if (normalizedStatus === 'confirmada') return 'Confirmada'
  return 'Pendiente'
}

const normalizePayment = (status, payment = {}) => {
  // El pago es simulado; su estado se deriva del estado real de la reservacion.
  const normalizedStatus = normalizeStatus(status)

  return {
    cardLast4: payment.cardLast4 ?? payment.ultimos4 ?? null,
    method: payment.method ?? payment.metodo ?? 'Tarjeta',
    reference: payment.reference ?? payment.referencia ?? null,
    status: normalizedStatus === 'Pagada' ? 'Aprobado' : 'Pendiente',
  }
}

export const normalizeReservation = (reservation) => {
  // Adapta la respuesta de MySQL/API al modelo que usan Mis reservaciones y Detalle.
  const arrivalDate = toDateInput(reservation.fecha_llegada ?? reservation.arrivalDate)
  const departureDate = toDateInput(reservation.fecha_salida ?? reservation.departureDate)
  const guests = normalizeGuestCounts({
    adults: reservation.adultos ?? reservation.guests?.adults,
    babies: reservation.bebes ?? reservation.guests?.babies,
    children: reservation.ninos ?? reservation.guests?.children,
    pets: reservation.mascotas ?? reservation.guests?.pets,
  })
  const totalAmount = Number(reservation.monto_total ?? reservation.totalAmount ?? 0)
  const packageId = reservation.paquete_slug ?? reservation.slug ?? reservation.packageId ?? reservation.paquete_id
  const capacityGuests = Number(reservation.total_huespedes ?? getCapacityGuests(guests))
  const companionGuests = getCompanionGuests(guests)
  const status = normalizeStatus(reservation.estado ?? reservation.status)

  return {
    arrivalDate,
    cancellationDeadline: String(
      reservation.fecha_limite_cancelacion ?? reservation.cancellationDeadline ?? '',
    ).slice(0, 10),
    cancelledAt: reservation.cancelado_en ?? reservation.cancelledAt ?? null,
    cancellationReason: reservation.motivo_cancelacion ?? reservation.cancellationReason ?? '',
    createdAt: reservation.creado_en ?? reservation.createdAt ?? '',
    departureDate,
    departureId: reservation.salida_id ? String(reservation.salida_id) : null,
    destination: reservation.destino ?? reservation.destination ?? '',
    guests,
    guestBreakdown: formatGuestBreakdown(guests),
    capacityGuests,
    companionGuests,
    id: String(reservation.id),
    image: reservation.imagen_principal ?? reservation.image ?? '',
    packageBackendId: reservation.paquete_id ?? reservation.packageBackendId ?? null,
    packageId: String(packageId),
    packageName: reservation.paquete_titulo ?? reservation.packageName ?? '',
    payment: normalizePayment(reservation.estado ?? reservation.status, reservation.payment),
    status,
    totalAmount,
    totalGuests: reservation.total_huespedes
      ? capacityGuests + companionGuests
      : getVisibleGuestTotal(guests),
    travelDate: arrivalDate && departureDate
      ? `${formatDisplayDate(arrivalDate)} - ${formatDisplayDate(departureDate)}`
      : '',
    tripDays: arrivalDate && departureDate ? getDaysBetween(arrivalDate, departureDate) : 1,
    userEmail: reservation.email ?? reservation.userEmail ?? '',
  }
}

export const createReservation = async ({ payment, reservation, token }) => {
  // Crea la reservacion en backend; el pago viaja como parte de la solicitud.
  const packageBackendId = reservation.packageBackendId
  if (!packageBackendId) {
    throw new Error('Este paquete no esta vinculado con la base de datos.')
  }

  const departureId = reservation.departureId ?? null

  const response = await apiRequest('/reservaciones', {
    body: {
      arrivalDate: reservation.arrivalDate,
      departureDate: reservation.departureDate,
      departureId,
      guests: reservation.guests,
      payment,
      packageId: packageBackendId,
    },
    fallbackMessage: 'No se pudo completar la solicitud de reservacion.',
    method: 'POST',
    token,
  })

  return normalizeReservation(response.reservacion)
}

export const getMyReservations = async (token) => {
  // Reservaciones del usuario autenticado.
  const response = await apiRequest('/reservaciones/mis-reservaciones', {
    fallbackMessage: 'No se pudo completar la solicitud de reservacion.',
    token,
  })
  return (response.reservaciones ?? []).map(normalizeReservation)
}

export const getReservation = async (reservationId, token) => {
  // Detalle individual, usado por la vista de reserva y pantalla de exito.
  const response = await apiRequest(`/reservaciones/${reservationId}`, {
    fallbackMessage: 'No se pudo completar la solicitud de reservacion.',
    token,
  })
  return normalizeReservation(response.reservacion)
}

export const cancelReservation = async ({ reason, reservationId, token }) => {
  // Cancela en backend y vuelve a consultar para regresar el estado actualizado.
  await apiRequest(`/reservaciones/${reservationId}/cancelar`, {
    body: { reason },
    fallbackMessage: 'No se pudo completar la solicitud de reservacion.',
    method: 'PATCH',
    token,
  })

  return getReservation(reservationId, token)
}

export const getAdminReservations = async (token) => {
  // Vista administrativa reutiliza el mismo normalizador para mantener formato comun.
  const response = await apiRequest('/admin/reservaciones', {
    fallbackMessage: 'No se pudo completar la solicitud de reservacion.',
    token,
  })
  return (response.reservaciones ?? []).map(normalizeReservation)
}

export const reservationService = {
  cancel: cancelReservation,
  create: createReservation,
  getAdmin: getAdminReservations,
  getById: getReservation,
  getMine: getMyReservations,
}
