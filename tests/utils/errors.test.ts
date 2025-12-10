import { describe, it, expect } from 'vitest'
import {
  parseError,
  getErrorMessage,
  getFieldErrors,
  isNetworkError,
  isAuthError,
  isValidationError,
  AppError,
} from '@/utils/errors'

describe('Error Utilities', () => {
  describe('parseError', () => {
    it('should parse AppError instance', () => {
      const error = new AppError('Test error', 'TEST_CODE', 400)
      const parsed = parseError(error)

      expect(parsed.message).toBe('Test error')
      expect(parsed.code).toBe('TEST_CODE')
      expect(parsed.status).toBe(400)
    })

    it('should parse Error instance', () => {
      const error = new Error('Standard error')
      const parsed = parseError(error)

      expect(parsed.message).toBe('Standard error')
    })

    it('should parse API response error', () => {
      const error = {
        response: {
          status: 422,
          data: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            errors: {
              email: ['Email is required'],
              password: ['Password is too short'],
            },
          },
        },
      }
      const parsed = parseError(error)

      expect(parsed.message).toBe('Validation failed')
      expect(parsed.code).toBe('VALIDATION_ERROR')
      expect(parsed.status).toBe(422)
      expect(parsed.errors).toEqual({
        email: ['Email is required'],
        password: ['Password is too short'],
      })
    })

    it('should parse plain object error', () => {
      const error = {
        message: 'Custom error',
        code: 'CUSTOM_CODE',
        status: 500,
      }
      const parsed = parseError(error)

      expect(parsed.message).toBe('Custom error')
      expect(parsed.code).toBe('CUSTOM_CODE')
      expect(parsed.status).toBe(500)
    })

    it('should handle string error', () => {
      const parsed = parseError('String error')
      expect(parsed.message).toBe('String error')
    })

    it('should handle unknown error format', () => {
      const parsed = parseError(null)
      expect(parsed.message).toBe('An unexpected error occurred')
    })
  })

  describe('getErrorMessage', () => {
    it('should return error message from parsed error', () => {
      const error = new AppError('Test error')
      expect(getErrorMessage(error)).toBe('Test error')
    })

    it('should return fallback message for null errors', () => {
      expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback')
    })

    it('should use default fallback for null errors', () => {
      expect(getErrorMessage(null)).toBe('Something went wrong. Please try again.')
    })

    it('should return parsed message for valid errors', () => {
      const error = { message: 'Valid error' }
      expect(getErrorMessage(error)).toBe('Valid error')
    })
  })

  describe('getFieldErrors', () => {
    it('should extract field errors from validation error', () => {
      const error = {
        response: {
          status: 422,
          data: {
            errors: {
              email: ['Email is required', 'Email is invalid'],
              password: ['Password is too short'],
            },
          },
        },
      }
      const fieldErrors = getFieldErrors(error)

      expect(fieldErrors.email).toBe('Email is required')
      expect(fieldErrors.password).toBe('Password is too short')
    })

    it('should return empty object when no field errors', () => {
      const error = new Error('Generic error')
      const fieldErrors = getFieldErrors(error)

      expect(fieldErrors).toEqual({})
    })
  })

  describe('isNetworkError', () => {
    it('should detect network error by code', () => {
      const error = { code: 'NETWORK_ERROR' }
      expect(isNetworkError(error)).toBe(true)
    })

    it('should detect network error by message', () => {
      const error = { message: 'Network Error' }
      expect(isNetworkError(error)).toBe(true)
    })

    it('should return false for non-network errors', () => {
      const error = { message: 'Other error' }
      expect(isNetworkError(error)).toBe(false)
    })
  })

  describe('isAuthError', () => {
    it('should detect 401 error', () => {
      const error = parseError({ status: 401 })
      expect(isAuthError(error)).toBe(true)
    })

    it('should detect 403 error', () => {
      const error = parseError({ status: 403 })
      expect(isAuthError(error)).toBe(true)
    })

    it('should return false for non-auth errors', () => {
      const error = parseError({ status: 404 })
      expect(isAuthError(error)).toBe(false)
    })
  })

  describe('isValidationError', () => {
    it('should detect 422 error', () => {
      const error = parseError({ status: 422 })
      expect(isValidationError(error)).toBe(true)
    })

    it('should detect validation error by errors property', () => {
      const error = { errors: { field: ['Error'] } }
      expect(isValidationError(error)).toBe(true)
    })

    it('should return false for non-validation errors', () => {
      const error = parseError({ status: 500 })
      expect(isValidationError(error)).toBe(false)
    })
  })
})
