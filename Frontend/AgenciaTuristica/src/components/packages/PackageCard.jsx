import { Link } from 'react-router-dom'
import { packagePropType } from '../../utils/homePropTypes'
import styles from './PackageCard.module.css'

function PackageCard({ travelPackage }) {
  return (
    <article className={styles.card}>
      <Link className={styles.imageLink} to={travelPackage.href} aria-label={`Ver ${travelPackage.title}`}>
        <img src={travelPackage.image} alt="" />
      </Link>

      <div className={styles.content}>
        <button type="button" aria-label={`Guardar ${travelPackage.title}`}>
          &#9825;
        </button>

        <div className={styles.meta}>
          <span>{travelPackage.experienceType}</span>
        </div>

        <h2>{travelPackage.title}</h2>
        <p>
          {travelPackage.destination}
          <br />
          {travelPackage.duration} · {travelPackage.groupSize}
        </p>

        <div className={styles.footer}>
          <strong>{travelPackage.price} en total</strong>
          <span>★ 4.8 (209)</span>
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
