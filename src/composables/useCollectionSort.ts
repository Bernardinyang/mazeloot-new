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

export function useCollectionSort<T extends SortableItem>(items: Ref<T[]>, sortBy: Ref<string>) {
  const sortedItems = computed(() => {
    const sorted = [...items.value]

    switch (sortBy.value) {
      case 'created-new-old':
      case 'date-new-old':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.dateCreated || a.createdAt || a.date || 0).getTime()
          const dateB = new Date(b.dateCreated || b.createdAt || b.date || 0).getTime()
          return dateB - dateA
        })

      case 'created-old-new':
      case 'date-old-new':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.dateCreated || a.createdAt || a.date || 0).getTime()
          const dateB = new Date(b.dateCreated || b.createdAt || b.date || 0).getTime()
          return dateA - dateB
        })

      case 'name-a-z':
        return sorted.sort((a, b) => {
          const nameA = (a.title || a.name || '').toLowerCase()
          const nameB = (b.title || b.name || '').toLowerCase()
          return nameA.localeCompare(nameB)
        })

      case 'name-z-a':
        return sorted.sort((a, b) => {
          const nameA = (a.title || a.name || '').toLowerCase()
          const nameB = (b.title || b.name || '').toLowerCase()
          return nameB.localeCompare(nameA)
        })

      default:
        return sorted
    }
  })

  return {
    sortedItems,
  }
}
