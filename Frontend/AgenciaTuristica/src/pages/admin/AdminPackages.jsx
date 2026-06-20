import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminTable from '../../components/admin/AdminTable'
import Button from '../../components/common/Button'
import useAuth from '../../hooks/useAuth'
import { packageService } from '../../services/adminPackageService'
import { toast, confirmarEliminar, confirmarToggle } from '../../utils/swal'
import styles from './admin.module.css'

function AdminPackages() {
  const navigate = useNavigate()
  const { token } = useAuth()

  const [paquetes, setPaquetes]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [pageError, setPageError] = useState('')

  const cargarPaquetes = async () => {
    setLoading(true)
    setPageError('')
    try {
      const data = await packageService.getPaquetes(token)
      setPaquetes(Array.isArray(data) ? data : [])
    } catch (err) {
      setPageError(err.message)
      toast.error('No se pudieron cargar los paquetes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      cargarPaquetes()
    }
  }, [token])

  const toggleActivo = async (paquete) => {
    const confirmado = await confirmarToggle(paquete.titulo, paquete.activo)
    if (!confirmado) return

    const nuevoValor = paquete.activo ? 0 : 1

    // Enviamos el payload completo porque actualizarPaqueteModel hace UPDATE de todos los campos
    const payload = {
      titulo:              paquete.titulo,
      destino:             paquete.destino,
      descripcion:         paquete.descripcion,
      tipo_experiencia:    paquete.tipo_experiencia,
      dias:                paquete.dias,
      noches_minimas:      paquete.noches_minimas,
      precio:              paquete.precio,
      direccion_hospedaje: paquete.direccion_hospedaje ?? '',
      latitud:             paquete.latitud,
      longitud:            paquete.longitud,
      imagen_principal:    paquete.imagen_principal,
      activo:              nuevoValor,
    }

    try {
      await packageService.updatePaquete(paquete.id, payload, token)
      setPaquetes((prev) =>
        prev.map((p) => (p.id === paquete.id ? { ...p, activo: nuevoValor } : p))
      )
      toast.success(nuevoValor ? 'Paquete activado.' : 'Paquete desactivado.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const eliminar = async (paquete) => {
    const confirmado = await confirmarEliminar(paquete.titulo)
    if (!confirmado) return

    try {
      await packageService.deletePaquete(paquete.id, token)
      setPaquetes((prev) => prev.filter((p) => p.id !== paquete.id))
      toast.success('Paquete eliminado correctamente.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const columns = [
    { key: 'titulo',           label: 'Nombre'  },
    { key: 'destino',          label: 'Destino' },
    { key: 'tipo_experiencia', label: 'Tipo'    },
    {
      key: 'duracion', label: 'Duración',
      render: (r) => `${r.dias ?? '—'}d · mín. ${r.noches_minimas ?? '—'}n`,
    },
    {
      key: 'precio', label: 'Precio',
      render: (r) => `$${Number(r.precio).toLocaleString('es-MX')}`,
    },
    {
      key: 'activo', label: 'Estado',
      render: (row) => (
        <span className={`${styles.badge} ${row.activo ? styles.badgeActive : styles.badgeInactive}`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'acciones', label: 'Acciones',
      render: (row) => (
        <>
          <button
            className={`${styles.actionBtn} ${styles.btnEdit}`}
            onClick={() => navigate(`/admin/layout/paquetes/editar/${row.slug}`)}
          >
            Editar
          </button>
          <button
            className={`${styles.actionBtn} ${styles.btnToggle}`}
            onClick={() => toggleActivo(row)}
          >
            {row.activo ? 'Desactivar' : 'Activar'}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.btnDelete}`}
            onClick={() => eliminar(row)}
          >
            Eliminar
          </button>
        </>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Paquetes</h1>
          <p className={styles.subheading}>{paquetes.length} paquetes registrados</p>
        </div>
        <Button
          text="+ Nuevo paquete"
          variant="primary"
          onClick={() => navigate('/admin/layout/paquetes/nuevo')}
        />
      </div>

      {pageError && <p className={styles.formError}>{pageError}</p>}

      <AdminTable
        columns={columns}
        data={paquetes}
        loading={loading}
        emptyMessage="No hay paquetes registrados."
      />
    </div>
  )
}

export default AdminPackages
