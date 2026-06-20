import { apiRequest } from './apiClient'

// Adapta posibles nombres de respuesta del backend a un formato unico para AuthContext.
const normalizeAuthResponse = (data) => {
  const token = data.token ?? data.accessToken ?? data.jwt ?? data.data?.token
  const user = data.user ?? data.usuario ?? data.data?.user ?? data.data?.usuario

  return {
    token,
    user,
  }
}

export const loginRequest = async (credentials) => {
  // Login: backend valida credenciales y regresa token + usuario.
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
    fallbackMessage: 'No se pudo iniciar sesion. Revisa tus datos e intenta de nuevo.',
  })

  return normalizeAuthResponse(data)
}

export const registerRequest = async (userData) => {
  // Registro: crea usuario y deja la sesion iniciada con el token recibido.
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
    fallbackMessage: 'No se pudo crear la cuenta. Revisa tus datos e intenta de nuevo.',
  })

  return normalizeAuthResponse(data)
}

export const authService = {
  login: loginRequest,
  register: registerRequest,
}
