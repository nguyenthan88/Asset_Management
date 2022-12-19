import { useContext } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  console.log('RequireAuth', auth);
  const location = useLocation();

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.username ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
