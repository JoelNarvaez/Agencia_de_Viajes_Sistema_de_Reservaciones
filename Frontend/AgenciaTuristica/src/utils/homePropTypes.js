import PropTypes from 'prop-types'

// Contrato para tarjetas o secciones de destinos en home.
export const destinationPropType = PropTypes.shape({
  description: PropTypes.string.isRequired,
  duration: PropTypes.string,
  heroImage: PropTypes.string,
  href: PropTypes.string,
  id: PropTypes.string,
  image: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  priceFrom: PropTypes.string,
  title: PropTypes.string.isRequired,
})

// Contrato principal de un paquete turistico despues de normalizarlo desde la API.
export const packagePropType = PropTypes.shape({
  accommodation: PropTypes.shape({
    address: PropTypes.string.isRequired,
    coordinates: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  description: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  bookingMode: PropTypes.oneOf(['fixed-date', 'nightly']),
  days: PropTypes.number,
  departures: PropTypes.arrayOf(
    PropTypes.shape({
      availableSpots: PropTypes.number.isRequired,
      endDate: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
    }),
  ),
  duration: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  id: PropTypes.string,
  image: PropTypes.string.isRequired,
  includes: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxGuests: PropTypes.number,
  minimumNights: PropTypes.number,
  price: PropTypes.string.isRequired,
  priceUnit: PropTypes.string,
  title: PropTypes.string.isRequired,
})

// Contrato para preguntas frecuentes.
export const faqPropType = PropTypes.shape({
  answer: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
})

// Contrato para testimonios mostrados en landing/home.
export const testimonialPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  quote: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  trip: PropTypes.string.isRequired,
})
