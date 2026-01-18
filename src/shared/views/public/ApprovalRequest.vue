<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Login Form (shown when creative is not authenticated and password not verified) -->
    <div
      v-if="!canViewContent && !isLoading"
      class="flex items-center justify-center min-h-screen px-4"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8"
      >
        <div class="mb-6 text-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sign In Required</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Please sign in to view this approval request
          </p>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-900 dark:text-gray-100">Email</label>
            <Input
              v-model="loginEmail"
              type="email"
              placeholder="name@example.com"
              autocomplete="email"
              class="w-full"
            />
          </div>
          <div v-if="hasProofingPassword" class="space-y-2">
            <label class="text-sm font-medium text-gray-900 dark:text-gray-100">Password</label>
            <PasswordInput
              v-model="loginPassword"
              placeholder="Enter proofing password"
              autocomplete="current-password"
              class="w-full"
              @keydown.enter="handleLogin"
            />
          </div>
          <p v-if="loginError" class="text-sm text-red-600 dark:text-red-400">
            {{ loginError }}
          </p>
          <Button
            :disabled="isLoggingIn || !loginEmail || (hasProofingPassword && !loginPassword)"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white"
            @click="handleLogin"
          >
            <Loader2 v-if="isLoggingIn" class="w-4 h-4 mr-2 animate-spin" />
            {{
              isLoggingIn
                ? hasProofingPassword
                  ? 'Verifying...'
                  : 'Signing in...'
                : hasProofingPassword
                  ? 'Verify Password'
                  : 'Sign In'
            }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Approval Request Content (shown when authenticated or password verified) -->
    <template v-else>
      <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
        <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
      </div>

      <div v-else-if="error" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <p class="text-red-600 dark:text-red-400 text-lg">{{ error }}</p>
        </div>
      </div>

      <div v-else-if="approvalRequest" class="max-w-6xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <Button
              v-if="proofingUrl"
              variant="ghost"
              class="flex items-center gap-2"
              @click="handleGoToProofing"
            >
              <ArrowLeft class="h-4 w-4" />
              Back to Proofing
            </Button>
            <Button variant="ghost" class="flex items-center gap-2" @click="handleGoBack">
              <ArrowLeft class="h-4 w-4" />
              Go Back
            </Button>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Approval Request</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Review the request for additional revisions
          </p>
        </div>

        <!-- Status Banner -->
        <div
          v-if="approvalRequest.status !== 'pending'"
          class="mb-6 p-4 rounded-lg"
          :class="
            approvalRequest.status === 'approved'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          "
        >
          <p
            class="font-semibold"
            :class="
              approvalRequest.status === 'approved'
                ? 'text-green-800 dark:text-green-300'
                : 'text-red-800 dark:text-red-300'
            "
          >
            This approval request has been
            {{ approvalRequest.status === 'approved' ? 'approved' : 'rejected' }}.
          </p>
          <p
            v-if="approvalRequest.status === 'rejected' && approvalRequest.rejection_reason"
            class="mt-2 text-sm"
            :class="approvalRequest.status === 'rejected' ? 'text-red-700 dark:text-red-300' : ''"
          >
            <strong>Reason:</strong> {{ approvalRequest.rejection_reason }}
          </p>
          <div v-if="approvalRequest.status === 'rejected' && isCreative" class="mt-4">
            <Button
              class="bg-red-600 hover:bg-red-700 text-white"
              @click="handleCreateSupportTicket"
            >
              <MessageSquare class="w-4 h-4 mr-2" />
              Create Support Ticket
            </Button>
          </div>
          <p
            v-if="approvalRequest.status === 'approved' && isCreative"
            class="mt-2 text-sm text-green-700 dark:text-green-300"
          >
            You can now proceed with additional revisions as needed.
          </p>
        </div>

        <!-- Revision Limit Info -->
        <div
          class="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <p class="font-semibold text-blue-800 dark:text-blue-300 mb-1">Revision Limit Exceeded</p>
          <p class="text-sm text-blue-700 dark:text-blue-300">
            The maximum revision limit ({{ approvalRequest.proofing?.max_revisions || 5 }}
            revisions) has been reached. Approval is required to proceed with additional revisions.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Left: Request Details -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Request Details
              </h2>
            </div>
            <div class="p-5">
              <div v-if="approvalRequest.message" class="mb-4">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message:</p>
                <p class="text-sm text-gray-900 dark:text-gray-100">
                  {{ approvalRequest.message }}
                </p>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Proofing:</strong> {{ approvalRequest.proofing?.name }}</p>
                <p class="mt-2">
                  <strong>Requested by:</strong> {{ approvalRequest.creative_email }}
                </p>
                <p class="mt-2">
                  <strong>Date:</strong> {{ formatDate(approvalRequest.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Media Preview & Actions -->
          <div class="space-y-6">
            <!-- Media Preview -->
            <div
              v-if="media"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Media</h2>
              </div>
              <div class="p-5">
                <img
                  v-if="media.file?.type === 'image'"
                  :src="media.file?.url"
                  :alt="media.file?.filename || 'Media'"
                  class="w-full rounded-lg"
                />
                <video
                  v-else-if="media.file?.type === 'video'"
                  :src="media.file?.url"
                  controls
                  class="w-full rounded-lg"
                />
              </div>
            </div>

            <!-- Approval Actions -->
            <div
              v-if="approvalRequest.status === 'pending' && isAuthorizedClient"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Approve Request
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Please enter your email to approve this request for additional revisions.
              </p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    v-model="email"
                    type="email"
                    placeholder="your.email@example.com"
                    class="w-full"
                    readonly
                  />
                </div>
                <div class="flex gap-3">
                  <Button
                    :disabled="!email || isSubmitting"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    @click="handleApprove"
                  >
                    <CheckCircle2 v-if="!isSubmitting" class="w-4 h-4 mr-2" />
                    <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
                    Approve
                  </Button>
                  <Button
                    :disabled="!email || isSubmitting"
                    variant="outline"
                    class="flex-1"
                    @click="showRejectModal = true"
                  >
                    <X v-if="!isSubmitting" class="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reject Modal -->
      <Dialog :open="showRejectModal" @update:open="showRejectModal = $event">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Approval Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this approval request.
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Reason (required)</label>
              <textarea
                v-model="rejectReason"
                class="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" @click="showRejectModal = false">Cancel</Button>
              <Button :disabled="isSubmitting || !rejectReason" @click="handleReject">
                <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
                Reject
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Loader2, CheckCircle2, X, MessageSquare } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { useProofingApi } from '@/domains/memora/api/proofing'
import { useUserStore } from '@/shared/stores/user'
import { toast } from '@/shared/utils/toast'

const route = useRoute()
const router = useRouter()
const proofingApi = useProofingApi()
const userStore = useUserStore()

const isAuthenticated = computed(() => userStore.isAuthenticated)
const isPasswordVerified = ref(false)
const canViewContent = computed(() => {
  // Allow authenticated users
  if (isAuthenticated.value || isPasswordVerified.value) return true

  // Allow creatives to view (check after approval request is loaded)
  if (approvalRequest.value && isCreative.value) return true

  return false
})

const isLoading = ref(true)
const error = ref(null)
const approvalRequest = ref(null)
const media = ref(null)
const email = ref('')
const isSubmitting = ref(false)
const showRejectModal = ref(false)
const rejectReason = ref('')

// Login state
const loginEmail = ref('')
const loginPassword = ref('')
const isLoggingIn = ref(false)
const loginError = ref('')
const hasProofingPassword = ref(false)

// Storage key for validated email
const getStorageKey = (proofingUuid = null) => {
  const uuid = proofingUuid || approvalRequest.value?.proofing?.uuid
  if (uuid) {
    return `guest_email_proofing_${uuid}`
  }
  // Fallback to token-based key if proofing not loaded yet
  const token = route.params.token
  return `approval_request_email_${token}`
}

// Load stored email if exists
const loadStoredEmail = () => {
  if (!approvalRequest.value?.proofing?.uuid) return

  const storageKey = getStorageKey(approvalRequest.value.proofing.uuid)
  const storedEmail = localStorage.getItem(storageKey)
  if (storedEmail) {
    loginEmail.value = storedEmail
    email.value = storedEmail // Sync with email for isAuthorizedClient
    // Check if email is still valid for this approval request
    if (approvalRequest.value?.proofing) {
      const normalizedEmail = storedEmail.toLowerCase().trim()
      const primaryEmail = approvalRequest.value.proofing.primary_email?.toLowerCase().trim()
      const allowedEmails = (approvalRequest.value.proofing.allowed_emails || []).map(e =>
        e.toLowerCase().trim()
      )
      const creativeEmail = approvalRequest.value.creative_email?.toLowerCase().trim()

      // Allow creative's email to view (for reference)
      const isCreative = creativeEmail && normalizedEmail === creativeEmail
      const isClient = normalizedEmail === primaryEmail || allowedEmails.includes(normalizedEmail)

      if (isCreative || isClient) {
        // Email is valid, mark as verified
        isPasswordVerified.value = true
      } else {
        // Email not in allowed list, clear storage
        localStorage.removeItem(storageKey)
        loginEmail.value = ''
        email.value = ''
      }
    }
  }
}

// Store validated email
const storeEmail = emailToStore => {
  if (!approvalRequest.value?.proofing?.uuid) return
  const storageKey = getStorageKey(approvalRequest.value.proofing.uuid)
  localStorage.setItem(storageKey, emailToStore)
}

const isAuthorizedClient = computed(() => {
  if (!email.value || !approvalRequest.value) return false

  const normalizedEmail = email.value.toLowerCase().trim()
  const creativeEmail = approvalRequest.value.creative_email?.toLowerCase().trim()
  const primaryEmail = approvalRequest.value.proofing?.primary_email?.toLowerCase().trim()
  const allowedEmails = (approvalRequest.value.proofing?.allowed_emails || []).map(e =>
    e.toLowerCase().trim()
  )

  // Don't show if email matches creative's email
  if (creativeEmail && normalizedEmail === creativeEmail) {
    return false
  }

  // Show if email matches primary email or allowed emails
  return normalizedEmail === primaryEmail || allowedEmails.includes(normalizedEmail)
})

const isCreative = computed(() => {
  if (!approvalRequest.value) return false

  const normalizedEmail = (email.value || loginEmail.value || userStore.user?.email || '')
    .toLowerCase()
    .trim()
  const creativeEmail = approvalRequest.value.creative_email?.toLowerCase().trim()

  return creativeEmail && normalizedEmail === creativeEmail
})

const formatDate = date => {
  if (!date) return ''
  const d = new Date(date)
  return (
    d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )
}

const loadApprovalRequest = async () => {
  isLoading.value = true
  error.value = null
  try {
    const token = route.params.token
    const result = await proofingApi.getApprovalRequest(token)
    approvalRequest.value = result.approval_request
    media.value = result.approval_request.media
    hasProofingPassword.value = result.approval_request.proofing?.has_password || false

    // Load stored email after approval request is loaded
    loadStoredEmail()
  } catch (err) {
    error.value = err?.message || 'Failed to load approval request'
  } finally {
    isLoading.value = false
  }
}

const handleApprove = async () => {
  if (!email.value) return
  isSubmitting.value = true
  try {
    await proofingApi.approveApprovalRequest(route.params.token, email.value)
    toast.success('Approval request approved', {
      description: 'The approval request has been approved successfully.',
    })
    await loadApprovalRequest()
  } catch (err) {
    toast.error('Failed to approve', {
      description: err?.message || 'An error occurred while approving the approval request.',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleReject = async () => {
  if (!email.value) return
  isSubmitting.value = true
  try {
    await proofingApi.rejectApprovalRequest(
      route.params.token,
      email.value,
      rejectReason.value || null
    )
    toast.success('Approval request rejected', {
      description: 'The approval request has been rejected.',
    })
    showRejectModal.value = false
    rejectReason.value = ''
    await loadApprovalRequest()
  } catch (err) {
    toast.error('Failed to reject', {
      description: err?.message || 'An error occurred while rejecting the approval request.',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleLogin = async () => {
  if (!loginEmail.value) {
    loginError.value = 'Please enter your email'
    return
  }

  // Validate email is in allowed emails, primary email, or creative email
  if (approvalRequest.value?.proofing) {
    const normalizedEmail = loginEmail.value.toLowerCase().trim()
    const primaryEmail = approvalRequest.value.proofing.primary_email?.toLowerCase().trim()
    const allowedEmails = (approvalRequest.value.proofing.allowed_emails || []).map(e =>
      e.toLowerCase().trim()
    )
    const creativeEmail = approvalRequest.value.creative_email?.toLowerCase().trim()

    // Allow creative's email to view (for reference)
    const isCreative = creativeEmail && normalizedEmail === creativeEmail
    const isClient = normalizedEmail === primaryEmail || allowedEmails.includes(normalizedEmail)

    if (!isCreative && !isClient) {
      loginError.value = 'This email is not authorized to access this approval request'
      return
    }
  }

  if (hasProofingPassword.value) {
    if (!loginPassword.value) {
      loginError.value = 'Please enter the proofing password'
      return
    }
    // Verify proofing password
    isLoggingIn.value = true
    loginError.value = ''
    try {
      await proofingApi.verifyProofingPassword(
        approvalRequest.value.proofing.uuid,
        loginPassword.value
      )
      // Password verified, store email and mark as verified for this session
      storeEmail(loginEmail.value)
      email.value = loginEmail.value // Sync with email for isAuthorizedClient
      isPasswordVerified.value = true
      loginPassword.value = ''
      toast.success('Password verified successfully')
    } catch (error) {
      loginError.value = error?.message || 'Invalid password'
    } finally {
      isLoggingIn.value = false
    }
  } else {
    // No proofing password - store email and mark as verified
    storeEmail(loginEmail.value)
    email.value = loginEmail.value // Sync with email for isAuthorizedClient
    isPasswordVerified.value = true
    loginPassword.value = ''
  }
}

const proofingUrl = computed(() => {
  if (!approvalRequest.value?.proofing?.uuid) return null

  const proofingId = approvalRequest.value.proofing.uuid
  const projectId = approvalRequest.value.proofing.project_uuid

  if (projectId) {
    return `/p/${projectId}/proofing?proofingId=${proofingId}`
  } else {
    // Standalone proofing - use proofing ID as project ID fallback
    return `/p/${proofingId}/proofing?proofingId=${proofingId}`
  }
})

const handleGoToProofing = () => {
  if (proofingUrl.value) {
    router.push(proofingUrl.value)
  }
}

const handleGoBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const handleCreateSupportTicket = () => {
  // TODO: Implement support ticket creation
  // For now, open support page or modal
  toast.info('Support ticket creation coming soon', {
    description: 'This feature will allow you to create a support ticket for this rejection.',
  })
}

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadApprovalRequest()
  } else {
    // Load approval request to check if password is required
    await loadApprovalRequest()
  }
})
</script>
