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

export default DestinationCard
