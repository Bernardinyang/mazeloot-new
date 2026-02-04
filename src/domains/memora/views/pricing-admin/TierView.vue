<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
      <header class="space-y-3">
        <nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <RouterLink :to="{ name: 'admin-pricing' }" :class="['hover:underline', theme.textSecondary]">
            Memora Pricing
          </RouterLink>
          <span :class="theme.textTertiary" aria-hidden>/</span>
          <span :class="theme.textPrimary">View tier</span>
        </nav>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0">
            <h1 :class="['text-2xl sm:text-3xl font-semibold tracking-tight truncate', theme.textPrimary]">
              {{ tier?.name || slug || 'Tier' }}
            </h1>
            <div v-if="tier" class="mt-1.5 flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium" :class="theme.textSecondary">
                {{ tier.slug }}
              </span>
              <span v-if="!tier.is_active" class="inline-flex items-center rounded-md bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
                Inactive
              </span>
              <span v-if="tier.is_popular" class="inline-flex items-center rounded-md bg-accent/20 text-accent-foreground px-2 py-0.5 text-xs font-medium">
                Popular
              </span>
            </div>
          </div>
          <div class="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" @click="router.push({ name: 'admin-pricing' })">
              Back to list
            </Button>
            <RouterLink v-if="tier" :to="{ name: 'admin-pricing-tier-edit', params: { slug: tier.slug } }">
              <Button size="sm">Edit</Button>
            </RouterLink>
          </div>
        </div>
      </header>

      <div v-if="loading" class="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center gap-3">
        <span class="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
        <span :class="['text-sm', theme.textSecondary]">Loading tier…</span>
      </div>

      <div v-else-if="tier" class="space-y-8">
        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Identity</h2>
          </div>
          <div class="p-5 sm:p-6 space-y-4">
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Name</dt>
                <dd :class="['text-sm mt-0.5', theme.textPrimary]">{{ tier.name || '—' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Slug</dt>
                <dd :class="['text-sm mt-0.5 font-mono', theme.textPrimary]">{{ tier.slug }}</dd>
              </div>
            </dl>
            <div v-if="tier.description">
              <dt class="text-xs font-medium text-muted-foreground">Description</dt>
              <dd :class="['text-sm mt-0.5 whitespace-pre-wrap', theme.textSecondary]">{{ tier.description }}</dd>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Pricing</h2>
          </div>
          <div class="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt class="text-xs font-medium text-muted-foreground">Monthly (cents)</dt>
              <dd :class="['text-sm mt-0.5 tabular-nums', theme.textPrimary]">{{ tier.price_monthly_cents ?? '—' }}</dd>
              <p class="text-xs text-muted-foreground tabular-nums mt-0.5">{{ formatCentsToCurrency(tier.price_monthly_cents) }}</p>
            </div>
            <div>
              <dt class="text-xs font-medium text-muted-foreground">Annual (cents)</dt>
              <dd :class="['text-sm mt-0.5 tabular-nums', theme.textPrimary]">{{ tier.price_annual_cents ?? '—' }}</dd>
              <p class="text-xs text-muted-foreground tabular-nums mt-0.5">{{ formatCentsToCurrency(tier.price_annual_cents) }}</p>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Core limits</h2>
          </div>
          <div class="p-5 sm:p-6 space-y-4">
            <div>
              <dt class="text-xs font-medium text-muted-foreground">Storage</dt>
              <dd :class="['text-sm mt-0.5 tabular-nums', theme.textPrimary]">{{ tier.storage_bytes != null ? formatBytes(tier.storage_bytes) : 'Unlimited' }}</dd>
            </div>
            <dl class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div><dt class="text-xs text-muted-foreground">Projects</dt><dd class="text-sm tabular-nums">{{ displayLimit(tier.project_limit) }}</dd></div>
              <div><dt class="text-xs text-muted-foreground">Collections</dt><dd class="text-sm tabular-nums">{{ displayLimit(tier.collection_limit) }}</dd></div>
              <div><dt class="text-xs text-muted-foreground">Selections</dt><dd class="text-sm tabular-nums">{{ displayLimit(tier.selection_limit) }}</dd></div>
              <div><dt class="text-xs text-muted-foreground">Proofing</dt><dd class="text-sm tabular-nums">{{ displayLimit(tier.proofing_limit) }}</dd></div>
              <div><dt class="text-xs text-muted-foreground">Sets per phase</dt><dd class="text-sm tabular-nums">{{ displayLimit(tier.set_limit_per_phase) }}</dd></div>
              <div><dt class="text-xs text-muted-foreground">Raw file limit</dt><dd class="text-sm tabular-nums">{{ displayLimit(tier.raw_file_limit) }}</dd></div>
            </dl>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Other limits</h2>
          </div>
          <div class="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><dt class="text-xs text-muted-foreground">Max revisions</dt><dd class="text-sm tabular-nums">{{ tier.max_revisions ?? '—' }}</dd></div>
            <div><dt class="text-xs text-muted-foreground">Watermarks</dt><dd class="text-sm tabular-nums">{{ displayLimit(tier.watermark_limit) }}</dd></div>
            <div><dt class="text-xs text-muted-foreground">Presets</dt><dd class="text-sm tabular-nums">{{ displayLimit(tier.preset_limit) }}</dd></div>
            <div><dt class="text-xs text-muted-foreground">Team seats</dt><dd class="text-sm tabular-nums">{{ tier.team_seats ?? '—' }}</dd></div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Features & display</h2>
            <p class="text-xs text-muted-foreground mt-1">Feature keys control product access. Display lines are the bullet points shown on the pricing page.</p>
          </div>
          <div class="p-5 sm:p-6 space-y-6">
            <div>
              <h3 class="text-xs font-medium text-muted-foreground mb-2">Features (keys)</h3>
              <div v-if="(tier.features || []).length" class="flex flex-wrap gap-2">
                <span
                  v-for="(f, i) in (tier.features || [])"
                  :key="`${f}-${i}`"
                  :class="['inline-flex rounded-md bg-muted px-2.5 py-1 text-sm font-medium', theme.textPrimary]"
                >
                  {{ f }}
                </span>
              </div>
              <p v-else class="text-sm text-muted-foreground">—</p>
            </div>
            <div>
              <h3 class="text-xs font-medium text-muted-foreground mb-2">Features display (customer bullets)</h3>
              <ul v-if="(tier.features_display || []).length" class="list-disc list-inside space-y-1.5 text-sm" :class="theme.textPrimary">
                <li v-for="(line, i) in (tier.features_display || [])" :key="`${line}-${i}`">
                  {{ line }}
                </li>
              </ul>
              <p v-else class="text-sm text-muted-foreground">—</p>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Capabilities</h2>
          </div>
          <div class="p-5 sm:p-6">
            <ul v-if="enabledCapabilities.length" class="flex flex-wrap gap-2">
              <li v-for="key in enabledCapabilities" :key="key" class="rounded-md bg-muted px-2.5 py-1 text-sm">
                {{ formatCapabilityKey(key) }}
              </li>
            </ul>
            <p v-else class="text-sm text-muted-foreground">None enabled.</p>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Status</h2>
            <p class="text-xs text-muted-foreground mt-1">Visibility and how this tier is presented to customers.</p>
          </div>
          <div class="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              :class="[
                'rounded-xl border px-4 py-4 flex flex-col gap-3',
                tier.is_popular ? 'border-accent/40 bg-accent/10 dark:bg-accent/5' : 'border-border bg-muted/30 dark:bg-muted/10',
              ]"
            >
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    tier.is_popular ? 'bg-accent/20 text-accent-foreground' : 'bg-muted text-muted-foreground',
                  ]"
                  aria-hidden
                >
                  <CheckCircle2 v-if="tier.is_popular" class="h-5 w-5" />
                  <XCircle v-else class="h-5 w-5" />
                </span>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-foreground">Popular</p>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    {{ tier.is_popular ? 'Highlighted with a badge on the pricing page' : 'Not highlighted' }}
                  </p>
                </div>
              </div>
            </div>
            <div
              :class="[
                'rounded-xl border px-4 py-4 flex flex-col gap-3',
                tier.is_active ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10' : 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10',
              ]"
            >
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    tier.is_active ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
                  ]"
                  aria-hidden
                >
                  <CheckCircle2 v-if="tier.is_active" class="h-5 w-5" />
                  <XCircle v-else class="h-5 w-5" />
                </span>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-foreground">Active</p>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    {{ tier.is_active ? 'Visible and available to customers' : 'Hidden from customers; cannot be chosen' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-else-if="!loading && !tier" class="rounded-xl border border-border bg-card p-10 text-center">
        <p :class="['text-sm', theme.textSecondary]">Tier not found.</p>
        <Button variant="outline" class="mt-4" @click="router.push({ name: 'admin-pricing' })">
          Back to list
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import Button from '@/shared/components/shadcn/button/Button.vue'
import { CheckCircle2, XCircle } from '@/shared/utils/lucideAnimated'
import { formatBytes } from '@/shared/utils/formatBytes'

const capabilityKeys = [
  'homepage_enabled',
  'branding_editable',
  'social_links_enabled',
  'collection_display_enabled',
  'photo_quality_enabled',
  'legal_documents_enabled',
  'support_24_7',
]

function formatCapabilityKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatCentsToCurrency(cents) {
  if (cents == null || cents === '' || Number.isNaN(Number(cents)) || cents < 0) return '—'
  const amount = (Number(cents) / 100).toFixed(2)
  return `$ ${amount} USD  ·  € ${amount} EUR`
}

function displayLimit(val) {
  return val != null && val !== '' ? val : 'Unlimited'
}

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()
const adminApi = useAdminApi()

const slug = computed(() => route.params.slug)
const tier = ref(null)
const loading = ref(true)

const enabledCapabilities = computed(() => {
  if (!tier.value?.capabilities || typeof tier.value.capabilities !== 'object') return []
  return capabilityKeys.filter((k) => tier.value.capabilities[k])
})

onMounted(async () => {
  if (!slug.value) return
  loading.value = true
  try {
    tier.value = await adminApi.getPricingTier(slug.value)
  } catch (e) {
    console.error(e)
    tier.value = null
  } finally {
    loading.value = false
  }
})
</script>
