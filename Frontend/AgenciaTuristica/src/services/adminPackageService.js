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

// ── Paquetes ─────────────────────────────────────────────────────────────
// Nota: obtenerPaquetes/obtenerPaquetePorSlug regresan el objeto/array
// directo (res.status(200).json(paquetes)), sin envolver en { data: ... }.
// crearPaquete regresa { message, id, slug } — el slug ya viene calculado
// por el backend, el frontend nunca lo manda.

const getPaquetes = async () => {
  const response = await fetch(`${API_BASE_URL}/paquetes`)
  return parseResponse(response, 'No se pudieron obtener los paquetes.')
}

const getPaqueteBySlug = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/paquetes/${slug}`)
  return parseResponse(response, 'No se pudo obtener el paquete.')
}

const createPaquete = async (paqueteData, token) => {
  const response = await fetch(`${API_BASE_URL}/paquetes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(paqueteData),
  })
  // { message, id, slug }
  return parseResponse(response, 'No se pudo crear el paquete.')
}

const updatePaquete = async (id, paqueteData, token) => {
  const response = await fetch(`${API_BASE_URL}/paquetes/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(paqueteData),
  })
  return parseResponse(response, 'No se pudo actualizar el paquete.')
}

const deletePaquete = async (id, token) => {
  // El backend hace eliminación lógica (activo = 0), no borra el registro.
  const response = await fetch(`${API_BASE_URL}/paquetes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return parseResponse(response, 'No se pudo eliminar el paquete.')
}

// ── Salidas ──────────────────────────────────────────────────────────────

const getSalidasByPaquete = async (paqueteId) => {
  const response = await fetch(`${API_BASE_URL}/salidas/paquete/${paqueteId}`)
  return parseResponse(response, 'No se pudieron obtener las salidas.')
}

const createSalida = async (salidaData, token) => {
  const response = await fetch(`${API_BASE_URL}/salidas`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(salidaData),
  })
  return parseResponse(response, 'No se pudo crear la salida.')
}

const updateSalida = async (id, salidaData, token) => {
  const response = await fetch(`${API_BASE_URL}/salidas/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(salidaData),
  })
  return parseResponse(response, 'No se pudo actualizar la salida.')
}

const deleteSalida = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/salidas/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return parseResponse(response, 'No se pudo eliminar la salida.')
}

// ── Operación combinada: crear paquete + sus salidas ───────────────────────
//
// El backend no tiene un endpoint único para esto (son dos rutas
// independientes: /api/paquetes y /api/salidas). El frontend hace dos
// llamadas en secuencia: primero crea el paquete, toma el id que regresa
// (crearPaquete responde { message, id, slug }), y con ese id crea cada
// salida una por una.
//
// Si alguna salida falla, el paquete ya quedó creado igual (no hay rollback
// entre estos dos recursos). Por eso devolvemos el detalle de qué salidas
// sí y cuáles no se pudieron crear.
const createPaqueteConSalidas = async (paqueteData, salidas, token) => {
  const resultadoPaquete = await createPaquete(paqueteData, token)
  const paqueteId = resultadoPaquete.id

  if (!paqueteId) {
    throw new Error('El paquete se creó pero no se recibió su id; no se pudieron crear las salidas.')
  }

  const resultados = await Promise.allSettled(
    salidas.map((salida) =>
      createSalida({ ...salida, paquete_id: paqueteId }, token)
    )
  )

  const salidasFallidas = resultados.filter((r) => r.status === 'rejected')

  return {
    paquete: resultadoPaquete,
    salidasCreadas: resultados.length - salidasFallidas.length,
    salidasFallidas: salidasFallidas.map((r) => r.reason?.message ?? 'Error desconocido'),
  }
}

export const packageService = {
  getPaquetes,
  getPaqueteBySlug,
  createPaquete,
  updatePaquete,
  deletePaquete,
  getSalidasByPaquete,
  createSalida,
  updateSalida,
  deleteSalida,
  createPaqueteConSalidas,
}