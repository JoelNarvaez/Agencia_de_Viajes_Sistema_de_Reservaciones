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

const badgeRolStyle = (rol) => ({
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  background: rol === 'admin' ? '#ede9fe' : '#e0f2fe',
  color: rol === 'admin' ? '#6d28d9' : '#0369a1',
});

const badgeEstadoStyle = (activo) => ({
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  background: activo ? '#dcfce7' : '#fee2e2',
  color: activo ? '#166534' : '#991b1b',
});

const btnSmStyle = (color) => ({
  padding: '5px 10px',
  background: color === 'red' ? '#fee2e2' : color === 'purple' ? '#ede9fe' : '#f1f5f9',
  color: color === 'red' ? '#b91c1c' : color === 'purple' ? '#6d28d9' : '#475569',
  border: 'none',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  marginRight: '6px',
});

// ── Mock data ───────────────────────────────────────────────────────────────
const MOCK_USUARIOS = [
  { id: 1, nombre: 'Ana García', correo: 'ana@email.com', telefono: '449-111-2222', rol: 'user', activo: true, fechaRegistro: '2025-03-10' },
  { id: 2, nombre: 'Luis Martínez', correo: 'luis@email.com', telefono: '449-333-4444', rol: 'admin', activo: true, fechaRegistro: '2025-01-05' },
  { id: 3, nombre: 'María López', correo: 'maria@email.com', telefono: '449-555-6666', rol: 'user', activo: false, fechaRegistro: '2025-04-20' },
  { id: 4, nombre: 'Carlos Ruiz', correo: 'carlos@email.com', telefono: '449-777-8888', rol: 'user', activo: true, fechaRegistro: '2025-06-01' },
  { id: 5, nombre: 'Sofía Torres', correo: 'sofia@email.com', telefono: '449-999-0000', rol: 'user', activo: true, fechaRegistro: '2025-07-14' },
  { id: 6, nombre: 'Roberto Díaz', correo: 'roberto@email.com', telefono: '449-123-4567', rol: 'user', activo: false, fechaRegistro: '2025-08-30' },
];

function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalUsuario, setModalUsuario] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsuarios(MOCK_USUARIOS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleActivo = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u))
    );
  };

  const cambiarRol = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, rol: u.rol === 'admin' ? 'user' : 'admin' } : u
      )
    );
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'correo', label: 'Correo' },
    { key: 'telefono', label: 'Teléfono' },
    {
      key: 'rol',
      label: 'Rol',
      render: (row) => <span style={badgeRolStyle(row.rol)}>{row.rol}</span>,
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (row) => (
        <span style={badgeEstadoStyle(row.activo)}>{row.activo ? 'Activo' : 'Inactivo'}</span>
      ),
    },
    { key: 'fechaRegistro', label: 'Registro' },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <>
          <button style={btnSmStyle()} onClick={() => setModalUsuario(row)}>
            Ver
          </button>
          <button style={btnSmStyle('red')} onClick={() => toggleActivo(row.id)}>
            {row.activo ? 'Desactivar' : 'Activar'}
          </button>
          <button style={btnSmStyle('purple')} onClick={() => cambiarRol(row.id)}>
            {row.rol === 'admin' ? '→ user' : '→ admin'}
          </button>
        </>
      ),
    },
  ];

  return (
    <div style={mainStyle}>
      <h1 style={headingStyle}>Usuarios</h1>

      <AdminTable
        columns={columns}
        data={usuarios}
        loading={loading}
        emptyMessage="No hay usuarios registrados."
      />

      {/* Modal detalle de usuario */}
      {modalUsuario && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
          }}
          onClick={() => setModalUsuario(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '10px', padding: '28px',
              minWidth: '340px', maxWidth: '440px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 16px', color: '#1e293b' }}>
              Detalle de usuario
            </h3>
            {[
              ['Nombre', modalUsuario.nombre],
              ['Correo', modalUsuario.correo],
              ['Teléfono', modalUsuario.telefono],
              ['Rol', modalUsuario.rol],
              ['Estado', modalUsuario.activo ? 'Activo' : 'Inactivo'],
              ['Fecha de registro', modalUsuario.fechaRegistro],
            ].map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>{key}</span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>{val}</span>
              </div>
            ))}
            <button
              onClick={() => setModalUsuario(null)}
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

export default AdminUsers;
