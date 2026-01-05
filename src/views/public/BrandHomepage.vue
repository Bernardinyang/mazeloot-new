<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
    <!-- Password Protection Modal -->
    <Dialog v-if="showPasswordModal" :open="true" @update:open="(val) => { if (!val) showPasswordModal = false }">
      <DialogContent class="sm:max-w-[440px] bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader class="text-center space-y-2">
          <div class="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-2">
            <Lock class="h-8 w-8 text-white" />
          </div>
          <DialogTitle class="text-2xl font-bold">Protected Homepage</DialogTitle>
          <DialogDescription class="text-gray-600">Enter the password to access this homepage</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 mt-6">
          <PasswordInput
            v-model="passwordInput"
            placeholder="Enter password"
            :input-class="[
              'w-full h-12 px-4 rounded-lg border-2 transition-all',
              passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-accent focus:ring-accent/20',
            ]"
            @keydown.enter="handleVerifyPassword"
          />
          <p v-if="passwordError" class="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle class="h-4 w-4" />
            {{ passwordError }}
          </p>
        </div>
        <DialogFooter class="mt-6 gap-3">
          <Button variant="outline" @click="showPasswordModal = false" class="flex-1">Cancel</Button>
          <Button
            @click="handleVerifyPassword"
            :disabled="!passwordInput || isVerifying"
            class="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg"
          >
            <Loader2 v-if="isVerifying" class="mr-2 h-4 w-4 animate-spin" />
            {{ isVerifying ? 'Verifying...' : 'Enter' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Homepage Disabled Message -->
    <div v-if="!homepageEnabled && !(isPreviewMode && isOwner)" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
          <Lock class="h-10 w-10 text-gray-400" />
        </div>
        <h1 class="text-3xl font-bold mb-3 text-gray-900">Homepage Unavailable</h1>
        <p class="text-gray-600 text-lg">This homepage is currently disabled by the owner.</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="(homepageEnabled || (isPreviewMode && isOwner)) && (!showPasswordModal || isPasswordVerified)" class="min-h-screen">
      <!-- Initial Loading State -->
      <div v-if="isLoadingHomepage" class="min-h-screen flex items-center justify-center">
        <div class="text-center space-y-4">
          <Loader2 class="h-12 w-12 text-accent animate-spin mx-auto" />
          <p class="text-gray-600 dark:text-gray-400">Loading homepage...</p>
        </div>
      </div>

      <!-- Homepage Content -->
      <template v-else>
        <!-- Preview Mode Banner -->
      <div
        v-if="isPreviewMode && isOwner"
        class="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
      >
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-2">
          <Eye class="h-4 w-4" />
          <span class="text-sm font-semibold">Preview Mode - You are viewing your homepage as it will appear to visitors</span>
        </div>
      </div>

      <!-- Header -->
      <header :class="['sticky z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm', isPreviewMode && isOwner ? 'top-[45px]' : 'top-0']">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              v-if="branding?.logoUrl"
              :src="branding.logoUrl"
              :alt="branding.name || 'Brand'"
              class="h-10 w-auto transition-transform hover:scale-105"
            />
            <div v-else class="h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
          </div>
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun v-if="isDark" class="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <Moon v-else class="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <div v-if="branding?.name" class="mb-8 fade-in">
          <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
            {{ branding.name }}
          </h1>
          <p v-if="branding?.tagline" class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light">{{ branding.tagline }}</p>
        </div>

        <!-- Biography -->
        <p
          v-if="homepageInfo?.includes('biography') && biography"
          class="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-8 leading-relaxed"
        >
          {{ biography }}
        </p>

        <!-- Contact Info -->
        <div
          v-if="
            homepageInfo &&
            (homepageInfo.includes('website') ||
              homepageInfo.includes('phone') ||
              homepageInfo.includes('email') ||
              homepageInfo.includes('address'))
          "
          class="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10"
        >
          <a
            v-if="homepageInfo.includes('website') && branding?.website"
            :href="branding.website"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-accent hover:bg-accent/10 dark:hover:bg-accent/20 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Globe class="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-accent transition-colors" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors">{{ branding.website }}</span>
          </a>
          <div
            v-if="homepageInfo.includes('phone') && contactInfo.phone"
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <Phone class="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ contactInfo.phone }}</span>
          </div>
          <a
            v-if="homepageInfo.includes('email') && contactInfo.email"
            :href="`mailto:${contactInfo.email}`"
            class="group flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-accent hover:bg-accent/10 dark:hover:bg-accent/20 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Mail class="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-accent transition-colors" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors">{{ contactInfo.email }}</span>
          </a>
          <a
            v-if="homepageInfo.includes('address') && contactInfo.address"
            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-accent hover:bg-accent/10 dark:hover:bg-accent/20 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <MapPin class="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-accent transition-colors" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors">{{ contactInfo.address }}</span>
          </a>
        </div>

        <!-- Social Links -->
        <div
          v-if="homepageInfo?.includes('socialLinks') && socialLinks.length > 0"
          class="flex items-center justify-center gap-3 mt-8"
        >
          <a
            v-for="link in socialLinks.filter(l => l.isActive)"
            :key="link.id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Globe v-if="!link.platform" class="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-accent transition-colors" />
            <component
              v-else-if="link.platform.slug === 'facebook'"
              :is="Facebook"
              class="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-accent transition-colors"
            />
            <component
              v-else-if="link.platform.slug === 'instagram'"
              :is="Instagram"
              class="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-accent transition-colors"
            />
            <Globe v-else class="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-accent transition-colors" />
          </a>
        </div>
      </section>

      <!-- Featured Media Slideshow -->
      <FeaturedMediaSlider
        v-if="slideshowEnabled"
        :featured-media="featuredMedia"
        :show-video-media="showVideoMedia"
        variant="full"
      />

      <!-- Collections Grid -->
      <section class="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div v-if="isLoadingCollections" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <div
            v-for="i in 8"
            :key="i"
            class="fade-in"
            :style="{ 'animation-delay': `${i * 50}ms`, opacity: 0 }"
          >
            <div class="relative aspect-square overflow-hidden rounded-2xl mb-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse"></div>
            <div class="text-center space-y-2">
              <div class="h-5 w-3/4 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div class="h-4 w-1/2 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div v-else-if="collections.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <div
            v-for="(collection, index) in collections"
            :key="collection.id"
            class="group cursor-pointer fade-in tilt-card"
            :style="{
              'animation-delay': `${index * 50}ms`,
              opacity: 0,
              transform: `rotate(${getCardRotation(index)}deg)`,
            }"
            @click="handleCollectionClick(collection)"
            @mouseenter="handleCardEnter"
            @mouseleave="handleCardLeave"
            @mousemove="handleCardMove"
          >
            <div class="relative aspect-square overflow-hidden rounded-2xl mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 group-hover:rotate-0">
              <div class="tilt-inner w-full h-full transition-transform duration-300 ease-out">
                <!-- Video Cover -->
                <video
                  v-if="isVideoCover(collection.image || collection.thumbnail)"
                  :src="collection.image || collection.thumbnail"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  autoplay
                  loop
                  muted
                  playsinline
                ></video>
                <!-- Image Cover -->
                <img
                  v-else
                  :src="collection.image || collection.thumbnail || '/placeholder.jpg'"
                  :alt="collection.name || collection.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              >
                <div class="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p class="text-white font-semibold text-lg mb-1">{{ collection.name || collection.title }}</p>
                  <p v-if="collection.eventDate" class="text-white/90 text-sm">
                    {{ formatDate(collection.eventDate) }}
                  </p>
                </div>
              </div>
              <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight class="h-4 w-4 text-gray-900" />
              </div>
            </div>
            <div class="text-center">
              <p class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ collection.name || collection.title }}</p>
              <p v-if="collection.eventDate" class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(collection.eventDate) }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <ImageIcon class="h-12 w-12 text-gray-400" />
          </div>
          <p class="text-lg font-medium text-gray-600 mb-2">No collections available</p>
          <p class="text-sm text-gray-500">Check back later for new collections</p>
        </div>
      </section>

        <!-- Footer -->
        <footer class="border-t border-gray-800 bg-gray-900 text-white py-8 mt-20">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-sm font-medium text-gray-300 mb-1">
              © {{ new Date().getFullYear() }} {{ branding?.name || 'Mazeloot' }}
            </p>
            <p class="text-xs text-gray-400">Powered by Mazeloot</p>
          </div>
        </footer>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Phone, Mail, MapPin, Globe, Facebook, Instagram, Loader2, Lock, AlertCircle, ArrowRight, ImageIcon, Eye, Sun, Moon } from 'lucide-vue-next'
import FeaturedMediaSlider from '@/components/organisms/FeaturedMediaSlider.vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import PasswordInput from '@/components/molecules/PasswordInput.vue'
import { useSettingsApi } from '@/api/settings'
import { apiClient } from '@/api/client'
import { parseError } from '@/utils/errors'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

const { fetchPublicSettings } = useSettingsApi()

const isDark = computed(() => themeStore.effectiveTheme === 'dark')

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const branding = ref(null)
const homepageInfo = ref([])
const biography = ref('')
const contactInfo = ref({
  phone: '',
  email: '',
  address: '',
})
const socialLinks = ref([])
const collections = ref([])
const isLoadingCollections = ref(false)
const isLoadingHomepage = ref(true)
const showPasswordModal = ref(false)
const isPasswordVerified = ref(false)
const passwordInput = ref('')
const passwordError = ref('')
const isVerifying = ref(false)
const homepageEnabled = ref(true)
const slideshowEnabled = ref(false)
const featuredMedia = ref([])
const showVideoMedia = ref(false) // Flag to control video media display

const userId = computed(() => {
  return route.query.userId || route.params.userId || null
})

const isPreviewMode = computed(() => {
  return route.query.preview === 'true' && userStore.isAuthenticated
})

const isOwner = computed(() => {
  if (!isPreviewMode.value || !userId.value) return false
  const currentUserId = userStore.user?.id || userStore.user?.uuid
  return currentUserId && userId.value && currentUserId === userId.value
})

const formatDate = date => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const isVideoCover = url => {
  if (!url) return false
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.ogg']
  const lowerUrl = url.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
}


const getCardRotation = index => {
  const rotations = [-3, 2, -2, 3, -1, 1, -2, 2]
  return rotations[index % rotations.length]
}

const handleCardEnter = event => {
  const card = event.currentTarget
  card.classList.add('tilt-active')
}

const handleCardLeave = event => {
  const card = event.currentTarget
  card.classList.remove('tilt-active')
  const cardInner = card.querySelector('.tilt-inner')
  if (cardInner) {
    cardInner.style.transform = ''
  }
}

const handleCardMove = event => {
  const card = event.currentTarget
  const cardInner = card.querySelector('.tilt-inner')
  if (!cardInner) return

  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = (y - centerY) / 10
  const rotateY = (centerX - x) / 10

  cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
}

const handleCollectionClick = collection => {
  const collectionId = collection.id || collection.uuid
  const projectId = userId.value || 'homepage'
  const query = { collectionId }
  
  if (isPreviewMode.value && isOwner.value) {
    query.preview = 'true'
  }
  
  router.push({
    name: 'clientCollection',
    params: { projectId },
    query,
  })
}

const handleVerifyPassword = async () => {
  if (!passwordInput.value) return

  isVerifying.value = true
  passwordError.value = ''

  try {
    const response = await apiClient.post('/v1/public/homepage/verify-password', {
      password: passwordInput.value,
      userId: userId.value,
    })

    if (response.data?.data?.verified) {
      isPasswordVerified.value = true
      showPasswordModal.value = false
      await loadCollections()
    } else {
      passwordError.value = 'Incorrect password'
    }
  } catch (error) {
    passwordError.value = error.response?.data?.message || 'Failed to verify password'
  } finally {
    isVerifying.value = false
  }
}

const loadHomepageData = async () => {
  if (!userId.value) {
    console.error('User ID is required')
    isLoadingHomepage.value = false
    return
  }

  isLoadingHomepage.value = true

  try {
    // Check if in preview mode for owner
    const currentUserId = userStore.user?.id || userStore.user?.uuid
    const isOwnerPreview = route.query.preview === 'true' && userStore.isAuthenticated && currentUserId && userId.value && currentUserId === userId.value

    // In preview mode for owner, use authenticated endpoints
    let linksResponse
    if (isOwnerPreview) {
      try {
        const { useSocialLinksApi } = await import('@/api/socialLinks')
        const { fetchSocialLinks } = useSocialLinksApi()
        const linksData = await fetchSocialLinks()
        linksResponse = { data: linksData.data || linksData || [] }
      } catch (error) {
        linksResponse = { data: [] }
      }
    } else {
      linksResponse = await apiClient.get('/v1/public/homepage/social-links', {
        params: { userId: userId.value },
      }).then(res => res.data).catch(() => ({ data: [] }))
    }

    const [settingsResponse] = await Promise.all([
      fetchPublicSettings({ userId: userId.value }),
    ])

    const settings = settingsResponse.data || settingsResponse

    // Check if homepage is enabled (skip check in preview mode for owner)
    homepageEnabled.value = settings.homepage?.status ?? false
    if (!homepageEnabled.value && !isOwnerPreview) {
      // Redirect to app homepage if disabled and not in preview mode
      router.replace({ name: 'home' })
      return
    }

    branding.value = settings.branding || {}
    homepageInfo.value = settings.homepage?.info || []
    biography.value = settings.homepage?.biography || ''
    slideshowEnabled.value = settings.homepage?.slideshowEnabled ?? false
    contactInfo.value = {
      phone: settings.contact?.phone || '',
      email: settings.contact?.email || '',
      address: settings.contact?.address || settings.branding?.location || '',
    }
    socialLinks.value = linksResponse.data || linksResponse || []
    
    // Load featured media if slideshow is enabled
    if (slideshowEnabled.value) {
      await loadFeaturedMedia()
    }

    // Load collections - use authenticated API if in preview mode and owner
    if (isOwnerPreview) {
      try {
        const { useCollectionsApi } = await import('@/api/collections')
        const { fetchCollections } = useCollectionsApi()
        const collectionsResponse = await fetchCollections({ status: 'active', perPage: 100 })
        collections.value = (collectionsResponse.data || []).filter(c => c.showOnHomepage !== false)
      } catch (previewError) {
        console.error('Failed to load collections in preview mode:', previewError)
        collections.value = []
      }
    } else {
      // For public access, use public API
      try {
        const headers = {}
        if (isPasswordVerified.value) {
          headers['X-Homepage-Verified'] = 'true'
        }
        const collectionsResponse = await apiClient.get('/v1/public/homepage/collections', {
          params: { userId: userId.value },
          headers,
        })
        collections.value = collectionsResponse.data?.data || collectionsResponse.data || []
      } catch (error) {
        // If error is about password, show password modal
        if (error.response?.status === 401 || error.response?.data?.code === 'PASSWORD_REQUIRED') {
          showPasswordModal.value = true
          return
        }
        // If homepage is disabled
        if (error.response?.status === 403 || error.response?.data?.code === 'HOMEPAGE_DISABLED') {
          homepageEnabled.value = false
          if (!isOwnerPreview) {
            router.replace({ name: 'home' })
          }
          return
        }
        collections.value = []
      }
    }
  } catch (error) {
    console.error('Failed to load homepage data:', error)
    // If homepage is disabled, redirect to app homepage (except in preview mode)
    if (error.response?.status === 403 || error.response?.data?.code === 'HOMEPAGE_DISABLED') {
      homepageEnabled.value = false
      const currentUserId = userStore.user?.id || userStore.user?.uuid
      const isOwnerPreview = route.query.preview === 'true' && userStore.isAuthenticated && currentUserId && userId.value && currentUserId === userId.value
      if (!isOwnerPreview) {
        router.replace({ name: 'home' })
      }
    }
  } finally {
    isLoadingHomepage.value = false
  }
}

const loadFeaturedMedia = async () => {
  if (!userId.value) return
  
  try {
    const currentUserId = userStore.user?.id || userStore.user?.uuid
    const isOwnerPreview = route.query.preview === 'true' && userStore.isAuthenticated && currentUserId && userId.value && currentUserId === userId.value
    
    let response
    
    // In preview mode for owner, use authenticated endpoint
    if (isOwnerPreview) {
      try {
        const featuredResponse = await apiClient.get('/v1/memora/media/featured?per_page=20')
        const featuredData = featuredResponse.data?.data || featuredResponse.data || []
        featuredMedia.value = featuredData.map(item => ({
          id: item.id || item.uuid,
          uuid: item.uuid || item.id,
          url: item.thumbnailUrl || item.largeImageUrl || item.file?.url || item.url,
          thumbnail: item.thumbnailUrl || item.largeImageUrl || item.file?.url || item.url,
          type: item.type || (item.file?.type?.value || item.file?.type) || 'image',
          collectionId: item.mediaSet?.collection?.uuid || item.collection?.uuid || null,
          collectionName: item.mediaSet?.collection?.name || item.collection?.name || item.mediaSet?.name || null,
        })).filter(item => item.url)
      } catch (previewError) {
        console.error('Failed to load featured media in preview mode:', previewError)
        featuredMedia.value = []
        return
      }
    } else {
      // For public access, use public API
      const headers = {}
      if (isPasswordVerified.value) {
        headers['X-Homepage-Verified'] = 'true'
      }
      
      response = await apiClient.get('/v1/public/homepage/featured-media', {
        params: { userId: userId.value },
        headers,
      })
      
      featuredMedia.value = response.data?.data || response.data || []
    }
  } catch (error) {
    console.error('Failed to load featured media:', parseError(error))
    featuredMedia.value = []
  }
}


const loadCollections = async () => {
  isLoadingCollections.value = true
  try {
    // In preview mode for owner, use authenticated endpoint
    const currentUserId = userStore.user?.id || userStore.user?.uuid
    const isOwnerPreview = route.query.preview === 'true' && userStore.isAuthenticated && currentUserId && userId.value && currentUserId === userId.value

    if (isOwnerPreview) {
      try {
        const { useCollectionsApi } = await import('@/api/collections')
        const { fetchCollections } = useCollectionsApi()
        const collectionsResponse = await fetchCollections({ status: 'active', perPage: 100 })
        collections.value = (collectionsResponse.data || []).filter(c => c.showOnHomepage !== false)
        return
      } catch (previewError) {
        console.error('Failed to load collections in preview mode:', previewError)
      }
    }

    const headers = {}
    if (isPasswordVerified.value || isOwnerPreview) {
      headers['X-Homepage-Verified'] = 'true'
    }
    const response = await apiClient.get('/v1/public/homepage/collections', {
      params: { userId: userId.value },
      headers,
    })
    collections.value = response.data?.data || response.data || []
  } catch (error) {
    console.error('Failed to load collections:', parseError(error))
    collections.value = []
  } finally {
    isLoadingCollections.value = false
  }
}

// Update OpenGraph meta tags
const updateMetaTags = () => {
  if (!branding.value) return

  const title = branding.value.name || 'Homepage'
  const description = biography.value || branding.value.tagline || 'Check out my collections'
  const image = branding.value.logoUrl || ''
  const url = window.location.href

  // Update or create meta tags
  const setMetaTag = (property, content) => {
    if (!content) return
    let meta = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  // Update title
  if (title) {
    document.title = title
  }

  // OpenGraph tags
  setMetaTag('og:title', title)
  setMetaTag('og:description', description)
  setMetaTag('og:image', image)
  setMetaTag('og:url', url)
  setMetaTag('og:type', 'website')

  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image')
  setMetaTag('twitter:title', title)
  setMetaTag('twitter:description', description)
  setMetaTag('twitter:image', image)
}

// Watch for branding changes and update meta tags
watchEffect(() => {
  if (branding.value && !isLoadingHomepage.value) {
    updateMetaTags()
  }
})

onMounted(async () => {
  await loadHomepageData()
  updateMetaTags()
})

onUnmounted(() => {
  // Clean up meta tags on unmount (optional, as they'll be replaced on next page)
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fade-in 0.6s ease-out forwards;
}

.fade-in {
  opacity: 0;
  animation: fade-in 0.6s ease-out forwards;
}

.tilt-card {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.tilt-card .tilt-inner {
  transform-style: preserve-3d;
  will-change: transform;
}

.tilt-card.tilt-active {
  z-index: 10;
}

</style>

