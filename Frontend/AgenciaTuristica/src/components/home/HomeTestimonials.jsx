import PropTypes from 'prop-types'
import styles from './HomeTestimonials.module.css'
import { testimonialPropType } from '../../utils/homePropTypes'

function HomeTestimonials({ testimonials }) {
  return (
    <section className={styles.section} aria-labelledby="home-testimonials-title">
      <div className={styles.header}>
        <span>Testimonios</span>
        <h2 id="home-testimonials-title">Viajeros que ya encontraron su siguiente historia</h2>
      </div>

      <div className={styles.grid}>
        {testimonials.map((testimonial) => (
          <article className={styles.card} key={testimonial.name}>
            <div className={styles.rating}>
              <strong>{testimonial.rating}</strong>
              <span>Experiencia recomendada</span>
            </div>

            <p>“{testimonial.quote}”</p>

            <footer>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.trip}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}

HomeTestimonials.propTypes = {
  testimonials: PropTypes.arrayOf(testimonialPropType).isRequired,
}

export default HomeTestimonials
