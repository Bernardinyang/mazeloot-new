/**
 * User Store
 * Manages user authentication state and user data
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { storage } from '@/utils/storage'
import { useAuthApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isLoading = ref(false)
  const isNewUser = ref(false)

  const authApi = useAuthApi()

  /**
   * Initialize user from localStorage
   */
  const init = () => {
    // Use mazeloot_ prefixed keys, migrate from legacy keys if needed
    let storedUser = storage.get('mazeloot_user')
    let storedToken = storage.get('mazeloot_token')

    // If not found, check legacy keys and migrate
    if (!storedUser || !storedToken) {
      const legacyUser = storage.get('user')
      const legacyToken = storage.get('token')

      if (legacyUser && legacyToken) {
        // Migrate to new keys
        storage.set('mazeloot_user', legacyUser)
        storage.set('mazeloot_token', legacyToken)
        storedUser = legacyUser
        storedToken = legacyToken
      }
    }

    // Clean up legacy keys if they exist
    if (storage.has('user')) {
      storage.remove('user')
    }
    if (storage.has('token')) {
      storage.remove('token')
    }

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
        // Also clean up legacy key if it exists
        storage.remove('user')
      }
    },
    { deep: true }
  )

  watch(token, newToken => {
    if (newToken) {
      storage.set('mazeloot_token', newToken)
    } else {
      storage.remove('mazeloot_token')
      // Also clean up legacy key if it exists
      storage.remove('token')
    }
  })

  /**
   * Login user
   */
  const login = async (email, password, remember) => {
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
  const register = async (name, email, password) => {
    isLoading.value = true
    try {
      const response = await authApi.register({
        name,
        email,
        password,
        confirmPassword: password,
        acceptTerms: true,
      })

      // Only set user and token if email is verified
      if (response.token) {
        user.value = response.user
        token.value = response.token
      } else {
        // Store user temporarily for verification flow
        user.value = response.user
        token.value = null
      }

      return {
        user: response.user,
        token: response.token,
        requires_verification: response.requires_verification || false,
      }
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
    isNewUser.value = false
    // Persistence is handled by watchers
  }

  /**
   * Mark user as not new (after they've been through onboarding)
   */
  const markUserAsExisting = () => {
    isNewUser.value = false
    storage.remove('mazeloot_new_user')
  }

  /**
   * Update user data
   */
  const updateUser = data => {
    if (user.value) {
      user.value = { ...user.value, ...data }
      // Persistence is handled by watcher
    }
  }

  /**
   * Initialize user from localStorage
   */
  const initNewUserFlag = () => {
    const storedNewUser = storage.get('mazeloot_new_user')
    if (storedNewUser === true) {
      isNewUser.value = true
    } else {
      // Only set to false if explicitly false, otherwise keep default
      // This prevents clearing the flag on page refresh for new users
      if (storedNewUser === false) {
        isNewUser.value = false
      }
    }
  }

  // Watch isNewUser and persist to localStorage
  watch(isNewUser, newValue => {
    if (newValue) {
      storage.set('mazeloot_new_user', true)
    } else {
      storage.remove('mazeloot_new_user')
    }
  })

  // Initialize on store creation
  init()
  initNewUserFlag()

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isNewUser,
    login,
    register,
    logout,
    updateUser,
    clearAuth,
    markUserAsExisting,
  }
})
