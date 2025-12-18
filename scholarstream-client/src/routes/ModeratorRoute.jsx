import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const ModeratorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, roleLoading] = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (user && (role === 'moderator' || role === 'admin')) {
    return children;
  }

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default ModeratorRoute;
