/**
 * Common dropdown menu configuration constants
 */
export const DROPDOWN_MENU_CLASSES = {
  content: 'bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-200',
  separator: 'bg-gray-700 dark:bg-gray-700 light:bg-gray-200',
  item: 'text-white dark:text-white light:text-gray-900 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-100 cursor-pointer',
  label: 'text-white dark:text-white light:text-gray-900',
} as const

export const QUICK_ACTIONS = [
  { icon: 'Mail', label: 'Email message', color: 'text-blue-400' },
  { icon: 'Calendar', label: 'Calendar event', color: 'text-blue-400' },
  { icon: 'StickyNote', label: 'Note', color: 'text-yellow-400' },
  { icon: 'ListTodo', label: 'Reminder', color: 'text-blue-400' },
  { icon: 'FileEdit', label: 'Pages document', color: 'text-orange-400' },
  { icon: 'FileSpreadsheet', label: 'Numbers spreadsheet', color: 'text-green-400' },
  { icon: 'Presentation', label: 'Keynote presentation', color: 'text-blue-400' },
] as const

export const APP_SWITCHER_APPS = [
  { icon: 'GalleryVerticalEnd', label: 'Memora' },
  { icon: 'GalleryVerticalEnd', label: 'Collections' },
] as const

