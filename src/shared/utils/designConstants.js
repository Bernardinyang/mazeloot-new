import { Grid3x3, LayoutGrid, Type, Image as ImageIcon } from '@/shared/utils/lucideAnimated'

// Grid layout options
export const gridStyles = [
  { id: 'grid', label: 'Grid', icon: Grid3x3 },
  { id: 'masonry', label: 'Masonry', icon: LayoutGrid },
]

// Grid columns options
export const gridColumnsOptions = [
  { value: 2, label: '2 Columns' },
  { value: 3, label: '3 Columns' },
  { value: 4, label: '4 Columns' },
  { value: 5, label: '5 Columns' },
]

// Thumbnail sizes (orientation-based)
export const thumbnailSizes = [
  { id: 'small', label: 'Portrait' },
  { id: 'medium', label: 'Square' },
  { id: 'large', label: 'Landscape' },
]

// Navigation styles
export const navigationStyles = [
  { id: 'icon-text', label: 'Icon & Text', icon: Grid3x3 },
  { id: 'icon-only', label: 'Icon Only', icon: ImageIcon },
  { id: 'text-only', label: 'Text Only', icon: Type },
]

// Font style options
export const fontStyleOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' },
]

// Default design values
export const defaultDesignValues = {
  fontFamily: 'sans',
  fontStyle: 'normal',
  colorPalette: 'light',
  gridStyle: 'grid',
  gridColumns: 3,
  thumbnailSize: 'medium',
  gridSpacing: 16,
  tabStyle: 'icon-text',
}

// Helper to get grid style icon
export const getGridStyleIcon = (styleId) => {
  const style = gridStyles.find(s => s.id === styleId)
  return style?.icon || Grid3x3
}

// Helper to get navigation style icon
export const getNavigationStyleIcon = (styleId) => {
  const style = navigationStyles.find(s => s.id === styleId)
  return style?.icon || Grid3x3
}

