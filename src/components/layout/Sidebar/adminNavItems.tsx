import type { SidebarNavItem } from '@/types/components/sidebar.types';
import { ROUTES } from '@/routes/routePaths';

/**
 * Admin navigation items configuration.
 */
export const adminNavItems: SidebarNavItem[] = [
  {
    label: 'Admin',
    path: ROUTES.ADMIN_DASHBOARD,
    icon: (
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
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
];
