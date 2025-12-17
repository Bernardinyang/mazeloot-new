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

      <Button type="submit" class="w-full" :disabled="loading || !isCodeComplete">
        {{ loading ? 'Verifying...' : 'Verify Email' }}
      </Button>
    </form>

    <AuthLink to="register" text="Sign up again" prefix="Wrong email?" />
  </AuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { Button } from '@/components/shadcn/button'
import OtpInput from '@/components/molecules/OtpInput.vue'
import AuthLink from '@/components/molecules/AuthLink.vue'
import IconMail from '@/icons/IconMail.vue'
import { useAuthApi } from '@/api/auth'
import { useErrorHandler } from '@/composables/useErrorHandler'

const router = useRouter()
const authApi = useAuthApi()
const { handleError } = useErrorHandler()
const loading = ref(false)
const code = ref('')
const resendCooldown = ref(0)

const isCodeComplete = computed(() => {
  return code.value.length === 6
})

const handleVerify = async verificationCode => {
  const codeToVerify = verificationCode || code.value
  if (!codeToVerify || codeToVerify.length !== 6) return

  loading.value = true
  try {
    await authApi.verifyEmail(codeToVerify)

    toast.success('Email verified successfully!', {
      description: 'Your email has been verified successfully',
    })
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Verification error:', error)
    handleError(error, {
      fallbackMessage: 'Failed to verify email',
    })
    code.value = ''
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  if (resendCooldown.value > 0) return

  try {
    await authApi.resendVerificationCode()

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
    console.error('Resend error:', error)
    handleError(error, {
      fallbackMessage: 'Failed to verify email',
    })
  }
}
</script>
