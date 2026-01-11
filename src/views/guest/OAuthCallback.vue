<template>
  <AuthLayout description="Completing authentication..." title="Signing you in...">
    <div class="flex flex-col items-center justify-center space-y-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="text-sm text-muted-foreground">Please wait while we complete your sign-in...</p>
    </div>
  </AuthLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/utils/toast'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthApi } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { storage } from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const authApi = useAuthApi()
const userStore = useUserStore()
const { handleError } = useErrorHandler()

onMounted(async () => {
  try {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const token = params.get('token')
    const success = params.get('success')

    const error = route.query.error
    const errorMessage = route.query.message

    if (error) {
      throw new Error(errorMessage || 'OAuth authentication failed')
    }

    if (!token || success !== 'true') {
      throw new Error('No authentication token received')
    }

    // Store the token first
    userStore.token = token

    // Fetch user data using the token
    try {
      const response = await authApi.getUser()
      // Format user data to match what the store expects (same format as login)
      userStore.user = {
        id: response.user.uuid,
        uuid: response.user.uuid,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        name: `${response.user.first_name} ${response.user.last_name}`.trim(),
        avatar: response.user.profile_photo || null,
        emailVerified: !!response.user.email_verified_at,
      }
    } catch (error) {
      throw new Error('Failed to fetch user data. Please try logging in again.')
    }

    // Check if user is newly registered - if flag exists from localStorage, preserve it
    // Otherwise assume existing user (OAuth typically links to existing accounts)
    if (storage.get('mazeloot_new_user') !== true) {
      userStore.isNewUser = false
    }

    toast.success('Login successful!', {
      description: 'Welcome! Redirecting...',
    })

    // Redirect to the original destination or overview
    const redirect = route.query.redirect
    await router.push(redirect || { name: 'overview' })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Authentication failed. Please try again.',
    })

    // Redirect to login on error
    await router.push({ name: 'login' })
  }
})
</script>
