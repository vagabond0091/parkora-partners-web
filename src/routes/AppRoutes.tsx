import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage/LoginPage';
import { ROUTES } from './routePaths';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        
        {/* Redirect root to login for now */}
        <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.LOGIN} replace />} />
        
        {/* 404 - Redirect to login */}
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
