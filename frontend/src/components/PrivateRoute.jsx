import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; 
  }

  if (!user) return <Navigate to='/signin' />;
  if (user.role !== "appruved_user" && user.role !== "admin") {
    return <Navigate to='/signupsuccess' />;
  }

  return children;
};

export default PrivateRoute;
