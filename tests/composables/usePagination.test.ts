import { describe, it, expect } from 'vitest'
import { usePagination } from '@/shared/composables/usePagination'

describe('usePagination Composable', () => {
  it('should initialize with default values', () => {
    const pagination = usePagination()

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.itemsPerPage.value).toBe(10)
  })

  it('should initialize with custom values', () => {
    const pagination = usePagination({ initialPage: 2, itemsPerPage: 20 })

    expect(pagination.currentPage.value).toBe(2)
    expect(pagination.itemsPerPage.value).toBe(20)
  })

  it('should calculate total pages', () => {
    const pagination = usePagination({ totalItems: 25, itemsPerPage: 10 })

    expect(pagination.totalPages.value).toBe(3)
  })

  it('should go to next page', () => {
    const pagination = usePagination({ totalItems: 30, itemsPerPage: 10 })

    pagination.next()
    expect(pagination.currentPage.value).toBe(2)
  })

  it('should go to previous page', () => {
    const pagination = usePagination({ initialPage: 2, totalItems: 30, itemsPerPage: 10 })

    pagination.prev()
    expect(pagination.currentPage.value).toBe(1)
  })

  it('should not go below page 1', () => {
    const pagination = usePagination({ totalItems: 30, itemsPerPage: 10 })

    pagination.prev()
    expect(pagination.currentPage.value).toBe(1)
  })

  it('should go to specific page', () => {
    const pagination = usePagination({ totalItems: 30, itemsPerPage: 10 })

    pagination.goTo(3)
    expect(pagination.currentPage.value).toBe(3)
  })

  it('should update total items', () => {
    const pagination = usePagination({ totalItems: 30, itemsPerPage: 10 })

    pagination.updateTotal(50)
    expect(pagination.totalItems.value).toBe(50)
    expect(pagination.totalPages.value).toBe(5)
  })

  it('should reset to page 1 when items per page changes', () => {
    const pagination = usePagination({ initialPage: 5, totalItems: 100, itemsPerPage: 10 })

    pagination.updateItemsPerPage(20)
    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.itemsPerPage.value).toBe(20)
  })

  it('should compute range', () => {
    const pagination = usePagination({ initialPage: 2, itemsPerPage: 10 })

    expect(pagination.range.value.start).toBe(10)
    expect(pagination.range.value.end).toBe(20)
  })

  it('should compute hasNext and hasPrev', () => {
    const pagination = usePagination({ initialPage: 2, totalItems: 30, itemsPerPage: 10 })

    expect(pagination.hasNext.value).toBe(true)
    expect(pagination.hasPrev.value).toBe(true)

    pagination.goTo(1)
    expect(pagination.hasPrev.value).toBe(false)

    pagination.goTo(3)
    expect(pagination.hasNext.value).toBe(false)
  })
})
