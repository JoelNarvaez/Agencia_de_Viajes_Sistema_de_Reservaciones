import { useState } from 'react'
import PropTypes from 'prop-types'
import DestinationCarousel from './DestinationCarousel.jsx'
import styles from './HomeHero.module.css'
import { destinationPropType } from '../../utils/homePropTypes'

function HomeHero({ destinations }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const activeDestination =
    activeIndex === null ? null : destinations[activeIndex]
  const heroImage =
    activeDestination?.heroImage ??
    activeDestination?.image ??
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85'
  const progressWidth =
    activeIndex === null ? '12%' : `${((activeIndex + 1) / destinations.length) * 100}%`
  const contentKey = activeDestination?.title ?? 'default'
  const displayIndex = activeIndex === null ? 1 : activeIndex + 1
  const goToPrevious = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null || currentIndex === 0) {
        return destinations.length - 1
      }

      return currentIndex - 1
    })
  }
  const goToNext = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null || currentIndex === destinations.length - 1) {
        return 0
      }

      return currentIndex + 1
    })
  }

  return (
    <section className={styles.hero} aria-label="Experiencias destacadas">
      <div
        className={styles.shell}
        style={{
          '--progress-width': progressWidth,
        }}
      >
        <div
          key={contentKey}
          className={styles.background}
          style={{ '--hero-image': `url(${heroImage})` }}
          aria-hidden="true"
        ></div>

        <div className={styles.content}>
          <div key={contentKey} className={styles.copy}>
            <p className={styles.eyebrow}>
              {activeDestination?.location ?? 'Aventura en Mexico'}
            </p>
            <h1>{activeDestination?.title ?? 'Explora rutas que se sienten vivas'}</h1>
            <p className={styles.description}>
              {activeDestination?.description ??
                'Viajes curados para descubrir montanas, playas, selvas y pueblos con reservas simples y acompanamiento local.'}
            </p>
            <a className={styles.cta} href={activeDestination?.href ?? '/destinations'}>
              {activeDestination ? 'Ver destino' : 'Ver destinos'}
            </a>
          </div>

          <DestinationCarousel
            activeIndex={activeIndex}
            destinations={destinations}
            onSelectDestination={setActiveIndex}
          />
        </div>

        <div className={styles.footerControls}>
          <div className={styles.arrows} aria-label="Navegar destinos">
            <button type="button" onClick={goToPrevious} aria-label="Destino anterior">
              <span aria-hidden="true">&lt;</span>
            </button>
            <button type="button" onClick={goToNext} aria-label="Destino siguiente">
              <span aria-hidden="true">&gt;</span>
            </button>
          </div>

          <div className={styles.progress} aria-hidden="true">
            <span></span>
          </div>

          <strong className={styles.counter}>
            {String(displayIndex).padStart(2, '0')}
          </strong>
        </div>
      </div>
    </section>
  )
}

HomeHero.propTypes = {
  destinations: PropTypes.arrayOf(destinationPropType).isRequired,
}

export default HomeHero
