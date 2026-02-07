<template>
  <DashboardLayout>
    <template #breadcrumb>Plan change requests</template>
    <template #header>
      <div class="flex items-center justify-end w-full gap-2">
        <Button variant="ghost" size="sm" class="rounded-lg gap-1" @click="goBack">
          <ChevronLeft class="h-4 w-4" />
          Back
        </Button>
        <RouterLink :to="{ name: 'memora-pricing' }">
          <Button variant="outline" size="sm" class="gap-2">
            <CreditCard class="h-4 w-4" />
            Plans &amp; Pricing
          </Button>
        </RouterLink>
      </div>
    </template>

    <div class="space-y-8 max-w-3xl mx-auto pb-4 px-4 sm:px-6">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Plan change requests
        </h1>
        <p class="text-muted-foreground text-sm sm:text-base max-w-xl">
          View the status of upgrade and downgrade requests you’ve submitted. Support will process them and send you a link or invoice when ready.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <Skeleton v-for="i in 3" :key="i" class="h-24 w-full rounded-xl" />
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="rounded-xl border border-destructive/30 bg-destructive/5 dark:bg-destructive/10 px-6 py-8 flex items-start gap-4"
      >
        <AlertCircle class="h-6 w-6 shrink-0 text-destructive" />
        <div>
          <p class="font-medium text-foreground">Something went wrong</p>
          <p class="text-sm text-muted-foreground mt-0.5">{{ error }}</p>
          <Button variant="outline" size="sm" class="mt-4" @click="load">
            Try again
          </Button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="list.length === 0"
        class="rounded-2xl border border-dashed border-border bg-muted/30 dark:bg-muted/10 px-8 py-16 text-center"
      >
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted dark:bg-muted/50 text-muted-foreground mb-4">
          <FileText class="h-7 w-7" />
        </div>
        <h2 class="text-lg font-semibold text-foreground">No requests yet</h2>
        <p class="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          When you request an upgrade or downgrade from Plans &amp; Pricing, they’ll appear here.
        </p>
        <RouterLink :to="{ name: 'memora-pricing' }">
          <Button class="mt-6 gap-2">
            Go to Plans &amp; Pricing
            <ArrowRight class="h-4 w-4" />
          </Button>
        </RouterLink>
      </div>

      <!-- Request list -->
      <ul v-else class="space-y-4" role="list">
        <li
          v-for="req in list"
          :key="req.uuid"
          :class="[
            'group relative rounded-xl border bg-card shadow-sm overflow-hidden transition-shadow hover:shadow-md',
            req.type === 'upgrade'
              ? 'border-l-4 border-l-emerald-500 dark:border-l-emerald-500'
              : 'border-l-4 border-l-slate-400 dark:border-l-slate-500',
          ]"
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <!-- Icon + type -->
            <div
              :class="[
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                req.type === 'upgrade'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : 'bg-slate-500/15 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400',
              ]"
            >
              <TrendingUp v-if="req.type === 'upgrade'" class="h-5 w-5" />
              <ArrowDown v-else class="h-5 w-5" />
            </div>

            <div class="min-w-0 flex-1 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  :class="[
                    'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                    req.type === 'upgrade'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'bg-slate-500/15 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400',
                  ]"
                >
                  {{ req.type }}
                </span>
                <span class="text-foreground font-medium">
                  {{ formatTier(req.current_tier) }}
                  <ArrowRight class="inline h-3.5 w-3.5 mx-0.5 text-muted-foreground align-middle" />
                  {{ formatTier(req.target_tier) }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span v-if="req.requested_at" class="flex items-center gap-1">
                  <Clock class="h-3.5 w-3.5" />
                  {{ formatDate(req.requested_at) }}
                </span>
                <span v-if="req.completed_at" class="flex items-center gap-1">
                  · Completed {{ formatDate(req.completed_at) }}
                </span>
              </div>
            </div>

            <!-- Status -->
            <span
              :class="[
                'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                req.status === 'pending'
                  ? 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                  : req.status === 'completed'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground',
              ]"
            >
              <span
                v-if="req.status === 'pending'"
                class="h-1.5 w-1.5 rounded-full bg-current animate-pulse"
                aria-hidden="true"
              />
              {{ req.status }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import Skeleton from '@/shared/components/shadcn/skeleton/Skeleton.vue'
import { useSubscriptionApi } from '@/domains/memora/api/pricing'
import { useFormatDate } from '@/shared/composables/useFormatDate'
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  CreditCard,
  ChevronLeft,
  FileText,
  Clock,
  TrendingUp,
} from '@/shared/utils/lucideAnimated'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'

const router = useRouter()
function goBack() {
  router.back()
}

const { formatDate } = useFormatDate()
const { getMyPlanRequests } = useSubscriptionApi()

const loading = ref(true)
const error = ref(null)
const data = ref({ upgrade_requests: [], downgrade_requests: [] })

function formatTier(tier) {
  if (!tier) return ''
  return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()
}

const list = computed(() => {
  const up = (data.value.upgrade_requests ?? []).map((r) => ({ ...r, type: 'upgrade' }))
  const down = (data.value.downgrade_requests ?? []).map((r) => ({ ...r, type: 'downgrade' }))
  return [...up, ...down].sort((a, b) => (b.requested_at || '').localeCompare(a.requested_at || ''))
})

async function load() {
  loading.value = true
  error.value = null
  try {
    data.value = await getMyPlanRequests()
  } catch (e) {
    error.value = e?.message ?? 'Failed to load requests'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
