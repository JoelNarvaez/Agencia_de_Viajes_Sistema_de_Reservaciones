import {
  RESERVATION_DRAFT_STORAGE_KEY,
} from './constants'
import {
  formatDisplayDate,
  getDateBeforeDays,
  getDaysBetween,
  isPastDate,
} from './formatDate'

const DEFAULT_CANCELLATION_DAYS = 14

const parseStorageItem = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

const saveStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const saveReservationDraft = (draft) => {
  saveStorageItem(RESERVATION_DRAFT_STORAGE_KEY, draft)
}

export const getReservationDraft = () =>
  parseStorageItem(RESERVATION_DRAFT_STORAGE_KEY, null)

export const clearReservationDraft = () => {
  localStorage.removeItem(RESERVATION_DRAFT_STORAGE_KEY)
}

export const canCancelReservation = (reservation) => {
  if (!reservation || reservation.status === 'Cancelada') return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deadline = new Date(`${reservation.cancellationDeadline}T00:00:00`)
  return today <= deadline
}

export const isReservationPast = (reservation) => {
  return isPastDate(reservation?.departureDate)
}

export const buildReservationFromDraft = (draft, user) => {
  const travelPackage = draft.packageSnapshot
  if (!travelPackage) return null

  const isFixedDate = travelPackage.bookingMode === 'fixed-date'
  const departure = travelPackage.departures?.find((item) => item.id === draft.departureId)
  const arrivalDate = isFixedDate ? departure?.startDate ?? draft.arrivalDate : draft.arrivalDate
  const departureDate = isFixedDate ? departure?.endDate ?? draft.departureDate : draft.departureDate
  const tripDays = getDaysBetween(arrivalDate, departureDate)
  const totalAmount = isFixedDate ? travelPackage.priceAmount : travelPackage.priceAmount * tripDays
  const guests = draft.guests ?? { adults: 1, babies: 0, children: 0, pets: 0 }
  const totalGuests = guests.adults + guests.children + guests.babies
  const cancellationDays = travelPackage.cancellationDaysBefore ?? DEFAULT_CANCELLATION_DAYS

  return {
    arrivalDate,
    cancellationDeadline: getDateBeforeDays(arrivalDate, cancellationDays),
    createdAt: new Date().toISOString(),
    departureDate,
    departureId: departure?.id ?? null,
    destination: travelPackage.destination,
    guests,
    id: `res-${Date.now()}`,
    image: travelPackage.image,
    packageId: travelPackage.id,
    packageName: travelPackage.title,
    status: 'Pendiente',
    totalAmount,
    totalGuests,
    travelDate: `${formatDisplayDate(arrivalDate)} - ${formatDisplayDate(departureDate)}`,
    tripDays,
    userEmail: user?.email ?? 'usuario-local',
  }
}

