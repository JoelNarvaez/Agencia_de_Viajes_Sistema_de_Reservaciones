import styles from "./ReservationSummary.module.css";
import PropTypes from "prop-types";

function ReservationSummary({
  packageName,
  destination,
  date,
  people,
  pricePerPerson,
  priceLabel = "Precio por persona",
  totalAmount,
  insurance = 0,
}) {

  const total =
    totalAmount ?? people * pricePerPerson + insurance;

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
        <span>{priceLabel}</span>

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
  priceLabel: PropTypes.string,
  pricePerPerson: PropTypes.number,
  totalAmount: PropTypes.number,
  insurance: PropTypes.number,
};

export default ReservationSummary;
