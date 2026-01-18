/**
 * Import icon configurations from separate file
 * Allows easy icon updates and maintenance
 */
import { getFileTypeIconConfig } from './fileTypeIcons'

/**
 * Get Lucide icon SVG path for file type
 * Uses imported icon configurations
 */
function getFileTypeIcon(fileType, mimeType) {
    return getFileTypeIconConfig(fileType, mimeType)
}

/**
 * Detect current theme (dark/light)
 */
function detectTheme() {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Get theme-based colors
 */
function getThemeColors(theme, iconColor) {
    if (theme === 'dark') {
        return {
            backgroundColor: '#111827', // gray-900
            textColor: '#F3F4F6', // gray-100
            iconColor: iconColor,
            iconOpacity: '0.9',
            overlayOpacity: '0.1',
        }
    } else {
        return {
            backgroundColor: '#F9FAFB', // gray-50
            textColor: '#1F2937', // gray-800
            iconColor: iconColor,
            iconOpacity: '0.8',
            overlayOpacity: '0.06',
        }
    }
}

/**
 * Get a default cover/thumbnail for files that cannot be previewed
 * Returns an SVG data URL showing the file type/extension with matching icon
 */
export function getFileTypeCover(file, options = {}) {
    const {
        width = 200,
        height = 200,
        fontSize = 11,
        iconSize = 80,
        theme = detectTheme(),
        borderRadius = 12,
    } = options

    // Get file extension from filename or mime type
    const filename = file?.filename || file?.name || file?.title || 'file'
    const mimeType = file?.mime_type || file?.mimeType || file?.type || ''

    let fileExtension = ''
    let fileType = 'FILE'

    // Extract extension from filename
    const extMatch = filename.match(/\.([^.]+)$/)
    if (extMatch) {
        fileExtension = extMatch[1].toUpperCase()
        fileType = fileExtension
    } else if (mimeType) {
        // Extract type from mime type
        const mimeMatch = mimeType.match(/\/([^/]+)$/)
        if (mimeMatch) {
            fileType = mimeMatch[1].toUpperCase()
        } else {
            fileType = mimeType.toUpperCase().replace(/[\/\-\s]+/g, '')
        }
    }

    // Limit file type display length
    if (fileType.length > 10) {
        fileType = fileType.substring(0, 10)
    }

    // Get icon for file type
    const icon = getFileTypeIcon(fileExtension || fileType, mimeType)
    const themeColors = getThemeColors(theme, icon.color)

    const iconX = width / 2
    const iconY = height / 2 - 6
    const textY = height / 2 + iconSize / 2 + 16
    const scale = iconSize / 24

    // Lucide icons are in 24x24 viewBox, so center point is 12,12
    const iconCenterX = 12
    const iconCenterY = 12

    // Generate unique gradient ID to avoid conflicts
    const gradientId = `bgGrad-${Math.random().toString(36).substr(2, 9)}`

    // Create SVG paths from Lucide icon paths array
    const iconPaths = icon.paths.map(path => `
        <path 
          d="${path}" 
          fill="none" 
          stroke="${themeColors.iconColor}" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          opacity="${themeColors.iconOpacity}"
        />
    `).join('')

    // Create SVG with icon and text
    // Transform: translate to center, scale, then translate icon center offset
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${themeColors.backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${themeColors.backgroundColor};stop-opacity:0.98" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${gradientId})"/>
      <rect width="${width}" height="${height}" rx="${borderRadius}" fill="${themeColors.iconColor}" opacity="${themeColors.overlayOpacity}"/>
      <g transform="translate(${iconX - iconCenterX * scale}, ${iconY - iconCenterY * scale}) scale(${scale})">
        ${iconPaths}
      </g>
      <text 
        x="50%" 
        y="${textY}" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif" 
        font-size="${fontSize}" 
        font-weight="500" 
        letter-spacing="0.3px"
        fill="${themeColors.textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        opacity="0.9"
      >${fileType}</text>
    </svg>
  `.trim()

    // Convert to data URL
    return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Check if a file can be previewed (is image or video)
 */
export function canPreviewFile(file) {
    const mimeType = file?.mime_type || file?.mimeType || file?.type || ''
    const fileType = file?.type || ''

    // Check if it's an image
    if (mimeType.startsWith('image/') || fileType === 'image') {
        return true
    }

    // Check if it's a video
    if (mimeType.startsWith('video/') || fileType === 'video') {
        return true
    }

    return false
}
