import PropTypes from 'prop-types'
import styles from './HomeFAQ.module.css'
import { faqPropType } from '../../utils/homePropTypes'

function HomeFAQ({ items }) {
  return (
    <section className={styles.section} aria-labelledby="home-faq-title">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <span>Preguntas frecuentes</span>
          <h2 id="home-faq-title">Antes de reservar, resuelve lo importante</h2>
          <p>
            Estas son las dudas mas comunes antes de elegir destino, paquete o
            fecha de viaje.
          </p>
        </div>

        <div className={styles.list}>
          {items.map((item, index) => (
            <details className={styles.item} key={item.question} open={index === 0}>
              <summary>
                <span>{item.question}</span>
                <strong aria-hidden="true">+</strong>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

HomeFAQ.propTypes = {
  items: PropTypes.arrayOf(faqPropType).isRequired,
}

export default HomeFAQ
