import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/routes/routePaths';
import type { SidebarProps } from '@/types/components/sidebar.types';

/**
 * Sidebar navigation component for dashboard pages.
 * Provides navigation links and user information.
 * @param className - Additional CSS classes
 */
export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navItems = [
    {
      label: 'Dashboard',
      path: ROUTES.DASHBOARD,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: 'Analytics',
      path: ROUTES.DASHBOARD_ANALYTICS,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      label: 'Settings',
      path: ROUTES.DASHBOARD_SETTINGS,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200',
        'flex flex-col z-50',
        className
      )}
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Parkora Partners
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
                    active
                      ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 px-4 py-3 bg-gray-50 rounded-xl">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || 'Partner'}
          </p>
          <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl',
            'text-red-600 hover:bg-red-50',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          )}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
