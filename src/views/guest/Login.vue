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
                class="text-sm text-primary hover:underline font-medium"
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

          <Button :disabled="loading || !meta.valid" class="w-full" type="submit">
            <Lock v-if="!loading" :size="16" class="mr-2" />
            <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
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
              :disabled="loading || !meta.valid || magicLinkSent"
              :variant="magicLinkSent ? 'secondary' : 'default'"
              class="w-full"
              type="submit"
            >
              <template v-if="magicLinkSent">
                <CheckCircle :size="16" class="mr-2" />
                <span>Magic link sent!</span>
              </template>
              <template v-else>
                <Mail v-if="!loading" :size="16" class="mr-2" />
                <span>{{ loading ? 'Sending...' : 'Send magic link' }}</span>
              </template>
            </Button>

            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div
                v-if="magicLinkSent"
                class="rounded-lg border border-primary/20 bg-primary/5 p-4"
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
              </div>
            </Transition>
          </div>
        </Form>
      </Transition>
    </div>

    <Divider />

    <GoogleButton text="Sign in with Google" @click="handleGoogleSignIn" />

    <AuthLink prefix="Don't have an account?" text="Sign up" to="register" />
  </AuthLayout>
</template>

<script setup>
import { computed, ref, Transition } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Field, Form } from 'vee-validate'
import * as yup from 'yup'
import { Lock, Mail, CheckCircle } from 'lucide-vue-next'
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
import { useAuthApi } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { handleError } = useErrorHandler()
const authApi = useAuthApi()
const loading = computed(() => userStore.isLoading)
const loginMethod = ref('password')
const magicLinkSent = ref(false)

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

    toast.success('Welcome back! Redirecting...')

    // Redirect to the original destination or overview
    const redirect = route.query.redirect
    await router.push(redirect || { name: 'overview' })
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Invalid email or password. Please try again.',
    })
  }
}

const handleMagicLinkLogin = async values => {
  try {
    await authApi.sendMagicLink(values.email)

    magicLinkSent.value = true
    toast.success('Magic link sent!', {
      description: 'Check your email for a link to sign in.',
    })
  } catch (error) {
    magicLinkSent.value = false
    await handleError(error, {
      fallbackMessage: 'Failed to send magic link. Please try again.',
    })
  }
}

const handlePasswordMethodClick = () => {
  loginMethod.value = 'password'
  magicLinkSent.value = false
}

const handleMagicLinkMethodClick = () => {
  loginMethod.value = 'magic-link'
  magicLinkSent.value = false
}

const handleGoogleSignIn = async () => {
  try {
    const redirectUrl = await authApi.googleSignIn()

    // Redirect to Google OAuth
    window.location.href = redirectUrl
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Google sign in failed. Please try again.',
    })
  }
}
</script>
