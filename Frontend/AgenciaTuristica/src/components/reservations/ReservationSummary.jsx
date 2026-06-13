import styles from "./ReservationSummary.module.css";
import PropTypes from "prop-types";

function ReservationSummary({
  packageName,
  destination,
  date,
  people,
  pricePerPerson,
  insurance = 0,
}) {

  const total =
    people * pricePerPerson + insurance;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        Resumen de Reserva
      </h2>

      <div className={styles.row}>
        <span>Paquete</span>
        <strong>{packageName}</strong>
      </div>

      <div className={styles.row}>
        <span>Destino</span>
        <strong>{destination}</strong>
      </div>

      <div className={styles.row}>
        <span>Fecha</span>
        <strong>{date}</strong>
      </div>

      <div className={styles.row}>
        <span>Personas</span>
        <strong>{people}</strong>
      </div>

      <div className={styles.row}>
        <span>
          Precio por persona
        </span>

        <strong>
          ${pricePerPerson.toLocaleString()}
        </strong>
      </div>

      <div className={styles.row}>
        <span>Seguro</span>

        <strong>
          ${insurance.toLocaleString()}
        </strong>
      </div>

      <div className={styles.total}>
        <span>Total</span>

        <strong>
          ${total.toLocaleString()}
        </strong>
      </div>
    </div>
  );
}

ReservationSummary.propTypes = {
  packageName: PropTypes.string,
  destination: PropTypes.string,
  date: PropTypes.string,
  people: PropTypes.number,
  pricePerPerson: PropTypes.number,
  extras: PropTypes.string,
  total: PropTypes.number,
};

export default ReservationSummary;