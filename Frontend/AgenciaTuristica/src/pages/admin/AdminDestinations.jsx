import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTable from '../../components/admin/AdminTable';

const mainStyle = {
  flex: 1,
  padding: '32px',
  background: '#f1f5f9',
  minHeight: '100vh',
  overflowY: 'auto',
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
const MOCK_DESTINOS = [
  { id: 1, nombre: 'Cancún', pais: 'México', ciudad: 'Cancún', categoria: 'Playa', precioBase: '$8,500', activo: true },
  { id: 2, nombre: 'Roma', pais: 'Italia', ciudad: 'Roma', categoria: 'Cultural', precioBase: '$22,000', activo: true },
  { id: 3, nombre: 'Los Cabos', pais: 'México', ciudad: 'Los Cabos', categoria: 'Playa', precioBase: '$10,200', activo: true },
  { id: 4, nombre: 'París', pais: 'Francia', ciudad: 'París', categoria: 'Cultural', precioBase: '$28,000', activo: false },
  { id: 5, nombre: 'Tulum', pais: 'México', ciudad: 'Tulum', categoria: 'Aventura', precioBase: '$6,800', activo: true },
];

function AdminDestinations() {
  const navigate = useNavigate();
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDestinos(MOCK_DESTINOS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleActivo = (id) => {
    setDestinos((prev) =>
      prev.map((d) => (d.id === id ? { ...d, activo: !d.activo } : d))
    );
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar este destino?')) {
      setDestinos((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'pais', label: 'País' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'precioBase', label: 'Precio base' },
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
          <button
            style={btnEditStyle}
            onClick={() => navigate(`/admin/destinos/editar/${row.id}`)}
          >
            Editar
          </button>
          <button
            style={btnToggleStyle(row.activo)}
            onClick={() => handleToggleActivo(row.id)}
          >
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
        <h1 style={headingStyle}>Destinos</h1>
        <button
          style={btnPrimaryStyle}
          onClick={() => navigate('/admin/destinos/nuevo')}
        >
          + Nuevo destino
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={destinos}
        loading={loading}
        emptyMessage="No hay destinos registrados."
      />
    </div>
  );
}

export default AdminDestinations;
