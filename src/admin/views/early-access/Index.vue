<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Early Access Management</h1>
    </div>

    <div class="border-b">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'requests'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'requests'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          Pending Requests
          <span
            v-if="pendingCount > 0"
            class="ml-2 py-0.5 px-2 text-xs rounded-full bg-purple-100 text-purple-600"
          >
            {{ pendingCount }}
          </span>
        </button>
        <button
          @click="activeTab = 'users'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'users'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          Active Users
        </button>
      </nav>
    </div>

    <!-- Pending Requests Tab -->
    <div v-if="activeTab === 'requests'">
      <div v-if="loadingRequests" class="text-center py-8">Loading...</div>
      <div v-else-if="requests.length === 0" class="text-center py-12 text-gray-500">
        No pending requests
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="req in requests"
          :key="req.uuid"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold">
                  {{ req.user.first_name }} {{ req.user.last_name }}
                </h3>
                <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ req.user.email }}</p>
              <p v-if="req.reason" class="text-sm text-gray-700 dark:text-gray-300 mt-3">
                <span class="font-medium">Reason:</span> {{ req.reason }}
              </p>
              <p class="text-xs text-gray-500 mt-2">
                Requested {{ formatDate(req.created_at) }}
              </p>
            </div>
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="$router.push({ name: 'admin-early-access-request-show', params: { uuid: req.uuid } })"
              >
                View Details
              </Button>
              <Button @click="openApproveDialog(req)" variant="default" size="sm">
                Approve
              </Button>
              <Button @click="openRejectDialog(req)" variant="outline" size="sm">
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Users Tab -->
    <div v-if="activeTab === 'users'">
      <div v-if="loadingUsers" class="text-center py-8">Loading...</div>
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Features</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="ea in earlyAccessUsers" :key="ea.uuid">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium">{{ ea.user.email }}</div>
                  <div class="text-sm text-gray-500">{{ ea.user.first_name }} {{ ea.user.last_name }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ ea.discount_percentage }}%</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ (ea.feature_flags || []).length }} features
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <router-link
                  :to="`/admin/early-access/${ea.uuid}`"
                  class="text-purple-600 hover:underline"
                >
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Approve Dialog -->
    <Dialog v-model:open="showApproveDialog">
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
    <Dialog v-model:open="showRejectDialog">
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
import { useAdminApi } from '@/admin/api/admin'
import { Button } from '@/shared/components/shadcn/button'
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
