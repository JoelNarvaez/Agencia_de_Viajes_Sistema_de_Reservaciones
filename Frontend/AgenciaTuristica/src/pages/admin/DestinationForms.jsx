import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const mainStyle = {
  flex: 1,
  padding: '32px',
  background: '#f1f5f9',
  minHeight: '100vh',
};

const cardStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '28px',
  maxWidth: '680px',
};

const headingStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0 0 24px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
};

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  color: '#1e293b',
  outline: 'none',
};

const errorStyle = {
  fontSize: '12px',
  color: '#dc2626',
  marginTop: '2px',
};

const fullWidthStyle = {
  ...fieldStyle,
  gridColumn: '1 / -1',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '80px',
};

const btnRowStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '24px',
};

const btnPrimaryStyle = {
  padding: '10px 22px',
  background: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
};

const btnSecondaryStyle = {
  padding: '10px 22px',
  background: '#f1f5f9',
  color: '#475569',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
};

const CATEGORIAS = ['Playa', 'Cultural', 'Aventura', 'Naturaleza', 'Ciudad', 'Montaña'];
const ESTADOS = ['activo', 'inactivo'];

// Mock: simula cargar destino existente para edición
const MOCK_DESTINOS = {
  1: {
    nombre: 'Cancún',
    pais: 'México',
    ciudad: 'Cancún',
    categoria: 'Playa',
    descripcion: 'Hermosas playas de arena blanca y mar turquesa.',
    imagen: '',
    precioBase: '8500',
    estado: 'activo',
  },
};

const INITIAL_FORM = {
  nombre: '',
  pais: '',
  ciudad: '',
  categoria: '',
  descripcion: '',
  imagen: '',
  precioBase: '',
  estado: 'activo',
};

function validate(form) {
  const errors = {};
  if (!form.nombre.trim()) errors.nombre = 'El nombre es requerido.';
  if (!form.pais.trim()) errors.pais = 'El país es requerido.';
  if (!form.ciudad.trim()) errors.ciudad = 'La ciudad es requerida.';
  if (!form.categoria) errors.categoria = 'Selecciona una categoría.';
  if (!form.precioBase || Number(form.precioBase) <= 0)
    errors.precioBase = 'Ingresa un precio válido.';
  return errors;
}

function DestinationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    // Simula fetch del destino a editar
    const timer = setTimeout(() => {
      const data = MOCK_DESTINOS[Number(id)];
      if (data) setForm(data);
      setLoadingData(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // Simula guardado
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/destinos');
    }, 700);
  };

  if (loadingData) {
    return <div style={mainStyle}><p style={{ color: '#64748b' }}>Cargando destino...</p></div>;
  }

  return (
    <div style={mainStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>{isEdit ? 'Editar destino' : 'Nuevo destino'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div style={gridStyle}>
            {/* Nombre */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre *</label>
              <input
                style={inputStyle}
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Cancún"
              />
              {errors.nombre && <span style={errorStyle}>{errors.nombre}</span>}
            </div>

            {/* País */}
            <div style={fieldStyle}>
              <label style={labelStyle}>País *</label>
              <input
                style={inputStyle}
                name="pais"
                value={form.pais}
                onChange={handleChange}
                placeholder="Ej. México"
              />
              {errors.pais && <span style={errorStyle}>{errors.pais}</span>}
            </div>

            {/* Ciudad */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Ciudad *</label>
              <input
                style={inputStyle}
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                placeholder="Ej. Cancún"
              />
              {errors.ciudad && <span style={errorStyle}>{errors.ciudad}</span>}
            </div>

            {/* Categoría */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Categoría *</label>
              <select
                style={inputStyle}
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="">Selecciona...</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.categoria && <span style={errorStyle}>{errors.categoria}</span>}
            </div>

            {/* Precio base */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Precio base (MXN) *</label>
              <input
                style={inputStyle}
                name="precioBase"
                type="number"
                min="0"
                value={form.precioBase}
                onChange={handleChange}
                placeholder="Ej. 8500"
              />
              {errors.precioBase && <span style={errorStyle}>{errors.precioBase}</span>}
            </div>

            {/* Estado */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Estado</label>
              <select
                style={inputStyle}
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Imagen URL */}
            <div style={fullWidthStyle}>
              <label style={labelStyle}>URL de imagen</label>
              <input
                style={inputStyle}
                name="imagen"
                value={form.imagen}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* Descripción */}
            <div style={fullWidthStyle}>
              <label style={labelStyle}>Descripción</label>
              <textarea
                style={textareaStyle}
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe el destino..."
              />
            </div>
          </div>

          <div style={btnRowStyle}>
            <button type="submit" style={btnPrimaryStyle} disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear destino'}
            </button>
            <button
              type="button"
              style={btnSecondaryStyle}
              onClick={() => navigate('/admin/destinos')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DestinationForm;
