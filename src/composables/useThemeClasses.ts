/**
 * Composable for theme-aware CSS classes
 * Provides reusable class strings for consistent theming across components
 * All classes follow the pattern: dark:class light:class
 */
export function useThemeClasses() {
  // Text colors - improved contrast for dark theme
  const textPrimary = 'text-white dark:text-gray-50 light:text-gray-900'
  const textSecondary = 'text-white/80 dark:text-gray-300 light:text-gray-600'
  const textTertiary = 'text-white/60 dark:text-gray-400 light:text-gray-500'
  const textMuted = 'text-white/50 dark:text-gray-500 light:text-gray-400'

  // Background colors - better contrast and depth
  const bgCard = 'bg-white/10 dark:bg-gray-800/95 light:bg-white/95'
  const bgCardSolid = 'bg-gray-800 dark:bg-gray-800 light:bg-gray-100'
  const bgHover = 'hover:bg-white/10 dark:hover:bg-gray-700/60 light:hover:bg-gray-50'
  const bgButtonHover = 'hover:bg-white/15 dark:hover:bg-gray-700/70 light:hover:bg-gray-100'
  const bgHeader = 'bg-gray-900/95 dark:bg-gray-950/98 light:bg-white/80'
  const bgFooter = 'bg-gray-900/80 dark:bg-gray-950/90 light:bg-white/50'
  const bgPage = 'bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 light:from-gray-50 light:via-white light:to-gray-100'

  // Border colors - more visible borders
  const borderPrimary = 'border-white/15 dark:border-gray-700/50 light:border-gray-200'
  const borderSecondary = 'border-gray-700 dark:border-gray-700 light:border-gray-200'
  const borderCard = 'border-white/20 dark:border-gray-700/60 light:border-gray-300'

  // Background colors for dropdowns - better contrast
  const bgDropdown = 'bg-gray-800 dark:bg-gray-800 light:bg-white'
  const bgDropdownSeparator = 'bg-gray-700 dark:bg-gray-700/50 light:bg-gray-200'

  // Input/Form elements - more visible inputs
  const bgInput = 'bg-white/8 dark:bg-gray-800/80 light:bg-gray-100'
  const borderInput = 'border-white/15 dark:border-gray-700/50 light:border-gray-300'
  const textInput = 'text-white dark:text-gray-100 light:text-gray-900'
  const placeholderInput = 'placeholder:text-white/50 dark:placeholder:text-gray-500 light:placeholder:text-gray-400'

  // Common transitions
  const transition = 'transition-all duration-300'
  const transitionColors = 'transition-colors duration-300'

  // Common hover effects
  const hoverScale = 'hover:scale-[1.02]'
  const hoverScaleLarge = 'hover:scale-110'

  // List item classes
  const listItemBase = `${bgHover} ${hoverScale} cursor-pointer group ${transition}`
  const listItemRounded = 'rounded-lg p-3'

  // Shadow
  const shadowCard = 'shadow-sm dark:shadow-none light:shadow-md'
  const shadowIcon = 'shadow-lg dark:shadow-xl dark:shadow-black/40 light:shadow-md'

  // Skeleton loader - more visible and prominent
  const bgSkeleton = 'dark:bg-gray-700/80 light:bg-gray-300/80'

  // App Icon specific - better contrast and depth
  const bgIconContainer = 'dark:bg-gray-800/90 light:bg-white'
  const bgIconHover = 'dark:hover:bg-gray-700/90 light:hover:bg-gray-50'
  const iconTextColor = 'dark:text-gray-100 light:text-gray-900'
  const iconBorder = 'border dark:border-gray-700/60 light:border-gray-200/80'

  return {
    // Text
    textPrimary,
    textSecondary,
    textTertiary,
    textMuted,
    // Backgrounds
    bgCard,
    bgCardSolid,
    bgHover,
    bgButtonHover,
    bgHeader,
    bgFooter,
    bgPage,
    // Borders
    borderPrimary,
    borderSecondary,
    borderCard,
    // Dropdowns
    bgDropdown,
    bgDropdownSeparator,
    // Inputs
    bgInput,
    borderInput,
    textInput,
    placeholderInput,
    // Transitions
    transition,
    transitionColors,
    // Hover effects
    hoverScale,
    hoverScaleLarge,
    // List items
    listItemBase,
    listItemRounded,
    listItem: `${listItemBase} ${listItemRounded}`,
    // Shadows
    shadowCard,
    shadowIcon,
    // Skeleton
    bgSkeleton,
    // App Icons
    bgIconContainer,
    bgIconHover,
    iconTextColor,
    iconBorder,
  }
}

