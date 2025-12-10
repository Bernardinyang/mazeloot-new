import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthApi } from '@/api/auth'

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login user successfully', async () => {
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
      const authApi = useAuthApi()
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true,
      }

      const result = await authApi.register(data)

      expect(result.user.name).toBe(data.name)
      expect(result.user.email).toBe(data.email)
      expect(result.token).toBeTruthy()
    })
  })

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const authApi = useAuthApi()

      await expect(authApi.verifyEmail('123456')).resolves.not.toThrow()
    })
  })

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const authApi = useAuthApi()

      await expect(authApi.forgotPassword('test@example.com')).resolves.not.toThrow()
    })
  })

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const authApi = useAuthApi()

      await expect(authApi.resetPassword('token', 'newpassword')).resolves.not.toThrow()
    })
  })
})
