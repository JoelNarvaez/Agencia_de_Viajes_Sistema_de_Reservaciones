import PropTypes from 'prop-types';

const cardStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  minWidth: '180px',
  flex: '1',
};

const labelStyle = {
  fontSize: '13px',
  color: '#64748b',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const valueStyle = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1e293b',
  lineHeight: '1',
};

const iconStyle = {
  fontSize: '24px',
  marginBottom: '4px',
};

function AdminCard({ label, value, icon }) {
  return (
    <div style={cardStyle}>
      {icon && <span style={iconStyle}>{icon}</span>}
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}

AdminCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string,
};

AdminCard.defaultProps = {
  icon: null,
};

export default AdminCard;
