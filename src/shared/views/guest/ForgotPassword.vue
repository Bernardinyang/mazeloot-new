<template>
  <AuthLayout
    :title="showOtp ? 'Enter verification code' : 'Forgot Password'"
    :description="
      showOtp
        ? `We've sent a 6-digit code to ${email}`
        : 'Enter your email address and we will send you a verification code to reset your password'
    "
  >
    <Transition name="fade" mode="out-in">
      <!-- Email Form Section -->
      <div v-if="!showOtp" key="email-form" class="space-y-4">
        <Form
          @submit="handleForgotPassword"
          :validation-schema="emailSchema"
          v-slot="{ meta }"
          class="space-y-4"
        >
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            autocomplete="email"
          />

          <Button type="submit" class="w-full" :disabled="loading || !meta.valid" :loading="loading" loading-label="Sending...">
            Send Code
          </Button>
        </Form>

        <AuthLink to="login" text="Back to login" />
      </div>

      <!-- OTP Verification Section -->
      <div v-else key="otp-form" class="space-y-6">
        <form @submit.prevent="() => handleVerifyOtp()" class="space-y-6">
          <OtpInput
            v-model="otpCode"
            label="Verification code"
            id="otp"
            :resend-cooldown="otpResendCooldown"
            @resend="resendOtp"
            @complete="code => handleVerifyOtp(code)"
          />

          <Button type="submit" class="w-full" :disabled="otpLoading || !isOtpComplete" :loading="otpLoading" loading-label="Verifying...">
            Verify Code
          </Button>
        </form>

        <div class="text-center text-sm">
          <button
            type="button"
            @click="showOtp = false"
            class="text-primary hover:underline font-medium"
          >
            Back to email
          </button>
        </div>
      </div>
    </Transition>
  </AuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import { toast } from '@/shared/utils/toast'
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import FormField from '@/shared/components/molecules/FormField.vue'
import OtpInput from '@/shared/components/molecules/OtpInput.vue'
import AuthLink from '@/shared/components/molecules/AuthLink.vue'
import { useAuthApi } from '@/shared/api/auth'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'

const emailSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
})

const router = useRouter()
const authApi = useAuthApi()
const { handleError } = useErrorHandler()
const loading = ref(false)
const otpLoading = ref(false)
const showOtp = ref(false)
const email = ref('')
const otpCode = ref('')
const otpResendCooldown = ref(0)

const isOtpComplete = computed(() => {
  return otpCode.value.length === 6
})

const handleForgotPassword = async values => {
  loading.value = true
  email.value = values.email
  try {
    await authApi.forgotPassword(values.email)

    toast.success('Verification code sent', {
      description: `A verification code has been sent to ${values.email}`,
    })
    showOtp.value = true
  } catch (error) {
    handleError(error, {
      fallbackMessage,
    })
  } finally {
    loading.value = false
  }
}

const handleVerifyOtp = async verificationCode => {
  const codeToVerify = verificationCode || otpCode.value
  if (!codeToVerify || codeToVerify.length !== 6) return

  otpLoading.value = true
  try {
    // Redirect to reset password page with email and code
    router.push({
      name: 'resetPassword',
      query: {
        email: email.value,
        code: codeToVerify,
      },
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to verify code',
    })
    otpCode.value = ''
  } finally {
    otpLoading.value = false
  }
}

const resendOtp = async () => {
  if (otpResendCooldown.value > 0) return

  try {
    await authApi.forgotPassword(email.value)

    otpResendCooldown.value = 60
    const interval = setInterval(() => {
      otpResendCooldown.value--
      if (otpResendCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    toast.success('Code resent', {
      description: `A new verification code has been sent to ${email.value}`,
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to resend code',
    })
  }
}
</script>
