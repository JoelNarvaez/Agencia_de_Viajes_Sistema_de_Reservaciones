import PropTypes from "prop-types";

function ProtectedRoute({
  isAuthenticated,
  role,
  allowedRoles = [],
  unauthorizedMessage = "No tienes permisos para acceder.",
  unauthenticatedMessage = "Debes iniciar sesión.",
  children,
}) {
  if (!isAuthenticated) {
    return <h2>{unauthenticatedMessage}</h2>;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    return <h2>{unauthorizedMessage}</h2>;
  }

  return children;
}

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  role: PropTypes.string,
  allowedRoles: PropTypes.arrayOf(
    PropTypes.string
  ),
  unauthorizedMessage: PropTypes.string,
  unauthenticatedMessage: PropTypes.string,
  children: PropTypes.node,
};

export default ProtectedRoute;