<template>
  <DashboardLayout>
    <template #breadcrumb>Subscription</template>
    <template #header>
      <Button variant="ghost" size="sm" class="rounded-lg" @click="goToPricing">
        <ChevronLeft class="h-4 w-4 mr-1" />
        Back to Pricing
      </Button>
    </template>

    <div class="max-w-lg mx-auto py-16 px-4 sm:px-6 text-center">
      <!-- Success -->
      <template v-if="status === 'success'">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check class="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 class="text-2xl font-bold text-foreground mb-2">Subscription activated</h1>
        <p class="text-muted-foreground mb-6">
          Your account has been upgraded. You now have access to all your plan features.
        </p>

        <div
          v-if="subscription"
          class="rounded-xl border border-border bg-muted/30 dark:bg-muted/20 p-5 text-left mb-8 space-y-3"
        >
          <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Order details</p>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Plan</dt>
              <dd class="font-medium text-foreground">{{ planLabel }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Billing</dt>
              <dd class="font-medium text-foreground">{{ subscription.billing_cycle === 'annual' ? 'Annual' : 'Monthly' }}</dd>
            </div>
            <div v-if="subscription.amount != null" class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Amount</dt>
              <dd class="font-medium text-foreground">{{ amountFormatted }}</dd>
            </div>
            <div v-if="subscription.payment_provider" class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Payment method</dt>
              <dd class="font-medium capitalize text-foreground">{{ subscription.payment_provider }}</dd>
            </div>
            <div v-if="subscription.current_period_end" class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Next billing date</dt>
              <dd class="font-medium text-foreground">{{ formatDate(subscription.current_period_end) }}</dd>
            </div>
            <div v-if="reference" class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Reference</dt>
              <dd class="font-mono text-xs text-foreground break-all">{{ reference }}</dd>
            </div>
          </dl>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" @click="goToDashboard">Go to Dashboard</Button>
          <Button variant="outline" size="lg" @click="goToPricing">Manage Billing</Button>
        </div>
      </template>

      <!-- Error / Cancelled -->
      <template v-else-if="status === 'error'">
        <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle class="w-8 h-8 text-destructive" />
        </div>
        <h1 class="text-2xl font-bold text-foreground mb-2">Payment not completed</h1>
        <p class="text-muted-foreground mb-6">
          {{ errorMessage || 'The payment was cancelled or could not be completed. You have not been charged.' }}
        </p>
        <p v-if="providerFromQuery" class="text-sm text-muted-foreground mb-8">
          Payment provider: <span class="capitalize font-medium text-foreground">{{ providerFromQuery }}</span>
        </p>
        <Button size="lg" @click="goToPricing">Back to Pricing</Button>
      </template>

      <!-- Loading (e.g. waiting for webhook / tier update) -->
      <template v-else>
        <Loader2 class="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-6" />
        <h1 class="text-2xl font-bold text-foreground mb-2">Confirming your subscription</h1>
        <p class="text-muted-foreground">
          Please wait while we activate your plan…
        </p>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Check, ChevronLeft, Loader2, XCircle } from '@/shared/utils/lucideAnimated'
import { useUserStore } from '@/shared/stores/user'
import { useAuthApi } from '@/shared/api/auth'
import { useSubscriptionApi } from '@/domains/memora/api/pricing'
import { formatMoney } from '@/shared/utils/formatMoney'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authApi = useAuthApi()
const { completeTestCheckout, getStatus } = useSubscriptionApi()

const status = ref(null)
const errorMessage = ref('')
const subscription = ref(null)
const reference = ref(route.query.reference || route.query.trxref || '')

const providerFromQuery = computed(() => route.query.provider || null)

const planLabel = computed(() => {
  if (!subscription.value?.tier) return '—'
  const t = subscription.value.tier
  if (t === 'byo') return 'Build your own'
  return t.charAt(0).toUpperCase() + t.slice(1)
})

const amountFormatted = computed(() => {
  const sub = subscription.value
  if (!sub || sub.amount == null) return '—'
  const currency = (sub.currency || 'usd').toLowerCase()
  return formatMoney(sub.amount, currency)
})

function formatDate(val) {
  if (!val) return '—'
  const d = typeof val === 'string' ? new Date(val) : val
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const isError = computed(() => {
  return (
    route.query.error === '1' ||
    route.query.cancelled === '1' ||
    (typeof route.query.error === 'string' && route.query.error.length > 0)
  )
})

onMounted(async () => {
  if (isError.value) {
    status.value = 'error'
    errorMessage.value = route.query.message || route.query.reason || ''
    return
  }

  const provider = route.query.provider || null
  const test = route.query.test
  const sessionId = route.query.session_id

  async function fetchSubscriptionDetails() {
    try {
      const res = await getStatus()
      subscription.value = res?.subscription ?? null
    } catch (_) {
      subscription.value = null
    }
  }

  if (test === '1' && sessionId && provider && provider !== 'paystack') {
    try {
      await completeTestCheckout(sessionId, provider)
    } catch (_) {}
    status.value = 'success'
    await fetchSubscriptionDetails()
    return
  }

  if (provider === 'paystack' || provider === 'flutterwave') {
    const maxAttempts = 16
    const delayMs = 2000
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const [userData, statusRes] = await Promise.all([authApi.getUser(), getStatus()])
        const u = userData?.user
        if (u) {
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
            early_access: u.early_access,
          })
        }
        const sub = statusRes?.subscription ?? null
        if (sub && (u?.memora_tier ?? 'starter') !== 'starter') {
          status.value = 'success'
          subscription.value = sub
          return
        }
      } catch (_) {}
      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs))
      }
    }
    status.value = 'success'
    await fetchSubscriptionDetails()
    return
  }

  if (route.query.session_id && provider === 'stripe') {
    status.value = 'success'
    await fetchSubscriptionDetails()
    try {
      const userData = await authApi.getUser()
      const u = userData?.user
      if (u) {
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
          early_access: u.early_access,
        })
      }
    } catch (_) {}
    return
  }

  status.value = 'success'
  await fetchSubscriptionDetails()
})

function goToPricing() {
  router.push({ name: 'memora-pricing' })
}

function goToDashboard() {
  router.push({ name: 'memoraDashboard' })
}
</script>
