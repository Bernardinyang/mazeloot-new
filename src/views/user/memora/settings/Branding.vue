<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Branding </template>

    <div class="space-y-8 w-1/2">
      <!-- Page Header -->
      <div>
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">Branding</h1>
        <p class="text-sm mb-6" :class="theme.textSecondary">
          Customize your brand identity, logo, colors, and visual elements for your client galleries.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <Loader2 class="h-8 w-8 animate-spin" :class="theme.textTertiary" />
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Domain Settings Card -->
        <div class="rounded-xl border p-6 space-y-5" :class="[theme.bgCard, theme.borderCard]">
          <div>
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Domain Settings</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Configure your domain and custom domain settings
            </p>
          </div>

          <div class="space-y-5">
            <!-- Default Domain -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Default Domain</label>
              <Input
                v-model="domain"
                type="text"
                readonly
                :disabled="isDisabled || isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  'font-mono text-sm',
                  isDisabled || isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Your client galleries are always available at this address. To change your default domain, edit your username under
                <a href="#" class="text-teal-500 hover:text-teal-600 underline font-medium">Account Settings</a>.
              </p>
            </div>

            <!-- Custom Domain -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium" :class="theme.textPrimary">Custom Domain</label>
                <UpgradePopover v-if="isDisabled" v-model:open="showCustomDomainPopover" />
              </div>
              <Input
                v-model="customDomain"
                type="text"
                placeholder="www.yourdomain.com"
                :disabled="isDisabled || isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'font-mono text-sm',
                  isDisabled || isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Use your own custom domain for your client galleries. This feature is available with an upgraded account.
                <a href="#" class="text-teal-500 hover:text-teal-600 underline font-medium">Learn more</a>.
              </p>
            </div>
          </div>
        </div>

        <!-- Brand Assets Card -->
        <div class="rounded-xl border p-6 space-y-6" :class="[theme.bgCard, theme.borderCard]">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Brand Assets</h2>
              <p class="text-sm" :class="theme.textSecondary">
                Upload your logo and favicon to customize your brand appearance
              </p>
            </div>
            <UpgradePopover v-if="isDisabled" v-model:open="showBrandControlPopover" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Logo Upload -->
            <div class="space-y-3">
              <label class="text-sm font-medium" :class="theme.textPrimary">Logo</label>
              <div
                class="w-full aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:border-teal-500/50"
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                  isDisabled || isUploadingLogo
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:bg-teal-50/5',
                ]"
                @click="!isDisabled && !isUploadingLogo && handleUploadLogo()"
              >
                <Loader2
                  v-if="isUploadingLogo"
                  class="h-10 w-10 animate-spin"
                  :class="theme.textTertiary"
                />
                <template v-else-if="logoPreview">
                  <img
                    :src="logoPreview"
                    alt="Logo preview"
                    class="w-full h-full object-contain p-4"
                  />
                  <p class="text-xs font-medium" :class="theme.textSecondary">Click to change</p>
                </template>
                <template v-else>
                  <Plus class="h-10 w-10" :class="theme.textTertiary" />
                  <p class="text-xs font-medium" :class="theme.textSecondary">Upload Logo</p>
                </template>
              </div>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Your logo will be used in place of the text logo and profile icon. For best display, use a light/white logo with a transparent background.
              </p>
            </div>

            <!-- Favicon Upload -->
            <div class="space-y-3">
              <label class="text-sm font-medium" :class="theme.textPrimary">Favicon</label>
              <div
                class="w-full aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:border-teal-500/50"
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                  isDisabled || isUploadingFavicon
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:bg-teal-50/5',
                ]"
                @click="!isDisabled && !isUploadingFavicon && handleUploadFavicon()"
              >
                <Loader2
                  v-if="isUploadingFavicon"
                  class="h-8 w-8 animate-spin"
                  :class="theme.textTertiary"
                />
                <template v-else-if="faviconPreview">
                  <img
                    :src="faviconPreview"
                    alt="Favicon preview"
                    class="w-16 h-16 object-contain"
                  />
                  <p class="text-xs font-medium" :class="theme.textSecondary">Click to change</p>
                </template>
                <template v-else>
                  <Plus class="h-8 w-8" :class="theme.textTertiary" />
                  <p class="text-xs font-medium" :class="theme.textSecondary">Upload Favicon</p>
                </template>
              </div>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Upload a GIF, PNG or ICO file up to 32x32 pixels. This appears in browser tabs and bookmarks.
              </p>
            </div>
          </div>
        </div>

        <!-- Branding Options Card -->
        <div class="rounded-xl border p-6" :class="[theme.bgCard, theme.borderCard]">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">
                Mazeloot Branding
              </h2>
              <p class="text-sm" :class="theme.textSecondary">
                Control whether Mazeloot branding appears on your collections and homepage
              </p>
            </div>
            <div class="flex items-center gap-3 ml-6">
              <label
                class="relative inline-flex items-center group"
                :class="isDisabled || isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
              >
                <input
                  type="checkbox"
                  v-model="showMazelootBranding"
                  :disabled="isDisabled || isLoading"
                  class="sr-only peer"
                />
                <div
                  class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
                ></div>
                <span
                  class="ml-3 text-sm font-medium min-w-[40px]"
                  :class="showMazelootBranding ? theme.textPrimary : theme.textSecondary"
                >
                  {{ showMazelootBranding ? 'On' : 'Off' }}
                </span>
              </label>
            </div>
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
import { ref, onMounted, computed } from 'vue'
import { Plus, Loader2, Check } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Input from '@/components/shadcn/input/Input.vue'
import { Separator } from '@/components/shadcn/separator'
import { Button } from '@/components/shadcn/button'
import UpgradePopover from '@/components/molecules/UpgradePopover.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from '@/utils/toast'
import { useSettingsApi } from '@/api/settings'
import { apiClient } from '@/api/client'

const theme = useThemeClasses()
const { fetchSettings, updateBranding } = useSettingsApi()

// Form state
const domain = ref('')
const customDomain = ref('')
const logoPreview = ref(null)
const faviconPreview = ref(null)
const logoUuid = ref(null)
const faviconUuid = ref(null)
const showMazelootBranding = ref(true)
const showCustomDomainPopover = ref(false)
const showBrandControlPopover = ref(false)
const isDisabled = ref(false)

// Loading states
const isLoading = ref(false)
const isUploadingLogo = ref(false)
const isUploadingFavicon = ref(false)
const isSaving = ref(false)

// Original values for change tracking
const originalCustomDomain = ref('')
const originalShowMazelootBranding = ref(true)
const originalLogoUuid = ref(null)
const originalFaviconUuid = ref(null)

// Computed to check if there are changes
const hasChanges = computed(() => {
  return (
    customDomain.value !== originalCustomDomain.value ||
    showMazelootBranding.value !== originalShowMazelootBranding.value ||
    logoUuid.value !== originalLogoUuid.value ||
    faviconUuid.value !== originalFaviconUuid.value
  )
})

// Fetch settings on mount
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetchSettings()
    const settings = response.data || response
    
    domain.value = settings.branding?.domain || ''
    customDomain.value = settings.branding?.customDomain || ''
    logoPreview.value = settings.branding?.logoUrl || null
    faviconPreview.value = settings.branding?.faviconUrl || null
    logoUuid.value = settings.branding?.logoUuid || null
    faviconUuid.value = settings.branding?.faviconUuid || null
    showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true

    // Store original values
    originalCustomDomain.value = customDomain.value
    originalShowMazelootBranding.value = showMazelootBranding.value
    originalLogoUuid.value = logoUuid.value
    originalFaviconUuid.value = faviconUuid.value
  } catch (error) {
    toast.error('Failed to load settings', {
      description: error.message || 'Please try again',
    })
  } finally {
    isLoading.value = false
  }
})

// Manual save function
const handleSave = async () => {
  if (!hasChanges.value) return

  isSaving.value = true
  try {
    await updateBranding({
      customDomain: customDomain.value,
      showMazelootBranding: showMazelootBranding.value,
      logoUuid: logoUuid.value,
      faviconUuid: faviconUuid.value,
    })

    // Update original values after successful save
    originalCustomDomain.value = customDomain.value
    originalShowMazelootBranding.value = showMazelootBranding.value
    originalLogoUuid.value = logoUuid.value
    originalFaviconUuid.value = faviconUuid.value

    toast.success('Settings saved successfully')
  } catch (error) {
    toast.error('Failed to save settings', {
      description: error.message || 'Please try again',
    })
  } finally {
    isSaving.value = false
  }
}

const handleUploadLogo = async () => {
  if (isDisabled.value || isUploadingLogo.value) return
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async e => {
    const file = e.target.files?.[0]
    if (!file) return

    isUploadingLogo.value = true
    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = event => {
        logoPreview.value = event.target?.result
      }
      reader.readAsDataURL(file)

      // Upload file
      const uploadEndpoint = '/v1/images/upload'
      const uploadResponse = await apiClient.upload(uploadEndpoint, file, {
        purpose: 'branding_logo',
      })

      const userFileUuid =
        uploadResponse.data?.userFileUuid ||
        uploadResponse.data?.data?.userFileUuid ||
        uploadResponse.userFileUuid

      if (!userFileUuid) {
        throw new Error('Upload response missing userFileUuid')
      }

      logoUuid.value = userFileUuid

      toast.success('Logo uploaded. Click "Save Changes" to apply.')
    } catch (error) {
      logoPreview.value = null
      toast.error('Failed to upload logo', {
        description: error.message || 'Please try again',
      })
    } finally {
      isUploadingLogo.value = false
    }
  }
  input.click()
}

const handleUploadFavicon = async () => {
  if (isDisabled.value || isUploadingFavicon.value) return
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*,.gif,.ico'
  input.onchange = async e => {
    const file = e.target.files?.[0]
    if (!file) return

    isUploadingFavicon.value = true
    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = event => {
        faviconPreview.value = event.target?.result
      }
      reader.readAsDataURL(file)

      // Upload file
      const uploadEndpoint = '/v1/images/upload'
      const uploadResponse = await apiClient.upload(uploadEndpoint, file, {
        purpose: 'branding_favicon',
      })

      const userFileUuid =
        uploadResponse.data?.userFileUuid ||
        uploadResponse.data?.data?.userFileUuid ||
        uploadResponse.userFileUuid

      if (!userFileUuid) {
        throw new Error('Upload response missing userFileUuid')
      }

      faviconUuid.value = userFileUuid

      toast.success('Favicon uploaded. Click "Save Changes" to apply.')
    } catch (error) {
      faviconPreview.value = null
      toast.error('Failed to upload favicon', {
        description: error.message || 'Please try again',
      })
    } finally {
      isUploadingFavicon.value = false
    }
  }
  input.click()
}
</script>
