/**
 * Composable for common page header functionality
 * Provides search, sort, and view toggle functionality
 */
import { ref, computed } from 'vue'
import { useThemeClasses } from './useThemeClasses'

export interface SortOption {
  value: string
  label: string
}

export interface ViewMode {
  value: 'grid' | 'list'
  label: string
  icon: any
}

export function usePageHeader(options?: {
  defaultSort?: string
  defaultViewMode?: 'grid' | 'list'
  sortOptions?: SortOption[]
}) {
  const theme = useThemeClasses()

  const searchQuery = ref('')
  const sortBy = ref(options?.defaultSort || 'date-new-old')
  const viewMode = ref<'grid' | 'list'>(options?.defaultViewMode || 'grid')

  const sortOptions = computed(() => options?.sortOptions || [])

  const filteredItems = <T extends any[]>(items: T, searchFields: (keyof T[number])[] = []): T => {
    if (!searchQuery.value.trim()) {
      return items
    }

    const query = searchQuery.value.toLowerCase()
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field]
        return value && String(value).toLowerCase().includes(query)
      })
    }) as T
  }

  return {
    theme,
    searchQuery,
    sortBy,
    viewMode,
    sortOptions,
    filteredItems,
  }
}
