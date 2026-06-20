import { apiRequest } from './apiClient'

// CRUD de paquetes usado por el panel de administrador.
// Obtiene todos los paquetes para la tabla del admin.
const getPaquetes = async () =>
  apiRequest('/paquetes', {
    fallbackMessage: 'No se pudieron obtener los paquetes.',
  })

// Obtiene un paquete por slug para cargar el formulario de edicion.
const getPaqueteBySlug = async (slug) =>
  apiRequest(`/paquetes/${slug}`, {
    fallbackMessage: 'No se pudo obtener el paquete.',
  })

// Crea un paquete nuevo. Requiere token porque es una ruta protegida de admin.
const createPaquete = async (paqueteData, token) =>
  apiRequest('/paquetes', {
    body: paqueteData,
    fallbackMessage: 'No se pudo crear el paquete.',
    method: 'POST',
    token,
  })

// Actualiza los datos principales de un paquete existente.
const updatePaquete = async (id, paqueteData, token) =>
  apiRequest(`/paquetes/${id}`, {
    body: paqueteData,
    fallbackMessage: 'No se pudo actualizar el paquete.',
    method: 'PUT',
    token,
  })

// Desactiva/elimina logicamente un paquete desde el admin.
const deletePaquete = async (id, token) =>
  apiRequest(`/paquetes/${id}`, {
    fallbackMessage: 'No se pudo eliminar el paquete.',
    method: 'DELETE',
    token,
  })

// Consulta las salidas programadas de un paquete.
const getSalidasByPaquete = async (paqueteId) =>
  apiRequest(`/salidas/paquete/${paqueteId}`, {
    fallbackMessage: 'No se pudieron obtener las salidas.',
  })

// Crea una salida con fechas, cupos y precio para un paquete.
const createSalida = async (salidaData, token) =>
  apiRequest('/salidas', {
    body: salidaData,
    fallbackMessage: 'No se pudo crear la salida.',
    method: 'POST',
    token,
  })

// Edita una salida ya existente.
const updateSalida = async (id, salidaData, token) =>
  apiRequest(`/salidas/${id}`, {
    body: salidaData,
    fallbackMessage: 'No se pudo actualizar la salida.',
    method: 'PUT',
    token,
  })

// Elimina o desactiva una salida programada.
const deleteSalida = async (id, token) =>
  apiRequest(`/salidas/${id}`, {
    fallbackMessage: 'No se pudo eliminar la salida.',
    method: 'DELETE',
    token,
  })

// Flujo compuesto usado cuando el formulario crea paquete y salida inicial juntos.
const createPaqueteConSalidas = async (paqueteData, salidas, token) => {
  // Primero se crea el paquete; despues se crean sus salidas con el id recibido.
  const resultadoPaquete = await createPaquete(paqueteData, token)
  const paqueteId = resultadoPaquete.id

  if (!paqueteId) {
    throw new Error('El paquete se creo pero no se recibio su id; no se pudieron crear las salidas.')
  }

  const resultados = await Promise.allSettled(
    salidas.map((salida) =>
      createSalida({ ...salida, paquete_id: paqueteId }, token)
    )
  )

  // Promise.allSettled permite saber cuales salidas fallaron sin perder el paquete creado.
  const salidasFallidas = resultados.filter((result) => result.status === 'rejected')

  return {
    paquete: resultadoPaquete,
    salidasCreadas: resultados.length - salidasFallidas.length,
    salidasFallidas: salidasFallidas.map((result) => result.reason?.message ?? 'Error desconocido'),
  }
}

// API publica de este service para las paginas del panel admin.
export const packageService = {
  createPaquete,
  createPaqueteConSalidas,
  createSalida,
  deletePaquete,
  deleteSalida,
  getPaqueteBySlug,
  getPaquetes,
  getSalidasByPaquete,
  updatePaquete,
  updateSalida,
}
