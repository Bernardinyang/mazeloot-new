<template>
  <SidebarModal
    v-model="isOpen"
    :title="event ? getEventLabel(event.event_type) : 'Transaction Details'"
    :description="event ? formatDate(event.created_at) : ''"
    content-class="sm:!max-w-lg"
    body-class="min-w-0 overflow-x-hidden"
  >
    <div v-if="event" class="space-y-5 min-w-0">
      <!-- Hero: Event badge + Amount -->
      <div
        :class="[
          'rounded-xl border p-4',
          eventBadgeClass,
          theme.borderSecondary,
        ]"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'p-2.5 rounded-lg shrink-0',
                eventIconBgClass,
              ]"
            >
              <component :is="eventIcon" class="h-5 w-5" :class="eventIconColorClass" />
            </div>
            <div>
              <p :class="['text-sm font-medium', theme.textSecondary]">Event</p>
              <p :class="['font-semibold', theme.textPrimary]">{{ getEventLabel(event.event_type) }}</p>
            </div>
          </div>
          <div v-if="event.amount_cents != null" class="text-right">
            <p :class="['text-2xl font-bold tabular-nums', amountColorClass]">
              {{ formatMoney(event.amount_cents, event.currency || 'USD') }}
            </p>
            <p v-if="event.billing_cycle" :class="['text-xs', theme.textTertiary]">
              {{ formatBillingCycle(event.billing_cycle) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Subscription section -->
      <div
        :class="[
          'rounded-xl border p-4 transition-colors',
          'bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-500/10',
          theme.borderSecondary,
        ]"
      >
        <div class="flex items-center gap-2 mb-3">
          <CreditCard class="h-4 w-4 text-amber-500" />
          <h3 :class="['text-sm font-semibold uppercase tracking-wide', theme.textPrimary]">Subscription</h3>
        </div>
        <div v-if="hasSubscriptionDetails" class="space-y-3">
          <div v-if="event.from_tier && event.to_tier" class="flex items-center gap-2">
            <span :class="['text-sm font-medium px-2 py-1 rounded-md', getTierBadgeClass(event.from_tier)]">
              {{ formatTierName(event.from_tier) }}
            </span>
            <ArrowRight class="h-4 w-4 shrink-0" :class="theme.textTertiary" />
            <span :class="['text-sm font-medium px-2 py-1 rounded-md', getTierBadgeClass(event.to_tier)]">
              {{ formatTierName(event.to_tier) }}
            </span>
          </div>
          <template v-else>
            <DetailField v-if="event.from_tier" label="From plan" :value="formatTierName(event.from_tier)" />
            <DetailField v-if="event.to_tier" label="To plan" :value="formatTierName(event.to_tier)" />
          </template>
          <DetailField v-if="event.billing_cycle" label="Billing cycle" :value="formatBillingCycle(event.billing_cycle)" />
        </div>
        <div v-else class="flex items-center gap-2 py-2">
          <FileText class="h-4 w-4 shrink-0" :class="theme.textTertiary" />
          <p :class="['text-sm', theme.textTertiary]">No subscription details for this event</p>
        </div>
        <div v-if="event.to_tier === 'byo'" class="mt-3 pt-3 space-y-4 border-t" :class="theme.borderSecondary">
          <div>
            <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textTertiary]">Features</p>
            <ul class="flex flex-wrap gap-1.5">
              <li
                v-for="f in byoPlanFeatures"
                :key="'feat-' + f.slug"
                :class="['text-xs px-2 py-1 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300', theme.borderSecondary]"
              >
                {{ f.label }}
              </li>
            </ul>
          </div>
          <div v-if="byoCapabilitiesList.length > 0">
            <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textTertiary]">Capabilities</p>
            <ul class="flex flex-wrap gap-1.5">
              <li
                v-for="c in byoCapabilitiesList"
                :key="'cap-' + c.slug"
                :class="['text-xs px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300', theme.borderSecondary]"
              >
                {{ c.label }}
              </li>
            </ul>
          </div>
          <div v-if="byoAddonsList.length > 0">
            <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textTertiary]">Add-ons</p>
            <ul class="space-y-1.5">
              <li
                v-for="(a, idx) in byoAddonsList"
                :key="'addon-' + (a.slug || idx)"
                :class="['text-xs flex justify-between gap-2', theme.textPrimary]"
              >
                <span>{{ a.label }}</span>
                <span v-if="a.qty > 1" :class="theme.textTertiary">×{{ a.qty }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Payment section -->
      <div
        :class="[
          'rounded-xl border p-4 transition-colors',
          'bg-gradient-to-br from-emerald-500/5 to-transparent dark:from-emerald-500/10',
          theme.borderSecondary,
        ]"
      >
        <div class="flex items-center gap-2 mb-3">
          <ShoppingCart class="h-4 w-4 text-emerald-500" />
          <h3 :class="['text-sm font-semibold uppercase tracking-wide', theme.textPrimary]">Payment</h3>
        </div>
        <div v-if="hasPaymentDetails" class="space-y-3">
          <DetailField
            v-if="event.amount_cents != null && !eventAmountShownInHero"
            label="Amount"
            :value="formatMoney(event.amount_cents, event.currency || 'USD')"
          />
          <DetailField v-if="event.currency" label="Currency" :value="event.currency" />
          <DetailField v-if="event.payment_provider" label="Provider" :value="formatProvider(event.payment_provider)" />
          <div v-if="event.payment_reference" class="space-y-1 min-w-0">
            <label :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">Reference</label>
            <div class="flex items-center gap-2 min-w-0">
              <code :class="['text-xs font-mono break-all min-w-0', theme.textPrimary]">{{ event.payment_reference }}</code>
              <button
                type="button"
                class="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Copy reference"
                @click="copyToClipboard(event.payment_reference)"
              >
                <Copy class="h-3.5 w-3.5" :class="theme.textTertiary" />
              </button>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center gap-2 py-2">
          <FileText class="h-4 w-4 shrink-0" :class="theme.textTertiary" />
          <p :class="['text-sm', theme.textTertiary]">No payment details for this event</p>
        </div>
      </div>

      <!-- Transaction details (ID, dates) -->
      <div
        :class="[
          'rounded-xl border p-4',
          theme.borderSecondary,
        ]"
      >
        <div class="flex items-center gap-2 mb-3">
          <History class="h-4 w-4 text-blue-500" />
          <h3 :class="['text-sm font-semibold uppercase tracking-wide', theme.textPrimary]">Transaction</h3>
        </div>
        <div class="space-y-3">
          <DetailField label="Date" :value="event.created_at" format="date" />
          <DetailField v-if="showLastUpdated" label="Last updated" :value="event.updated_at" format="date" />
          <div class="space-y-1 min-w-0">
            <label :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">ID</label>
            <div class="flex items-center gap-2 min-w-0">
              <code :class="['text-xs font-mono break-all min-w-0', theme.textPrimary]">{{ event.id }}</code>
              <button
                type="button"
                class="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Copy ID"
                @click="copyToClipboard(event.id)"
              >
                <Copy class="h-3.5 w-3.5" :class="theme.textTertiary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional details -->
      <div
        v-if="event.notes || formattedMetadata.length > 0"
        :class="[
          'rounded-xl border p-4 min-w-0',
          theme.borderSecondary,
        ]"
      >
        <div class="flex items-center gap-2 mb-3">
          <FileText class="h-4 w-4 text-slate-500" />
          <h3 :class="['text-sm font-semibold uppercase tracking-wide', theme.textPrimary]">Additional Details</h3>
        </div>
        <div class="space-y-3 min-w-0">
          <DetailField v-if="event.notes" label="Notes" :value="event.notes" />
          <template v-for="item in formattedMetadata">
            <div v-if="item.format === 'mono'" :key="`mono-${item.key}`" class="space-y-1 min-w-0 w-full overflow-hidden">
              <label :class="['text-xs font-medium uppercase tracking-wider block', theme.textTertiary]">{{ item.label }}</label>
              <code
                :class="['text-sm font-mono block w-full', theme.textPrimary]"
                style="word-break: break-all; overflow-wrap: anywhere;"
              >{{ item.value }}</code>
            </div>
            <DetailField v-else :key="`field-${item.key}`" :label="item.label" :value="item.value" />
          </template>
        </div>
      </div>
    </div>
  </SidebarModal>
</template>

<script setup>
import { computed } from 'vue'
import SidebarModal from '@/shared/components/molecules/SidebarModal.vue'
import DetailField from '@/shared/components/molecules/DetailField.vue'
import {
  History,
  CreditCard,
  ShoppingCart,
  FileText,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  XCircle,
  Copy,
} from '@/shared/utils/lucideAnimated'

const EVENT_ICONS = {
  created: ArrowUp,
  upgraded: ArrowUp,
  reactivated: ArrowUp,
  downgraded: ArrowDown,
  cancelled: ArrowDown,
  renewed: Check,
  payment_failed: XCircle,
}
import { formatMoney } from '@/shared/utils/formatMoney'
import { useFormatDate } from '@/shared/composables/useFormatDate'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { copyTextToClipboard } from '@/shared/utils/clipboard/copyTextToClipboard'
import toast from 'vue-sonner'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  event: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const theme = useThemeClasses()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const eventAmountShownInHero = computed(() => props.event?.amount_cents != null)

const eventIcon = computed(() => EVENT_ICONS[props.event?.event_type] || History)

const eventIconBgClass = computed(() => {
  const t = props.event?.event_type
  if (['created', 'upgraded', 'reactivated'].includes(t)) return 'bg-emerald-100 dark:bg-emerald-900/40'
  if (['downgraded', 'cancelled'].includes(t)) return 'bg-red-100 dark:bg-red-900/40'
  if (t === 'renewed') return 'bg-blue-100 dark:bg-blue-900/40'
  if (t === 'payment_failed') return 'bg-amber-100 dark:bg-amber-900/40'
  return 'bg-slate-100 dark:bg-slate-800'
})

const eventIconColorClass = computed(() => {
  const t = props.event?.event_type
  if (['created', 'upgraded', 'reactivated'].includes(t)) return 'text-emerald-600 dark:text-emerald-400'
  if (['downgraded', 'cancelled'].includes(t)) return 'text-red-600 dark:text-red-400'
  if (t === 'renewed') return 'text-blue-600 dark:text-blue-400'
  if (t === 'payment_failed') return 'text-amber-600 dark:text-amber-400'
  return 'text-slate-600 dark:text-slate-400'
})

const eventBadgeClass = computed(() => {
  const t = props.event?.event_type
  if (['created', 'upgraded', 'reactivated'].includes(t)) return 'bg-emerald-500/5 dark:bg-emerald-500/10'
  if (['downgraded', 'cancelled'].includes(t)) return 'bg-red-500/5 dark:bg-red-500/10'
  if (t === 'renewed') return 'bg-blue-500/5 dark:bg-blue-500/10'
  if (t === 'payment_failed') return 'bg-amber-500/5 dark:bg-amber-500/10'
  return ''
})

const amountColorClass = computed(() => {
  const t = props.event?.event_type
  if (['downgraded', 'cancelled', 'payment_failed'].includes(t)) return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
})

const showLastUpdated = computed(() => {
  const created = props.event?.created_at
  const updated = props.event?.updated_at
  if (!created || !updated) return false
  return new Date(updated).getTime() - new Date(created).getTime() > 60000
})

const hasSubscriptionDetails = computed(() =>
  !!(props.event?.from_tier || props.event?.to_tier || props.event?.billing_cycle)
)

const hasPaymentDetails = computed(() =>
  !!(props.event?.amount_cents != null || props.event?.currency || props.event?.payment_provider || props.event?.payment_reference)
)

const BYO_FEATURE_LABELS = {
  selection: 'Selection',
  collection: 'Collection',
  project: 'Project',
  raw_files: 'Raw files',
  proofing: 'Proofing',
  remove_branding: 'Remove branding',
  custom_domain: 'Custom domain',
  advanced_analytics: 'Advanced analytics',
  team: 'Team',
  white_label: 'White label',
  api: 'API',
}

const BYO_CAPABILITY_LABELS = {
  branding_editable: 'Editable branding',
  collection_display_enabled: 'Collection display',
  homepage_enabled: 'Custom homepage',
  legal_documents_enabled: 'Legal documents',
  photo_quality_enabled: 'Photo quality settings',
  social_links_enabled: 'Social links',
  support_24_7: '24/7 support',
}

const BASE_BYO_FEATURES = ['selection', 'collection', 'project', 'raw_files', 'proofing']

const byoPlanFeatures = computed(() => {
  const features = props.event?.memora_features
  const list = Array.isArray(features) && features.length > 0 ? features : (props.event?.to_tier === 'byo' ? BASE_BYO_FEATURES : [])
  return list.map((slug) => ({
    slug,
    label: BYO_FEATURE_LABELS[slug] || slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }))
})

const byoCapabilitiesList = computed(() => {
  const caps = props.event?.memora_capabilities
  if (!caps || typeof caps !== 'object') return []
  return Object.entries(caps)
    .filter(([, enabled]) => enabled)
    .map(([slug]) => ({
      slug,
      label: BYO_CAPABILITY_LABELS[slug] || slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }))
})

const byoAddonsList = computed(() => {
  const list = props.event?.byo_addons_list
  return Array.isArray(list) ? list : []
})

const METADATA_LABELS = {
  checkout_session_id: 'Checkout session',
  subscription_id: 'Subscription ID',
  byo_addons: 'BYO add-ons',
  test_mode: 'Test mode',
  tx_ref: 'Transaction reference',
  reference: 'Reference',
}

const formattedMetadata = computed(() => {
  const m = props.event?.metadata
  if (!m || typeof m !== 'object') return []
  return Object.entries(m).map(([k, v]) => {
    const label = METADATA_LABELS[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const val = typeof v === 'object' ? JSON.stringify(v) : String(v)
    const format = ['checkout_session_id', 'subscription_id', 'tx_ref', 'reference'].includes(k) ? 'mono' : 'text'
    return { key: k, label, value: val, format }
  })
})

async function copyToClipboard(text) {
  try {
    await copyTextToClipboard(text)
    toast.success('Copied to clipboard')
  } catch {
    toast.error('Failed to copy')
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
  return labels[type] || type || '—'
}

function getTierBadgeClass(tier) {
  if (tier === 'pro') return 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30'
  if (tier === 'byo') return 'bg-purple-500/20 text-purple-800 dark:text-purple-200 border border-purple-500/30'
  if (tier === 'studio') return 'bg-blue-500/20 text-blue-800 dark:text-blue-200 border border-blue-500/30'
  if (tier === 'business') return 'bg-green-500/20 text-green-800 dark:text-green-200 border border-green-500/30'
  if (tier === 'starter') return 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/30'
  return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30'
}

function formatTierName(tier) {
  if (!tier) return '—'
  if (tier === 'byo') return 'Build Your Own'
  return tier.charAt(0).toUpperCase() + tier.slice(1)
}

function formatBillingCycle(cycle) {
  if (!cycle) return '—'
  return cycle === 'annual' ? 'Annual' : cycle.charAt(0).toUpperCase() + cycle.slice(1)
}

function formatProvider(provider) {
  if (!provider) return '—'
  return provider.charAt(0).toUpperCase() + provider.slice(1)
}

const { formatDateTime } = useFormatDate()
function formatDate(dateStr) {
  return formatDateTime(dateStr)
}
</script>
