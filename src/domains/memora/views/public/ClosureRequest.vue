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

      <div v-else-if="closureRequest" class="max-w-6xl mx-auto px-4 py-8">
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
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Closure Request</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Review comments and action items for this revision
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

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Left: Comments -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Client Feedback
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ comments.length }} {{ comments.length === 1 ? 'comment' : 'comments' }}
              </p>
            </div>
            <div class="p-5 space-y-4 max-h-[600px] overflow-y-auto">
              <div
                v-if="comments.length === 0"
                class="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                No comments yet
              </div>
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {{ getAuthorName(comment.created_by) }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(comment.created_at) }}
                  </span>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ comment.content }}</p>
                <div
                  v-if="comment.replies && comment.replies.length > 0"
                  class="mt-3 ml-4 space-y-2"
                >
                  <div
                    v-for="reply in comment.replies"
                    :key="reply.id"
                    class="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-semibold text-xs text-gray-900 dark:text-gray-100">
                        {{ getAuthorName(reply.created_by) }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(reply.created_at) }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-700 dark:text-gray-300">{{ reply.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Action Items & Media -->
          <div class="space-y-6">
            <!-- Action Items -->
            <div
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Action Items</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Please confirm all items are complete
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
              v-if="closureRequest.status === 'pending' && isAuthorizedClient"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Confirm Closure
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Please enter your email to confirm that all action items have been completed.
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
                    variant="success"
                    class="flex-1"
                    :loading="isSubmitting"
                    :icon="CheckCircle2"
                    @click="handleApprove"
                  >
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
            <DialogTitle>Reject Closure Request</DialogTitle>
            <DialogDescription>
              Please list what is missing or needs to be addressed before this closure request can
              be approved.
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">What is missing? (required)</label>
              <textarea
                v-model="rejectReason"
                class="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="List what is missing or needs to be addressed..."
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
import { ArrowLeft, Loader2, CheckCircle2, X } from 'lucide-vue-next'
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

  // Allow creatives to view (check after closure request is loaded)
  if (closureRequest.value && isCreative.value) return true

  return false
})

const isLoading = ref(true)
const error = ref(null)
const closureRequest = ref(null)
const comments = ref([])
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

const handleApprove = async () => {
  if (!email.value) return
  isSubmitting.value = true
  try {
    await proofingApi.approveClosureRequest(route.params.token, email.value)
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

  const proofingId = closureRequest.value.proofing.uuid
  const projectId = closureRequest.value.proofing.project_uuid

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

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadClosureRequest()
  } else {
    // Load closure request to check if password is required
    await loadClosureRequest()
  }
})
</script>
