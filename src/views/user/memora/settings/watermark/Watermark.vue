<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Watermark </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div class="w-[50%]">
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">Watermark</h1>
        <p class="text-sm mb-4" :class="theme.textSecondary">
          Protect your photos with custom watermarks and control how they're applied to downloads.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Content -->
      <div class="space-y-6 w-[50%]">
        <!-- Watermark Management Section -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">Watermark</h3>

          <!-- Watermark Previews -->
          <div class="flex items-start gap-4 flex-wrap">
            <!-- Loading State - Skeleton Cards -->
            <template v-if="isLoading">
              <div v-for="i in 3" :key="`skeleton-${i}`" class="flex flex-col items-center gap-2">
                <div
                  class="w-32 h-32 rounded border-2 animate-pulse"
                  :class="[theme.borderSecondary, theme.bgSkeleton]"
                ></div>
                <div class="h-3 w-20 rounded animate-pulse" :class="theme.bgSkeleton"></div>
              </div>
            </template>

            <!-- Existing Watermarks -->
            <template v-else>
              <div
                v-for="watermark in watermarks"
                :key="watermark.id"
                class="flex flex-col items-center gap-2 cursor-pointer group relative"
                @click="handleEditWatermark(watermark.id)"
              >
                <div
                  class="w-32 h-32 rounded border-2 flex items-center justify-center transition-colors hover:border-teal-500 overflow-hidden relative"
                  :class="[theme.borderSecondary, theme.bgCard]"
                >
                  <span
                    v-if="watermark.type === 'text'"
                    class="text-lg"
                    :style="{
                      fontFamily: watermark.fontFamily || 'Pacifico',
                      color: watermark.color || getAutoContrastColor(watermark.color),
                      textShadow: watermark.textShadow || 'none',
                      backgroundColor: watermark.backgroundColor || 'transparent',
                      lineHeight: watermark.lineHeight || 1.5,
                      letterSpacing: watermark.letterSpacing
                        ? `${watermark.letterSpacing}px`
                        : '0px',
                      padding: watermark.padding ? `${watermark.padding}px` : '0px',
                      textTransform: watermark.textTransform || 'none',
                      borderRadius: watermark.borderRadius ? `${watermark.borderRadius}px` : '0px',
                      borderWidth: watermark.borderWidth ? `${watermark.borderWidth}px` : '0px',
                      borderColor:
                        watermark.borderWidth && watermark.borderWidth > 0
                          ? watermark.borderColor || '#000000'
                          : 'transparent',
                      borderStyle:
                        watermark.borderWidth && watermark.borderWidth > 0
                          ? watermark.borderStyle || 'solid'
                          : 'none',
                      ...getFontStyleProperties(watermark.fontStyle),
                    }"
                  >
                    {{ watermark.text }}
                  </span>
                  <img
                    v-else-if="watermark.type === 'image' && watermark.imageUrl"
                    :src="watermark.imageUrl"
                    :alt="watermark.name"
                    class="w-full h-full object-contain p-2"
                  />
                  <!-- Delete Button on Hover -->
                  <button
                    @click.stop="handleDeleteWatermark(watermark.id)"
                    class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    :class="theme.bgCard"
                  >
                    <X class="h-3.5 w-3.5" />
                  </button>
                </div>
                <span class="text-xs font-medium uppercase" :class="theme.textSecondary">
                  {{ watermark.name }}
                </span>
              </div>
            </template>

            <!-- Add New Watermark -->
            <div
              class="flex flex-col items-center gap-2 cursor-pointer"
              @click="handleAddWatermark()"
            >
              <div
                class="w-32 h-32 rounded border-2 border-dashed flex items-center justify-center transition-colors hover:border-teal-500"
                :class="[theme.borderSecondary, theme.bgCard]"
              >
                <Plus class="h-8 w-8" :class="theme.textTertiary" />
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs" :class="theme.textSecondary">
            Protect your photos with custom watermarks. Watermarks will not appear on prints ordered
            through Store.
            <a href="#" class="text-teal-500 hover:text-teal-600 underline">Learn more</a>.
          </p>
        </div>

        <!-- Apply Watermark to Web Size Downloads Section -->
        <div class="flex items-center justify-between py-4">
          <div class="flex-1">
            <h3 class="text-base font-semibold mb-1" :class="theme.textPrimary">
              Apply watermark to web size downloads
            </h3>
            <p class="text-xs" :class="theme.textSecondary">
              Enable to apply watermark to web size downloads from your collections and web size
              downloads sold through Store.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer group">
            <input type="checkbox" v-model="applyToWebDownloads" class="sr-only peer" />
            <div
              class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
            ></div>
            <span
              class="ml-3 text-sm font-medium"
              :class="applyToWebDownloads ? theme.textPrimary : theme.textSecondary"
            >
              {{ applyToWebDownloads ? 'On' : 'Off' }}
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <CenterModal
      v-model="showDeleteModal"
      title="Delete Watermark"
      description="This action cannot be undone."
      content-class="sm:max-w-[425px]"
    >
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <p class="text-sm" :class="theme.textSecondary">
            Are you sure you want to delete
            <span class="font-semibold" :class="theme.textPrimary">
              {{ watermarkToDelete?.name || 'this watermark' }} </span
            >?
          </p>
          <p class="text-xs" :class="theme.textTertiary">
            This watermark will be permanently removed from your account.
          </p>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="handleCancelDelete" :disabled="isDeleting">
          Cancel
        </Button>
        <Button
          class="bg-red-500 hover:bg-red-600 text-white"
          @click="handleConfirmDelete"
          :disabled="isDeleting"
        >
          <span v-if="isDeleting" class="flex items-center gap-2">
            <span
              class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></span>
            Deleting...
          </span>
          <span v-else>Delete</span>
        </Button>
      </template>
    </CenterModal>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Plus, X } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Separator } from '@/components/shadcn/separator'
import { Button } from '@/components/shadcn/button'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { useWatermarkStore } from '@/stores/watermark'
import { useThemeStore } from '@/stores/theme'

const description = ''

const router = useRouter()
const theme = useThemeClasses()
const watermarkStore = useWatermarkStore()
const themeStore = useThemeStore()

// Form state
const applyToWebDownloads = ref(true)

// Delete confirmation state
const showDeleteModal = ref(false)
const watermarkToDelete = ref(null)
const isDeleting = ref(false)

// Use storeToRefs to maintain reactivity
const { watermarks, isLoading } = storeToRefs(watermarkStore)

/**
 * Get font style properties from saved style string
 * Handles combinations like "bold-italic-underline"
 */
const getFontStyleProperties = style => {
  if (!style) {
    return {
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    }
  }

  const styles = style.split('-')
  return {
    fontWeight: styles.includes('bold') ? 'bold' : 'normal',
    fontStyle: styles.includes('italic') ? 'italic' : 'normal',
    textDecoration: styles.includes('underline') ? 'underline' : 'none',
  }
}

/**
 * Get auto-contrast text color based on theme and saved color
 * Ensures good visibility while respecting user's color choice
 */
const getAutoContrastColor = savedColor => {
  const isDark = themeStore.effectiveTheme === 'dark'

  // If no saved color, use theme-appropriate default
  if (!savedColor) {
    return isDark ? '#E5E7EB' : '#1F2937' // light gray for dark theme, dark gray for light theme
  }

  // Parse the saved color
  const hex = savedColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // For dark theme, but ensure minimum contrast
  // For light theme, but ensure minimum contrast
  if (isDark) {
    // If color is too dark for dark theme, lighten it
    if (luminance < 0.4) {
      // Lighten by increasing RGB values
      const factor = 0.4 / luminance
      const newR = Math.min(255, Math.round(r * factor))
      const newG = Math.min(255, Math.round(g * factor))
      const newB = Math.min(255, Math.round(b * factor))
      return `rgb(${newR}, ${newG}, ${newB})`
    }
  } else {
    // If color is too light for light theme, darken it
    if (luminance > 0.6) {
      // Darken by decreasing RGB values
      const factor = 0.6 / luminance
      const newR = Math.max(0, Math.round(r * factor))
      const newG = Math.max(0, Math.round(g * factor))
      const newB = Math.max(0, Math.round(b * factor))
      return `rgb(${newR}, ${newG}, ${newB})`
    }
  }

  // Return original color if it has good contrast
  return savedColor
}

/**
 * Get text shadow for better visibility
 */
const getTextShadow = () => {
  const isDark = themeStore.effectiveTheme === 'dark'
  // Dark shadow for light theme, light shadow for dark theme
  return isDark
    ? '0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.5)'
    : '0 2px 8px rgba(255, 255, 255, 0.9), 0 1px 3px rgba(255, 255, 255, 0.7)'
}

// Fetch watermarks on mount
onMounted(async () => {
  try {
    await watermarkStore.fetchWatermarks()
  } catch (error) {
    console.error('Failed to fetch watermarks:', error)
    toast.error('Failed to load watermarks', {
      description,
    })
  }
})

const handleEditWatermark = id => {
  router.push({ name: 'editWatermark', params: { id } })
}

const handleAddWatermark = () => {
  router.push({ name: 'addWatermark' })
}

const handleDeleteWatermark = id => {
  const watermark = watermarks.value.find(w => w.id === id)
  if (watermark) {
    watermarkToDelete.value = watermark
    showDeleteModal.value = true
  }
}

const handleConfirmDelete = async () => {
  if (!watermarkToDelete.value) return

  isDeleting.value = true
  try {
    await watermarkStore.deleteWatermark(watermarkToDelete.value.id)
    toast.success('Watermark deleted successfully', {
      description,
    })
    showDeleteModal.value = false
    watermarkToDelete.value = null
  } catch (error) {
    toast.error('Failed to delete watermark', {
      description,
    })
  } finally {
    isDeleting.value = false
  }
}

const handleCancelDelete = () => {
  showDeleteModal.value = false
  watermarkToDelete.value = null
}
</script>
