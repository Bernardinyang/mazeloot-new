<template>
  <AuthLayout
    title="Welcome back!"
    description="Welcome back! Please enter your details."
  >
    <Form @submit="handleLogin" :validation-schema="schema" v-slot="{ meta }" class="space-y-4">
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            autocomplete="email"
          />

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
              <RouterLink
                :to="{ name: 'forgot-password' }"
                class="text-sm text-primary hover:underline font-medium"
              >
                Forgot password
              </RouterLink>
            </div>
            <FormField
              name="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
          </div>

          <div class="flex items-center space-x-2">
            <Field
              name="remember"
              type="checkbox"
              v-slot="{ field }"
              :value="true"
            >
              <input
                id="remember"
                v-bind="field"
                type="checkbox"
                class="h-4 w-4 rounded border-input"
              />
            </Field>
            <Label for="remember" class="text-sm font-normal cursor-pointer">
              Remember for 30 days
            </Label>
          </div>

          <Button type="submit" class="w-full" :disabled="loading || !meta.valid">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </Button>
        </Form>

        <Divider />

        <GoogleButton text="Sign in with Google" @click="handleGoogleSignIn" />

        <AuthLink to="register" text="Sign up" prefix="Don't have an account?" />
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { toast } from 'vue-sonner'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Button from '@/components/shadcn/Button.vue'
import FormField from '@/components/custom/FormField.vue'
import Label from '@/components/shadcn/Label.vue'
import Divider from '@/components/custom/Divider.vue'
import GoogleButton from '@/components/custom/GoogleButton.vue'
import AuthLink from '@/components/custom/AuthLink.vue'
import { RouterLink } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  remember: yup.boolean(),
})

const handleLogin = async (values: any) => {
  loading.value = true
  try {
    // TODO: Implement actual login logic
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toast.success('Login successful!', {
      description: 'Welcome back!',
    })
    router.push({ name: 'overview' })
  } catch (error: any) {
    console.error('Login error:', error)
    toast.error('Login failed', {
      description: error.message || 'Invalid email or password. Please try again.',
    })
  } finally {
    loading.value = false
  }
}

const handleGoogleSignIn = async () => {
  try {
    // TODO: Implement Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toast.success('Login successful!', {
      description: 'Welcome back!',
    })
    router.push({ name: 'overview' })
  } catch (error: any) {
    console.error('Google sign in error:', error)
    toast.error('Google sign in failed', {
      description: error.message || 'Something went wrong. Please try again.',
    })
  }
}
</script>

