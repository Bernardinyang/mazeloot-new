import { describe, it, expect } from 'vitest'
import { usePagination } from '@/composables/usePagination'

describe('usePagination Composable', () => {
  it('should initialize with correct values', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 1,
    })

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.itemsPerPage.value).toBe(10)
    expect(pagination.totalItems.value).toBe(100)
    expect(pagination.totalPages.value).toBe(10)
  })

  it('should calculate total pages correctly', () => {
    const pagination = usePagination({
      totalItems: 25,
      itemsPerPage: 10,
    })

    expect(pagination.totalPages.value).toBe(3)
  })

  it('should calculate range correctly', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 2,
    })

    expect(pagination.range.value.start).toBe(10)
    expect(pagination.range.value.end).toBe(20)
  })

  it('should navigate to next page', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
    })

    pagination.next()
    expect(pagination.currentPage.value).toBe(2)
  })

  it('should not navigate beyond last page', () => {
    const pagination = usePagination({
      totalItems: 10,
      itemsPerPage: 10,
      initialPage: 1,
    })

    pagination.next()
    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.hasNext.value).toBe(false)
  })

  it('should navigate to previous page', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 2,
    })

    pagination.prev()
    expect(pagination.currentPage.value).toBe(1)
  })

  it('should not navigate before first page', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
    })

    pagination.prev()
    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.hasPrev.value).toBe(false)
  })

  it('should go to specific page', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
    })

    pagination.goTo(5)
    expect(pagination.currentPage.value).toBe(5)
  })

  it('should not go to invalid page', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
    })

    pagination.goTo(0)
    expect(pagination.currentPage.value).toBe(1)

    pagination.goTo(11)
    expect(pagination.currentPage.value).toBe(1)
  })

  it('should update total items', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 5,
    })

    // 50 items with 10 per page = 5 pages, so page 5 is still valid
    pagination.updateTotal(50)

    expect(pagination.totalItems.value).toBe(50)
    expect(pagination.totalPages.value).toBe(5)
    // Page 5 is still valid, so it should remain
    expect(pagination.currentPage.value).toBe(5)

    // Now update to 30 items (3 pages), page 5 should reset to 1
    pagination.updateTotal(30)
    expect(pagination.currentPage.value).toBe(1)
  })

  it('should update items per page', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 5,
    })

    pagination.updateItemsPerPage(20)

    expect(pagination.itemsPerPage.value).toBe(20)
    expect(pagination.currentPage.value).toBe(1) // Should reset to page 1
  })

  it('should reset pagination', () => {
    const pagination = usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 5,
    })

    pagination.reset()

    expect(pagination.currentPage.value).toBe(1)
  })
})
