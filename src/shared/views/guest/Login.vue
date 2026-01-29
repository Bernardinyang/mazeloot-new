<template>
  <AuthLayout description="Welcome back! Please enter your details." title="Welcome back!">
    <div class="space-y-6">
      <!-- Segmented Control Toggle -->
      <div class="relative inline-flex w-full items-center justify-between rounded-lg bg-muted p-1">
        <button
          :class="[
            'relative flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200',
            loginMethod === 'password'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="handlePasswordMethodClick"
        >
          <div class="flex items-center justify-center gap-2">
            <Lock :size="16" />
            <span>Password</span>
          </div>
        </button>
        <button
          :class="[
            'relative flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200',
            loginMethod === 'magic-link'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="handleMagicLinkMethodClick"
        >
          <div class="flex items-center justify-center gap-2">
            <Mail :size="16" />
            <span>Magic Link</span>
          </div>
        </button>
      </div>

      <!-- Password Login Form -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
        mode="out-in"
      >
        <Form
          v-if="loginMethod === 'password'"
          key="password"
          v-slot="{ meta }"
          :validation-schema="passwordSchema"
          class="space-y-4"
          @submit="handleLogin"
        >
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
                class="text-sm text-accent dark:text-accent-300 hover:underline"
              >
                Forgot password?
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

          <Button
            :disabled="loading || !meta.valid"
            :icon="!loading ? Lock : null"
            :loading="loading"
            class="w-full"
            loading-label="Signing in..."
            type="submit"
          >
            Sign in
          </Button>
        </Form>

        <!-- Magic Link Login Form -->
        <Form
          v-else
          key="magic-link"
          v-slot="{ meta }"
          :validation-schema="magicLinkSchema"
          class="space-y-4"
          @submit="handleMagicLinkLogin"
        >
          <div class="space-y-4">
            <FormField
              autocomplete="email"
              label="Email"
              name="email"
              placeholder="name@example.com"
              type="email"
            />

            <Button
              :disabled="magicLinkLoading || !meta.valid || magicLinkSent"
              :icon="
                !magicLinkLoading && !magicLinkSent ? Mail : magicLinkSent ? CheckCircle : null
              "
              :loading="magicLinkLoading && !magicLinkSent"
              :variant="magicLinkSent ? 'secondary' : 'default'"
              class="w-full"
              loading-label="Sending..."
              type="submit"
            >
              <template v-if="magicLinkSent"> Magic link sent! </template>
              <template v-else> Send magic link </template>
            </Button>

            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div
                v-if="magicLinkSent"
                class="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3"
              >
                <div class="flex items-start gap-3">
                  <Mail :size="18" class="mt-0.5 shrink-0 text-primary" />
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium text-foreground">Check your email</p>
                    <p class="text-sm text-muted-foreground">
                      We've sent a magic link to your email address. Click the link in the email to
                      sign in. The link will expire in 15 minutes.
                    </p>
                  </div>
                </div>
                <Button
                  :disabled="resendLoading || resendCooldown > 0"
                  :loading="resendLoading"
                  class="w-full"
                  loading-label="Sending..."
                  variant="outline"
                  @click="handleResendMagicLink"
                >
                  <span v-if="resendCooldown > 0">Resend link ({{ resendCooldown }}s)</span>
                  <span v-else>Resend magic link</span>
                </Button>
              </div>
            </Transition>
          </div>
        </Form>
      </Transition>
    </div>

    <Divider />

    <GoogleButton
      :disabled="googleLoading"
      :loading="googleLoading"
      text="Sign in with Google"
      @click="handleGoogleSignIn"
    />

    <AuthLink prefix="Don't have an account?" text="Sign up" to="register" />
  </AuthLayout>
</template>

<script setup>
import { computed, ref, Transition } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Field, Form } from 'vee-validate'
import * as yup from 'yup'
import { CheckCircle, Lock, Mail } from '@/shared/utils/lucideAnimated'
import { toast } from '@/shared/utils/toast'
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import FormField from '@/shared/components/molecules/FormField.vue'
import Label from '@/shared/components/shadcn/Label.vue'
import Divider from '@/shared/components/atoms/Divider.vue'
import GoogleButton from '@/shared/components/molecules/GoogleButton.vue'
import AuthLink from '@/shared/components/molecules/AuthLink.vue'
import { useUserStore } from '@/shared/stores/user'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useAuthApi } from '@/shared/api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { handleError } = useErrorHandler()
const authApi = useAuthApi()
const loading = computed(() => userStore.isLoading)
const loginMethod = ref('password')
const magicLinkSent = ref(false)
const magicLinkEmail = ref('')
const magicLinkLoading = ref(false)
const resendLoading = ref(false)
const resendCooldown = ref(0)
const googleLoading = ref(false)

const passwordSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  remember: yup.boolean(),
})

const magicLinkSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
})

const handleLogin = async values => {
  try {
    await userStore.login(values.email, values.password, values.remember)

    // Don't clear isNewUser on login - it should only be cleared after visiting getting started
    // If user was previously registered, flag will persist; if existing user, flag is already false

    toast.success('Welcome back! Redirecting...')

    // Skip product selection and onboarding checks for admins
    if (!userStore.isAdmin) {
      // Check if user needs product selection or onboarding
      await userStore.fetchSelectedProducts()
      await userStore.fetchOnboardingStatus()

      if (userStore.needsProductSelection) {
        // Generate token and redirect to product selection
        const { useOnboardingApi } = await import('@/shared/api/onboarding')
        const onboardingApi = useOnboardingApi()
        try {
          const tokenData = await onboardingApi.generateProductSelectionToken()
          router.push({
            name: 'productSelection',
            params: { token: tokenData.token },
          })
          return
        } catch (err) {
          console.error('Failed to generate product selection token:', err)
        }
      }

      if (userStore.needsOnboarding) {
        // Find next incomplete onboarding
        const selectedProductUuids = userStore.selectedProducts.map((p) => p.uuid || p.product?.uuid)
        const completedProductUuids = userStore.onboardingStatus
          .filter((s) => s.completed_at)
          .map((s) => s.product_uuid)

        const incompleteProduct = userStore.selectedProducts.find(
          (p) => !completedProductUuids.includes(p.uuid || p.product?.uuid)
        )

        if (incompleteProduct) {
          const { useOnboardingApi } = await import('@/shared/api/onboarding')
          const onboardingApi = useOnboardingApi()
          try {
            const tokenData = await onboardingApi.generateToken(incompleteProduct.uuid || incompleteProduct.product?.uuid)
            const productSlug = incompleteProduct.slug || incompleteProduct.product?.slug
            router.push({
              name: 'onboarding',
              params: { productSlug, token: tokenData.token },
            })
            return
          } catch (err) {
            console.error('Failed to generate onboarding token:', err)
          }
        }
      }
    }

    // Redirect to the original destination, admin dashboard (for admins), or overview
    const redirect = route.query.redirect
    if (redirect) {
      await router.push(redirect)
    } else if (userStore.isAdmin) {
      await router.push({ name: 'admin-dashboard' })
    } else {
      await router.push({ name: 'overview' })
    }
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Invalid email or password. Please try again.',
    })
  }
}

const handleMagicLinkLogin = async values => {
  magicLinkLoading.value = true
  try {
    await authApi.sendMagicLink(values.email)

    magicLinkEmail.value = values.email
    magicLinkSent.value = true
    toast.success('Magic link sent!', {
      description: 'Check your email for a link to sign in.',
    })
  } catch (error) {
    magicLinkSent.value = false
    await handleError(error, {
      fallbackMessage: 'Failed to send magic link. Please try again.',
    })
  } finally {
    magicLinkLoading.value = false
  }
}

const handleResendMagicLink = async () => {
  if (!magicLinkEmail.value || resendLoading.value || resendCooldown.value > 0) return

  resendLoading.value = true
  try {
    await authApi.sendMagicLink(magicLinkEmail.value)

    resendCooldown.value = 60
    const interval = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    toast.success('Magic link sent!', {
      description: 'A new magic link has been sent to your email',
    })
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to send magic link. Please try again.',
    })
  } finally {
    resendLoading.value = false
  }
}

const handlePasswordMethodClick = () => {
  loginMethod.value = 'password'
  magicLinkSent.value = false
  magicLinkEmail.value = ''
  resendCooldown.value = 0
}

const handleMagicLinkMethodClick = () => {
  loginMethod.value = 'magic-link'
  magicLinkSent.value = false
  magicLinkEmail.value = ''
  resendCooldown.value = 0
}

const handleGoogleSignIn = async () => {
  if (googleLoading.value) return

  googleLoading.value = true
  try {
    const redirectUrl = await authApi.googleSignIn()

    // Redirect to Google OAuth
    window.location.href = redirectUrl
  } catch (error) {
    googleLoading.value = false
    await handleError(error, {
      fallbackMessage: 'Google sign in failed. Please try again.',
    })
  }
}
</script>
