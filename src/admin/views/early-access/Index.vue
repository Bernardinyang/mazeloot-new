<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <header>
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Early Access</h1>
        <p :class="['mt-1 text-sm', theme.textSecondary]">Manage pending requests and active early access users.</p>
      </header>

      <nav
        class="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
        role="tablist"
        aria-label="Early access sections"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'requests'"
          :class="[
            'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            activeTab === 'requests'
              ? 'bg-background text-foreground shadow-sm'
              : 'hover:text-foreground',
          ]"
          @click="activeTab = 'requests'"
        >
          Pending Requests
          <span
            v-if="pendingCount > 0"
            class="ml-2 py-0.5 px-2 text-xs rounded-full bg-primary/15 text-primary font-medium tabular-nums"
          >
            {{ pendingCount }}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'users'"
          :class="[
            'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            activeTab === 'users'
              ? 'bg-background text-foreground shadow-sm'
              : 'hover:text-foreground',
          ]"
          @click="activeTab = 'users'"
        >
          Active Users
        </button>
      </nav>

      <!-- Pending Requests Tab -->
      <Transition name="fade-slide" mode="out-in">
        <section v-if="activeTab === 'requests'" key="requests" class="space-y-4" aria-label="Pending requests">
          <div v-if="loadingRequests" class="space-y-4">
            <div class="flex items-center gap-3 mb-4">
              <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
              <span :class="['text-sm', theme.textSecondary]">Loading requests…</span>
            </div>
            <div v-for="i in 3" :key="i" :class="['rounded-xl border border-border bg-card p-4 sm:p-6 animate-pulse']">
              <div class="flex justify-between gap-4">
                <div class="space-y-2 flex-1">
                  <div :class="['h-5 w-40 rounded', theme.bgSkeleton]" :style="{ animationDelay: `${i * 80}ms` }" />
                  <div :class="['h-4 w-56 rounded', theme.bgSkeleton]" :style="{ animationDelay: `${i * 80 + 30}ms` }" />
                  <div :class="['h-4 w-32 rounded', theme.bgSkeleton]" :style="{ animationDelay: `${i * 80 + 60}ms` }" />
                </div>
                <div class="flex gap-2 shrink-0">
                  <div :class="['h-8 w-20 rounded', theme.bgSkeleton]" />
                  <div :class="['h-8 w-16 rounded', theme.bgSkeleton]" />
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="requests.length === 0" :class="['text-center py-12 text-sm rounded-xl border border-border bg-card', theme.textSecondary]">
            No pending requests
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(req, index) in requests"
              :key="req.uuid"
              :class="[
                'rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm',
                'transition-all duration-200 hover:shadow-md hover:border-border',
                'animate-slide-up',
              ]"
              :style="{ animationDelay: `${Math.min(index * 50, 300)}ms`, animationFillMode: 'backwards' }"
            >
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 :class="['text-lg font-semibold', theme.textPrimary]">
                      {{ req.user.first_name }} {{ req.user.last_name }}
                    </h3>
                    <Badge variant="secondary" class="shrink-0">Pending</Badge>
                  </div>
                  <p :class="['text-sm mb-2', theme.textSecondary]">{{ req.user.email }}</p>
                  <p v-if="req.reason" :class="['text-sm mt-3', theme.textPrimary]">
                    <span class="font-medium">Reason:</span> {{ req.reason }}
                  </p>
                  <p :class="['text-xs mt-2', theme.textSecondary]">
                    Requested {{ formatDate(req.created_at) }}
                  </p>
                </div>
                <div class="flex flex-wrap gap-2 shrink-0">
                  <Button
                    variant="link"
                    size="sm"
                    @click="$router.push({ name: 'admin-early-access-request-show', params: { uuid: req.uuid } })"
                  >
                    View details
                  </Button>
                  <Button variant="default" size="sm" @click="openApproveDialog(req)">
                    Approve
                  </Button>
                  <Button @click="openRejectDialog(req)" variant="outline" size="sm">
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Transition>

      <!-- Active Users Tab -->
      <Transition name="fade-slide" mode="out-in">
        <section v-if="activeTab === 'users'" key="users" class="space-y-4" aria-label="Active users">
          <div v-if="loadingUsers" class="rounded-xl border border-border bg-card overflow-hidden p-4 sm:p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
              <span :class="['text-sm', theme.textSecondary]">Loading users…</span>
            </div>
            <div class="space-y-2">
              <div v-for="i in 5" :key="i" class="flex gap-4 p-4 rounded-lg border border-border">
                <div :class="['h-5 w-44 rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 40}ms` }" />
                <div :class="['h-5 w-12 rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 40 + 15}ms` }" />
                <div :class="['h-5 w-16 rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 40 + 30}ms` }" />
              </div>
            </div>
          </div>
          <div v-else class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <DataTable
              :columns="earlyAccessColumns"
              :items="earlyAccessUsers"
              :loading="loadingUsers"
              :getId="(ea) => ea.uuid"
              searchable
              search-placeholder="Search early access users…"
              empty-message="No active early access users."
            >
              <template #cell-user="{ item }">
                <div>
                  <div :class="['text-sm font-medium', theme.textPrimary]">{{ item.user.email }}</div>
                  <div :class="['text-sm', theme.textSecondary]">{{ item.user.first_name }} {{ item.user.last_name }}</div>
                </div>
              </template>
              <template #cell-actions="{ item }">
                <RouterLink :to="`/admin/early-access/${item.uuid}`">
                  <Button variant="link" size="sm">View</Button>
                </RouterLink>
              </template>
            </DataTable>
          </div>
        </section>
      </Transition>

    </div>

    <!-- Approve Dialog -->
    <Dialog :open="showApproveDialog" @update:open="showApproveDialog = $event">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Approve Early Access Request</DialogTitle>
          <DialogDescription>
            Select rewards for {{ selectedRequest?.user?.first_name }}
            {{ selectedRequest?.user?.last_name }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-6 py-4">
          <div>
            <Label>Reward Presets</Label>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="applyPreset('basic')"
              >
                Basic
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="applyPreset('premium')"
              >
                Premium
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="applyPreset('vip')"
              >
                VIP
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="applyPreset('custom')"
              >
                Custom
              </Button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="discount">Discount Percentage (0-100)</Label>
              <Input
                id="discount"
                v-model.number="rewards.discount_percentage"
                type="number"
                min="0"
                max="100"
                class="mt-2"
              />
            </div>
            <div>
              <Label for="storage">Storage Multiplier</Label>
              <Input
                id="storage"
                v-model.number="rewards.storage_multiplier"
                type="number"
                min="1"
                step="0.1"
                class="mt-2"
              />
            </div>
          </div>

          <div>
            <Label for="features">Feature Flags (comma-separated)</Label>
            <Input
              id="features"
              v-model="featureFlagsInput"
              placeholder="feature1, feature2, feature3"
              class="mt-2"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center space-x-2">
              <input
                id="priority"
                v-model="rewards.priority_support"
                type="checkbox"
                class="rounded"
              />
              <Label for="priority">Priority Support</Label>
            </div>
            <div class="flex items-center space-x-2">
              <input
                id="badge"
                v-model="rewards.exclusive_badge"
                type="checkbox"
                class="rounded"
              />
              <Label for="badge">Exclusive Badge</Label>
            </div>
            <div class="flex items-center space-x-2">
              <input
                id="branding"
                v-model="rewards.custom_branding_enabled"
                type="checkbox"
                class="rounded"
              />
              <Label for="branding">Custom Branding</Label>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="trial">Trial Extension (days)</Label>
              <Input
                id="trial"
                v-model.number="rewards.trial_extension_days"
                type="number"
                min="0"
                class="mt-2"
              />
            </div>
            <div>
              <Label for="version">Release Version</Label>
              <Input id="version" v-model="rewards.release_version" class="mt-2" />
            </div>
          </div>

          <div>
            <Label for="expires">Expires At (optional)</Label>
            <Input id="expires" v-model="rewards.expires_at" type="date" class="mt-2" />
          </div>

          <div>
            <Label for="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              v-model="rewards.notes"
              class="mt-2 w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showApproveDialog = false">Cancel</Button>
          <Button @click="handleApprove" :disabled="isProcessing">
            Approve & Grant Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Reject Dialog -->
    <Dialog :open="showRejectDialog" @update:open="showRejectDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Early Access Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject the request from
            {{ selectedRequest?.user?.first_name }} {{ selectedRequest?.user?.last_name }}?
          </DialogDescription>
        </DialogHeader>

        <div class="py-4">
          <Label for="rejection_reason">Rejection Reason (optional)</Label>
          <Textarea
            id="rejection_reason"
            v-model="rejectionReason"
            class="mt-2 w-full"
            placeholder="Optional reason for rejection..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showRejectDialog = false">Cancel</Button>
          <Button variant="destructive" @click="handleReject" :disabled="isProcessing">
            Reject Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import Label from '@/shared/components/shadcn/Label.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { toast } from '@/shared/utils/toast'
import { usePusher } from '@/shared/composables/usePusher'
import DataTable from '@/shared/components/organisms/DataTable.vue'

const theme = useThemeClasses()

const earlyAccessColumns = [
  { key: 'user', label: 'User', slot: 'user', sortable: true, dataSelector: (ea) => ea.user?.email ?? '' },
  { key: 'discount_percentage', label: 'Discount', dataSelector: (ea) => `${ea.discount_percentage}%`, sortable: true, numeric: true },
  { key: 'features', label: 'Features', dataSelector: (ea) => (ea.feature_flags || []).length, sortable: true, numeric: true },
  { key: 'actions', label: 'Actions', slot: 'actions' },
]
const adminApi = useAdminApi()
const { subscribePrivate, unsubscribe } = usePusher()
const activeTab = ref('requests')
const requests = ref([])
const earlyAccessUsers = ref([])
const loadingRequests = ref(true)
const loadingUsers = ref(true)
const showApproveDialog = ref(false)
const showRejectDialog = ref(false)
const selectedRequest = ref(null)
const isProcessing = ref(false)
const rejectionReason = ref('')
const featureFlagsInput = ref('')
let pusherChannel = null

const rewards = ref({
  discount_percentage: 0,
  storage_multiplier: 1.0,
  feature_flags: [],
  priority_support: false,
  exclusive_badge: true,
  custom_branding_enabled: false,
  trial_extension_days: 0,
  release_version: null,
  expires_at: null,
  notes: null,
})

const pendingCount = computed(() => requests.value.length)

const loadRequests = async () => {
  loadingRequests.value = true
  try {
    const response = await adminApi.getEarlyAccessRequests({ status: 'pending' })
    requests.value = response.data || []
  } catch (error) {
    toast.error('Failed to load requests')
  } finally {
    loadingRequests.value = false
  }
}

const loadUsers = async () => {
  loadingUsers.value = true
  try {
    const response = await adminApi.getEarlyAccessUsers()
    earlyAccessUsers.value = response.data || []
  } catch (error) {
    toast.error('Failed to load users')
  } finally {
    loadingUsers.value = false
  }
}

const rewardPresets = {
  basic: {
    discount_percentage: 10,
    storage_multiplier: 1.5,
    feature_flags: ['ai_enhancement'],
    priority_support: false,
    exclusive_badge: true,
    custom_branding_enabled: false,
    trial_extension_days: 7,
    release_version: null,
    expires_at: null,
    notes: 'Basic early access package',
  },
  premium: {
    discount_percentage: 25,
    storage_multiplier: 2.0,
    feature_flags: ['ai_enhancement', 'advanced_export', 'custom_reports'],
    priority_support: true,
    exclusive_badge: true,
    custom_branding_enabled: false,
    trial_extension_days: 14,
    release_version: null,
    expires_at: null,
    notes: 'Premium early access package',
  },
  vip: {
    discount_percentage: 50,
    storage_multiplier: 3.0,
    feature_flags: ['ai_enhancement', 'advanced_export', 'custom_reports', 'beta_integrations', 'dark_mode_beta'],
    priority_support: true,
    exclusive_badge: true,
    custom_branding_enabled: true,
    trial_extension_days: 30,
    release_version: 'beta',
    expires_at: null,
    notes: 'VIP early access package',
  },
  custom: {
    discount_percentage: 0,
    storage_multiplier: 1.0,
    feature_flags: [],
    priority_support: false,
    exclusive_badge: true,
    custom_branding_enabled: false,
    trial_extension_days: 0,
    release_version: null,
    expires_at: null,
    notes: null,
  },
}

const applyPreset = (presetName) => {
  const preset = rewardPresets[presetName]
  if (!preset) return

  rewards.value = { ...preset }
  featureFlagsInput.value = preset.feature_flags.join(', ')
}

const openApproveDialog = (req) => {
  selectedRequest.value = req
  applyPreset('basic')
  showApproveDialog.value = true
}

const openRejectDialog = (req) => {
  selectedRequest.value = req
  rejectionReason.value = ''
  showRejectDialog.value = true
}

const handleApprove = async () => {
  if (!selectedRequest.value) return

  isProcessing.value = true
  try {
    const rewardData = {
      ...rewards.value,
      feature_flags: featureFlagsInput.value
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
    }

    await adminApi.approveEarlyAccessRequest(selectedRequest.value.uuid, rewardData)
    toast.success('Request approved successfully')
    showApproveDialog.value = false
    await loadRequests()
    await loadUsers()
  } catch (error) {
    toast.apiError(error, 'Failed to approve request')
  } finally {
    isProcessing.value = false
  }
}

const handleReject = async () => {
  if (!selectedRequest.value) return

  isProcessing.value = true
  try {
    await adminApi.rejectEarlyAccessRequest(
      selectedRequest.value.uuid,
      rejectionReason.value || null
    )
    toast.success('Request rejected')
    showRejectDialog.value = false
    await loadRequests()
  } catch (error) {
    toast.apiError(error, 'Failed to reject request')
  } finally {
    isProcessing.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const setupRealtimeUpdates = async () => {
  try {
    pusherChannel = await subscribePrivate('private-admin.early-access', 'early-access-request.created', (data) => {
      if (data.request && data.request.status === 'pending') {
        requests.value.unshift(data.request)
        toast.success(`New early access request from ${data.request.user.first_name} ${data.request.user.last_name}`)
      }
    })

    if (pusherChannel) {
      pusherChannel.bind('early-access-request.approved', (data) => {
        const index = requests.value.findIndex((r) => r.uuid === data.request.uuid)
        if (index !== -1) {
          requests.value.splice(index, 1)
        }
        loadUsers()
        toast.success(`Request from ${data.request.user.email} approved`)
      })

      pusherChannel.bind('early-access-request.rejected', (data) => {
        const index = requests.value.findIndex((r) => r.uuid === data.request.uuid)
        if (index !== -1) {
          requests.value.splice(index, 1)
        }
        toast.info(`Request from ${data.request.user.email} rejected`)
      })
    }
  } catch (error) {
    console.warn('Failed to setup real-time updates:', error)
  }
}

onMounted(async () => {
  await Promise.all([loadRequests(), loadUsers()])
  await setupRealtimeUpdates()
})

onUnmounted(() => {
  if (pusherChannel) {
    unsubscribe('private-admin.early-access')
    pusherChannel = null
  }
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
