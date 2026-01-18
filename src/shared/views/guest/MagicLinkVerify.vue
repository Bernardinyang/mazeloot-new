<template>
  <AuthLayout
    :description="error ? 'Magic link verification failed' : 'Verifying your magic link...'"
    :title="error ? 'Verification Failed' : 'Signing you in...'"
  >
    <div v-if="error" class="flex flex-col items-center justify-center space-y-4">
      <div
        class="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4"
      >
        <AlertCircle :size="32" class="text-destructive" />
      </div>
      <div class="text-center space-y-2">
        <p class="text-sm font-medium text-foreground">Invalid or expired magic link</p>
        <p class="text-sm text-muted-foreground">
          The magic link has expired or is invalid. Please request a new one.
        </p>
      </div>
      <Button :disabled="loading || resendCooldown > 0" class="w-full mt-4" @click="handleResend">
        <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
        <span v-if="loading">Sending...</span>
        <span v-else-if="resendCooldown > 0">Resend link ({{ resendCooldown }}s)</span>
        <span v-else>Resend magic link</span>
      </Button>
      <AuthLink text="Back to login" to="login" />
    </div>
    <div v-else class="flex flex-col items-center justify-center space-y-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="text-sm text-muted-foreground">Please wait while we verify your magic link...</p>
    </div>
  </AuthLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle, Loader2 } from '@/shared/utils/lucideAnimated'
import { toast } from '@/shared/utils/toast'
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import AuthLink from '@/shared/components/molecules/AuthLink.vue'
import { useAuthApi } from '@/shared/api/auth'
import { useUserStore } from '@/shared/stores/user'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'

const route = useRoute()
const router = useRouter()
const authApi = useAuthApi()
const userStore = useUserStore()
const { handleError } = useErrorHandler()

const loading = ref(false)
const error = ref(false)
const resendCooldown = ref(0)
const email = ref('')

onMounted(async () => {
  loading.value = true
  try {
    const token = route.query.token
    email.value = route.query.email

    if (!token || !email.value) {
      throw new Error('Invalid magic link. Missing token or email.')
    }

    const response = await authApi.verifyMagicLink(token, email.value)

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

    // Don't clear isNewUser on magic link - preserve flag if user was previously registered
    // If user was previously registered, flag will persist; if existing user, flag is already false

    toast.success('Login successful!', {
      description: 'Welcome! Redirecting...',
    })

    const redirect = route.query.redirect
    await router.push(redirect || { name: 'overview' })
  } catch (err) {
    error.value = true
    handleError(err, {
      fallbackMessage: 'Invalid or expired magic link. Please try again.',
    })
  } finally {
    loading.value = false
  }
})

const handleResend = async () => {
  if (!email.value || loading.value || resendCooldown.value > 0) return

  loading.value = true
  try {
    await authApi.sendMagicLink(email.value)

    resendCooldown.value = 60
    const interval = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    toast.success('Magic link sent!', {
      description: 'A new magic link has been sent to your email',
    })
  } catch (err) {
    handleError(err, {
      fallbackMessage: 'Failed to send magic link. Please try again.',
    })
  } finally {
    loading.value = false
  }
}
</script>
