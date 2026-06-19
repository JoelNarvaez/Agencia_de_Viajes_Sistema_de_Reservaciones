export const toDateInput = (date) => {
  if (!date) return ''

  return String(date).slice(0, 10)
}

export const formatDisplayDate = (date) =>
  new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${toDateInput(date)}T00:00:00`))

export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(`${toDateInput(startDate)}T00:00:00`)
  const end = new Date(`${toDateInput(endDate)}T00:00:00`)
  const difference = end.getTime() - start.getTime()

  return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)))
}

export const getDateBeforeDays = (date, days) => {
  const deadline = new Date(`${toDateInput(date)}T00:00:00`)
  deadline.setDate(deadline.getDate() - days)
  return deadline.toISOString().slice(0, 10)
}

export const isPastDate = (date) => {
  if (!date) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const targetDate = new Date(`${toDateInput(date)}T00:00:00`)
  return targetDate < today
}
