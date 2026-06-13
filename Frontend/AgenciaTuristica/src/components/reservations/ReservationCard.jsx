import PropTypes from "prop-types";
import Button from "../common/Button";
import styles from "./ReservationCard.module.css";

function ReservationCard({
  destination,
  packageName,
  travelDate,
  total,
  status,
  image,
  onViewDetail,
}) {
  return (
    <article className={styles.card}>
      <div
        className={styles.imageArea}
        style={{
          backgroundImage: `
            linear-gradient(
              180deg,
              rgba(0,0,0,.05),
              rgba(0,0,0,.35)
            ),
            url(${image})
          `,
        }}
      />

      <div className={styles.content}>
        <div className={styles.tags}>
            <span className={styles.tag}>
                {status}
            </span>
        </div>

        <span className={styles.destination}>
          {destination}
        </span>

        <h3>{packageName}</h3>

        <p className={styles.description}>
          Viaje programado para {travelDate}.
        </p>

        <div className={styles.total}>
          <span>Total</span>

          <strong>
            ${total.toLocaleString()} MXN
          </strong>
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            text="Ver Detalle"
            onClick={onViewDetail}
          />
        </div>
      </div>
    </article>
  );
}

ReservationCard.propTypes = {
  destination: PropTypes.string.isRequired,
  packageName: PropTypes.string.isRequired,
  travelDate: PropTypes.string.isRequired,
  people: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  image: PropTypes.string,
  onViewDetail: PropTypes.func,
};

export default ReservationCard;