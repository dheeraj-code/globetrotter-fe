import { Navigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../Stores';

const ProtectedRoute = observer(({ children }) => {
  const location = useLocation();
  const { authStore } = useStores();

  if (!authStore.isAuthenticated) {
    // Redirect to login with the current location as the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
});

export default ProtectedRoute; 