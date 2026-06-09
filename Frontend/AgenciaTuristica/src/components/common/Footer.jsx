import PropTypes from "prop-types";
import styles from "./Footer.module.css";

function Footer({
  companyName = "NovaTrips",
  year = new Date().getFullYear(),
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <h3>{companyName}</h3>

        <p>
          Planea, personaliza y reserva tu próximo viaje.
        </p>

        <p>
          © {year} {companyName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  companyName: PropTypes.string,
  year: PropTypes.number,
};

export default Footer;