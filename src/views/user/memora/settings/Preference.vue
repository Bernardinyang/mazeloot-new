<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Preference </template>

    <div class="space-y-8 w-1/2">
      <!-- Page Header -->
      <div>
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
          Preference
        </h1>
        <p class="text-sm mb-6" :class="theme.textSecondary">
          Configure your collection preferences and settings.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <Loader2 class="h-8 w-8 animate-spin" :class="theme.textTertiary" />
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Collection Display Settings Card -->
        <div class="rounded-xl border p-6 space-y-5" :class="[theme.bgCard, theme.borderCard]">
          <div>
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Collection Display</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Configure how your collections are displayed and indexed
            </p>
          </div>

          <div class="space-y-5">
            <!-- Filename Display -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Filename Display</label>
              <Select v-model="filenameDisplay" :disabled="isDisabled || isLoading">
                <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput, (isDisabled || isLoading) ? 'cursor-not-allowed opacity-50' : '']">
                  <SelectValue placeholder="Select display option" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                  <SelectItem
                    v-for="option in filenameDisplayOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Choose whether to show or hide filenames on photos in your collections.
              </p>
            </div>

            <!-- Search Engine Visibility -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">
                Search Engine Visibility
              </label>
              <Select v-model="searchEngineVisibility" :disabled="isDisabled || isLoading">
                <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput, (isDisabled || isLoading) ? 'cursor-not-allowed opacity-50' : '']">
                  <SelectValue placeholder="Select visibility option" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                  <SelectItem
                    v-for="option in searchEngineVisibilityOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Choose whether you want your collections to be searchable on search engines (e.g. Google).
                <a href="#" class="text-teal-500 hover:text-teal-600 underline font-medium">Learn more</a>.
              </p>
            </div>
          </div>
        </div>

        <!-- Photo Quality Settings Card -->
        <div class="rounded-xl border p-6 space-y-5" :class="[theme.bgCard, theme.borderCard]">
          <div>
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Photo Quality</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Configure image processing and format support
            </p>
          </div>

          <div class="space-y-5">
            <!-- Sharpening Level -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Sharpening Level</label>
              <Select v-model="sharpeningLevel" :disabled="isDisabled || isLoading">
                <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput, (isDisabled || isLoading) ? 'cursor-not-allowed opacity-50' : '']">
                  <SelectValue placeholder="Select sharpening level" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                  <SelectItem
                    v-for="option in sharpeningLevelOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                This setting only applies to web display copies of your photos. Your originals are not altered.
                <a href="#" class="text-teal-500 hover:text-teal-600 underline font-medium">Learn more</a>.
              </p>
            </div>

            <!-- RAW Photo Support -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium" :class="theme.textPrimary">RAW Photo Support</label>
                <UpgradePopover v-if="isDisabled" v-model:open="showRawPhotoPopover" />
              </div>
              <div class="flex items-center gap-3">
                <label
                  class="relative inline-flex items-center group"
                  :class="isDisabled || isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
                >
                  <input
                    type="checkbox"
                    v-model="rawPhotoSupport"
                    :disabled="isDisabled || isLoading"
                    class="sr-only peer"
                  />
                  <div
                    class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-accent bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
                  ></div>
                  <span
                    class="ml-3 text-sm font-medium"
                    :class="rawPhotoSupport ? theme.textPrimary : theme.textSecondary"
                  >
                    {{ rawPhotoSupport ? 'On' : 'Off' }}
                  </span>
                </label>
              </div>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Enable support for professional RAW photo formats.
              </p>
            </div>
          </div>
        </div>

        <!-- Legal Documents Card -->
        <div class="rounded-xl border p-6 space-y-5" :class="[theme.bgCard, theme.borderCard]">
          <div>
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Legal Documents</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Set up terms of service and privacy policy for your collections
            </p>
          </div>

          <div class="space-y-5">
            <!-- Terms of Service -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Terms of Service</label>
          <div class="space-y-2">
            <!-- Rich Text Editor Toolbar -->
            <div
              class="flex items-center gap-2 p-2 rounded-t border-b"
              :class="[theme.bgCard, theme.borderSecondary]"
            >
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Bold class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Italic class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Underline class="h-4 w-4" />
              </button>
              <div class="w-px h-6 mx-1" :class="theme.bgDropdownSeparator"></div>
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Link class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Unlink class="h-4 w-4" />
              </button>
            </div>
            <!-- Text Area -->
            <Textarea
              v-model="termsOfService"
              rows="8"
              placeholder="Enter your terms of service..."
              :disabled="isDisabled || isLoading"
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                theme.placeholderInput,
                'rounded-t-none',
                (isDisabled || isLoading) ? 'cursor-not-allowed opacity-50' : '',
              ]"
            />
          </div>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Set the Terms of Service that your customers are subject to. This will be shown in the footer of your collections.
              </p>
            </div>

            <!-- Privacy Policy -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Privacy Policy</label>
          <div class="space-y-2">
            <!-- Rich Text Editor Toolbar -->
            <div
              class="flex items-center gap-2 p-2 rounded-t border-b"
              :class="[theme.bgCard, theme.borderSecondary]"
            >
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Bold class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Italic class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Underline class="h-4 w-4" />
              </button>
              <div class="w-px h-6 mx-1" :class="theme.bgDropdownSeparator"></div>
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Link class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="theme.textSecondary"
              >
                <Unlink class="h-4 w-4" />
              </button>
            </div>
            <!-- Text Area -->
            <Textarea
              v-model="privacyPolicy"
              rows="8"
              placeholder="Enter your privacy policy..."
              :disabled="isDisabled || isLoading"
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                theme.placeholderInput,
                'rounded-t-none',
                (isDisabled || isLoading) ? 'cursor-not-allowed opacity-50' : '',
              ]"
            />
          </div>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Set the Privacy Policy that your customers are subject to. This will be shown in the footer of your collections.
              </p>
            </div>

            <!-- Cookie Banner -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Enable Cookie Banner</label>
              <div class="flex items-center gap-3">
                <label class="relative inline-flex items-center group" :class="(isDisabled || isLoading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'">
                  <input type="checkbox" v-model="enableCookieBanner" :disabled="isDisabled || isLoading" class="sr-only peer" />
                  <div
                    class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-accent bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
                  ></div>
                  <span
                    class="ml-3 text-sm font-medium"
                    :class="enableCookieBanner ? theme.textPrimary : theme.textSecondary"
                  >
                    {{ enableCookieBanner ? 'On' : 'Off' }}
                  </span>
                </label>
              </div>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Enable banner to notify visitors that your site uses cookies. This will only appear for EU visitors.
              </p>
            </div>
          </div>
        </div>

        <!-- Regional Settings Card -->
        <div class="rounded-xl border p-6 space-y-5" :class="[theme.bgCard, theme.borderCard]">
          <div>
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Regional Settings</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Configure language and timezone preferences
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Language -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Language</label>
              <Select v-model="language" :disabled="isDisabled || isLoading">
                <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput, (isDisabled || isLoading) ? 'cursor-not-allowed opacity-50' : '']">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                  <SelectItem
                    v-for="option in languageOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Select your preferred language for the interface.
              </p>
            </div>

            <!-- Timezone -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Timezone</label>
              <Select v-model="timezone" :disabled="isDisabled || isLoading">
                <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput, (isDisabled || isLoading) ? 'cursor-not-allowed opacity-50' : '']">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                  <SelectItem
                    v-for="option in timezoneOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Select your timezone for accurate date and time display.
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
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Bold, Italic, Underline, Link, Unlink, Loader2, Check } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Separator } from '@/components/shadcn/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Textarea } from '@/components/shadcn/textarea'
import { Button } from '@/components/shadcn/button'
import UpgradePopover from '@/components/molecules/UpgradePopover.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSettingsApi } from '@/api/settings'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const { fetchSettings, updatePreference } = useSettingsApi()

// Form state
const isDisabled = ref(false)
const filenameDisplay = ref('show')
const searchEngineVisibility = ref('homepage-only')
const sharpeningLevel = ref('optimal')
const rawPhotoSupport = ref(false)
const termsOfService = ref('')
const privacyPolicy = ref('')
const enableCookieBanner = ref(false)
const language = ref('en')
const timezone = ref('UTC')
const showRawPhotoPopover = ref(false)

// Loading states
const isLoading = ref(false)
const isSaving = ref(false)

// Original values for change tracking
const originalValues = ref({})

// Computed to check if there are changes
const hasChanges = computed(() => {
  return (
    filenameDisplay.value !== originalValues.value.filenameDisplay ||
    searchEngineVisibility.value !== originalValues.value.searchEngineVisibility ||
    sharpeningLevel.value !== originalValues.value.sharpeningLevel ||
    rawPhotoSupport.value !== originalValues.value.rawPhotoSupport ||
    termsOfService.value !== originalValues.value.termsOfService ||
    privacyPolicy.value !== originalValues.value.privacyPolicy ||
    enableCookieBanner.value !== originalValues.value.enableCookieBanner ||
    language.value !== originalValues.value.language ||
    timezone.value !== originalValues.value.timezone
  )
})

const filenameDisplayOptions = [
  { value: 'show', label: 'Show' },
  { value: 'hide', label: 'Hide' },
]

const searchEngineVisibilityOptions = [
  { value: 'homepage-only', label: 'Homepage Only' },
  { value: 'all', label: 'All Collections' },
  { value: 'none', label: 'None' },
]

const sharpeningLevelOptions = [
  { value: 'optimal', label: 'Optimal' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'nl', label: 'Dutch' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
]

const timezoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
]

// Fetch settings on mount
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetchSettings()
    const settings = response.data || response
    
    filenameDisplay.value = settings.preference?.filenameDisplay || 'show'
    searchEngineVisibility.value = settings.preference?.searchEngineVisibility || 'homepage-only'
    sharpeningLevel.value = settings.preference?.sharpeningLevel || 'optimal'
    rawPhotoSupport.value = settings.preference?.rawPhotoSupport ?? false
    termsOfService.value = settings.preference?.termsOfService || ''
    privacyPolicy.value = settings.preference?.privacyPolicy || ''
    enableCookieBanner.value = settings.preference?.enableCookieBanner ?? false
    language.value = settings.preference?.language || 'en'
    timezone.value = settings.preference?.timezone || 'UTC'

    // Store original values
    originalValues.value = {
      filenameDisplay: filenameDisplay.value,
      searchEngineVisibility: searchEngineVisibility.value,
      sharpeningLevel: sharpeningLevel.value,
      rawPhotoSupport: rawPhotoSupport.value,
      termsOfService: termsOfService.value,
      privacyPolicy: privacyPolicy.value,
      enableCookieBanner: enableCookieBanner.value,
      language: language.value,
      timezone: timezone.value,
    }
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
    await updatePreference({
      filenameDisplay: filenameDisplay.value,
      searchEngineVisibility: searchEngineVisibility.value,
      sharpeningLevel: sharpeningLevel.value,
      rawPhotoSupport: rawPhotoSupport.value,
      termsOfService: termsOfService.value,
      privacyPolicy: privacyPolicy.value,
      enableCookieBanner: enableCookieBanner.value,
      language: language.value,
      timezone: timezone.value,
    })

    // Update original values after successful save
    originalValues.value = {
      filenameDisplay: filenameDisplay.value,
      searchEngineVisibility: searchEngineVisibility.value,
      sharpeningLevel: sharpeningLevel.value,
      rawPhotoSupport: rawPhotoSupport.value,
      termsOfService: termsOfService.value,
      privacyPolicy: privacyPolicy.value,
      enableCookieBanner: enableCookieBanner.value,
      language: language.value,
      timezone: timezone.value,
    }

    toast.success('Settings saved successfully')
  } catch (error) {
    toast.error('Failed to save settings', {
      description: error.message || 'Please try again',
    })
  } finally {
    isSaving.value = false
  }
}
</script>
