/**
 * Composable for common page header functionality
 * Provides search, sort, and view toggle functionality
 */
import { ref, computed } from 'vue'
import { useThemeClasses } from './useThemeClasses'

export function usePageHeader(options) {
  const theme = useThemeClasses()

  const searchQuery = ref('')
  const sortBy = ref(options?.defaultSort || 'date-new-old')
  const viewMode = ref(options?.defaultViewMode || 'grid')

  const sortOptions = computed(() => options?.sortOptions || [])

  const filteredItems = (items, searchFields = []) => {
    if (!searchQuery.value.trim()) {
      return items
    }

    const query = searchQuery.value.toLowerCase()
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field]
        return value && String(value).toLowerCase().includes(query)
      })
    })
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
