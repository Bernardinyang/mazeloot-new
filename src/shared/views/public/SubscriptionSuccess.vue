<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />

    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="max-w-lg mx-auto text-center">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check class="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>

        <h1 class="text-3xl font-bold mb-4">Subscription Activated!</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Thank you for subscribing. Your account has been upgraded and you now have access to all your plan features.
        </p>

        <div class="space-y-4">
          <Button size="lg" class="w-full" @click="goToDashboard">
            Go to Dashboard
          </Button>
          <Button variant="outline" size="lg" class="w-full" @click="router.push('/settings/subscription')">
            Manage Subscription
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Check } from '@/shared/utils/lucideAnimated'
import { useUserStore } from '@/shared/stores/user'
import { useAuthApi } from '@/shared/api/auth'
import { useSubscriptionApi } from '@/domains/memora/api/pricing'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authApi = useAuthApi()
const { completeTestCheckout } = useSubscriptionApi()

const pollUserUntilUpgrade = async () => {
  const maxAttempts = 10
  const delayMs = 1500
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const data = await authApi.getUser()
      if (data?.user) {
        const u = data.user
        userStore.updateUser({
          id: u.uuid,
          uuid: u.uuid,
          email: u.email,
          first_name: u.first_name,
          last_name: u.last_name,
          name: [u.first_name, u.last_name].filter(Boolean).join(' ').trim(),
          avatar: u.profile_photo,
          role: u.role,
          memora_tier: u.memora_tier ?? 'starter',
          memora_features: u.memora_features ?? [],
          memora_capabilities: u.memora_capabilities ?? {},
          set_limit_per_phase: u.set_limit_per_phase ?? null,
          watermark_limit: u.watermark_limit ?? null,
          preset_limit: u.preset_limit ?? null,
          selection_limit: u.selection_limit ?? null,
          proofing_limit: u.proofing_limit ?? null,
          early_access: u.early_access,
        })
        if ((u.memora_tier ?? 'starter') !== 'starter') break
      }
    } catch (_) {}
    if (attempt < maxAttempts - 1) {
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }
}

onMounted(async () => {
  const test = route.query.test
  const sessionId = route.query.session_id
  const provider = route.query.provider || null
  if (test === '1' && sessionId && userStore.isAuthenticated && provider !== 'paystack') {
    try {
      await completeTestCheckout(sessionId, provider)
    } catch (_) {}
  }
  if (provider === 'paystack' && userStore.isAuthenticated) {
    await pollUserUntilUpgrade()
  }
  if (sessionId && test !== '1' && userStore.isAuthenticated && !provider) {
    await pollUserUntilUpgrade()
  }
})

async function goToDashboard() {
  try {
    const data = await authApi.getUser()
    if (data?.user) {
      const u = data.user
      userStore.updateUser({
        id: u.uuid,
        uuid: u.uuid,
        email: u.email,
        first_name: u.first_name,
        last_name: u.last_name,
        name: [u.first_name, u.last_name].filter(Boolean).join(' ').trim(),
        avatar: u.profile_photo,
        role: u.role,
        memora_tier: u.memora_tier ?? 'starter',
        memora_features: u.memora_features ?? [],
        memora_capabilities: u.memora_capabilities ?? {},
        set_limit_per_phase: u.set_limit_per_phase ?? null,
        watermark_limit: u.watermark_limit ?? null,
        preset_limit: u.preset_limit ?? null,
        selection_limit: u.selection_limit ?? null,
        proofing_limit: u.proofing_limit ?? null,
        early_access: u.early_access,
      })
    }
  } catch (_) {}
  router.push({ name: 'memoraDashboard' })
}
</script>
