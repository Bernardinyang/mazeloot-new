<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Login Form (shown when creative is not authenticated and password not verified) -->
    <div
      v-if="!canViewContent && !isLoading"
      class="flex items-center justify-center min-h-screen px-4 sm:px-6"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8"
      >
        <div class="mb-6 text-center">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sign In Required</h1>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Please sign in to view this closure request
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
            class="w-full bg-amber-500 hover:bg-amber-600 text-white"
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

    <!-- Closure Request Content (shown when authenticated or password verified) -->
    <template v-else>
      <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
        <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
      </div>

      <div v-else-if="error" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <p class="text-red-600 dark:text-red-400 text-lg">{{ error }}</p>
        </div>
      </div>

      <div v-else-if="closureRequest" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Header -->
        <div class="mb-6 sm:mb-8">
          <div class="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
            <Button
              v-if="isAuthenticated || proofingUrl"
              variant="ghost"
              class="flex items-center gap-2 text-sm sm:text-base"
              @click="isAuthenticated ? handleGoBack() : handleGoToProofing()"
            >
              <ArrowLeft class="h-4 w-4" />
              <span class="hidden sm:inline">{{ isAuthenticated ? 'Go back' : 'Back to Proofing' }}</span>
              <span class="sm:hidden">{{ isAuthenticated ? 'Back' : 'Back' }}</span>
            </Button>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Closure Request</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Review client feedback and items the creative will fix in the next version
          </p>
        </div>

        <!-- Status Banner -->
        <div
          v-if="closureRequest.status !== 'pending'"
          class="mb-6 p-4 rounded-lg"
          :class="
            closureRequest.status === 'approved'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          "
        >
          <p
            class="font-semibold"
            :class="
              closureRequest.status === 'approved'
                ? 'text-green-800 dark:text-green-300'
                : 'text-red-800 dark:text-red-300'
            "
          >
            This closure request has been
            {{ closureRequest.status === 'approved' ? 'approved' : 'rejected' }}.
          </p>
          <p
            v-if="closureRequest.status === 'rejected' && closureRequest.rejection_reason"
            class="mt-2 text-sm"
            :class="closureRequest.status === 'rejected' ? 'text-red-700 dark:text-red-300' : ''"
          >
            <strong>Reason:</strong> {{ closureRequest.rejection_reason }}
          </p>
          <p
            v-if="closureRequest.status === 'approved' && isCreative"
            class="mt-2 text-sm text-green-700 dark:text-green-300"
          >
            This version is now marked as completed. You can upload a new version with the requested
            updates.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:items-stretch">
          <!-- Left: Action Items on top, then Client Feedback -->
          <div class="flex flex-col gap-4 sm:gap-6 order-1 md:order-1 min-h-0">
            <!-- Action Items -->
            <div
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Action Items</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Items the creative will fix in the next version of this media
                </p>
              </div>
              <div class="p-5 space-y-3">
                <div
                  v-for="(todo, index) in todos"
                  :key="index"
                  class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <CheckCircle2
                    :class="[
                      'w-5 h-5 mt-0.5 flex-shrink-0',
                      todo.completed
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400 dark:text-gray-500',
                    ]"
                  />
                  <span
                    :class="[
                      'text-sm flex-1',
                      todo.completed
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-gray-900 dark:text-gray-100',
                    ]"
                  >
                    {{ todo.text }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Client Feedback -->
            <div
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-1 flex-col min-h-0"
            >
              <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Client Feedback
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ totalCommentCount }} {{ totalCommentCount === 1 ? 'comment' : 'comments' }}
                </p>
              </div>
              <div class="p-5 space-y-4 flex-1 min-h-0 overflow-y-auto">
                <div
                  v-if="commentsTree.length === 0"
                  class="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No comments yet
                </div>
                <ClosureCommentNode
                  v-for="comment in commentsTree"
                  :key="comment.id"
                  :comment="comment"
                  :get-author-name="getAuthorName"
                  :format-date="formatDate"
                />
              </div>
            </div>
          </div>

          <!-- Right: Media & Approval -->
          <div class="flex flex-col gap-4 sm:gap-6 order-2 md:order-2 min-h-0">
            <!-- Media Preview -->
            <div
              v-if="media"
              ref="mediaCardRef"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Media</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This is the version the creative is requesting to close. Review the feedback and action items, then approve or reject below.
                </p>
              </div>
              <dl class="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                <template v-if="closureRequest?.proofing?.name">
                  <dt class="text-gray-500 dark:text-gray-400">Proofing</dt>
                  <dd class="font-medium text-gray-900 dark:text-gray-100">{{ closureRequest.proofing.name }}</dd>
                </template>
                <template v-if="media.file?.filename">
                  <dt class="text-gray-500 dark:text-gray-400">File</dt>
                  <dd class="font-medium text-gray-900 dark:text-gray-100 truncate" :title="media.file.filename">{{ media.file.filename }}</dd>
                </template>
                <template v-if="media.revision_number != null">
                  <dt class="text-gray-500 dark:text-gray-400">Version</dt>
                  <dd class="font-medium text-gray-900 dark:text-gray-100">{{ media.revision_number }}</dd>
                </template>
                <template v-if="media.file?.type">
                  <dt class="text-gray-500 dark:text-gray-400">Type</dt>
                  <dd class="font-medium text-gray-900 dark:text-gray-100 capitalize">{{ media.file.type }}</dd>
                </template>
              </dl>
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
              v-if="closureRequest.status === 'pending' && isAuthorizedClient"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Confirm Closure
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Confirm that you approve this closure request and accept the items the creative will fix in the next version.
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
                <div class="flex flex-col sm:flex-row gap-3">
                  <Button
                    :disabled="!email || isSubmitting"
                    variant="success"
                    class="flex-1 text-sm sm:text-base"
                    :loading="isSubmitting"
                    :icon="CheckCircle2"
                    @click="showApproveConfirmModal = true"
                  >
                    Approve
                  </Button>
                  <Button
                    :disabled="!email || isSubmitting"
                    variant="destructive"
                    class="flex-1 text-sm sm:text-base"
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

      <!-- Approve Confirmation Modal -->
      <Dialog :open="showApproveConfirmModal" @update:open="showApproveConfirmModal = $event">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              By approving, you confirm that you accept the action items and that the creative will
              address them in the next version. This will mark the closure request as approved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" @click="showApproveConfirmModal = false">Cancel</Button>
            <Button
              variant="default"
              :disabled="isSubmitting"
              :loading="isSubmitting"
              :icon="CheckCircle2"
              @click="handleApproveConfirm"
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Reject Modal -->
      <Dialog :open="showRejectModal" @update:open="showRejectModal = $event">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Closure Request</DialogTitle>
            <DialogDescription>
              Please list what is missing or needs to be addressed before this closure request can
              be approved.
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">What is missing? (required)</label>
              <Textarea
                v-model="rejectReason"
                class="w-full"
                rows="3"
                placeholder="List what is missing or needs to be addressed..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" @click="showRejectModal = false">Cancel</Button>
              <Button
                variant="destructive"
                :disabled="isSubmitting || !rejectReason"
                @click="handleReject"
              >
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
import { ArrowLeft, Loader2, CheckCircle2, X } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import ClosureCommentNode from '@/shared/components/molecules/ClosureCommentNode.vue'
import { useProofingApi } from '@/domains/memora/api/proofing'
import { useUserStore } from '@/shared/stores/user'
import { toast } from '@/shared/utils/toast'
import { publicProofingUrl } from '@/shared/utils/memoraPublicUrls'

const route = useRoute()
const router = useRouter()
const proofingApi = useProofingApi()
const userStore = useUserStore()

const isAuthenticated = computed(() => userStore.isAuthenticated)
const isPasswordVerified = ref(false)
const canViewContent = computed(() => {
  // Allow authenticated users
  if (isAuthenticated.value || isPasswordVerified.value) return true

  // Allow creatives to view (check after closure request is loaded)
  if (closureRequest.value && isCreative.value) return true

  return false
})

const isLoading = ref(true)
const error = ref(null)
const closureRequest = ref(null)
const comments = ref([])
const commentsTree = computed(() => comments.value || [])
const totalCommentCount = computed(() => {
  const count = (list) => {
    let n = 0
    for (const c of list || []) {
      n += 1
      if (c.replies?.length) n += count(c.replies)
    }
    return n
  }
  return count(commentsTree.value)
})
const todos = ref([])
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
  const uuid = proofingUuid || closureRequest.value?.proofing?.uuid
  if (uuid) {
    return `guest_email_proofing_${uuid}`
  }
  // Fallback to token-based key if proofing not loaded yet
  const token = route.params.token
  return `closure_request_email_${token}`
}

// Load stored email if exists
const loadStoredEmail = () => {
  if (!closureRequest.value?.proofing?.uuid) return

  const storageKey = getStorageKey(closureRequest.value.proofing.uuid)
  const storedEmail = localStorage.getItem(storageKey)
  if (storedEmail) {
    loginEmail.value = storedEmail
    email.value = storedEmail // Sync with email for isAuthorizedClient
    // Check if email is still valid for this closure request
    if (closureRequest.value?.proofing) {
      const normalizedEmail = storedEmail.toLowerCase().trim()
      const primaryEmail = closureRequest.value.proofing.primary_email?.toLowerCase().trim()
      const allowedEmails = (closureRequest.value.proofing.allowed_emails || []).map(e =>
        e.toLowerCase().trim()
      )
      const creativeEmail = closureRequest.value.creative_email?.toLowerCase().trim()

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
  if (!closureRequest.value?.proofing?.uuid) return
  const storageKey = getStorageKey(closureRequest.value.proofing.uuid)
  localStorage.setItem(storageKey, emailToStore)
}

const isAuthorizedClient = computed(() => {
  if (!email.value || !closureRequest.value) return false

  const normalizedEmail = email.value.toLowerCase().trim()
  const creativeEmail = closureRequest.value.creative_email?.toLowerCase().trim()
  const primaryEmail = closureRequest.value.proofing?.primary_email?.toLowerCase().trim()

  // Don't show if email matches creative's email
  if (creativeEmail && normalizedEmail === creativeEmail) {
    return false
  }

  // Show only if email matches primary email
  return normalizedEmail === primaryEmail
})

const isCreative = computed(() => {
  if (!closureRequest.value) return false

  const normalizedEmail = (email.value || loginEmail.value || '').toLowerCase().trim()
  const creativeEmail = closureRequest.value.creative_email?.toLowerCase().trim()

  return creativeEmail && normalizedEmail === creativeEmail
})

const getAuthorName = createdBy => {
  if (!createdBy) return 'Anonymous'
  if (typeof createdBy === 'string') {
    // Check if it's a JSON string
    try {
      const parsed = JSON.parse(createdBy)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed.email || parsed.name || 'Anonymous'
      }
    } catch {
      // Not JSON, return as is (assume it's an email)
      return createdBy
    }
  }
  if (typeof createdBy === 'object' && createdBy !== null) {
    return createdBy.email || createdBy.name || 'Anonymous'
  }
  return 'Anonymous'
}

const formatDate = date => {
  if (!date) return ''
  const d = new Date(date)
  return (
    d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )
}

const loadClosureRequest = async () => {
  isLoading.value = true
  error.value = null
  try {
    const token = route.params.token
    const result = await proofingApi.getClosureRequest(token)
    closureRequest.value = result.closure_request
    comments.value = result.closure_request.comments || []
    todos.value = result.closure_request.todos || []
    media.value = result.closure_request.media
    hasProofingPassword.value = result.closure_request.proofing?.has_password || false

    // Load stored email after closure request is loaded
    loadStoredEmail()
  } catch (err) {
    error.value = err?.message || 'Failed to load closure request'
  } finally {
    isLoading.value = false
  }
}

const showApproveConfirmModal = ref(false)

const handleApprove = async () => {
  if (!email.value) return
  isSubmitting.value = true
  try {
    await proofingApi.approveClosureRequest(route.params.token, email.value)
    showApproveConfirmModal.value = false
    toast.success('Closure request approved', {
      description: 'The closure request has been approved successfully.',
    })
    await loadClosureRequest()
  } catch (err) {
    toast.error('Failed to approve', {
      description: err?.message || 'An error occurred while approving the closure request.',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleApproveConfirm = () => {
  handleApprove()
}

const handleReject = async () => {
  if (!email.value) return
  isSubmitting.value = true
  try {
    await proofingApi.rejectClosureRequest(
      route.params.token,
      email.value,
      rejectReason.value || null
    )
    toast.success('Closure request rejected', {
      description: 'The closure request has been rejected.',
    })
    showRejectModal.value = false
    rejectReason.value = ''
    await loadClosureRequest()
  } catch (err) {
    toast.error('Failed to reject', {
      description: err?.message || 'An error occurred while rejecting the closure request.',
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
  if (closureRequest.value?.proofing) {
    const normalizedEmail = loginEmail.value.toLowerCase().trim()
    const primaryEmail = closureRequest.value.proofing.primary_email?.toLowerCase().trim()
    const allowedEmails = (closureRequest.value.proofing.allowed_emails || []).map(e =>
      e.toLowerCase().trim()
    )
    const creativeEmail = closureRequest.value.creative_email?.toLowerCase().trim()

    // Allow creative's email to view (for reference)
    const isCreative = creativeEmail && normalizedEmail === creativeEmail
    const isClient = normalizedEmail === primaryEmail || allowedEmails.includes(normalizedEmail)

    if (!isCreative && !isClient) {
      loginError.value = 'This email is not authorized to access this closure request'
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
        closureRequest.value.proofing.uuid,
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
  if (!closureRequest.value?.proofing?.uuid) return null
  const p = closureRequest.value.proofing
  return publicProofingUrl(p.uuid, p.branding_domain || p.project_uuid)
})

const handleGoBack = () => {
  router.back()
}

const handleGoToProofing = () => {
  if (proofingUrl.value) router.push(proofingUrl.value)
}

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadClosureRequest()
  } else {
    // Load closure request to check if password is required
    await loadClosureRequest()
  }
})
</script>
