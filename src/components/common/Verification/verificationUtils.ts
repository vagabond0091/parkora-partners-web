/**
 * Gets initials from a name.
 * @param name - The name to extract initials from
 * @returns Initials (max 2 characters)
 * @example
 * ```ts
 * getInitials('John Doe'); // 'JD'
 * getInitials('Alice'); // 'AL'
 * ```
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
 * Gets status dot color class for verification status.
 * @param status - The verification status
 * @returns Tailwind CSS class for dot color
 * @example
 * ```ts
 * getStatusDotColor('UNDER REVIEW'); // 'bg-orange-400'
 * getStatusDotColor('PENDING'); // 'bg-blue-400'
 * ```
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
 * Gets status text color class for verification status.
 * @param status - The verification status
 * @returns Tailwind CSS class for text color
 * @example
 * ```ts
 * getStatusTextColor('UNDER REVIEW'); // 'text-orange-400'
 * getStatusTextColor('PENDING'); // 'text-blue-400'
 * ```
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
