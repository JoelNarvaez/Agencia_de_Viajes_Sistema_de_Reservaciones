import { Link } from 'react-router-dom'
import { packagePropType } from '../../utils/homePropTypes'
import styles from './PackageCard.module.css'

function PackageCard({ travelPackage }) {
  const isNightly = travelPackage.bookingMode === 'nightly'
  const capacityText = `Hasta ${travelPackage.maxGuests ?? 2} huespedes`
  const detailText = isNightly
    ? `Fechas flexibles - ${capacityText}`
    : `${travelPackage.duration ?? 'Salida programada'} - ${travelPackage.groupSize ?? capacityText}`
  const priceText = isNightly
    ? `${travelPackage.price} por noche`
    : `${travelPackage.price} en total`

  return (
    <article className={styles.card}>
      <Link className={styles.imageLink} to={travelPackage.href} aria-label={`Ver ${travelPackage.title}`}>
        <img src={travelPackage.image} alt="" />
      </Link>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{travelPackage.experienceType}</span>
          <span>{isNightly ? 'Por noche' : 'Salida fija'}</span>
        </div>

        <h2>{travelPackage.title}</h2>
        <p>
          {travelPackage.destination}
          <br />
          {detailText}
        </p>

        <div className={styles.footer}>
          <strong>{priceText}</strong>
          <Link to={travelPackage.href}>Ver paquete</Link>
        </div>
      </div>
    </article>
  )
}

PackageCard.propTypes = {
  travelPackage: packagePropType.isRequired,
}

export default PackageCard
