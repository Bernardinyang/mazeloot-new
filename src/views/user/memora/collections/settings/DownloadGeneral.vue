<template>
  <div class="space-y-6">
    <!-- Photo Download -->
    <div
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
      :class="[theme.borderSecondary, theme.bgCard]"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Photo Download</h3>
          <p class="text-xs leading-relaxed" :class="theme.textSecondary">
            Allow visitors to download photos in your gallery.
          </p>
        </div>
        <div class="flex-shrink-0 pt-1">
          <ToggleSwitch v-model="photoDownload" label="" />
        </div>
      </div>
    </div>

    <!-- Photo Download Sizes -->
    <div
      v-if="photoDownload"
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
      :class="[theme.borderSecondary, theme.bgCard]"
    >
      <div>
        <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Photo Download Sizes</h3>
        <p class="text-xs leading-relaxed mb-4" :class="theme.textSecondary">
          Allow photos to be downloaded in select sizes.
          <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
            >Learn more</a
          >
        </p>
      </div>
      <div class="space-y-4">
        <!-- High Resolution -->
        <div class="space-y-3">
          <label
            class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <input
              type="checkbox"
              v-model="highResolutionEnabled"
              class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition-all"
            />
            <span class="text-sm font-medium" :class="theme.textPrimary">High Resolution</span>
          </label>
          <div v-if="highResolutionEnabled" class="ml-7 space-y-2.5">
            <div
              class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                type="radio"
                name="highRes"
                value="original"
                disabled
                class="w-4 h-4 opacity-50 cursor-not-allowed"
              />
              <span class="text-sm" :class="theme.textSecondary">
                Original - Upgrade required.
                <a
                  href="#"
                  class="text-teal-600 dark:text-teal-400 hover:underline font-medium transition-colors"
                  >Upgrade</a
                >
              </span>
            </div>
            <div
              class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                type="radio"
                name="highRes"
                value="3600px"
                disabled
                class="w-4 h-4 opacity-50 cursor-not-allowed"
              />
              <span class="text-sm" :class="theme.textSecondary">3600px</span>
            </div>
          </div>
        </div>

        <!-- Web Size -->
        <div class="space-y-3">
          <label
            class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <input
              type="checkbox"
              v-model="webSizeEnabled"
              class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition-all"
            />
            <span class="text-sm font-medium" :class="theme.textPrimary">Web Size</span>
          </label>
          <div v-if="webSizeEnabled" class="ml-7 space-y-2.5">
            <label
              class="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                type="radio"
                name="webSize"
                value="2048px"
                v-model="webSize"
                class="w-4 h-4 text-teal-600 focus:ring-teal-500"
              />
              <span class="text-sm font-medium" :class="theme.textPrimary">2048px</span>
            </label>
            <label
              class="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                type="radio"
                name="webSize"
                value="1024px"
                v-model="webSize"
                class="w-4 h-4 text-teal-600 focus:ring-teal-500"
              />
              <span class="text-sm font-medium" :class="theme.textPrimary">1024px</span>
            </label>
            <label
              class="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                type="radio"
                name="webSize"
                value="640px"
                v-model="webSize"
                class="w-4 h-4 text-teal-600 focus:ring-teal-500"
              />
              <span class="text-sm font-medium" :class="theme.textPrimary">640px</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Download PIN -->
    <div
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
      :class="[theme.borderSecondary, theme.bgCard]"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Download PIN</h3>
          <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
            Require visitors to enter a 4-digit PIN to download photos and videos.
          </p>
        </div>
        <div class="flex-shrink-0 pt-1">
          <ToggleSwitch v-model="downloadPinEnabled" label="" />
        </div>
      </div>
      <div v-if="downloadPinEnabled" class="flex items-center gap-3">
        <div
          class="px-4 py-2.5 rounded-lg border-2 font-mono text-lg font-semibold bg-gray-50 dark:bg-gray-800/50"
          :class="[theme.borderSecondary, theme.textPrimary]"
        >
          {{ downloadPin }}
        </div>
        <Button
          variant="outline"
          size="sm"
          @click="resetPin"
          class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-105 active:scale-95"
          :class="[theme.borderSecondary, theme.textPrimary]"
        >
          <RefreshCw
            class="h-4 w-4 mr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
          />
          Reset PIN
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/shadcn/button'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { RefreshCw } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const theme = useThemeClasses()

const photoDownload = ref(true)
const highResolutionEnabled = ref(true)
const webSizeEnabled = ref(true)
const webSize = ref('1024px')
const downloadPinEnabled = ref(true)
const downloadPin = ref('2434')

const resetPin = () => {
  downloadPin.value = Math.floor(1000 + Math.random() * 9000).toString()
  toast.success('PIN reset successfully')
}
</script>
