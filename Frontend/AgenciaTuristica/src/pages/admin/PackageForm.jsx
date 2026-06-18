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
  maxWidth: '760px',
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

const fullWidthStyle = {
  ...fieldStyle,
  gridColumn: '1 / -1',
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

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '80px',
};

const errorStyle = {
  fontSize: '12px',
  color: '#dc2626',
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

// Mock destinos disponibles para el selector
const MOCK_DESTINOS = ['Cancún', 'Roma', 'Los Cabos', 'París', 'Tulum'];
const TIPOS_VIAJE = ['Todo incluido', 'Cultural', 'Aventura', 'Playa', 'Económico', 'Lujo'];
const ESTADOS = ['activo', 'inactivo'];

// Mock de paquete existente para edición
const MOCK_PAQUETES = {
  1: {
    nombre: 'Cancún Premium',
    destino: 'Cancún',
    descripcion: 'Paquete todo incluido en Cancún.',
    tipoViaje: 'Todo incluido',
    dias: '7',
    noches: '6',
    precio: '14500',
    cupos: '20',
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-22',
    imagen: '',
    estado: 'activo',
  },
};

const INITIAL_FORM = {
  nombre: '',
  destino: '',
  descripcion: '',
  tipoViaje: '',
  dias: '',
  noches: '',
  precio: '',
  cupos: '',
  fechaInicio: '',
  fechaFin: '',
  imagen: '',
  estado: 'activo',
};

function validate(form) {
  const errors = {};
  if (!form.nombre.trim()) errors.nombre = 'El nombre es requerido.';
  if (!form.destino) errors.destino = 'Selecciona un destino.';
  if (!form.tipoViaje) errors.tipoViaje = 'Selecciona el tipo de viaje.';
  if (!form.dias || Number(form.dias) < 1) errors.dias = 'Ingresa días válidos.';
  if (!form.noches || Number(form.noches) < 0) errors.noches = 'Ingresa noches válidas.';
  if (!form.precio || Number(form.precio) <= 0) errors.precio = 'Ingresa un precio válido.';
  if (!form.cupos || Number(form.cupos) < 1) errors.cupos = 'Ingresa cupos válidos.';
  if (!form.fechaInicio) errors.fechaInicio = 'La fecha de inicio es requerida.';
  if (!form.fechaFin) errors.fechaFin = 'La fecha de fin es requerida.';
  return errors;
}

function PackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const timer = setTimeout(() => {
      const data = MOCK_PAQUETES[Number(id)];
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
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/paquetes');
    }, 700);
  };

  if (loadingData) {
    return <div style={mainStyle}><p style={{ color: '#64748b' }}>Cargando paquete...</p></div>;
  }

  return (
    <div style={mainStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>{isEdit ? 'Editar paquete' : 'Nuevo paquete'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div style={gridStyle}>

            {/* Nombre */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre *</label>
              <input style={inputStyle} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej. Cancún Premium" />
              {errors.nombre && <span style={errorStyle}>{errors.nombre}</span>}
            </div>

            {/* Destino */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Destino *</label>
              <select style={inputStyle} name="destino" value={form.destino} onChange={handleChange}>
                <option value="">Selecciona...</option>
                {MOCK_DESTINOS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.destino && <span style={errorStyle}>{errors.destino}</span>}
            </div>

            {/* Tipo de viaje */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Tipo de viaje *</label>
              <select style={inputStyle} name="tipoViaje" value={form.tipoViaje} onChange={handleChange}>
                <option value="">Selecciona...</option>
                {TIPOS_VIAJE.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.tipoViaje && <span style={errorStyle}>{errors.tipoViaje}</span>}
            </div>

            {/* Precio */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Precio (MXN) *</label>
              <input style={inputStyle} name="precio" type="number" min="0" value={form.precio} onChange={handleChange} placeholder="Ej. 14500" />
              {errors.precio && <span style={errorStyle}>{errors.precio}</span>}
            </div>

            {/* Días */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Duración (días) *</label>
              <input style={inputStyle} name="dias" type="number" min="1" value={form.dias} onChange={handleChange} placeholder="Ej. 7" />
              {errors.dias && <span style={errorStyle}>{errors.dias}</span>}
            </div>

            {/* Noches */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Duración (noches) *</label>
              <input style={inputStyle} name="noches" type="number" min="0" value={form.noches} onChange={handleChange} placeholder="Ej. 6" />
              {errors.noches && <span style={errorStyle}>{errors.noches}</span>}
            </div>

            {/* Cupos */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Cupos disponibles *</label>
              <input style={inputStyle} name="cupos" type="number" min="1" value={form.cupos} onChange={handleChange} placeholder="Ej. 20" />
              {errors.cupos && <span style={errorStyle}>{errors.cupos}</span>}
            </div>

            {/* Estado */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Estado</label>
              <select style={inputStyle} name="estado" value={form.estado} onChange={handleChange}>
                {ESTADOS.map((e) => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
              </select>
            </div>

            {/* Fecha inicio */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Fecha inicio *</label>
              <input style={inputStyle} name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} />
              {errors.fechaInicio && <span style={errorStyle}>{errors.fechaInicio}</span>}
            </div>

            {/* Fecha fin */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Fecha fin *</label>
              <input style={inputStyle} name="fechaFin" type="date" value={form.fechaFin} onChange={handleChange} />
              {errors.fechaFin && <span style={errorStyle}>{errors.fechaFin}</span>}
            </div>

            {/* Imagen URL */}
            <div style={fullWidthStyle}>
              <label style={labelStyle}>URL de imagen</label>
              <input style={inputStyle} name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." />
            </div>

            {/* Descripción */}
            <div style={fullWidthStyle}>
              <label style={labelStyle}>Descripción</label>
              <textarea style={textareaStyle} name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Describe el paquete..." />
            </div>
          </div>

          <div style={btnRowStyle}>
            <button type="submit" style={btnPrimaryStyle} disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear paquete'}
            </button>
            <button type="button" style={btnSecondaryStyle} onClick={() => navigate('/admin/paquetes')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PackageForm;
