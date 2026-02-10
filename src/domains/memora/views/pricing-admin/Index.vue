<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
      <header class="space-y-1">
        <h1 :class="['text-2xl sm:text-3xl font-semibold tracking-tight', theme.textPrimary]">Memora Pricing</h1>
        <p class="text-sm text-muted-foreground">
          Manage fixed tiers, Build Your Own base config, and addons.
        </p>
      </header>

      <nav
        class="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
        role="tablist"
        aria-label="Pricing sections"
      >
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="activeTab === t.id"
        :class="[
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          activeTab === t.id
            ? 'bg-background text-foreground shadow-sm'
            : 'hover:text-foreground',
        ]"
        @click="setTab(t.id)"
      >
        {{ t.label }}
      </button>
    </nav>

    <!-- Fixed Tiers -->
    <Transition name="fade-slide" mode="out-in">
      <section v-if="activeTab === 'tiers'" key="tiers" class="space-y-6" aria-label="Fixed tiers">
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 :class="['text-base font-semibold', theme.textPrimary]">Fixed tiers</h2>
              <p class="text-xs text-muted-foreground mt-1">Predefined plans (e.g. Starter, Pro). View, edit, or add tiers.</p>
            </div>
            <RouterLink :to="{ name: 'admin-pricing-tier-create' }" class="shrink-0">
              <Button size="sm" variant="default">Add tier</Button>
            </RouterLink>
          </div>
          <div v-if="loadingTiers" class="p-8 sm:p-10 flex flex-col items-center justify-center gap-4">
            <span class="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
            <span class="text-sm text-muted-foreground">Loading tiers…</span>
            <div class="w-full max-w-md space-y-3 mt-2">
              <div v-for="i in 3" :key="i" class="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
                <div class="flex gap-3">
                  <div :class="['h-5 w-24 rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 80}ms` }" />
                  <div :class="['h-5 w-20 rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 80 + 20}ms` }" />
                </div>
                <div :class="['h-8 w-20 rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 80 + 40}ms` }" />
              </div>
            </div>
          </div>
          <template v-else>
            <ul class="divide-y divide-border">
              <li
                v-for="(tier, index) in tiers"
                :key="tier.slug"
                :class="['flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6 transition-colors hover:bg-muted/30 animate-slide-up']"
                :style="{ animationDelay: `${Math.min(index * 50, 300)}ms`, animationFillMode: 'backwards' }"
              >
                <div class="flex min-w-0 flex-1 items-center gap-3">
                  <span class="font-medium text-foreground">{{ tier.name }}</span>
                  <span class="text-sm text-muted-foreground">{{ tier.slug }}</span>
                  <Badge v-if="!tier.is_active" variant="secondary" class="shrink-0">Inactive</Badge>
                  <Badge v-else-if="tier.is_popular" variant="default" class="shrink-0 bg-accent/20 text-accent-foreground border-transparent hover:bg-accent/30">Popular</Badge>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <RouterLink :to="{ name: 'admin-pricing-tier-view', params: { slug: tier.slug } }">
                    <Button variant="outline" size="sm">View</Button>
                  </RouterLink>
                  <RouterLink :to="{ name: 'admin-pricing-tier-edit', params: { slug: tier.slug } }">
                    <Button variant="outline" size="sm">Edit</Button>
                  </RouterLink>
                  <Button variant="outline" size="sm" class="text-destructive hover:text-destructive hover:bg-destructive/10" @click="tierToDelete = tier">
                    Delete
                  </Button>
                </div>
              </li>
            </ul>
            <p v-if="tiers.length === 0" class="px-6 py-12 text-center text-sm text-muted-foreground">
              No tiers configured.
            </p>
          </template>
        </div>
      </section>
    </Transition>

    <!-- BYO Config -->
    <Transition name="fade-slide" mode="out-in">
      <section v-if="activeTab === 'byo-config'" key="byo-config" class="space-y-6" aria-label="Build Your Own config">
        <div v-if="loadingByo" class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Build Your Own config</h2>
            <p class="text-xs text-muted-foreground mt-1">Base pricing, limits, and annual discount.</p>
          </div>
          <div class="p-8 sm:p-10 flex flex-col items-center gap-4">
            <span class="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
            <span class="text-sm text-muted-foreground">Loading config…</span>
            <div class="w-full max-w-lg grid gap-4 sm:grid-cols-2 mt-2">
              <div v-for="i in 4" :key="i" class="space-y-2">
                <div :class="['h-4 w-28 rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 60}ms` }" />
                <div :class="['h-9 w-full rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 60 + 25}ms` }" />
              </div>
            </div>
          </div>
        </div>
      <form v-else class="space-y-6" @submit.prevent="saveByoConfig">
        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Base pricing</h2>
            <p class="text-xs text-muted-foreground mt-1">Default monthly and annual prices for BYO plans. Enter amounts in cents (e.g. 999 for $9.99, 1200 for $12.00).</p>
          </div>
          <div class="grid gap-4 p-5 sm:p-6 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="byo-monthly">Base price monthly (cents)</Label>
              <Input
                id="byo-monthly"
                v-model.number="byoForm.base_price_monthly_cents"
                type="number"
                min="0"
                class="w-full font-variant-numeric tabular-nums"
              />
              <p class="text-xs text-muted-foreground tabular-nums">{{ formatCentsToCurrency(byoForm.base_price_monthly_cents) }}</p>
            </div>
            <div class="space-y-2">
              <Label for="byo-annual">Base price annual (cents)</Label>
              <Input
                id="byo-annual"
                v-model.number="byoForm.base_price_annual_cents"
                type="number"
                min="0"
                class="w-full font-variant-numeric tabular-nums"
              />
              <p class="text-xs text-muted-foreground tabular-nums">{{ formatCentsToCurrency(byoForm.base_price_annual_cents) }}</p>
            </div>
            <div class="space-y-2">
              <Label for="byo-cost-monthly">Base cost monthly (cents)</Label>
              <Input
                id="byo-cost-monthly"
                v-model.number="byoForm.base_cost_monthly_cents"
                type="number"
                min="0"
                class="w-full font-variant-numeric tabular-nums"
                placeholder="—"
              />
              <p class="text-xs text-muted-foreground tabular-nums">{{ formatCentsToCurrency(byoForm.base_cost_monthly_cents) }}</p>
            </div>
            <div class="space-y-2">
              <Label for="byo-cost-annual">Base cost annual (cents)</Label>
              <Input
                id="byo-cost-annual"
                v-model.number="byoForm.base_cost_annual_cents"
                type="number"
                min="0"
                class="w-full font-variant-numeric tabular-nums"
                placeholder="—"
              />
              <p class="text-xs text-muted-foreground tabular-nums">{{ formatCentsToCurrency(byoForm.base_cost_annual_cents) }}</p>
            </div>
          </div>
          <div v-if="byoProfitSummary" class="px-5 sm:px-6 pb-5 sm:pb-6">
            <p class="text-sm font-medium text-foreground">Base plan profit</p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ byoProfitSummary }}</p>
          </div>
        </section>
        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Base limits</h2>
            <p class="text-xs text-muted-foreground mt-1">Included storage and project count for BYO plans.</p>
          </div>
          <div class="p-5 sm:p-6 space-y-6">
            <div class="rounded-lg border border-border bg-muted/30 dark:bg-muted/10 px-4 py-4 space-y-3">
              <Label for="byo-storage" class="text-sm font-medium">Storage</Label>
              <p class="text-xs text-muted-foreground">1 GB = 1,000,000,000 bytes. Enter bytes or use the GB field.</p>
              <div class="flex flex-wrap items-end gap-4">
                <div class="min-w-[180px]">
                  <Label for="byo-storage" class="sr-only">Base storage (bytes)</Label>
                  <Input
                    id="byo-storage"
                    v-model.number="byoForm.base_storage_bytes"
                    type="number"
                    min="0"
                    class="w-full font-variant-numeric tabular-nums"
                    placeholder="e.g. 5000000000"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <Label for="byo-storage-gb" class="text-xs text-muted-foreground shrink-0">GB</Label>
                  <Input
                    id="byo-storage-gb"
                    v-model.number="byoStorageGbInput"
                    type="number"
                    min="0"
                    step="any"
                    class="w-20 font-variant-numeric tabular-nums"
                    placeholder="5"
                  />
                </div>
                <p class="text-sm text-muted-foreground tabular-nums pb-2 min-w-[6rem]">
                  {{ formatBytes(byoForm.base_storage_bytes) }}
                </p>
              </div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div class="space-y-2">
                <Label for="byo-projects" class="text-sm font-medium">Base project limit</Label>
                <Input
                  id="byo-projects"
                  v-model.number="byoForm.base_project_limit"
                  type="number"
                  min="0"
                  class="w-full font-variant-numeric tabular-nums"
                  placeholder="1"
                />
              </div>
              <div class="space-y-2">
                <Label for="byo-selection" class="text-sm font-medium">Base selection limit</Label>
                <Input
                  id="byo-selection"
                  v-model.number="byoForm.base_selection_limit"
                  type="number"
                  min="0"
                  class="w-full font-variant-numeric tabular-nums"
                  placeholder="1"
                />
              </div>
              <div class="space-y-2">
                <Label for="byo-proofing" class="text-sm font-medium">Base proofing limit</Label>
                <Input
                  id="byo-proofing"
                  v-model.number="byoForm.base_proofing_limit"
                  type="number"
                  min="0"
                  class="w-full font-variant-numeric tabular-nums"
                  placeholder="1"
                />
              </div>
              <div class="space-y-2">
                <Label for="byo-collection" class="text-sm font-medium">Base collection limit</Label>
                <Input
                  id="byo-collection"
                  v-model.number="byoForm.base_collection_limit"
                  type="number"
                  min="0"
                  class="w-full font-variant-numeric tabular-nums"
                  placeholder="1"
                />
              </div>
              <div class="space-y-2">
                <Label for="byo-raw-file" class="text-sm font-medium">Base raw file limit</Label>
                <Input
                  id="byo-raw-file"
                  v-model.number="byoForm.base_raw_file_limit"
                  type="number"
                  min="0"
                  class="w-full font-variant-numeric tabular-nums"
                  placeholder="1"
                />
              </div>
              <div class="space-y-2">
                <Label for="byo-max-revisions" class="text-sm font-medium">Base max revisions (proofing)</Label>
                <Input
                  id="byo-max-revisions"
                  v-model.number="byoForm.base_max_revisions"
                  type="number"
                  min="0"
                  class="w-full font-variant-numeric tabular-nums"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </section>
        <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
            <h2 :class="['text-base font-semibold', theme.textPrimary]">Annual discount</h2>
            <p class="text-xs text-muted-foreground mt-1">Months given free when billing annually.</p>
          </div>
          <div class="p-5 sm:p-6">
            <div class="max-w-xs space-y-2">
              <Label for="byo-discount">Months free</Label>
              <Input
                id="byo-discount"
                v-model.number="byoForm.annual_discount_months"
                type="number"
                min="0"
                max="12"
                class="w-full font-variant-numeric tabular-nums"
              />
            </div>
          </div>
        </section>
        <div class="flex justify-end">
          <Button type="submit" :disabled="savingByo">
            <span v-if="savingByo" class="inline-flex items-center gap-2">
              <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              Saving…
            </span>
            <span v-else>Save config</span>
          </Button>
        </div>
      </form>
      </section>
    </Transition>

    <!-- BYO Addons -->
    <Transition name="fade-slide" mode="out-in">
      <section v-if="activeTab === 'byo-addons'" key="byo-addons" class="space-y-4" aria-label="BYO addons">
      <div class="flex justify-end">
        <Button size="sm" variant="default" @click="openAddonCreate">Add addon</Button>
      </div>
      <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <DataTable
          :columns="addonColumns"
          :items="addons"
          :loading="loadingAddons"
          :getId="(a) => a.id"
          searchable
          search-placeholder="Search addons…"
          empty-message="No addons. Add one to get started."
        >
          <template #cell-margin_monthly_pct="{ value }">
            <span class="tabular-nums">{{ value != null ? Math.round(value) + '%' : '—' }}</span>
          </template>
          <template #cell-is_active="{ value }">
            <Badge :variant="value ? 'default' : 'secondary'">
              {{ value ? 'Yes' : 'No' }}
            </Badge>
          </template>
          <template #cell-actions="{ item }">
            <div class="flex items-center justify-end gap-2">
              <Button variant="link" size="sm" @click="openAddonEdit(item)">Edit</Button>
              <Button variant="link" size="sm" class="text-destructive hover:text-destructive hover:underline" @click="addonToDelete = item">
                Delete
              </Button>
            </div>
          </template>
          </DataTable>
        </div>
      </section>
    </Transition>

    <AddonEditDialog
      :open="addonDialogOpen"
      :addon="selectedAddon"
      :is-create="isAddonCreate"
      :existing-slugs="addons.map((a) => a.slug)"
      @update:open="addonDialogOpen = $event"
      @saved="onAddonSaved"
    />

    <Dialog :open="!!tierToDelete" @update:open="(v) => !v && (tierToDelete = null)">
      <DialogContent class="max-w-md" :hide-close="deletingTier">
        <DialogHeader>
          <DialogTitle>Delete tier</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete
            <strong v-if="tierToDelete">{{ tierToDelete.name || tierToDelete.slug }}</strong>?
            This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-2 pt-4">
          <Button variant="outline" :disabled="deletingTier" @click="tierToDelete = null">
            Cancel
          </Button>
          <Button variant="default" class="bg-destructive text-destructive-foreground hover:bg-destructive/90" :disabled="deletingTier" @click="submitDeleteTier">
            <span v-if="deletingTier" class="inline-flex items-center gap-2">
              <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              Deleting…
            </span>
            <span v-else>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="!!addonToDelete" @update:open="(v) => !v && (addonToDelete = null)">
      <DialogContent class="max-w-md" :hide-close="deletingAddon">
        <DialogHeader>
          <DialogTitle>Delete addon</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete
            <strong v-if="addonToDelete">{{ addonToDelete.label || addonToDelete.slug }}</strong>?
            This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-2 pt-4">
          <Button variant="outline" :disabled="deletingAddon" @click="addonToDelete = null">
            Cancel
          </Button>
          <Button variant="default" class="bg-destructive text-destructive-foreground hover:bg-destructive/90" :disabled="deletingAddon" @click="submitDeleteAddon">
            <span v-if="deletingAddon" class="inline-flex items-center gap-2">
              <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              Deleting…
            </span>
            <span v-else>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { formatBytes } from '@/shared/utils/formatBytes'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import Button from '@/shared/components/shadcn/button/Button.vue'
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'
import { Badge } from '@/shared/components/shadcn/badge'
import AddonEditDialog from './AddonEditDialog.vue'
import DataTable from '@/shared/components/organisms/DataTable.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'

const theme = useThemeClasses()

const addonColumns = [
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'label', label: 'Label', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'price_monthly_cents', label: 'Monthly (¢)', sortable: true, numeric: true },
  { key: 'price_annual_cents', label: 'Annual (¢)', sortable: true, numeric: true },
  { key: 'margin_monthly_pct', label: 'Margin %', sortable: true, numeric: true },
  { key: 'is_active', label: 'Active', slot: 'is_active', sortable: true },
  { key: 'actions', label: 'Actions', slot: 'actions' },
]

const tabs = [
  { id: 'tiers', label: 'Fixed Tiers' },
  { id: 'byo-config', label: 'BYO Config' },
  { id: 'byo-addons', label: 'BYO Addons' },
]

const tabIds = tabs.map((t) => t.id)
function isValidTab(id) {
  return id && tabIds.includes(id)
}

const route = useRoute()
const router = useRouter()
const adminApi = useAdminApi()
const activeTab = ref(isValidTab(route.query.tab) ? route.query.tab : 'tiers')
const tiers = ref([])
const loadingTiers = ref(true)
const byoForm = ref({
  base_price_monthly_cents: 0,
  base_price_annual_cents: 0,
  base_cost_monthly_cents: null,
  base_cost_annual_cents: null,
  base_storage_bytes: 0,
  base_project_limit: 1,
  base_selection_limit: 1,
  base_proofing_limit: 1,
  base_collection_limit: 1,
  base_raw_file_limit: 1,
  base_max_revisions: 0,
  annual_discount_months: 2,
})

const byoProfitSummary = computed(() => {
  const m = byoForm.value.base_cost_monthly_cents
  const a = byoForm.value.base_cost_annual_cents
  if (m == null && a == null) return null
  const pm = m != null ? byoForm.value.base_price_monthly_cents - m : null
  const pa = a != null ? byoForm.value.base_price_annual_cents - a : null
  const mm = m != null && byoForm.value.base_price_monthly_cents > 0
    ? ((byoForm.value.base_price_monthly_cents - m) / byoForm.value.base_price_monthly_cents) * 100
    : null
  const ma = a != null && byoForm.value.base_price_annual_cents > 0
    ? ((byoForm.value.base_price_annual_cents - a) / byoForm.value.base_price_annual_cents) * 100
    : null
  const parts = []
  if (pm != null) parts.push(`$${(pm / 100).toFixed(2)}/mo profit`)
  if (pa != null) parts.push(`$${(pa / 100).toFixed(2)}/yr profit`)
  if (mm != null) parts.push(`${mm}% margin (mo)`)
  if (ma != null) parts.push(`${ma}% margin (yr)`)
  return parts.length ? parts.join(' · ') : null
})
const loadingByo = ref(true)
const savingByo = ref(false)
const addons = ref([])
const loadingAddons = ref(true)
const addonDialogOpen = ref(false)
const selectedAddon = ref(null)
const isAddonCreate = ref(false)
const tierToDelete = ref(null)
const deletingTier = ref(false)
const addonToDelete = ref(null)
const deletingAddon = ref(false)

function formatCentsToCurrency(cents) {
  if (cents == null || cents === '' || Number.isNaN(Number(cents)) || cents < 0) return '—'
  const amount = (Number(cents) / 100).toFixed(2)
  return `$ ${amount} USD  ·  € ${amount} EUR`
}

const byoStorageGbInput = computed({
  get() {
    const b = byoForm.value.base_storage_bytes
    return b != null && b !== '' && !Number.isNaN(Number(b)) ? Number(b) / 1e9 : null
  },
  set(v) {
    const num = v !== '' && v != null ? Number(v) : null
    byoForm.value.base_storage_bytes = num != null && !Number.isNaN(num) ? Math.round(num * 1e9) : null
  },
})

async function loadTiers() {
  loadingTiers.value = true
  try {
    tiers.value = await adminApi.getPricingTiers()
  } catch (e) {
    console.error(e)
  } finally {
    loadingTiers.value = false
  }
}

async function loadByoConfig() {
  loadingByo.value = true
  try {
    const data = await adminApi.getByoConfig()
    if (data) {
      byoForm.value = {
        base_price_monthly_cents: data.base_price_monthly_cents ?? 0,
        base_price_annual_cents: data.base_price_annual_cents ?? 0,
        base_cost_monthly_cents: data.base_cost_monthly_cents ?? null,
        base_cost_annual_cents: data.base_cost_annual_cents ?? null,
        base_storage_bytes: data.base_storage_bytes ?? 0,
        base_project_limit: data.base_project_limit ?? 3,
        base_selection_limit: data.base_selection_limit ?? 0,
        base_proofing_limit: data.base_proofing_limit ?? 0,
        base_collection_limit: data.base_collection_limit ?? 0,
        base_raw_file_limit: data.base_raw_file_limit ?? 0,
        base_max_revisions: data.base_max_revisions ?? 0,
        annual_discount_months: data.annual_discount_months ?? 2,
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingByo.value = false
  }
}

async function saveByoConfig() {
  savingByo.value = true
  try {
    await adminApi.updateByoConfig(byoForm.value)
  } catch (e) {
    console.error(e)
  } finally {
    savingByo.value = false
  }
}

async function loadAddons() {
  loadingAddons.value = true
  try {
    addons.value = await adminApi.getByoAddons()
  } catch (e) {
    console.error(e)
  } finally {
    loadingAddons.value = false
  }
}

function openAddonCreate() {
  selectedAddon.value = null
  isAddonCreate.value = true
  addonDialogOpen.value = true
}

function openAddonEdit(addon) {
  selectedAddon.value = { ...addon }
  isAddonCreate.value = false
  addonDialogOpen.value = true
}

function setTab(id) {
  if (!isValidTab(id)) return
  activeTab.value = id
  router.replace({ name: 'admin-pricing', query: { ...route.query, tab: id } })
}

async function submitDeleteAddon() {
  if (!addonToDelete.value) return
  deletingAddon.value = true
  try {
    await adminApi.deleteByoAddon(addonToDelete.value.id)
    addonToDelete.value = null
    loadAddons()
  } catch (e) {
    console.error(e)
  } finally {
    deletingAddon.value = false
  }
}

function onAddonSaved() {
  loadAddons()
}

async function submitDeleteTier() {
  if (!tierToDelete.value) return
  deletingTier.value = true
  try {
    await adminApi.deletePricingTier(tierToDelete.value.slug)
    tierToDelete.value = null
    loadTiers()
  } catch (e) {
    console.error(e)
  } finally {
    deletingTier.value = false
  }
}

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = isValidTab(tab) ? tab : 'tiers'
  }
)

watch(activeTab, (tab) => {
  if (tab === 'tiers' && tiers.value.length === 0) loadTiers()
  if (tab === 'byo-config') loadByoConfig()
  if (tab === 'byo-addons') loadAddons()
})

onMounted(() => {
  loadTiers()
  if (activeTab.value === 'byo-config') loadByoConfig()
  if (activeTab.value === 'byo-addons') loadAddons()
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
