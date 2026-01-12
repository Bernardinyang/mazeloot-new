<template>
  <DashboardLayout>
    <template #breadcrumb> Homepage </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
            Homepage
          </h1>
          <p class="text-sm" :class="theme.textSecondary">
            Configure your public homepage settings and preview how it will appear to visitors
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            class="border-accent text-accent hover:bg-accent/10 dark:hover:bg-accent/20"
            @click="handleShare"
          >
            <Share2 class="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="default"
            :icon="Globe"
            class="shadow-lg hover:shadow-xl transition-all duration-200"
            @click="handleViewSite"
          >
            View Site
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-6">
          <div v-for="i in 5" :key="i" class="rounded-lg border p-6 space-y-4" :class="[theme.bgCard, theme.borderCard]">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div class="lg:sticky lg:top-6 h-fit">
          <div class="rounded-lg border p-4 sm:p-6" :class="[theme.bgCard, theme.borderCard]">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mb-4"></div>
            <div class="h-[600px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Section -->
        <div class="space-y-6">
          <!-- Homepage Status Card -->
          <div class="rounded-lg border p-6 space-y-4" :class="[theme.bgCard, theme.borderCard]">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold mb-1" :class="theme.textPrimary">
                  Homepage Status
                </h3>
                <p class="text-sm" :class="theme.textSecondary">
                  Enable or disable your public homepage
                </p>
              </div>
              <label class="relative inline-flex items-center group" :class="isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'">
                <input type="checkbox" v-model="homepageStatus" :disabled="isLoading" class="sr-only peer" />
                <div
                  class="w-12 h-6 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md peer-checked:bg-accent bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
                ></div>
              </label>
            </div>
            <p class="text-sm leading-relaxed" :class="theme.textSecondary">
              Your Homepage is a public page where your collections are listed. You can also select
              which collections will be shown here under each collection's setting.
              <a
                href="#"
                class="text-accent hover:text-accent underline font-medium transition-colors"
                >Learn more</a
              >
            </p>
          </div>

          <!-- Homepage URL Card -->
          <div class="rounded-lg border p-6 space-y-4" :class="[theme.bgCard, theme.borderCard]">
            <div>
              <h3 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Homepage URL</h3>
              <p class="text-sm" :class="theme.textSecondary">
                Share this link to direct visitors to your homepage
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Input
                v-model="homepageUrl"
                readonly
                :disabled="isLoading"
                :class="[
                  'flex-1 font-mono text-sm',
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
              <Button
                variant="outline"
                size="sm"
                :class="[
                  theme.borderSecondary,
                  theme.textSecondary,
                  'hover:bg-accent/10 dark:hover:bg-accent/20',
                ]"
                @click="handleCopyUrl"
              >
                <Copy class="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          <!-- Homepage Password Card -->
          <div class="rounded-lg border p-6 space-y-4" :class="[theme.bgCard, theme.borderCard]">
            <div>
              <h3 class="text-lg font-semibold mb-1" :class="theme.textPrimary">
                Homepage Password
              </h3>
              <p class="text-sm" :class="theme.textSecondary">
                Protect your Homepage with a password
              </p>
            </div>
            <div class="flex items-center gap-2">
              <PasswordInput
                v-model="homepagePassword"
                placeholder="Add a password"
                :disabled="isLoading"
                :input-class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
                class="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                :class="[
                  theme.borderSecondary,
                  theme.textSecondary,
                  'hover:bg-accent/10 dark:hover:bg-accent/20',
                ]"
                @click="handleCopyPassword"
                :disabled="!homepagePassword || isLoading"
              >
                <Copy class="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                :class="[
                  theme.borderSecondary,
                  theme.textSecondary,
                  'hover:bg-accent/10 dark:hover:bg-accent/20',
                ]"
                @click="handleGeneratePassword"
              >
                <RefreshCw class="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>

          <!-- Biography Card -->
          <div class="rounded-lg border p-6 space-y-4" :class="[theme.bgCard, theme.borderCard]">
            <div>
              <h3 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Biography</h3>
              <p class="text-sm" :class="theme.textSecondary">
                Tell visitors about yourself or your business
              </p>
            </div>
            <div class="relative">
              <Textarea
                v-model="biography"
                @input="handleBiographyInput"
                :maxlength="200"
                rows="5"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'pr-16 resize-none',
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
                placeholder="Tell us about yourself..."
              />
              <span
                class="absolute bottom-3 right-3 text-xs font-medium"
                :class="biography.length >= 180 ? 'text-orange-500' : 'text-gray-500'"
              >
                {{ biography.length }} / 200
              </span>
            </div>
          </div>

          <!-- Slideshow Card -->
          <div class="rounded-lg border p-6 space-y-4" :class="[theme.bgCard, theme.borderCard]">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold mb-1" :class="theme.textPrimary">
                  Featured Works Slideshow
                </h3>
                <p class="text-sm" :class="theme.textSecondary">
                  Display featured media as a slideshow on your homepage
                </p>
              </div>
              <label class="relative inline-flex items-center group" :class="isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'">
                <input type="checkbox" v-model="slideshowEnabled" :disabled="isLoading" class="sr-only peer" />
                <div
                  class="w-12 h-6 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md peer-checked:bg-accent bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
                ></div>
              </label>
            </div>
            <p class="text-sm leading-relaxed" :class="theme.textSecondary">
              Mark media as "Featured" from your collections to showcase them in a slideshow on your homepage.
              <RouterLink
                :to="{ name: 'featuredMedias' }"
                class="text-accent hover:text-accent underline font-medium transition-colors"
              >
                Manage Featured Media
              </RouterLink>
            </p>
          </div>

          <!-- Homepage Info Card -->
          <div class="rounded-lg border p-6 space-y-4" :class="[theme.bgCard, theme.borderCard]">
            <div>
              <h3 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Homepage Info</h3>
              <p class="text-sm" :class="theme.textSecondary">
                Select which information to display on your homepage
              </p>
            </div>
            <div class="space-y-3">
              <label
                v-for="info in homepageInfoOptions"
                :key="info.key"
                class="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <input
                  type="checkbox"
                  v-model="homepageInfo"
                  :value="info.key"
                  :disabled="isLoading"
                  class="w-5 h-5 rounded border-gray-300 text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all"
                  :class="[
                    theme.borderSecondary,
                    isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                  ]"
                />
                <span class="text-sm flex-1" :class="theme.textSecondary">{{ info.label }}</span>
              </label>
            </div>
            <p
              class="text-sm leading-relaxed pt-2 border-t"
              :class="[theme.textSecondary, theme.borderSecondary]"
            >
              To update any of the above details, please go to your
              <a
                href="#"
                class="text-accent hover:text-accent underline font-medium transition-colors"
                >profile</a
              >. Any information left blank will not appear on your homepage.
            </p>
          </div>

        </div>

        <!-- Right Section -->
        <div class="lg:sticky lg:top-6 h-fit">
          <div class="rounded-lg border p-4 sm:p-6" :class="[theme.bgCard, theme.borderCard]">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base sm:text-lg font-semibold" :class="theme.textPrimary">
                Homepage Preview
              </h3>
            </div>
            <div
              v-if="showPreviewContent"
              class="rounded-lg border shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl max-w-full"
              :class="[theme.bgCardSolid, theme.borderCard]"
            >
              <div class="px-4 py-2 border-b flex items-center justify-between" :class="theme.borderCard">
                <div class="flex items-center gap-2">
                  <div
                    class="h-2 w-2 rounded-full"
                    :class="homepageStatus ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
                  ></div>
                  <span class="text-sm font-medium" :class="theme.textPrimary">
                    {{ homepageStatus ? 'Live' : 'Not Live' }}
                  </span>
                </div>
              </div>
              <div class="h-[600px] overflow-auto">
                <BrandHomepagePreview
                  :branding="previewBranding"
                  :homepage-info="homepageInfo"
                  :biography="biography"
                  :social-links="socialLinks"
                  :collections="previewCollections"
                  :is-loading="isLoadingSocialLinks || isLoading"
                  :contact-info="previewContactInfo"
                  :slideshow-enabled="slideshowEnabled"
                  :featured-media="previewFeaturedMedia"
                />
              </div>
            </div>
            <div
              v-else
              class="rounded-lg border shadow-xl overflow-hidden p-8 sm:p-12 text-center"
              :class="[theme.bgCardSolid, theme.borderCard]"
            >
              <div class="space-y-3">
                <div
                  class="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center"
                  :class="theme.bgCard"
                >
                  <Globe class="h-6 w-6 sm:h-8 sm:w-8" :class="theme.textTertiary" />
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-semibold mb-1" :class="theme.textPrimary">
                    Homepage Disabled
                  </h3>
                  <p class="text-xs sm:text-sm" :class="theme.textSecondary">
                    Enable homepage status to see preview
                  </p>
                </div>
              </div>
            </div>
            <p class="text-xs text-center mt-3 sm:mt-4 px-2" :class="theme.textTertiary">
              Preview updates in real-time as you make changes
            </p>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div :class="theme.borderSecondary" class="mt-8 pt-6 border-t">
        <div class="flex items-center justify-between gap-3">
          <div v-if="hasChanges" class="flex items-center gap-2 text-sm">
            <div class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span :class="theme.textSecondary">You have unsaved changes</span>
          </div>
          <div v-else class="flex items-center gap-2 text-sm">
            <Check class="h-4 w-4 text-accent" />
            <span :class="theme.textSecondary">All changes saved</span>
          </div>
          <Button
            variant="primary"
            :disabled="!hasChanges || isLoading"
            :loading="isSaving"
            loading-label="Saving..."
            @click="handleSave"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <HomepageShareModal
      :open="showShareModal"
      :homepage-url="homepageUrl"
      :homepage-password="homepagePassword"
      :brand-name="previewBranding.name"
      :biography="biography"
      @update:open="showShareModal = $event"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Copy, RefreshCw, Globe, Mail, MapPin, Phone, Facebook, Instagram, Loader2, Check, Share2 } from 'lucide-vue-next'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import Input from '@/shared/components/shadcn/input/Input.vue'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import { Textarea } from '@/shared/components/shadcn/textarea'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'
import { generatePassword } from '@/shared/utils/generatePassword'
import { useSettingsApi } from '@/domains/memora/api/settings'
import { useSocialLinksApi } from '@/domains/memora/api/socialLinks'
import BrandHomepagePreview from '@/shared/components/organisms/BrandHomepagePreview.vue'
import HomepageShareModal from '@/domains/memora/modals/HomepageShareModal.vue'
import { useUserStore } from '@/shared/stores/user'
import { useRouter } from 'vue-router'

const description = ''

const theme = useThemeClasses()
const router = useRouter()
const userStore = useUserStore()
const { fetchSettings, updateHomepage } = useSettingsApi()
const { fetchSocialLinks } = useSocialLinksApi()

// Form state
const homepageStatus = ref(true)
const homepageUrl = ref('')
const homepagePassword = ref('')
const biography = ref('')
const homepageInfo = ref(['biography', 'socialLinks'])
const slideshowEnabled = ref(false)

// Social links
const socialLinks = ref([])

// Loading states
const isLoading = ref(false)
const isSaving = ref(false)
const isLoadingSocialLinks = ref(false)
const showShareModal = ref(false)

// Original values for change tracking
const originalHomepageStatus = ref(true)
const originalHomepagePassword = ref('')
const originalBiography = ref('')
const originalHomepageInfo = ref(['biography', 'socialLinks'])
const originalSlideshowEnabled = ref(false)

// Computed to check if there are changes
const hasChanges = computed(() => {
  return (
    homepageStatus.value !== originalHomepageStatus.value ||
    homepagePassword.value !== originalHomepagePassword.value ||
    biography.value !== originalBiography.value ||
    JSON.stringify(homepageInfo.value) !== JSON.stringify(originalHomepageInfo.value) ||
    slideshowEnabled.value !== originalSlideshowEnabled.value
  )
})

// Sample collections data for preview
const sampleCollections = ref([])
const previewFeaturedMedia = ref([])

// Computed
const previewCollections = computed(() => sampleCollections.value)

// Preview branding (will be updated when settings load)
const previewBranding = ref({
  name: 'BERNODE',
  logoUrl: null,
  tagline: null,
})

// Preview contact info
const previewContactInfo = ref({
  email: '',
  phone: '',
  address: '',
})

// Computed
const showPreviewContent = computed(() => {
  return homepageStatus.value
})

const homepageInfoOptions = [
  { key: 'biography', label: 'Biography' },
  { key: 'socialLinks', label: 'Social Links' },
  { key: 'website', label: 'Website' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
]

// Fetch settings and social links on mount
onMounted(async () => {
  isLoading.value = true
  isLoadingSocialLinks.value = true
  
  try {
    // Fetch settings
    const response = await fetchSettings()
    const settings = response.data || response
    
    homepageStatus.value = settings.homepage?.status ?? true
    // Generate homepage URL in new format: /memora/:domainOrUsername/homepage
    const domain = settings.branding?.domain || 'default'
    homepageUrl.value = `${window.location.origin}/memora/${domain}/homepage`
    homepagePassword.value = settings.homepage?.password || ''
    biography.value = settings.homepage?.biography || ''
    homepageInfo.value = Array.isArray(settings.homepage?.info) ? settings.homepage.info : ['biography', 'socialLinks']
    slideshowEnabled.value = settings.homepage?.slideshowEnabled ?? false
    
    // Update preview branding
    previewBranding.value = {
      name: settings.branding?.name || 'BERNODE',
      logoUrl: settings.branding?.logoUrl || null,
      tagline: settings.branding?.tagline || null,
      website: settings.branding?.website || null,
    }

    // Update preview contact info
    previewContactInfo.value = {
      email: settings.branding?.supportEmail || '',
      phone: settings.branding?.supportPhone || '',
      address: settings.branding?.location || '',
    }
    
    // Fetch social links
    try {
      const linksResponse = await fetchSocialLinks()
      socialLinks.value = linksResponse.data || linksResponse || []
    } catch (error) {
      console.error('Failed to load social links:', error)
      socialLinks.value = []
    }

    // Fetch collections for preview
    try {
      const { useCollectionsApi } = await import('@/domains/memora/api/collections')
      const { fetchCollections } = useCollectionsApi()
      const collectionsResponse = await fetchCollections({ status: 'active', perPage: 6 })
      sampleCollections.value = (collectionsResponse.data || []).filter(c => c.showOnHomepage !== false).slice(0, 6)
    } catch (error) {
      console.error('Failed to load collections for preview:', error)
      sampleCollections.value = []
    }

    // Fetch featured media for preview
    try {
      const { apiClient } = await import('@/shared/api/client')
      const featuredResponse = await apiClient.get('/v1/memora/media/featured?per_page=10')
      const featuredData = featuredResponse.data?.data || featuredResponse.data || []
      previewFeaturedMedia.value = featuredData.map(item => ({
        url: item.thumbnailUrl || item.file?.url || item.url,
        thumbnail: item.thumbnailUrl || item.file?.url || item.url,
        collectionName: item.mediaSet?.name || item.collection?.name || 'Featured Work',
      }))
    } catch (error) {
      console.error('Failed to load featured media for preview:', error)
      previewFeaturedMedia.value = []
    }

    // Store original values after successful load
    originalHomepageStatus.value = homepageStatus.value
    originalHomepagePassword.value = homepagePassword.value
    originalBiography.value = biography.value
    originalHomepageInfo.value = [...homepageInfo.value]
    originalSlideshowEnabled.value = slideshowEnabled.value
  } catch (error) {
    toast.error('Failed to load settings', {
      description: error.message || 'Please try again',
    })
  } finally {
    isLoading.value = false
    isLoadingSocialLinks.value = false
  }
})

// Manual save function
const handleSave = async () => {
  if (!hasChanges.value) return

  isSaving.value = true
  try {
    await updateHomepage({
      status: homepageStatus.value,
      password: homepagePassword.value,
      biography: biography.value,
      info: Array.isArray(homepageInfo.value) ? homepageInfo.value : [],
      slideshowEnabled: slideshowEnabled.value,
    })

    // Update original values after successful save
    originalHomepageStatus.value = homepageStatus.value
    originalHomepagePassword.value = homepagePassword.value
    originalBiography.value = biography.value
    originalHomepageInfo.value = [...homepageInfo.value]
    originalSlideshowEnabled.value = slideshowEnabled.value

    toast.success('Settings saved successfully')
  } catch (error) {
    toast.error('Failed to save settings', {
      description: error.message || 'Please try again',
    })
  } finally {
    isSaving.value = false
  }
}

const handleCopyUrl = async () => {
  try {
    await navigator.clipboard.writeText(homepageUrl.value)
    toast.success('URL copied', {
      description,
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description,
    })
  }
}

const handleCopyPassword = async () => {
  if (!homepagePassword.value) {
    toast.error('No password to copy', {
      description: 'Please generate or enter a password first',
    })
    return
  }
  try {
    await navigator.clipboard.writeText(homepagePassword.value)
    toast.success('Password copied', {
      description,
    })
  } catch (error) {
    toast.error('Failed to copy password', {
      description,
    })
  }
}

const handleBiographyInput = e => {
  const target = e.target
  biography.value = target.value
}

const handleGeneratePassword = () => {
  // Generate a random password with special characters for homepage
  const specialChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  homepagePassword.value = generatePassword(12, specialChars)
  toast.success('Password generated', {
    description,
  })
}

const handleViewSite = async () => {
  // Get domain from user's product preferences
  let domain = 'default'
  try {
    const { getProductPreferences } = await import('@/shared/api/productPreferences')
    const response = await getProductPreferences()
    const preferences = Array.isArray(response) ? response : (response.data || [])
    const memoraPreference = preferences.find(p => p.product?.slug === 'memora')
    domain = memoraPreference?.domain || 'default'
  } catch (error) {
    console.error('Failed to get domain:', error)
  }
  
  const currentUserId = userStore.user?.id || userStore.user?.uuid
  if (currentUserId) {
    // Use new format: /memora/:domainOrUsername/homepage
    const route = router.resolve({
      name: 'publicBrandHomepage',
      params: {
        domainOrUsername: domain,
      },
      query: {
        userId: currentUserId,
        preview: 'true',
      },
    })
    window.open(route.href, '_blank')
  } else {
    window.open(homepageUrl.value, '_blank')
  }
}

const handleShare = () => {
  showShareModal.value = true
}
</script>
