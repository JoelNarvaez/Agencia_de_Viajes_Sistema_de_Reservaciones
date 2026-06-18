import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTable from '../../components/admin/AdminTable';

const mainStyle = {
  flex: 1,
  padding: '32px',
  background: '#f1f5f9',
  minHeight: '100vh',
};

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
};

const headingStyle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1e293b',
  margin: 0,
};

const btnPrimaryStyle = {
  padding: '9px 18px',
  background: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
};

const btnEditStyle = {
  padding: '5px 10px',
  background: '#e0f2fe',
  color: '#0369a1',
  border: 'none',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
};

const btnDangerStyle = {
  padding: '5px 10px',
  background: '#fee2e2',
  color: '#b91c1c',
  border: 'none',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  marginLeft: '6px',
};

const btnToggleStyle = (activo) => ({
  padding: '5px 10px',
  background: activo ? '#f0fdf4' : '#fef9c3',
  color: activo ? '#166534' : '#854d0e',
  border: 'none',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  marginLeft: '6px',
});

const badgeStyle = (activo) => ({
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  background: activo ? '#dcfce7' : '#fee2e2',
  color: activo ? '#166534' : '#991b1b',
});

// ── Mock data ───────────────────────────────────────────────────────────────
const MOCK_PAQUETES = [
  { id: 1, nombre: 'Cancún Premium', destino: 'Cancún', tipo: 'Todo incluido', dias: 7, noches: 6, precio: '$14,500', cupos: 20, fechaInicio: '2026-07-15', activo: true },
  { id: 2, nombre: 'Europa Clásica', destino: 'Roma / París', tipo: 'Cultural', dias: 14, noches: 13, precio: '$52,000', cupos: 15, fechaInicio: '2026-08-01', activo: true },
  { id: 3, nombre: 'Caribe Express', destino: 'Cancún', tipo: 'Económico', dias: 4, noches: 3, precio: '$8,200', cupos: 30, fechaInicio: '2026-07-20', activo: true },
  { id: 4, nombre: 'Los Cabos Relax', destino: 'Los Cabos', tipo: 'Playa', dias: 5, noches: 4, precio: '$11,800', cupos: 10, fechaInicio: '2026-09-05', activo: false },
  { id: 5, nombre: 'Tulum Aventura', destino: 'Tulum', tipo: 'Aventura', dias: 6, noches: 5, precio: '$9,400', cupos: 12, fechaInicio: '2026-10-10', activo: true },
];

function AdminPackages() {
  const navigate = useNavigate();
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaquetes(MOCK_PAQUETES);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleActivo = (id) => {
    setPaquetes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p))
    );
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar este paquete?')) {
      setPaquetes((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'destino', label: 'Destino' },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'duracion',
      label: 'Duración',
      render: (row) => `${row.dias}d / ${row.noches}n`,
    },
    { key: 'precio', label: 'Precio' },
    { key: 'cupos', label: 'Cupos' },
    { key: 'fechaInicio', label: 'Fecha inicio' },
    {
      key: 'activo',
      label: 'Estado',
      render: (row) => (
        <span style={badgeStyle(row.activo)}>{row.activo ? 'Activo' : 'Inactivo'}</span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <>
          <button style={btnEditStyle} onClick={() => navigate(`/admin/paquetes/editar/${row.id}`)}>
            Editar
          </button>
          <button style={btnToggleStyle(row.activo)} onClick={() => handleToggleActivo(row.id)}>
            {row.activo ? 'Desactivar' : 'Activar'}
          </button>
          <button style={btnDangerStyle} onClick={() => handleEliminar(row.id)}>
            Eliminar
          </button>
        </>
      ),
    },
  ];

  return (
    <div style={mainStyle}>
      <div style={headerRowStyle}>
        <h1 style={headingStyle}>Paquetes</h1>
        <button style={btnPrimaryStyle} onClick={() => navigate('/admin/paquetes/nuevo')}>
          + Nuevo paquete
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={paquetes}
        loading={loading}
        emptyMessage="No hay paquetes registrados."
      />
    </div>
  );
}

export default AdminPackages;
