import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "../../icons/fa";
import PropTypes from "prop-types";
import styles from "./Footer.module.css";

function Footer({
  companyName = "Atlani Tours",
  year = new Date().getFullYear(),
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.column}>
          <div className={styles.logo}>
            <img src="/logo-claro.png" alt="Logo" />
          </div>

          <p className={styles.description}>
            Descubre nuevas experiencias y crea
            experiencias inolvidables con nosotros.
          </p>
        </div>

        <div className={styles.column}>
          <h3>NAVEGACIÓN</h3>

          <a href="#">Inicio</a>
          <a href="#">Paquetes</a>
          <a href="#">Contacto</a>
        </div>

        <div className={styles.column}>
  <h3>CONTÁCTANOS</h3>

  <p>
    <FaMapMarkerAlt className={styles.icon} />
    Aguascalientes, México
  </p>

  <p>
    <FaPhoneAlt className={styles.icon} />
    +52 449 123 4567
  </p>

  <p>
    <FaEnvelope className={styles.icon} />
    atlani.tours@gmail.com
  </p>

  <div className={styles.socials}>
    <a href="#">
      <FaFacebookF />
    </a>

    <a href="#">
      <FaInstagram />
    </a>

    <a href="#">
      <FaWhatsapp />
    </a>
  </div>
</div>

      </div>

      <div className={styles.bottomBar}>
        © {year} {companyName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}

Footer.propTypes = {
  companyName: PropTypes.string,
  year: PropTypes.number,
};

export default Footer;
