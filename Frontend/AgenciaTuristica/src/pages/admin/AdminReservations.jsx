import { useState, useEffect } from 'react'
import AdminTable from '../../components/admin/AdminTable'
import Button from '../../components/common/Button'
import styles from './admin.module.css'

const MOCK_RESERVACIONES = [
  { id: 1, usuario: 'Ana García',    paquete: 'Cancún Premium',   destino: 'Cancún',      fecha: '2026-07-15', personas: 2, total: '$29,600', estado: 'Confirmada' },
  { id: 2, usuario: 'Luis Martínez', paquete: 'Europa Clásica',   destino: 'Roma / París', fecha: '2026-08-01', personas: 1, total: '$52,000', estado: 'Pendiente'  },
  { id: 3, usuario: 'María López',   paquete: 'Caribe Express',   destino: 'Cancún',      fecha: '2026-07-20', personas: 3, total: '$24,600', estado: 'Pagada'     },
  { id: 4, usuario: 'Carlos Ruiz',   paquete: 'Los Cabos Relax',  destino: 'Los Cabos',   fecha: '2026-07-28', personas: 2, total: '$23,600', estado: 'Pendiente'  },
  { id: 5, usuario: 'Sofía Torres',  paquete: 'Roma & Florencia', destino: 'Roma',        fecha: '2026-09-10', personas: 2, total: '$61,200', estado: 'Cancelada'  },
  { id: 6, usuario: 'Roberto Díaz',  paquete: 'Tulum Aventura',   destino: 'Tulum',       fecha: '2026-10-10', personas: 4, total: '$37,600', estado: 'Confirmada' },
]

const ESTADOS_FILTRO = ['Todos', 'Pendiente', 'Confirmada', 'Pagada', 'Cancelada']

const BADGE_MAP = {
  Confirmada: styles.badgeConfirmed,
  Pendiente:  styles.badgePending,
  Pagada:     styles.badgePaid,
  Cancelada:  styles.badgeCancelled,
}

function AdminReservations() {
  const [reservaciones, setReservaciones] = useState([])
  const [loading, setLoading]             = useState(true)
  const [filtro, setFiltro]               = useState('Todos')
  const [modal, setModal]                 = useState(null)

  useEffect(() => {
    const t = setTimeout(() => { setReservaciones(MOCK_RESERVACIONES); setLoading(false) }, 500)
    return () => clearTimeout(t)
  }, [])

  const cambiarEstado = (id, nuevoEstado) =>
    setReservaciones((prev) => prev.map((r) => r.id === id ? { ...r, estado: nuevoEstado } : r))

  const datos = filtro === 'Todos' ? reservaciones : reservaciones.filter((r) => r.estado === filtro)

  const columns = [
    { key: 'id',       label: '#'        },
    { key: 'usuario',  label: 'Usuario'  },
    { key: 'paquete',  label: 'Paquete'  },
    { key: 'destino',  label: 'Destino'  },
    { key: 'fecha',    label: 'Fecha'    },
    { key: 'personas', label: 'Personas' },
    { key: 'total',    label: 'Total'    },
    {
      key: 'estado', label: 'Estado',
      render: (row) => (
        <span className={`${styles.badge} ${BADGE_MAP[row.estado] ?? ''}`}>{row.estado}</span>
      ),
    },
    {
      key: 'acciones', label: 'Acciones',
      render: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          {row.estado === 'Pendiente'  && <button className={`${styles.actionBtn} ${styles.btnConfirm}`} onClick={() => cambiarEstado(row.id, 'Confirmada')}>Confirmar</button>}
          {(row.estado === 'Pendiente' || row.estado === 'Confirmada') && <button className={`${styles.actionBtn} ${styles.btnCancel}`} onClick={() => cambiarEstado(row.id, 'Cancelada')}>Cancelar</button>}
          {row.estado === 'Confirmada' && <button className={`${styles.actionBtn} ${styles.btnPay}`}    onClick={() => cambiarEstado(row.id, 'Pagada')}>Marcar pagada</button>}
          <button className={`${styles.actionBtn} ${styles.btnView}`} onClick={() => setModal(row)}>Ver detalle</button>
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

      {/* Filtro */}
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Filtrar por estado:</span>
        <select className={styles.filterSelect} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          {ESTADOS_FILTRO.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <AdminTable columns={columns} data={datos} loading={loading} emptyMessage="No hay reservaciones con este estado." />

      {/* Modal detalle */}
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Reservación #{modal.id}</h3>
            {[
              ['Usuario',  modal.usuario],
              ['Paquete',  modal.paquete],
              ['Destino',  modal.destino],
              ['Fecha',    modal.fecha],
              ['Personas', modal.personas],
              ['Total',    modal.total],
              ['Estado',   modal.estado],
            ].map(([k, v]) => (
              <div key={k} className={styles.modalRow}>
                <span className={styles.modalKey}>{k}</span>
                <span className={styles.modalVal}>{v}</span>
              </div>
            ))}
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
