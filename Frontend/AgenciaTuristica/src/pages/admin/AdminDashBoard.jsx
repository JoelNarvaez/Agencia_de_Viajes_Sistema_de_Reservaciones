import { useState, useEffect } from 'react';
import AdminCard from '../../components/admin/AdminCard';

// ── Layout del panel admin ──────────────────────────────────────────────────
const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
  background: '#f1f5f9',
};

const mainStyle = {
  flex: 1,
  padding: '32px',
  overflowY: 'auto',
};

const headingStyle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0 0 4px',
};

const subheadingStyle = {
  fontSize: '14px',
  color: '#64748b',
  margin: '0 0 28px',
};

const cardsGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  marginBottom: '32px',
};

const sectionTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1e293b',
  margin: '0 0 12px',
};

const tableCardStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
};

const thStyle = {
  padding: '8px 12px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '600',
  color: '#64748b',
  textTransform: 'uppercase',
  borderBottom: '1px solid #e2e8f0',
};

const tdStyle = {
  padding: '10px 12px',
  color: '#374151',
  borderBottom: '1px solid #f1f5f9',
};

const badgeStyle = (estado) => ({
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  background:
    estado === 'Confirmada'
      ? '#dcfce7'
      : estado === 'Pendiente'
        ? '#fef9c3'
        : '#fee2e2',
  color:
    estado === 'Confirmada'
      ? '#166534'
      : estado === 'Pendiente'
        ? '#854d0e'
        : '#991b1b',
});

// ── Mock data ───────────────────────────────────────────────────────────────
const MOCK_STATS = {
  totalUsuarios: 125,
  totalDestinos: 18,
  totalPaquetes: 34,
  totalReservas: 210,
  reservasPendientes: 8,
  ingresoSimulado: '$248,500',
};

const MOCK_RESERVAS_RECIENTES = [
  { id: 1, usuario: 'Ana García', paquete: 'Cancún Premium', fecha: '2026-07-15', total: '$29,600', estado: 'Confirmada' },
  { id: 2, usuario: 'Luis Martínez', paquete: 'Europa Clásica', fecha: '2026-08-01', total: '$52,000', estado: 'Pendiente' },
  { id: 3, usuario: 'María López', paquete: 'Caribe Express', fecha: '2026-07-20', total: '$18,400', estado: 'Confirmada' },
  { id: 4, usuario: 'Carlos Ruiz', paquete: 'Los Cabos Relax', fecha: '2026-07-28', total: '$14,800', estado: 'Pendiente' },
  { id: 5, usuario: 'Sofía Torres', paquete: 'Roma & Florencia', fecha: '2026-09-10', total: '$61,200', estado: 'Cancelada' },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reservasRecientes, setReservasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula llamada a la API
    const timer = setTimeout(() => {
      setStats(MOCK_STATS);
      setReservasRecientes(MOCK_RESERVAS_RECIENTES);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={mainStyle}>
        <p style={{ color: '#64748b' }}>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div style={mainStyle}>
      <h1 style={headingStyle}>Dashboard</h1>
      <p style={subheadingStyle}>Resumen general de la agencia</p>

      {/* Tarjetas de estadísticas */}
      <div style={cardsGridStyle}>
        <AdminCard label="Total usuarios" value={stats.totalUsuarios} icon="👥" />
        <AdminCard label="Destinos" value={stats.totalDestinos} icon="🗺️" />
        <AdminCard label="Paquetes" value={stats.totalPaquetes} icon="📦" />
        <AdminCard label="Reservas totales" value={stats.totalReservas} icon="📋" />
        <AdminCard label="Reservas pendientes" value={stats.reservasPendientes} icon="⏳" />
        <AdminCard label="Ingresos simulados" value={stats.ingresoSimulado} icon="💰" />
      </div>

      {/* Tabla de reservas recientes */}
      <div style={tableCardStyle}>
        <p style={sectionTitleStyle}>Reservas recientes</p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Usuario</th>
              <th style={thStyle}>Paquete</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservasRecientes.map((r) => (
              <tr key={r.id}>
                <td style={tdStyle}>{r.id}</td>
                <td style={tdStyle}>{r.usuario}</td>
                <td style={tdStyle}>{r.paquete}</td>
                <td style={tdStyle}>{r.fecha}</td>
                <td style={tdStyle}>{r.total}</td>
                <td style={tdStyle}>
                  <span style={badgeStyle(r.estado)}>{r.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
