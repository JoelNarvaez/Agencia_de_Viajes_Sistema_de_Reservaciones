import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="not-found-title">
        <div className={styles.content}>
          <span className={styles.kicker}>Error 404</span>
          <h1 id="not-found-title">Ruta no encontrada</h1>
          <p>
            Parece que este destino no existe o la direccion cambio. Vuelve al
            inicio para seguir explorando viajes disponibles.
          </p>

          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/">
              Volver al inicio
            </Link>
            <Link className={styles.secondaryAction} to="/login">
              Iniciar sesion
            </Link>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <span>404</span>
          <div className={styles.routeLine} />
        </div>
      </section>
    </main>
  )
}

export default NotFound
