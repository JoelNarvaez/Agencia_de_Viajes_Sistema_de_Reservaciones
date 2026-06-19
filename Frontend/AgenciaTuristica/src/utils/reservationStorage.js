import {
  RESERVATION_DRAFT_STORAGE_KEY,
  RESERVATIONS_STORAGE_KEY,
} from './constants'
import { getPackageById } from '../data/packageData'

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

export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const difference = end.getTime() - start.getTime()

  return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)))
}

export const formatDisplayDate = (date) =>
  new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))

const getDateBeforeDays = (date, days) => {
  const deadline = new Date(`${date}T00:00:00`)
  deadline.setDate(deadline.getDate() - days)
  return deadline.toISOString().slice(0, 10)
}

export const saveReservationDraft = (draft) => {
  saveStorageItem(RESERVATION_DRAFT_STORAGE_KEY, draft)
}

export const getReservationDraft = () =>
  parseStorageItem(RESERVATION_DRAFT_STORAGE_KEY, null)

export const clearReservationDraft = () => {
  localStorage.removeItem(RESERVATION_DRAFT_STORAGE_KEY)
}

export const getReservations = () =>
  parseStorageItem(RESERVATIONS_STORAGE_KEY, [])

export const getUserReservations = (userEmail) =>
  getReservations().filter((reservation) => reservation.userEmail === userEmail)

export const getReservationById = (reservationId) =>
  getReservations().find((reservation) => reservation.id === reservationId) ?? null

export const updateReservation = (reservationId, updater) => {
  const reservations = getReservations()
  const nextReservations = reservations.map((reservation) =>
    reservation.id === reservationId ? updater(reservation) : reservation,
  )
  saveStorageItem(RESERVATIONS_STORAGE_KEY, nextReservations)
  return nextReservations.find((reservation) => reservation.id === reservationId) ?? null
}

export const canCancelReservation = (reservation) => {
  if (!reservation || reservation.status === 'Cancelada') return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deadline = new Date(`${reservation.cancellationDeadline}T00:00:00`)
  return today <= deadline
}

export const isReservationPast = (reservation) => {
  if (!reservation?.departureDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const departureDate = new Date(`${reservation.departureDate}T00:00:00`)
  return departureDate < today
}

export const buildReservationFromDraft = (draft, user) => {
  const travelPackage = getPackageById(draft.packageId)
  if (!travelPackage) return null

  const isFixedDate = travelPackage.bookingMode === 'fixed-date'
  const departure = travelPackage.departures?.find((item) => item.id === draft.departureId)
  const arrivalDate = isFixedDate ? departure?.startDate : draft.arrivalDate
  const departureDate = isFixedDate ? departure?.endDate : draft.departureDate
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

export const saveReservation = (reservation) => {
  const reservations = getReservations()
  saveStorageItem(RESERVATIONS_STORAGE_KEY, [reservation, ...reservations])
}
