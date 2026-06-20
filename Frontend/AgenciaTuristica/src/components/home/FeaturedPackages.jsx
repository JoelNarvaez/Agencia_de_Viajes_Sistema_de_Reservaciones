import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './FeaturedPackages.module.css'
import { packagePropType } from '../../utils/homePropTypes'

function FeaturedPackages({ packages }) {
  return (
    <section className={styles.section} aria-labelledby="featured-packages-title">
      <div className={styles.header}>
        <h2 id="featured-packages-title">Viajes armados para reservar sin vueltas</h2>
        <p>
          Elige  tus experiencias completas.
        </p>
      </div>

      <div className={styles.grid}>
        {packages.map((travelPackage) => (
          <article className={styles.card} key={travelPackage.title}>
            <Link className={styles.imageLink} to={travelPackage.href} aria-label={`Ver ${travelPackage.title}`}>
              <img src={travelPackage.image} alt="" />
            </Link>

            <div className={styles.content}>
              <div className={styles.meta}>
                <span>{travelPackage.destination}</span>
                <span>{travelPackage.duration}</span>
              </div>

              <h3>{travelPackage.title}</h3>
              <p>{travelPackage.description}</p>

              <div className={styles.includes}>
                {travelPackage.includes.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className={styles.footer}>
                <div>
                  <span>Desde</span>
                  <strong>{travelPackage.price}</strong>
                </div>
                <Link to={travelPackage.href}>Ver paquete</Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.actions}>
        <Link to="/packages">Explorar paquetes</Link>
      </div>
    </section>
  )
}

FeaturedPackages.propTypes = {
  packages: PropTypes.arrayOf(packagePropType).isRequired,
}

export default FeaturedPackages
