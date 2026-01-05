/**
 * Color utility functions
 */

/**
 * Generate a random hex color
 * @returns {string} A random hex color (e.g., "#14B8A6")
 */
export function generateRandomColor() {
  // Generate random RGB values
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  // Convert to hex
  const toHex = n => {
    const hex = n.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Generate a random color from a curated palette of nice colors
 * @returns {string} A random color from the palette
 */
export function generateRandomColorFromPalette() {
  const palette = [
    '#14B8A6', // Teal
    '#8B5CF6', // Purple
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#6366F1', // Indigo
    '#84CC16', // Lime
    '#22C55E', // Green
    '#A855F7', // Violet
    '#F43F5E', // Rose
    '#0EA5E9', // Sky
    '#64748B', // Slate
  ]

  return palette[Math.floor(Math.random() * palette.length)]
}

/**
 * Generate a deterministic color from a string (e.g., ID)
 * @param {string} str - Input string
 * @returns {string} A color from the palette
 */
export function generateColorFromString(str) {
  const palette = [
    '#14B8A6', // Teal
    '#8B5CF6', // Purple
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#6366F1', // Indigo
    '#84CC16', // Lime
    '#22C55E', // Green
    '#A855F7', // Violet
    '#F43F5E', // Rose
    '#0EA5E9', // Sky
    '#64748B', // Slate
  ]

  // Simple hash function
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string (e.g., "#14B8A6")
 * @returns {Object} RGB object with r, g, b values (0-255)
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Lighten a color by a percentage
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened hex color
 */
export function lightenColor(hex, percent = 50) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * (percent / 100)))
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * (percent / 100)))
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * (percent / 100)))

  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Darken a color by a percentage
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
export function darkenColor(hex, percent = 50) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const r = Math.max(0, Math.round(rgb.r * (1 - percent / 100)))
  const g = Math.max(0, Math.round(rgb.g * (1 - percent / 100)))
  const b = Math.max(0, Math.round(rgb.b * (1 - percent / 100)))

  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Get color palette definitions
 * Format: [primary, secondary, background] where background is mostly light
 * @returns {Object} Object with palette id as key and [primary, secondary, background] array as value
 */
export function getColorPalettes() {
  return {
    light: ['#3B82F6', '#60A5FA', '#F9FAFB'],
    neutral: ['#6B7280', '#9CA3AF', '#F3F4F6'],
    gold: ['#F59E0B', '#FBBF24', '#FEF3C7'],
    rose: ['#EC4899', '#F472B6', '#FCE7F3'],
    terracotta: ['#EA580C', '#FB923C', '#FFEDD5'],
    lavender: ['#A855F7', '#C084FC', '#F3E8FF'],
    olive: ['#84CC16', '#A3E635', '#ECFCCB'],
    agave: ['#10B981', '#34D399', '#D1FAE5'],
    sea: ['#0EA5E9', '#38BDF8', '#E0F2FE'],
    coral: ['#F43F5E', '#FB7185', '#FFE4E6'],
    sage: ['#22C55E', '#4ADE80', '#DCFCE7'],
    peach: ['#FB923C', '#FDBA74', '#FFF7ED'],
    mint: ['#14B8A6', '#5EEAD4', '#CCFBF1'],
    slate: ['#64748B', '#94A3B8', '#F1F5F9'],
    amber: ['#F59E0B', '#FBBF24', '#FEF3C7'],
    indigo: ['#6366F1', '#818CF8', '#EEF2FF'],
    emerald: ['#10B981', '#34D399', '#D1FAE5'],
    cyan: ['#06B6D4', '#22D3EE', '#CFFAFE'],
    violet: ['#8B5CF6', '#A78BFA', '#EDE9FE'],
    sunset: ['#F97316', '#FB923C', '#FFF7ED'],
    ocean: ['#0C4A6E', '#0369A1', '#E0F2FE'],
    forest: ['#166534', '#22C55E', '#DCFCE7'],
    wine: ['#991B1B', '#DC2626', '#FEE2E2'],
    sky: ['#0284C7', '#0EA5E9', '#E0F2FE'],
    blossom: ['#DB2777', '#EC4899', '#FCE7F3'],
    sand: ['#D97706', '#F59E0B', '#FEF3C7'],
    moss: ['#365314', '#65A30D', '#ECFCCB'],
    plum: ['#7C2D12', '#C2410C', '#FFEDD5'],
    azure: ['#1E40AF', '#3B82F6', '#DBEAFE'],
    dusk: ['#7C3AED', '#8B5CF6', '#EDE9FE'],
    dark: ['#1F2937', '#374151', '#F9FAFB'],
    cherry: ['#BE123C', '#F43F5E', '#FEE2E2'],
    teal: ['#0D9488', '#14B8A6', '#CCFBF1'],
    navy: ['#1E3A8A', '#3B82F6', '#DBEAFE'],
    orchid: ['#C026D3', '#D946EF', '#FAE8FF'],
    jade: ['#059669', '#10B981', '#D1FAE5'],
    rust: ['#B45309', '#F59E0B', '#FEF3C7'],
    iris: ['#5B21B6', '#7C3AED', '#EDE9FE'],
    honey: ['#92400E', '#F59E0B', '#FEF3C7'],
    lagoon: ['#155E75', '#06B6D4', '#CFFAFE'],
    mauve: ['#86198F', '#A855F7', '#F3E8FF'],
    lime: ['#365314', '#65A30D', '#ECFCCB'],
    bronze: ['#78350F', '#F59E0B', '#FEF3C7'],
    cobalt: ['#1E40AF', '#3B82F6', '#DBEAFE'],
    fuchsia: ['#A21CAF', '#D946EF', '#FAE8FF'],
    seafoam: ['#0F766E', '#14B8A6', '#CCFBF1'],
    marigold: ['#854D0E', '#FBBF24', '#FEF3C7'],
    periwinkle: ['#4338CA', '#6366F1', '#EEF2FF'],
    sagebrush: ['#166534', '#22C55E', '#DCFCE7'],
    cream: ['#9C6F47', '#C9A882', '#FEFCF3'],
  }
}

/**
 * Calculate relative luminance for WCAG contrast ratio
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {number} Relative luminance (0-1)
 */
function getRelativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  if (!rgb1 || !rgb2) return 1

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Get text color based on background with proper contrast
 * @param {string} bgHex - Background hex color
 * @param {number} minContrast - Minimum contrast ratio (default 4.5 for AA)
 * @returns {string} Text color ('#000000' or '#FFFFFF')
 */
export function getTextColorFromBackground(bgHex, minContrast = 4.5) {
  if (!bgHex) return '#000000'
  
  const rgb = hexToRgb(bgHex)
  if (!rgb) return '#000000'

  const bgLum = getRelativeLuminance(rgb.r, rgb.g, rgb.b)
  
  // Test both black and white text
  const blackContrast = getContrastRatio(bgHex, '#000000')
  const whiteContrast = getContrastRatio(bgHex, '#FFFFFF')
  
  // Choose the color with better contrast
  if (blackContrast >= minContrast && blackContrast >= whiteContrast) {
    return '#000000'
  }
  if (whiteContrast >= minContrast && whiteContrast >= blackContrast) {
    return '#FFFFFF'
  }
  
  // If neither meets minimum, choose the one with better contrast
  return blackContrast > whiteContrast ? '#000000' : '#FFFFFF'
}

/**
 * Get text color for use on an accent/primary color background
 * @param {string} accentHex - Accent/primary color
 * @returns {string} Text color ('#000000' or '#FFFFFF')
 */
export function getTextColorForAccent(accentHex) {
  return getTextColorFromBackground(accentHex, 4.5)
}

/**
 * Get color palette array format for UI components
 * Format: [{ id, label, colors: [primary, secondary, background] }]
 * @returns {Array} Array of palette objects with id, label, and colors
 */
export function getColorPalettesArray() {
  const palettes = getColorPalettes()
  const labels = {
    light: 'Light',
    neutral: 'Neutral',
    gold: 'Gold',
    rose: 'Rose',
    terracotta: 'Terracotta',
    lavender: 'Lavender',
    olive: 'Olive',
    agave: 'Agave',
    sea: 'Sea',
    coral: 'Coral',
    sage: 'Sage',
    peach: 'Peach',
    mint: 'Mint',
    slate: 'Slate',
    amber: 'Amber',
    indigo: 'Indigo',
    emerald: 'Emerald',
    cyan: 'Cyan',
    violet: 'Violet',
    sunset: 'Sunset',
    ocean: 'Ocean',
    forest: 'Forest',
    wine: 'Wine',
    sky: 'Sky',
    blossom: 'Blossom',
    sand: 'Sand',
    moss: 'Moss',
    plum: 'Plum',
    azure: 'Azure',
    dusk: 'Dusk',
    dark: 'Dark',
    cherry: 'Cherry',
    teal: 'Teal',
    navy: 'Navy',
    orchid: 'Orchid',
    jade: 'Jade',
    rust: 'Rust',
    iris: 'Iris',
    honey: 'Honey',
    lagoon: 'Lagoon',
    mauve: 'Mauve',
    lime: 'Lime',
    bronze: 'Bronze',
    cobalt: 'Cobalt',
    fuchsia: 'Fuchsia',
    seafoam: 'Seafoam',
    marigold: 'Marigold',
    periwinkle: 'Periwinkle',
    sagebrush: 'Sagebrush',
    cream: 'Cream',
  }
  
  return Object.entries(palettes).map(([id, colors]) => ({
    id,
    label: labels[id] || id.charAt(0).toUpperCase() + id.slice(1),
    colors,
  }))
}
