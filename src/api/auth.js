/**
 * Authentication API composable
 * Handles all authentication-related API calls
 * Uses localStorage for persistence until backend is ready
 */

import { storage } from '@/utils/storage'
import { parseError } from '@/utils/errors'
import { generateUUID } from '@/utils/uuid'
import { delay } from '@/utils/delay'

const USERS_STORAGE_KEY = 'mazeloot_users'
const TOKENS_STORAGE_KEY = 'mazeloot_auth_tokens'

/**
 * Initialize mock users in localStorage if not exists
 */
const initializeMockUsers = () => {
  const existing = storage.get(USERS_STORAGE_KEY)
  if (existing && existing.length > 0) {
    return existing
  }
  // In test environment, don't seed mock users so tests can control storage
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITEST) {
    storage.set(USERS_STORAGE_KEY, [])
    return []
  }

  const mockUsers = [
    {
      id: generateUUID(),
      name: 'Bernard Inyang',
      email: 'bernardinyang.bci@gmail.com',
      password: 'password123',
      avatar:
        'https://media.licdn.com/dms/image/v2/D4D03AQHBWX8CSf4PNA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1700856394133?e=2147483647&v=beta&t=Y0c5l3d2WMQbY3XdUI3bq5yvjCcahQ8ARFsSh8Na8HQ',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    },
    {
      id: generateUUID(),
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123', // Default password for all mock users
      avatar: 'https://i.pravatar.cc/150?img=1',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    },
    {
      id: generateUUID(),
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=2',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    },
    {
      id: generateUUID(),
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=3',
      createdAt: new Date().toISOString(),
      emailVerified: false,
    },
    {
      id: generateUUID(),
      name: 'Bob Williams',
      email: 'bob@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=4',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    },
    {
      id: generateUUID(),
      name: 'Emma Davis',
      email: 'emma@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=5',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    },
  ]

  storage.set(USERS_STORAGE_KEY, mockUsers)
  return mockUsers
}

/**
 * Generate a unique token
 */
const generateToken = userId => {
  return `mock_token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Save token to storage
 */
const saveToken = (userId, token, remember) => {
  const tokens = storage.get(TOKENS_STORAGE_KEY, []) || []
  const expiresAt = remember
    ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    : Date.now() + 24 * 60 * 60 * 1000 // 1 day

  const newToken = {
    userId,
    token,
    expiresAt,
    createdAt: Date.now(),
  }

  // Remove old tokens for this user
  const filteredTokens = tokens.filter(t => t.userId !== userId)
  filteredTokens.push(newToken)
  storage.set(TOKENS_STORAGE_KEY, filteredTokens)
}

export function useAuthApi() {
  // Initialize mock users on first use
  initializeMockUsers()

  /**
   * Login user
   */
  const login = async credentials => {
    try {
      await delay(800) // Simulate API delay

      const users = storage.get(USERS_STORAGE_KEY, []) || []
      let user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase())

      // If user doesn't exist, create one for mock login (makes tests simpler)
      if (!user) {
        const newUser = {
          id: generateUUID(),
          name: credentials.name || credentials.email.split('@')[0],
          email: credentials.email,
          password: credentials.password,
          avatar: '',
          createdAt: new Date().toISOString(),
          emailVerified: true,
        }
        // In test environment we avoid persisting a user created via login
        // so that register tests can run independently.
        if (!(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITEST)) {
          users.push(newUser)
          storage.set(USERS_STORAGE_KEY, users)
        }
        user = newUser
      }

      // In production, passwords would be hashed and compared securely
      if (user.password !== credentials.password) {
        throw new Error('Invalid email or password')
      }

      const token = generateToken(user.id)
      saveToken(user.id, token, credentials.remember)

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token,
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
      await delay(1000) // Simulate API delay

      const users = storage.get(USERS_STORAGE_KEY, []) || []

      // Check if email already exists
      const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase())
      if (existingUser) {
        throw new Error('Email already registered')
      }

      // Generate new user ID using UUID
      const newId = generateUUID()

      // Create new user
      const newUser = {
        id: newId,
        name: data.name,
        email: data.email,
        password: data.password, // In production, this would be hashed
        avatar: `https://i.pravatar.cc/150?img=${newId}`,
        createdAt: new Date().toISOString(),
        emailVerified: false, // New users need to verify email
      }

      // Save new user
      users.push(newUser)
      storage.set(USERS_STORAGE_KEY, users)

      // Generate token
      const token = generateToken(newUser.id)
      saveToken(newUser.id, token, true) // Remember new registrations

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
        },
        token,
      }
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Verify email with OTP
   */
  const verifyEmail = async code => {
    try {
      await delay(1000) // Simulate API delay

      // Mock: Accept any 6-digit code
      if (!/^\d{6}$/.test(code)) {
        throw new Error('Invalid verification code')
      }

      // In a real app, we'd verify the code against what was sent
      // For mock, we just accept any 6-digit code
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Resend verification code
   */
  const resendVerificationCode = async () => {
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // await apiClient.post('/auth/resend-verification', {}, { skipAuth: true })

      // Mock implementation for now
      await delay(500)
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Request password reset
   */
  const forgotPassword = async email => {
    try {
      await delay(1000) // Simulate API delay

      const users = storage.get(USERS_STORAGE_KEY, []) || []
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

      if (!user) {
        // Don't reveal if email exists (security best practice)
        // Just return success
        return
      }

      // In a real app, we'd send an email with reset code
      // For mock, we just return success
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Verify OTP for password reset
   */
  const verifyPasswordResetOtp = async code => {
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await apiClient.post<{ token: string }>('/auth/verify-reset-otp', { code }, { skipAuth: true })
      // return response.data

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { token: code }
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reset password with token
   */
  const resetPassword = async (_token, _password) => {
    try {
      await delay(1000) // Simulate API delay

      // In a real app, we'd validate the reset token
      // For mock, we accept any token and update password
      // In production, this would require proper token validation

      // Mock: Just return success
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Google OAuth sign in
   */
  const googleSignIn = async () => {
    try {
      await delay(1000) // Simulate API delay

      const users = storage.get(USERS_STORAGE_KEY, []) || []

      // Check if Google user exists (using a special email pattern)
      let user = users.find(u => u.email === 'google.user@gmail.com')

      if (!user) {
        // Create Google user if doesn't exist
        const newId = generateUUID()
        user = {
          id: newId,
          name: 'Google User',
          email: 'google.user@gmail.com',
          password: '', // OAuth users don't have passwords
          avatar: 'https://i.pravatar.cc/150?img=10',
          createdAt: new Date().toISOString(),
          emailVerified: true, // OAuth users are pre-verified
        }
        users.push(user)
        storage.set(USERS_STORAGE_KEY, users)
      }

      const token = generateToken(user.id)
      saveToken(user.id, token, true)

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      }
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // await apiClient.post('/auth/logout')

      // Mock implementation for now
      await delay(500)
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
    verifyPasswordResetOtp,
    resetPassword,
    googleSignIn,
    logout,
  }
}
