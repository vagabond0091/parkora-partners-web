import { clsx } from 'clsx';
import type { TableColumn } from '@/types/components/table.types';

/**
 * Generic column utilities for creating reusable table columns.
 */

/**
 * Creates a simple text column.
 * @template T - The data type
 * @param header - Column header text
 * @param accessor - Key to access the value
 * @param options - Optional configuration
 */
export const textColumn = <T extends Record<string, unknown>>(
  header: string,
  accessor: keyof T,
  options?: {
    className?: string;
    cellClassName?: string;
    headerClassName?: string;
    width?: string;
  }
): TableColumn<T> => {
  return {
    header,
    accessor,
    cellClassName: options?.cellClassName,
    headerClassName: options?.headerClassName,
    width: options?.width,
    render: (value) => (
      <p className={clsx('text-xs text-gray-400', options?.className)}>
        {String(value ?? '')}
      </p>
    ),
  };
};

/**
 * Creates a badge/pill column.
 * @template T - The data type
 * @param header - Column header text
 * @param accessor - Key to access the value
 * @param options - Optional configuration
 */
export const badgeColumn = <T extends Record<string, unknown>>(
  header: string,
  accessor: keyof T,
  options?: {
    className?: string;
    cellClassName?: string;
    headerClassName?: string;
    width?: string;
    getBadgeColor?: (value: unknown) => string;
  }
): TableColumn<T> => {
  const defaultBadgeColor = 'bg-[#272f40] text-gray-200';
  
  return {
    header,
    accessor,
    cellClassName: options?.cellClassName,
    headerClassName: options?.headerClassName,
    width: options?.width,
    render: (value) => {
      const badgeColor = options?.getBadgeColor
        ? options.getBadgeColor(value)
        : defaultBadgeColor;
      
      return (
        <span className={clsx(
          'inline-flex px-2 py-1 rounded-full text-[10px] font-medium',
          badgeColor,
          options?.className
        )}>
          {String(value ?? '')}
        </span>
      );
    },
  };
};

/**
 * Creates a status column with dot indicator.
 * @template T - The data type
 * @param header - Column header text
 * @param accessor - Key to access the status value
 * @param options - Configuration options
 */
export const statusColumn = <T extends Record<string, unknown>>(
  header: string,
  accessor: keyof T,
  options: {
    getDotColor: (status: string) => string;
    getTextColor: (status: string) => string;
    cellClassName?: string;
    headerClassName?: string;
    width?: string;
  }
): TableColumn<T> => {
  return {
    header,
    accessor,
    cellClassName: options.cellClassName,
    headerClassName: options.headerClassName,
    width: options.width,
    render: (value) => {
      const status = String(value ?? '');
      return (
        <div className="flex items-center gap-2">
          <div className={clsx('w-2 h-2 rounded-full', options.getDotColor(status))}></div>
          <span className={clsx('text-[10px] font-bold', options.getTextColor(status))}>
            {status}
          </span>
        </div>
      );
    },
  };
};

/**
 * Creates an avatar column with name and subtitle.
 * @template T - The data type
 * @param header - Column header text
 * @param options - Configuration options
 */
export const avatarColumn = <T extends Record<string, unknown>>(
  header: string,
  options: {
    getName: (row: T) => string;
    getSubtitle?: (row: T) => string;
    getInitials: (name: string) => string;
    avatarClassName?: string;
    cellClassName?: string;
    headerClassName?: string;
    width?: string;
  }
): TableColumn<T> => {
  return {
    header,
    accessor: options.getName as (row: T) => React.ReactNode,
    cellClassName: options.cellClassName,
    headerClassName: options.headerClassName,
    width: options.width,
    render: (_, row) => {
      const name = options.getName(row);
      const subtitle = options.getSubtitle?.(row);
      
      return (
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center text-xs font-semibold text-white',
            options.avatarClassName
          )}>
            {options.getInitials(name)}
          </div>
          <div>
            <p className="text-xs font-medium text-white">{name}</p>
            {subtitle && (
              <p className="text-[10px] text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
      );
    },
  };
};

/**
 * Creates an action/icon column (e.g., chevron, actions).
 * @template T - The data type
 * @param options - Configuration options
 */
export const actionColumn = <T extends Record<string, unknown>>(
  options: {
    render: (row: T, isSelected: boolean) => React.ReactNode;
    getSelectedId?: (row: T) => string | number;
    selectedId?: string | number | null;
    cellClassName?: string;
    headerClassName?: string;
    width?: string;
  }
): TableColumn<T> => {
  return {
    header: '',
    accessor: () => null,
    cellClassName: options.cellClassName,
    headerClassName: options.headerClassName,
    width: options.width ?? '48px',
    render: (_, row) => {
      const isSelected = options.getSelectedId && options.selectedId !== null
        ? options.getSelectedId(row) === options.selectedId
        : false;
      
      return options.render(row, isSelected);
    },
  };
};

/**
 * Creates a custom column with full control over rendering.
 * @template T - The data type
 * @param header - Column header text
 * @param accessor - Key to access the value or function
 * @param render - Custom render function
 * @param options - Optional configuration
 */
export const customColumn = <T extends Record<string, unknown>>(
  header: string,
  accessor: keyof T | ((row: T) => React.ReactNode),
  render: (value: unknown, row: T) => React.ReactNode,
  options?: {
    cellClassName?: string;
    headerClassName?: string;
    width?: string;
  }
): TableColumn<T> => {
  return {
    header,
    accessor: accessor as keyof T,
    render,
    cellClassName: options?.cellClassName,
    headerClassName: options?.headerClassName,
    width: options?.width,
  };
};
