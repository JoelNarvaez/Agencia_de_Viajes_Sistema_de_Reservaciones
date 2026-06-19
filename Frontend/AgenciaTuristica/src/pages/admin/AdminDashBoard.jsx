import { travelPackages } from '../../data/packageData'
import { getReservations, isReservationPast } from '../../utils/reservationStorage'
import styles from './AdminDashBoard.module.css'

const formatCurrency = (amount) =>
  `$${new Intl.NumberFormat('es-MX').format(amount)} MXN`

const getReservationStatus = (reservation) => {
  if (reservation.status === 'Cancelada') return 'Cancelada'
  if (isReservationPast(reservation)) return 'Pasada'
  return 'Activa'
}

const countBy = (items, getKey) =>
  items.reduce((accumulator, item) => {
    const key = getKey(item)
    accumulator[key] = (accumulator[key] ?? 0) + 1
    return accumulator
  }, {})

const sumBy = (items, getValue) =>
  items.reduce((total, item) => total + getValue(item), 0)

const getPercentage = (value, maxValue) =>
  maxValue > 0 ? Math.max(4, Math.round((value / maxValue) * 100)) : 0

const getDonutStyle = (rows) => {
  const total = sumBy(rows, (row) => row.value)
  if (total === 0) {
    return {
      background: '#eef1ef',
    }
  }

  let cursor = 0
  const segments = rows.map((row) => {
    const start = cursor
    const end = cursor + (row.value / total) * 100
    cursor = end
    return `${row.color} ${start}% ${end}%`
  })

  return {
    background: `conic-gradient(${segments.join(', ')})`,
  }
}

function AdminDashBoard() {
  const reservations = getReservations()
  const activeReservations = reservations.filter((reservation) => getReservationStatus(reservation) === 'Activa')
  const cancelledReservations = reservations.filter((reservation) => reservation.status === 'Cancelada')
  const pastReservations = reservations.filter((reservation) => getReservationStatus(reservation) === 'Pasada')
  const confirmedReservations = reservations.filter((reservation) => reservation.status === 'Confirmada')
  const totalRevenue = sumBy(confirmedReservations, (reservation) => reservation.totalAmount)
  const averageTicket = confirmedReservations.length > 0
    ? Math.round(totalRevenue / confirmedReservations.length)
    : 0
  const packageTypeCounts = countBy(travelPackages, (travelPackage) =>
    travelPackage.bookingMode === 'nightly' ? 'Fechas flexibles' : 'Salida fija',
  )
  const packageTypeRows = Object.entries(packageTypeCounts)
  const reservationsByPackage = travelPackages
    .map((travelPackage) => {
      const packageReservations = reservations.filter((reservation) => reservation.packageId === travelPackage.id)
      return {
        active: packageReservations.filter((reservation) => getReservationStatus(reservation) === 'Activa').length,
        cancelled: packageReservations.filter((reservation) => reservation.status === 'Cancelada').length,
        past: packageReservations.filter((reservation) => getReservationStatus(reservation) === 'Pasada').length,
        revenue: sumBy(
          packageReservations.filter((reservation) => reservation.status === 'Confirmada'),
          (reservation) => reservation.totalAmount,
        ),
        title: travelPackage.title,
        total: packageReservations.length,
      }
    })
    .sort((a, b) => b.total - a.total || b.revenue - a.revenue)
  const maxReservationsByPackage = Math.max(...reservationsByPackage.map((item) => item.total), 0)
  const statusRows = [
    { color: '#22c55e', label: 'Activas', value: activeReservations.length },
    { color: '#94a3b8', label: 'Pasadas', value: pastReservations.length },
    { color: '#ef4444', label: 'Canceladas', value: cancelledReservations.length },
  ]
  const packageTypeDonutRows = packageTypeRows.map(([type, count], index) => ({
    color: index === 0 ? '#f8b229' : '#14211b',
    label: type,
    value: count,
  }))

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <span>Administracion</span>
            <h1>Dashboard</h1>
            <p>
              Analisis general de paquetes, reservaciones, ingresos simulados y disponibilidad para tomar
              decisiones rapidas.
            </p>
          </div>
          <strong className={styles.updatedAt}>Actualizado con datos locales</strong>
        </header>

        <section className={styles.statsGrid} aria-label="Resumen administrativo">
          <article className={styles.statCard}>
            <span>Reservaciones</span>
            <strong>{reservations.length}</strong>
            <p>{activeReservations.length} activas</p>
          </article>
          <article className={styles.statCard}>
            <span>Ingresos confirmados</span>
            <strong>{formatCurrency(totalRevenue)}</strong>
            <p>Pagos simulados aprobados o programados</p>
          </article>
          <article className={styles.statCard}>
            <span>Ticket promedio</span>
            <strong>{formatCurrency(averageTicket)}</strong>
            <p>Promedio por reserva confirmada</p>
          </article>
          <article className={styles.statCard}>
            <span>Paquetes activos</span>
            <strong>{travelPackages.length}</strong>
            <p>{packageTypeCounts['Salida fija'] ?? 0} con salida fija</p>
          </article>
        </section>

        <div className={styles.layout}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Reservaciones por paquete</h2>
              <span>Volumen e ingresos</span>
            </div>
            {reservationsByPackage.some((item) => item.total > 0) ? (
              <div className={styles.barList}>
                {reservationsByPackage.map((item) => (
                  <div className={styles.barRow} key={item.title}>
                    <div className={styles.barMeta}>
                      <span>{item.title}</span>
                      <span>{item.total} reservas - {formatCurrency(item.revenue)}</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${getPercentage(item.total, maxReservationsByPackage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>Todavia no hay reservaciones para graficar por paquete.</p>
            )}
          </section>

          <section className={styles.panel}>
            <h2>Estado de reservas</h2>
            <div className={styles.donutWrap}>
              <div className={styles.donut} style={getDonutStyle(statusRows)}>
                <span>{reservations.length}</span>
              </div>
              <div className={styles.donutLegend}>
                {statusRows.map((row) => (
                  <div key={row.label}>
                    <i style={{ background: row.color }} />
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className={styles.twoColumn}>
          <section className={styles.panel}>
            <h2>Composicion de paquetes</h2>
            <div className={styles.donutWrap}>
              <div className={styles.donut} style={getDonutStyle(packageTypeDonutRows)}>
                <span>{travelPackages.length}</span>
              </div>
              <div className={styles.donutLegend}>
                {packageTypeDonutRows.map((row) => (
                  <div key={row.label}>
                    <i style={{ background: row.color }} />
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.panel}>
            <h2>Reservas por estado</h2>
            <div className={styles.statusCards}>
              {statusRows.map((row) => (
                <article key={row.label}>
                  <i style={{ background: row.color }} />
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.twoColumn}>
          <section className={styles.panel}>
            <h2>Top por estado</h2>
            <div className={styles.stackedBars}>
              {reservationsByPackage.slice(0, 5).map((item) => {
                const total = Math.max(1, item.total)
                return (
                  <div className={styles.stackedRow} key={item.title}>
                    <span>{item.title}</span>
                    <div className={styles.stackedTrack}>
                      <i
                        className={styles.activeSegment}
                        style={{ width: `${(item.active / total) * 100}%` }}
                      />
                      <i
                        className={styles.pastSegment}
                        style={{ width: `${(item.past / total) * 100}%` }}
                      />
                      <i
                        className={styles.cancelSegment}
                        style={{ width: `${(item.cancelled / total) * 100}%` }}
                      />
                    </div>
                    <strong>{item.total}</strong>
                  </div>
                )
              })}
            </div>
            <div className={styles.legend}>
              <span><i className={styles.activeSegment} /> Activas</span>
              <span><i className={styles.pastSegment} /> Pasadas</span>
              <span><i className={styles.cancelSegment} /> Canceladas</span>
            </div>
          </section>
        </div>

      </section>
    </main>
  )
}

export default AdminDashBoard
