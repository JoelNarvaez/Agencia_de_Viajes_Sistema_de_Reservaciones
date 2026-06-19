import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import styles from './form.module.css'

const DESTINOS_MOCK = ['Cancún', 'Roma', 'Los Cabos', 'París', 'Tulum']
const TIPOS_VIAJE   = ['Todo incluido', 'Cultural', 'Aventura', 'Playa', 'Económico', 'Lujo']
const ESTADOS       = ['activo', 'inactivo']

const MOCK_PAQUETE = {
  nombre: 'Cancún Premium', destino: 'Cancún', descripcion: 'Paquete todo incluido en Cancún.',
  tipoViaje: 'Todo incluido', dias: '7', noches: '6', precio: '14500',
  cupos: '20', fechaInicio: '2026-07-15', fechaFin: '2026-07-22', imagen: '', estado: 'activo',
  latitud: '21.1619', longitud: '-86.8515',
}

const INITIAL = {
  nombre: '', destino: '', descripcion: '', tipoViaje: '', dias: '',
  noches: '', precio: '', cupos: '', fechaInicio: '', fechaFin: '', imagen: '', estado: 'activo',
  latitud: '', longitud: '',
}

function validate(f) {
  const e = {}
  if (!f.nombre.trim())                    e.nombre      = 'El nombre es requerido.'
  if (!f.destino)                          e.destino     = 'Selecciona un destino.'
  if (!f.tipoViaje)                        e.tipoViaje   = 'Selecciona el tipo de viaje.'
  if (!f.dias || Number(f.dias) < 1)      e.dias        = 'Ingresa días válidos.'
  if (!f.noches || Number(f.noches) < 0)  e.noches      = 'Ingresa noches válidas.'
  if (!f.precio || Number(f.precio) <= 0) e.precio      = 'Ingresa un precio válido.'
  if (!f.cupos || Number(f.cupos) < 1)    e.cupos       = 'Ingresa cupos válidos.'
  if (!f.fechaInicio)                      e.fechaInicio = 'La fecha de inicio es requerida.'
  if (!f.fechaFin)                         e.fechaFin    = 'La fecha de fin es requerida.'
  if (f.latitud === '' || Number(f.latitud) < -90 || Number(f.latitud) > 90) { e.latitud = 'Latitud inválida.' }
  if (f.longitud === '' || Number(f.longitud) < -180 || Number(f.longitud) > 180) { e.longitud = 'Longitud inválida.' }
  return e
}

function PackageForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm]               = useState(INITIAL)
  const [errors, setErrors]           = useState({})
  const [saving, setSaving]           = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    const t = setTimeout(() => { setForm(MOCK_PAQUETE); setLoadingData(false) }, 400)
    return () => clearTimeout(t)
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    setTimeout(() => { setSaving(false); navigate('/admin/paquetes') }, 700)
  }

  if (loadingData) return <div className={styles.page}><p className={styles.loading}>Cargando paquete...</p></div>

  const SelectField = ({ name, label, options, required }) => (
    <div className={styles.field}>
      <label className={styles.label}>{label}{required ? ' *' : ''}</label>
      <select className={styles.select} name={name} value={form[name]} onChange={handleChange}>
        <option value="">Selecciona...</option>
        {options.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
      </select>
      <div className={styles.errorSlot}>
        {errors[name] && <span className={styles.fieldError}>{errors[name]}</span>}
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.heading}>{isEdit ? 'Editar paquete' : 'Nuevo paquete'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.grid}>
            <div className={styles.field}>
              <Input label="Nombre *" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej. Cancún Premium" error={errors.nombre} />
            </div>
            <SelectField name="destino" label="Destino" options={DESTINOS_MOCK} required />

            <div className={styles.fullWidth}>
              <div className={styles.coordinatesRow}>
                <div className={styles.field}>
                  <Input label="Latitud *" name="latitud" type="number" step="any" value={form.latitud} onChange={handleChange} placeholder="Ej. 21.8853" error={errors.latitud} />
                </div>
                <div className={styles.field}>
                  <Input label="Longitud *" name="longitud" type="number" step="any" value={form.longitud} onChange={handleChange} placeholder="Ej. -102.2916" error={errors.longitud} />
                </div>
              </div>
            </div>

            <SelectField name="tipoViaje" label="Tipo de viaje" options={TIPOS_VIAJE} required />

            <div className={styles.field}>
              <Input label="Precio (MXN) *" name="precio" type="number" value={form.precio} onChange={handleChange} placeholder="Ej. 14500" error={errors.precio} />
            </div>
            <div className={styles.field}>
              <Input label="Duración (días) *" name="dias" type="number" value={form.dias} onChange={handleChange} placeholder="Ej. 7" error={errors.dias} />
            </div>
            <div className={styles.field}>
              <Input label="Duración (noches) *" name="noches" type="number" value={form.noches} onChange={handleChange} placeholder="Ej. 6" error={errors.noches} />
            </div>
            <div className={styles.field}>
              <Input label="Cupos disponibles *" name="cupos" type="number" value={form.cupos} onChange={handleChange} placeholder="Ej. 20" error={errors.cupos} />
            </div>

            <SelectField name="estado" label="Estado" options={ESTADOS} />

            <div className={styles.field}>
              <Input label="Fecha inicio *" name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} error={errors.fechaInicio} />
            </div>
            <div className={styles.field}>
              <Input label="Fecha fin *" name="fechaFin" type="date" value={form.fechaFin} onChange={handleChange} error={errors.fechaFin} />
            </div>

            <div className={styles.fullWidth}>
              <div className={styles.field}>
                <Input label="URL de imagen" name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>

            <div className={styles.fullWidth}>
              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea className={styles.textarea} name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Describe el paquete..." />
              </div>
            </div>
          </div>

          <div className={styles.btnRow}>
            <Button type="submit" variant="primary" text={saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear paquete'} disabled={saving} />
            <Button type="button" variant="dark"    text="Cancelar" onClick={() => navigate('/admin/paquetes')} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default PackageForm