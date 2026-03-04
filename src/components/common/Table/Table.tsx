import { useMemo } from 'react';
import { clsx } from 'clsx';
import type { TableProps, TableColumn } from '@/types/components/table.types';

/**
 * Generic table component for displaying data in a structured format.
 * Supports customizable columns, row selection, click handlers, and pagination.
 * @template T - The type of data items in the table
 * @example
 * ```tsx
 * <Table
 *   data={partners}
 *   columns={columns}
 *   getRowKey={(row) => row.id}
 *   onRowClick={(row) => handleSelect(row)}
 *   isRowSelected={(row) => selectedId === row.id}
 *   pagination={{
 *     currentPage: 1,
 *     pageSize: 10,
 *     totalItems: 100,
 *     onPageChange: (page) => setPage(page),
 *     enabled: true
 *   }}
 * />
 * ```
 */
export const Table = <T,>({
  data,
  columns,
  getRowKey,
  onRowClick,
  isRowSelected,
  emptyMessage = 'No data available',
  className,
  tableClassName,
  pagination,
}: TableProps<T>) => {
  /**
   * Get the unique key for a row.
   */
  const getKey = (row: T, index: number): string | number => {
    if (getRowKey) {
      return getRowKey(row, index);
    }
    return index;
  };

  /**
   * Get the cell value based on the column accessor.
   */
  const getCellValue = (column: TableColumn<T>, row: T): React.ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor] as React.ReactNode;
  };

  /**
   * Render the cell content.
   */
  const renderCell = (column: TableColumn<T>, row: T): React.ReactNode => {
    const value = getCellValue(column, row);
    if (column.render) {
      return column.render(value, row);
    }
    return value;
  };

  /**
   * Calculate pagination values.
   */
  const paginationEnabled = pagination?.enabled ?? false;
  const pageSize = pagination?.pageSize ?? 10;
  const currentPage = pagination?.currentPage ?? 1;
  const totalItems = pagination?.totalItems ?? data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  /**
   * Get paginated data for client-side pagination.
   */
  const paginatedData = useMemo(() => {
    if (!paginationEnabled || pagination?.totalItems !== undefined) {
      // Server-side pagination or no pagination - use all data
      return data;
    }
    // Client-side pagination - slice the data
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, paginationEnabled, currentPage, pageSize, pagination?.totalItems]);

  /**
   * Handle page change.
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      pagination?.onPageChange(page);
    }
  };

  /**
   * Handle page size change.
   */
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    pagination?.onPageSizeChange?.(newPageSize);
    // Reset to first page when page size changes
    pagination?.onPageChange(1);
  };

  /**
   * Generate page numbers to display.
   */
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        end = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Add ellipsis before middle pages if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis after middle pages if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (data.length === 0) {
    return (
      <div className={clsx('bg-[#1a1a2e] rounded-xl border border-gray-800 overflow-hidden', className)}>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('bg-[#1a1a2e] rounded-xl border border-gray-800 overflow-hidden', className)}>
      <table className={clsx('w-full', tableClassName)}>
        <thead className="bg-[#172032] border-b border-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={clsx(
                  'px-6 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider',
                  column.headerClassName
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {paginatedData.map((row, rowIndex) => {
            const actualIndex = paginationEnabled && !pagination?.totalItems
              ? (currentPage - 1) * pageSize + rowIndex
              : rowIndex;
            const isSelected = isRowSelected ? isRowSelected(row, actualIndex) : false;
            return (
              <tr
                key={getKey(row, actualIndex)}
                onClick={() => onRowClick?.(row, actualIndex)}
                className={clsx(
                  'group transition-colors bg-[#0f172a] border-t border-b border-gray-800',
                  onRowClick && 'cursor-pointer',
                  isSelected
                    ? 'bg-[#1b2335] hover:bg-[#1b2335]'
                    : 'hover:bg-[#1a2332]'
                )}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={clsx('px-6 py-3', column.cellClassName)}
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {paginationEnabled && totalPages > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-[#172032]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">Rows per page:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="bg-[#232b3d] border border-gray-700 rounded-lg px-2 py-1 text-[11px] text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#6d28d9] focus:border-transparent transition-colors"
              >
                {(pagination?.pageSizeOptions ?? [10, 25, 50, 100]).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-gray-400">
              {((currentPage - 1) * pageSize + 1)}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#172032]',
                currentPage === 1
                  ? 'bg-[#232b3d] text-gray-600 cursor-not-allowed'
                  : 'bg-[#232b3d] text-gray-300 hover:bg-[#2a3441] hover:text-white'
              )}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-[11px] text-gray-500">
                      ...
                    </span>
                  );
                }
                const pageNum = page as number;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={clsx(
                      'min-w-[32px] px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#172032]',
                      currentPage === pageNum
                        ? 'bg-[#6d28d9] text-white'
                        : 'bg-[#232b3d] text-gray-300 hover:bg-[#2a3441] hover:text-white'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#172032]',
                currentPage === totalPages
                  ? 'bg-[#232b3d] text-gray-600 cursor-not-allowed'
                  : 'bg-[#232b3d] text-gray-300 hover:bg-[#2a3441] hover:text-white'
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
