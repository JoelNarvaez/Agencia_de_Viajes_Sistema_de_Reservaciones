import PropTypes from 'prop-types'
import styles from './PopularDestinations.module.css'
import { destinationPropType } from '../../utils/homePropTypes'

function PopularDestinations({ destinations }) {
  const topDestinations = destinations.slice(0, 2)
  const featureDestination = destinations[3] ?? destinations[0]

  return (
    <section className={styles.section} aria-labelledby="popular-destinations-title">
      <div className={styles.layout}>
        <span className={styles.eyebrow}>DESTINOS</span>
        <div className={styles.topRow}>
            <aside className={styles.intro}>
            <h2 id="popular-destinations-title">Tu siguiente ruta empieza con curiosidad</h2>
            <p>
              Salir a descubrir nuevos destinos renueva la forma de viajar:
              cambia la rutina por paisajes, sabores y experiencias que se
              quedan contigo.
            </p>
            <a className={styles.headerLink} href="/destinations">
              Explorar destinos
            </a>
          </aside>

          <div className={styles.featuredGrid}>
            {topDestinations.map((destination) => (
              <article className={`${styles.card} ${styles.featuredCard}`} key={destination.title}>
                <a className={styles.imageLink} href={destination.href} aria-label={`Ver ${destination.title}`}>
                  <img src={destination.image} alt="" />
                </a>

                <div className={styles.cardBody}>
                  <div className={styles.meta}>
                    <span>{destination.location}</span>
                    <span>{destination.duration}</span>
                  </div>

                  <h3>{destination.title}</h3>
                  <p>{destination.description}</p>

                  <div className={styles.cardFooter}>
                    <div>
                      <span className={styles.priceLabel}>Desde</span>
                      <strong>{destination.priceFrom}</strong>
                    </div>
                    <a className={styles.cardLink} href={destination.href}>
                      Ver destino
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.bottomRow}>
          <article className={styles.showcase}>
            <img src={featureDestination.heroImage} alt="" />
            <div>
              <h3>{featureDestination.title}</h3>
            </div>
          </article>

          <div className={styles.reasonPanel}>
            <h3>Viajar a lugares nuevos abre mejores historias</h3>
            <p>
              Nuestros destinos destacados combinan naturaleza, cultura y
              escapadas faciles de reservar para que encuentres una experiencia
              que se ajuste a tu ritmo.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

PopularDestinations.propTypes = {
  destinations: PropTypes.arrayOf(destinationPropType).isRequired,
}

export default PopularDestinations
