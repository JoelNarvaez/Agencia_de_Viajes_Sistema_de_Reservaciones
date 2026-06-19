import { useState, useEffect } from 'react'
import AdminTable from '../../components/admin/AdminTable'
import Button from '../../components/common/Button'
import useAuth from '../../hooks/useAuth'
import { adminReservationService, ESTADOS_RESERVACION } from '../../services/adminReservationService'
import { toast, confirmarEstado, pedirMotivoCancel } from '../../utils/swal'
import styles from './admin.module.css'

const ESTADOS_FILTRO = ['todos', ...ESTADOS_RESERVACION]

const ESTADO_LABEL = {
  pendiente:  'Pendiente',
  confirmada: 'Confirmada',
  cancelada:  'Cancelada',
  pagada:     'Pagada',
  todos:      'Todos',
}

const BADGE_MAP = {
  confirmada: styles.badgeConfirmed,
  pendiente:  styles.badgePending,
  pagada:     styles.badgePaid,
  cancelada:  styles.badgeCancelled,
}

const formatFecha = (iso) => (iso ? new Date(iso).toLocaleDateString('es-MX') : '—')
const formatMonto = (monto) => `$${Number(monto ?? 0).toLocaleString('es-MX')}`

function AdminReservations() {
  const { token } = useAuth()

  const [reservaciones, setReservaciones] = useState([])
  const [loading, setLoading]             = useState(true)
  const [filtro, setFiltro]               = useState('todos')
  const [modal, setModal]                 = useState(null)
  const [modalLoading, setModalLoading]   = useState(false)
  const [pageError, setPageError]         = useState('')

  const cargarReservaciones = async (estadoFiltro) => {
    setLoading(true)
    setPageError('')
    try {
      const estadoParam = estadoFiltro === 'todos' ? undefined : estadoFiltro
      const data = await adminReservationService.getReservaciones(token, estadoParam)
      setReservaciones(data.reservaciones ?? [])
    } catch (err) {
      setPageError(err.message)
      toast.error('No se pudieron cargar las reservaciones.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarReservaciones(filtro)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro])

  const cambiarEstado = async (id, nuevoEstado) => {
    // Cancelación: pedir motivo con SweetAlert2
    if (nuevoEstado === 'cancelada') {
      const motivo = await pedirMotivoCancel()
      // null significa que el usuario cerró el diálogo sin confirmar
      if (motivo === null) return

      try {
        await adminReservationService.cambiarEstadoReservacion(id, nuevoEstado, token, motivo)
        setReservaciones((prev) =>
          prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
        )
        toast.success('Reservación cancelada.')
      } catch (err) {
        toast.error(err.message)
      }
      return
    }

    // Confirmar / marcar pagada: pedir confirmación
    const confirmado = await confirmarEstado(nuevoEstado)
    if (!confirmado) return

    try {
      await adminReservationService.cambiarEstadoReservacion(id, nuevoEstado, token)
      setReservaciones((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
      )
      const mensajes = {
        confirmada: 'Reservación confirmada.',
        pagada:     'Reservación marcada como pagada.',
      }
      toast.success(mensajes[nuevoEstado] ?? 'Estado actualizado.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const verDetalle = async (row) => {
    setModal({ id: row.id })
    setModalLoading(true)
    try {
      const data = await adminReservationService.getReservacionDetalle(row.id, token)
      setModal(data.reservacion)
    } catch (err) {
      toast.error(err.message)
      setModal(null)
    } finally {
      setModalLoading(false)
    }
  }

  const columns = [
    { key: 'id', label: '#' },
    {
      key: 'usuario', label: 'Usuario',
      render: (row) => `${row.nombre ?? ''} ${row.apellido ?? ''}`.trim() || '—',
    },
    { key: 'paquete_titulo', label: 'Paquete' },
    { key: 'destino',        label: 'Destino' },
    {
      key: 'fechas', label: 'Fechas',
      render: (row) => `${formatFecha(row.fecha_llegada)} → ${formatFecha(row.fecha_salida)}`,
    },
    { key: 'total_huespedes', label: 'Huéspedes' },
    {
      key: 'monto_total', label: 'Total',
      render: (row) => formatMonto(row.monto_total),
    },
    {
      key: 'estado', label: 'Estado',
      render: (row) => (
        <span className={`${styles.badge} ${BADGE_MAP[row.estado] ?? ''}`}>
          {ESTADO_LABEL[row.estado] ?? row.estado}
        </span>
      ),
    },
    {
      key: 'acciones', label: 'Acciones',
      render: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          {row.estado === 'pendiente' && (
            <button
              className={`${styles.actionBtn} ${styles.btnConfirm}`}
              onClick={() => cambiarEstado(row.id, 'confirmada')}
            >
              Confirmar
            </button>
          )}
          {(row.estado === 'pendiente' || row.estado === 'confirmada') && (
            <button
              className={`${styles.actionBtn} ${styles.btnCancel}`}
              onClick={() => cambiarEstado(row.id, 'cancelada')}
            >
              Cancelar
            </button>
          )}
          {row.estado === 'confirmada' && (
            <button
              className={`${styles.actionBtn} ${styles.btnPay}`}
              onClick={() => cambiarEstado(row.id, 'pagada')}
            >
              Marcar pagada
            </button>
          )}
          <button
            className={`${styles.actionBtn} ${styles.btnView}`}
            onClick={() => verDetalle(row)}
          >
            Ver detalle
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Reservaciones</h1>
          <p className={styles.subheading}>{reservaciones.length} reservaciones en total</p>
        </div>
      </div>

      {pageError && <p className={styles.formError}>{pageError}</p>}

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Filtrar por estado:</span>
        <select
          className={styles.filterSelect}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          {ESTADOS_FILTRO.map((e) => (
            <option key={e} value={e}>{ESTADO_LABEL[e]}</option>
          ))}
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={reservaciones}
        loading={loading}
        emptyMessage="No hay reservaciones con este estado."
      />

      {/* Modal detalle */}
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Reservación #{modal.id}</h3>

            {modalLoading ? (
              <p className={styles.subheading}>Cargando detalle...</p>
            ) : (
              <>
                {[
                  ['Usuario',    `${modal.nombre ?? ''} ${modal.apellido ?? ''}`.trim()],
                  ['Correo',     modal.email],
                  ['Teléfono',   modal.telefono],
                  ['Paquete',    modal.paquete_titulo],
                  ['Destino',    modal.destino],
                  ['Llegada',    formatFecha(modal.fecha_llegada)],
                  ['Salida',     formatFecha(modal.fecha_salida)],
                  ['Adultos',    modal.adultos],
                  ['Niños',      modal.ninos],
                  ['Bebés',      modal.bebes],
                  ['Total huéspedes', modal.total_huespedes],
                  ['Monto total', formatMonto(modal.monto_total)],
                  ['Estado',     ESTADO_LABEL[modal.estado] ?? modal.estado],
                  ...(modal.motivo_cancelacion
                    ? [['Motivo cancelación', modal.motivo_cancelacion]]
                    : []),
                  ...(modal.salida_fecha_inicio
                    ? [['Salida (inicio)', formatFecha(modal.salida_fecha_inicio)]]
                    : []),
                  ...(modal.salida_fecha_fin
                    ? [['Salida (fin)', formatFecha(modal.salida_fecha_fin)]]
                    : []),
                ]
                  .filter(([, v]) => v !== undefined && v !== null && v !== '')
                  .map(([k, v]) => (
                    <div key={k} className={styles.modalRow}>
                      <span className={styles.modalKey}>{k}</span>
                      <span className={styles.modalVal}>{v}</span>
                    </div>
                  ))}
              </>
            )}

            <div style={{ marginTop: '20px' }}>
              <Button text="Cerrar" variant="dark" onClick={() => setModal(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReservations