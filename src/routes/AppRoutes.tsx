import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage/RegisterPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage/DashboardPage';
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage/AnalyticsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage/SettingsPage';
import { VerificationPage } from '@/pages/dashboard/VerificationPage/VerificationPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage/NotFoundPage';
import { AccessDeniedPage } from '@/pages/error/AccessDeniedPage/AccessDeniedPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout';
import { ROUTES } from './routePaths';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Redirect to dashboard if already authenticated */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* Protected Routes - Require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.DASHBOARD_ANALYTICS} element={<AnalyticsPage />} />
            <Route path={ROUTES.DASHBOARD_SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.DASHBOARD_VERIFICATION} element={<VerificationPage />} />
          </Route>
        </Route>

        {/* Access Denied Page - Public route for unauthorized access */}
        <Route path={ROUTES.ACCESS_DENIED} element={<AccessDeniedPage />} />
        
        {/* 404 - Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
