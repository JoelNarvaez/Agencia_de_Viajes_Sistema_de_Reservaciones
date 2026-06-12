import { API_BASE_URL } from '../config/api'

const normalizeAuthResponse = (data) => {
  const token = data.token ?? data.accessToken ?? data.jwt ?? data.data?.token
  const user = data.user ?? data.usuario ?? data.data?.user ?? data.data?.usuario

  return {
    token,
    user,
  }
}

export const loginRequest = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.message ??
        data.error ??
        'No se pudo iniciar sesion. Revisa tus datos e intenta de nuevo.',
    )
  }

  return normalizeAuthResponse(data)
}

export const registerRequest = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.message ??
        data.error ??
        'No se pudo crear la cuenta. Revisa tus datos e intenta de nuevo.',
    )
  }

  return normalizeAuthResponse(data)
}

export const authService = {
  login: loginRequest,
  register: registerRequest,
}
