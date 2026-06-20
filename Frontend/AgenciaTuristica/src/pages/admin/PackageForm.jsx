import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import styles from './form.module.css'
import { packageService } from '../../services/adminPackageService'
import { toast } from '../../utils/swal'
import useAuth from '../../hooks/useAuth'

const TIPOS_EXPERIENCIA = ['Todo incluido', 'Cultural', 'Aventura', 'Playa', 'Económico', 'Lujo']

const INITIAL = {
  titulo:              '',
  destino:             '',
  descripcion:         '',
  tipo_experiencia:    '',
  dias:                '',
  noches_minimas:      '',
  precio:              '',
  direccion_hospedaje: '',
  latitud:             '',
  longitud:            '',
  imagen_principal:    '',
  activo:              1,
  salida_fecha_inicio: '',
  salida_fecha_fin:    '',
  salida_cupos:        '',
}

function validate(form) {
  const e = {}

  if (!form.titulo.trim())
    e.titulo = 'El nombre es requerido.'
  if (!form.destino.trim())
    e.destino = 'El destino es requerido.'
  if (!form.tipo_experiencia)
    e.tipo_experiencia = 'Selecciona el tipo de experiencia.'
  if (!form.dias || Number(form.dias) < 1)
    e.dias = 'Ingresa una duración en días válida.'
  if (form.noches_minimas === '' || Number(form.noches_minimas) < 0)
    e.noches_minimas = 'Ingresa las noches mínimas.'
  if (!form.precio || Number(form.precio) <= 0)
    e.precio = 'Ingresa un precio válido.'
  if (form.latitud === '' || Number(form.latitud) < -90 || Number(form.latitud) > 90)
    e.latitud = 'Latitud inválida (entre -90 y 90).'
  if (form.longitud === '' || Number(form.longitud) < -180 || Number(form.longitud) > 180)
    e.longitud = 'Longitud inválida (entre -180 y 180).'

  if (!form.salida_fecha_inicio)
    e.salida_fecha_inicio = 'La fecha de inicio es requerida.'
  if (!form.salida_fecha_fin)
    e.salida_fecha_fin = 'La fecha de fin es requerida.'
  if (!form.salida_cupos || Number(form.salida_cupos) < 1)
    e.salida_cupos = 'Ingresa los cupos disponibles.'
  
  if (
    form.salida_fecha_inicio &&
    form.salida_fecha_fin &&
    form.salida_fecha_fin <= form.salida_fecha_inicio
  ) {
    e.salida_fecha_fin = 'La fecha de fin debe ser posterior a la de inicio.'
  } else if (form.salida_fecha_inicio && form.salida_fecha_fin && form.dias) {
    const start = new Date(form.salida_fecha_inicio + 'T00:00:00')
    const end = new Date(form.salida_fecha_fin + 'T00:00:00')
    const diffTime = end - start
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1
    if (diffDays !== Number(form.dias)) {
      e.salida_fecha_fin = `La diferencia de días (${diffDays}) debe coincidir con la duración del paquete (${form.dias} días).`
    }
  }

  return e
}

const FieldError = ({ error }) =>
  error ? <span className={styles.fieldError}>{error}</span> : null

const SelectField = ({ error, label, name, onChange, options, required, value }) => (
  <div className={styles.field}>
    <label className={styles.label}>{label}{required ? ' *' : ''}</label>
    <select
      className={styles.select}
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">Selecciona...</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
    <div className={styles.errorSlot}>
      <FieldError error={error} />
    </div>
  </div>
)

function PackageForm() {
  const { slug }  = useParams()
  const navigate  = useNavigate()
  const { token } = useAuth()
  const isEdit    = Boolean(slug)

  const [form, setForm]               = useState(INITIAL)
  const [errors, setErrors]           = useState({})
  const [saving, setSaving]           = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [paqueteId, setPaqueteId]     = useState(null)
  const [salidaId, setSalidaId]       = useState(null)

  useEffect(() => {
    if (!isEdit) return

    const cargarPaquete = async () => {
      try {
        const paquete = await packageService.getPaqueteBySlug(slug)
        setPaqueteId(paquete.id)

        let salidaInicial = {}
        try {
          const salidas = await packageService.getSalidasByPaquete(paquete.id)
          if (salidas && salidas.length > 0) {
            salidaInicial = salidas[0]
            setSalidaId(salidaInicial.id)
          }
        } catch (err) {
          console.error('[PackageForm] Error al cargar salidas:', err)
        }

        setForm((prev) => ({
          ...prev,
          titulo:              paquete.titulo             ?? '',
          destino:             paquete.destino            ?? '',
          descripcion:         paquete.descripcion        ?? '',
          tipo_experiencia:    paquete.tipo_experiencia   ?? '',
          dias:                paquete.dias               ?? '',
          noches_minimas:      paquete.noches_minimas     ?? '',
          precio:              paquete.precio             ?? '',
          direccion_hospedaje: paquete.direccion_hospedaje ?? '',
          latitud:             paquete.latitud            ?? '',
          longitud:            paquete.longitud           ?? '',
          imagen_principal:    paquete.imagen_principal   ?? '',
          activo:              paquete.activo ?? 1,
          salida_fecha_inicio: salidaInicial.fecha_inicio ? String(salidaInicial.fecha_inicio).slice(0, 10) : '',
          salida_fecha_fin:    salidaInicial.fecha_fin ? String(salidaInicial.fecha_fin).slice(0, 10) : '',
          salida_cupos:        salidaInicial.cupos_totales ?? '',
        }))
      } catch (error) {
        console.error('[PackageForm] Error al cargar paquete:', error)
        toast.error('No se pudo cargar el paquete.')
      } finally {
        setLoadingData(false)
      }
    }

    cargarPaquete()
  }, [slug, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const updated = { ...prev, [name]: value }

      // 1. Si cambia 'dias', calcular automáticamente noches_minimas (dias - 1, min 0)
      if (name === 'dias') {
        const numDias = Number(value)
        if (!isNaN(numDias) && numDias > 0) {
          updated.noches_minimas = String(numDias - 1)
        } else {
          updated.noches_minimas = ''
        }
      }

      // 2. Si cambia 'salida_fecha_inicio', calcular automáticamente salida_fecha_fin
      if (name === 'salida_fecha_inicio' && value && updated.dias) {
        const startDate = new Date(value + 'T00:00:00')
        const daysToAdd = Math.max(0, Number(updated.dias) - 1)
        startDate.setDate(startDate.getDate() + daysToAdd)
        const yyyy = startDate.getFullYear()
        const mm = String(startDate.getMonth() + 1).padStart(2, '0')
        const dd = String(startDate.getDate()).padStart(2, '0')
        updated.salida_fecha_fin = `${yyyy}-${mm}-${dd}`
      }

      return updated
    })

    setErrors((prev) => ({
      ...prev,
      [name]: '',
      ...(name === 'dias' ? { noches_minimas: '' } : {}),
      ...(name === 'salida_fecha_inicio' ? { salida_fecha_fin: '' } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      toast.warning('Revisa los campos marcados en rojo.')
      return
    }

    setSaving(true)

    const paqueteData = {
      titulo:              form.titulo.trim(),
      destino:             form.destino.trim(),
      descripcion:         form.descripcion.trim(),
      tipo_experiencia:    form.tipo_experiencia,
      dias:                Number(form.dias),
      noches_minimas:      Number(form.noches_minimas),
      precio:              Number(form.precio),
      direccion_hospedaje: form.direccion_hospedaje.trim(),
      latitud:             Number(form.latitud),
      longitud:            Number(form.longitud),
      imagen_principal:    form.imagen_principal.trim(),
      activo:              Number(form.activo),
    }

    try {
      if (isEdit) {
        await packageService.updatePaquete(paqueteId, paqueteData, token)
        if (salidaId) {
          const salidaData = {
            fecha_inicio:  form.salida_fecha_inicio,
            fecha_fin:     form.salida_fecha_fin,
            cupos_totales: Number(form.salida_cupos),
            precio:        Number(form.precio),
          }
          await packageService.updateSalida(salidaId, salidaData, token)
        } else if (form.salida_fecha_inicio && form.salida_fecha_fin && form.salida_cupos) {
          const salidaData = {
            paquete_id:    paqueteId,
            fecha_inicio:  form.salida_fecha_inicio,
            fecha_fin:     form.salida_fecha_fin,
            cupos_totales: Number(form.salida_cupos),
            precio:        Number(form.precio),
          }
          await packageService.createSalida(salidaData, token)
        }
        toast.success('Paquete actualizado correctamente.')
      } else {
        const salidaData = {
          fecha_inicio:  form.salida_fecha_inicio,
          fecha_fin:     form.salida_fecha_fin,
          cupos_totales: Number(form.salida_cupos),
          precio:        Number(form.precio),
        }
        await packageService.createPaqueteConSalidas(paqueteData, [salidaData], token)
        toast.success('Paquete creado correctamente.')
      }

      navigate('/admin/layout/paquetes')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loadingData) {
    return <div className={styles.page}><p className={styles.loading}>Cargando paquete...</p></div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.heading}>{isEdit ? 'Editar paquete' : 'Nuevo paquete'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.grid}>

            <div className={styles.field}>
              <Input
                label="Nombre *"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ej. Cancún Premium"
                error={errors.titulo}
              />
            </div>

            <div className={styles.field}>
              <Input
                label="Destino *"
                name="destino"
                value={form.destino}
                onChange={handleChange}
                placeholder="Ej. Cancún, México"
                error={errors.destino}
              />
            </div>

            <SelectField
              name="tipo_experiencia"
              label="Tipo de experiencia"
              options={TIPOS_EXPERIENCIA}
              value={form.tipo_experiencia}
              error={errors.tipo_experiencia}
              onChange={handleChange}
              required
            />

            <div className={styles.field}>
              <Input
                label="Precio por noche (MXN) *"
                name="precio"
                type="number"
                value={form.precio}
                onChange={handleChange}
                placeholder="Ej. 2500"
                error={errors.precio}
              />
            </div>

            <div className={styles.field}>
              <Input
                label="Duración (días) *"
                name="dias"
                type="number"
                value={form.dias}
                onChange={handleChange}
                placeholder="Ej. 7"
                error={errors.dias}
              />
            </div>

            <div className={styles.field}>
              <Input
                label="Noches mínimas *"
                name="noches_minimas"
                type="number"
                value={form.noches_minimas}
                onChange={handleChange}
                placeholder="Ej. 3"
                error={errors.noches_minimas}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Estado</label>
              <select
                className={styles.select}
                name="activo"
                value={form.activo}
                onChange={handleChange}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>

            <div className={styles.fullWidth}>
              <div className={styles.coordinatesRow}>
                <div className={styles.field}>
                  <Input
                    label="Latitud *"
                    name="latitud"
                    type="number"
                    step="any"
                    value={form.latitud}
                    onChange={handleChange}
                    placeholder="Ej. 21.1619"
                    error={errors.latitud}
                  />
                </div>
                <div className={styles.field}>
                  <Input
                    label="Longitud *"
                    name="longitud"
                    type="number"
                    step="any"
                    value={form.longitud}
                    onChange={handleChange}
                    placeholder="Ej. -86.8515"
                    error={errors.longitud}
                  />
                </div>
              </div>
            </div>

            <div className={styles.fullWidth}>
              <div className={styles.field}>
                <Input
                  label="Dirección del hospedaje"
                  name="direccion_hospedaje"
                  value={form.direccion_hospedaje}
                  onChange={handleChange}
                  placeholder="Ej. Hotel Grand Oasis, Blvd. Kukulcán Km 16.5"
                />
              </div>
            </div>

            <div className={styles.fullWidth}>
              <div className={styles.field}>
                <Input
                  label="URL de imagen principal"
                  name="imagen_principal"
                  value={form.imagen_principal}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className={styles.fullWidth}>
              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className={styles.textarea}
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Describe el paquete..."
                />
              </div>
            </div>

            {/* Salida inicial */}
            <div className={styles.fullWidth}>
              <p className={styles.sectionTitle}>Salida inicial</p>
            </div>

            <div className={styles.field}>
              <Input
                label="Fecha de inicio *"
                name="salida_fecha_inicio"
                type="date"
                value={form.salida_fecha_inicio}
                onChange={handleChange}
                error={errors.salida_fecha_inicio}
              />
            </div>

            <div className={styles.field}>
              <Input
                label="Fecha de fin *"
                name="salida_fecha_fin"
                type="date"
                value={form.salida_fecha_fin}
                onChange={handleChange}
                error={errors.salida_fecha_fin}
              />
            </div>

            <div className={styles.field}>
              <Input
                label="Cupos disponibles *"
                name="salida_cupos"
                type="number"
                value={form.salida_cupos}
                onChange={handleChange}
                placeholder="Ej. 20"
                error={errors.salida_cupos}
              />
            </div>
          </div>

          <div className={styles.btnRow}>
            <Button
              type="submit"
              variant="primary"
              text={saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear paquete'}
              disabled={saving}
            />
            <Button
              type="button"
              variant="dark"
              text="Cancelar"
              onClick={() => navigate('/admin/layout/paquetes')}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default PackageForm
