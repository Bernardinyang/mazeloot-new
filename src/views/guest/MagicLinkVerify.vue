<template>
  <AuthLayout description="Verifying your magic link..." title="Signing you in...">
    <div class="flex flex-col items-center justify-center space-y-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="text-sm text-muted-foreground">Please wait while we verify your magic link...</p>
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

const route = useRoute()
const router = useRouter()
const authApi = useAuthApi()
const userStore = useUserStore()
const { handleError } = useErrorHandler()

onMounted(async () => {
  try {
    const token = route.query.token
    const email = route.query.email

    if (!token || !email) {
      throw new Error('Invalid magic link. Missing token or email.')
    }

    // Verify magic link
    const response = await authApi.verifyMagicLink(token, email)

    // Format user data to match what the store expects
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
    userStore.token = response.token

    toast.success('Login successful!', {
      description: 'Welcome! Redirecting...',
    })

    // Redirect to the original destination or overview
    const redirect = route.query.redirect
    await router.push(redirect || { name: 'overview' })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Invalid or expired magic link. Please try again.',
    })

    // Redirect to login on error
    await router.push({ name: 'login' })
  }
})
</script>
