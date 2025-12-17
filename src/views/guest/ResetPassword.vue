<template>
  <AuthLayout title="Reset password" description="Enter your new password below">
    <Form
      @submit="handleResetPassword"
      :validation-schema="schema"
      v-slot="{ meta }"
      class="space-y-4"
      :validate-on-blur="true"
      :validate-on-input="true"
    >
      <FormField
        name="password"
        label="New Password"
        type="password"
        placeholder="Enter new password"
        autocomplete="new-password"
        hint="Must be at least 8 characters with uppercase, lowercase, and a number"
      />

      <FormField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm new password"
        autocomplete="new-password"
      />

      <Button type="submit" class="w-full" :disabled="loading || !meta.valid">
        {{ loading ? 'Resetting password...' : 'Reset Password' }}
      </Button>
    </Form>

    <AuthLink to="login" text="Back to login" />
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import { toast } from 'vue-sonner'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { Button } from '@/components/shadcn/button'
import FormField from '@/components/molecules/FormField.vue'
import AuthLink from '@/components/molecules/AuthLink.vue'
import { useAuthApi } from '@/api/auth'
import { useErrorHandler } from '@/composables/useErrorHandler'

const description = ''

const router = useRouter()
const route = useRoute()
const authApi = useAuthApi()
const { handleError } = useErrorHandler()
const loading = ref(false)

const schema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

const handleResetPassword = async values => {
  const token = route.query.token
  if (!token) {
    toast.error('Invalid token', {
      description,
    })
    router.push({ name: 'login' })
    return
  }

  loading.value = true
  try {
    await authApi.resetPassword(token, values.password)

    toast.success('Password reset successfully!', {
      description,
    })
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Reset password error:', error)
    handleError(error, {
      fallbackMessage,
    })
  } finally {
    loading.value = false
  }
}
</script>
