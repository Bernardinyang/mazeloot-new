/**
 * User Store
 * Manages user authentication state and user data
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { storage } from '@/utils/storage'
import { useAuthApi } from '@/api/auth'
import type { AuthResponse } from '@/api/auth'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isLoading = ref(false)

  const authApi = useAuthApi()

  /**
   * Initialize user from localStorage
   */
  const init = () => {
    const storedUser = storage.get<User>('mazeloot_user')
    const storedToken = storage.get<string>('mazeloot_token')

    if (storedUser && storedToken) {
      user.value = storedUser
      token.value = storedToken
    }
  }

  // Watch for changes and persist to localStorage
  watch(
    user,
    newUser => {
      if (newUser) {
        storage.set('mazeloot_user', newUser)
      } else {
        storage.remove('mazeloot_user')
      }
    },
    { deep: true }
  )

  watch(token, newToken => {
    if (newToken) {
      storage.set('mazeloot_token', newToken)
    } else {
      storage.remove('mazeloot_token')
    }
  })

  /**
   * Login user
   */
  const login = async (email: string, password: string, remember?: boolean) => {
    isLoading.value = true
    try {
      const response = await authApi.login({ email, password, remember })

      user.value = response.user
      token.value = response.token

      // Persistence is handled by watchers
      // If remember is false, we'll clear on logout

      return response
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Register new user
   */
  const register = async (name: string, email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await authApi.register({
        name,
        email,
        password,
        confirmPassword: password,
        acceptTerms: true,
      })

      user.value = response.user
      token.value = response.token

      return response
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    isLoading.value = true
    try {
      await authApi.logout()
    } finally {
      clearAuth()
      isLoading.value = false
    }
  }

  /**
   * Clear authentication data
   */
  const clearAuth = () => {
    user.value = null
    token.value = null
    // Persistence is handled by watchers
  }

  /**
   * Update user data
   */
  const updateUser = (data: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...data }
      // Persistence is handled by watcher
    }
  }

  // Initialize on store creation
  init()

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    clearAuth,
  }
})
