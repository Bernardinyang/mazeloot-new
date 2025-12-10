/**
 * Composable for collection sorting logic
 */
import { computed, type Ref } from 'vue'

export interface SortableItem {
  id: number
  title: string
  dateCreated?: string
  date?: string
  [key: string]: any
}

export function useCollectionSort<T extends SortableItem>(
  items: Ref<T[]>,
  sortBy: Ref<string>
) {
  const sortedItems = computed(() => {
    const sorted = [...items.value]
    
    switch (sortBy.value) {
      case 'created-new-old':
      case 'date-new-old':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.dateCreated || a.date || 0).getTime()
          const dateB = new Date(b.dateCreated || b.date || 0).getTime()
          return dateB - dateA
        })
      
      case 'created-old-new':
      case 'date-old-new':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.dateCreated || a.date || 0).getTime()
          const dateB = new Date(b.dateCreated || b.date || 0).getTime()
          return dateA - dateB
        })
      
      case 'name-a-z':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      
      case 'name-z-a':
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      
      default:
        return sorted
    }
  })
  
  return {
    sortedItems,
  }
}

