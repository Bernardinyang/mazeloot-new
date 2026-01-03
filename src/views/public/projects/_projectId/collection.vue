<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Initial Loading State with Skeleton -->
    <div v-if="isLoading && !collection && !hasPassword && !showEmailModal" class="min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <!-- Header Skeleton -->
        <div class="mb-8">
          <Skeleton class="h-8 w-64 mb-2" />
          <Skeleton class="h-4 w-48" />
        </div>
        <!-- Tabs Skeleton -->
        <div class="flex gap-4 mb-6">
          <Skeleton class="h-10 w-24" />
          <Skeleton class="h-10 w-24" />
          <Skeleton class="h-10 w-24" />
        </div>
        <!-- Media Grid Skeleton -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Skeleton v-for="i in 12" :key="i" class="aspect-square rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Email Registration Modal -->
    <Dialog v-if="showEmailModal && !isAuthenticatedOwner && !isPreviewMode" :open="true">
      <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
            Email Required
          </DialogTitle>
          <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
            Please enter your email address to access this collection.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 mt-6">
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Email Address </label>
            <Input
              v-model="emailInput"
              :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              :disabled="isSubmittingEmail"
              class="w-full"
              placeholder="your.email@example.com"
              type="email"
              @keydown.enter="handleSubmitEmail"
            />
            <p v-if="emailError" class="text-xs text-red-600 dark:text-red-400">
              {{ emailError }}
            </p>
            <p :class="theme.textSecondary" class="text-xs">
              Your email will be used to access this collection.
            </p>
          </div>
        </div>

        <DialogFooter class="mt-6">
          <Button
            :disabled="isSubmittingEmail || !emailInput || !isValidEmail"
            class="bg-teal-500 hover:bg-teal-600 text-white"
            @click="handleSubmitEmail"
          >
            <Loader2 v-if="isSubmittingEmail" class="h-4 w-4 mr-2 animate-spin" />
            {{ isSubmittingEmail ? 'Submitting...' : 'Continue' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Password Protection Modal (must come before error state, after email if required) -->
    <Dialog v-if="hasPassword && !isPasswordVerified && !guestToken && !isAuthenticatedOwner && !showEmailModal && !isLoading && (!emailRegistrationRequired || userEmail)" :open="true" @update:open="(val) => { if (!val && hasPassword && !isPasswordVerified && !guestToken) { passwordInput = ''; passwordError = '' } }">
      <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
            Password Required
          </DialogTitle>
          <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
            This collection is password protected. Please enter the password to continue.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 mt-6">
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Password </label>
            <PasswordInput
              v-model="passwordInput"
              :input-class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'w-full focus:ring-2 focus:ring-teal-500/20 transition-all',
              ]"
              :disabled="isVerifyingPassword"
              placeholder="Enter password"
              @keydown.enter="handleVerifyPassword"
            />
            <p v-if="passwordError" class="text-xs text-red-600 dark:text-red-400">
              {{ passwordError }}
            </p>
          </div>
        </div>

        <DialogFooter class="mt-6">
          <Button
            :disabled="isVerifyingPassword || !passwordInput"
            class="bg-teal-500 hover:bg-teal-600 text-white"
            @click="handleVerifyPassword"
          >
            <Loader2 v-if="isVerifyingPassword" class="h-4 w-4 mr-2 animate-spin" />
            {{ isVerifyingPassword ? 'Verifying...' : 'Continue' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Error State -->
    <div v-else-if="error && !collection && !hasPassword && !showEmailModal" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md px-4">
        <AlertCircle class="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ errorTitle }}</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Collection Preview -->
    <div
      v-else-if="collection && (isPasswordVerified || guestToken || !hasPassword || isAuthenticatedOwner) && !showEmailModal"
      class="relative"
    >
      <!-- Download PIN Modal -->
      <Dialog v-if="showDownloadPinModal && requiresDownloadPin && !isDownloadPinVerified && !isAuthenticatedOwner" :open="showDownloadPinModal" @update:open="(val) => { if (!val) { showDownloadPinModal = false; downloadPinInput = ''; downloadPinError = '' } }">
        <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
              Download PIN Required
            </DialogTitle>
            <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
              Please enter the 4-digit download PIN to download media from this collection.
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-4 mt-6">
            <div class="space-y-2">
              <PinInput
                v-model="downloadPinInput"
                :input-class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                ]"
                :disabled="isVerifyingDownloadPin"
                :length="4"
                @complete="handleVerifyDownloadPin"
              />
              <p v-if="downloadPinError" class="text-xs text-red-600 dark:text-red-400 text-center">
                {{ downloadPinError }}
              </p>
            </div>
          </div>

          <DialogFooter class="mt-6">
            <Button
              :disabled="isVerifyingDownloadPin || !downloadPinInput || downloadPinInput.length !== 4"
              class="bg-teal-500 hover:bg-teal-600 text-white w-full"
              @click="handleVerifyDownloadPin"
            >
              <Loader2 v-if="isVerifyingDownloadPin" class="h-4 w-4 mr-2 animate-spin" />
              {{ isVerifyingDownloadPin ? 'Verifying...' : 'Verify PIN' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Loading Overlay for Media -->
      <div
        v-if="isLoadingMedia"
        class="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-3">
          <Loader2 class="h-8 w-8 animate-spin text-teal-500" />
          <p class="text-sm text-gray-600 dark:text-gray-400">Loading media...</p>
        </div>
      </div>

      <CollectionPreview
        ref="collectionPreviewRef"
        preview-mode="public"
        :preview-collection="collection"
        :preview-media="media"
        :preview-branding="{ logoUrl: brandingLogoUrl, name: brandingName }"
        :preview-is-loading="isLoadingMedia"
        :downloading-media-ids="downloadingMediaIds"
        @tab-change="handleTabChange"
        @download="handleDownloadMedia"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2, AlertCircle } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Skeleton } from '@/components/shadcn/skeleton'
import PasswordInput from '@/components/molecules/PasswordInput.vue'
import PinInput from '@/components/molecules/PinInput.vue'
import CollectionPreview from '@/views/user/memora/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { apiClient } from '@/api/client'
import { API_CONFIG } from '@/api/config'
import { useUserStore } from '@/stores/user'
import { toast } from '@/utils/toast'
import { addDefaultSettings } from '@/api/collections'
import { useSettingsApi } from '@/api/settings'

const { fetchSettings, fetchPublicSettings } = useSettingsApi()

const route = useRoute()
const theme = useThemeClasses()
const userStore = useUserStore()

const collection = ref(null)
const media = ref([])
const brandingLogoUrl = ref(null)
const brandingName = ref(null)
const collectionPreviewRef = ref(null)
const isLoading = ref(true)
const isLoadingMedia = ref(false)
const error = ref(null)
const hasPassword = ref(false)
const isPasswordVerified = ref(false)
const passwordInput = ref('')
const isVerifyingPassword = ref(false)
const passwordError = ref('')
const guestToken = ref(null)
const emailRegistrationRequired = ref(false)
const showEmailModal = ref(false)
const emailInput = ref('')
const isSubmittingEmail = ref(false)
const emailError = ref('')
const userEmail = ref('')
const isDownloadPinVerified = ref(false)
const downloadPinInput = ref('')
const verifiedDownloadPin = ref('')
const isVerifyingDownloadPin = ref(false)
const downloadPinError = ref('')
const showDownloadPinModal = ref(false)
const downloadingMediaIds = ref(new Set())
const pendingDownloadItem = ref(null)

const isAuthenticatedOwner = computed(() => {
  if (!userStore.isAuthenticated || !collection.value) return false
  const userUuid = collection.value.userId || collection.value.user_uuid
  const currentUserId = userStore.user?.id || userStore.user?.uuid
  return userUuid && currentUserId && userUuid === currentUserId
})

const errorTitle = computed(() => {
  if (error.value?.includes('not found')) return 'Collection Not Found'
  if (error.value?.includes('not accessible')) return 'Collection Not Accessible'
  return 'Error Loading Collection'
})

const errorMessage = computed(() => {
  if (error.value?.includes('not found')) return 'The collection you are looking for does not exist.'
  if (error.value?.includes('not accessible')) return 'This collection is not yet published. Please contact the creator to publish it before accessing.'
  return error.value || 'An unknown error occurred while loading the collection.'
})

const isPreviewMode = computed(() => route.query.preview === 'true')

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailInput.value && emailRegex.test(emailInput.value)
})

const requiresEmailRegistration = computed(() => {
  return collection.value?.emailRegistration ?? false
})

const requiresDownloadPin = computed(() => {
  return collection.value?.downloadPinEnabled ?? false
})

// Get stored email from localStorage
const getStoredEmail = (collectionId) => {
  const stored = localStorage.getItem(`collection_email_${collectionId}`)
  if (stored) {
    userEmail.value = stored
    emailInput.value = stored
    return stored
  }
  return null
}

// Store email in localStorage
const storeEmail = (collectionId, email) => {
  localStorage.setItem(`collection_email_${collectionId}`, email)
  userEmail.value = email
}

// Get stored guest token from localStorage
const getStoredGuestToken = (collectionId) => {
  const stored = localStorage.getItem(`collection_guest_token_${collectionId}`)
  if (stored) {
    guestToken.value = stored
    return stored
  }
  return null
}

// Store guest token in localStorage
const storeGuestToken = (collectionId, token) => {
  localStorage.setItem(`collection_guest_token_${collectionId}`, token)
  guestToken.value = token
}

// Get stored download PIN from localStorage (with expiration check)
const getStoredDownloadPin = (collectionId) => {
  const stored = localStorage.getItem(`collection_download_pin_${collectionId}`)
  if (stored) {
    try {
      const data = JSON.parse(stored)
      const expiresAt = data.expiresAt
      if (expiresAt && Date.now() < expiresAt) {
        return data.pin
      }
      localStorage.removeItem(`collection_download_pin_${collectionId}`)
    } catch (e) {
      localStorage.removeItem(`collection_download_pin_${collectionId}`)
    }
  }
  return null
}

// Store download PIN in localStorage (15 minutes expiration)
const storeDownloadPin = (collectionId, pin) => {
  const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes
  localStorage.setItem(`collection_download_pin_${collectionId}`, JSON.stringify({ pin, expiresAt }))
  verifiedDownloadPin.value = pin
  isDownloadPinVerified.value = true
}

// Load collection
const loadCollection = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Get collection ID from query parameter (route is /p/:projectId/collection?collectionId=...)
    const collectionId = route.query.collectionId

    if (!collectionId) {
      throw new Error('Collection ID is required in the URL')
    }

    // Check for stored guest token FIRST, before any other checks
    // This ensures the token is available for all subsequent operations
    const storedToken = getStoredGuestToken(collectionId)
    if (storedToken) {
      guestToken.value = storedToken
      isPasswordVerified.value = true
    }

    // STEP 1: Check collection status
    let statusCheck = null

    // If in preview mode and authenticated, try to fetch directly first
    if (isPreviewMode.value && userStore.isAuthenticated) {
      try {
        const response = await apiClient.get(`/v1/memora/collections/${collectionId}`)
        const collectionData = response.data?.data || response.data

        // Verify user is owner
        const userUuid = collectionData.userId || collectionData.user_uuid
        const currentUserId = userStore.user?.id || userStore.user?.uuid
        const isOwner = userUuid && currentUserId && userUuid === currentUserId

        if (isOwner) {
          // Fetch public branding settings for collection owner
          try {
            const settingsResponse = await fetchPublicSettings({ collectionId: collectionId })
            const settings = settingsResponse.data || settingsResponse
            brandingLogoUrl.value = settings.branding?.logoUrl || null
            brandingName.value = settings.branding?.name || null
          } catch (error) {
            console.warn('Failed to fetch public branding settings:', error)
          }

          // Normalize collection data structure
          collection.value = addDefaultSettings(collectionData)
          hasPassword.value = !!(collection.value.collectionPasswordEnabled)
          if (hasPassword.value) {
            isPasswordVerified.value = true
          }
          // Load media for the first/default set
          if (collection.value?.mediaSets && collection.value.mediaSets.length > 0) {
            await loadMediaForSet(collection.value.mediaSets[0].id)
          }
          isLoading.value = false
          return
        }
      } catch (previewError) {
        // Fall through to public API
        console.warn('Preview mode fetch failed, trying public API:', previewError)
      }
    }

    // Check status via public API
    try {
      const statusResponse = await apiClient.get(`/v1/public/collections/${collectionId}/status`)
      statusCheck = statusResponse.data?.data || statusResponse.data
    } catch (statusError) {
      throw new Error('Collection not found')
    }

    // If preview mode and owner, allow access regardless of status
    if (isPreviewMode.value && statusCheck.isOwner === true) {
      // Owner in preview mode - fetch full collection data
      // Fetch branding settings
      try {
        const settingsResponse = await fetchSettings()
        const settings = settingsResponse.data || settingsResponse
        brandingLogoUrl.value = settings.branding?.logoUrl || null
        brandingName.value = settings.branding?.name || null
      } catch (error) {
        console.warn('Failed to fetch branding settings:', error)
      }

      const response = await apiClient.get(`/v1/memora/collections/${collectionId}`)
      const collectionData = response.data?.data || response.data
      // Normalize collection data structure
      collection.value = addDefaultSettings(collectionData)
      hasPassword.value = collection.value.collectionPasswordEnabled || statusCheck.hasPassword || false
      if (hasPassword.value) {
        isPasswordVerified.value = true
      }
      // Load media for the first/default set
      if (collection.value?.mediaSets && collection.value.mediaSets.length > 0) {
        await loadMediaForSet(collection.value.mediaSets[0].id)
      }
      isLoading.value = false
      return
    }

    // If not accessible and not in preview mode, show error
    if (statusCheck.isAccessible === false) {
      throw new Error(
        'This collection is not yet published. Please contact the creator to publish it before accessing.'
      )
    }

    // If draft and owner, allow preview
    if (statusCheck.status === 'draft' && statusCheck.isOwner === true) {
      const response = await apiClient.get(`/v1/memora/collections/${collectionId}`)
      const collectionData = response.data?.data || response.data
      // Normalize collection data structure
      collection.value = addDefaultSettings(collectionData)
      hasPassword.value = collection.value.collectionPasswordEnabled || statusCheck.hasPassword || false
      if (hasPassword.value) {
        isPasswordVerified.value = true
      }
      // Load media for the first/default set
      if (collection.value?.mediaSets && collection.value.mediaSets.length > 0) {
        await loadMediaForSet(collection.value.mediaSets[0].id)
      }
      isLoading.value = false
      return
    }

    // Load collection from public API
    hasPassword.value = statusCheck.hasPassword || false
    emailRegistrationRequired.value = statusCheck.emailRegistration || false

    // If we have a guest token and password is required, try to fetch collection with token
    if (hasPassword.value && guestToken.value && !isAuthenticatedOwner.value && !isPreviewMode.value) {
      try {
        await fetchCollection()
        // Collection loaded successfully with token
        isLoading.value = false
        return
      } catch (fetchErr) {
        // If token is invalid/expired, clear it and continue to show password modal
        const errorStatus = fetchErr?.status || fetchErr?.response?.status
        const errorCode = fetchErr?.code || fetchErr?.response?.data?.code || ''
        if (errorStatus === 401 || errorCode === 'GUEST_TOKEN_INVALID' || errorCode === 'GUEST_TOKEN_EXPIRED' || errorCode === 'PASSWORD_REQUIRED') {
          localStorage.removeItem(`collection_guest_token_${collectionId}`)
          guestToken.value = null
          isPasswordVerified.value = false
          // Continue to show password modal below
        } else {
          throw fetchErr
        }
      }
    }

    // Check for password requirement (no valid token)
    if (hasPassword.value && !guestToken.value && !isAuthenticatedOwner.value && !isPreviewMode.value) {
      // Check if email registration is required before password
      if (emailRegistrationRequired.value) {
        const storedEmail = getStoredEmail(collectionId)
        if (!storedEmail) {
          // Show email modal first
          error.value = null
          isLoading.value = false
          showEmailModal.value = true
          return
        }
      }
      // If password is required, show password modal (don't fetch collection yet)
      error.value = null // Clear any error
      isLoading.value = false
      return // Password modal will be shown, collection will be fetched after password verification
    }

    // Check if email registration is required (when no password)
    if (emailRegistrationRequired.value && !hasPassword.value && !isAuthenticatedOwner.value && !isPreviewMode.value) {
      const collectionId = route.query.collectionId
      const storedEmail = getStoredEmail(collectionId)
      if (!storedEmail) {
        error.value = null
        isLoading.value = false
        showEmailModal.value = true
        return
      }
    }

    // No password required, fetch collection and check for email registration
    try {
      await fetchCollection()
    } catch (fetchErr) {
      // If fetchCollection throws, it means it's not a password error
      // Re-throw to be caught by outer catch
      throw fetchErr
    }
  } catch (err) {
    // Check if error is about password required
    // API client throws plain error object: { message, code, status, errors }
    const errorMessage = err?.message || err?.response?.data?.message || ''
    const errorCode = err?.code || err?.response?.data?.code || ''
    const errorStatus = err?.status || err?.response?.status
    
    if (errorStatus === 401 && (errorMessage.toLowerCase().includes('password required') || errorCode === 'PASSWORD_REQUIRED')) {
      // Password is required - show password modal instead of error
      error.value = null // Clear any error
      hasPassword.value = true
      isPasswordVerified.value = false
      isLoading.value = false
      return // Exit early, don't set error
    } else {
      // Use exact backend error message, only fallback if completely empty
      error.value = errorMessage || 'Failed to load collection'
      isLoading.value = false
    }
  }
}

const fetchCollection = async () => {
  try {
    const collectionId = route.query.collectionId
    const headers = {}

    // Use guest token if available, otherwise use password header
    if (guestToken.value) {
      headers['Authorization'] = `Bearer ${guestToken.value}`
    } else if (isPasswordVerified.value && passwordInput.value) {
      headers['X-Collection-Password'] = passwordInput.value
    }

    // Fetch public branding settings for collection owner
    try {
      const settingsResponse = await fetchPublicSettings({ collectionId: route.query.collectionId })
      const settings = settingsResponse.data || settingsResponse
      brandingLogoUrl.value = settings.branding?.logoUrl || null
      brandingName.value = settings.branding?.name || null
    } catch (error) {
      console.warn('Failed to fetch public branding settings:', error)
    }

    const response = await apiClient.get(`/v1/public/collections/${collectionId}`, { headers })
    const collectionData = response.data?.data || response.data
    // Normalize collection data structure
    collection.value = addDefaultSettings(collectionData)
    
    // Update hasPassword from collection data
    if (collection.value?.collectionPasswordEnabled !== undefined) {
      hasPassword.value = collection.value.collectionPasswordEnabled
    }

    // Check if email registration is required
    if (collection.value?.emailRegistration && !isAuthenticatedOwner.value && !isPreviewMode.value) {
      const storedEmail = getStoredEmail(collectionId)
      if (!storedEmail) {
        showEmailModal.value = true
        isLoading.value = false
        return
      }
      // Validate stored email against allowed emails if restriction exists
      if (collection.value?.allowedDownloadEmails && Array.isArray(collection.value.allowedDownloadEmails) && collection.value.allowedDownloadEmails.length > 0) {
        const emailLower = storedEmail.toLowerCase()
        const isEmailAllowed = collection.value.allowedDownloadEmails.some(
          allowedEmail => allowedEmail && allowedEmail.toLowerCase() === emailLower
        )
        if (!isEmailAllowed) {
          localStorage.removeItem(`collection_email_${collectionId}`)
          userEmail.value = ''
          showEmailModal.value = true
          isLoading.value = false
          return
        }
      }
    }
    
    // Load media for the first/default set
    if (collection.value?.mediaSets && collection.value.mediaSets.length > 0) {
      await loadMediaForSet(collection.value.mediaSets[0].id)
    }
    
    isLoading.value = false
  } catch (err) {
    // API client throws plain error object: { message, code, status, errors }
    const errorStatus = err?.status || err?.response?.status
    
    if (errorStatus === 401) {
      // Password required or incorrect password
      const errorMessage = err?.message || err?.response?.data?.message || ''
      const errorCode = err?.code || err?.response?.data?.code || ''
      
      if (errorMessage.toLowerCase().includes('password required') || errorCode === 'PASSWORD_REQUIRED' || errorCode === 'GUEST_TOKEN_INVALID' || errorCode === 'GUEST_TOKEN_EXPIRED') {
        // Password is required or token is invalid - clear token and show password modal
        error.value = null // Clear any error
        hasPassword.value = true
        isPasswordVerified.value = false
        // Clear invalid/expired token
        if (guestToken.value) {
          const collectionId = route.query.collectionId
          localStorage.removeItem(`collection_guest_token_${collectionId}`)
          guestToken.value = null
        }
        isLoading.value = false
        // Return successfully - don't throw, so loadCollection doesn't catch it
        return
      } else {
        // Incorrect password - show error in password modal
        // Use exact backend error message
        const errorMessage = err?.message || err?.response?.data?.message || 'Incorrect password. Please try again.'
        error.value = null // Clear any error
        passwordError.value = errorMessage
        isPasswordVerified.value = false
        passwordInput.value = ''
        hasPassword.value = true
        isLoading.value = false
        // Return successfully - don't throw
        return
      }
    } else {
      // Re-throw non-401 errors so loadCollection can handle them
      throw err
    }
  }
}

const loadMediaForSet = async (setId) => {
  isLoadingMedia.value = true
  try {
    const collectionId = route.query.collectionId
    const headers = {}
    if (guestToken.value) {
      headers['Authorization'] = `Bearer ${guestToken.value}`
    }
    const response = await apiClient.get(`/v1/public/collections/${collectionId}/sets/${setId}/media`, { headers })
    const mediaData = response.data?.data || response.data
    media.value = Array.isArray(mediaData) ? mediaData : []
  } catch (err) {
    // Get exact error message from backend
    const errorMessage = err?.message || err?.response?.data?.message || 'Failed to load media'
    console.error('Failed to load media for set:', errorMessage, err)
    toast.error(errorMessage)
    media.value = []
  } finally {
    isLoadingMedia.value = false
  }
}

const handleTabChange = async ({ setId }) => {
  if (setId) {
    await loadMediaForSet(setId)
  }
}

const handleSubmitEmail = async () => {
  if (!isValidEmail.value || !emailInput.value) {
    emailError.value = 'Please enter a valid email address'
    return
  }

  isSubmittingEmail.value = true
  emailError.value = ''

  try {
    const collectionId = route.query.collectionId
    const email = emailInput.value.trim().toLowerCase()

    // Validate email against allowed emails if restriction exists
    if (collection.value?.allowedDownloadEmails && Array.isArray(collection.value.allowedDownloadEmails) && collection.value.allowedDownloadEmails.length > 0) {
      const isEmailAllowed = collection.value.allowedDownloadEmails.some(
        allowedEmail => allowedEmail && allowedEmail.toLowerCase() === email
      )
      if (!isEmailAllowed) {
        emailError.value = 'This email is not authorized to access this collection. Please contact the collection owner.'
        return
      }
    }

    // Store email
    storeEmail(collectionId, email)
    showEmailModal.value = false
    emailInput.value = ''

    // If password is required, show password modal instead of fetching collection
    if (hasPassword.value && !isPasswordVerified.value) {
      isLoading.value = false
      // Password modal will be shown automatically
      return
    }

    // Continue loading collection (only if no password required or already verified)
    await fetchCollection()
  } catch (err) {
    // API client throws plain error object: { message, code, status, errors }
    const errorMessage = err?.message || err?.response?.data?.message || 'Failed to submit email. Please try again.'
    emailError.value = errorMessage
  } finally {
    isSubmittingEmail.value = false
  }
}

const handleVerifyPassword = async () => {
  if (!passwordInput.value) return

  isVerifyingPassword.value = true
  passwordError.value = ''

  try {
    const collectionId = route.query.collectionId
    const response = await apiClient.post(`/v1/public/collections/${collectionId}/verify-password`, {
      password: passwordInput.value,
    })

    // API client extracts data.data or data, so response.data is the actual data object
    const verified = response.data?.verified ?? false
    const token = response.data?.token

    if (verified && token) {
      isPasswordVerified.value = true
      // Store guest token for 30 minutes
      const collectionId = route.query.collectionId
      storeGuestToken(collectionId, token)
      // After password is verified, fetch collection and check for email registration
      await fetchCollection()
      
      // Check if email registration is required after password is verified
      if (collection.value?.emailRegistration && !isAuthenticatedOwner.value && !isPreviewMode.value) {
        const storedEmail = getStoredEmail(collectionId)
        if (!storedEmail) {
          showEmailModal.value = true
          return
        }
        // Validate stored email against allowed emails if restriction exists
        if (collection.value?.allowedDownloadEmails && Array.isArray(collection.value.allowedDownloadEmails) && collection.value.allowedDownloadEmails.length > 0) {
          const emailLower = storedEmail.toLowerCase()
          const isEmailAllowed = collection.value.allowedDownloadEmails.some(
            allowedEmail => allowedEmail && allowedEmail.toLowerCase() === emailLower
          )
          if (!isEmailAllowed) {
            localStorage.removeItem(`collection_email_${collectionId}`)
            userEmail.value = ''
            showEmailModal.value = true
            return
          }
        }
      }
    } else {
      // Get exact error message from backend
      const errorMessage = response.data?.message || 'Incorrect password. Please try again.'
      passwordError.value = errorMessage
      passwordInput.value = ''
    }
  } catch (err) {
    // API client throws plain error object: { message, code, status, errors }
    // Use exact backend error message
    const errorMessage = err?.message || err?.response?.data?.message || 'Failed to verify password. Please try again.'
    passwordError.value = errorMessage
    passwordInput.value = ''
  } finally {
    isVerifyingPassword.value = false
  }
}

const handleVerifyDownloadPin = async () => {
  if (!downloadPinInput.value || downloadPinInput.value.length !== 4) return

  isVerifyingDownloadPin.value = true
  downloadPinError.value = ''

  try {
    const collectionId = route.query.collectionId
    const response = await apiClient.post(`/v1/public/collections/${collectionId}/verify-download-pin`, {
      pin: downloadPinInput.value,
    })

    // API client extracts data.data or data, so response.data is the actual data object
    const verified = response.data?.verified ?? false

    if (verified) {
      storeDownloadPin(collectionId, downloadPinInput.value)
      showDownloadPinModal.value = false
      downloadPinInput.value = ''
      toast.success('Download PIN verified')
      
      // Auto-trigger download if pending
      if (pendingDownloadItem.value) {
        const item = pendingDownloadItem.value
        pendingDownloadItem.value = null
        await handleDownloadMedia(item)
      }
    } else {
      // Get exact error message from backend
      const errorMessage = response.data?.message || 'Incorrect PIN. Please try again.'
      downloadPinError.value = errorMessage
      downloadPinInput.value = ''
    }
  } catch (err) {
    // API client throws plain error object: { message, code, status, errors }
    // Use exact backend error message
    const errorMessage = err?.message || err?.response?.data?.message || 'Failed to verify PIN. Please try again.'
    downloadPinError.value = errorMessage
    downloadPinInput.value = ''
  } finally {
    isVerifyingDownloadPin.value = false
  }
}

const handleDownloadMedia = async (item) => {
  if (!item || !collection.value) return

  // Check if download is enabled
  if (!collection.value.photoDownload) {
    toast.error('Downloads are disabled for this collection')
    return
  }

  // Check download restrictions
  if (collection.value.restrictToContacts && collection.value.allowedDownloadEmails && Array.isArray(collection.value.allowedDownloadEmails) && collection.value.allowedDownloadEmails.length > 0) {
    if (!userEmail.value) {
      toast.error('Email registration required for downloads')
      showEmailModal.value = true
      return
    }
    const emailLower = userEmail.value.toLowerCase()
    const isEmailAllowed = collection.value.allowedDownloadEmails.some(
      allowedEmail => allowedEmail && allowedEmail.toLowerCase() === emailLower
    )
    if (!isEmailAllowed) {
      toast.error('Your email is not authorized to download from this collection')
      return
    }
  }

  // Check downloadable sets restriction
  if (collection.value.downloadableSets && Array.isArray(collection.value.downloadableSets) && collection.value.downloadableSets.length > 0) {
    const currentSetId = item.setId || item.set_id
    if (!currentSetId || !collection.value.downloadableSets.includes(currentSetId)) {
      toast.error('This set is not available for download')
      return
    }
  }

  // Check download PIN
  if (collection.value.downloadPinEnabled && !isAuthenticatedOwner.value) {
    const collectionId = route.query.collectionId
    const storedPin = getStoredDownloadPin(collectionId)
    if (storedPin) {
      verifiedDownloadPin.value = storedPin
      isDownloadPinVerified.value = true
    } else if (!isDownloadPinVerified.value) {
      pendingDownloadItem.value = item
      showDownloadPinModal.value = true
      return
    }
  }

  // Proceed with download
  const mediaId = item.id || item.uuid
  downloadingMediaIds.value = new Set(downloadingMediaIds.value).add(mediaId)
  try {
    const collectionId = route.query.collectionId
    const endpoint = `/v1/public/collections/${collectionId}/media/${mediaId}/download`
    const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE_URL}${endpoint}`
    const headers = {}
    
    if (guestToken.value) {
      headers['Authorization'] = `Bearer ${guestToken.value}`
    }
    if (userEmail.value) {
      headers['X-Collection-Email'] = userEmail.value
    }
    if (isDownloadPinVerified.value && verifiedDownloadPin.value) {
      headers['X-Download-PIN'] = verifiedDownloadPin.value
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      let errorData = {}
      try {
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          errorData = await response.json()
        } else {
          const text = await response.text()
          errorData = { message: text || `Download failed with status ${response.status}` }
        }
      } catch {
        errorData = { message: `Download failed with status ${response.status}` }
      }
      throw {
        message: errorData.message || errorData.error || `Download failed with status ${response.status}`,
        code: errorData.code,
        status: response.status,
      }
    }

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = item.title || item.filename || 'media'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
        try {
          filename = decodeURIComponent(filename)
        } catch {
          // Keep original if decode fails
        }
      }
    }

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', filename)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    // Delay cleanup to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    }, 100)

    toast.success('Download started')
  } catch (err) {
    // Get exact error message from backend
    const errorMessage = err?.message || err?.response?.data?.message || 'Failed to download media'
    const errorCode = err?.code || err?.response?.data?.code
    
    if (errorCode === 'DOWNLOAD_PIN_REQUIRED') {
      const collectionId = route.query.collectionId
      localStorage.removeItem(`collection_download_pin_${collectionId}`)
      isDownloadPinVerified.value = false
      verifiedDownloadPin.value = ''
      showDownloadPinModal.value = true
      toast.error(errorMessage)
    } else if (err?.response?.status === 401 || err?.response?.status === 403) {
      toast.error(errorMessage)
    } else {
      toast.error(errorMessage)
    }
  } finally {
    const newSet = new Set(downloadingMediaIds.value)
    newSet.delete(mediaId)
    downloadingMediaIds.value = newSet
  }
}

// Watch for mediaId in URL to open lightbox
watch(
  () => [route.query.mediaId, media.value.length],
  ([mediaId, mediaLength]) => {
    if (mediaId && mediaLength > 0 && collectionPreviewRef.value) {
      // Wait for next tick to ensure component is ready
      nextTick(() => {
        collectionPreviewRef.value?.openMediaViewerById(mediaId)
      })
    }
  },
  { immediate: true }
)

onMounted(() => {
  const collectionId = route.query.collectionId
  if (collectionId) {
    getStoredEmail(collectionId)
    const storedPin = getStoredDownloadPin(collectionId)
    if (storedPin) {
      verifiedDownloadPin.value = storedPin
      isDownloadPinVerified.value = true
    }
  }
  loadCollection()
})
</script>

