import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';

const sidebarStyle = {
  width: '220px',
  minHeight: '100vh',
  background: '#1e293b',
  display: 'flex',
  flexDirection: 'column',
  padding: '0',
  flexShrink: 0,
};

const brandStyle = {
  padding: '24px 20px 20px',
  borderBottom: '1px solid #334155',
};

const brandTextStyle = {
  color: '#f8fafc',
  fontSize: '16px',
  fontWeight: '700',
  margin: 0,
};

const brandSubStyle = {
  color: '#94a3b8',
  fontSize: '11px',
  marginTop: '2px',
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '12px 0',
  flex: 1,
};

const navLinkBase = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 20px',
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.15s',
  borderLeft: '3px solid transparent',
};

const navLinkActiveStyle = {
  ...navLinkBase,
  color: '#f8fafc',
  background: '#334155',
  borderLeftColor: '#3b82f6',
};

const logoutBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 20px',
  color: '#f87171',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  width: '100%',
  textAlign: 'left',
  borderTop: '1px solid #334155',
  marginTop: 'auto',
};

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/destinos', label: 'Destinos', icon: '🗺️' },
  { to: '/admin/paquetes', label: 'Paquetes', icon: '📦' },
  { to: '/admin/reservaciones', label: 'Reservaciones', icon: '📋' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
];

function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <aside style={sidebarStyle}>
      <div style={brandStyle}>
        <p style={brandTextStyle}>✈ Agencia</p>
        <p style={brandSubStyle}>Panel Administrador</p>
      </div>

      <nav style={navStyle}>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => (isActive ? navLinkActiveStyle : navLinkBase)}
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <button style={logoutBtnStyle} onClick={handleLogout}>
        <span>🚪</span> Cerrar sesión
      </button>
    </aside>
  );
}

AdminSidebar.propTypes = {
  onLogout: PropTypes.func,
};

AdminSidebar.defaultProps = {
  onLogout: null,
};

export default AdminSidebar;
