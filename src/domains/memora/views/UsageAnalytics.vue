<template>
  <DashboardLayout>
    <template #breadcrumb>Usage &amp; Analytics</template>

    <div class="space-y-8 max-w-7xl mx-auto w-full">
      <!-- Page Header -->
      <div class="space-y-2">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              Usage &amp; Analytics
            </h1>
            <p class="text-muted-foreground mt-2 text-sm sm:text-base">
              Monitor your storage, resources, and subscription activity
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" :disabled="refreshing" @click="refresh">
              <RefreshCw :class="['h-4 w-4 mr-2', refreshing && 'animate-spin']" />
              Refresh
            </Button>
            <RouterLink :to="{ name: 'memora-pricing' }">
              <Button variant="outline" size="sm">
                <CreditCard class="h-4 w-4 mr-2" />
                Manage Plan
              </Button>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div class="grid gap-6 md:grid-cols-2">
          <Skeleton class="h-48 rounded-xl" />
          <Skeleton class="h-48 rounded-xl" />
        </div>
        <Skeleton class="h-64 rounded-xl" />
      </div>

      <template v-else-if="usage">
        <!-- Current Plan Card -->
        <div
          :class="[
            'rounded-2xl p-6 border',
            'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent',
            'border-amber-500/30',
          ]"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="p-3 rounded-xl bg-amber-500/20">
                <Crown class="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-muted-foreground">Current Plan</p>
                <p class="text-xl font-bold">{{ tierLabel }}</p>
              </div>
            </div>
            <RouterLink :to="{ name: 'memora-pricing' }">
              <Button size="sm" :variant="usage.tier === 'starter' ? 'default' : 'outline'">
                {{ usage.tier === 'starter' ? 'Upgrade Plan' : 'Change Plan' }}
              </Button>
            </RouterLink>
          </div>
        </div>

        <!-- Storage Usage -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Storage Card -->
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                  <Database class="h-5 w-5 text-purple-500" />
                  Storage
                </CardTitle>
                <span
                  :class="[
                    'text-sm font-semibold px-2.5 py-0.5 rounded-full',
                    storagePercentage >= 90 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    storagePercentage >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                  ]"
                >
                  {{ storagePercentage }}% used
                </span>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">{{ formatBytes(usage.storage.used_bytes) }} of {{ formatBytes(usage.storage.limit_bytes) }}</span>
                  <span class="text-muted-foreground">{{ formatBytes(usage.storage.limit_bytes - usage.storage.used_bytes) }} free</span>
                </div>
                <div class="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    :class="[
                      'h-full rounded-full transition-all duration-500',
                      storagePercentage >= 90 ? 'bg-red-500' :
                      storagePercentage >= 70 ? 'bg-yellow-500' :
                      'bg-green-500',
                    ]"
                    :style="{ width: `${Math.min(storagePercentage, 100)}%` }"
                  />
                </div>
              </div>

              <!-- Storage Breakdown -->
              <div
                v-if="hasFeature('selection') || hasFeature('collection') || hasFeature('proofing') || hasFeature('raw_files')"
                class="pt-4 border-t space-y-3"
              >
                <h4 class="text-sm font-medium">Breakdown</h4>
                <div class="space-y-2">
                  <div
                    v-if="hasFeature('selection') || hasFeature('collection') || hasFeature('proofing')"
                    class="flex items-center justify-between text-sm"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded bg-blue-500" />
                      <span>Media Files</span>
                    </div>
                    <span class="text-muted-foreground tabular-nums">{{ formatBytes(usage.storage.breakdown.media) }}</span>
                  </div>
                  <div
                    v-if="hasFeature('raw_files')"
                    class="flex items-center justify-between text-sm"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded bg-purple-500" />
                      <span>Raw Files</span>
                    </div>
                    <span class="text-muted-foreground tabular-nums">{{ formatBytes(usage.storage.breakdown.raw_files) }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Resources Card -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Layers class="h-5 w-5 text-blue-500" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <ResourceRow
                  v-if="hasFeature('selection') || hasFeature('collection') || hasFeature('proofing')"
                  label="Projects"
                  :count="usage.resources.projects.count"
                  :limit="usage.resources.projects.limit"
                  color="green"
                />
                <ResourceRow
                  v-if="hasFeature('collection')"
                  label="Collections"
                  :count="usage.resources.collections.count"
                  :limit="usage.resources.collections.limit"
                  color="blue"
                />
                <ResourceRow
                  v-if="hasFeature('selection') || hasFeature('collection') || hasFeature('proofing') || hasFeature('raw_files')"
                  label="Media"
                  :count="usage.resources.media"
                  color="purple"
                />
                <ResourceRow
                  v-if="hasFeature('selection')"
                  label="Selections"
                  :count="usage.resources.selections"
                  color="pink"
                />
                <ResourceRow
                  v-if="hasFeature('proofing')"
                  label="Proofing"
                  :count="usage.resources.proofing"
                  color="orange"
                />
                <ResourceRow
                  v-if="hasFeature('raw_files')"
                  label="Raw Files"
                  :count="usage.resources.raw_files"
                  color="teal"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Usage Trend Chart -->
        <Card v-if="usage.usage_trend && usage.usage_trend.length > 0">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <TrendingUp class="h-5 w-5 text-green-500" />
              Usage Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="h-64">
              <div class="flex items-end justify-between h-full gap-2">
                <div
                  v-for="month in usage.usage_trend"
                  :key="month.month"
                  class="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    class="w-full bg-primary/20 rounded-t relative group cursor-default"
                    :style="{ height: `${getBarHeight(month.storage_bytes)}%`, minHeight: '4px' }"
                  >
                    <div
                      class="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      {{ formatBytes(month.storage_bytes) }} · {{ month.media_count }} files
                    </div>
                  </div>
                  <span class="text-xs text-muted-foreground">{{ formatMonth(month.month) }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Subscription History -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <History class="h-5 w-5 text-amber-500" />
              Subscription History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="historyLoading" class="space-y-3">
              <Skeleton v-for="i in 3" :key="i" class="h-16" />
            </div>
            <div v-else-if="history.length === 0" class="text-center py-8 text-muted-foreground">
              <History class="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No subscription history yet</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="event in history"
                :key="event.id"
                class="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div
                  :class="[
                    'p-2 rounded-lg shrink-0',
                    getEventIconClass(event.event_type),
                  ]"
                >
                  <component :is="getEventIcon(event.event_type)" class="h-4 w-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-medium">{{ getEventLabel(event.event_type) }}</span>
                    <span
                      v-if="event.to_tier"
                      :class="[
                        'text-xs px-2 py-0.5 rounded-full border',
                        getTierBadgeClass(event.to_tier),
                      ]"
                    >
                      {{ formatTierName(event.to_tier) }}
                    </span>
                  </div>
                  <p class="text-sm text-muted-foreground mt-1">
                    <template v-if="event.from_tier && event.to_tier && event.from_tier !== event.to_tier">
                      {{ formatTierName(event.from_tier) }} → {{ formatTierName(event.to_tier) }}
                    </template>
                    <template v-if="event.amount_cents">
                      · {{ formatMoney(event.amount_cents, event.currency || currencyStore.currency) }}
                      <span v-if="event.billing_cycle">({{ event.billing_cycle }})</span>
                    </template>
                  </p>
                  <p v-if="event.notes" class="text-xs text-muted-foreground mt-1">{{ event.notes }}</p>
                </div>
                <span class="text-xs text-muted-foreground whitespace-nowrap">
                  {{ formatDate(event.created_at) }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </template>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <AlertCircle class="h-12 w-12 mx-auto text-destructive mb-4" />
        <p class="text-destructive">{{ error }}</p>
        <Button variant="outline" class="mt-4" @click="refresh">Try Again</Button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, h, onMounted, ref } from 'vue'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import Skeleton from '@/shared/components/shadcn/skeleton/Skeleton.vue'
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  CreditCard,
  Crown,
  Database,
  History,
  Layers,
  RefreshCw,
  TrendingUp,
  XCircle,
} from '@/shared/utils/lucideAnimated'
import { useSubscriptionApi } from '@/domains/memora/api/pricing'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import { useCurrencyStore } from '@/shared/stores/currency'
import { formatMoney } from '@/shared/utils/formatMoney'

const { getUsage, getHistory } = useSubscriptionApi()
const { hasFeature } = useMemoraFeatures()
const currencyStore = useCurrencyStore()

const loading = ref(true)
const historyLoading = ref(true)
const refreshing = ref(false)
const error = ref(null)
const usage = ref(null)
const history = ref([])

const tierLabel = computed(() => {
  const t = usage.value?.tier ?? 'starter'
  if (t === 'byo') return 'Build Your Own'
  return t.charAt(0).toUpperCase() + t.slice(1)
})

const storagePercentage = computed(() => {
  if (!usage.value?.storage) return 0
  return Math.round(usage.value.storage.percentage)
})

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatMonth(monthStr) {
  if (!monthStr) return ''
  const [year, month] = monthStr.split('-')
  const date = new Date(year, parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short' })
}

function formatTierName(tier) {
  if (tier === 'byo') return 'BYO'
  return tier.charAt(0).toUpperCase() + tier.slice(1)
}

function getBarHeight(bytes) {
  if (!usage.value?.usage_trend?.length) return 0
  const max = Math.max(...usage.value.usage_trend.map(m => m.storage_bytes))
  if (max === 0) return 0
  return Math.max((bytes / max) * 100, 4)
}

function getEventIcon(type) {
  switch (type) {
    case 'created':
    case 'upgraded':
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
      return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    case 'downgraded':
    case 'cancelled':
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    case 'renewed':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    case 'payment_failed':
      return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
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
  return labels[type] || type
}

function getTierBadgeClass(tier) {
  if (tier === 'pro') return 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40'
  if (tier === 'byo') return 'bg-purple-500/20 text-purple-800 dark:text-purple-200 border-purple-500/40'
  if (tier === 'studio') return 'bg-blue-500/20 text-blue-800 dark:text-blue-200 border-blue-500/40'
  if (tier === 'business') return 'bg-green-500/20 text-green-800 dark:text-green-200 border-green-500/40'
  return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30'
}

async function fetchData() {
  try {
    const [usageRes, historyRes] = await Promise.all([
      getUsage(),
      getHistory(20),
    ])
    usage.value = usageRes ?? null
    history.value = Array.isArray(historyRes) ? historyRes : []
  } catch (e) {
    error.value = e?.message ?? 'Failed to load usage data'
  } finally {
    loading.value = false
    historyLoading.value = false
  }
}

async function refresh() {
  refreshing.value = true
  await fetchData()
  refreshing.value = false
}

onMounted(fetchData)

// ResourceRow component inline
const ResourceRow = (props, { slots }) => {
  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500',
    teal: 'bg-teal-500',
  }
  const hasLimit = props.limit != null
  const percentage = hasLimit ? Math.round((props.count / props.limit) * 100) : null

  return h('div', { class: 'space-y-1' }, [
    h('div', { class: 'flex items-center justify-between text-sm' }, [
      h('div', { class: 'flex items-center gap-2' }, [
        h('div', { class: `w-3 h-3 rounded ${colors[props.color] || colors.blue}` }),
        h('span', props.label),
      ]),
      h('span', { class: 'text-muted-foreground tabular-nums' },
        hasLimit ? `${props.count} / ${props.limit}` : props.count.toLocaleString()
      ),
    ]),
    hasLimit && h('div', { class: 'h-1.5 rounded-full bg-muted overflow-hidden' }, [
      h('div', {
        class: `h-full rounded-full ${colors[props.color] || colors.blue}`,
        style: { width: `${Math.min(percentage, 100)}%` },
      }),
    ]),
  ])
}
ResourceRow.props = ['label', 'count', 'limit', 'color']
</script>
