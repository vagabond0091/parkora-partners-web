import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from './routePaths';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If user object is null but authenticated, redirect to login to re-authenticate
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check if accessing dashboard and verify role
  if (location.pathname === ROUTES.DASHBOARD) {
    const hasAccess = user.roles?.some(
      (role) => role.toLowerCase() === 'partners'
    );

    if (!hasAccess) {
      // Redirect to access denied page if user doesn't have required role
      return <Navigate to={ROUTES.ACCESS_DENIED} replace />;
    }
  }

  return <Outlet />;
};
