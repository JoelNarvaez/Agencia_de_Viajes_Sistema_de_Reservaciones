import { API_BASE_URL } from '../config/api'

// Punto unico de comunicacion con el backend.
// Todos los services pasan por aqui para usar fetch, token, JSON y errores de forma consistente.
// path: ruta despues de /api, por ejemplo "/paquetes".
// body: datos que se mandan al backend; si existe, se envia como JSON.
// method: metodo HTTP; por defecto consulta con GET.
// token: se agrega como Bearer token para rutas protegidas.
// fallbackMessage: mensaje usado si el backend no manda uno propio.
export const apiRequest = async (
  path,
  { body, fallbackMessage = 'No se pudo completar la solicitud.', method = 'GET', token } = {},
) => {
  // Solo se agrega Content-Type cuando realmente se manda body.
  // Si hay token, se agrega Authorization para que el backend valide la sesion.
  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // Ejecuta la peticion real con fetch usando la URL base configurada.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Intenta leer JSON; si la respuesta viene vacia, usa un objeto vacio.
  const data = await response.json().catch(() => ({}))

  // Si HTTP no fue exitoso, lanza un Error para que el componente/hook lo capture.
  if (!response.ok) {
    throw new Error(data.message ?? data.error ?? fallbackMessage)
  }

  // Si todo salio bien, regresa directamente los datos del backend.
  return data
}
