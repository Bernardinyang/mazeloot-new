<template>
  <AuthLayout title="Account suspended" description="">
    <div class="space-y-6 text-center">
      <div
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 dark:bg-destructive/20"
        aria-hidden
      >
        <ShieldOff class="h-7 w-7 text-destructive" />
      </div>
      <div class="space-y-2">
        <h1 :class="['text-xl font-semibold', theme.textPrimary]">Your account has been suspended</h1>
        <p :class="['text-sm', theme.textSecondary]">
          You will not be able to sign in or use the platform until your account is reactivated.
        </p>
        <p :class="['text-sm', theme.textTertiary]">
          If you believe this is an error or would like to appeal, please contact support.
        </p>
      </div>
      <Button variant="outline" class="w-full sm:w-auto" @click="signOut">
        Sign out
      </Button>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ShieldOff } from 'lucide-vue-next'
import { useUserStore } from '@/shared/stores/user'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useLogout } from '@/shared/composables/useLogout'
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import { Button } from '@/shared/components/shadcn/button'

const theme = useThemeClasses()
const userStore = useUserStore()
const { logout } = useLogout()

async function signOut() {
  await logout()
}
</script>
