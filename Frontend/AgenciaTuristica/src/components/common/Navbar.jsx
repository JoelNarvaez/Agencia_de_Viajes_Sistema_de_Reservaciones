import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaCalendarAlt,
  FaChevronDown,
  FaSignOutAlt,
  FaUser,
  FaUserCircle,
} from "../../icons/fa";

import MobileDrawer from "./MobileDrawer";
import useAuth from "../../hooks/useAuth";
import styles from "./Navbar.module.css";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isLandingPage = pathname === "/";
  const role = user?.rol === "admin" ? "admin" : isAuthenticated ? "user" : null;
  const userName =
    [user?.nombre, user?.apellido].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email ||
    "Usuario";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login')
  };

  const closeUserMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`${styles.navbar} ${isLandingPage ? styles.transparent : ""}`}
    >
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/logo-claro.png" alt="Logo" />
        </div>
        
        <div className={styles.links}>
          <NavLink to="/" className={styles.link}>
            Inicio
          </NavLink>
          <NavLink to="/packages" className={styles.link}>
            Paquetes
          </NavLink>
          <NavLink to="/about" className={styles.link}>
            Nosotros
          </NavLink>
        </div>

        <div className={styles.actions}>
          {!isAuthenticated && (
            <>
              <NavLink to="/login">
                <button className={styles.loginButton}>Ingresar</button>
              </NavLink>
              <NavLink to="/register">
                <button className={styles.registerButton}>Registrarse</button>
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <div className={styles.userMenu}>
              <button className={styles.userButton} onClick={toggleMenu}>
                <FaUserCircle />
                <span>{role === "admin" ? "Admin" : userName}</span>
                <FaChevronDown
                  className={`${styles.arrow} ${isMenuOpen ? styles.arrowOpen : ""}`}
                />
              </button>

              {isMenuOpen && (
                <div className={styles.dropdown}>
                  {role === "user" && (
                    <>
                      <NavLink to="/profile" onClick={closeUserMenu}>
                        <FaUser />
                        Mi Perfil
                      </NavLink>
                      <NavLink to="/reservations" onClick={closeUserMenu}>
                        <FaCalendarAlt />
                        Mis Reservaciones
                      </NavLink>
                      <div className={styles.divider}></div>
                    </>
                  )}

                  {role === "admin" && (
                    <>
                      <NavLink to="/admin" onClick={closeUserMenu}>Dashboard</NavLink>
                      <NavLink to="/admin/layout/paquetes" onClick={closeUserMenu}>Paquetes</NavLink>
                      <NavLink to="/admin/layout/reservaciones" onClick={closeUserMenu}>Reservaciones</NavLink>
                      <div className={styles.divider}></div>
                    </>
                  )}

                  <button type="button" onClick={handleLogout}>
                    <FaSignOutAlt />
                    Cerrar Sesion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      {isMobileMenuOpen && (
        <MobileDrawer
          isAuthenticated={isAuthenticated}
          role={role}
          userName={userName}
          onLogout={handleLogout}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;
