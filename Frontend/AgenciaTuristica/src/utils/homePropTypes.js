import PropTypes from 'prop-types'

export const destinationPropType = PropTypes.shape({
  description: PropTypes.string.isRequired,
  duration: PropTypes.string,
  heroImage: PropTypes.string,
  href: PropTypes.string.isRequired,
  id: PropTypes.string,
  image: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  priceFrom: PropTypes.string,
  title: PropTypes.string.isRequired,
})

export const packagePropType = PropTypes.shape({
  description: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  id: PropTypes.string,
  image: PropTypes.string.isRequired,
  includes: PropTypes.arrayOf(PropTypes.string).isRequired,
  price: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
})

export const faqPropType = PropTypes.shape({
  answer: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
})

export const testimonialPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  quote: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  trip: PropTypes.string.isRequired,
})
