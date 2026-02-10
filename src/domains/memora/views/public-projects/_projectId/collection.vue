<template>
  <div 
    class="min-h-screen bg-gray-50 dark:bg-gray-950 relative"
    :style="coverPhotoStyle"
  >
    <!-- Cover Photo Background Overlay -->
    <div
      v-if="coverPhotoUrl"
      class="fixed inset-0 z-0"
    >
      <!-- Cover Image -->
      <img
        v-if="!isVideoCover"
        :src="coverPhotoUrl"
        :alt="collection?.name || 'Collection Cover'"
        class="w-full h-full object-cover"
      />
      <!-- Cover Video -->
      <video
        v-else
        :src="coverPhotoUrl"
        autoplay
        loop
        muted
        playsinline
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/20"></div>
    </div>

    <!-- Preview Mode Banner -->
    <div
      v-if="isPreviewMode && isAuthenticatedOwner"
      class="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-2">
        <Eye class="h-4 w-4" />
        <span class="text-sm font-semibold">Preview Mode - You are viewing this collection as it will appear to visitors</span>
      </div>
    </div>
    
    <!-- Initial Loading State with Skeleton -->
    <div v-if="isLoading && !collection && !hasPassword && !showEmailModal && !showGuestClientModal && !showClientEmailModal && !showClientPasswordModal" class="min-h-screen">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <Skeleton v-for="i in 12" :key="i" class="aspect-square rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Guest/Client Choice Modal -->
    <Dialog v-if="showGuestClientModal && !isAuthenticatedOwner && !isPreviewMode" :open="true">
      <!-- Branding Logo Above Modal -->
      <div v-if="brandingLogoUrl || (showMazelootBranding && !brandingLogoUrl)" class="fixed left-1/2 -translate-x-1/2 z-[60]" style="top: calc(50% - 250px);">
        <img
          :src="brandingLogoUrl || mazelootLogo"
          :alt="brandingName || 'Mazeloot'"
          class="h-12 w-auto object-contain"
        />
      </div>
      <!-- Mazeloot Footer at Bottom -->
      <div v-if="showMazelootBranding" class="fixed bottom-0 left-0 right-0 z-[60] bg-black py-4 px-4">
        <p class="text-xs text-center text-white/80">
          © {{ new Date().getFullYear() }} Mazeloot. All rights reserved.
        </p>
      </div>
      <DialogContent class="sm:max-w-[420px] p-4 sm:p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl" :close-on-escape="false" :close-on-click-outside="false" :hideClose="true">
          <DialogHeader class="text-center space-y-1 mb-8">
            <DialogTitle class="text-2xl text-center font-serif tracking-wide text-gray-900 dark:text-gray-100">
              {{ collection?.name?.toUpperCase() || 'COLLECTION' }}
            </DialogTitle>
            <DialogDescription class="text-sm text-center font-sans text-gray-600 dark:text-gray-300">
              {{ brandingName || 'MAZELOOT' }}
            </DialogDescription>
          </DialogHeader>

        <p class="text-sm text-center mb-8 text-gray-600 dark:text-gray-300">
          Welcome. Choose one to continue:
        </p>

        <div class="space-y-3">
          <Button
            variant="outline"
            :class="[theme.borderSecondary, theme.textPrimary, 'w-full h-12 text-sm font-light border hover:bg-transparent']"
            @click="handleSelectGuest"
          >
            ENTER AS GUEST
          </Button>
          <Button
            variant="outline"
            :class="[theme.borderSecondary, theme.textPrimary, 'w-full h-12 text-sm font-light border hover:bg-transparent']"
            @click="handleSelectClient"
          >
            ENTER AS CLIENT
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Client Email Modal -->
    <Dialog v-if="showClientEmailModal && userMode === 'client' && requiresClientEmail && !isAuthenticatedOwner && !isPreviewMode" :open="true" @update:open="(val) => { if (!val) { showClientEmailModal = false; emailInput = ''; emailError = '' } }">
      <!-- Mazeloot Footer at Bottom -->
      <div v-if="showMazelootBranding" class="fixed bottom-0 left-0 right-0 z-[60] bg-black py-4 px-4">
        <p class="text-xs text-center text-white/80">
          © {{ new Date().getFullYear() }} Mazeloot. All rights reserved.
        </p>
      </div>
      <DialogContent :class="[theme.borderSecondary]" class="sm:max-w-[440px] bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl" :close-on-escape="false" :close-on-click-outside="false" :hideClose="true">
        <DialogHeader class="text-center pb-2">
          <DialogTitle class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Email Required
          </DialogTitle>
          <DialogDescription class="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Please enter your email address to continue as a client
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-5 mt-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold block text-gray-900 dark:text-gray-100"> Email Address </label>
            <Input
              v-model="emailInput"
              :class="[emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '']"
              class="w-full h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20"
              placeholder="your.email@example.com"
              type="email"
              @keydown.enter="handleSubmitClientEmail"
            />
            <p v-if="emailError" class="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle class="h-3 w-3" />
              {{ emailError }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your email will be used to access this collection.
            </p>
          </div>
        </div>

        <DialogFooter class="mt-8 flex gap-3">
          <Button
            variant="outline"
            :class="[theme.borderSecondary, theme.textPrimary]"
            class="flex-1"
            @click="handleBackToAccessControl"
          >
            <ChevronLeft class="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            :disabled="isSubmittingEmail || !emailInput || !isValidEmail"
            class="bg-accent hover:bg-accent/90 text-accent-foreground flex-1 shadow-md hover:shadow-lg transition-all"
            :loading="isSubmittingEmail"
            loading-label="Submitting..."
            @click="handleSubmitClientEmail"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Client Password Modal -->
    <Dialog v-if="showClientPasswordModal && userMode === 'client' && !isClientVerified && !isAuthenticatedOwner && !isPreviewMode" :open="true" @update:open="(val) => { if (!val) { showClientPasswordModal = false; clientPasswordInput = ''; clientPasswordError = '' } }">
      <!-- Mazeloot Footer at Bottom -->
      <div v-if="showMazelootBranding" class="fixed bottom-0 left-0 right-0 z-[60] bg-black py-4 px-4">
        <p class="text-xs text-center text-white/80">
          © {{ new Date().getFullYear() }} Mazeloot. All rights reserved.
        </p>
      </div>
      <DialogContent class="sm:max-w-[440px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl" :close-on-escape="false" :close-on-click-outside="false" :hideClose="true">
        <DialogHeader class="text-center pb-2">
          <DialogTitle class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Client Password Required
          </DialogTitle>
          <DialogDescription class="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Enter the client password to access exclusive content
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-5 mt-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold block text-gray-900 dark:text-gray-100"> Client Password </label>
            <PasswordInput
              v-model="clientPasswordInput"
              :input-class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                clientPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:ring-accent/20',
                'w-full h-11 transition-all',
              ]"
              :disabled="isVerifyingClientPassword"
              placeholder="Enter client password"
              @keydown.enter="handleVerifyClientPassword"
            />
            <p v-if="clientPasswordError" class="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle class="h-3 w-3" />
              {{ clientPasswordError }}
            </p>
          </div>
        </div>

        <DialogFooter class="mt-8 flex gap-3">
          <Button
            variant="outline"
            :class="[theme.borderSecondary, theme.textPrimary]"
            class="flex-1"
            @click="handleBackToAccessControl"
          >
            <ChevronLeft class="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            :disabled="isVerifyingClientPassword || !clientPasswordInput"
            class="bg-accent hover:bg-accent/90 text-accent-foreground flex-1 shadow-md hover:shadow-lg transition-all"
            :loading="isVerifyingClientPassword"
            loading-label="Verifying..."
            @click="handleVerifyClientPassword"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Email Registration Modal -->
    <Dialog v-if="showEmailModal && !isAuthenticatedOwner && !isPreviewMode && userMode !== 'client'" :open="true" :close-on-escape="!hasClientExclusiveAccess" :close-on-click-outside="!hasClientExclusiveAccess">
      <!-- Mazeloot Footer at Bottom -->
      <div v-if="showMazelootBranding" class="fixed bottom-0 left-0 right-0 z-[60] bg-black py-4 px-4">
        <p class="text-xs text-center text-white/80">
          © {{ new Date().getFullYear() }} Mazeloot. All rights reserved.
        </p>
      </div>
      <DialogContent class="sm:max-w-[440px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl" :hideClose="hasClientExclusiveAccess">
        <DialogHeader class="text-center pb-2">
          <DialogTitle class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Email Required
          </DialogTitle>
          <DialogDescription class="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Please enter your email address to access this collection
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-5 mt-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold block text-gray-900 dark:text-gray-100"> Email Address </label>
            <Input
              v-model="emailInput"
              :class="[emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '']"
              class="w-full h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20"
              placeholder="your.email@example.com"
              type="email"
              @keydown.enter="handleSubmitEmail"
            />
            <p v-if="emailError" class="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle class="h-3 w-3" />
              {{ emailError }}
            </p>
            <p class="text-xs mt-1 text-gray-500 dark:text-gray-400">
              Your email will be used to access this collection.
            </p>
          </div>
        </div>

        <DialogFooter class="mt-8 flex gap-3">
          <Button
            v-if="hasClientExclusiveAccess"
            variant="outline"
            :class="[theme.borderSecondary, theme.textPrimary]"
            class="flex-1"
            @click="handleBackToAccessControl"
          >
            <ChevronLeft class="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            :disabled="isSubmittingEmail || !emailInput || !isValidEmail"
            class="bg-accent hover:bg-accent/90 text-accent-foreground flex-1 shadow-md hover:shadow-lg transition-all"
            :loading="isSubmittingEmail"
            loading-label="Submitting..."
            @click="handleSubmitEmail"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Password Protection Modal (must come before error state, after email if required) -->
    <!-- Don't show password modal for clients - they use client password instead -->
    <Dialog v-if="hasPassword && !isPasswordVerified && !guestToken && !isAuthenticatedOwner && !showEmailModal && !isLoading && (!emailRegistrationRequired || userEmail) && userMode !== 'client'" :open="true" @update:open="(val) => { if (!val && hasPassword && !isPasswordVerified && !guestToken) { passwordInput = ''; passwordError = '' } }" :close-on-escape="!hasClientExclusiveAccess" :close-on-click-outside="!hasClientExclusiveAccess">
      <!-- Branding Logo Above Modal -->
      <div v-if="brandingLogoUrl || (showMazelootBranding && !brandingLogoUrl)" class="fixed left-1/2 -translate-x-1/2 z-[60]" style="top: calc(50% - 250px);">
        <img
          :src="brandingLogoUrl || mazelootLogo"
          :alt="brandingName || 'Mazeloot'"
          class="h-12 w-auto object-contain"
        />
      </div>
      <!-- Mazeloot Footer at Bottom -->
      <div v-if="showMazelootBranding" class="fixed bottom-0 left-0 right-0 z-[60] bg-black py-4 px-4">
        <p class="text-xs text-center text-white/80">
          © {{ new Date().getFullYear() }} Mazeloot. All rights reserved.
        </p>
      </div>
      <DialogContent class="sm:max-w-[440px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl" :hideClose="hasClientExclusiveAccess">
        <DialogHeader class="text-center pb-2">
          <DialogTitle class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Password Required
          </DialogTitle>
          <DialogDescription class="text-sm mt-2 text-gray-600 dark:text-gray-300">
            This collection is password protected. Please enter the password to continue.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-5 mt-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold block text-gray-900 dark:text-gray-100"> Password </label>
            <PasswordInput
              v-model="passwordInput"
              :input-class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:ring-accent/20',
                'w-full h-11 transition-all',
              ]"
              :disabled="isVerifyingPassword"
              placeholder="Enter password"
              @keydown.enter="handleVerifyPassword"
            />
            <p v-if="passwordError" class="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle class="h-3 w-3" />
              {{ passwordError }}
            </p>
          </div>
        </div>

        <DialogFooter class="mt-8 flex gap-3">
          <Button
            v-if="hasClientExclusiveAccess"
            variant="outline"
            :class="[theme.borderSecondary, theme.textPrimary]"
            class="flex-1"
            @click="handleBackToAccessControl"
          >
            <ChevronLeft class="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            :disabled="isVerifyingPassword || !passwordInput"
            class="bg-accent hover:bg-accent/90 text-accent-foreground flex-1 shadow-md hover:shadow-lg transition-all"
            :loading="isVerifyingPassword"
            loading-label="Verifying..."
            @click="handleVerifyPassword"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Error State -->
    <div v-else-if="error && !collection && !hasPassword && !showEmailModal" class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4">
      <div class="text-center max-w-md">
        <div class="mx-auto mb-6 w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertCircle class="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        <h2 :class="theme.textPrimary" class="text-2xl font-bold mb-3">{{ errorTitle }}</h2>
        <p :class="theme.textSecondary" class="text-sm leading-relaxed">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Collection Preview -->
    <div
      v-else-if="collection && (isPasswordVerified || guestToken || !hasPassword || isAuthenticatedOwner || (userMode === 'client' && isClientVerified)) && !showEmailModal && !showGuestClientModal && !showClientEmailModal && !showClientPasswordModal && !isLoading"
      class="relative"
    >
      <!-- Download PIN Modal -->
      <Dialog v-if="showDownloadPinModal && requiresDownloadPin && !isDownloadPinVerified && !isAuthenticatedOwner" :open="showDownloadPinModal" @update:open="(val) => { if (!val) { showDownloadPinModal = false; downloadPinInput = ''; downloadPinError = '' } }">
        <!-- Mazeloot Footer at Bottom -->
        <div v-if="showMazelootBranding" class="fixed bottom-0 left-0 right-0 z-[60] py-4">
          <p :class="theme.textSecondary" class="text-xs text-center">
            © {{ new Date().getFullYear() }} Mazeloot. All rights reserved.
          </p>
        </div>
        <DialogContent class="sm:max-w-[440px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <DialogHeader class="text-center pb-2">
            <DialogTitle class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Download PIN Required
            </DialogTitle>
            <DialogDescription class="text-sm mt-2 text-gray-600 dark:text-gray-300">
              Please enter the 4-digit download PIN to download media from this collection
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-5 mt-6">
            <div class="space-y-3">
              <PinInput
                v-model="downloadPinInput"
                :input-class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  downloadPinError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:ring-accent/20',
                ]"
                :disabled="isVerifyingDownloadPin"
                :length="4"
                @complete="handleVerifyDownloadPin"
              />
              <p v-if="downloadPinError" class="text-xs text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-1">
                <AlertCircle class="h-3 w-3" />
                {{ downloadPinError }}
              </p>
            </div>
          </div>

          <DialogFooter class="mt-8">
            <Button
              :disabled="isVerifyingDownloadPin || !downloadPinInput || downloadPinInput.length !== 4"
              class="bg-accent hover:bg-accent/90 text-accent-foreground w-full h-11 shadow-md hover:shadow-lg transition-all"
              :loading="isVerifyingDownloadPin"
              loading-label="Verifying..."
              @click="handleVerifyDownloadPin"
            >
              Verify PIN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Loading Overlay for Collection/Media -->
      <div
        v-if="isLoading || isLoadingMedia || isOpeningMediaLightbox"
        class="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-3">
          <Loader2 class="h-8 w-8 animate-spin text-accent" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ isOpeningMediaLightbox ? 'Opening media...' : isLoading ? 'Loading collection...' : 'Loading media...' }}
          </p>
        </div>
      </div>

      <CollectionPreview
        ref="collectionPreviewRef"
        preview-mode="public"
        :preview-collection="collection"
        :preview-media="media"
        :preview-branding="{ logoUrl: brandingLogoUrl, name: brandingName, showMazelootBranding: showMazelootBranding }"
        :preview-is-loading="isLoadingMedia"
        :downloading-media-ids="downloadingMediaIds"
        :is-client-verified="isClientVerified"
        :user-mode="userMode"
        :disable-actions="isPreviewMode"
        @tab-change="handleTabChange"
        @download="handleDownloadMedia"
        @logout="handleLogout"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useOpenGraphMeta } from '@/shared/composables/useOpenGraphMeta'
import { useDownloadProtection } from '@/shared/composables/useDownloadProtection'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, AlertCircle, ChevronLeft, Mail, Lock, Shield, User, Users, Eye } from '@/shared/utils/lucideAnimated'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/shadcn/dialog'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import PinInput from '@/shared/components/molecules/PinInput.vue'
import CollectionPreview from '@/domains/memora/views/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { apiClient } from '@/shared/api/client'
import { API_CONFIG } from '@/shared/api/config'
import { useUserStore } from '@/shared/stores/user'
import { toast } from '@/shared/utils/toast'
import { addDefaultSettings } from '@/domains/memora/api/collections'
import { useSettingsApi } from '@/domains/memora/api/settings'
import { clearCollectionGuestData } from '@/shared/utils/guestLogout'
import mazelootLogo from '@/shared/assets/images/logos/mazelootPrimaryLogo.svg'
import { getColorPalettes } from '@/shared/utils/colors'
import { useFocalPoint, getFocalPointFromEntity } from '@/shared/composables/useFocalPoint'

const { fetchSettings, fetchPublicSettings } = useSettingsApi()

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const userStore = useUserStore()

const collection = ref(null)
const media = ref([])
const brandingLogoUrl = ref(null)
const brandingName = ref(null)
const brandingBio = ref(null)
const showMazelootBranding = ref(true)
const collectionPreviewRef = ref(null)

const coverPhotoUrl = computed(() => {
  return collection.value?.coverPhotoUrl || 
         collection.value?.cover_photo_url || 
         collection.value?.image || 
         collection.value?.thumbnail ||
         (media.value && media.value.length > 0 ? media.value[0]?.url : null)
})

const isVideoCover = computed(() => {
  if (!coverPhotoUrl.value) return false
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
  return videoExtensions.some(ext => coverPhotoUrl.value.toLowerCase().includes(ext))
})

const focalPoint = computed(() => getFocalPointFromEntity(collection.value))
const { imageStyle: coverImageStyle, backgroundPosition } = useFocalPoint(focalPoint)

const coverPhotoStyle = computed(() => {
  if (!coverPhotoUrl.value || isVideoCover.value) return {}
  return {
    backgroundImage: `url(${coverPhotoUrl.value})`,
    backgroundSize: 'cover',
    backgroundPosition: backgroundPosition.value,
    backgroundRepeat: 'no-repeat',
  }
})
const isLoading = ref(true)
const isLoadingMedia = ref(false)
const isOpeningMediaLightbox = ref(false)
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
const userMode = ref(null) // 'guest' | 'client' | null
const showGuestClientModal = ref(false)
const isClientVerified = ref(false)
const clientToken = ref(null)
const showClientEmailModal = ref(false)
const showClientPasswordModal = ref(false)
const clientPasswordInput = ref('')
const isVerifyingClientPassword = ref(false)
const clientPasswordError = ref('')
const clientEmail = ref('')

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

const hasClientExclusiveAccess = computed(() => {
  return collection.value?.clientExclusiveAccess ?? false
})

const requiresClientEmail = computed(() => {
  return collection.value?.emailRegistration ?? false
})

// Get stored user mode from localStorage
const getStoredUserMode = (collectionId) => {
  const stored = localStorage.getItem(`collection_${collectionId}_user_mode`)
  if (stored) {
    try {
      const data = JSON.parse(stored)
      const expiresAt = data.expiresAt
      if (expiresAt && Date.now() < expiresAt) {
        return data.mode // 'guest' | 'client'
      } else {
        // Expired, remove it
        localStorage.removeItem(`collection_${collectionId}_user_mode`)
      }
    } catch (e) {
      // Invalid data, clear it
      localStorage.removeItem(`collection_${collectionId}_user_mode`)
    }
  }
  return null
}

// Store user mode in localStorage
const storeUserMode = (collectionId, mode) => {
  const expiresAt = Date.now() + 30 * 60 * 1000 // 30 minutes (same as client token)
  const data = {
    mode,
    expiresAt,
  }
  localStorage.setItem(`collection_${collectionId}_user_mode`, JSON.stringify(data))
  userMode.value = mode
}

// Get stored client verification from localStorage
const getStoredClientVerification = (collectionId) => {
  const stored = localStorage.getItem(`collection_${collectionId}_client_verified`)
  if (stored) {
    try {
      const data = JSON.parse(stored)
      const expiresAt = data.expiresAt
      if (expiresAt && Date.now() < expiresAt) {
        isClientVerified.value = true
        clientToken.value = data.token
        userMode.value = 'client'
        if (data.email) {
          clientEmail.value = data.email
        }
        return true
      } else {
        // Expired, clear it
        localStorage.removeItem(`collection_${collectionId}_client_verified`)
        localStorage.removeItem(`collection_${collectionId}_user_mode`)
      }
    } catch (e) {
      // Invalid data, clear it
      localStorage.removeItem(`collection_${collectionId}_client_verified`)
      localStorage.removeItem(`collection_${collectionId}_user_mode`)
    }
  }
  return false
}

// Store client verification in localStorage
const storeClientVerification = (collectionId, token, email = null) => {
  const expiresAt = Date.now() + 30 * 60 * 1000 // 30 minutes
  const data = {
    token,
    expiresAt,
    email: email || null,
  }
  localStorage.setItem(`collection_${collectionId}_client_verified`, JSON.stringify(data))
  isClientVerified.value = true
  clientToken.value = token
  userMode.value = 'client'
  if (email) {
    clientEmail.value = email
  }
}

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

// Fetch branding early
const fetchBranding = async (collectionId) => {
  if (!collectionId || brandingLogoUrl.value) return // Skip if already fetched
  
  try {
    const settingsResponse = await fetchPublicSettings({ collectionId })
    const settings = settingsResponse.data || settingsResponse
    brandingLogoUrl.value = settings.branding?.logoUrl || null
    brandingName.value = settings.branding?.name || null
    brandingBio.value = settings.biography || settings.bio || null
    showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true
  } catch (error) {
    console.warn('Failed to fetch public branding settings:', error)
  }
}

// OpenGraph meta tags
const ogTitle = computed(() => {
  return collection.value?.name && brandingName.value
    ? `${collection.value.name} - ${brandingName.value}`
    : brandingName.value || collection.value?.name || 'Collection'
})

const ogDescription = computed(() => {
  return brandingBio.value || collection.value?.description || 
    `View media in this collection${brandingName.value ? ` from ${brandingName.value}` : ''}`
})

const ogImage = computed(() => {
  return coverPhotoUrl.value || ''
})

useOpenGraphMeta({
  title: ogTitle,
  description: ogDescription,
  image: ogImage,
  isLoading,
})

// Load collection
// Loading guard to prevent duplicate requests
const isLoadingCollection = ref(false)

const loadCollection = async () => {
  const collectionId = route.query.collectionId
  
  if (!collectionId) {
    throw new Error('Collection ID is required in the URL')
  }

  // Prevent duplicate concurrent requests
  if (isLoadingCollection.value) {
    return
  }

  // If collection is already loaded with the same ID and we're not forcing a refresh, skip
  if (collection.value?.id === collectionId && !isLoading.value) {
    return
  }

  isLoadingCollection.value = true
  isLoading.value = true
  error.value = null

  try {

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
          // Fetch branding if not already fetched
          await fetchBranding(collectionId)

          // Normalize collection data structure
          collection.value = addDefaultSettings(collectionData)
          hasPassword.value = !!(collection.value.collectionPasswordEnabled)
          if (hasPassword.value) {
            isPasswordVerified.value = true
          }
          // Load media for the set from route or first set
          const setIdToLoad = getSetIdToLoad()
          if (setIdToLoad) {
            await loadMediaForSet(setIdToLoad)
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
      // Load media for the set from route or first set
      const setIdToLoad = getSetIdToLoad()
      if (setIdToLoad) {
        await loadMediaForSet(setIdToLoad)
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

    // If draft and owner, allow preview (use public API unless in preview mode)
    if (statusCheck.status === 'draft' && statusCheck.isOwner === true) {
      // Only use authenticated API if in preview mode
      if (isPreviewMode.value) {
        const response = await apiClient.get(`/v1/memora/collections/${collectionId}`)
        const collectionData = response.data?.data || response.data
        // Normalize collection data structure
        collection.value = addDefaultSettings(collectionData)
        hasPassword.value = collection.value.collectionPasswordEnabled || statusCheck.hasPassword || false
        if (hasPassword.value) {
          isPasswordVerified.value = true
        }
        // Load media for the set from route or first set
        const setIdToLoad = getSetIdToLoad()
        if (setIdToLoad) {
          await loadMediaForSet(setIdToLoad)
        }
        isLoading.value = false
        return
      } else {
        // For draft collections accessed normally (not preview), use public API
        const response = await apiClient.get(`/v1/public/collections/${collectionId}`)
        const collectionData = response.data?.data || response.data
        collection.value = addDefaultSettings(collectionData)
        hasPassword.value = collection.value.collectionPasswordEnabled || statusCheck.hasPassword || false
        if (hasPassword.value) {
          isPasswordVerified.value = true
        }
        const setIdToLoad = getSetIdToLoad()
        if (setIdToLoad) {
          await loadMediaForSet(setIdToLoad)
        }
        isLoading.value = false
        return
      }
    }

    // Load collection from public API
    hasPassword.value = statusCheck.hasPassword || false
    emailRegistrationRequired.value = statusCheck.emailRegistration || false

    // Check for stored user mode and client verification
    const storedUserMode = getStoredUserMode(collectionId)
    const hasStoredClientVerification = getStoredClientVerification(collectionId)
    const storedGuestToken = getStoredGuestToken(collectionId)
    
    // If we have a stored user mode, use it
    if (storedUserMode && !userMode.value) {
      userMode.value = storedUserMode
    } else if (storedGuestToken && !userMode.value && !hasStoredClientVerification) {
      // If we have a guest token but no stored mode, assume guest mode
      userMode.value = 'guest'
    }
    
    // Fetch collection to check for clientExclusiveAccess
    // If in preview mode and authenticated owner, use authenticated API
    try {
      let tempResponse
      if (statusCheck.isOwner === true && userStore.isAuthenticated && isPreviewMode.value) {
        tempResponse = await apiClient.get(`/v1/memora/collections/${collectionId}`)
      } else {
        tempResponse = await apiClient.get(`/v1/public/collections/${collectionId}`)
      }
      const tempCollectionData = tempResponse.data?.data || tempResponse.data
      const tempCollection = addDefaultSettings(tempCollectionData)
      
      // Set collection early so computed properties can access it
      collection.value = tempCollection
      
      // Check if client exclusive access is enabled
      // Only show guest/client modal if there's no password (password modal takes priority)
      if (tempCollection.clientExclusiveAccess && !isAuthenticatedOwner.value && !isPreviewMode.value && !hasPassword.value) {
        // If user hasn't selected a mode yet and no stored mode, show guest/client modal
        if (!userMode.value && !storedUserMode && !hasStoredClientVerification) {
          error.value = null
          isLoading.value = false
          showGuestClientModal.value = true
          return
        }
        
        // If user selected client but not verified, show client password modal
        if (userMode.value === 'client' && !isClientVerified.value) {
          if (requiresClientEmail.value && !clientEmail.value) {
            showClientEmailModal.value = true
          } else {
            showClientPasswordModal.value = true
          }
          error.value = null
          isLoading.value = false
          return
        }
      }
    } catch (tempErr) {
      // Continue with normal flow if this fails
      console.warn('Failed to check client exclusive access:', tempErr)
    }

    // If we have a guest token and password is required, try to fetch collection with token
    if (hasPassword.value && guestToken.value && !isAuthenticatedOwner.value && !isPreviewMode.value) {
      try {
        await fetchCollection()
        // fetchCollection() will handle showing the access modal if client exclusive access is enabled
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
    // Don't require collection password for clients - they use client password instead
    if (hasPassword.value && !guestToken.value && !isAuthenticatedOwner.value && !isPreviewMode.value && userMode.value !== 'client') {
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
      const currentCollectionId = collection.value?.id
      if (!currentCollectionId || currentCollectionId !== collectionId) {
        await fetchCollection()
      }
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
    
    // If in preview mode and authenticated owner, use authenticated API
    if (isPreviewMode.value && isAuthenticatedOwner.value) {
      const response = await apiClient.get(`/v1/memora/collections/${collectionId}`)
      const collectionData = response.data?.data || response.data
      collection.value = addDefaultSettings(collectionData)
      
      // Fetch branding if not already fetched
      await fetchBranding(collectionId)
      
      // Load media for the set from route or first set
      const setIdToLoad = getSetIdToLoad()
      if (setIdToLoad) {
        await loadMediaForSet(setIdToLoad)
      }
      
      isLoading.value = false
      return
    }
    
    // For public access, use public API
    const headers = {}

    // Use guest token if available, otherwise use password header
    if (guestToken.value) {
      headers['Authorization'] = `Bearer ${guestToken.value}`
    } else if (isPasswordVerified.value && passwordInput.value) {
      headers['X-Collection-Password'] = passwordInput.value
    }
    
    // Include client token if verified
    if (clientToken.value) {
      headers['X-Guest-Token'] = clientToken.value
      headers['Authorization'] = `Bearer ${clientToken.value}`
    }
    
    // Include client email if available
    if (clientEmail.value) {
      headers['X-Collection-Email'] = clientEmail.value
    }

    // Fetch branding if not already fetched
    await fetchBranding(collectionId)

    const response = await apiClient.get(`/v1/public/collections/${collectionId}`, { headers })
    const collectionData = response.data?.data || response.data
    // Normalize collection data structure
    collection.value = addDefaultSettings(collectionData)
    
    // Update hasPassword from collection data
    if (collection.value?.collectionPasswordEnabled !== undefined) {
      hasPassword.value = collection.value.collectionPasswordEnabled
    }

    // Check if client exclusive access is enabled - this takes priority over email registration
    if (collection.value?.clientExclusiveAccess && !isAuthenticatedOwner.value && !isPreviewMode.value) {
      const storedUserMode = getStoredUserMode(collectionId)
      const hasStoredClientVerification = getStoredClientVerification(collectionId)
      
      // If user hasn't explicitly selected a mode (no storedUserMode) and not verified as client, show access modal
      // This allows choosing access mode even when guest token exists (userMode may be auto-set to 'guest')
      if (!storedUserMode && !hasStoredClientVerification) {
        showGuestClientModal.value = true
        isLoading.value = false
        return
      }
      
      // If user selected client but not verified, show client password modal
      if (userMode.value === 'client' && !isClientVerified.value) {
        if (requiresClientEmail.value && !clientEmail.value) {
          showClientEmailModal.value = true
        } else {
          showClientPasswordModal.value = true
        }
        isLoading.value = false
        return
      }
    }

    // Check if email registration is required (skip for clients - they already provided email)
    // Also skip if client exclusive access is enabled and user hasn't selected a mode (access modal takes priority)
    const hasStoredUserMode = getStoredUserMode(collectionId)
    const hasStoredClientVerification = getStoredClientVerification(collectionId)
    const shouldSkipEmailForClientAccess = collection.value?.clientExclusiveAccess && !hasStoredUserMode && !hasStoredClientVerification
    
    if (collection.value?.emailRegistration && !isAuthenticatedOwner.value && !isPreviewMode.value && userMode.value !== 'client' && !shouldSkipEmailForClientAccess) {
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
      
      // Track email registration to update last access (updated_at)
      if (collectionId && storedEmail) {
        try {
          const { useCollectionsApi } = await import('@/domains/memora/api/collections')
          const { trackEmailRegistration } = useCollectionsApi()
          await trackEmailRegistration(collectionId, storedEmail, null)
        } catch (err) {
          // Don't fail if tracking fails
          console.warn('Failed to track email registration:', err)
        }
      }
    }
    
    // Track email registration for client mode
    if (collection.value?.emailRegistration && !isAuthenticatedOwner.value && !isPreviewMode.value && userMode.value === 'client' && clientEmail.value) {
      try {
        const { useCollectionsApi } = await import('@/domains/memora/api/collections')
        const { trackEmailRegistration } = useCollectionsApi()
        await trackEmailRegistration(collectionId, clientEmail.value, null)
      } catch (err) {
        // Don't fail if tracking fails
        console.warn('Failed to track email registration:', err)
      }
    }
    
    // Load media for the set from route or first set
    const setIdToLoad = getSetIdToLoad()
    if (setIdToLoad) {
      await loadMediaForSet(setIdToLoad)
    }
    
    isLoading.value = false
  } catch (err) {
    // API client throws plain error object: { message, code, status, errors }
    const errorStatus = err?.status || err?.response?.status
    
    if (errorStatus === 401) {
      // Password required or incorrect password
      // Don't show password modal for clients - they use client password instead
      if (userMode.value === 'client') {
        // For clients, if we get 401, it might be client verification issue
        // Don't show collection password modal
        throw err
      }
      
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

const getSetIdToLoad = () => {
  const setIdFromRoute = route.query.setId
  if (setIdFromRoute && collection.value?.mediaSets) {
    const matchingSet = collection.value.mediaSets.find(s => String(s.id) === String(setIdFromRoute))
    if (matchingSet) {
      return matchingSet.id
    }
  }
  // Fallback to first set
  if (collection.value?.mediaSets && collection.value.mediaSets.length > 0) {
    return collection.value.mediaSets[0].id
  }
  return null
}

const loadMediaForSet = async (setId) => {
  isLoadingMedia.value = true
  try {
    const collectionId = route.query.collectionId
    
    // If in preview mode and authenticated owner, use authenticated API
    if (isPreviewMode.value && isAuthenticatedOwner.value) {
      const response = await apiClient.get(`/v1/memora/collections/${collectionId}/sets/${setId}/media`)
      const mediaData = response.data?.data || response.data
      media.value = Array.isArray(mediaData) ? mediaData : []
      return
    }
    
    // For public access, use public API
    const headers = {}
    if (guestToken.value) {
      headers['Authorization'] = `Bearer ${guestToken.value}`
    }
    // Include client token if verified
    if (clientToken.value) {
      headers['X-Guest-Token'] = clientToken.value
      headers['Authorization'] = `Bearer ${clientToken.value}`
    }
    // Include email if available (client or guest)
    if (clientEmail.value) {
      headers['X-Collection-Email'] = clientEmail.value
    } else if (userEmail.value) {
      headers['X-Collection-Email'] = userEmail.value
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

const handleTabChange = async ({ setId, tab }) => {
  if (setId) {
    router.replace({
      query: {
        ...route.query,
        setId: setId,
        set: tab || undefined,
      },
    })
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

    // Track email registration first (before storing, so it happens even if other operations fail)
    if (collectionId) {
      try {
        const { useCollectionsApi } = await import('@/domains/memora/api/collections')
        const { trackEmailRegistration } = useCollectionsApi()
        await trackEmailRegistration(collectionId, email, null)
      } catch (err) {
        // Don't fail if tracking fails
        console.warn('Failed to track email registration:', err)
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
      const currentCollectionId = collection.value?.id
      if (!currentCollectionId || currentCollectionId !== collectionId) {
        await fetchCollection()
      }
      
      // Check if client exclusive access is enabled (after password verification)
      if (collection.value?.clientExclusiveAccess && !isAuthenticatedOwner.value && !isPreviewMode.value) {
        const storedUserMode = getStoredUserMode(collectionId)
        const hasStoredClientVerification = getStoredClientVerification(collectionId)
        
        // If user hasn't selected a mode yet and no stored mode, show guest/client modal
        if (!userMode.value && !storedUserMode && !hasStoredClientVerification) {
          showGuestClientModal.value = true
          return
        }
        
        // If user selected client but not verified, show client password modal
        if (userMode.value === 'client' && !isClientVerified.value) {
          if (requiresClientEmail.value && !clientEmail.value) {
            showClientEmailModal.value = true
          } else {
            showClientPasswordModal.value = true
          }
          return
        }
      }
      
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

const handleBackToAccessControl = () => {
  const collectionId = route.query.collectionId
  
  // Clear all modal states
  showClientEmailModal.value = false
  showClientPasswordModal.value = false
  showEmailModal.value = false
  
  // Clear input fields
  emailInput.value = ''
  emailError.value = ''
  clientPasswordInput.value = ''
  clientPasswordError.value = ''
  passwordInput.value = ''
  passwordError.value = ''
  clientEmail.value = ''
  
  // Clear user mode from localStorage
  if (collectionId) {
    localStorage.removeItem(`collection_${collectionId}_user_mode`)
  }
  
  // Reset user mode
  userMode.value = null
  
  // Show guest/client selection modal again
  if (hasClientExclusiveAccess.value) {
    showGuestClientModal.value = true
  }
}

const handleSelectGuest = () => {
  const collectionId = route.query.collectionId
  storeUserMode(collectionId, 'guest')
  showGuestClientModal.value = false
  isLoading.value = true
  // Continue with normal flow - no client password needed
  fetchCollection()
}

const handleSelectClient = () => {
  const collectionId = route.query.collectionId
  storeUserMode(collectionId, 'client')
  showGuestClientModal.value = false
  
  // If email registration is required, show email modal first
  if (requiresClientEmail.value) {
    showClientEmailModal.value = true
  } else {
    // Otherwise, go straight to client password
    showClientPasswordModal.value = true
  }
}

const handleSubmitClientEmail = async () => {
  if (!isValidEmail.value || !emailInput.value) {
    emailError.value = 'Please enter a valid email address'
    return
  }

  isSubmittingEmail.value = true
  emailError.value = ''

  try {
    const collectionId = route.query.collectionId
    const email = emailInput.value.trim().toLowerCase()
    clientEmail.value = email
    
    // Track email registration (will update updated_at if exists)
    if (collectionId) {
      try {
        const { useCollectionsApi } = await import('@/domains/memora/api/collections')
        const { trackEmailRegistration } = useCollectionsApi()
        await trackEmailRegistration(collectionId, email, null)
      } catch (err) {
        // Don't fail if tracking fails
        console.warn('Failed to track email registration:', err)
      }
    }
    
    showClientEmailModal.value = false
    emailInput.value = ''
    
    // Now show client password modal
    showClientPasswordModal.value = true
  } catch (err) {
    const errorMessage = err?.message || err?.response?.data?.message || 'Failed to submit email. Please try again.'
    emailError.value = errorMessage
  } finally {
    isSubmittingEmail.value = false
  }
}

const handleVerifyClientPassword = async () => {
  if (!clientPasswordInput.value) return

  isVerifyingClientPassword.value = true
  clientPasswordError.value = ''

  try {
    const collectionId = route.query.collectionId
    const payload = {
      password: clientPasswordInput.value,
    }
    
    // Include email if provided
    if (clientEmail.value) {
      payload.email = clientEmail.value
    }

    const response = await apiClient.post(`/v1/public/collections/${collectionId}/verify-client-password`, payload)

    const verified = response.data?.verified ?? false
    const token = response.data?.token

    if (verified && token) {
      // Store client verification
      storeClientVerification(collectionId, token, clientEmail.value)
      isClientVerified.value = true
      clientToken.value = token
      showClientPasswordModal.value = false
      showClientEmailModal.value = false
      showGuestClientModal.value = false
      clientPasswordInput.value = ''
      
      // Show loading state
      isLoading.value = true
      
      try {
        // Fetch collection with client verification
        await fetchCollection()
        
        // Load media for the set from route or first set
        const setIdToLoad = getSetIdToLoad()
        if (setIdToLoad) {
          await loadMediaForSet(setIdToLoad)
        }
      } catch (fetchErr) {
        console.error('Failed to fetch collection after client verification:', fetchErr)
        const errorMessage = fetchErr?.message || fetchErr?.response?.data?.message || 'Failed to load collection'
        error.value = errorMessage
      } finally {
        isLoading.value = false
      }
    } else {
      const errorMessage = response.data?.message || 'Incorrect client password. Please try again.'
      clientPasswordError.value = errorMessage
      clientPasswordInput.value = ''
    }
  } catch (err) {
    const errorMessage = err?.message || err?.response?.data?.message || 'Failed to verify client password. Please try again.'
    clientPasswordError.value = errorMessage
    clientPasswordInput.value = ''
  } finally {
    isVerifyingClientPassword.value = false
  }
}

const handleDownloadMedia = async (item) => {
  if (!item || !collection.value) return

  // Disable downloads in preview mode
  if (isPreviewMode.value) {
    toast.info('Downloads are disabled in preview mode')
    return
  }

  // Check if media download is enabled
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
    
    // If in preview mode and authenticated owner, use authenticated API (but downloads are disabled in preview)
    let endpoint
    if (isPreviewMode.value && isAuthenticatedOwner.value) {
      endpoint = `/v1/memora/collections/${collectionId}/media/${mediaId}/download`
    } else {
      endpoint = `/v1/public/collections/${collectionId}/media/${mediaId}/download`
    }
    
    const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE_URL}${endpoint}`
    const headers = {}
    
    // Only add guest/client tokens for public API
    if (!(isPreviewMode.value && isAuthenticatedOwner.value)) {
      if (guestToken.value) {
        headers['Authorization'] = `Bearer ${guestToken.value}`
      }
      if (userEmail.value) {
        headers['X-Collection-Email'] = userEmail.value
      }
      if (isDownloadPinVerified.value && verifiedDownloadPin.value) {
        headers['X-Download-PIN'] = verifiedDownloadPin.value
      }
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

const handleLogout = () => {
  const collectionId = route.query.collectionId
  if (collectionId) {
    clearCollectionGuestData(collectionId)
  }
  
  // Reset all state
  guestToken.value = null
  isPasswordVerified.value = false
  passwordInput.value = ''
  userEmail.value = ''
  emailInput.value = ''
  isClientVerified.value = false
  clientToken.value = null
  clientEmail.value = ''
  clientPasswordInput.value = ''
  userMode.value = null
  isDownloadPinVerified.value = false
  verifiedDownloadPin.value = ''
  downloadPinInput.value = ''
  collection.value = null
  media.value = []
  
  toast.success('Logged out successfully')
  
  // Reload the page to reset everything
  window.location.reload()
}

// Watch for mediaId in URL to open lightbox
let mediaIdCheckInterval = null
const openMediaViewerForMediaId = (mediaId) => {
  if (!mediaId || !collectionPreviewRef.value) return false
  
  try {
    collectionPreviewRef.value.openMediaViewerById(mediaId)
    // Clear loading state after lightbox should have opened
    setTimeout(() => {
      isOpeningMediaLightbox.value = false
    }, 800)
    return true
  } catch (error) {
    console.warn('Failed to open media viewer:', error)
    isOpeningMediaLightbox.value = false
    return false
  }
}

watch(
  () => [route.query.mediaId, media.value.length, collection.value, isLoading.value, isLoadingMedia.value],
  ([mediaId, mediaLength, collectionData, isLoadingState, isLoadingMediaState]) => {
    // Clear any existing interval
    if (mediaIdCheckInterval) {
      clearInterval(mediaIdCheckInterval)
      mediaIdCheckInterval = null
    }
    
    if (mediaId && collectionData && !isLoadingState && !isLoadingMediaState) {
      // Set loading state when mediaId is present
      isOpeningMediaLightbox.value = true
      
      // Wait for media to be loaded and CollectionPreview to be ready
      if (mediaLength > 0 && collectionPreviewRef.value) {
        // Wait a bit more to ensure CollectionPreview has processed the media
        setTimeout(() => {
          if (!openMediaViewerForMediaId(mediaId)) {
            // If first attempt failed, retry once more
            setTimeout(() => {
              openMediaViewerForMediaId(mediaId)
            }, 500)
          }
        }, 500)
      } else {
        // If media not loaded yet, wait a bit longer and retry
        mediaIdCheckInterval = setInterval(() => {
          if (media.value.length > 0 && collectionPreviewRef.value && !isLoading.value && !isLoadingMedia.value) {
            clearInterval(mediaIdCheckInterval)
            mediaIdCheckInterval = null
            setTimeout(() => {
              if (!openMediaViewerForMediaId(mediaId)) {
                // If first attempt failed, retry once more
                setTimeout(() => {
                  openMediaViewerForMediaId(mediaId)
                }, 500)
              }
            }, 500)
          }
        }, 300)
        
        // Stop checking after 10 seconds
        setTimeout(() => {
          if (mediaIdCheckInterval) {
            clearInterval(mediaIdCheckInterval)
            mediaIdCheckInterval = null
          }
          isOpeningMediaLightbox.value = false
        }, 10000)
      }
    } else if (!mediaId) {
      // Clear loading state when mediaId is removed
      isOpeningMediaLightbox.value = false
    }
  },
  { immediate: true }
)


// Initialize download protection
const { cleanup: cleanupProtection } = useDownloadProtection({
  enabled: true,
  showWarnings: false,
})

// Cleanup interval on unmount
onUnmounted(() => {
  cleanupProtection()
  if (mediaIdCheckInterval) {
    clearInterval(mediaIdCheckInterval)
    mediaIdCheckInterval = null
  }
})

onMounted(async () => {
  const collectionId = route.query.collectionId
  if (collectionId) {
    getStoredEmail(collectionId)
    const storedPin = getStoredDownloadPin(collectionId)
    if (storedPin) {
      verifiedDownloadPin.value = storedPin
      isDownloadPinVerified.value = true
    }
    // Fetch branding early so it's available for modals
    await fetchBranding(collectionId)
  }
  loadCollection()
})
</script>

