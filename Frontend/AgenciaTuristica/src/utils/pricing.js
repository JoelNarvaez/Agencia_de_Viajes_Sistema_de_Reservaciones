import { getDaysBetween } from './formatDate'

export const TAX_RATE = 0.16

const toPositiveNumber = (value, fallback = 0) => {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

export const normalizeGuestCounts = (guests = {}) => ({
  adults: Math.max(1, Number(guests.adults ?? guests.adultos ?? 1) || 1),
  babies: Math.max(0, Number(guests.babies ?? guests.bebes ?? 0) || 0),
  children: Math.max(0, Number(guests.children ?? guests.ninos ?? 0) || 0),
  pets: Math.max(0, Number(guests.pets ?? guests.mascotas ?? 0) || 0),
})

export const getCapacityGuests = (guests = {}) => {
  const guestCounts = normalizeGuestCounts(guests)
  return guestCounts.adults + guestCounts.children
}

export const getCompanionGuests = (guests = {}) => {
  const guestCounts = normalizeGuestCounts(guests)
  return guestCounts.babies
}

export const getVisibleGuestTotal = (guests = {}) =>
  getCapacityGuests(guests) + getCompanionGuests(guests)

export const formatGuestBreakdown = (guests = {}) => {
  const guestCounts = normalizeGuestCounts(guests)
  const parts = []

  if (guestCounts.adults) {
    parts.push(`${guestCounts.adults} ${guestCounts.adults === 1 ? 'adulto' : 'adultos'}`)
  }

  if (guestCounts.children) {
    parts.push(`${guestCounts.children} ${guestCounts.children === 1 ? 'nino' : 'ninos'}`)
  }

  if (guestCounts.babies) {
    parts.push(`${guestCounts.babies} ${guestCounts.babies === 1 ? 'bebe' : 'bebes'}`)
  }

  return parts.join(', ')
}

export const calculateReservationPrice = ({
  arrivalDate,
  bookingMode,
  departureDate,
  departurePrice,
  priceAmount,
}) => {
  const isFixedDate = bookingMode === 'fixed-date'
  const unitPrice = toPositiveNumber(departurePrice, toPositiveNumber(priceAmount))
  const units = isFixedDate ? 1 : Math.max(1, getDaysBetween(arrivalDate, departureDate))
  const totalAmount = Math.round(unitPrice * units)
  const subtotal = Math.round(totalAmount / (1 + TAX_RATE))
  const taxes = totalAmount - subtotal

  return {
    includesTaxes: true,
    subtotal,
    taxes,
    totalAmount,
    unitPrice,
    units,
    unitType: isFixedDate ? 'salida' : units === 1 ? 'noche' : 'noches',
  }
}
