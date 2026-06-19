import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function ProtectedRoute({ allowedRoles = [], children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const role = user?.rol === "admin" ? "admin" : isAuthenticated ? "user" : null;

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname + location.search }}
        to="/login"
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate replace to="/" />;
  }

  return children ?? <Outlet />;
}

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

export default ProtectedRoute;
