import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';

/**
 * Layout component for dashboard pages.
 * Provides sidebar navigation and main content area.
 */
export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};
