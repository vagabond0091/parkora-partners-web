import type { ReactNode } from 'react';

export interface SidebarNavItem {
  label: string;
  path: string;
  icon?: ReactNode;
}

export interface SidebarProps {
  className?: string;
}
