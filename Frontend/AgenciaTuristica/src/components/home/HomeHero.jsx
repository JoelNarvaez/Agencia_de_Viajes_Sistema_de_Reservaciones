import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './HomeHero.module.css'
import { destinationPropType } from '../../utils/homePropTypes'

function HomeHero({ destinations }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeDestination = destinations[activeIndex] ?? destinations[0]
  const heroImage =
    activeDestination?.heroImage ??
    activeDestination?.image ??
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85'
  const progressWidth =
    destinations.length > 0 ? `${((activeIndex + 1) / destinations.length) * 100}%` : '0%'
  const contentKey = activeDestination?.title ?? 'default'
  const displayIndex = activeIndex + 1

  useEffect(() => {
    if (destinations.length <= 1) return undefined

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        if (currentIndex >= destinations.length - 1) {
          return 0
        }

        return currentIndex + 1
      })
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [destinations.length])

  const goToPrevious = () => {
    if (destinations.length === 0) return

    setActiveIndex((currentIndex) => {
      if (currentIndex === 0) {
        return destinations.length - 1
      }

      return currentIndex - 1
    })
  }
  const goToNext = () => {
    if (destinations.length === 0) return

    setActiveIndex((currentIndex) => {
      if (currentIndex === destinations.length - 1) {
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
            <Link className={styles.cta} to="/packages">
              Ver paquetes
            </Link>
          </div>
        </div>

        <div className={styles.footerControls}>
          <div className={styles.arrows} aria-label="Navegar experiencias">
            <button type="button" onClick={goToPrevious} aria-label="Experiencia anterior">
              <span aria-hidden="true">&lt;</span>
            </button>
            <button type="button" onClick={goToNext} aria-label="Experiencia siguiente">
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
