<template>
  <AuthLayout
    :title="showOtp ? 'Enter verification code' : 'Forgot password?'"
    :description="showOtp ? `We've sent a 6-digit code to ${email}` : 'Enter your email address and we will send you a verification code to reset your password'"
  >
    <Transition name="fade" mode="out-in">
      <!-- Email Form Section -->
      <div v-if="!showOtp" key="email-form" class="space-y-4">
        <Form @submit="handleForgotPassword" :validation-schema="emailSchema" v-slot="{ meta }" class="space-y-4">
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            autocomplete="email"
          />

          <Button type="submit" class="w-full" :disabled="loading || !meta.valid">
            {{ loading ? 'Sending...' : 'Send verification code' }}
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
            @complete="(code) => handleVerifyOtp(code)"
          />

          <Button type="submit" class="w-full" :disabled="otpLoading || !isOtpComplete">
            {{ otpLoading ? 'Verifying...' : 'Verify code' }}
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import { toast } from 'vue-sonner'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Button from '@/components/shadcn/Button.vue'
import FormField from '@/components/custom/FormField.vue'
import OtpInput from '@/components/custom/OtpInput.vue'
import AuthLink from '@/components/custom/AuthLink.vue'

const emailSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
})

const router = useRouter()
const loading = ref(false)
const otpLoading = ref(false)
const showOtp = ref(false)
const email = ref('')
const otpCode = ref('')
const otpResendCooldown = ref(0)

const isOtpComplete = computed(() => {
  return otpCode.value.length === 6
})

const handleForgotPassword = async (values: any) => {
  loading.value = true
  email.value = values.email
  try {
    // TODO: Implement actual forgot password logic
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toast.success('Verification code sent', {
      description: 'Please check your email for the verification code.',
    })
    showOtp.value = true
  } catch (error: any) {
    console.error('Forgot password error:', error)
    toast.error('Failed to send code', {
      description: error.message || 'Something went wrong. Please try again.',
    })
  } finally {
    loading.value = false
  }
}

const handleVerifyOtp = async (verificationCode?: string) => {
  const codeToVerify = verificationCode || otpCode.value
  if (!codeToVerify || codeToVerify.length !== 6) return

  otpLoading.value = true
  try {
    // TODO: Implement actual OTP verification logic
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toast.success('Code verified', {
      description: 'You can now reset your password.',
    })
    router.push({
      name: 'reset-password',
      query: { token: codeToVerify } // In real app, this would be a secure token from the API
    })
  } catch (error: any) {
    console.error('OTP verification error:', error)
    toast.error('Verification failed', {
      description: error.message || 'Invalid code. Please try again.',
    })
    otpCode.value = ''
  } finally {
    otpLoading.value = false
  }
}

const resendOtp = async () => {
  if (otpResendCooldown.value > 0) return

  try {
    // TODO: Implement actual resend logic
    otpResendCooldown.value = 60
    const interval = setInterval(() => {
      otpResendCooldown.value--
      if (otpResendCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)
    
    toast.success('Code resent', {
      description: 'Please check your email for the new code.',
    })
  } catch (error: any) {
    console.error('Resend error:', error)
    toast.error('Failed to resend code', {
      description: error.message || 'Please try again later.',
    })
  }
}

</script>

