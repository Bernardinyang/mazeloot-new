<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
      <!-- Header -->
      <header class="space-y-3">
        <nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <RouterLink :to="{ name: 'admin-pricing' }" :class="['hover:underline', theme.textSecondary]">
            Memora Pricing
          </RouterLink>
          <span :class="theme.textTertiary" aria-hidden>/</span>
          <span :class="theme.textPrimary">Edit tier</span>
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
          <Button variant="outline" size="sm" class="shrink-0 w-fit" @click="router.push({ name: 'admin-pricing' })">
            Back to list
          </Button>
        </div>
      </header>

      <div v-if="loading" class="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center gap-3">
        <span class="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
        <span :class="['text-sm', theme.textSecondary]">Loading tier…</span>
      </div>

      <form v-else-if="tier" id="tier-edit-form" class="space-y-8" @submit.prevent="submit">
        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Identity</h2>
            <p class="text-xs text-muted-foreground mt-1">Plan name and description shown in the app. Slug is fixed and used in the API.</p>
          </div>
          <div class="p-5 sm:p-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="tier-name">Name</Label>
                <Input id="tier-name" v-model="form.name" class="w-full" placeholder="e.g. Pro" />
              </div>
              <div class="space-y-2">
                <Label for="tier-slug">Slug</Label>
                <Input id="tier-slug" :model-value="tier.slug" disabled class="w-full bg-muted" />
                <p class="text-xs text-muted-foreground">Cannot be changed after creation.</p>
              </div>
            </div>
            <div class="space-y-2">
              <Label for="tier-desc">Description</Label>
              <Textarea id="tier-desc" v-model="form.description" class="w-full min-h-[80px] resize-y" placeholder="Short plan description" />
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Pricing</h2>
            <p class="text-xs text-muted-foreground mt-1">Recurring price for this tier. Enter amounts in cents (e.g. 999 for $9.99, 1200 for $12.00).</p>
          </div>
          <div class="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="price-monthly">Price monthly (cents)</Label>
              <Input
                id="price-monthly"
                v-model.number="form.price_monthly_cents"
                type="number"
                min="0"
                class="w-full font-variant-numeric tabular-nums"
              />
              <p class="text-xs text-muted-foreground tabular-nums">{{ formatCentsToCurrency(form.price_monthly_cents) }}</p>
            </div>
            <div class="space-y-2">
              <Label for="price-annual">Price annual (cents)</Label>
              <Input
                id="price-annual"
                v-model.number="form.price_annual_cents"
                type="number"
                min="0"
                class="w-full font-variant-numeric tabular-nums"
              />
              <p class="text-xs text-muted-foreground tabular-nums">{{ formatCentsToCurrency(form.price_annual_cents) }}</p>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Core limits</h2>
            <p class="text-xs text-muted-foreground mt-1">Maximum counts allowed on this plan. Leave empty for unlimited.</p>
          </div>
          <div class="p-5 sm:p-6 space-y-6">
            <!-- Storage: full-width block -->
            <div class="rounded-lg border border-border bg-muted/30 dark:bg-muted/10 px-4 py-4 space-y-3">
              <Label for="storage" class="text-sm font-medium">Storage</Label>
              <p class="text-xs text-muted-foreground">1 GB = 1,000,000,000 bytes. Enter bytes or use the GB field.</p>
              <div class="flex flex-wrap items-end gap-4">
                <div class="min-w-[180px]">
                  <Label for="storage" class="sr-only">Storage (bytes)</Label>
                  <Input id="storage" v-model.number="form.storage_bytes" type="number" min="0" class="w-full font-variant-numeric tabular-nums" placeholder="e.g. 5000000000" />
                </div>
                <div class="flex items-center gap-2">
                  <Label for="storage-gb" class="text-xs text-muted-foreground shrink-0">GB</Label>
                  <Input
                    id="storage-gb"
                    v-model.number="storageGbInput"
                    type="number"
                    min="0"
                    step="any"
                    class="w-20 font-variant-numeric tabular-nums"
                    placeholder="5"
                  />
                </div>
                <p class="text-sm text-muted-foreground tabular-nums pb-2 min-w-[6rem]">
                  {{ formatBytes(form.storage_bytes) }}
                </p>
              </div>
            </div>
            <!-- Count limits -->
            <div class="rounded-lg border border-border bg-muted/20 dark:bg-muted/10 overflow-hidden">
              <p class="text-xs font-medium text-muted-foreground px-4 py-2.5 border-b border-border">Count limits</p>
              <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                <div class="flex items-center justify-between gap-4 px-4 py-3 sm:flex-col sm:items-stretch sm:justify-stretch">
                  <dt class="shrink-0">
                    <Label for="projects" class="text-sm font-medium text-foreground">Projects</Label>
                  </dt>
                  <dd class="min-w-0 sm:w-full">
                    <Input id="projects" v-model.number="form.project_limit" type="number" min="0" class="w-full max-w-[8rem] sm:max-w-none font-variant-numeric tabular-nums h-9" placeholder="Unlimited" />
                  </dd>
                </div>
                <div class="flex items-center justify-between gap-4 px-4 py-3 sm:flex-col sm:items-stretch sm:justify-stretch">
                  <dt class="shrink-0">
                    <Label for="collections" class="text-sm font-medium text-foreground">Collections</Label>
                  </dt>
                  <dd class="min-w-0 sm:w-full">
                    <Input id="collections" v-model.number="form.collection_limit" type="number" min="0" class="w-full max-w-[8rem] sm:max-w-none font-variant-numeric tabular-nums h-9" placeholder="Unlimited" />
                  </dd>
                </div>
                <div class="flex items-center justify-between gap-4 px-4 py-3 sm:flex-col sm:items-stretch sm:justify-stretch">
                  <dt class="shrink-0">
                    <Label for="selections" class="text-sm font-medium text-foreground">Selections</Label>
                  </dt>
                  <dd class="min-w-0 sm:w-full">
                    <Input id="selections" v-model.number="form.selection_limit" type="number" min="0" class="w-full max-w-[8rem] sm:max-w-none font-variant-numeric tabular-nums h-9" placeholder="Unlimited" />
                  </dd>
                </div>
                <div class="flex items-center justify-between gap-4 px-4 py-3 sm:flex-col sm:items-stretch sm:justify-stretch">
                  <dt class="shrink-0">
                    <Label for="proofing" class="text-sm font-medium text-foreground">Proofing</Label>
                  </dt>
                  <dd class="min-w-0 sm:w-full">
                    <Input id="proofing" v-model.number="form.proofing_limit" type="number" min="0" class="w-full max-w-[8rem] sm:max-w-none font-variant-numeric tabular-nums h-9" placeholder="Unlimited" />
                  </dd>
                </div>
                <div class="flex items-center justify-between gap-4 px-4 py-3 sm:flex-col sm:items-stretch sm:justify-stretch">
                  <dt class="shrink-0">
                    <Label for="set-per-phase" class="text-sm font-medium text-foreground">Sets per phase</Label>
                  </dt>
                  <dd class="min-w-0 sm:w-full">
                    <Input id="set-per-phase" v-model.number="form.set_limit_per_phase" type="number" min="0" class="w-full max-w-[8rem] sm:max-w-none font-variant-numeric tabular-nums h-9" placeholder="Unlimited" />
                  </dd>
                </div>
                <div class="flex items-center justify-between gap-4 px-4 py-3 sm:flex-col sm:items-stretch sm:justify-stretch">
                  <dt class="shrink-0">
                    <Label for="raw-files" class="text-sm font-medium text-foreground">Raw file limit</Label>
                  </dt>
                  <dd class="min-w-0 sm:w-full">
                    <Input id="raw-files" v-model.number="form.raw_file_limit" type="number" min="0" class="w-full max-w-[8rem] sm:max-w-none font-variant-numeric tabular-nums h-9" placeholder="Unlimited" />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Other limits</h2>
            <p class="text-xs text-muted-foreground mt-1">Revisions, watermarks, presets, and team size. Leave empty for unlimited where applicable.</p>
          </div>
          <div class="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="space-y-2">
              <Label for="revisions">Max revisions</Label>
              <Input id="revisions" v-model.number="form.max_revisions" type="number" min="0" class="w-full font-variant-numeric tabular-nums" />
            </div>
            <div class="space-y-2">
              <Label for="watermarks">Watermarks</Label>
              <Input id="watermarks" v-model.number="form.watermark_limit" type="number" min="0" class="w-full font-variant-numeric tabular-nums" />
            </div>
            <div class="space-y-2">
              <Label for="presets">Presets</Label>
              <Input id="presets" v-model.number="form.preset_limit" type="number" min="0" class="w-full font-variant-numeric tabular-nums" />
            </div>
            <div class="space-y-2">
              <Label for="team-seats">Team seats</Label>
              <Input id="team-seats" v-model.number="form.team_seats" type="number" min="1" class="w-full font-variant-numeric tabular-nums" />
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Features & display</h2>
            <p class="text-xs text-muted-foreground mt-1">Feature keys control access to product areas (e.g. proofing). Display lines are the bullet points shown on the pricing page.</p>
          </div>
          <div class="p-5 sm:p-6 space-y-4">
            <div class="space-y-2">
              <Label for="features-input">Features</Label>
              <p class="text-xs text-muted-foreground">Add feature keys one by one (e.g. selection, proofing, raw_files).</p>
              <div class="flex flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 min-h-[42px]">
                <span
                  v-for="(f, i) in featureList"
                  :key="`${f}-${i}`"
                  class="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-sm"
                >
                  {{ f }}
                  <button
                    type="button"
                    class="rounded p-0.5 hover:bg-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Remove feature"
                    @click="removeFeature(i)"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </span>
                <input
                  id="features-input"
                  v-model="newFeatureInput"
                  type="text"
                  class="min-w-[120px] flex-1 border-0 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Type and press Enter…"
                  @keydown="onFeatureKeydown"
                  @blur="addFeatureFromInput"
                />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="features-display-input">Features display</Label>
              <p class="text-xs text-muted-foreground">Customer-facing bullet points (e.g. 3 Projects, 1 Collection, 5GB Storage). Add one per line.</p>
              <div class="flex flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 min-h-[42px]">
                <span
                  v-for="(line, i) in featureDisplayList"
                  :key="`${line}-${i}`"
                  class="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-sm"
                >
                  {{ line }}
                  <button
                    type="button"
                    class="rounded p-0.5 hover:bg-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Remove line"
                    @click="removeFeatureDisplay(i)"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </span>
                <input
                  id="features-display-input"
                  v-model="newFeatureDisplayInput"
                  type="text"
                  class="min-w-[140px] flex-1 border-0 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Type and press Enter…"
                  @keydown="onFeatureDisplayKeydown"
                  @blur="addFeatureDisplayFromInput"
                />
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Capabilities</h2>
            <p class="text-xs text-muted-foreground mt-1">Enable or disable what customers can configure on this plan (e.g. branding, homepage, social links).</p>
          </div>
          <div class="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="key in capabilityKeys"
              :key="key"
              class="flex items-center rounded-lg border border-border px-3 py-2.5 hover:bg-muted/50 min-h-[44px]"
            >
              <Checkbox
                :model-value="!!form.capabilities[key]"
                :root-class="'flex-1'"
                @update:model-value="form.capabilities[key] = $event"
              >
                {{ formatCapabilityKey(key) }}
              </Checkbox>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Status</h2>
            <p class="text-xs text-muted-foreground mt-1">Control visibility and how this tier is presented to customers.</p>
          </div>
          <div class="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Checkbox
              v-model="form.is_popular"
              root-class="rounded-lg border border-border px-4 py-4 hover:bg-muted/30 transition-colors w-full"
            >
              <span class="text-sm font-medium text-foreground block">Popular</span>
              <span class="text-xs text-muted-foreground mt-0.5 block">Highlight this plan on the pricing page with a badge so it stands out.</span>
            </Checkbox>
            <Checkbox
              v-model="form.is_active"
              root-class="rounded-lg border border-border px-4 py-4 hover:bg-muted/30 transition-colors w-full"
            >
              <span class="text-sm font-medium text-foreground block">Active</span>
              <span class="text-xs text-muted-foreground mt-0.5 block">Inactive tiers are hidden from customers and cannot be chosen.</span>
            </Checkbox>
          </div>
        </section>

        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button type="button" variant="outline" class="w-full sm:w-auto" @click="router.push({ name: 'admin-pricing' })">
            Cancel
          </Button>
          <Button type="submit" form="tier-edit-form" variant="default" :disabled="saving" class="w-full sm:w-auto">
            <span v-if="saving" class="inline-flex items-center gap-2">
              <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              Saving…
            </span>
            <span v-else>Save changes</span>
          </Button>
        </div>
      </form>

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
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import Button from '@/shared/components/shadcn/button/Button.vue'
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'
import { Textarea } from '@/shared/components/shadcn/textarea'
import Checkbox from '@/shared/components/shadcn/checkbox/Checkbox.vue'
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
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatCentsToCurrency(cents) {
  if (cents == null || cents === '' || Number.isNaN(Number(cents)) || cents < 0) return '—'
  const amount = (Number(cents) / 100).toFixed(2)
  return `$ ${amount} USD  ·  € ${amount} EUR`
}

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()
const adminApi = useAdminApi()

const slug = computed(() => route.params.slug)
const tier = ref(null)
const loading = ref(true)
const saving = ref(false)
const newFeatureInput = ref('')
const newFeatureDisplayInput = ref('')

const featureList = computed(() => {
  const s = form.value.featuresStr
  if (!s || typeof s !== 'string') return []
  return s.split(',').map((x) => x.trim()).filter(Boolean)
})

const featureDisplayList = computed(() => {
  const s = form.value.features_displayStr
  if (!s || typeof s !== 'string') return []
  return s.split('\n').map((x) => x.trim()).filter(Boolean)
})

const storageGbInput = computed({
  get() {
    const b = form.value.storage_bytes
    return b != null && b !== '' && !Number.isNaN(Number(b)) ? Number(b) / 1e9 : null
  },
  set(v) {
    const num = v !== '' && v != null ? Number(v) : null
    form.value.storage_bytes = num != null && !Number.isNaN(num) ? Math.round(num * 1e9) : null
  },
})

function onFeatureKeydown(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addFeatureFromInput()
  }
}

function addFeatureFromInput() {
  const val = newFeatureInput.value.trim()
  if (!val) return
  const list = featureList.value
  if (list.includes(val)) {
    newFeatureInput.value = ''
    return
  }
  form.value.featuresStr = list.length ? `${form.value.featuresStr}, ${val}` : val
  newFeatureInput.value = ''
}

function removeFeature(index) {
  const list = [...featureList.value]
  list.splice(index, 1)
  form.value.featuresStr = list.join(', ')
}

function onFeatureDisplayKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addFeatureDisplayFromInput()
  }
}

function addFeatureDisplayFromInput() {
  const val = newFeatureDisplayInput.value.trim()
  if (!val) return
  const list = featureDisplayList.value
  if (list.includes(val)) {
    newFeatureDisplayInput.value = ''
    return
  }
  form.value.features_displayStr = list.length ? `${form.value.features_displayStr}\n${val}` : val
  newFeatureDisplayInput.value = ''
}

function removeFeatureDisplay(index) {
  const list = [...featureDisplayList.value]
  list.splice(index, 1)
  form.value.features_displayStr = list.join('\n')
}
const form = ref({
  name: '',
  description: '',
  price_monthly_cents: 0,
  price_annual_cents: 0,
  storage_bytes: null,
  project_limit: null,
  collection_limit: null,
  selection_limit: null,
  proofing_limit: null,
  set_limit_per_phase: null,
  max_revisions: 0,
  watermark_limit: null,
  preset_limit: null,
  team_seats: 1,
  raw_file_limit: null,
  featuresStr: '',
  features_displayStr: '',
  capabilities: {},
  is_popular: false,
  is_active: true,
})

watch(
  () => tier.value,
  (t) => {
    if (!t) return
    form.value = {
      name: t.name ?? '',
      description: t.description ?? '',
      price_monthly_cents: t.price_monthly_cents ?? 0,
      price_annual_cents: t.price_annual_cents ?? 0,
      storage_bytes: t.storage_bytes ?? null,
      project_limit: t.project_limit ?? null,
      collection_limit: t.collection_limit ?? null,
      selection_limit: t.selection_limit ?? null,
      proofing_limit: t.proofing_limit ?? null,
      set_limit_per_phase: t.set_limit_per_phase ?? null,
      max_revisions: t.max_revisions ?? 0,
      watermark_limit: t.watermark_limit ?? null,
      preset_limit: t.preset_limit ?? null,
      team_seats: t.team_seats ?? 1,
      raw_file_limit: t.raw_file_limit ?? null,
      featuresStr: Array.isArray(t.features) ? t.features.join(', ') : '',
      features_displayStr: Array.isArray(t.features_display) ? t.features_display.join('\n') : '',
      capabilities: { ...(t.capabilities || {}) },
      is_popular: !!t.is_popular,
      is_active: !!t.is_active,
    }
    capabilityKeys.forEach((k) => {
      if (form.value.capabilities[k] === undefined) form.value.capabilities[k] = false
    })
  },
  { immediate: true }
)

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

async function submit() {
  if (!tier.value) return
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      description: form.value.description || null,
      price_monthly_cents: form.value.price_monthly_cents,
      price_annual_cents: form.value.price_annual_cents,
      storage_bytes: form.value.storage_bytes || null,
      project_limit: form.value.project_limit ?? null,
      collection_limit: form.value.collection_limit ?? null,
      selection_limit: form.value.selection_limit ?? null,
      proofing_limit: form.value.proofing_limit ?? null,
      set_limit_per_phase: form.value.set_limit_per_phase ?? null,
      max_revisions: form.value.max_revisions,
      watermark_limit: form.value.watermark_limit ?? null,
      preset_limit: form.value.preset_limit ?? null,
      team_seats: form.value.team_seats,
      raw_file_limit: form.value.raw_file_limit ?? null,
      features: form.value.featuresStr
        ? form.value.featuresStr.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      features_display: form.value.features_displayStr
        ? form.value.features_displayStr.split('\n').map((s) => s.trim()).filter(Boolean)
        : [],
      capabilities: form.value.capabilities,
      is_popular: form.value.is_popular,
      is_active: form.value.is_active,
    }
    await adminApi.updatePricingTier(tier.value.slug, payload)
    router.push({ name: 'admin-pricing' })
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
