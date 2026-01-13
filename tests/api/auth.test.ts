import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthApi } from '@/shared/api/auth'

// Mock apiClient
vi.mock('@/shared/api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login user successfully', async () => {
      const { apiClient } = await import('@/shared/api/client')
      const mockResponse = {
        data: {
          user: {
            uuid: '1',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            email_verified_at: '2024-01-01',
          },
          token: 'test-token',
        },
      }
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const authApi = useAuthApi()
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = await authApi.login(credentials)

      expect(result.user.email).toBe(credentials.email)
      expect(result.token).toBeTruthy()
    })
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const { apiClient } = await import('@/shared/api/client')
      const mockResponse = {
        data: {
          user: {
            uuid: '1',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            email_verified_at: null,
          },
          requires_verification: false,
        },
      }
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const authApi = useAuthApi()
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true,
      }

      const result = await authApi.register(data)

      expect(result.user.name).toBe('Test User')
      expect(result.user.email).toBe(data.email)
    })
  })

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const { apiClient } = await import('@/shared/api/client')
      const mockResponse = {
        data: {
          user: {
            uuid: '1',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            email_verified_at: '2024-01-01',
          },
          token: 'test-token',
        },
      }
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const authApi = useAuthApi()

      await expect(authApi.verifyEmail('test@example.com', '123456')).resolves.not.toThrow()
    })
  })

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const { apiClient } = await import('@/shared/api/client')
      vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } })

      const authApi = useAuthApi()

      await expect(authApi.forgotPassword('test@example.com')).resolves.not.toThrow()
    })
  })

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const { apiClient } = await import('@/shared/api/client')
      vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } })

      const authApi = useAuthApi()

      await expect(authApi.resetPassword('token', 'newpassword')).resolves.not.toThrow()
    })
  })
})
