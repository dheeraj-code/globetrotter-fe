import { Navigate, useLocation } from 'react-router-dom';
import { useRootStore } from '../Stores';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { auth: authStore } = useRootStore();

  if (!authStore.isAuthenticated) {
    // Redirect to login with the current location as the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute; 