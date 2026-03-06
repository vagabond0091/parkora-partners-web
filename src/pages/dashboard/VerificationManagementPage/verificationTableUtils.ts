/**
 * Get initials from partner name.
 * @param name - The partner name
 * @returns Initials (max 2 characters)
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get status dot color class.
 * @param status - The verification status
 * @returns Tailwind CSS class for dot color
 */
export const getStatusDotColor = (status: string): string => {
  switch (status) {
    case 'UNDER REVIEW':
      return 'bg-orange-400';
    case 'PENDING':
      return 'bg-blue-400';
    default:
      return 'bg-gray-400';
  }
};

/**
 * Get status text color class.
 * @param status - The verification status
 * @returns Tailwind CSS class for text color
 */
export const getStatusTextColor = (status: string): string => {
  switch (status) {
    case 'UNDER REVIEW':
      return 'text-orange-400';
    case 'PENDING':
      return 'text-blue-400';
    default:
      return 'text-gray-400';
  }
};
