<template>
  <AuthLayout description="Welcome back! Please enter your details." title="Welcome back!">
    <Form v-slot="{ meta }" :validation-schema="schema" class="space-y-4" @submit="handleLogin">
      <FormField
        autocomplete="email"
        label="Email"
        name="email"
        placeholder="name@example.com"
        type="email"
      />

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label for="password">Password</Label>
          <RouterLink
            :to="{ name: 'forgotPassword' }"
            class="text-sm text-primary hover:underline font-medium"
          >
            Forgot password
          </RouterLink>
        </div>
        <FormField
          autocomplete="current-password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
      </div>

      <div class="flex items-center space-x-2">
        <Field v-slot="{ field }" :value="true" name="remember" type="checkbox">
          <input
            id="remember"
            class="h-4 w-4 rounded border-input"
            type="checkbox"
            v-bind="field"
          />
        </Field>
        <Label class="text-sm font-normal cursor-pointer" for="remember">
          Remember for 30 days
        </Label>
      </div>

      <Button :disabled="loading || !meta.valid" class="w-full" type="submit">
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </Button>
    </Form>

    <Divider />

    <GoogleButton text="Sign in with Google" @click="handleGoogleSignIn" />

    <AuthLink prefix="Don't have an account?" text="Sign up" to="register" />
  </AuthLayout>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Field, Form } from 'vee-validate'
import * as yup from 'yup'
import { toast } from '@/utils/toast'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { Button } from '@/components/shadcn/button'
import FormField from '@/components/molecules/FormField.vue'
import Label from '@/components/shadcn/Label.vue'
import Divider from '@/components/atoms/Divider.vue'
import GoogleButton from '@/components/molecules/GoogleButton.vue'
import AuthLink from '@/components/molecules/AuthLink.vue'
import { useUserStore } from '@/stores/user'
import { useErrorHandler } from '@/composables/useErrorHandler'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { handleError } = useErrorHandler()
const loading = computed(() => userStore.isLoading)

const schema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  remember: yup.boolean(),
})

const handleLogin = async values => {
  console.log('Login values:', values)
  try {
    await userStore.login(values.email, values.password, values.remember)

    toast.success('Welcome back! Redirecting...')

    // Redirect to the original destination or overview
    const redirect = route.query.redirect
    await router.push(redirect || { name: 'overview' })
  } catch (error) {
    console.error('Login error:', error)
    await handleError(error, {
      fallbackMessage: 'Invalid email or password. Please try again.',
    })
  }
}

const handleGoogleSignIn = async () => {
  try {
    const { useAuthApi } = await import('@/api/auth')
    const authApi = useAuthApi()
    const redirectUrl = await authApi.googleSignIn()

    // Redirect to Google OAuth
    window.location.href = redirectUrl
  } catch (error) {
    console.error('Google sign in error:', error)
    await handleError(error, {
      fallbackMessage: 'Google sign in failed. Please try again.',
    })
  }
}
</script>
