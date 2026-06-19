import { API_BASE_URL } from '../config/api'
import { formatDisplayDate, getDaysBetween, toDateInput } from '../utils/formatDate'

const getToken = (token) => token ?? ''

const request = async (path, { body, method = 'GET', token } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${getToken(token)}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message ?? 'No se pudo completar la solicitud de reservacion.')
  }

  return data
}

const normalizeStatus = (status) => {
  const normalizedStatus = String(status ?? 'pendiente').toLowerCase()
  if (normalizedStatus === 'cancelada') return 'Cancelada'
  if (normalizedStatus === 'pagada') return 'Pagada'
  if (normalizedStatus === 'confirmada') return 'Confirmada'
  return 'Pendiente'
}

export const normalizeReservation = (reservation) => {
  const arrivalDate = toDateInput(reservation.fecha_llegada ?? reservation.arrivalDate)
  const departureDate = toDateInput(reservation.fecha_salida ?? reservation.departureDate)
  const adults = Number(reservation.adultos ?? reservation.guests?.adults ?? 1)
  const children = Number(reservation.ninos ?? reservation.guests?.children ?? 0)
  const babies = Number(reservation.bebes ?? reservation.guests?.babies ?? 0)
  const pets = Number(reservation.mascotas ?? reservation.guests?.pets ?? 0)
  const totalAmount = Number(reservation.monto_total ?? reservation.totalAmount ?? 0)
  const packageId = reservation.paquete_slug ?? reservation.slug ?? reservation.packageId ?? reservation.paquete_id

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
    guests: {
      adults,
      babies,
      children,
      pets,
    },
    id: String(reservation.id),
    image: reservation.imagen_principal ?? reservation.image ?? '',
    packageBackendId: reservation.paquete_id ?? reservation.packageBackendId ?? null,
    packageId: String(packageId),
    packageName: reservation.paquete_titulo ?? reservation.packageName ?? '',
    status: normalizeStatus(reservation.estado ?? reservation.status),
    totalAmount,
    totalGuests: Number(reservation.total_huespedes ?? adults + children + babies),
    travelDate: arrivalDate && departureDate
      ? `${formatDisplayDate(arrivalDate)} - ${formatDisplayDate(departureDate)}`
      : '',
    tripDays: arrivalDate && departureDate ? getDaysBetween(arrivalDate, departureDate) : 1,
    userEmail: reservation.email ?? reservation.userEmail ?? '',
  }
}

export const createReservation = async ({ draft, reservation, token }) => {
  const packageBackendId = draft.packageSnapshot?.backendId ?? reservation.packageBackendId
  if (!packageBackendId) {
    throw new Error('Este paquete no esta vinculado con la base de datos.')
  }

  const response = await request('/reservaciones', {
    body: {
      arrivalDate: reservation.arrivalDate,
      departureDate: reservation.departureDate,
      departureId: reservation.departureId,
      guests: reservation.guests,
      packageId: packageBackendId,
    },
    method: 'POST',
    token,
  })

  return normalizeReservation(response.reservacion)
}

export const getMyReservations = async (token) => {
  const response = await request('/reservaciones/mis-reservaciones', { token })
  return (response.reservaciones ?? []).map(normalizeReservation)
}

export const getReservation = async (reservationId, token) => {
  const response = await request(`/reservaciones/${reservationId}`, { token })
  return normalizeReservation(response.reservacion)
}

export const cancelReservation = async ({ reason, reservationId, token }) => {
  await request(`/reservaciones/${reservationId}/cancelar`, {
    body: { reason },
    method: 'PATCH',
    token,
  })

  return getReservation(reservationId, token)
}

export const getAdminReservations = async (token) => {
  const response = await request('/admin/reservaciones', { token })
  return (response.reservaciones ?? []).map(normalizeReservation)
}

export const reservationService = {
  cancel: cancelReservation,
  create: createReservation,
  getAdmin: getAdminReservations,
  getById: getReservation,
  getMine: getMyReservations,
}
