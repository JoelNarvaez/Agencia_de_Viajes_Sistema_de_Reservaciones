import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import {
FaBars,
FaUserCircle,
FaUser,
FaCalendarAlt,
FaSignOutAlt,
FaChevronDown,
} from "react-icons/fa";

import MobileDrawer from "./MobileDrawer";
import styles from "./Navbar.module.css";

function Navbar({
brand = "LOGO",
isAuthenticated = false,
role = null,
userName = "Usuario",
}) {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const toggleMenu = () => {
setIsMenuOpen(!isMenuOpen);
};

return ( <nav className={styles.navbar}> <div className={styles.container}>
{/* LOGO */} <div className={styles.logo}>
{brand} </div>

```
    {/* LINKS */}
    <div className={styles.links}>
      <NavLink to="/" className={styles.link}>
        Inicio
      </NavLink>

      <NavLink
        to="/destinations"
        className={styles.link}
      >
        Destinos
      </NavLink>

      <NavLink
        to="/packages"
        className={styles.link}
      >
        Paquetes
      </NavLink>

      <NavLink
        to="/about"
        className={styles.link}
      >
        Nosotros
      </NavLink>
    </div>

    {/* ACCIONES */}
    <div className={styles.actions}>
      {!isAuthenticated && (
        <>
          <NavLink to="/login">
            <button
              className={styles.loginButton}
            >
              Ingresar
            </button>
          </NavLink>

          <NavLink to="/register">
            <button
              className={
                styles.registerButton
              }
            >
              Registrarse
            </button>
          </NavLink>
        </>
      )}

      {isAuthenticated && (
        <div className={styles.userMenu}>
          <button
            className={styles.userButton}
            onClick={toggleMenu}
          >
            <FaUserCircle />

            <span>
              {role === "admin"
                ? "Admin"
                : userName}
            </span>

            <FaChevronDown
              className={`${styles.arrow} ${
                isMenuOpen
                  ? styles.arrowOpen
                  : ""
              }`}
            />
          </button>

          {isMenuOpen && (
            <div className={styles.dropdown}>
              {role === "user" && (
                <>
                  <NavLink to="/profile">
                    <FaUser />
                    Mi Perfil
                  </NavLink>

                  <NavLink to="/reservations">
                    <FaCalendarAlt />
                    Mis Reservaciones
                  </NavLink>

                  <div
                    className={
                      styles.divider
                    }
                  ></div>
                </>
              )}

              {role === "admin" && (
                <>
                  <NavLink to="/admin">
                    Dashboard
                  </NavLink>

                  <NavLink to="/admin/users">
                    Usuarios
                  </NavLink>

                  <NavLink to="/admin/packages">
                    Paquetes
                  </NavLink>

                  <NavLink to="/admin/reservations">
                    Reservaciones
                  </NavLink>

                  <div
                    className={
                      styles.divider
                    }
                  ></div>
                </>
              )}

              <NavLink to="/">
                <FaSignOutAlt />
                Cerrar Sesión
              </NavLink>
            </div>
          )}
        </div>
      )}
    </div>

    {/* BOTÓN HAMBURGUESA */}
    <button
      className={
        styles.mobileMenuButton
      }
      onClick={() =>
        setIsMobileMenuOpen(true)
      }
    >
      <FaBars />
    </button>
  </div>

  {isMobileMenuOpen && (
    <MobileDrawer
      isAuthenticated={
        isAuthenticated
      }
      role={role}
      userName={userName}
      onClose={() =>
        setIsMobileMenuOpen(false)
      }
    />
  )}
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
userName: PropTypes.string,
};

export default Navbar;
