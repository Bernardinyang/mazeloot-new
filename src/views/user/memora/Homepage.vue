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
        <Button
          class="bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          @click="handleViewSite"
        >
          <Globe class="h-4 w-4 mr-2" />
          View Site
        </Button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  class="w-12 h-6 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
                ></div>
              </label>
            </div>
            <p class="text-sm leading-relaxed" :class="theme.textSecondary">
              Your Homepage is a public page where your collections are listed. You can also select
              which collections will be shown here under each collection's setting.
              <a
                href="#"
                class="text-teal-500 hover:text-teal-600 underline font-medium transition-colors"
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
                  'hover:bg-teal-50 dark:hover:bg-teal-900/20',
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
                  'hover:bg-teal-50 dark:hover:bg-teal-900/20',
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
                  'hover:bg-teal-50 dark:hover:bg-teal-900/20',
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
                  class="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
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
                class="text-teal-500 hover:text-teal-600 underline font-medium transition-colors"
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
                Live Preview
              </h3>
              <span class="text-xs px-2 py-1 rounded-full bg-teal-500/10 text-teal-500 font-medium">
                Live
              </span>
            </div>
            <div
              v-if="showPreviewContent"
              class="rounded-lg border shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl max-w-full"
              :class="[theme.bgCardSolid, theme.borderCard]"
            >
              <!-- Preview Header -->
              <div
                class="p-3 sm:p-4 border-b flex items-center justify-between"
                :class="[theme.bgCard, theme.borderSecondary]"
              >
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                </div>
                <div class="flex items-center gap-2 sm:gap-3">
                  <template v-if="homepageInfo.includes('socialLinks') && isLoadingSocialLinks">
                    <div
                      v-for="i in 4"
                      :key="i"
                      :class="['w-3.5 h-3.5 sm:w-4 sm:h-4 rounded animate-pulse', theme.bgSkeleton]"
                    ></div>
                  </template>
                  <template v-else-if="homepageInfo.includes('socialLinks') && socialLinks.length > 0">
                    <a
                      v-for="link in socialLinks.filter(l => l.isActive).slice(0, 4)"
                      :key="link.id"
                      :href="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      :class="[
                        'h-3.5 w-3.5 sm:h-4 sm:w-4 hover:opacity-80 transition-opacity',
                        theme.textTertiary,
                      ]"
                    >
                      <Globe v-if="!link.platform" class="h-full w-full" />
                      <component
                        v-else-if="link.platform.slug === 'facebook'"
                        :is="Facebook"
                        class="h-full w-full"
                      />
                      <component
                        v-else-if="link.platform.slug === 'instagram'"
                        :is="Instagram"
                        class="h-full w-full"
                      />
                      <Globe v-else class="h-full w-full" />
                    </a>
                  </template>
                  <template v-else-if="homepageInfo.includes('socialLinks')">
                    <div
                      :class="['w-3.5 h-3.5 sm:w-4 sm:h-4 rounded', theme.bgSkeleton]"
                    ></div>
                  </template>
                </div>
              </div>

              <!-- Preview Content -->
              <div class="p-4 sm:p-6 space-y-4 sm:space-y-6" :class="theme.bgCardSolid">
                <!-- Name -->
                <div class="text-center space-y-2">
                  <h2 class="text-xl sm:text-2xl font-bold" :class="theme.textPrimary">
                    {{ displayName }}
                  </h2>
                  <p
                    v-if="homepageInfo.includes('biography') && biography"
                    class="text-xs sm:text-sm leading-relaxed max-w-full sm:max-w-md mx-auto px-2"
                    :class="theme.textSecondary"
                  >
                    {{ biography }}
                  </p>
                  <p
                    v-else-if="homepageInfo.includes('biography') && !biography"
                    class="text-xs italic"
                    :class="theme.textTertiary"
                  >
                    Add a biography to see it here
                  </p>
                </div>

                <!-- Contact Info -->
                <div
                  v-if="
                    homepageInfo.length > 0 &&
                    (homepageInfo.includes('website') ||
                      homepageInfo.includes('email') ||
                      homepageInfo.includes('address') ||
                      homepageInfo.includes('phone'))
                  "
                  class="space-y-2 sm:space-y-3 pt-2"
                >
                  <div
                    v-if="homepageInfo.includes('website')"
                    class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm hover:text-teal-600 transition-colors"
                    :class="theme.textSecondary"
                  >
                    <div class="p-1 sm:p-1.5 rounded-md flex-shrink-0" :class="theme.bgCard">
                      <Globe class="h-3.5 w-3.5 sm:h-4 sm:w-4" :class="theme.textSecondary" />
                    </div>
                    <span class="truncate font-medium text-xs sm:text-sm">{{ homepageUrl }}</span>
                  </div>
                  <div
                    v-if="homepageInfo.includes('email')"
                    class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm hover:text-teal-600 transition-colors"
                    :class="theme.textSecondary"
                  >
                    <div class="p-1 sm:p-1.5 rounded-md flex-shrink-0" :class="theme.bgCard">
                      <Mail class="h-3.5 w-3.5 sm:h-4 sm:w-4" :class="theme.textSecondary" />
                    </div>
                    <span class="text-xs sm:text-sm">email@mazeloot.com</span>
                  </div>
                  <div
                    v-if="homepageInfo.includes('address')"
                    class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm hover:text-teal-600 transition-colors"
                    :class="theme.textSecondary"
                  >
                    <div class="p-1 sm:p-1.5 rounded-md flex-shrink-0" :class="theme.bgCard">
                      <MapPin class="h-3.5 w-3.5 sm:h-4 sm:w-4" :class="theme.textSecondary" />
                    </div>
                    <span class="text-xs sm:text-sm">101 Main Street</span>
                  </div>
                  <div
                    v-if="homepageInfo.includes('phone')"
                    class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm hover:text-teal-600 transition-colors"
                    :class="theme.textSecondary"
                  >
                    <div class="p-1 sm:p-1.5 rounded-md flex-shrink-0" :class="theme.bgCard">
                      <Phone class="h-3.5 w-3.5 sm:h-4 sm:w-4" :class="theme.textSecondary" />
                    </div>
                    <span class="text-xs sm:text-sm">123-456-7890</span>
                  </div>
                </div>
                <div
                  v-else-if="
                    !homepageInfo.includes('website') &&
                    !homepageInfo.includes('email') &&
                    !homepageInfo.includes('address') &&
                    !homepageInfo.includes('phone')
                  "
                  class="text-center py-4"
                >
                  <p class="text-xs italic" :class="theme.textTertiary">
                    Select homepage info options to see them here
                  </p>
                </div>

                <!-- Collections Grid Preview -->
                <div class="pt-3 sm:pt-4 border-t" :class="theme.borderSecondary">
                  <div v-if="previewCollections.length > 0" class="grid grid-cols-2 gap-2 sm:gap-3">
                    <div
                      v-for="collection in previewCollections.slice(0, 6)"
                      :key="collection.id"
                      class="aspect-square rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-200"
                    >
                      <div class="relative w-full h-full">
                        <img
                          :src="collection.image"
                          :alt="collection.title"
                          class="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div
                          class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <div class="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2">
                            <p class="text-white text-[10px] sm:text-xs font-medium truncate">
                              {{ collection.title }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-6 sm:py-8">
                    <p class="text-xs italic" :class="theme.textTertiary">
                      No collections to display
                    </p>
                  </div>
                </div>
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
            <Check class="h-4 w-4 text-teal-500" />
            <span :class="theme.textSecondary">All changes saved</span>
          </div>
          <Button
            :disabled="!hasChanges || isSaving || isLoading"
            class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleSave"
          >
            <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Changes</span>
          </Button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Copy, RefreshCw, Globe, Mail, MapPin, Phone, Facebook, Instagram, Loader2, Check } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import Input from '@/components/shadcn/input/Input.vue'
import PasswordInput from '@/components/molecules/PasswordInput.vue'
import { Textarea } from '@/components/shadcn/textarea'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from '@/utils/toast'
import { generatePassword } from '@/utils/generatePassword'
import { useSettingsApi } from '@/api/settings'
import { useSocialLinksApi } from '@/api/socialLinks'

const description = ''

const theme = useThemeClasses()
const { fetchSettings, updateHomepage } = useSettingsApi()
const { fetchSocialLinks } = useSocialLinksApi()

// Form state
const homepageStatus = ref(true)
const homepageUrl = ref('')
const homepagePassword = ref('')
const biography = ref('')
const homepageInfo = ref(['biography', 'socialLinks'])

// Social links
const socialLinks = ref([])

// Loading states
const isLoading = ref(false)
const isSaving = ref(false)
const isLoadingSocialLinks = ref(false)

// Original values for change tracking
const originalHomepageStatus = ref(true)
const originalHomepagePassword = ref('')
const originalBiography = ref('')
const originalHomepageInfo = ref(['biography', 'socialLinks'])

// Computed to check if there are changes
const hasChanges = computed(() => {
  return (
    homepageStatus.value !== originalHomepageStatus.value ||
    homepagePassword.value !== originalHomepagePassword.value ||
    biography.value !== originalBiography.value ||
    JSON.stringify(homepageInfo.value) !== JSON.stringify(originalHomepageInfo.value)
  )
})

// Sample collections data for preview
const sampleCollections = ref([])

// Computed
const previewCollections = computed(() => sampleCollections.value)

// Computed, defaulting to BERNODE)
const displayName = computed(() => {
  // In a real app, this would come from user profile
  return 'BERNODE'
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
    homepageUrl.value = settings.branding?.domain || 'https://bernode.mazeloot.com'
    homepagePassword.value = settings.homepage?.password || ''
    biography.value = settings.homepage?.biography || ''
    homepageInfo.value = Array.isArray(settings.homepage?.info) ? settings.homepage.info : ['biography', 'socialLinks']
    
    // Fetch social links
    try {
      const linksResponse = await fetchSocialLinks()
      socialLinks.value = linksResponse.data || linksResponse || []
    } catch (error) {
      console.error('Failed to load social links:', error)
      socialLinks.value = []
    }

    // Store original values after successful load
    originalHomepageStatus.value = homepageStatus.value
    originalHomepagePassword.value = homepagePassword.value
    originalBiography.value = biography.value
    originalHomepageInfo.value = [...homepageInfo.value]
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
    })

    // Update original values after successful save
    originalHomepageStatus.value = homepageStatus.value
    originalHomepagePassword.value = homepagePassword.value
    originalBiography.value = biography.value
    originalHomepageInfo.value = [...homepageInfo.value]

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

const handleViewSite = () => {
  window.open(homepageUrl.value, '_blank')
}
</script>
