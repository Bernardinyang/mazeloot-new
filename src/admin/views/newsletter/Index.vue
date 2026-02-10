<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <header>
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Newsletter</h1>
        <p :class="['mt-1 text-sm', theme.textSecondary]">People subscribed to the newsletter.</p>
      </header>

      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="search"
            type="search"
            placeholder="Search by email…"
            :class="['w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', theme.textPrimary]"
            aria-label="Search newsletter"
          />
        </div>
        <select
          v-model="statusFilter"
          :class="['rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', theme.textPrimary]"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div v-if="loading" class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          <span :class="['text-sm', theme.textSecondary]">Loading…</span>
        </div>
        <div v-for="i in 5" :key="i" :class="['rounded-xl border border-border bg-card p-4 sm:p-6 animate-pulse']">
          <div :class="['h-5 w-48 rounded', theme.bgSkeleton]" />
          <div :class="['h-4 w-64 rounded mt-2', theme.bgSkeleton]" />
        </div>
      </div>

      <div v-else-if="newsletter.length === 0" :class="['text-center py-12 text-sm rounded-xl border border-border bg-card', theme.textSecondary]">
        No newsletter subscriptions found
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="n in newsletter"
          :key="n.uuid"
          :class="['rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-all']"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 :class="['text-lg font-semibold', theme.textPrimary]">
                  {{ n.email }}
                </h3>
                <Badge :variant="n.is_active ? 'default' : 'secondary'">
                  {{ n.is_active ? 'Active' : 'Inactive' }}
                </Badge>
              </div>
              <p :class="['text-xs mt-2', theme.textSecondary]">
                Subscribed: {{ formatDate(n.created_at) }}
                <span v-if="n.unsubscribed_at"> · Unsubscribed: {{ formatDate(n.unsubscribed_at) }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between">
        <p :class="['text-sm', theme.textSecondary]">
          Page {{ meta.current_page }} of {{ meta.last_page }} ({{ meta.total }} total)
        </p>
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="meta.current_page <= 1"
            @click="goToPage(meta.current_page - 1)"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="meta.current_page >= meta.last_page"
            @click="goToPage(meta.current_page + 1)"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const adminApi = useAdminApi()

const newsletter = ref([])
const loading = ref(true)
const search = ref('')
const statusFilter = ref('')
const meta = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const load = async (opts = {}) => {
  loading.value = true
  try {
    const params = { per_page: 20, ...opts }
    if (search.value.trim()) params.search = search.value.trim()
    if (statusFilter.value) params.status = statusFilter.value
    const res = await adminApi.getNewsletter(params)
    const list = res?.data?.data ?? res?.data
    newsletter.value = Array.isArray(list) ? list : []
    meta.value = res?.data?.meta ?? res?.meta ?? null
  } catch (e) {
    toast.error('Failed to load newsletter subscriptions')
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (!meta.value || page < 1 || page > meta.value.last_page) return
  load({ page })
}

watch([search, statusFilter], () => load(), { immediate: true })
</script>
