import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

const ProtectedRoute = ({ allowedRole, children }) => {
  const token = useAuthStore((state) => state.token);
  const userType = useAuthStore((state) => state.userType);

  if (!token) {
    if (allowedRole === 'officer') return <Navigate to="/admin/login" replace />;
    if (allowedRole === 'customer') return <Navigate to="/login" replace />;
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userType !== allowedRole) {
    if (userType === 'officer') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;