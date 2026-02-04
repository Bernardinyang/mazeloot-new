<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent side="right" class="w-full sm:max-w-lg p-0 gap-0 flex flex-col h-full">
      <SheetHeader class="shrink-0 border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
        <SheetTitle class="text-base font-semibold">{{ isCreate ? 'New addon' : 'Edit addon' }}</SheetTitle>
        <SheetDescription class="text-xs text-muted-foreground mt-1">
          {{ isCreate ? 'Create a BYO addon (checkbox or storage).' : 'Update addon pricing and settings.' }}
        </SheetDescription>
      </SheetHeader>
      <form id="addon-edit-form" class="flex flex-col min-h-0 flex-1 overflow-auto" @submit.prevent="submit">
        <div class="divide-y divide-border">
          <section>
            <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
              <h2 class="text-base font-semibold text-foreground">Identity</h2>
              <p class="text-xs text-muted-foreground mt-1">Slug, label, and addon type. Slug cannot be changed after creation.</p>
            </div>
            <div class="p-5 sm:p-6 space-y-4">
              <div v-if="isCreate" class="space-y-2">
                <Label for="addon-type">Type</Label>
                <Select v-model="form.type" @update:model-value="form.slug = ''">
                  <SelectTrigger id="addon-type" class="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-xs text-muted-foreground">Checkbox: pick from allowed slugs. Storage: any slug and size you define.</p>
              </div>
              <div class="space-y-2">
                <Label for="addon-slug">Slug</Label>
                <Select
                  v-if="isCreate && form.type === 'checkbox'"
                  v-model="form.slug"
                  :disabled="allowedSlugsLoading"
                  @update:model-value="onSlugSelect"
                >
                  <SelectTrigger id="addon-slug" class="w-full">
                    <SelectValue placeholder="Select addon…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="opt in availableCheckboxSlugs" :key="opt.slug" :value="opt.slug">
                      {{ opt.slug }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  v-else-if="isCreate && form.type === 'storage'"
                  id="addon-slug"
                  v-model="form.slug"
                  class="w-full"
                  placeholder="e.g. storage_20gb"
                />
                <Input
                  v-else
                  id="addon-slug"
                  :model-value="form.slug"
                  disabled
                  class="w-full bg-muted"
                />
                <p v-if="!isCreate" class="text-xs text-muted-foreground">Slug cannot be changed after creation.</p>
                <p v-else-if="form.type === 'checkbox'" class="text-xs text-muted-foreground">Only allowed checkbox addon slugs (unlock product features).</p>
                <p v-else-if="form.type === 'storage'" class="text-xs text-muted-foreground">Any slug. Storage size below is used for BYO limits.</p>
              </div>
              <div class="space-y-2">
                <Label for="addon-label">Label</Label>
                <Input id="addon-label" v-model="form.label" class="w-full" placeholder="e.g. Proofing" />
              </div>
              <div v-if="!isCreate" class="space-y-2">
                <Label for="addon-type-display">Type</Label>
                <Input id="addon-type-display" :model-value="form.type" disabled class="w-full bg-muted capitalize" />
              </div>
            </div>
          </section>

          <section>
            <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
              <h2 class="text-base font-semibold text-foreground">Pricing</h2>
              <p class="text-xs text-muted-foreground mt-1">Recurring price. Enter amounts in cents (e.g. 999 for $9.99, 1200 for $12.00).</p>
            </div>
            <div class="p-5 sm:p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="addon-monthly">Monthly (cents)</Label>
                  <Input
                    id="addon-monthly"
                    v-model.number="form.price_monthly_cents"
                    type="number"
                    min="0"
                    class="w-full font-variant-numeric tabular-nums"
                  />
                  <p class="text-xs text-muted-foreground tabular-nums">{{ formatCentsToCurrency(form.price_monthly_cents) }}</p>
                </div>
                <div class="space-y-2">
                  <Label for="addon-annual">Annual (cents)</Label>
                  <Input
                    id="addon-annual"
                    v-model.number="form.price_annual_cents"
                    type="number"
                    min="0"
                    class="w-full font-variant-numeric tabular-nums"
                  />
                  <p class="text-xs text-muted-foreground tabular-nums">{{ formatCentsToCurrency(form.price_annual_cents) }}</p>
                </div>
                <div class="space-y-2">
                  <Label for="addon-cost-monthly">Cost monthly (cents)</Label>
                  <Input
                    id="addon-cost-monthly"
                    v-model.number="form.cost_monthly_cents"
                    type="number"
                    min="0"
                    class="w-full font-variant-numeric tabular-nums"
                    placeholder="—"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="addon-cost-annual">Cost annual (cents)</Label>
                  <Input
                    id="addon-cost-annual"
                    v-model.number="form.cost_annual_cents"
                    type="number"
                    min="0"
                    class="w-full font-variant-numeric tabular-nums"
                    placeholder="—"
                  />
                </div>
              </div>
              <div v-if="addonProfitSummary" class="rounded-lg border border-border bg-muted/30 dark:bg-muted/10 px-4 py-3">
                <p class="text-sm font-medium text-foreground">Profit</p>
                <p class="text-xs text-muted-foreground mt-0.5">{{ addonProfitSummary }}</p>
              </div>
              <div v-if="form.type === 'checkbox'" class="rounded-lg border border-border bg-muted/30 dark:bg-muted/10 px-4 py-4 space-y-3">
                <p class="text-sm font-medium text-foreground">Limit granted per unit</p>
                <p class="text-xs text-muted-foreground">When customer selects this addon with quantity N, they get N × granted of each limit. Leave empty for feature-only addons.</p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <Label for="addon-selection-granted" class="text-xs">Selections</Label>
                    <Input
                      id="addon-selection-granted"
                      v-model.number="form.selection_limit_granted"
                      type="number"
                      min="0"
                      class="w-full font-variant-numeric tabular-nums"
                      placeholder="—"
                    />
                  </div>
                  <div class="space-y-1">
                    <Label for="addon-proofing-granted" class="text-xs">Proofings</Label>
                    <Input
                      id="addon-proofing-granted"
                      v-model.number="form.proofing_limit_granted"
                      type="number"
                      min="0"
                      class="w-full font-variant-numeric tabular-nums"
                      placeholder="—"
                    />
                  </div>
                  <div class="space-y-1">
                    <Label for="addon-collection-granted" class="text-xs">Collections</Label>
                    <Input
                      id="addon-collection-granted"
                      v-model.number="form.collection_limit_granted"
                      type="number"
                      min="0"
                      class="w-full font-variant-numeric tabular-nums"
                      placeholder="—"
                    />
                  </div>
                  <div class="space-y-1">
                    <Label for="addon-project-granted" class="text-xs">Projects</Label>
                    <Input
                      id="addon-project-granted"
                      v-model.number="form.project_limit_granted"
                      type="number"
                      min="0"
                      class="w-full font-variant-numeric tabular-nums"
                      placeholder="—"
                    />
                  </div>
                  <div class="space-y-1">
                    <Label for="addon-raw-file-granted" class="text-xs">Raw files</Label>
                    <Input
                      id="addon-raw-file-granted"
                      v-model.number="form.raw_file_limit_granted"
                      type="number"
                      min="0"
                      class="w-full font-variant-numeric tabular-nums"
                      placeholder="—"
                    />
                  </div>
                  <div class="space-y-1">
                    <Label for="addon-max-revisions-granted" class="text-xs">Max revisions (proofing)</Label>
                    <Input
                      id="addon-max-revisions-granted"
                      v-model.number="form.max_revisions_granted"
                      type="number"
                      min="0"
                      class="w-full font-variant-numeric tabular-nums"
                      placeholder="—"
                    />
                  </div>
                </div>
              </div>
              <div v-if="form.type === 'storage'" class="rounded-lg border border-border bg-muted/30 dark:bg-muted/10 px-4 py-4 space-y-3">
                <Label for="addon-storage" class="text-sm font-medium">Storage</Label>
                <p class="text-xs text-muted-foreground">1 GB = 1,000,000,000 bytes. Enter bytes or use the GB field.</p>
                <div class="flex flex-wrap items-end gap-4">
                  <div class="min-w-[180px]">
                    <Label for="addon-storage" class="sr-only">Storage (bytes)</Label>
                    <Input
                      id="addon-storage"
                      v-model.number="form.storage_bytes"
                      type="number"
                      min="0"
                      class="w-full font-variant-numeric tabular-nums"
                      placeholder="e.g. 5000000000"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <Label for="addon-storage-gb" class="text-xs text-muted-foreground shrink-0">GB</Label>
                    <Input
                      id="addon-storage-gb"
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
            </div>
          </section>

          <section>
            <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
              <h2 class="text-base font-semibold text-foreground">Order & status</h2>
              <p class="text-xs text-muted-foreground mt-1">Display order and whether the addon is default or active.</p>
            </div>
            <div class="p-5 sm:p-6 space-y-4">
              <div class="space-y-2">
                <Label for="addon-sort">Sort order</Label>
                <Input
                  id="addon-sort"
                  v-model.number="form.sort_order"
                  type="number"
                  min="0"
                  class="w-full max-w-[8rem] font-variant-numeric tabular-nums"
                />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Checkbox v-model="form.is_default" root-class="rounded-lg border border-border px-4 py-4 hover:bg-muted/30 transition-colors w-full">
                  <span class="text-sm font-medium block">Default</span>
                  <span class="text-xs text-muted-foreground mt-0.5 block">Pre-selected for new BYO plans.</span>
                </Checkbox>
                <Checkbox v-model="form.is_active" root-class="rounded-lg border border-border px-4 py-4 hover:bg-muted/30 transition-colors w-full">
                  <span class="text-sm font-medium block">Active</span>
                  <span class="text-xs text-muted-foreground mt-0.5 block">Inactive addons are hidden from customers.</span>
                </Checkbox>
              </div>
            </div>
          </section>
        </div>
        <SheetFooter class="shrink-0 px-5 py-4 border-t border-border bg-muted/20 dark:bg-muted/10">
          <Button type="button" variant="outline" @click="$emit('update:open', false)">Cancel</Button>
          <Button type="submit" form="addon-edit-form" variant="default" :disabled="saving">
            <span v-if="saving" class="inline-flex items-center gap-2">
              <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              Saving…
            </span>
            <span v-else>{{ isCreate ? 'Create addon' : 'Save changes' }}</span>
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { formatBytes } from '@/shared/utils/formatBytes'
import Checkbox from '@/shared/components/shadcn/checkbox/Checkbox.vue'
import Button from '@/shared/components/shadcn/button/Button.vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/shared/components/shadcn/sheet'
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'

function formatCentsToCurrency(cents) {
  if (cents == null || cents === '' || Number.isNaN(Number(cents)) || cents < 0) return '—'
  const amount = (Number(cents) / 100).toFixed(2)
  return `$ ${amount} USD  ·  € ${amount} EUR`
}

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

const props = defineProps({
  open: Boolean,
  addon: { type: Object, default: null },
  isCreate: Boolean,
  existingSlugs: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:open', 'saved'])

const adminApi = useAdminApi()
const saving = ref(false)
const allowedSlugs = ref([])
const allowedSlugsLoading = ref(false)
const form = ref({
  slug: '',
  label: '',
  type: 'checkbox',
  price_monthly_cents: 0,
  price_annual_cents: 0,
  cost_monthly_cents: null,
  cost_annual_cents: null,
  storage_bytes: null,
  selection_limit_granted: null,
  proofing_limit_granted: null,
  collection_limit_granted: null,
  project_limit_granted: null,
  raw_file_limit_granted: null,
  max_revisions_granted: null,
  sort_order: 0,
  is_default: false,
  is_active: true,
})

const addonProfitSummary = computed(() => {
  const m = form.value.cost_monthly_cents
  const a = form.value.cost_annual_cents
  if (m == null && a == null) return null
  const pm = m != null ? form.value.price_monthly_cents - m : null
  const pa = a != null ? form.value.price_annual_cents - a : null
  const mm = m != null && form.value.price_monthly_cents > 0
    ? ((form.value.price_monthly_cents - m) / form.value.price_monthly_cents) * 100
    : null
  const ma = a != null && form.value.price_annual_cents > 0
    ? ((form.value.price_annual_cents - a) / form.value.price_annual_cents) * 100
    : null
  const parts = []
  if (pm != null) parts.push(`$${(pm / 100).toFixed(2)}/mo`)
  if (pa != null) parts.push(`$${(pa / 100).toFixed(2)}/yr`)
  if (mm != null) parts.push(`${mm}% margin (mo)`)
  if (ma != null) parts.push(`${ma}% margin (yr)`)
  return parts.length ? parts.join(' · ') : null
})

const availableCheckboxSlugs = computed(() => {
  const list = allowedSlugs.value || []
  const used = new Set(props.existingSlugs || [])
  return list.filter((s) => s.type === 'checkbox' && !used.has(s.slug))
})

function onSlugSelect(slug) {
  const opt = allowedSlugs.value.find((s) => s.slug === slug)
  if (opt) form.value.type = opt.type
}

watch(
  () => [props.open, props.isCreate],
  async ([open, isCreate]) => {
    if (open && isCreate) {
      allowedSlugsLoading.value = true
      try {
        const data = await adminApi.getByoAddonSlugs()
        allowedSlugs.value = Array.isArray(data) ? data : []
      } catch {
        allowedSlugs.value = []
      } finally {
        allowedSlugsLoading.value = false
      }
    } else if (!open) {
      allowedSlugs.value = []
    }
  }
)

watch(
  () => props.addon,
  (a) => {
    if (a) {
      form.value = {
        slug: a.slug ?? '',
        label: a.label ?? '',
        type: a.type ?? 'checkbox',
        price_monthly_cents: a.price_monthly_cents ?? 0,
        price_annual_cents: a.price_annual_cents ?? 0,
        cost_monthly_cents: a.cost_monthly_cents ?? null,
        cost_annual_cents: a.cost_annual_cents ?? null,
        storage_bytes: a.storage_bytes ?? null,
        selection_limit_granted: a.selection_limit_granted ?? null,
        proofing_limit_granted: a.proofing_limit_granted ?? null,
        collection_limit_granted: a.collection_limit_granted ?? null,
        project_limit_granted: a.project_limit_granted ?? null,
        raw_file_limit_granted: a.raw_file_limit_granted ?? null,
        max_revisions_granted: a.max_revisions_granted ?? null,
        sort_order: a.sort_order ?? 0,
        is_default: !!a.is_default,
        is_active: !!a.is_active,
      }
    } else {
      form.value = {
        slug: '',
        label: '',
        type: 'checkbox',
        price_monthly_cents: 0,
        price_annual_cents: 0,
        cost_monthly_cents: null,
        cost_annual_cents: null,
        storage_bytes: null,
        selection_limit_granted: null,
        proofing_limit_granted: null,
        collection_limit_granted: null,
        project_limit_granted: null,
        raw_file_limit_granted: null,
        max_revisions_granted: null,
        sort_order: 0,
        is_default: false,
        is_active: true,
      }
    }
  },
  { immediate: true }
)

async function submit() {
  saving.value = true
  try {
    const payload = {
      slug: form.value.slug,
      label: form.value.label,
      type: form.value.type,
      price_monthly_cents: form.value.price_monthly_cents,
      price_annual_cents: form.value.price_annual_cents,
      cost_monthly_cents: form.value.cost_monthly_cents ?? null,
      cost_annual_cents: form.value.cost_annual_cents ?? null,
      storage_bytes: form.value.type === 'storage' ? form.value.storage_bytes : null,
      selection_limit_granted: form.value.type === 'checkbox' ? (form.value.selection_limit_granted ?? null) : null,
      proofing_limit_granted: form.value.type === 'checkbox' ? (form.value.proofing_limit_granted ?? null) : null,
      collection_limit_granted: form.value.type === 'checkbox' ? (form.value.collection_limit_granted ?? null) : null,
      project_limit_granted: form.value.type === 'checkbox' ? (form.value.project_limit_granted ?? null) : null,
      raw_file_limit_granted: form.value.type === 'checkbox' ? (form.value.raw_file_limit_granted ?? null) : null,
      max_revisions_granted: form.value.type === 'checkbox' ? (form.value.max_revisions_granted ?? null) : null,
      sort_order: form.value.sort_order,
      is_default: form.value.is_default,
      is_active: form.value.is_active,
    }
    if (props.isCreate) {
      await adminApi.createByoAddon(payload)
    } else {
      await adminApi.updateByoAddon(props.addon.id, payload)
    }
    emit('update:open', false)
    emit('saved')
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
