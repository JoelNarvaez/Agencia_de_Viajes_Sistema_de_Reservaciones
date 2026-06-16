import { useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './PopularDestinations.module.css'
import { destinationPropType } from '../../utils/homePropTypes'

function PopularDestinations({ destinations }) {
  const carouselRef = useRef(null)
  const carouselDestinations = destinations.slice(0, 7)

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return

    carouselRef.current.scrollBy({
      left: carouselRef.current.clientWidth * direction,
      behavior: 'smooth',
    })
  }

  return (
    <section className={styles.section} aria-labelledby="popular-destinations-title">
      <div className={styles.layout}>
        <div className={styles.header}>
          <h2 id="popular-destinations-title">Tu siguiente ruta empieza con curiosidad</h2>
        </div>

        <div className={styles.carouselArea}>
          <div className={styles.carousel} ref={carouselRef}>
            {carouselDestinations.map((destination) => (
              <article className={styles.card} key={destination.title}>
                <a className={styles.imageLink} href={destination.href} aria-label={`Ver ${destination.title}`}>
                  <img src={destination.image} alt="" />
                </a>

                <div className={styles.cardBody}>
                  <h3>{destination.title}</h3>
                  <p className={styles.location}>{destination.location}</p>
                  <span className={styles.badge}>{destination.duration}</span>
                  <p className={styles.brand}>{destination.description}</p>

                  <div className={styles.cardFooter}>
                    <div>
                      <span className={styles.priceLabel}>Desde</span>
                      <strong>{destination.priceFrom}</strong>
                    </div>
                    <a className={styles.cardLink} href={destination.href} aria-label={`Ver ${destination.title}`}>
                      <span aria-hidden="true">&gt;</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.controls} aria-label="Navegar destinos">
            <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Destinos anteriores">
              &lt;
            </button>
            <button type="button" onClick={() => scrollCarousel(1)} aria-label="Destinos siguientes">
              &gt;
            </button>
          </div>
        </div>

        <div className={styles.closing}>
          <h3>Encuentra el destino que encaja con tu forma de viajar</h3>
          <a href="/destinations">Explorar destinos</a>
        </div>
      </div>
    </section>
  )
}

PopularDestinations.propTypes = {
  destinations: PropTypes.arrayOf(destinationPropType).isRequired,
}

export default PopularDestinations
