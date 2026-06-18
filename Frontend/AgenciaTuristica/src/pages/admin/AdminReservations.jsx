import { useState, useEffect } from 'react';
import AdminTable from '../../components/admin/AdminTable';

const mainStyle = {
  flex: 1,
  padding: '32px',
  background: '#f1f5f9',
  minHeight: '100vh',
};

const headingStyle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0 0 24px',
};

const filterRowStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '16px',
  flexWrap: 'wrap',
};

const selectStyle = {
  padding: '7px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  color: '#374151',
  background: '#fff',
};

const badgeStyle = (estado) => {
  const map = {
    Confirmada: { bg: '#dcfce7', color: '#166534' },
    Pendiente: { bg: '#fef9c3', color: '#854d0e' },
    Cancelada: { bg: '#fee2e2', color: '#991b1b' },
    Pagada: { bg: '#dbeafe', color: '#1e40af' },
  };
  const s = map[estado] || { bg: '#f1f5f9', color: '#475569' };
  return {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    background: s.bg,
    color: s.color,
  };
};

const btnSmStyle = (color) => ({
  padding: '4px 9px',
  background: color === 'green' ? '#f0fdf4' : color === 'red' ? '#fee2e2' : color === 'blue' ? '#dbeafe' : '#f8fafc',
  color: color === 'green' ? '#166534' : color === 'red' ? '#b91c1c' : color === 'blue' ? '#1e40af' : '#475569',
  border: 'none',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer',
  marginRight: '4px',
  marginBottom: '2px',
});

// ── Mock data ───────────────────────────────────────────────────────────────
const MOCK_RESERVACIONES = [
  { id: 1, usuario: 'Ana García', paquete: 'Cancún Premium', destino: 'Cancún', fecha: '2026-07-15', personas: 2, total: '$29,600', estado: 'Confirmada' },
  { id: 2, usuario: 'Luis Martínez', paquete: 'Europa Clásica', destino: 'Roma / París', fecha: '2026-08-01', personas: 1, total: '$52,000', estado: 'Pendiente' },
  { id: 3, usuario: 'María López', paquete: 'Caribe Express', destino: 'Cancún', fecha: '2026-07-20', personas: 3, total: '$24,600', estado: 'Pagada' },
  { id: 4, usuario: 'Carlos Ruiz', paquete: 'Los Cabos Relax', destino: 'Los Cabos', fecha: '2026-07-28', personas: 2, total: '$23,600', estado: 'Pendiente' },
  { id: 5, usuario: 'Sofía Torres', paquete: 'Roma & Florencia', destino: 'Roma', fecha: '2026-09-10', personas: 2, total: '$61,200', estado: 'Cancelada' },
  { id: 6, usuario: 'Roberto Díaz', paquete: 'Tulum Aventura', destino: 'Tulum', fecha: '2026-10-10', personas: 4, total: '$37,600', estado: 'Confirmada' },
];

const ESTADOS = ['Todos', 'Pendiente', 'Confirmada', 'Pagada', 'Cancelada'];

function AdminReservations() {
  const [reservaciones, setReservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [modalDetalle, setModalDetalle] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReservaciones(MOCK_RESERVACIONES);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const cambiarEstado = (id, nuevoEstado) => {
    setReservaciones((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
    );
  };

  const datosFiltrados = filtroEstado === 'Todos'
    ? reservaciones
    : reservaciones.filter((r) => r.estado === filtroEstado);

  const columns = [
    { key: 'id', label: '#' },
    { key: 'usuario', label: 'Usuario' },
    { key: 'paquete', label: 'Paquete' },
    { key: 'destino', label: 'Destino' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'personas', label: 'Personas' },
    { key: 'total', label: 'Total' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <span style={badgeStyle(row.estado)}>{row.estado}</span>,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          {row.estado === 'Pendiente' && (
            <button style={btnSmStyle('green')} onClick={() => cambiarEstado(row.id, 'Confirmada')}>
              Confirmar
            </button>
          )}
          {(row.estado === 'Pendiente' || row.estado === 'Confirmada') && (
            <button style={btnSmStyle('red')} onClick={() => cambiarEstado(row.id, 'Cancelada')}>
              Cancelar
            </button>
          )}
          {row.estado === 'Confirmada' && (
            <button style={btnSmStyle('blue')} onClick={() => cambiarEstado(row.id, 'Pagada')}>
              Marcar pagada
            </button>
          )}
          <button style={btnSmStyle()} onClick={() => setModalDetalle(row)}>
            Ver detalle
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={mainStyle}>
      <h1 style={headingStyle}>Reservaciones</h1>

      {/* Filtro por estado */}
      <div style={filterRowStyle}>
        <label style={{ fontSize: '14px', color: '#475569', alignSelf: 'center' }}>
          Filtrar por estado:
        </label>
        <select
          style={selectStyle}
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={datosFiltrados}
        loading={loading}
        emptyMessage="No hay reservaciones con este estado."
      />

      {/* Modal detalle */}
      {modalDetalle && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
          }}
          onClick={() => setModalDetalle(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '10px', padding: '28px',
              minWidth: '340px', maxWidth: '480px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 16px', color: '#1e293b' }}>
              Detalle de reservación #{modalDetalle.id}
            </h3>
            {[
              ['Usuario', modalDetalle.usuario],
              ['Paquete', modalDetalle.paquete],
              ['Destino', modalDetalle.destino],
              ['Fecha', modalDetalle.fecha],
              ['Personas', modalDetalle.personas],
              ['Total', modalDetalle.total],
              ['Estado', modalDetalle.estado],
            ].map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>{key}</span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>{val}</span>
              </div>
            ))}
            <button
              onClick={() => setModalDetalle(null)}
              style={{
                marginTop: '12px', width: '100%', padding: '9px',
                background: '#f1f5f9', border: 'none', borderRadius: '6px',
                cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#475569',
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReservations;
