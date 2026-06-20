import { apiRequest } from './apiClient'

// Mantiene el perfil con las propiedades que consume la UI.
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
  // Consulta los datos del usuario autenticado.
  const response = await apiRequest('/usuarios/perfil', {
    fallbackMessage: 'No se pudo completar la solicitud de usuario.',
    token,
  })
  return normalizeUser(response.usuario)
}

export const updateProfile = async ({ profile, token }) => {
  // Guarda cambios permitidos del perfil y normaliza la respuesta actualizada.
  const response = await apiRequest('/usuarios/perfil', {
    body: profile,
    fallbackMessage: 'No se pudo completar la solicitud de usuario.',
    method: 'PUT',
    token,
  })
  return normalizeUser(response.usuario)
}

export const userService = {
  getProfile,
  updateProfile,
}
