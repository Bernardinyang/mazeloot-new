<template>
  <AuthLayout
    title="Create an account"
    description="Enter your information to get started"
  >
    <Form @submit="handleRegister" :validation-schema="schema" v-slot="{ meta }" class="space-y-4" :validate-on-blur="true" :validate-on-input="true">
          <FormField
            name="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            autocomplete="name"
          />

          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            autocomplete="email"
          />

          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            autocomplete="new-password"
            hint="Must be at least 8 characters with uppercase, lowercase, and a number"
          />

          <FormField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            autocomplete="new-password"
          />

            <div class="flex items-start space-x-2">
              <Field
                name="acceptTerms"
                type="checkbox"
                v-slot="{ field, errorMessage }"
                :value="true"
              >
                <input
                  id="terms"
                  v-bind="field"
                  type="checkbox"
                  class="h-4 w-4 rounded border-input mt-1"
                />
                <ErrorMessage :message="errorMessage" />
              </Field>
              <Label for="terms" class="text-sm font-normal cursor-pointer">
                I agree to the
                <a href="#" class="text-primary hover:underline">Terms of Service</a>
                and
                <a href="#" class="text-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>

            <Button type="submit" class="w-full" :disabled="loading || !meta.valid">
              {{ loading ? 'Creating account...' : 'Create account' }}
            </Button>
          </Form>

          <Divider />

          <GoogleButton text="Sign up with Google" @click="handleGoogleSignUp" />

          <AuthLink to="login" text="Sign in" prefix="Already have an account?" />
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
import Divider from '@/components/custom/Divider.vue'
import GoogleButton from '@/components/custom/GoogleButton.vue'
import AuthLink from '@/components/custom/AuthLink.vue'

const router = useRouter()
const loading = ref(false)

const schema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
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
  acceptTerms: yup
    .boolean()
    .required('You must accept the terms and conditions')
    .oneOf([true], 'You must accept the terms and conditions'),
})

const handleRegister = async (values: any) => {
  loading.value = true
  try {
    // TODO: Implement actual registration logic
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toast.success('Account created successfully!', {
      description: 'Please verify your email to continue.',
    })
    router.push({ name: 'verify-email' })
  } catch (error: any) {
    console.error('Registration error:', error)
    toast.error('Registration failed', {
      description: error.message || 'Something went wrong. Please try again.',
    })
  } finally {
    loading.value = false
  }
}

const handleGoogleSignUp = async () => {
  try {
    // TODO: Implement Google OAuth
    toast.info('Google sign up', {
      description: 'Google authentication will be implemented soon.',
    })
  } catch (error: any) {
    console.error('Google sign up error:', error)
    toast.error('Google sign up failed', {
      description: error.message || 'Something went wrong. Please try again.',
    })
  }
}
</script>

