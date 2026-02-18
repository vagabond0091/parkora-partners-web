import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from './routePaths';

export const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // Only redirect if both authenticated AND user object exists
  if (isAuthenticated && user) {
    // Redirect based on user role
    const isAdmin = user.roles?.some((role) => role.toLowerCase() === 'admin');
    const redirectPath = isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD;
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
