import { API_BASE_URL } from '../config/api'

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

const parseResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message ?? data.error ?? fallbackMessage)
  }

  return data
}

// Estados válidos según admin.reservaciones.controller.js — en minúsculas,
// sin tilde. El frontend debe usar exactamente estos valores al filtrar
// o al hacer PATCH del estado, o el backend los rechaza con 400.
export const ESTADOS_RESERVACION = ['pendiente', 'confirmada', 'cancelada', 'pagada']

// GET /api/admin/reservaciones?estado=pendiente (estado es opcional)
// Regresa { reservaciones: [...], total }
const getReservaciones = async (token, estado) => {
  const query = estado ? `?estado=${estado}` : ''
  const response = await fetch(`${API_BASE_URL}/admin/reservaciones${query}`, {
    headers: authHeaders(token),
  })
  return parseResponse(response, 'No se pudieron obtener las reservaciones.')
}

// GET /api/admin/reservaciones/:id
// Regresa { reservacion: {...} } con detalle completo (huéspedes, salida, etc.)
const getReservacionDetalle = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/reservaciones/${id}`, {
    headers: authHeaders(token),
  })
  return parseResponse(response, 'No se pudo obtener el detalle de la reservación.')
}

// PATCH /api/admin/reservaciones/:id/estado
// body: { estado, motivo? } — motivo solo aplica al cancelar
const cambiarEstadoReservacion = async (id, estado, token, motivo) => {
  const response = await fetch(`${API_BASE_URL}/admin/reservaciones/${id}/estado`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(motivo ? { estado, motivo } : { estado }),
  })
  return parseResponse(response, 'No se pudo actualizar el estado de la reservación.')
}

export const adminReservationService = {
  getReservaciones,
  getReservacionDetalle,
  cambiarEstadoReservacion,
}