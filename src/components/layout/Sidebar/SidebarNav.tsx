import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/routes/routePaths';
import { partnersNavItems } from './partnersNavItems';
import { adminNavItems } from './adminNavItems';

/**
 * Sidebar navigation component.
 * Renders the navigation menu items for the sidebar.
 */
export const SidebarNav = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isAdmin = user?.roles?.some((role) => role.toLowerCase() === 'admin');

  const navItems = isAdmin ? adminNavItems : partnersNavItems;

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 py-3 rounded-xl relative',
                  'transition-colors duration-200',
                  'outline-none focus:outline-none focus-visible:outline-none',
                  'ring-0 focus:ring-0 focus-visible:ring-0',
                  'ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0',
                  active
                    ? 'bg-gradient-to-r from-[rgba(127,19,236,0.2)] to-[rgba(127,19,236,0.05)] border-l-4 border-[#7f13ec] pl-3 pr-4 text-white'
                    : 'text-gray-300 hover:bg-gray-700/30 px-4'
                )}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
