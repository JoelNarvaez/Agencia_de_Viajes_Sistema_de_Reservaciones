import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import {
  FaUserCircle,
  FaUser,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

import styles from "./Navbar.module.css";

function Navbar({
  brand = "LOGO",
  isAuthenticated = false,
  role = null,
  userName = "Usuario",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* LOGO */}
        <div className={styles.logo}>
          {brand}
        </div>

        {/* LINKS */}
        <div className={styles.links}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/destinations"
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            Destinos
          </NavLink>

          <NavLink
            to="/packages"
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            Paquetes
          </NavLink>
        </div>

        {/* ACCIONES */}
        <div className={styles.actions}>
          {!isAuthenticated && (
            <>
              <NavLink to="/login">
                <button className={styles.loginButton}>
                  Ingresar
                </button>
              </NavLink>

              <NavLink to="/register">
                <button className={styles.reserveButton}>
                  Registrarse
                </button>
              </NavLink>
            </>
          )}

          {/* USUARIO */}
          {isAuthenticated && role === "user" && (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() =>
                  setIsMenuOpen(!isMenuOpen)
                }
              >
                <FaUserCircle />

                <span>{userName}</span>

                <FaChevronDown
                  size={10}
                  className={`${styles.arrow} ${
                    isMenuOpen
                      ? styles.arrowOpen
                      : ""
                  }`}
                />
              </button>

              {isMenuOpen && (
                <div className={styles.dropdown}>
                  <NavLink to="/profile">
                    <FaUser />
                    Mi Perfil
                  </NavLink>

                  <NavLink to="/reservations">
                    <FaCalendarAlt />
                    Mis Reservaciones
                  </NavLink>

                  <NavLink to="/">
                    <FaSignOutAlt />
                    Cerrar Sesión
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* ADMIN */}
          {isAuthenticated && role === "admin" && (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() =>
                  setIsMenuOpen(!isMenuOpen)
                }
              >
                <FaUserCircle />

                <span>{userName}</span>

                <FaChevronDown
                  size={10}
                  className={`${styles.arrow} ${
                    isMenuOpen
                      ? styles.arrowOpen
                      : ""
                  }`}
                />
              </button>

              {isMenuOpen && (
                <div className={styles.dropdown}>
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

                  <NavLink to="/">
                    <FaSignOutAlt />
                    Cerrar Sesión
                  </NavLink>
                </div>
              )}
            </div>
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
  userName: PropTypes.string,
};

export default Navbar;