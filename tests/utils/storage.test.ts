import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from '@/shared/utils/storage'

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('get', () => {
    it('should get item from localStorage', () => {
      localStorage.setItem('test', JSON.stringify({ name: 'test' }))
      const value = storage.get<{ name: string }>('test')

      expect(value).toEqual({ name: 'test' })
    })

    it('should return default value when item does not exist', () => {
      const value = storage.get('nonexistent', 'default')
      expect(value).toBe('default')
    })

    it('should return null when item does not exist and no default', () => {
      const value = storage.get('nonexistent')
      expect(value).toBeNull()
    })

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('invalid', 'not json')
      const value = storage.get('invalid', 'default')
      expect(value).toBe('default')
    })
  })

  describe('set', () => {
    it('should set item in localStorage', () => {
      storage.set('test', { name: 'test' })
      const value = localStorage.getItem('test')

      expect(value).toBe(JSON.stringify({ name: 'test' }))
    })

    it('should handle complex objects', () => {
      const complex = {
        nested: {
          array: [1, 2, 3],
          string: 'test',
        },
      }
      storage.set('complex', complex)
      const value = storage.get('complex')

      expect(value).toEqual(complex)
    })
  })

  describe('remove', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('test', 'value')
      storage.remove('test')

      expect(localStorage.getItem('test')).toBeNull()
    })
  })

  describe('clear', () => {
    it('should clear all localStorage', () => {
      localStorage.setItem('test1', 'value1')
      localStorage.setItem('test2', 'value2')
      storage.clear()

      expect(localStorage.getItem('test1')).toBeNull()
      expect(localStorage.getItem('test2')).toBeNull()
    })
  })

  describe('has', () => {
    it('should return true when key exists', () => {
      localStorage.setItem('test', 'value')
      expect(storage.has('test')).toBe(true)
    })

    it('should return false when key does not exist', () => {
      expect(storage.has('nonexistent')).toBe(false)
    })
  })
})
