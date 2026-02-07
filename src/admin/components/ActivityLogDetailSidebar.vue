<template>
  <SidebarModal
    :model-value="!!log"
    :title="log ? (log.user?.name || log.user?.email || 'System') : ''"
    :description="log ? timeSummary(log.created_at) : ''"
    content-class="sm:!max-w-lg"
    body-class="min-w-0 overflow-x-hidden"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="log" class="space-y-6 min-w-0">
      <!-- Summary -->
      <section class="space-y-3" aria-labelledby="log-summary-heading">
        <h2 id="log-summary-heading" :class="['text-xs font-semibold uppercase tracking-wider', theme.textTertiary]">
          Summary
        </h2>
        <div :class="['rounded-xl border p-4 space-y-3', theme.borderSecondary]">
          <DetailField label="Action">
            <Badge :variant="actionBadgeVariant(log.action)">{{ log.action }}</Badge>
          </DetailField>
          <div>
            <label :class="['text-xs font-medium uppercase tracking-wider block mb-1.5', theme.textTertiary]">Description</label>
            <p :class="['text-sm leading-relaxed', theme.textPrimary]">{{ log.description || '—' }}</p>
          </div>
          <p :class="['text-xs', theme.textTertiary]">
            {{ formatDateFull(log.created_at) }}
          </p>
        </div>
      </section>

      <!-- Request -->
      <section v-if="log.route || log.ip_address" class="space-y-3" aria-labelledby="log-request-heading">
        <h2 id="log-request-heading" :class="['text-xs font-semibold uppercase tracking-wider', theme.textTertiary]">
          Request
        </h2>
        <div :class="['rounded-xl border p-4 space-y-3', theme.borderSecondary]">
          <DetailField v-if="log.route" label="Route">
            <span class="inline-flex items-center gap-2 flex-wrap">
              <Badge :class="methodBadgeClass(log.method)" class="font-mono text-xs shrink-0">{{ log.method }}</Badge>
              <span class="font-mono text-sm break-all">{{ log.route }}</span>
            </span>
          </DetailField>
          <DetailField v-if="log.ip_address" label="IP address" :value="log.ip_address" format="mono" />
        </div>
      </section>

      <!-- User & device -->
      <section class="space-y-3" aria-labelledby="log-user-heading">
        <h2 id="log-user-heading" :class="['text-xs font-semibold uppercase tracking-wider', theme.textTertiary]">
          User & device
        </h2>
        <div :class="['rounded-xl border p-4 space-y-3', theme.borderSecondary]">
          <DetailField label="User" :value="log.user ? (log.user.name || log.user.email) : 'System'" />
          <DetailField v-if="log.user?.role" label="Role">
            <Badge :variant="log.user.role === 'super_admin' ? 'default' : 'secondary'">
              {{ log.user.role === 'super_admin' ? 'Super Admin' : 'Admin' }}
            </Badge>
          </DetailField>
          <DetailField v-if="log.user?.email" label="Email" :value="log.user.email" />
          <div v-if="log.user_agent">
            <label :class="['text-xs font-medium uppercase tracking-wider block mb-1.5', theme.textTertiary]">User agent</label>
            <p :class="['text-xs break-all max-h-24 overflow-y-auto py-1 pr-1', theme.textSecondary]" style="scrollbar-width: thin;">{{ log.user_agent }}</p>
          </div>
        </div>
      </section>

      <!-- Properties -->
      <section
        v-if="log.properties && Object.keys(log.properties).length"
        class="space-y-3"
        aria-labelledby="log-props-heading"
      >
        <h2 id="log-props-heading" :class="['text-xs font-semibold uppercase tracking-wider', theme.textTertiary]">
          Properties
        </h2>
        <div :class="['rounded-xl border p-4', theme.borderSecondary]">
          <dl v-if="isFlatObject(log.properties)" class="space-y-2">
            <div
              v-for="(val, key) in log.properties"
              :key="key"
              class="flex gap-2 text-sm"
            >
              <dt :class="['shrink-0 font-medium min-w-0 truncate', theme.textTertiary]">{{ key }}:</dt>
              <dd :class="['break-all', theme.textPrimary]">{{ formatPropValue(val) }}</dd>
            </div>
          </dl>
          <pre v-else :class="['text-xs p-3 rounded-lg overflow-x-auto max-h-48 overflow-y-auto', theme.bgInput, theme.textSecondary]" style="scrollbar-width: thin;">{{ JSON.stringify(log.properties, null, 2) }}</pre>
        </div>
      </section>
    </div>
  </SidebarModal>
</template>

<script setup>
import SidebarModal from '@/shared/components/molecules/SidebarModal.vue'
import DetailField from '@/shared/components/molecules/DetailField.vue'
import { Badge } from '@/shared/components/shadcn/badge'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

defineProps({
  log: { type: Object, default: null },
})
defineEmits(['update:modelValue'])

const theme = useThemeClasses()

const formatDateFull = (dateString) => {
  const d = new Date(dateString)
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })
}

const timeSummary = (dateString) => {
  const d = new Date(dateString)
  const now = new Date()
  const diffMs = now - d
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffM < 1) return 'Just now'
  if (diffM < 60) return `${diffM} min ago`
  if (diffH < 24) return `${diffH} h ago`
  if (diffD < 7) return `${diffD} days ago`
  return formatDateFull(dateString)
}

const methodBadgeClass = (method) => {
  const m = (method || '').toUpperCase()
  if (m === 'GET') return 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
  if (m === 'POST') return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
  if (m === 'PUT' || m === 'PATCH') return 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
  if (m === 'DELETE') return 'bg-red-500/20 text-red-700 dark:text-red-300'
  return ''
}

const actionBadgeVariant = (action) => {
  if (['created', 'logged_in'].includes(action)) return 'default'
  if (['deleted'].includes(action)) return 'destructive'
  return 'outline'
}

const isFlatObject = (obj) => {
  if (!obj || typeof obj !== 'object') return false
  return !Object.values(obj).some(v => typeof v === 'object' && v !== null)
}

const formatPropValue = (v) => {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
</script>
