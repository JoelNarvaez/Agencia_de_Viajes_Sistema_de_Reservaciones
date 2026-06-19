import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import PackageLocationMap from '../../components/packages/PackageLocationMap'
import useAuth from '../../hooks/useAuth'
import usePublicPackages from '../../hooks/usePublicPackages'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDisplayDate, getDaysBetween } from '../../utils/formatDate'
import {
  calculateReservationPrice,
  formatGuestBreakdown,
  getCapacityGuests,
  getVisibleGuestTotal,
} from '../../utils/pricing'
import NotFound from './NotFound'
import styles from './PackageDetail.module.css'

const getMaxGuests = (groupSize) => {
  if (!groupSize) return 2

  const numbers = groupSize.match(/\d+/g)?.map(Number) ?? [2]
  return Math.max(...numbers)
}

const getAccommodationType = (travelPackage) => {
  const includes = [
    ...(travelPackage.includeTags ?? []),
    ...(travelPackage.includes ?? []),
  ].join(' ').toLowerCase()
  const title = travelPackage.title.toLowerCase()

  if (includes.includes('hospedaje') || title.includes('relax')) return 'Alojamiento incluido'
  if (title.includes('bosque')) return 'Cabana y experiencia guiada'
  if (title.includes('colonial')) return 'Hotel boutique y recorrido cultural'

  return 'Paquete turistico completo'
}

const getAmenityIconType = (amenity) => {
  const normalizedAmenity = amenity.toLowerCase()

  if (normalizedAmenity.includes('hotel') || normalizedAmenity.includes('hospedaje')) return 'stay'
  if (normalizedAmenity.includes('transporte') || normalizedAmenity.includes('traslado')) return 'transport'
  if (normalizedAmenity.includes('tour') || normalizedAmenity.includes('guia')) return 'guide'
  if (normalizedAmenity.includes('comida') || normalizedAmenity.includes('desayuno') || normalizedAmenity.includes('cena')) return 'food'
  if (normalizedAmenity.includes('cabana')) return 'cabin'
  if (normalizedAmenity.includes('senderismo') || normalizedAmenity.includes('experiencia')) return 'activity'
  if (normalizedAmenity.includes('soporte')) return 'support'
  if (normalizedAmenity.includes('confirmacion')) return 'confirm'
  if (normalizedAmenity.includes('flexible') || normalizedAmenity.includes('salida')) return 'calendar'

  return 'check'
}

const amenityIcons = {
  activity: (
    <>
      <path d="M7 17 12 4l5 13" />
      <path d="m9 13 3-3 3 3" />
      <path d="M4 20h16" />
    </>
  ),
  cabin: (
    <>
      <path d="m4 11 8-7 8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  calendar: (
    <>
      <path d="M7 3v4" />
      <path d="M17 3v4" />
      <path d="M4 8h16" />
      <rect height="15" rx="2" width="16" x="4" y="5" />
      <path d="m9 14 2 2 4-5" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  confirm: (
    <>
      <path d="M5 12.5 9.5 17 19 7" />
      <path d="M5 5h14v14H5z" />
    </>
  ),
  food: (
    <>
      <path d="M7 3v8" />
      <path d="M4 3v5a3 3 0 0 0 6 0V3" />
      <path d="M17 3v18" />
      <path d="M14 3h3a3 3 0 0 1 3 3v5h-6V3Z" />
    </>
  ),
  guide: (
    <>
      <circle cx="8" cy="8" r="3" />
      <path d="M3 21v-2a5 5 0 0 1 10 0v2" />
      <path d="M15 6h6" />
      <path d="M15 11h6" />
      <path d="M15 16h4" />
    </>
  ),
  stay: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  support: (
    <>
      <path d="M5 12a7 7 0 0 1 14 0v4" />
      <path d="M5 12v3a2 2 0 0 0 2 2h1v-6H7a2 2 0 0 0-2 2Z" />
      <path d="M19 12v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
      <path d="M12 19h3" />
    </>
  ),
  transport: (
    <>
      <path d="M5 16V7a2 2 0 0 1 2-2h7l5 5v6" />
      <path d="M14 5v5h5" />
      <circle cx="8" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M10 17h5" />
    </>
  ),
}

const AmenityIcon = ({ type }) => (
  <span className={styles.amenityIcon} aria-hidden="true">
    <svg
      className={styles.amenitySvg}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      {amenityIcons[type] ?? amenityIcons.check}
    </svg>
  </span>
)

const getOfferItems = (travelPackage) => {
  const items = [
    ...(travelPackage.includeItems ?? []).map((item) => ({
      iconType: item.iconType ?? 'check',
      name: item.name,
    })),
    ...travelPackage.highlights.map((item) => ({
      iconType: getAmenityIconType(item),
      name: item,
    })),
    { iconType: 'support', name: 'Soporte de NovaTrips' },
    { iconType: 'confirm', name: 'Confirmacion de reserva' },
    {
      iconType: 'calendar',
      name: travelPackage.bookingMode === 'nightly' ? 'Fechas flexibles' : 'Salida programada',
    },
    {
      iconType: travelPackage.bookingMode === 'nightly' ? 'stay' : 'guide',
      name: travelPackage.bookingMode === 'nightly' ? 'Hospedaje por noche' : 'Ruta coordinada',
    },
  ]

  if (travelPackage.includeTags.includes('Transporte')) items.push({ iconType: 'transport', name: 'Traslados coordinados' })
  if (travelPackage.includeTags.includes('Hospedaje')) items.push({ iconType: 'stay', name: 'Hospedaje verificado' })
  if (travelPackage.includeTags.includes('Comidas')) items.push({ iconType: 'food', name: 'Opciones de alimentos' })
  if (travelPackage.includeTags.includes('Actividades')) items.push({ iconType: 'activity', name: 'Actividades guiadas' })
  if (travelPackage.experienceType === 'Naturaleza' || travelPackage.experienceType === 'Aventura') {
    items.push({ iconType: 'activity', name: 'Recomendaciones para actividades al aire libre' })
  }

  return items.filter(
    (item, index, currentItems) =>
      item.name && currentItems.findIndex((currentItem) => currentItem.name === item.name) === index,
  )
}

const formatDateInput = (date) => date.toISOString().slice(0, 10)

const getDateAfterDays = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return formatDateInput(date)
}

function PackageDetail() {
  const { packageId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { isLoading, packages } = usePublicPackages()
  const travelPackage = packages.find((item) => item.id === packageId)
  const [arrivalDate, setArrivalDate] = useState(() => getDateAfterDays(7))
  const [departureDate, setDepartureDate] = useState(() => getDateAfterDays(10))
  const [selectedDepartureId, setSelectedDepartureId] = useState('')
  const [showGuestSelector, setShowGuestSelector] = useState(false)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [shareStatus, setShareStatus] = useState('')
  const [guestCounts, setGuestCounts] = useState({
    adults: 1,
    babies: 0,
    children: 0,
    pets: 0,
  })

  if (!travelPackage && isLoading) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <p>Cargando paquete...</p>
        </section>
      </main>
    )
  }

  if (!travelPackage) {
    return <NotFound />
  }

  const isFixedDate = travelPackage.bookingMode === 'fixed-date'
  const isAdmin = user?.rol === 'admin'
  const departures = travelPackage.departures ?? []
  const selectedDeparture =
    departures.find((departure) => departure.id === selectedDepartureId) ?? departures[0]
  const packageMaxGuests = travelPackage.maxGuests ?? getMaxGuests(travelPackage.groupSize)
  const availableSpots = selectedDeparture?.availableSpots
  const maxGuests = isFixedDate && Number.isFinite(availableSpots)
    ? Math.min(packageMaxGuests, availableSpots)
    : packageMaxGuests
  const capacityGuests = getCapacityGuests(guestCounts)
  const totalGuests = getVisibleGuestTotal(guestCounts)
  const tripDays = isFixedDate
    ? selectedDeparture
      ? getDaysBetween(selectedDeparture.startDate, selectedDeparture.endDate)
      : travelPackage.days
    : getDaysBetween(arrivalDate, departureDate)
  const priceBreakdown = calculateReservationPrice({
    arrivalDate,
    bookingMode: travelPackage.bookingMode,
    departureDate,
    departurePrice: selectedDeparture?.priceAmount,
    priceAmount: travelPackage.priceAmount,
  })
  const totalPrice = priceBreakdown.totalAmount
  const originalPrice = Math.round(totalPrice * 1.12)
  const accommodationType = getAccommodationType(travelPackage)
  const guestSummary = `${totalGuests} ${totalGuests === 1 ? 'participante' : 'participantes'}`
  const guestBreakdown = formatGuestBreakdown(guestCounts)
  const priceLabel = travelPackage.priceUnit ?? (isFixedDate ? 'por salida' : 'por noche')
  const detailSummary = isFixedDate
    ? `Hasta ${packageMaxGuests} huespedes por reserva - ${travelPackage.duration} - ${travelPackage.experienceType}`
    : `Hasta ${packageMaxGuests} huespedes - fechas flexibles - ${travelPackage.experienceType}`
  const durationMetric = isFixedDate
    ? { label: 'Dias de viaje', value: travelPackage.days }
    : { label: 'Noches seleccionadas', value: tripDays }
  const cancellationDays = travelPackage.cancellationDaysBefore ?? 14
  const cancellationText = cancellationDays > 0
    ? `Cancelacion gratuita hasta ${cancellationDays} dias antes del inicio del viaje.`
    : 'Este paquete no permite cancelacion gratuita.'
  const offerItems = getOfferItems(travelPackage)
  const visibleOfferItems = showAllAmenities ? offerItems : offerItems.slice(0, 6)
  const accommodation = travelPackage.accommodation
  const mapCoordinates = accommodation?.coordinates ?? travelPackage.coordinates

  const updateGuestCount = (type, delta) => {
    setGuestCounts((currentCounts) => {
      const nextValue = Math.max(0, currentCounts[type] + delta)
      const nextCounts = {
        ...currentCounts,
        [type]: nextValue,
      }

      if (type === 'adults') nextCounts.adults = Math.max(1, nextCounts.adults)
      if (nextCounts.adults + nextCounts.children > maxGuests) return currentCounts
      if (type === 'pets' && nextCounts.pets > 0) return currentCounts

      return nextCounts
    })
  }

  const handleShare = async () => {
    const shareData = {
      text: travelPackage.description,
      title: travelPackage.title,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareStatus('Compartido')
      } else {
        await navigator.clipboard.writeText(shareData.url)
        setShareStatus('Enlace copiado')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setShareStatus('No se pudo compartir')
      }
    }

    window.setTimeout(() => setShareStatus(''), 2200)
  }

  const handleReserve = () => {
    if (isAdmin) return

    const checkoutParams = new URLSearchParams({
      adults: String(guestCounts.adults),
      babies: String(guestCounts.babies),
      children: String(guestCounts.children),
      departureDate,
      packageId: travelPackage.id,
      pets: String(guestCounts.pets),
      arrivalDate,
    })

    if (selectedDeparture?.id) {
      checkoutParams.set('departureId', selectedDeparture.id)
    }

    const checkoutPath = `/reservations/checkout?${checkoutParams.toString()}`

    if (!isAuthenticated) {
      navigate('/login', { state: { from: checkoutPath } })
      return
    }

    navigate(checkoutPath)
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell} aria-labelledby="package-title">
        <div className={styles.topBar}>
          <Link className={styles.backLink} to="/packages">
            Volver a paquetes
          </Link>

          <div className={styles.actions}>
            <button type="button" onClick={handleShare}>
              Compartir
            </button>
            {shareStatus && <span className={styles.shareStatus}>{shareStatus}</span>}
          </div>
        </div>

        <header className={styles.header}>
          <p>{travelPackage.destination}</p>
          <h1 id="package-title">{travelPackage.title}</h1>
        </header>

        <section className={styles.singleImage} aria-label="Imagen del paquete">
          <img src={travelPackage.heroImage ?? travelPackage.image} alt={travelPackage.title} />
        </section>

        <div className={styles.layout}>
          <article className={styles.content}>
            <section className={styles.intro}>
              <h2>
                {accommodationType} en {travelPackage.destination}
              </h2>
              <p>{detailSummary}</p>
            </section>

            <section className={styles.scoreCard} aria-label="Resumen de calificaciones">
              <div>
                <strong>4.8</strong>
                <span>Calificacion promedio</span>
              </div>
              <div>
                <strong>{maxGuests}</strong>
                <span>{isFixedDate ? 'Disponibles para reservar' : 'Capacidad maxima'}</span>
              </div>
              <div>
                <strong>{durationMetric.value}</strong>
                <span>{durationMetric.label}</span>
              </div>
            </section>

            <section className={styles.hostBlock}>
              <div className={styles.avatar} aria-hidden="true">
                NT
              </div>
              <div>
                <h3>Organizado por NovaTrips</h3>
                <p>Equipo local - Hospedaje y actividades coordinadas</p>
              </div>
            </section>

            <section className={styles.featureList}>
              {travelPackage.highlights.slice(0, 3).map((item) => (
                <div key={item}>
                  <span aria-hidden="true">+</span>
                  <div>
                    <h3>{item}</h3>
                    <p>Parte destacada de esta experiencia para viajar con mas claridad.</p>
                  </div>
                </div>
              ))}
            </section>

            <section className={styles.description}>
              <h2>Acerca de este paquete</h2>
              <p>{travelPackage.longDescription}</p>
              <p>{travelPackage.description}</p>
            </section>

            <section className={styles.amenities}>
              <h2>Lo que ofrece este paquete</h2>
              <div>
                {visibleOfferItems.map((item) => (
                  <span key={item.name}>
                    <AmenityIcon type={item.iconType} />
                    {item.name}
                  </span>
                ))}
              </div>
              {offerItems.length > 6 && (
                <button
                  className={styles.amenitiesToggle}
                  type="button"
                  onClick={() => setShowAllAmenities((currentValue) => !currentValue)}
                >
                  <span>{showAllAmenities ? 'Mostrar menos' : `Mostrar ${offerItems.length - 6} mas`}</span>
                  <span aria-hidden="true">{showAllAmenities ? '-' : '+'}</span>
                </button>
              )}
            </section>

            <section className={styles.itinerary}>
              <h2>{isFixedDate ? 'Itinerario' : 'Sugerencias para tu estancia'}</h2>
              <div className={styles.timeline}>
                {travelPackage.itinerary.map((item, index) => (
                  <article key={item}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.location}>
              <h2>Ubicacion del hospedaje</h2>
              <p>
                {accommodation?.name ?? travelPackage.destination}
                {accommodation?.address ? ` - ${accommodation.address}` : ''}
              </p>
              <div className={styles.mapPreview}>
                <PackageLocationMap
                  coordinates={mapCoordinates}
                  destination={accommodation?.address ?? travelPackage.destination}
                  title={accommodation?.name ?? travelPackage.title}
                />
              </div>
            </section>
          </article>

          <aside className={styles.bookingCard} aria-label="Reservar paquete">
            <p className={styles.price}>
              <span className={styles.originalPrice}>
                {formatCurrency(originalPrice)}
              </span>
              <strong>{formatCurrency(totalPrice)} en total</strong>
              <em>{formatCurrency(priceBreakdown.unitPrice)} {priceLabel}</em>
            </p>
            <div className={styles.priceBreakdown}>
              <div>
                <span>{isFixedDate ? 'Tarifa de la salida' : `${priceBreakdown.units} ${priceBreakdown.unitType}`}</span>
                <strong>{formatCurrency(priceBreakdown.subtotal)}</strong>
              </div>
              <div>
                <span>Impuestos incluidos</span>
                <strong>{formatCurrency(priceBreakdown.taxes)}</strong>
              </div>
              <p>
                El precio cubre hasta {packageMaxGuests} huespedes por reserva. Bebes no ocupan cupo ni cambian el precio.
              </p>
            </div>

            <div className={styles.bookingFields}>
              {isFixedDate ? (
                <label className={styles.fullFieldNoBorder}>
                  Salida disponible
                  <select
                    value={selectedDeparture?.id ?? ''}
                    onChange={(event) => setSelectedDepartureId(event.target.value)}
                  >
                    {departures.map((departure) => (
                      <option key={departure.id} value={departure.id}>
                        {formatDisplayDate(departure.startDate)} -{' '}
                        {formatDisplayDate(departure.endDate)} - {departure.availableSpots} cupos
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <>
                  <label>
                    Llegada
                    <input
                      type="date"
                      value={arrivalDate}
                      onChange={(event) => setArrivalDate(event.target.value)}
                    />
                  </label>
                  <label>
                    Salida
                    <input
                      min={arrivalDate}
                      type="date"
                      value={departureDate}
                      onChange={(event) => setDepartureDate(event.target.value)}
                    />
                  </label>
                </>
              )}
              <div className={styles.fullField}>
                <button
                  className={styles.guestToggle}
                  type="button"
                  onClick={() => setShowGuestSelector((currentValue) => !currentValue)}
                >
                  <span>
                    Huespedes
                    <strong>{guestSummary}</strong>
                    <small>{guestBreakdown}</small>
                  </span>
                  <span aria-hidden="true">{showGuestSelector ? '^' : 'v'}</span>
                </button>
              </div>
            </div>

            {showGuestSelector && (
              <div className={styles.guestPanel}>
                {[
                  ['adults', 'Adultos', 'Mas de 13 anos'],
                  ['children', 'Ninos', 'De 2 a 12'],
                  ['babies', 'Bebes', 'Menos de 2'],
                  ['pets', 'Mascotas', 'No se admiten mascotas'],
                ].map(([type, label, description]) => (
                  <div className={styles.guestRow} key={type}>
                    <div>
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </div>
                    <div className={styles.stepper}>
                      <button
                        disabled={type === 'adults' ? guestCounts[type] <= 1 : guestCounts[type] <= 0}
                        type="button"
                        onClick={() => updateGuestCount(type, -1)}
                      >
                        -
                      </button>
                      <span>{guestCounts[type]}</span>
                      <button
                        disabled={
                          type === 'pets' ||
                          (['adults', 'children'].includes(type) && capacityGuests >= maxGuests)
                        }
                        type="button"
                        onClick={() => updateGuestCount(type, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <p className={styles.guestNote}>
                  {isFixedDate
                    ? `Esta salida tiene ${availableSpots ?? 0} cupos disponibles y este paquete permite ${packageMaxGuests} huespedes por reserva. Adultos y ninos ocupan cupo; bebes no. No se admiten mascotas.`
                    : `Este alojamiento permite ${packageMaxGuests} huespedes con cupo. Adultos y ninos cuentan; bebes no. No se admiten mascotas.`}
                </p>

                <button
                  className={styles.closeGuestPanel}
                  type="button"
                  onClick={() => setShowGuestSelector(false)}
                >
                  Cerrar
                </button>
              </div>
            )}

            <p className={styles.cancellation}>
              {cancellationText}
            </p>

            <button
              className={styles.reserveButton}
              disabled={isAdmin || maxGuests < 1}
              type="button"
              onClick={handleReserve}
            >
              {isAdmin ? 'Solo usuarios pueden reservar' : maxGuests < 1 ? 'Sin cupos disponibles' : 'Reservar'}
            </button>
            <small>
              {isAdmin
                ? 'Como administrador solo puedes consultar el detalle del paquete.'
                : 'Aun no se te cobrara nada.'}
            </small>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default PackageDetail
