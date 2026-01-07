<template>
  <AuthLayout description="Enter your information to get started" title="Create an account">
    <Form
      v-slot="{ meta }"
      :validate-on-blur="true"
      :validate-on-input="true"
      :validation-schema="schema"
      class="space-y-4"
      @submit="handleRegister"
    >
      <FormField
        autocomplete="name"
        label="Full Name"
        name="name"
        placeholder="John Doe"
        type="text"
      />

      <FormField
        autocomplete="email"
        label="Email"
        name="email"
        placeholder="name@example.com"
        type="email"
      />

      <FormField
        autocomplete="new-password"
        hint="Must be at least 8 characters with uppercase, lowercase, and a number"
        label="Password"
        name="password"
        placeholder="Create a password"
        type="password"
      />

      <FormField
        autocomplete="new-password"
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Confirm your password"
        type="password"
      />

      <div class="flex items-start space-x-2">
        <Field v-slot="{ field, errorMessage }" :value="true" name="acceptTerms" type="checkbox">
          <input
            id="terms"
            class="h-4 w-4 rounded border-input mt-1"
            type="checkbox"
            v-bind="field"
          />
          <ErrorMessage :message="errorMessage" />
        </Field>
        <Label class="text-sm font-normal cursor-pointer" for="terms">
          I agree to the
          <a class="text-primary hover:underline" href="#">Terms of Service</a>
          and
          <a class="text-primary hover:underline" href="#">Privacy Policy</a>
        </Label>
      </div>

      <Button :disabled="loading || !meta.valid" class="w-full" type="submit" :loading="loading" loading-label="Creating account...">
        Create Account
      </Button>
    </Form>

    <Divider />

    <GoogleButton text="Sign up with Google" @click="handleGoogleSignUp" />

    <AuthLink prefix="Already have an account?" text="Sign in" to="login" />
  </AuthLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Field, Form } from 'vee-validate'
import * as yup from 'yup'
import { toast } from '@/utils/toast'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { Button } from '@/components/shadcn/button'
import FormField from '@/components/molecules/FormField.vue'
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
  name: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
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

const handleRegister = async values => {
  try {
    // Register user
    const response = await userStore.register(values.name, values.email, values.password)

    if (response.requires_verification) {
      toast.success('Account created successfully!', {
        description: 'Please verify your email to continue',
      })

      // Redirect to email verification page
      await router.push({
        name: 'verifyEmail',
        query: { email: values.email, redirect: route.query.redirect },
      })
    } else {
      toast.success('Account created successfully!', {
        description: 'Welcome! Redirecting...',
      })

      // Redirect to overview or original destination
      const redirect = route.query.redirect
      await router.push(redirect || { name: 'overview' })
    }
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'An error occurred during registration',
    })
  }
}

const handleGoogleSignUp = async () => {
  try {
    const { useAuthApi } = await import('@/api/auth')
    const authApi = useAuthApi()
    const redirectUrl = await authApi.googleSignIn()

    // Redirect to Google OAuth
    window.location.href = redirectUrl
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Google sign up failed. Please try again.',
    })
  }
}
</script>
