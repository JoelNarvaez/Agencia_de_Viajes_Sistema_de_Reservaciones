import { Link, useParams } from 'react-router-dom'
import { getPackageById, travelPackages } from '../../data/packageData'
import NotFound from './NotFound'
import styles from './PackageDetail.module.css'

function PackageDetail() {
  const { packageId } = useParams()
  const travelPackage = getPackageById(packageId)
  const relatedPackages = travelPackages
    .filter((item) => item.id !== packageId)
    .slice(0, 3)

  if (!travelPackage) {
    return <NotFound />
  }

  return (
    <main className={styles.page}>
      <section
        className={styles.hero}
        style={{ '--hero-image': `url(${travelPackage.heroImage})` }}
        aria-labelledby="package-title"
      >
        <div className={styles.heroOverlay}>
          <Link className={styles.backLink} to="/packages">
            Volver a paquetes
          </Link>

          <div className={styles.heroContent}>
            <span>{travelPackage.destination}</span>
            <h1 id="package-title">{travelPackage.title}</h1>
            <p>{travelPackage.longDescription}</p>
          </div>

          <aside className={styles.bookingCard} aria-label="Resumen del paquete">
            <div>
              <span>Desde</span>
              <strong>{travelPackage.price}</strong>
            </div>
            <Link to="/login">Reservar paquete</Link>
          </aside>
        </div>
      </section>

      <section className={styles.summary} aria-label="Datos del paquete">
        <div>
          <span>Duracion</span>
          <strong>{travelPackage.duration}</strong>
        </div>
        <div>
          <span>Grupo</span>
          <strong>{travelPackage.groupSize}</strong>
        </div>
        <div>
          <span>Destino</span>
          <strong>{travelPackage.destination}</strong>
        </div>
      </section>

      <section className={styles.detailGrid}>
        <div className={styles.detailBlock}>
          <span>Incluye</span>
          <h2>Todo lo necesario para viajar sin vueltas</h2>
          <div className={styles.tags}>
            {travelPackage.includes.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className={styles.detailBlock}>
          <span>Highlights</span>
          <h2>Lo mejor de esta experiencia</h2>
          <ul>
            {travelPackage.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.itinerary} aria-labelledby="itinerary-title">
        <div className={styles.sectionHeader}>
          <span>Itinerario</span>
          <h2 id="itinerary-title">Ruta planeada por dia</h2>
        </div>

        <div className={styles.timeline}>
          {travelPackage.itinerary.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.related} aria-labelledby="related-title">
        <div className={styles.sectionHeader}>
          <span>Mas opciones</span>
          <h2 id="related-title">Paquetes relacionados</h2>
        </div>

        <div className={styles.relatedGrid}>
          {relatedPackages.map((item) => (
            <Link className={styles.relatedCard} key={item.id} to={item.href}>
              <img src={item.image} alt="" />
              <div>
                <span>{item.destination}</span>
                <strong>{item.title}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default PackageDetail
