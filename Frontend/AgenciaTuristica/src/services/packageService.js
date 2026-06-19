import { apiRequest } from './apiClient'
import { formatCurrency } from '../utils/formatCurrency'

const toNumber = (value, fallback) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

const toDateInput = (value) => {
  if (!value) return ''

  return String(value).slice(0, 10)
}

const normalizeDepartures = (apiPackage, localPackage) => {
  // Salidas programadas: convierten cupos, fechas y precio al formato del frontend.
  const apiDepartures = apiPackage.salidas ?? apiPackage.departures
  if (!Array.isArray(apiDepartures) || apiDepartures.length === 0) {
    return localPackage.departures ?? []
  }

  return apiDepartures.map((departure) => ({
    availableSpots: toNumber(departure.cupos_disponibles ?? departure.availableSpots, 0),
    endDate: toDateInput(departure.fecha_fin ?? departure.endDate),
    id: String(departure.id),
    priceAmount: toNumber(departure.precio, null),
    startDate: toDateInput(departure.fecha_inicio ?? departure.startDate),
    totalSpots: toNumber(departure.cupos_totales, undefined),
  }))
}

const normalizeGalleryImages = (apiPackage, localPackage) => {
  // La API puede mandar imagenes como objetos o strings; la UI solo necesita URLs.
  const apiImages = apiPackage.imagenes ?? apiPackage.images

  if (!Array.isArray(apiImages) || apiImages.length === 0) {
    return localPackage.galleryImages ?? [
      localPackage.heroImage,
      localPackage.image,
    ].filter(Boolean)
  }

  return apiImages
    .map((image) => image.url ?? image.url_imagen ?? image)
    .filter(Boolean)
}

const includeTypeLabels = {
  activity: 'Actividades',
  check: 'Servicios',
  food: 'Comidas',
  guide: 'Guia local',
  stay: 'Hospedaje',
  support: 'Soporte',
  transport: 'Transporte',
}

const normalizeIncludes = (apiPackage, localPackage) => {
  // Traduce lo incluido por el paquete a etiquetas y elementos visibles.
  const apiIncludes = apiPackage.incluidos ?? apiPackage.includes

  if (!Array.isArray(apiIncludes) || apiIncludes.length === 0) {
    return {
      includeItems: localPackage.includeItems ?? [],
      includes: localPackage.includes ?? ['Hospedaje'],
      includeTags: localPackage.includeTags ?? ['Hospedaje'],
    }
  }

  const includeItems = apiIncludes.map((item) => ({
    iconType: item.tipo_icono ?? item.iconType ?? 'check',
    name: item.nombre ?? item.name ?? String(item),
  }))
  const includeTags = [
    ...new Set(includeItems.map((item) => includeTypeLabels[item.iconType] ?? item.name)),
  ]

  return {
    includeItems,
    includes: includeItems.slice(0, 3).map((item) => item.name),
    includeTags,
  }
}

export const normalizePackage = (apiPackage) => {
  // Une nombres de campos del backend con el modelo que usan las tarjetas y el detalle.
  const localPackage = {}
  const slug = apiPackage.slug ?? localPackage.id ?? String(apiPackage.id)
  const priceAmount = toNumber(apiPackage.precio ?? apiPackage.priceAmount, localPackage.priceAmount ?? 0)
  const lat = toNumber(apiPackage.latitud, localPackage.coordinates?.lat)
  const lng = toNumber(apiPackage.longitud, localPackage.coordinates?.lng)
  const days = toNumber(apiPackage.dias, localPackage.days)
  const minimumNights = toNumber(apiPackage.noches_minimas, localPackage.minimumNights)
  const departures = normalizeDepartures(apiPackage, localPackage)
  const galleryImages = normalizeGalleryImages(apiPackage, localPackage)
  const normalizedIncludes = normalizeIncludes(apiPackage, localPackage)
  const bookingMode = apiPackage.modo_reserva === 'por-noche'
    ? 'nightly'
    : departures.length > 0
      ? 'fixed-date'
      : minimumNights
        ? 'nightly'
        : localPackage.bookingMode ?? 'fixed-date'
  const coordinates = Number.isFinite(lat) && Number.isFinite(lng)
    ? { lat, lng }
    : localPackage.coordinates
  const maxGuestsFromDepartures = Math.max(...departures.map((departure) => departure.availableSpots), 0)
  const maxGuestsFallback = localPackage.maxGuests ?? (maxGuestsFromDepartures || 2)
  const maxGuests = toNumber(apiPackage.max_huespedes ?? apiPackage.capacidad_maxima, maxGuestsFallback)
  const primaryImage = galleryImages[0] ?? apiPackage.imagen_principal ?? localPackage.image ?? ''
  const heroImage = apiPackage.imagen_hero ?? galleryImages[0] ?? primaryImage

  return {
    ...localPackage,
    backendId: apiPackage.id ?? localPackage.backendId,
    bookingMode,
    cancellationDaysBefore: toNumber(apiPackage.dias_cancelacion_anticipada, 14),
    coordinates,
    days,
    description: apiPackage.descripcion ?? localPackage.description ?? '',
    destination: apiPackage.destino ?? localPackage.destination ?? '',
    departures,
    duration: localPackage.duration ?? (days ? `${days} dias` : 'Fechas flexibles'),
    experienceType: apiPackage.tipo_experiencia ?? localPackage.experienceType ?? 'Viaje',
    galleryImages,
    groupSize: `Hasta ${maxGuests} viajeros`,
    href: `/packages/${slug}`,
    id: slug,
    image: primaryImage,
    heroImage,
    includeItems: normalizedIncludes.includeItems,
    includeTags: normalizedIncludes.includeTags,
    includes: normalizedIncludes.includes,
    itinerary: localPackage.itinerary ?? [],
    highlights: localPackage.highlights ?? [],
    longDescription: apiPackage.descripcion_larga ?? localPackage.longDescription ?? apiPackage.descripcion ?? '',
    maxGuests,
    minimumNights,
    price: formatCurrency(priceAmount),
    priceAmount,
    priceUnit: apiPackage.unidad_precio ?? localPackage.priceUnit,
    title: apiPackage.titulo ?? localPackage.title ?? '',
    accommodation: {
      ...(localPackage.accommodation ?? {}),
      address: apiPackage.direccion_hospedaje ?? localPackage.accommodation?.address ?? apiPackage.destino ?? '',
      coordinates: coordinates ?? localPackage.accommodation?.coordinates,
      name: apiPackage.nombre_hospedaje ?? localPackage.accommodation?.name ?? apiPackage.titulo ?? '',
      type: apiPackage.tipo_hospedaje ?? localPackage.accommodation?.type ?? 'Hospedaje',
    },
  }
}

export const getPublicPackages = async () => {
  // Listado publico de paquetes para home/filtros/lista.
  const packages = await apiRequest('/paquetes', {
    fallbackMessage: 'No se pudieron cargar los paquetes.',
  })
  return Array.isArray(packages) ? packages.map(normalizePackage) : []
}

export const getPublicPackageBySlug = async (slug) => normalizePackage(
  // Detalle publico de un paquete por slug.
  await apiRequest(`/paquetes/${slug}`, {
    fallbackMessage: 'No se pudieron cargar los paquetes.',
  }),
)

export const packageService = {
  getBySlug: getPublicPackageBySlug,
  getPublic: getPublicPackages,
}
