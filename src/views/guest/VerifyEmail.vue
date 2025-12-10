<template>
  <AuthLayout
    title="Verify your email"
    description="We've sent a verification code to your email address"
  >
    <div class="text-center mb-6">
      <div class="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <IconMail class="w-8 h-8 text-primary" :size="32" color="primary" />
      </div>
    </div>

    <form @submit.prevent="handleVerify" class="space-y-6">
          <OtpInput
            v-model="code"
            label="Enter verification code"
            id="code"
            :resend-cooldown="resendCooldown"
            @resend="resendCode"
            @complete="handleVerify"
          />

          <Button type="submit" class="w-full" :disabled="loading || !isCodeComplete">
            {{ loading ? 'Verifying...' : 'Verify email' }}
          </Button>
        </form>

        <AuthLink to="register" text="Sign up again" prefix="Wrong email?" />
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Button from '@/components/shadcn/Button.vue'
import OtpInput from '@/components/custom/OtpInput.vue'
import AuthLink from '@/components/custom/AuthLink.vue'
import IconMail from '@/icons/IconMail.vue'

const router = useRouter()
const loading = ref(false)
const code = ref('')
const resendCooldown = ref(0)

const isCodeComplete = computed(() => {
  return code.value.length === 6
})

const handleVerify = async (verificationCode?: string) => {
  const codeToVerify = verificationCode || code.value
  if (!codeToVerify || codeToVerify.length !== 6) return

  loading.value = true
  try {
    // TODO: Implement actual verification logic
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toast.success('Email verified successfully!', {
      description: 'Your email has been verified. You can now sign in.',
    })
    router.push({ name: 'login' })
  } catch (error: any) {
    console.error('Verification error:', error)
    toast.error('Verification failed', {
      description: error.message || 'Invalid verification code. Please try again.',
    })
    code.value = ''
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  if (resendCooldown.value > 0) return

  try {
    // TODO: Implement actual resend logic
    resendCooldown.value = 60
    const interval = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)
    
    toast.success('Verification code sent', {
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

