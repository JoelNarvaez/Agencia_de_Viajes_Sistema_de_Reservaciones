import { apiRequest } from './apiClient'

// El backend espera estos estados exactos en filtros y cambios de estado.
export const ESTADOS_RESERVACION = ['pendiente', 'confirmada', 'cancelada', 'pagada']

// Trae todas las reservaciones para el panel admin.
// Si se manda "estado", el backend filtra por pendiente/confirmada/cancelada/pagada.
const getReservaciones = async (token, estado) => {
  // Si estado viene vacio se consultan todas; si viene, se manda como query param.
  const query = estado ? `?estado=${estado}` : ''

  return apiRequest(`/admin/reservaciones${query}`, {
    fallbackMessage: 'No se pudieron obtener las reservaciones.',
    token,
  })
}

// Trae una sola reservacion con informacion mas completa para el modal de detalle.
// Recibe el id de la reservacion y el token de administrador.
const getReservacionDetalle = async (id, token) =>
  apiRequest(`/admin/reservaciones/${id}`, {
    fallbackMessage: 'No se pudo obtener el detalle de la reservacion.',
    token,
  })

// Cambia el estado de una reservacion desde admin.
// Cuando se cancela, puede mandar un motivo opcional en el body.
const cambiarEstadoReservacion = async (id, estado, token, motivo) =>
  apiRequest(`/admin/reservaciones/${id}/estado`, {
    body: motivo ? { estado, motivo } : { estado },
    fallbackMessage: 'No se pudo actualizar el estado de la reservacion.',
    method: 'PATCH',
    token,
  })

// Objeto que importan las paginas admin para no usar las funciones sueltas.
export const adminReservationService = {
  cambiarEstadoReservacion,
  getReservacionDetalle,
  getReservaciones,
}
