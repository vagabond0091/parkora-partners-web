import { theme } from './theme';

/**
 * Hook to access theme values
 * @returns Theme configuration object
 * @example
 * const theme = useTheme();
 * <div className={theme.colors.bgDefault}>Content</div>
 */
export const useTheme = () => {
  return theme;
};
