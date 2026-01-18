/**
 * File type icon configuration
 * Import Lucide icons here - paths will be extracted automatically
 * Easy to maintain and update icons
 */

// Icon paths from Lucide (can be imported from lucide package if needed)
// Using Lucide icon SVG paths - these match lucide-vue-next icons

export const fileTypeIcons = {
  // Archive/Zip files
  archive: {
    paths: ['M21 8v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'],
    color: '#F59E0B', // amber-500
  },

  // Audio files
  audio: {
    paths: [
      'M9 18V5l12-2v13',
      'm9 4-8 8',
      'M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm12-3c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z'
    ],
    color: '#8B5CF6', // violet-500
  },

  // Video files
  video: {
    paths: [
      'M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z',
      'M10 2v20',
      'M14 2v20',
      'M4 7h16',
      'M4 17h16'
    ],
    color: '#EF4444', // red-500
  },

  // PDF files
  pdf: {
    paths: [
      'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z',
      'M14 2v4a2 2 0 0 0 2 2h4',
      'M16 13H8',
      'M16 17H8',
      'M10 9H8',
      'M10 9h4'
    ],
    color: '#DC2626', // red-600
  },

  // Document files
  document: {
    paths: [
      'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z',
      'M14 2v4a2 2 0 0 0 2 2h4',
      'M10 9H8',
      'M16 13H8',
      'M16 17H8',
      'M10 21H8'
    ],
    color: '#2563EB', // blue-600
  },

  // Spreadsheet files
  spreadsheet: {
    paths: [
      'M12 3v18',
      'M3 12h18',
      'M3 6h18',
      'M3 18h18'
    ],
    color: '#059669', // emerald-600
  },

  // Presentation files
  presentation: {
    paths: [
      'M2 3h20',
      'M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3z',
      'M7 21l5-5 5 5'
    ],
    color: '#D97706', // amber-600
  },

  // Code files
  code: {
    paths: [
      'm18 16 4-4-4-4',
      'M6 8l-4 4 4 4',
      'M14.5 4l-5 16'
    ],
    color: '#7C3AED', // violet-600
  },

  // Raw camera files
  rawCamera: {
    paths: [
      'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
      'M12 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
    ],
    color: '#0891B2', // cyan-600
  },

  // Default file icon
  default: {
    paths: [
      'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z',
      'M14 2v4a2 2 0 0 0 2 2h4'
    ],
    color: '#6B7280', // gray-500
  },
}

/**
 * Helper function to get icon config for file type
 */
export function getFileTypeIconConfig(fileType, mimeType) {
  const ext = fileType.toLowerCase()
  const mime = mimeType.toLowerCase()

  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext) || mime.includes('zip') || mime.includes('rar') || mime.includes('tar') || mime.includes('gzip')) {
    return fileTypeIcons.archive
  }

  if (['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a', 'wma', 'amr'].includes(ext) || mime.startsWith('audio/')) {
    return fileTypeIcons.audio
  }

  if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp', 'mts', 'm2ts'].includes(ext) || mime.startsWith('video/')) {
    return fileTypeIcons.video
  }

  if (ext === 'pdf' || mime === 'application/pdf') {
    return fileTypeIcons.pdf
  }

  if (['doc', 'docx', 'odt', 'rtf', 'txt'].includes(ext) || mime.includes('document') || mime.includes('msword') || mime.includes('wordprocessing')) {
    return fileTypeIcons.document
  }

  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext) || mime.includes('spreadsheet') || mime.includes('excel')) {
    return fileTypeIcons.spreadsheet
  }

  if (['ppt', 'pptx', 'odp'].includes(ext) || mime.includes('presentation') || mime.includes('powerpoint')) {
    return fileTypeIcons.presentation
  }

  if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml', 'php', 'py', 'java', 'cpp', 'c', 'rb', 'go', 'rs'].includes(ext) || mime.includes('javascript') || mime.includes('json') || mime.includes('xml') || mime.includes('text/plain')) {
    return fileTypeIcons.code
  }

  if (['cr2', 'cr3', 'nef', 'arw', 'raf', 'orf', 'rw2', 'pef', 'srw', 'dng', 'crw', 'x3f'].includes(ext) || mime.includes('raw') || mime.includes('cr2') || mime.includes('nef') || mime.includes('arw')) {
    return fileTypeIcons.rawCamera
  }

  return fileTypeIcons.default
}
