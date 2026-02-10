<template>
  <div :class="[theme.bgPage, 'min-h-screen relative overflow-hidden']" :style="coverPhotoStyle">
    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50 dark:from-black/70 dark:via-black/60 dark:to-black/70 light:from-white/60 light:from-white/40 light:to-white/60 backdrop-blur-md z-0"></div>
    
    <!-- Content -->
    <div class="relative z-10">
    <!-- Header with Branding -->
    <header :class="[theme.borderSecondary, 'sticky top-0 z-40 backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/80 border-b']">
      <div class="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <div class="flex items-center gap-3">
          <button
            v-if="!zipFile"
            @click="handleBack"
            :disabled="isNavigatingBack"
            :class="[theme.bgButtonHover, 'p-2 rounded-lg transition-all duration-200 flex-shrink-0 group disabled:opacity-50 disabled:cursor-not-allowed']"
            title="Go back"
          >
            <Loader2 v-if="isNavigatingBack" :class="[theme.textSecondary, 'h-5 w-5 animate-spin']" />
            <ChevronLeft v-else :class="[theme.textSecondary, 'h-5 w-5 group-hover:text-white dark:group-hover:text-gray-50 light:group-hover:text-gray-900 transition-colors']" />
          </button>
          <img
            v-if="brandingLogoUrl"
            :src="brandingLogoUrl"
            :alt="brandFileName || 'Brand'"
            class="h-8 w-auto object-contain"
          />
          <MazelootLogo
            v-else-if="showMazelootBranding"
            size="sm"
            :color-class="theme.textPrimary"
          />
        </div>
        <div class="flex items-center gap-4">
          <div :class="[theme.textSecondary, 'text-sm']">
            {{ brandFileName || 'Mazeloot' }}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Initial Loading State -->
    <div v-if="isInitialLoading && !isLoadingState" class="min-h-[calc(100vh-200px)] flex items-center justify-center py-20 animate-fade-in">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <!-- Left Section: Skeleton -->
          <div class="flex flex-col justify-center space-y-6 animate-slide-up">
            <div class="space-y-4">
              <div :class="[theme.bgSkeleton, 'h-16 rounded-lg animate-pulse']"></div>
              <div :class="[theme.bgSkeleton, 'h-6 w-48 rounded-lg animate-pulse']"></div>
            </div>
          </div>
          <!-- Right Section: Skeleton -->
          <div class="space-y-6 animate-slide-up animation-delay-100">
            <div :class="['backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4']">
              <div :class="[theme.bgSkeleton, 'h-6 w-32 rounded animate-pulse']"></div>
              <div class="space-y-3">
                <div v-for="i in 3" :key="i" :class="[theme.bgSkeleton, 'h-16 rounded-xl animate-pulse']"></div>
              </div>
            </div>
            <div :class="[theme.bgSkeleton, 'h-14 rounded-xl animate-pulse']"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Processing Loading State -->
    <div v-else-if="isLoadingState" class="min-h-[calc(100vh-200px)] flex items-center justify-center py-20 animate-fade-in">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <!-- Left Section: Raw File Info -->
          <div class="flex flex-col justify-center space-y-6 animate-slide-up">
            <div>
              <h1 :class="[theme.textPrimary, 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 leading-tight tracking-tight drop-shadow-lg']">
                {{ rawFileName }}
              </h1>
              <p :class="[theme.textSecondary, 'text-base sm:text-lg md:text-xl font-medium drop-shadow-md']">{{ brandFileName }}</p>
            </div>
          </div>

          <!-- Right Section: Loading -->
          <div class="backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 flex flex-col items-center justify-center space-y-6 sm:space-y-8 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 animate-slide-up animation-delay-100">
            <div class="relative w-20 h-20">
              <div :class="[theme.borderSecondary, 'absolute inset-0 border-4 rounded-full opacity-30']"></div>
              <div class="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div class="text-center space-y-3">
              <h2 :class="[theme.textPrimary, 'text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight']">
                WE ARE PREPARING YOUR MEDIA
              </h2>
              <p :class="[theme.textSecondary, 'text-base']">
                Your download will be ready shortly.
              </p>
            </div>

            <!-- Download Summary -->
            <div :class="[theme.borderSecondary, 'w-full border-t pt-6 mt-4']">
              <h3 :class="[theme.textPrimary, 'text-lg font-semibold mb-4 text-center']">Download Summary</h3>
              <div class="space-y-3">
                <!-- Selected Sets -->
                <div :class="[theme.bgInput, 'rounded-lg p-4']">
                  <div :class="[theme.textPrimary, 'text-sm font-medium mb-2']">Selected Sets:</div>
                  <div class="space-y-1">
                    <div
                      v-for="setId in selectedSets"
                      :key="setId"
                      class="flex items-center justify-between text-sm"
                    >
                      <span :class="[theme.textSecondary]">
                        {{ mediaSets.find(s => (s.id || s.uuid) === setId)?.name || 'Unknown Set' }}
                      </span>
                      <span :class="[theme.textTertiary]">
                        {{ mediaSets.find(s => (s.id || s.uuid) === setId)?.count || 0 }} {{ mediaSets.find(s => (s.id || s.uuid) === setId)?.count === 1 ? 'media' : 'medias' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success State with ZIP Download -->
    <div v-else-if="zipFile" class="min-h-[calc(100vh-200px)] flex items-center justify-center py-20">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <!-- Left Section: Raw File Info -->
          <div class="flex flex-col justify-center space-y-6">
            <div>
              <h1 :class="[theme.textPrimary, 'text-6xl lg:text-7xl font-bold mb-3 leading-tight tracking-tight']">
                {{ rawFileName }}
              </h1>
              <p :class="[theme.textSecondary, 'text-xl font-medium']">{{ brandFileName }}</p>
            </div>
          </div>

          <!-- Right Section: Download Ready -->
          <div class="relative">
            <!-- Success Badge -->
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div class="relative">
                <div class="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div class="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center shadow-2xl transform transition-transform hover:scale-110 border-4" :class="theme.bgCard">
                  <Check class="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <div class="backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 flex flex-col items-center justify-center space-y-6 rounded-3xl shadow-2xl p-10 pt-16 animate-slide-up animation-delay-200">
              <!-- Success Message -->
              <div class="text-center space-y-3 mt-4">
                <h2 :class="[theme.textPrimary, 'text-3xl lg:text-4xl font-bold tracking-tight']">YOUR MEDIA ARE READY!</h2>
                <p :class="[theme.textSecondary, 'text-lg']">Download your media in a single ZIP file</p>
              </div>

              <!-- Download Card -->
              <div class="w-full space-y-4">
                <button
                  @click="handleZipDownload"
                  :disabled="isDownloadingZip"
                  class="group relative w-full p-4 sm:p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col gap-4 cursor-pointer overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <!-- Animated Background Effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div class="relative flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                        <Loader2 v-if="isDownloadingZip" class="w-6 h-6 text-white animate-spin" />
                        <Download v-else class="w-6 h-6 text-white" />
                      </div>
                      <div class="flex flex-col">
                        <span class="text-white font-bold text-lg">{{ zipFile.filename }}</span>
                        <span :class="[theme.textSecondary, 'text-sm font-medium opacity-90']">{{ zipFile.size }}</span>
                      </div>
                    </div>
                    <div class="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <Loader2 v-if="isDownloadingZip" class="w-5 h-5 text-white animate-spin" />
                      <Download v-else class="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div class="relative pt-2 border-t border-white/20">
                    <span class="text-white/90 text-sm font-medium">
                      {{ isDownloadingZip ? 'Downloading...' : 'Click to download your media' }}
                    </span>
                  </div>
                </button>
              </div>

              <!-- Action Buttons -->
              <div :class="[theme.borderSecondary, 'w-full pt-4 border-t']">
                <button
                  @click="handleBackToRawFile"
                  :disabled="isNavigating"
                  :class="[theme.textPrimary, theme.bgButtonHover, 'w-full flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed']"
                >
                  <Loader2 v-if="isNavigating" class="w-4 h-4 animate-spin" />
                  <ArrowLeft v-else class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>{{ isNavigating ? 'Loading...' : 'Back to Raw File' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selection State -->
    <div v-else-if="!isInitialLoading && !isLoadingState && !zipFile" class="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20 max-w-6xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <!-- Left Section: Raw File Info -->
        <div class="flex flex-col justify-center space-y-6 sticky top-24 animate-slide-up">
          <div>
            <h1 :class="[theme.textPrimary, 'text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight tracking-tight drop-shadow-lg']">
              {{ rawFileName }}
            </h1>
            <p :class="[theme.textSecondary, 'text-xl font-medium drop-shadow-md']">{{ brandFileName }}</p>
          </div>
        </div>

        <!-- Right Section: Download Options -->
        <div class="space-y-6 animate-slide-up animation-delay-100">
          <!-- Choose Media Sets -->
          <div class="backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
            <h2 :class="[theme.textPrimary, 'text-xl font-bold mb-5']">Choose Sets</h2>
            <div class="space-y-3">
              <div
                v-for="(set, index) in mediaSets"
                :key="set.id || set.uuid"
                class="flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
                :style="{ animationDelay: `${index * 50}ms` }"
                :class="selectedSets.includes(set.id || set.uuid)
                  ? 'border-accent bg-accent/20 dark:bg-accent/10 shadow-md ring-2 ring-accent/30'
                  : 'border-white/20 dark:border-white/10 light:border-gray-200/50 bg-white/5 dark:bg-black/10 light:bg-white/40 hover:bg-white/10 dark:hover:bg-black/20 light:hover:bg-white/60 hover:shadow-lg'"
              >
                <div class="flex items-center gap-4 flex-1">
                  <span :class="[theme.textPrimary, 'font-semibold text-base']">{{ set.name }}</span>
                  <span :class="[theme.bgInput, theme.textSecondary, 'text-sm font-medium px-3 py-1 rounded-lg']">
                    {{ set.count || 0 }} {{ (set.count || 0) === 1 ? 'media' : 'medias' }}
                  </span>
                </div>
                <ToggleSwitch
                  :model-value="selectedSets.includes(set.id || set.uuid)"
                  :label="''"
                  @update:model-value="(val) => toggleSet(set.id || set.uuid, val)"
                />
              </div>
            </div>
          </div>

          <!-- Start Download Button -->
          <button
            @click="handleStartDownload"
            :disabled="isDownloading || selectedSets.length === 0"
            class="w-full py-5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 text-white font-bold text-lg rounded-xl hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wider shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10"
          >
            <Download v-if="!isDownloading" class="w-5 h-5" />
            <Loader2 v-else class="w-5 h-5 animate-spin" />
            <span v-if="isDownloading">Preparing Download...</span>
            <span v-else>START DOWNLOAD</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer v-if="showMazelootBranding" :class="[theme.borderSecondary, 'fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-md bg-white/10 dark:bg-black/20 light:bg-white/50']">
      <div class="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <p :class="[theme.textTertiary, 'text-xs text-center']">
          © {{ new Date().getFullYear() }} {{ brandFileName || 'Mazeloot' }}. All rights reserved.
        </p>
      </div>
    </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, Download, Loader2, ChevronLeft, ArrowLeft } from '@/shared/utils/lucideAnimated'
import { apiClient } from '@/shared/api/client'
import { API_CONFIG } from '@/shared/api/config'
import { toast } from '@/shared/utils/toast'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { useSettingsApi } from '@/domains/memora/api/settings'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useThemeStore } from '@/shared/stores/theme'
import { publicRawFileUrl } from '@/shared/utils/memoraPublicUrls'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import { getStoredDownloadPin } from '@/shared/utils/localStorage'

const route = useRoute()
const router = useRouter()
const rawFilesApi = useRawFilesApi()
const { fetchPublicSettings } = useSettingsApi()
const theme = useThemeClasses()
const themeStore = useThemeStore()

const rawFile = ref(null)
const mediaSets = ref([])
const selectedSets = ref([])
const isDownloading = ref(false)
const isDownloadingZip = ref(false)
const isLoadingState = ref(false)
const isInitialLoading = ref(true)
const isNavigating = ref(false)
const isNavigatingBack = ref(false)
const zipFile = ref(null)
const downloadToken = ref(null)
const rawFileName = ref('')
const brandFileName = ref('')
const brandingLogoUrl = ref(null)
const showMazelootBranding = ref(true)
const pollInterval = ref(null)
const coverPhotoUrl = ref(null)

const coverPhotoStyle = computed(() => {
  if (!coverPhotoUrl.value) return {}
  return {
    backgroundImage: `url(${coverPhotoUrl.value})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  }
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Validate access token for download page
const validateDownloadPageAccess = (rawFileId, accessToken) => {
  if (!accessToken || !rawFileId) return false
  
  try {
    const stored = localStorage.getItem(`download_page_access_${rawFileId}`)
    if (!stored) return false
    
    const data = JSON.parse(stored)
    const { token, expiresAt } = data
    
    // Check if expired
    if (Date.now() > expiresAt) {
      localStorage.removeItem(`download_page_access_${rawFileId}`)
      return false
    }
    
    // Check if token matches
    if (token === accessToken) {
      // Remove token after validation (one-time use)
      localStorage.removeItem(`download_page_access_${rawFileId}`)
      return true
    }
    
    return false
  } catch (error) {
    localStorage.removeItem(`download_page_access_${rawFileId}`)
    return false
  }
}

onMounted(async () => {
  const rawFileId = route.query.rawFileId
  const token = route.query.token
  const accessToken = route.query.accessToken
  
  // Validate access token (unless coming from email link with token)
  if (!token && rawFileId) {
    // Check if user has valid access token
    const hasValidAccess = validateDownloadPageAccess(rawFileId, accessToken)
    
    // Check for stored download token (from previous navigation) - allow if exists
    const storedDownloadToken = localStorage.getItem(`raw_file_download_token_${rawFileId}`)
    
    if (!hasValidAccess && !storedDownloadToken) {
      // No valid access, redirect back to raw files view
      toast.error('Access denied', {
        description: 'Please access the download page from the raw file view.'
      })
      const domainSegment = route.params.domain || route.params.projectId || 'default'
      router.push(publicRawFileUrl(domainSegment, rawFileId))
      return
    }

    // If stored download token exists, allow access to continue polling
    if (storedDownloadToken && !zipFile.value) {
      downloadToken.value = storedDownloadToken
      isLoadingState.value = true
      isInitialLoading.value = false
      
      const headers = getHeaders(rawFileId)
      startPolling(storedDownloadToken, headers, rawFileId)
      return
    }
  }
  
  // If token is provided, check status directly (from email link)
  if (token && rawFileId) {
    isLoadingState.value = true
    try {
      const headers = getHeaders(rawFileId)
      
      const response = await apiClient.get(
        `/v1/public/raw-files/${rawFileId}/download/zip/${token}/status`,
        { headers }
      )

      const data = response.data?.data || response.data || {}
      
      // Fetch branding if not already fetched
      if (!brandingLogoUrl.value && rawFile?.value?.userUuid) {
        try {
          const settingsResponse = await fetchPublicSettings({ userId: rawFile.value.userUuid })
          const settings = settingsResponse.data || settingsResponse
          brandFileName.value = settings.branding?.name || ''
          brandingLogoUrl.value = settings.branding?.logoUrl || null
          showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true
        } catch (e) {
          console.warn('Failed to fetch branding:', e)
        }
      }

      isInitialLoading.value = false
      
      if (data.status === 'completed') {
        isLoadingState.value = false
        zipFile.value = {
          filename: data.zipFile?.filename || 'download.zip',
          size: formatFileSize(data.zipFile?.size || 0),
          token: token,
        }
      } else if (data.status === 'processing') {
        downloadToken.value = token
        startPolling(token, headers, rawFileId)
      } else if (data.status === 'failed') {
        isLoadingState.value = false
        toast.error('Download failed', {
          description: data.error || 'Please try again',
        })
      } else {
        isLoadingState.value = false
        toast.error('Download not found or failed')
      }
      return
    } catch (error) {
      isInitialLoading.value = false
      isLoadingState.value = false
      toast.error('Failed to load download status')
    }
  }

  if (!rawFileId) {
    toast.error('Raw file ID is required')
    router.back()
    return
  }

  try {
    const headers = getHeaders(rawFileId)

    // Fetch raw file
    const guestToken = localStorage.getItem(`guest_token_${rawFileId}`)
    let response
    if (guestToken) {
      response = await rawFilesApi.fetchRawFileGuest(rawFileId, guestToken)
    } else {
      response = await rawFilesApi.fetchRawFile(rawFileId)
    }
    
    const rawFileData = response?.data || response
    rawFile.value = rawFileData
    rawFileName.value = rawFileData.name || 'Raw File'
    
    // Get cover photo (use default background since raw files don't have cover photos)
    coverPhotoUrl.value = null
    
    // Fetch branding
    if (rawFileData.userUuid || rawFileData.user_uuid) {
      try {
        const settingsResponse = await fetchPublicSettings({ userId: rawFileData.userUuid || rawFileData.user_uuid })
        const settings = settingsResponse.data || settingsResponse
        brandFileName.value = settings.branding?.name || ''
        brandingLogoUrl.value = settings.branding?.logoUrl || null
        showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true
      } catch (e) {
        console.warn('Failed to fetch branding:', e)
      }
    }

    // Load media sets
    let sets
    if (guestToken) {
      sets = await rawFilesApi.fetchMediaSetsGuest(rawFileId, guestToken)
    } else {
      sets = await rawFilesApi.fetchMediaSets(rawFileId)
    }
    
    const setsData = sets?.data || sets || []
    mediaSets.value = Array.isArray(setsData) ? setsData : []
    
    // Default to all sets selected
    selectedSets.value = mediaSets.value.map(set => set.id || set.uuid).filter(Boolean)
    
    isInitialLoading.value = false
  } catch (error) {
    isInitialLoading.value = false
    toast.error('Failed to load raw file', {
      description: error.message || 'Please try again',
    })
    router.back()
  }
})

const getHeaders = (rawFileId) => {
  const headers = {}
  
  const guestToken = localStorage.getItem(`guest_token_${rawFileId}`)
  if (guestToken) {
    headers['Authorization'] = `Bearer ${guestToken}`
  }

  // Get download PIN if verified
  const storedPin = getStoredDownloadPin(rawFileId)
  if (storedPin) {
    headers['X-Download-PIN'] = storedPin
  }

  return headers
}

const handleStartDownload = async () => {
  if (selectedSets.value.length === 0) {
    toast.error('Please select at least one set')
    return
  }

  const rawFileId = route.query.rawFileId

  isDownloading.value = true
  isLoadingState.value = true

  try {
    const headers = getHeaders(rawFileId)

    // Initiate ZIP generation
    const response = await apiClient.post(
      `/v1/public/raw-files/${rawFileId}/download/zip`,
      {
        setIds: selectedSets.value,
      },
      { headers }
    )

    const { token } = response.data?.data || response.data || {}
    if (!token) {
      throw new Error('Failed to initiate download')
    }

    downloadToken.value = token
    localStorage.setItem(`raw_file_download_token_${rawFileId}`, token)
    startPolling(token, headers, rawFileId)
  } catch (error) {
    toast.error('Download failed', {
      description: error.message || 'Please try again',
    })
    isLoadingState.value = false
    isDownloading.value = false
  }
}

const startPolling = (token, headers, rawFileId) => {
  isLoadingState.value = true
  isInitialLoading.value = false
  
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
  
  pollInterval.value = setInterval(async () => {
    try {
      const response = await apiClient.get(
        `/v1/public/raw-files/${rawFileId}/download/zip/${token}/status`,
        { headers }
      )

      const data = response.data?.data || response.data || {}
      
      if (data.status === 'completed') {
        clearInterval(pollInterval.value)
        pollInterval.value = null
        isLoadingState.value = false
        
        localStorage.removeItem(`raw_file_download_token_${rawFileId}`)
        
        zipFile.value = {
          filename: data.zipFile?.filename || 'download.zip',
          size: formatFileSize(data.zipFile?.size || 0),
          token: token,
        }
        
        return
      } else if (data.status === 'failed') {
        clearInterval(pollInterval.value)
        pollInterval.value = null
        isLoadingState.value = false
        
        localStorage.removeItem(`raw_file_download_token_${rawFileId}`)
        
        toast.error('Download failed', {
          description: data.error || 'Please try again',
        })
        
        return
      }
    } catch (error) {
      console.error('Polling error:', error)
    }
  }, 2000)
}

const handleZipDownload = async () => {
  if (!zipFile.value?.token || isDownloadingZip.value) return
  
  isDownloadingZip.value = true
  
  try {
    const rawFileId = route.query.rawFileId
    const headers = getHeaders(rawFileId)

    const downloadUrl = `${API_CONFIG.API_BASE_URL}/v1/public/raw-files/${rawFileId}/download/zip/${zipFile.value.token}`
    
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error('Download failed')
    }

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', zipFile.value.filename)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    }, 100)
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Failed to download file', {
      description: error.message || 'Please try again',
    })
  } finally {
    isDownloadingZip.value = false
  }
}

const toggleSet = (setId, isSelected) => {
  if (isSelected) {
    if (!selectedSets.value.includes(setId)) {
      selectedSets.value.push(setId)
    }
  } else {
    selectedSets.value = selectedSets.value.filter(id => id !== setId)
  }
}

const handleBack = () => {
  if (isNavigatingBack.value) return
  isNavigatingBack.value = true
  router.back()
  setTimeout(() => {
    isNavigatingBack.value = false
  }, 1000)
}

const handleBackToRawFile = () => {
  if (isNavigating.value) return
  isNavigating.value = true
  const rawFileId = route.query.rawFileId
  const domainSegment = route.params.domain || route.params.projectId || 'default'
  router.push(publicRawFileUrl(domainSegment, rawFileId))
    .catch(() => {
      isNavigating.value = false
    })
}

onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}

.animation-delay-100 {
  animation-delay: 100ms;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
