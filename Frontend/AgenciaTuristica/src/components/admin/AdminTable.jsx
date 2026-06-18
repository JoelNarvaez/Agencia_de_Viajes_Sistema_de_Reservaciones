import PropTypes from 'prop-types';

const tableWrapperStyle = {
  width: '100%',
  overflowX: 'auto',
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
};

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '600',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  background: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
};

const tdStyle = {
  padding: '12px 16px',
  color: '#374151',
  borderBottom: '1px solid #f1f5f9',
  verticalAlign: 'middle',
};

const emptyStyle = {
  padding: '40px',
  textAlign: 'center',
  color: '#94a3b8',
  fontSize: '14px',
};

const loadingStyle = {
  padding: '40px',
  textAlign: 'center',
  color: '#94a3b8',
  fontSize: '14px',
};

/**
 * AdminTable - tabla reutilizable para el panel admin.
 *
 * Props:
 *   columns: [{ key, label, render? }]
 *   data: array of objects
 *   loading: bool
 *   emptyMessage: string
 */
function AdminTable({ columns, data, loading, emptyMessage }) {
  if (loading) {
    return (
      <div style={tableWrapperStyle}>
        <p style={loadingStyle}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={tableWrapperStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={thStyle}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={emptyStyle}>
                {emptyMessage || 'Sin registros'}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                style={{ background: rowIndex % 2 === 0 ? '#fff' : '#fafafa' }}
              >
                {columns.map((col) => (
                  <td key={col.key} style={tdStyle}>
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

AdminTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

AdminTable.defaultProps = {
  loading: false,
  emptyMessage: 'Sin registros',
};

export default AdminTable;
