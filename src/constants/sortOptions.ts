/**
 * Common sort options for collections and photos
 */
export interface SortOption {
  value: string
  label: string
}

export const COLLECTION_SORT_OPTIONS: SortOption[] = [
  { value: 'created-new-old', label: 'Created: New → Old' },
  { value: 'created-old-new', label: 'Created: Old → New' },
  { value: 'event-new-old', label: 'Event Date: New → Old' },
  { value: 'event-old-new', label: 'Event Date: Old → New' },
  { value: 'name-a-z', label: 'Name: A-Z' },
  { value: 'name-z-a', label: 'Name: Z-A' },
]

export const PHOTO_SORT_OPTIONS: SortOption[] = [
  { value: 'date-new-old', label: 'Date: New → Old' },
  { value: 'date-old-new', label: 'Date: Old → New' },
  { value: 'name-a-z', label: 'Name: A-Z' },
  { value: 'name-z-a', label: 'Name: Z-A' },
]

export const HOMEPAGE_SORT_OPTIONS: SortOption[] = [
  { value: 'date-new-old', label: 'Date created: New to Old' },
  { value: 'date-old-new', label: 'Date created: Old to New' },
  { value: 'name-a-z', label: 'Name: A-Z' },
  { value: 'name-z-a', label: 'Name: Z-A' },
  { value: 'custom', label: 'Custom' },
]

