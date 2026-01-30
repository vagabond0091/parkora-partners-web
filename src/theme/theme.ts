/**
 * Theme configuration for Parkora Partners Web
 * Centralized design tokens for consistent styling across the application
 * 
 * All Tailwind classes are defined as string constants to ensure proper class purging
 * 
 * TO CHANGE THEME COLORS:
 * 1. Update the gradient classes below (e.g., change 'orange-500' to 'blue-500')
 * 2. Update shadow colors if needed (e.g., change 'purple-900' to match your theme)
 * 3. Update background colors in the colors section
 * 4. All components using this theme will automatically update
 * 
 * EXAMPLE: To change from orange/pink/purple to blue/cyan/indigo:
 * - Change 'from-orange-500' to 'from-blue-500'
 * - Change 'via-pink-500' to 'via-cyan-500'
 * - Change 'to-purple-600' to 'to-indigo-600'
 * - Update corresponding hover states and background gradients
 */

export const theme = {
  /**
   * Primary gradient classes
   * 
   * TO CHANGE COLORS: Simply replace the color names (orange, pink, purple) and shades (100, 500, 600, etc.)
   * Example: 'from-orange-500' → 'from-blue-500'
   * 
   * Available Tailwind colors: red, orange, amber, yellow, lime, green, emerald, 
   * teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
   * Available shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
   */
  gradients: {
    primaryButton: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600',
    primaryButtonHover: 'hover:from-orange-600 hover:via-pink-600 hover:to-purple-700',
    primaryText: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent',
    primaryBackground: 'bg-gradient-to-br from-orange-100 via-pink-100 to-purple-200',
    decorativeCircle1: 'bg-gradient-to-br from-orange-200/60 to-orange-300/40',
    decorativeCircle2: 'bg-gradient-to-br from-purple-200/60 to-pink-200/40',
  },

  /**
   * Shadow classes
   * 
   * TO CHANGE SHADOW COLORS: Replace 'purple' with your theme color
   * Example: 'shadow-purple-900/5' → 'shadow-blue-900/5'
   */
  shadows: {
    card: 'shadow-xl shadow-purple-900/5',
    button: 'shadow-lg shadow-purple-500/30',
    buttonHover: 'hover:shadow-xl hover:shadow-purple-500/40',
  },

  /**
   * Border radius classes
   */
  borderRadius: {
    sm: 'rounded-xl',
    md: 'rounded-2xl',
    lg: 'rounded-3xl',
    full: 'rounded-full',
  },

  /**
   * Spacing classes
   */
  spacing: {
    pagePadding: 'p-8 md:p-10',
    pageMargin: 'mx-4 my-8',
    buttonDefault: 'px-6 py-3',
    buttonCompact: 'px-4 py-2',
    buttonSmall: 'px-5 py-2.5',
  },

  /**
   * Typography classes
   */
  typography: {
    textXs: 'text-xs',
    textSm: 'text-sm',
    textBase: 'text-base',
    textLg: 'text-lg',
    textXl: 'text-xl',
    text2xl: 'text-2xl',
    text3xl: 'text-3xl',
    text4xl: 'text-4xl',
    fontNormal: 'font-normal',
    fontMedium: 'font-medium',
    fontBold: 'font-bold',
    fontExtrabold: 'font-extrabold',
  },

  /**
   * Color classes
   * 
   * TO CHANGE BACKGROUND COLORS: Update bgDefault, bgWhite, etc.
   * Example: 'bg-gray-50' → 'bg-slate-50' or 'bg-blue-50'
   */
  colors: {
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textTertiary: 'text-gray-500',
    textWhite: 'text-white',
    bgDefault: 'bg-gray-50', // Main page background - CHANGE THIS for different background
    bgWhite: 'bg-white',
    errorBg: 'bg-red-50',
    errorBorder: 'border-red-200',
    errorText: 'text-red-600',
  },

  /**
   * Transition classes
   */
  transitions: {
    default: 'transition-all duration-200',
    smooth: 'transition-all duration-300',
    colors: 'transition-colors',
    transform: 'transform hover:scale-105',
  },

  /**
   * Focus ring classes
   */
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    purple: 'focus:ring-purple-500',
    gray: 'focus:ring-gray-200',
  },
} as const;

/**
 * Get primary button classes with all theme styles
 * @example
 * <Button className={getPrimaryButtonClasses()}>Click me</Button>
 */
export const getPrimaryButtonClasses = () => {
  return `${theme.gradients.primaryButton} ${theme.gradients.primaryButtonHover} ${theme.colors.textWhite} ${theme.shadows.button} ${theme.shadows.buttonHover} ${theme.transitions.smooth} ${theme.transitions.transform} ${theme.focus.ring} ${theme.focus.purple}`;
};

/**
 * Get secondary button classes
 * @example
 * <Button className={getSecondaryButtonClasses()}>Cancel</Button>
 */
export const getSecondaryButtonClasses = () => {
  return `border border-gray-200 ${theme.colors.bgWhite} text-gray-700 hover:bg-gray-50 ${theme.focus.ring} ${theme.focus.gray}`;
};

/**
 * Get card container classes
 * @example
 * <div className={getCardClasses()}>Card content</div>
 */
export const getCardClasses = () => {
  return `${theme.colors.bgWhite} ${theme.borderRadius.lg} ${theme.shadows.card} ${theme.spacing.pagePadding}`;
};

/**
 * Get text gradient classes
 * @example
 * <h1 className={getTextGradientClasses()}>Gradient Text</h1>
 */
export const getTextGradientClasses = () => {
  return theme.gradients.primaryText;
};

/**
 * Get background gradient classes
 * @example
 * <div className={getBackgroundGradientClasses()}>Background</div>
 */
export const getBackgroundGradientClasses = () => {
  return theme.gradients.primaryBackground;
};
