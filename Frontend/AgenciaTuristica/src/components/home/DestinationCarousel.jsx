import { useEffect, useRef } from 'react'
import DestinationCard from './DestinationCard.jsx'
import styles from './DestinationCarousel.module.css'

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

export default DestinationCarousel
