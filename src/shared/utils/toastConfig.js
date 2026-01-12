/**
 * Toast Configuration Utility
 * Provides easy access to change toast design types
 *
 * Usage:
 *   import { setToastDesign, getToastDesigns } from '@/shared/utils/toastConfig'
 *   setToastDesign('2') // Change to design type 2
 *   const designs = getToastDesigns() // Get all available designs
 */

import { useThemeStore } from '@/shared/stores/theme'

/**
 * Available toast design types
 */
export const TOAST_DESIGNS = {
  TYPE_1: '1', // Light pink background with red x icon in white circle
  TYPE_2: '2', // Solid red background with white text
  TYPE_3: '3', // White background with red square icon
  TYPE_4: '4', // Light pink background with progress bar
  TYPE_5: '5', // White background with pill shape, light pink circle icon
}

/**
 * Get all available toast design types
 */
export function getToastDesigns() {
  return Object.values(TOAST_DESIGNS)
}

/**
 * Set the toast design type
 * @param {string} designType - One of: '1', '2', '3', '4', '5'
 */
export function setToastDesign(designType) {
  const themeStore = useThemeStore()
  themeStore.setToastDesign(designType)
}

/**
 * Get the current toast design type
 */
export function getToastDesign() {
  const themeStore = useThemeStore()
  return themeStore.toastDesign
}
