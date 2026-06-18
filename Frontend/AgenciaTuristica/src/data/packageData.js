export const travelPackages = [
  {
    id: 'escapada-huasteca',
    title: 'Escapada Huasteca',
    destination: 'Huasteca Potosina',
    duration: '5 dias / 4 noches',
    coordinates: {
      lat: 21.9833,
      lng: -99.0167,
    },
    accommodation: {
      name: 'Hotel Boutique Huasteca',
      type: 'Hotel',
      address: 'Centro, Ciudad Valles, San Luis Potosi',
      coordinates: {
        lat: 21.9858,
        lng: -99.0161,
      },
    },
    days: 5,
    experienceType: 'Aventura',
    groupSize: '2 a 8 viajeros',
    bookingMode: 'fixed-date',
    maxGuests: 8,
    priceUnit: 'por salida',
    departures: [
      { id: 'huasteca-jul-10', startDate: '2026-07-10', endDate: '2026-07-14', availableSpots: 8 },
      { id: 'huasteca-jul-24', startDate: '2026-07-24', endDate: '2026-07-28', availableSpots: 5 },
    ],
    description:
      'Rios turquesa, cascadas y traslados organizados para vivir una aventura completa sin complicarte.',
    longDescription:
      'Un paquete pensado para quienes quieren conocer la Huasteca Potosina con una ruta clara, hospedaje comodo y actividades guiadas. Incluye tiempos para aventura, descanso y traslados coordinados entre cada experiencia.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85',
    heroImage:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85',
    includes: ['Hotel', 'Tours guiados', 'Traslados'],
    includeTags: ['Hospedaje', 'Tours guiados', 'Transporte'],
    itinerary: ['Llegada y traslado al hotel', 'Ruta de cascadas', 'Tour en rios turquesa', 'Dia libre guiado', 'Regreso'],
    highlights: ['Cascadas', 'Rios turquesa', 'Guias locales', 'Traslados incluidos'],
    price: '$12,900 MXN',
    priceAmount: 12900,
    href: '/packages/escapada-huasteca',
  },
  {
    id: 'ruta-baja-desert',
    title: 'Ruta Baja Desert',
    destination: 'Baja California',
    duration: '4 dias / 3 noches',
    coordinates: {
      lat: 30.8406,
      lng: -115.2838,
    },
    accommodation: {
      name: 'Eco Lodge Baja Desert',
      type: 'Lodge',
      address: 'San Felipe, Baja California',
      coordinates: {
        lat: 31.0246,
        lng: -114.8392,
      },
    },
    days: 4,
    experienceType: 'Naturaleza',
    groupSize: '2 a 6 viajeros',
    bookingMode: 'fixed-date',
    maxGuests: 6,
    priceUnit: 'por salida',
    departures: [
      { id: 'baja-ago-08', startDate: '2026-08-08', endDate: '2026-08-11', availableSpots: 6 },
      { id: 'baja-ago-22', startDate: '2026-08-22', endDate: '2026-08-25', availableSpots: 4 },
    ],
    description:
      'Atardeceres en dunas, miradores naturales y experiencias locales para viajeros que buscan paisajes amplios.',
    longDescription:
      'Una salida de ritmo relajado para descubrir paisajes deserticos, miradores y experiencias locales. Ideal para quienes buscan fotografia, naturaleza y trayectos sin prisa.',
    image:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=85',
    heroImage:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1800&q=85',
    includes: ['Hospedaje', 'Transporte', 'Experiencias'],
    includeTags: ['Hospedaje', 'Transporte', 'Experiencias'],
    itinerary: ['Llegada y briefing', 'Dunas y miradores', 'Experiencia local', 'Regreso'],
    highlights: ['Dunas', 'Atardeceres', 'Paisajes amplios', 'Transporte incluido'],
    price: '$10,800 MXN',
    priceAmount: 10800,
    href: '/packages/ruta-baja-desert',
  },
  {
    id: 'colonial-y-cultura',
    title: 'Colonial y Cultura',
    destination: 'San Miguel de Allende',
    duration: '3 dias / 2 noches',
    coordinates: {
      lat: 20.9144,
      lng: -100.7452,
    },
    accommodation: {
      name: 'Hotel Boutique Centro Historico',
      type: 'Hotel boutique',
      address: 'Zona Centro, San Miguel de Allende, Guanajuato',
      coordinates: {
        lat: 20.9149,
        lng: -100.7437,
      },
    },
    days: 3,
    experienceType: 'Cultura',
    groupSize: '2 a 10 viajeros',
    bookingMode: 'fixed-date',
    maxGuests: 10,
    priceUnit: 'por salida',
    departures: [
      { id: 'colonial-jul-18', startDate: '2026-07-18', endDate: '2026-07-20', availableSpots: 10 },
      { id: 'colonial-ago-01', startDate: '2026-08-01', endDate: '2026-08-03', availableSpots: 7 },
    ],
    description:
      'Calles historicas, terrazas, gastronomia y recorridos culturales para una salida tranquila y bien planeada.',
    longDescription:
      'Un paquete para recorrer calles coloniales, descubrir espacios culturales y disfrutar gastronomia local con tiempos comodos para caminar y descansar.',
    image:
      'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=900&q=85',
    heroImage:
      'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=1800&q=85',
    includes: ['Hotel boutique', 'Guia local', 'Cena'],
    includeTags: ['Hospedaje', 'Guia local', 'Comidas'],
    itinerary: ['Llegada al hotel', 'Centro historico y cena', 'Recorrido cultural', 'Regreso'],
    highlights: ['Arquitectura colonial', 'Gastronomia', 'Guia local', 'Hotel boutique'],
    price: '$8,600 MXN',
    priceAmount: 8600,
    href: '/packages/colonial-y-cultura',
  },
  {
    id: 'costa-esmeralda-relax',
    title: 'Costa Esmeralda Relax',
    destination: 'Veracruz',
    duration: 'Fechas flexibles',
    coordinates: {
      lat: 20.3206,
      lng: -96.9178,
    },
    accommodation: {
      name: 'Hotel Costa Esmeralda Frente al Mar',
      type: 'Hotel',
      address: 'Costa Esmeralda, Veracruz',
      coordinates: {
        lat: 20.3206,
        lng: -96.9178,
      },
    },
    days: null,
    minimumNights: 1,
    experienceType: 'Playa',
    groupSize: '2 a 8 viajeros',
    bookingMode: 'nightly',
    maxGuests: 8,
    priceUnit: 'por noche',
    description:
      'Playas tranquilas, comida costera y hospedaje cerca del mar para desconectarte un fin de semana.',
    longDescription:
      'Una escapada sencilla y comoda para descansar cerca del mar, probar cocina local y moverte con una agenda flexible.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
    includes: ['Hotel frente al mar', 'Desayunos', 'Traslados'],
    includeTags: ['Hospedaje', 'Comidas', 'Transporte'],
    itinerary: ['Llegada a playa', 'Dia libre con recomendaciones', 'Comida costera y regreso'],
    highlights: ['Playa', 'Descanso', 'Gastronomia', 'Hotel frente al mar'],
    price: '$6,800 MXN',
    priceAmount: 6800,
    href: '/packages/costa-esmeralda-relax',
  },
  {
    id: 'bosque-nublado-oaxaca',
    title: 'Bosque Nublado Oaxaca',
    destination: 'Oaxaca',
    duration: 'Fechas flexibles',
    coordinates: {
      lat: 17.0732,
      lng: -96.7266,
    },
    accommodation: {
      name: 'Cabanas Bosque Nublado',
      type: 'Cabanas',
      address: 'Sierra Norte, Oaxaca',
      coordinates: {
        lat: 17.1049,
        lng: -96.5917,
      },
    },
    days: null,
    minimumNights: 1,
    experienceType: 'Naturaleza',
    groupSize: '2 a 7 viajeros',
    bookingMode: 'nightly',
    maxGuests: 7,
    priceUnit: 'por noche',
    description:
      'Senderos frescos, miradores verdes y comunidades serranas con sabores tradicionales.',
    longDescription:
      'Una ruta para viajeros que disfrutan caminar, conocer comunidades y despertar entre paisajes verdes con clima fresco.',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85',
    heroImage:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85',
    includes: ['Cabanas', 'Senderismo', 'Comidas locales'],
    includeTags: ['Hospedaje', 'Experiencias', 'Comidas'],
    itinerary: ['Llegada a la sierra', 'Sendero principal', 'Comunidad y miradores', 'Regreso'],
    highlights: ['Bosque', 'Senderismo', 'Comunidad local', 'Comida tradicional'],
    price: '$7,500 MXN',
    priceAmount: 7500,
    href: '/packages/bosque-nublado-oaxaca',
  },
  {
    id: 'laguna-rosa-yucatan',
    title: 'Laguna Rosa Yucatan',
    destination: 'Yucatan',
    duration: '4 dias / 3 noches',
    coordinates: {
      lat: 21.6086,
      lng: -88.1576,
    },
    accommodation: {
      name: 'Hotel Natural Rio Lagartos',
      type: 'Hotel',
      address: 'Rio Lagartos, Yucatan',
      coordinates: {
        lat: 21.5964,
        lng: -88.1573,
      },
    },
    days: 4,
    experienceType: 'Relax',
    groupSize: '2 a 8 viajeros',
    bookingMode: 'fixed-date',
    maxGuests: 8,
    priceUnit: 'por salida',
    departures: [
      { id: 'yucatan-sep-05', startDate: '2026-09-05', endDate: '2026-09-08', availableSpots: 8 },
      { id: 'yucatan-sep-19', startDate: '2026-09-19', endDate: '2026-09-22', availableSpots: 6 },
    ],
    description:
      'Paisajes salinos, aves migratorias y rutas cercanas a la costa yucateca.',
    longDescription:
      'Un paquete visual y tranquilo para conocer paisajes rosados, costa yucateca y puntos naturales cercanos con traslados coordinados.',
    image:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=85',
    heroImage:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1800&q=85',
    includes: ['Hotel', 'Tour natural', 'Transporte'],
    includeTags: ['Hospedaje', 'Tours guiados', 'Transporte'],
    itinerary: ['Llegada', 'Laguna rosa', 'Costa y miradores', 'Regreso'],
    highlights: ['Laguna rosa', 'Aves', 'Costa', 'Tour natural'],
    price: '$8,700 MXN',
    priceAmount: 8700,
    href: '/packages/laguna-rosa-yucatan',
  },
]

export function getPackageById(packageId) {
  return travelPackages.find((travelPackage) => travelPackage.id === packageId)
}
