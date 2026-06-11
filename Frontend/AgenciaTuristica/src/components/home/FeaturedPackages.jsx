import styles from './FeaturedPackages.module.css'

function FeaturedPackages({ packages }) {
  return (
    <section className={styles.section} aria-labelledby="featured-packages-title">
      <div className={styles.header}>
        <span>Paquetes</span>
        <h2 id="featured-packages-title">Viajes armados para reservar sin vueltas</h2>
        <p>
          Elige experiencias completas con hospedaje, traslados y actividades
          pensadas para aprovechar mejor cada destino.
        </p>
      </div>

      <div className={styles.grid}>
        {packages.map((travelPackage) => (
          <article className={styles.card} key={travelPackage.title}>
            <a className={styles.imageLink} href={travelPackage.href} aria-label={`Ver ${travelPackage.title}`}>
              <img src={travelPackage.image} alt="" />
            </a>

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
                <a href={travelPackage.href}>Ver paquete</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeaturedPackages
