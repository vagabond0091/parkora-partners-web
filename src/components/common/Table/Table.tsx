import { clsx } from 'clsx';
import type { TableProps, TableColumn } from '@/types/components/table.types';

/**
 * Generic table component for displaying data in a structured format.
 * Supports customizable columns, row selection, and click handlers.
 * @template T - The type of data items in the table
 * @example
 * ```tsx
 * <Table
 *   data={partners}
 *   columns={columns}
 *   getRowKey={(row) => row.id}
 *   onRowClick={(row) => handleSelect(row)}
 *   isRowSelected={(row) => selectedId === row.id}
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
          {data.map((row, rowIndex) => {
            const isSelected = isRowSelected ? isRowSelected(row, rowIndex) : false;
            return (
              <tr
                key={getKey(row, rowIndex)}
                onClick={() => onRowClick?.(row, rowIndex)}
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
    </div>
  );
};
