// Normaliza una fecha a formato YYYY-MM-DD para inputs date y comparaciones.
export const toDateInput = (date) => {
  if (!date) return ''

  return String(date).slice(0, 10)
}

// Muestra una fecha en formato corto para Mexico, por ejemplo "26 jun 2026".
export const formatDisplayDate = (date) =>
  new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${toDateInput(date)}T00:00:00`))

// Calcula dias/noches entre dos fechas. Nunca regresa menos de 1.
export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(`${toDateInput(startDate)}T00:00:00`)
  const end = new Date(`${toDateInput(endDate)}T00:00:00`)
  const difference = end.getTime() - start.getTime()

  return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)))
}

// Resta dias a una fecha; se usa para calcular limite de cancelacion.
export const getDateBeforeDays = (date, days) => {
  const deadline = new Date(`${toDateInput(date)}T00:00:00`)
  deadline.setDate(deadline.getDate() - days)
  return deadline.toISOString().slice(0, 10)
}

// Indica si una fecha ya paso respecto al dia actual.
export const isPastDate = (date) => {
  if (!date) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const targetDate = new Date(`${toDateInput(date)}T00:00:00`)
  return targetDate < today
}
