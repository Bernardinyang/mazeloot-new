<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Early Access Request Details</h1>
        <p class="text-sm text-gray-500 mt-1">View and manage early access request</p>
      </div>
      <Button variant="outline" @click="$router.push({ name: 'admin-early-access' })">
        Back to Requests
      </Button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <p class="mt-4 text-gray-500">Loading request details...</p>
    </div>

    <div v-else-if="request" class="space-y-6">
      <!-- Request Status Card -->
      <Card class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Request Information</h2>
          <Badge
            :variant="statusVariant"
            class="text-sm font-medium px-3 py-1"
          >
            {{ statusLabel }}
          </Badge>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="text-xs text-gray-500 uppercase">Requested At</Label>
            <p class="text-sm font-medium mt-1">{{ formatDate(request.created_at) }}</p>
          </div>
          <div v-if="request.reviewed_at">
            <Label class="text-xs text-gray-500 uppercase">Reviewed At</Label>
            <p class="text-sm font-medium mt-1">{{ formatDate(request.reviewed_at) }}</p>
          </div>
          <div v-if="request.reviewed_by">
            <Label class="text-xs text-gray-500 uppercase">Reviewed By</Label>
            <p class="text-sm font-medium mt-1">
              {{ request.reviewed_by.first_name }} {{ request.reviewed_by.last_name }}
            </p>
            <p class="text-xs text-gray-500">{{ request.reviewed_by.email }}</p>
          </div>
        </div>
      </Card>

      <!-- User Information Card -->
      <Card class="p-6">
        <h2 class="text-xl font-semibold mb-4">User Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="text-xs text-gray-500 uppercase">Name</Label>
            <p class="text-sm font-medium mt-1">
              {{ request.user.first_name }} {{ request.user.last_name }}
            </p>
          </div>
          <div>
            <Label class="text-xs text-gray-500 uppercase">Email</Label>
            <p class="text-sm font-medium mt-1">{{ request.user.email }}</p>
          </div>
          <div>
            <Label class="text-xs text-gray-500 uppercase">User UUID</Label>
            <p class="text-xs font-mono text-gray-600 mt-1">{{ request.user.uuid }}</p>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              @click="$router.push({ name: 'admin-user-show', params: { uuid: request.user.uuid } })"
            >
              View User Profile
            </Button>
          </div>
        </div>
      </Card>

      <!-- Request Reason Card -->
      <Card v-if="request.reason" class="p-6">
        <h2 class="text-xl font-semibold mb-4">Request Reason</h2>
        <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ request.reason }}</p>
      </Card>

      <!-- Rejection Reason Card -->
      <Card v-if="request.rejection_reason" class="p-6 border-red-200 dark:border-red-800">
        <h2 class="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Rejection Reason</h2>
        <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ request.rejection_reason }}</p>
      </Card>

      <!-- Actions -->
      <div v-if="request.status === 'pending'" class="flex gap-3">
        <Button @click="openApproveDialog" class="flex-1">
          Approve Request
        </Button>
        <Button @click="openRejectDialog" variant="outline" class="flex-1">
          Reject Request
        </Button>
      </div>

      <!-- Early Access Details (if approved) -->
      <Card v-if="request.status === 'approved' && earlyAccess" class="p-6">
        <h2 class="text-xl font-semibold mb-4">Granted Early Access</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="text-xs text-gray-500 uppercase">Discount</Label>
            <p class="text-sm font-medium mt-1">{{ earlyAccess.discount_percentage }}%</p>
          </div>
          <div>
            <Label class="text-xs text-gray-500 uppercase">Storage Multiplier</Label>
            <p class="text-sm font-medium mt-1">{{ earlyAccess.storage_multiplier }}x</p>
          </div>
          <div>
            <Label class="text-xs text-gray-500 uppercase">Feature Flags</Label>
            <div class="flex flex-wrap gap-2 mt-1">
              <Badge
                v-for="flag in (earlyAccess.feature_flags || [])"
                :key="flag"
                variant="secondary"
                class="text-xs"
              >
                {{ flag }}
              </Badge>
              <span v-if="!earlyAccess.feature_flags || earlyAccess.feature_flags.length === 0" class="text-sm text-gray-500">None</span>
            </div>
          </div>
          <div>
            <Label class="text-xs text-gray-500 uppercase">Benefits</Label>
            <div class="space-y-1 mt-1">
              <p v-if="earlyAccess.priority_support" class="text-xs text-green-600">✓ Priority Support</p>
              <p v-if="earlyAccess.exclusive_badge" class="text-xs text-green-600">✓ Exclusive Badge</p>
              <p v-if="earlyAccess.custom_branding_enabled" class="text-xs text-green-600">✓ Custom Branding</p>
              <p v-if="earlyAccess.trial_extension_days > 0" class="text-xs text-green-600">
                ✓ +{{ earlyAccess.trial_extension_days }} Trial Days
              </p>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <Button
            variant="outline"
            size="sm"
            @click="$router.push({ name: 'admin-early-access-show', params: { uuid: earlyAccess.uuid } })"
          >
            View Early Access Details
          </Button>
        </div>
      </Card>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Request not found</p>
      <Button variant="outline" class="mt-4" @click="$router.push({ name: 'admin-early-access' })">
        Back to Requests
      </Button>
    </div>

    <!-- Approve Dialog -->
    <Dialog v-model:open="showApproveDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Approve Early Access Request</DialogTitle>
          <DialogDescription>
            Select rewards for {{ request?.user?.first_name }} {{ request?.user?.last_name }}
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
            {{ request?.user?.first_name }} {{ request?.user?.last_name }}?
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import Label from '@/shared/components/shadcn/Label.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import Badge from '@/shared/components/shadcn/badge/Badge.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { toast } from '@/shared/utils/toast'

const route = useRoute()
const router = useRouter()
const adminApi = useAdminApi()
const request = ref(null)
const earlyAccess = ref(null)
const loading = ref(true)
const showApproveDialog = ref(false)
const showRejectDialog = ref(false)
const isProcessing = ref(false)
const rejectionReason = ref('')
const featureFlagsInput = ref('')

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

const statusLabel = computed(() => {
  if (!request.value) return ''
  const status = request.value.status
  if (status === 'pending') return 'Pending'
  if (status === 'approved') return 'Approved'
  if (status === 'rejected') return 'Rejected'
  return status
})

const statusVariant = computed(() => {
  if (!request.value) return 'default'
  const status = request.value.status
  if (status === 'pending') return 'secondary'
  if (status === 'approved') return 'default'
  if (status === 'rejected') return 'destructive'
  return 'default'
})

const loadRequest = async () => {
  loading.value = true
  try {
    request.value = await adminApi.getEarlyAccessRequest(route.params.uuid)
    
    // If approved, load early access details
    if (request.value.status === 'approved') {
      try {
        const earlyAccessList = await adminApi.getEarlyAccessUsers({ search: request.value.user.email })
        if (earlyAccessList.data && earlyAccessList.data.length > 0) {
          earlyAccess.value = earlyAccessList.data[0]
        }
      } catch (err) {
        console.error('Failed to load early access details:', err)
      }
    }
  } catch (error) {
    toast.error('Failed to load request details')
  } finally {
    loading.value = false
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

const openApproveDialog = () => {
  applyPreset('basic')
  showApproveDialog.value = true
}

const openRejectDialog = () => {
  rejectionReason.value = ''
  showRejectDialog.value = true
}

const handleApprove = async () => {
  if (!request.value) return

  isProcessing.value = true
  try {
    const rewardData = {
      ...rewards.value,
      feature_flags: featureFlagsInput.value
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
    }

    await adminApi.approveEarlyAccessRequest(request.value.uuid, rewardData)
    toast.success('Request approved successfully')
    showApproveDialog.value = false
    await loadRequest()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to approve request')
  } finally {
    isProcessing.value = false
  }
}

const handleReject = async () => {
  if (!request.value) return

  isProcessing.value = true
  try {
    await adminApi.rejectEarlyAccessRequest(request.value.uuid, rejectionReason.value || null)
    toast.success('Request rejected')
    showRejectDialog.value = false
    await loadRequest()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to reject request')
  } finally {
    isProcessing.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

onMounted(async () => {
  await loadRequest()
})
</script>
