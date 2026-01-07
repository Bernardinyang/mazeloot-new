<template>
  <AuthLayout
    title="Verify your email"
    description="We've sent a verification code to your email address"
  >
    <div class="text-center mb-6">
      <div
        class="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
      >
        <IconMail class="w-8 h-8 text-primary" :size="32" color="primary" />
      </div>
    </div>

    <form @submit.prevent="() => handleVerify()" class="space-y-6">
      <OtpInput
        v-model="code"
        label="Enter verification code"
        id="code"
        :resend-cooldown="resendCooldown"
        @resend="resendCode"
        @complete="handleVerify"
      />

      <Button type="submit" class="w-full" :disabled="loading || !isCodeComplete" :loading="loading" loading-label="Verifying...">
        Verify Email
      </Button>
    </form>

    <AuthLink to="register" text="Sign up again" prefix="Wrong email?" />
  </AuthLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from '@/utils/toast'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { Button } from '@/components/shadcn/button'
import OtpInput from '@/components/molecules/OtpInput.vue'
import AuthLink from '@/components/molecules/AuthLink.vue'
import IconMail from '@/icons/IconMail.vue'
import { useAuthApi } from '@/api/auth'
import { useErrorHandler } from '@/composables/useErrorHandler'

const router = useRouter()
const route = useRoute()
const authApi = useAuthApi()
const { handleError } = useErrorHandler()
const loading = ref(false)
const code = ref('')
const resendCooldown = ref(0)
const email = ref('')

const isCodeComplete = computed(() => {
  return code.value.length === 6
})

onMounted(() => {
  email.value = route.query.email || ''
  if (!email.value) {
    router.push({ name: 'register' })
  }
})

const handleVerify = async verificationCode => {
  const codeToVerify = verificationCode || code.value
  if (!codeToVerify || codeToVerify.length !== 6) return
  if (!email.value) return

  loading.value = true
  try {
    const response = await authApi.verifyEmail(email.value, codeToVerify)

    // Save user and token to store
    const { useUserStore } = await import('@/stores/user')
    const userStore = useUserStore()
    userStore.user = response.user
    userStore.token = response.token

    toast.success('Email verified successfully!', {
      description: 'Your email has been verified successfully',
    })

    // Redirect to overview
    const redirect = route.query.redirect
    router.push(redirect || { name: 'overview' })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to verify email',
    })
    code.value = ''
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  if (resendCooldown.value > 0 || !email.value) return

  try {
    await authApi.resendVerificationCode(email.value)

    resendCooldown.value = 60
    const interval = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    toast.success('Verification code sent', {
      description: 'A new verification code has been sent to your email',
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to verify email',
    })
  }
}
</script>
