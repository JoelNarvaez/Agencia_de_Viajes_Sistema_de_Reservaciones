import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import DestinationCard from './DestinationCard.jsx'
import styles from './DestinationCarousel.module.css'
import { destinationPropType } from '../../utils/homePropTypes'

function DestinationCarousel({ activeIndex, destinations, onSelectDestination }) {
  const cardRefs = useRef([])

  useEffect(() => {
    if (activeIndex === null) return

    cardRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeIndex])

  return (
    <div className={styles.carousel} aria-label="Destinos populares">
      {destinations.map((destination, index) => (
        <div
          className={styles.item}
          key={destination.title}
          ref={(element) => {
            cardRefs.current[index] = element
          }}
        >
          <DestinationCard
            isActive={index === activeIndex}
            image={destination.image}
            location={destination.location}
            onClick={() => onSelectDestination(index)}
            title={destination.title}
          />
        </div>
      ))}
    </div>
  )
}

DestinationCarousel.propTypes = {
  activeIndex: PropTypes.number,
  destinations: PropTypes.arrayOf(destinationPropType).isRequired,
  onSelectDestination: PropTypes.func.isRequired,
}

export default DestinationCarousel
