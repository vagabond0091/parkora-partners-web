import { clsx } from 'clsx';

/**
 * Common table cell renderers for reuse across different tables.
 */

/**
 * Renders a chevron icon that shows/hides based on selection state.
 */
export const renderChevronIcon = (isSelected: boolean) => (
  <div
    className={clsx(
      'transition-opacity',
      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
    )}
  >
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </div>
);

/**
 * Renders a date value with consistent styling.
 */
export const renderDate = (date: string | Date | null | undefined) => {
  if (!date) return <p className="text-xs text-gray-400">N/A</p>;
  
  const dateStr = typeof date === 'string' ? date : date.toLocaleDateString();
  return <p className="text-xs text-gray-400">{dateStr}</p>;
};
