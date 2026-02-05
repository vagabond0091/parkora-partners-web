import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AuthService } from '@/services/AuthService';
import { ROUTES } from './routePaths';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check if token exists and is expired
  if (token && AuthService.isTokenExpired(token)) {
    // Clear expired token and redirect to login
    logout();
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If user object is null but authenticated, redirect to login to re-authenticate
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check if accessing dashboard or verification page and verify role
  const requiresPartnersRole = 
    location.pathname === ROUTES.DASHBOARD || 
    location.pathname === ROUTES.DASHBOARD_VERIFICATION;

  if (requiresPartnersRole) {
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
