import PropTypes from 'prop-types'
import styles from './DestinationCard.module.css'

function DestinationCard({ image, isActive, location, onClick, title }) {
  return (
    <button
      type="button"
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <img src={image} alt="" className={styles.image} />
      <div className={styles.content}>
        <span>{location}</span>
        <h3>{title}</h3>
      </div>
    </button>
  )
}

DestinationCard.propTypes = {
  image: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  location: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default DestinationCard
