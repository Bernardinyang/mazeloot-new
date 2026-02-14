<template>
  <AuthLayout description="Enter your information to get started" title="Create an account">
    <div
      v-if="referralActive"
      class="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 px-4 py-3 flex items-center gap-3 text-sm text-violet-800 dark:text-violet-200"
      role="status"
      aria-live="polite"
    >
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-600 dark:text-violet-400" aria-hidden="true">
        <Gift class="h-4 w-4" />
      </span>
      <span>Referral code applied. You’ll get $20 off your first bill when you subscribe.</span>
    </div>
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
          <a class="text-accent hover:underline" href="#">Terms of Service</a>
          and
          <a class="text-accent hover:underline" href="#">Privacy Policy</a>
        </Label>
      </div>

      <Button
        :disabled="loading || !meta.valid"
        :loading="loading"
        class="w-full"
        loading-label="Creating account..."
        type="submit"
      >
        Create Account
      </Button>
    </Form>

    <Divider />

    <GoogleButton
      :loading="googleSignUpLoading"
      text="Sign up with Google"
      @click="handleGoogleSignUp"
    />

    <AuthLink prefix="Already have an account?" text="Sign in" to="login" />
  </AuthLayout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Field, Form } from 'vee-validate'
import * as yup from 'yup'
import { Gift } from 'lucide-vue-next'
import { toast } from '@/shared/utils/toast'
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import FormField from '@/shared/components/molecules/FormField.vue'
import Divider from '@/shared/components/atoms/Divider.vue'
import GoogleButton from '@/shared/components/molecules/GoogleButton.vue'
import AuthLink from '@/shared/components/molecules/AuthLink.vue'
import { getPostAuthRedirect } from '@/shared/utils/localStorage'
import { getReferralCode } from '@/shared/utils/referralCookie'
import { useUserStore } from '@/shared/stores/user'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'

const referralActive = ref(false)
onMounted(() => {
  referralActive.value = !!getReferralCode()
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { handleError } = useErrorHandler()
const loading = computed(() => userStore.isLoading)
const googleSignUpLoading = ref(false)

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

    // Mark as new user
    userStore.isNewUser = true

    if (response.requires_verification) {
      toast.success('Account created successfully!', {
        description: 'Please verify your email to continue',
      })

      // Redirect to email verification page
      const redirect = route.query.redirect || getPostAuthRedirect()
      await router.push({
        name: 'verifyEmail',
        query: { email: values.email, ...(redirect && { redirect }) },
      })
    } else {
      toast.success('Account created successfully!', {
        description: 'Welcome! Redirecting...',
      })

      // Redirect to overview or original destination
      const redirect = route.query.redirect || getPostAuthRedirect()
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
    googleSignUpLoading.value = true
    const { useAuthApi } = await import('@/shared/api/auth')
    const authApi = useAuthApi()
    const redirectUrl = await authApi.googleSignIn()

    // Redirect to Google OAuth
    window.location.href = redirectUrl
  } catch (error) {
    googleSignUpLoading.value = false
    handleError(error, {
      fallbackMessage: 'Google sign up failed. Please try again.',
    })
  }
}
</script>
