<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <p class="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-1">Account</p>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-violet-800 to-fuchsia-800 dark:from-white dark:via-violet-200 dark:to-fuchsia-200 bg-clip-text text-transparent">
        Billing
      </h1>
      <p class="text-sm mt-2 text-gray-600 dark:text-gray-400 max-w-lg">
        View payments and subscriptions across your products.
      </p>
    </div>

    <!-- Payments card -->
    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-transparent dark:from-amber-500/10 dark:via-orange-500/10">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
            <CreditCard class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Payments</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Transactions across all products</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          as-child
          class="rounded-xl border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-500/10 hover:border-violet-300 dark:hover:border-violet-700"
        >
          <RouterLink :to="{ name: 'memora-pricing' }">Manage subscription</RouterLink>
        </Button>
      </div>

      <div class="p-6">
        <!-- Loading -->
        <div v-if="loading" class="space-y-3">
          <div
            v-for="i in 5"
            :key="i"
            class="h-16 rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-800 animate-pulse"
            :style="{ animationDelay: `${i * 80}ms` }"
          />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="payments.length === 0"
          class="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50/80 to-transparent dark:from-gray-800/40"
        >
          <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-amber-500/20 dark:to-orange-500/20 mb-4">
            <History class="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <p class="font-semibold text-gray-900 dark:text-white">No payments yet</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">Billing activity and subscription history will appear here.</p>
          <Button
            variant="outline"
            size="sm"
            class="mt-6 rounded-xl border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-500/10"
            as-child
          >
            <RouterLink :to="{ name: 'memora-pricing' }">View plans</RouterLink>
          </Button>
        </div>

        <!-- Payment list -->
        <ul v-else class="space-y-3">
          <li
            v-for="(payment, index) in payments"
            :key="payment.id"
            role="button"
            tabindex="0"
            :aria-label="`View details for ${getEventLabel(payment.event_type)}`"
            class="group flex items-center gap-4 p-4 rounded-xl border border-transparent bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 active:scale-[0.995]"
            :style="{ animationDelay: `${index * 40}ms` }"
            @click="openDetail(payment)"
            @keydown.enter.prevent="openDetail(payment)"
            @keydown.space.prevent="openDetail(payment)"
          >
            <div
              :class="[
                'p-3 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110',
                getEventIconClass(payment.event_type),
              ]"
            >
              <component :is="getEventIcon(payment.event_type)" class="h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-gray-900 dark:text-white">{{ getEventLabel(payment.event_type) }}</span>
                <span
                  v-if="payment.product"
                  class="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20"
                >
                  {{ payment.product }}
                </span>
                <span
                  v-if="payment.to_tier"
                  :class="['text-xs px-2.5 py-1 rounded-full border font-medium', getTierBadgeClass(payment.to_tier)]"
                >
                  {{ formatTierName(payment.to_tier) }}
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                <template v-if="payment.from_tier && payment.to_tier && payment.from_tier !== payment.to_tier">
                  {{ formatTierName(payment.from_tier) }} → {{ formatTierName(payment.to_tier) }}
                </template>
                <template v-else-if="payment.amount_cents != null">
                  {{ formatMoney(payment.amount_cents, payment.currency || 'USD') }}
                  <span v-if="payment.billing_cycle"> · {{ formatBillingCycle(payment.billing_cycle) }}</span>
                </template>
              </p>
            </div>
            <div class="shrink-0 text-right">
              <span
                v-if="payment.amount_cents != null"
                :class="['font-bold tabular-nums text-lg', getAmountColorClass(payment.event_type)]"
              >
                {{ formatMoney(payment.amount_cents, payment.currency || 'USD') }}
              </span>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ formatDate(payment.created_at) }}</p>
            </div>
            <ChevronRight class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-200" />
          </li>
        </ul>
      </div>
    </div>

    <SubscriptionHistoryDetailSidebar
      v-model="sidebarOpen"
      :event="selectedPayment"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSubscriptionApi } from '@/domains/memora/api/pricing'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import { useFormatDate } from '@/shared/composables/useFormatDate'
import { formatMoney } from '@/shared/utils/formatMoney'
import {
  CreditCard,
  History,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Check,
  XCircle,
} from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import SubscriptionHistoryDetailSidebar from '@/domains/memora/components/organisms/SubscriptionHistoryDetailSidebar.vue'

const { getHistory } = useSubscriptionApi()
const { tierDisplayName } = useMemoraFeatures()
const { formatDate: fmtDate } = useFormatDate()

const loading = ref(true)
const payments = ref([])
const sidebarOpen = ref(false)
const selectedPayment = ref(null)

function formatDate(val) {
  return val ? fmtDate(val) : '—'
}

function formatTierName(tier) {
  if (!tier) return '—'
  return tier === 'byo' ? 'Build your own' : tierDisplayName(tier)
}

function formatBillingCycle(cycle) {
  if (!cycle) return ''
  return cycle === 'annual' ? 'Annual' : 'Monthly'
}

function getEventIcon(type) {
  switch (type) {
    case 'created':
    case 'upgraded':
    case 'reactivated':
      return ArrowUp
    case 'downgraded':
    case 'cancelled':
      return ArrowDown
    case 'renewed':
      return Check
    case 'payment_failed':
      return XCircle
    default:
      return History
  }
}

function getEventIconClass(type) {
  switch (type) {
    case 'created':
    case 'upgraded':
    case 'reactivated':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 shadow-sm shadow-emerald-500/10'
    case 'downgraded':
    case 'cancelled':
      return 'bg-rose-100 text-rose-600 dark:bg-rose-500/25 dark:text-rose-400 shadow-sm shadow-rose-500/10'
    case 'renewed':
      return 'bg-sky-100 text-sky-600 dark:bg-sky-500/25 dark:text-sky-400 shadow-sm shadow-sky-500/10'
    case 'payment_failed':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400 shadow-sm shadow-amber-500/10'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-500/25 dark:text-gray-400'
  }
}

function getAmountColorClass(type) {
  switch (type) {
    case 'downgraded':
    case 'cancelled':
    case 'payment_failed':
      return 'text-amber-600 dark:text-amber-400'
    default:
      return 'text-emerald-600 dark:text-emerald-400'
  }
}

function getEventLabel(type) {
  const labels = {
    created: 'Subscription Created',
    upgraded: 'Plan Upgraded',
    downgraded: 'Plan Downgraded',
    cancelled: 'Subscription Cancelled',
    renewed: 'Subscription Renewed',
    payment_failed: 'Payment Failed',
    reactivated: 'Subscription Reactivated',
  }
  return labels[type] || type || 'Payment'
}

function getTierBadgeClass(tier) {
  if (tier === 'pro') return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
  if (tier === 'byo') return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
  if (tier === 'studio') return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
  if (tier === 'business') return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
  if (tier === 'starter') return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30'
  return 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30'
}

function openDetail(payment) {
  selectedPayment.value = payment
  sidebarOpen.value = true
}

async function loadPayments() {
  loading.value = true
  try {
    const memoraHistory = await getHistory(100)
    const list = Array.isArray(memoraHistory) ? memoraHistory : []
    payments.value = list.map((event) => ({ ...event, product: 'Memora' }))
  } catch {
    payments.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadPayments)
</script>
