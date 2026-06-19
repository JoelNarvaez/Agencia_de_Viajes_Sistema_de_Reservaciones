import {
  formatDisplayDate,
  getDateBeforeDays,
  getDaysBetween,
  isPastDate,
} from './formatDate'
import {
  calculateReservationPrice,
  formatGuestBreakdown,
  getCapacityGuests,
  getCompanionGuests,
  getVisibleGuestTotal,
  normalizeGuestCounts,
} from './pricing'

const DEFAULT_CANCELLATION_DAYS = 14

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

export const buildReservationFromSelection = ({ selection, travelPackage, user }) => {
  if (!travelPackage) return null

  const isFixedDate = travelPackage.bookingMode === 'fixed-date'
  const departure =
    travelPackage.departures?.find((item) => item.id === selection.departureId) ??
    (isFixedDate ? travelPackage.departures?.[0] : null)
  const arrivalDate = isFixedDate ? departure?.startDate ?? selection.arrivalDate : selection.arrivalDate
  const departureDate = isFixedDate ? departure?.endDate ?? selection.departureDate : selection.departureDate
  const priceBreakdown = calculateReservationPrice({
    arrivalDate,
    bookingMode: travelPackage.bookingMode,
    departureDate,
    departurePrice: departure?.priceAmount,
    priceAmount: travelPackage.priceAmount,
  })
  const tripDays = getDaysBetween(arrivalDate, departureDate)
  const guests = normalizeGuestCounts(selection.guests)
  const capacityGuests = getCapacityGuests(guests)
  const companionGuests = getCompanionGuests(guests)
  const totalGuests = getVisibleGuestTotal(guests)
  const cancellationDays = travelPackage.cancellationDaysBefore ?? DEFAULT_CANCELLATION_DAYS

  return {
    arrivalDate,
    cancellationDeadline: getDateBeforeDays(arrivalDate, cancellationDays),
    createdAt: new Date().toISOString(),
    departureDate,
    departureId: departure?.id ?? null,
    destination: travelPackage.destination,
    guests,
    guestBreakdown: formatGuestBreakdown(guests),
    capacityGuests,
    companionGuests,
    id: `res-${Date.now()}`,
    image: travelPackage.image,
    packageBackendId: travelPackage.backendId,
    packageId: travelPackage.id,
    packageName: travelPackage.title,
    priceBreakdown,
    status: 'Pendiente',
    totalAmount: priceBreakdown.totalAmount,
    totalGuests,
    travelDate: `${formatDisplayDate(arrivalDate)} - ${formatDisplayDate(departureDate)}`,
    tripDays,
    userEmail: user?.email ?? 'usuario-local',
  }
}

