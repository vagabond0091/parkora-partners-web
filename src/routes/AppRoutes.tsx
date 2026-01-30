import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage/DashboardPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage/NotFoundPage';
import { AccessDeniedPage } from '@/pages/error/AccessDeniedPage/AccessDeniedPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { ROUTES } from './routePaths';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Redirect to dashboard if already authenticated */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<LoginPage />} />
        </Route>

        {/* Protected Routes - Require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        </Route>

        {/* Access Denied Page - Public route for unauthorized access */}
        <Route path={ROUTES.ACCESS_DENIED} element={<AccessDeniedPage />} />
        
        {/* 404 - Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
