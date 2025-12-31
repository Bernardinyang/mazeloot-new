<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Preference </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div class="w-[50%]">
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
          Preference
        </h1>
        <p class="text-sm mb-4" :class="theme.textSecondary">
          Configure your collection preferences and settings.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Content -->
      <div class="space-y-6 w-[50%]">
        <!-- Filename Display Section -->
        <div class="space-y-2">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">Filename Display</h3>
          <Select v-model="filenameDisplay">
            <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
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
          <p class="text-xs" :class="theme.textSecondary">
            You can choose to show / hide your filenames on photos in your collections.
          </p>
        </div>

        <!-- Search Engine Visibility Section -->
        <div class="space-y-2">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">
            Search Engine Visibility
          </h3>
          <Select v-model="searchEngineVisibility">
            <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
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
          <p class="text-xs" :class="theme.textSecondary">
            Choose whether you want your collections to be searchable on search engines (e.g.
            Google).
            <a href="#" class="text-teal-500 hover:text-teal-600 underline">Learn more</a>.
          </p>
        </div>

        <!-- Sharpening Level Section -->
        <div class="space-y-2">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">Sharpening Level</h3>
          <Select v-model="sharpeningLevel">
            <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
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
          <p class="text-xs" :class="theme.textSecondary">
            This setting only applies to web display copies of your photos. Your originals are not
            altered.
            <a href="#" class="text-teal-500 hover:text-teal-600 underline">Learn more</a>.
          </p>
        </div>

        <!-- RAW Photo Support Section -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold" :class="theme.textPrimary">RAW Photo Support</h3>
            <UpgradePopover v-if="isDisabled" v-model:open="showRawPhotoPopover" />
          </div>
          <div class="flex items-center justify-between">
            <label
              class="relative inline-flex items-center group"
              :class="isDisabled ? 'cursor-not-allowed opacity-50' : ''"
            >
              <input
                type="checkbox"
                v-model="rawPhotoSupport"
                :disabled="isDisabled"
                class="sr-only peer"
              />
              <div
                class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
              ></div>
              <span
                class="ml-3 text-sm font-medium"
                :class="rawPhotoSupport ? theme.textPrimary : theme.textSecondary"
              >
                {{ rawPhotoSupport ? 'On' : 'Off' }}
              </span>
            </label>
          </div>
          <p class="text-xs" :class="theme.textSecondary">Pro Feature formats.</p>
        </div>

        <!-- Terms of Service Section -->
        <div class="space-y-2">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">Terms of Service</h3>
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
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                theme.placeholderInput,
                'rounded-t-none',
              ]"
            />
          </div>
          <p class="text-xs" :class="theme.textSecondary">
            Set the Terms of service that your customers are subject to. This will be shown in the
            footer of your collections.
          </p>
        </div>

        <!-- Privacy Policy Section -->
        <div class="space-y-2">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">Privacy Policy</h3>
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
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                theme.placeholderInput,
                'rounded-t-none',
              ]"
            />
          </div>
          <p class="text-xs" :class="theme.textSecondary">
            Set the Privacy Policy that your customers are subject to. This will be shown in the
            footer of your collections.
          </p>
        </div>

        <!-- Enable Cookie Banner Section -->
        <div class="space-y-2">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">Enable Cookie Banner</h3>
          <div class="flex items-center justify-between">
            <label class="relative inline-flex items-center group cursor-pointer">
              <input type="checkbox" v-model="enableCookieBanner" class="sr-only peer" />
              <div
                class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
              ></div>
              <span
                class="ml-3 text-sm font-medium"
                :class="enableCookieBanner ? theme.textPrimary : theme.textSecondary"
              >
                {{ enableCookieBanner ? 'On' : 'Off' }}
              </span>
            </label>
          </div>
          <p class="text-xs" :class="theme.textSecondary">
            Enable banner to notify visitors that your site uses cookies. This will only appear for
            EU visitors.
          </p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Bold, Italic, Underline, Link, Unlink } from 'lucide-vue-next'
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
import UpgradePopover from '@/components/molecules/UpgradePopover.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

// Form state
const isDisabled = ref(true)
const filenameDisplay = ref('show')
const searchEngineVisibility = ref('homepage-only')
const sharpeningLevel = ref('optimal')
const rawPhotoSupport = ref(false)
const termsOfService = ref('')
const privacyPolicy = ref('')
const enableCookieBanner = ref(false)
const showRawPhotoPopover = ref(false)

const filenameDisplayOptions = []

const searchEngineVisibilityOptions = []

const sharpeningLevelOptions = []
</script>
