import PropTypes from "prop-types";
import styles from "./Navbar.module.css";

function Navbar({
  brand = "NovaTrips",
  isAuthenticated = false,
  role = null,
}) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          {brand}
        </div>

        <div className={styles.links}>
          <a href="#" className={styles.link}>
            Inicio
          </a>

          <a href="#" className={styles.link}>
            Destinos
          </a>

          <a href="#" className={styles.link}>
            Paquetes
          </a>

          {!isAuthenticated && (
            <>
              <a href="#" className={styles.link}>
                Iniciar Sesión
              </a>

              <a href="#" className={styles.link}>
                Registro
              </a>
            </>
          )}

          {isAuthenticated && role === "user" && (
            <>
              <a href="#" className={styles.link}>
                Mis Reservaciones
              </a>

              <a href="#" className={styles.link}>
                Perfil
              </a>

              <a href="#" className={styles.link}>
                Cerrar Sesión
              </a>
            </>
          )}

          {isAuthenticated && role === "admin" && (
            <>
              <a href="#" className={styles.link}>
                Dashboard
              </a>

              <a href="#" className={styles.link}>
                Usuarios
              </a>

              <a href="#" className={styles.link}>
                Cerrar Sesión
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  brand: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  role: PropTypes.oneOf([
    "user",
    "admin",
    null,
  ]),
};

export default Navbar;