import { API_BASE_URL } from '../config/api'

const request = async (path, { body, method = 'GET', token } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message ?? 'No se pudo completar la solicitud de usuario.')
  }

  return data
}

export const normalizeUser = (user) => ({
  apellido: user.apellido ?? '',
  email: user.email ?? '',
  id: user.id,
  nombre: user.nombre ?? '',
  rol: user.rol ?? 'usuario',
  status: user.status ?? 'activo',
  telefono: user.telefono ?? '',
})

export const getProfile = async (token) => {
  const response = await request('/usuarios/perfil', { token })
  return normalizeUser(response.usuario)
}

export const updateProfile = async ({ profile, token }) => {
  const response = await request('/usuarios/perfil', {
    body: profile,
    method: 'PUT',
    token,
  })
  return normalizeUser(response.usuario)
}

export const userService = {
  getProfile,
  updateProfile,
}
