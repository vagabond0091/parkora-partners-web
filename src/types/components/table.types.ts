/**
 * Column definition for the Table component.
 * @template T - The type of data items in the table
 */
export interface TableColumn<T> {
  /**
   * The header text for the column.
   */
  header: string;
  /**
   * The key/accessor to get the value from the data item.
   * Can be a string key or a function that extracts the value.
   */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /**
   * Optional custom render function for the cell content.
   * If not provided, the value from accessor will be displayed.
   */
  render?: (value: unknown, row: T) => React.ReactNode;
  /**
   * Optional CSS classes for the header cell.
   */
  headerClassName?: string;
  /**
   * Optional CSS classes for the data cell.
   */
  cellClassName?: string;
  /**
   * Optional width for the column.
   */
  width?: string;
}

/**
 * Props for the Table component.
 * @template T - The type of data items in the table
 */
export interface TableProps<T> {
  /**
   * Array of data items to display in the table.
   */
  data: T[];
  /**
   * Column definitions for the table.
   */
  columns: TableColumn<T>[];
  /**
   * Optional key extractor function to get unique identifier for each row.
   * Defaults to using the index if not provided.
   */
  getRowKey?: (row: T, index: number) => string | number;
  /**
   * Optional callback function called when a row is clicked.
   */
  onRowClick?: (row: T, index: number) => void;
  /**
   * Optional function to determine if a row is selected.
   */
  isRowSelected?: (row: T, index: number) => boolean;
  /**
   * Optional empty state message when there's no data.
   */
  emptyMessage?: string;
  /**
   * Optional CSS classes for the table wrapper.
   */
  className?: string;
  /**
   * Optional CSS classes for the table element.
   */
  tableClassName?: string;
}
