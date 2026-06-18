import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import PropTypes from "prop-types";
import styles from "./Footer.module.css";

function Footer({
  companyName = "NovaTrips",
  year = new Date().getFullYear(),
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.column}>
          <div className={styles.logo}>
            LOGO
          </div>

          <p className={styles.description}>
            Descubre destinos increíbles y crea
            experiencias inolvidables con nosotros.
          </p>
        </div>

        <div className={styles.column}>
          <h3>NAVEGACIÓN</h3>

          <a href="#">Inicio</a>
          <a href="#">Destinos</a>
          <a href="#">Paquetes</a>
          <a href="#">Promociones</a>
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
    contacto@novatrips.com
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