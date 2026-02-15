import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/authStore';
import type { SidebarProps } from '@/types/components/sidebar.types';
import { SidebarNav } from './SidebarNav';

/**
 * Sidebar navigation component for dashboard pages.
 * Provides navigation links and user information.
 * @param className - Additional CSS classes
 */
export const Sidebar = ({ className }: SidebarProps) => {
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen w-64 bg-[#0f172a] ',
        'flex flex-col z-50',
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center gap-3">
          {/* <img 
            src="/logo.svg" 
            alt="Parkora" 
            className="h-8 w-auto"
          /> */}
          <h2 className="text-lg font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Parkora Partners
          </h2>
        </div>
      </div>

      <SidebarNav />

      <div className="p-4 border-t border-gray-700">
        <div className="mb-4 px-4 py-3 bg-gray-800/50 rounded-xl">
          <p className="text-xs font-medium text-gray-100">
            {user?.name || 'Partner'}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className={clsx(
            'w-full flex items-center justify-start gap-2 px-4 py-3 rounded-xl',
            'text-red-400 hover:text-red-300 cursor-pointer',
            'transition-colors duration-200',
            'outline-none focus:outline-none'
          )}
        >
          <svg
            className="w-4 h-4"
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
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
