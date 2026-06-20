import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaSignOutAlt,
  FaPlane,
  FaTachometerAlt,
} from '../../icons/fa'
import { confirmarCerrarSesion } from '../../utils/swal'
import styles from './AdminSideBar.module.css'

const NAV_ITEMS = [
  { to: '/admin/layout/metricas',      label: 'Metricas',      Icon: FaTachometerAlt },
  { to: '/admin/layout/paquetes',      label: 'Paquetes',      Icon: FaBoxOpen     },
  { to: '/admin/layout/reservaciones', label: 'Reservaciones', Icon: FaCalendarAlt },
]

function AdminSideBar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    const confirmado = await confirmarCerrarSesion()
    if (!confirmado) return

    logout()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>
          <FaPlane />
        </span>
        <div>
          <p className={styles.brandName}>NovaTrips</p>
          <p className={styles.brandSub}>Panel Admin</p>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
          >
            <Icon className={styles.icon} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        <FaSignOutAlt className={styles.icon} />
        Cerrar sesión
      </button>
    </aside>
  )
}

export default AdminSideBar
