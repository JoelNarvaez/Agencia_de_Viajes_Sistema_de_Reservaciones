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
    days: 5,
    experienceType: 'Aventura',
    groupSize: '2 a 8 viajeros',
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
    days: 4,
    experienceType: 'Naturaleza',
    groupSize: '2 a 6 viajeros',
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
    days: 3,
    experienceType: 'Cultura',
    groupSize: '2 a 10 viajeros',
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
    duration: '3 dias / 2 noches',
    coordinates: {
      lat: 20.7286,
      lng: -96.8686,
    },
    days: 3,
    experienceType: 'Playa',
    groupSize: '2 a 8 viajeros',
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
    duration: '4 dias / 3 noches',
    coordinates: {
      lat: 17.0732,
      lng: -96.7266,
    },
    days: 4,
    experienceType: 'Naturaleza',
    groupSize: '2 a 7 viajeros',
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
    days: 4,
    experienceType: 'Relax',
    groupSize: '2 a 8 viajeros',
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
