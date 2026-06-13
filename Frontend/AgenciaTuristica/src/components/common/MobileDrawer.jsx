import { useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
FaTimes,
FaUserCircle,
FaUser,
FaCalendarAlt,
FaSignOutAlt,
FaUsers,
FaBoxOpen,
FaTachometerAlt,
FaChevronDown,
} from "react-icons/fa";

import styles from "./MobileDrawer.module.css";

function MobileDrawer({
isAuthenticated,
role,
userName,
onClose,
}) {
const [showMenu, setShowMenu] =
useState(false);

return (
<> <div
     className={styles.overlay}
     onClick={onClose}
   />

```
  <aside className={styles.drawer}>
    <button
      className={styles.closeButton}
      onClick={onClose}
    >
      <FaTimes />
    </button>

    {/* PERFIL */}
    {isAuthenticated && (
      <div className={styles.userHeader}>
        <FaUserCircle
          className={styles.avatar}
        />

        <button
          className={styles.accountButton}
          onClick={() =>
            setShowMenu(!showMenu)
          }
        >
          <span>
            {role === "admin"
              ? "Admin"
              : userName}
          </span>

          <FaChevronDown
            className={`${styles.arrow} ${
              showMenu
                ? styles.arrowOpen
                : ""
            }`}
          />
        </button>
      </div>
    )}

    {/* ENLACES GENERALES */}
    <div className={styles.links}>
      <NavLink
        to="/"
        onClick={onClose}
      >
        Inicio
      </NavLink>

      <NavLink
        to="/destinations"
        onClick={onClose}
      >
        Destinos
      </NavLink>

      <NavLink
        to="/packages"
        onClick={onClose}
      >
        Paquetes
      </NavLink>

      <NavLink
        to="/about"
        onClick={onClose}
      >
        Nosotros
      </NavLink>
    </div>

    {/* USUARIO */}
    {isAuthenticated &&
      role === "user" &&
      showMenu && (
        <div className={styles.submenu}>
          <NavLink
            to="/profile"
            onClick={onClose}
          >
            <FaUser />
            Mi Perfil
          </NavLink>

          <NavLink
            to="/reservations"
            onClick={onClose}
          >
            <FaCalendarAlt />
            Mis Reservaciones
          </NavLink>

          <div
            className={styles.divider}
          ></div>

          <NavLink
            to="/"
            onClick={onClose}
          >
            <FaSignOutAlt />
            Cerrar Sesión
          </NavLink>
        </div>
      )}

    {/* ADMIN */}
    {isAuthenticated &&
      role === "admin" &&
      showMenu && (
        <div className={styles.submenu}>
          <NavLink
            to="/admin"
            onClick={onClose}
          >
            <FaTachometerAlt />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={onClose}
          >
            <FaUsers />
            Usuarios
          </NavLink>

          <NavLink
            to="/admin/packages"
            onClick={onClose}
          >
            <FaBoxOpen />
            Paquetes
          </NavLink>

          <NavLink
            to="/admin/reservations"
            onClick={onClose}
          >
            <FaCalendarAlt />
            Reservaciones
          </NavLink>

          <div
            className={styles.divider}
          ></div>

          <NavLink
            to="/"
            onClick={onClose}
          >
            <FaSignOutAlt />
            Cerrar Sesión
          </NavLink>
        </div>
      )}

    {/* INVITADO */}
    {!isAuthenticated && (
      <div className={styles.guestActions}>
        <NavLink
          to="/login"
          onClick={onClose}
        >
          <button
            className={styles.loginButton}
          >
            Ingresar
          </button>
        </NavLink>

        <NavLink
          to="/register"
          onClick={onClose}
        >
          <button
            className={
              styles.registerButton
            }
          >
            Registrarse
          </button>
        </NavLink>
      </div>
    )}
  </aside>
</>

);
}
MobileDrawer.propTypes = {
  isAuthenticated: PropTypes.bool,
  role: PropTypes.oneOf([
    "user",
    "admin",
    null,
  ]),
  userName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
export default MobileDrawer;
