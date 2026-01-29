/**
 * Authentication API composable
 * Handles all authentication-related API calls
 */

import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'

export function useAuthApi() {
  /**
   * Login user
   */
  const login = async credentials => {
    try {
      const response = await apiClient.post(
        '/v1/auth/login',
        {
          email: credentials.email,
          password: credentials.password,
        },
        { skipAuth: true }
      )

      return {
        user: {
          id: response.data.user.uuid,
          uuid: response.data.user.uuid,
          email: response.data.user.email,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          name: `${response.data.user.first_name} ${response.data.user.last_name}`.trim(),
          avatar: response.data.user.profile_photo || null,
          emailVerified: !!response.data.user.email_verified_at,
          role: response.data.user.role,
          early_access: response.data.user.early_access,
        },
        token: response.data.token,
      }
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Register new user
   */
  const register = async data => {
    try {
      const response = await apiClient.post(
        '/v1/auth/register',
        {
          first_name: data.name ? data.name.split(' ')[0] : data.first_name,
          last_name: data.name ? data.name.split(' ').slice(1).join(' ') : data.last_name,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword || data.password,
        },
        { skipAuth: true }
      )

      return {
        user: {
          id: response.data.user.uuid,
          uuid: response.data.user.uuid,
          email: response.data.user.email,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          name: `${response.data.user.first_name} ${response.data.user.last_name}`.trim(),
          avatar: null,
          emailVerified: !!response.data.user.email_verified_at,
          role: response.data.user.role,
          early_access: response.data.user.early_access,
        },
        token: null, // No token until email is verified
        requires_verification: response.data.requires_verification || false,
      }
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Verify email with OTP
   */
  const verifyEmail = async (email, code) => {
    try {
      const response = await apiClient.post(
        '/v1/auth/verify-email',
        {
          email,
          code,
        },
        { skipAuth: true }
      )

      return {
        user: {
          id: response.data.user.uuid,
          uuid: response.data.user.uuid,
          email: response.data.user.email,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          name: `${response.data.user.first_name} ${response.data.user.last_name}`.trim(),
          avatar: null,
          emailVerified: !!response.data.user.email_verified_at,
        },
        token: response.data.token,
      }
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Resend verification code
   */
  const resendVerificationCode = async email => {
    try {
      await apiClient.post('/v1/auth/resend-verification', { email }, { skipAuth: true })
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Request password reset
   */
  const forgotPassword = async email => {
    try {
      await apiClient.post('/v1/auth/forgot-password', { email }, { skipAuth: true })
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Verify password reset code
   */
  const verifyPasswordResetCode = async (email, code) => {
    try {
      await apiClient.post(
        '/v1/auth/verify-reset-code',
        { email, code },
        { skipAuth: true }
      )
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reset password with code
   */
  const resetPassword = async (email, code, password, passwordConfirmation) => {
    try {
      await apiClient.post(
        '/v1/auth/reset-password',
        {
          email,
          code,
          password,
          password_confirmation: passwordConfirmation || password,
        },
        { skipAuth: true }
      )
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Google OAuth sign in
   * Returns the redirect URL that the frontend should navigate to
   */
  const googleSignIn = async () => {
    try {
      const response = await apiClient.get('/v1/auth/oauth/google/redirect', { skipAuth: true })
      return response.data.redirect_url
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Handle Google OAuth callback
   * Called after user returns from OAuth provider
   */
  const googleSignInCallback = async () => {
    try {
      const response = await apiClient.get('/v1/auth/oauth/google/callback', { skipAuth: true })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Logout user
   */
  /**
   * Send magic link to email
   */
  const sendMagicLink = async email => {
    try {
      const response = await apiClient.post(
        '/v1/auth/magic-link/send',
        { email },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Verify magic link token
   */
  const verifyMagicLink = async (token, email) => {
    try {
      const response = await apiClient.post(
        '/v1/auth/magic-link/verify',
        { token, email },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const getUser = async () => {
    try {
      const response = await apiClient.get('/v1/auth/user')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Check if user has access to a specific feature
   */
  const checkFeature = async (feature) => {
    try {
      const response = await apiClient.get(`/v1/early-access/features/${feature}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get user's available features
   */
  const getAvailableFeatures = async () => {
    try {
      const response = await apiClient.get('/v1/early-access/features')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const getStorage = async () => {
    try {
      const response = await apiClient.get('/v1/auth/storage')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const logout = async () => {
    try {
      // TODO: Call backend logout endpoint if needed
      // For now, just return success (token revocation handled client-side)
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    verifyPasswordResetCode,
    resetPassword,
    googleSignIn,
    googleSignInCallback,
    sendMagicLink,
    verifyMagicLink,
    getUser,
    getStorage,
    logout,
    checkFeature,
    getAvailableFeatures,
  }
}
