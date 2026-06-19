import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminTable from '../../components/admin/AdminTable'
import Button from '../../components/common/Button'
import styles from './admin.module.css'

const MOCK_PAQUETES = [
  { id: 1, nombre: 'Cancún Premium',  destino: 'Cancún',       tipo: 'Todo incluido', dias: 7,  noches: 6,  precio: '$14,500', cupos: 20, fechaInicio: '2026-07-15', activo: true  },
  { id: 2, nombre: 'Europa Clásica',  destino: 'Roma / París',  tipo: 'Cultural',      dias: 14, noches: 13, precio: '$52,000', cupos: 15, fechaInicio: '2026-08-01', activo: true  },
  { id: 3, nombre: 'Caribe Express',  destino: 'Cancún',        tipo: 'Económico',     dias: 4,  noches: 3,  precio: '$8,200',  cupos: 30, fechaInicio: '2026-07-20', activo: true  },
  { id: 4, nombre: 'Los Cabos Relax', destino: 'Los Cabos',     tipo: 'Playa',         dias: 5,  noches: 4,  precio: '$11,800', cupos: 10, fechaInicio: '2026-09-05', activo: false },
  { id: 5, nombre: 'Tulum Aventura',  destino: 'Tulum',         tipo: 'Aventura',      dias: 6,  noches: 5,  precio: '$9,400',  cupos: 12, fechaInicio: '2026-10-10', activo: true  },
]

function AdminPackages() {
  const navigate = useNavigate()
  const [paquetes, setPaquetes] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setPaquetes(MOCK_PAQUETES); setLoading(false) }, 500)
    return () => clearTimeout(t)
  }, [])

  const toggleActivo = (id) =>
    setPaquetes((prev) => prev.map((p) => p.id === id ? { ...p, activo: !p.activo } : p))

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este paquete?'))
      setPaquetes((prev) => prev.filter((p) => p.id !== id))
  }

  const columns = [
    { key: 'nombre',      label: 'Nombre'      },
    { key: 'destino',     label: 'Destino'     },
    { key: 'tipo',        label: 'Tipo'        },
    { key: 'duracion',    label: 'Duración',   render: (r) => `${r.dias}d / ${r.noches}n` },
    { key: 'precio',      label: 'Precio'      },
    { key: 'cupos',       label: 'Cupos'       },
    { key: 'fechaInicio', label: 'Inicio'      },
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
          <button className={`${styles.actionBtn} ${styles.btnEdit}`}   onClick={() => navigate(`/admin/paquetes/editar/${row.id}`)}>Editar</button>
          <button className={`${styles.actionBtn} ${styles.btnToggle}`} onClick={() => toggleActivo(row.id)}>{row.activo ? 'Desactivar' : 'Activar'}</button>
          <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={() => eliminar(row.id)}>Eliminar</button>
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
        <Button text="+ Nuevo paquete" variant="primary" onClick={() => navigate('/admin/paquetes/nuevo')} />
      </div>

      <AdminTable columns={columns} data={paquetes} loading={loading} emptyMessage="No hay paquetes registrados." />
    </div>
  )
}

export default AdminPackages
