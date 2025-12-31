import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
