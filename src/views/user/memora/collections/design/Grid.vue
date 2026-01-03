<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <ContentLoader v-if="isLoading" message="Loading grid config..." />
      <div v-else class="mx-auto p-8 pb-16 transition-all duration-300 h-full overflow-y-auto">
        <div class="mb-10">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 :class="theme.textPrimary" class="text-3xl font-bold">Grid</h1>
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 scale-95 -translate-x-2"
                  enter-to-class="opacity-100 scale-100 translate-x-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-x-0"
                  leave-to-class="opacity-0 scale-95 -translate-x-2"
                >
                  <div
                    v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
                    class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                    <span>Unsaved changes</span>
                  </div>
                </Transition>
              </div>
              <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
                Choose how photos are arranged in your gallery. See your changes in real-time in the
                preview panel.
              </p>
            </div>
            <!-- Quick Stats -->
            <div class="hidden md:flex gap-4">
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="px-4 py-2 rounded-lg border"
              >
                <div :class="theme.textTertiary" class="text-xs">Grid Style</div>
                <div :class="theme.textPrimary" class="text-sm font-semibold mt-0.5">
                  {{ gridStyles.find(s => s.id === formData.gridStyle)?.label || 'Vertical' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-12rem)]">
          <!-- Main Content -->
          <div class="lg:col-span-2 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto space-y-12 pr-2 min-h-0">
              <!-- Grid Style Section -->
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
              >
                <div class="mb-2">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Grid Layout</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Choose how photos are arranged in your gallery
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <button
                    v-for="style in gridStyles"
                    :key="style.id"
                    :class="[
                      formData.gridStyle === style.id
                        ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 ring-2 ring-teal-500/20 scale-[1.01]'
                        : [
                            theme.borderSecondary,
                            'hover:border-teal-500/70',
                            'active:scale-[0.98]',
                          ],
                      theme.bgCard,
                    ]"
                    class="group px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer min-w-0"
                    @click="formData.gridStyle = style.id"
                  >
                    <div class="flex items-center justify-center gap-3">
                      <div
                        :class="formData.gridStyle === style.id ? 'bg-teal-500/20' : ''"
                        class="p-2.5 rounded-lg transition-all duration-300"
                      >
                        <component
                          :is="getGridStyleIcon(style.id)"
                          :class="
                            formData.gridStyle === style.id
                              ? 'text-teal-600 dark:text-teal-400'
                              : ''
                          "
                          class="h-6 w-6 transition-colors duration-200"
                        />
                      </div>
                      <span
                        :class="
                          formData.gridStyle === style.id
                            ? 'text-teal-600 dark:text-teal-400 font-bold'
                            : theme.textSecondary
                        "
                        class="text-sm font-semibold transition-colors duration-200"
                      >
                        {{ style.label }}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Grid Columns Section -->
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
              >
                <div class="mb-2">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Images Per Row
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Select how many images appear in each row
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="cols in gridColumnsOptions"
                    :key="cols.value"
                    :class="[
                      formData.gridColumns === cols.value
                        ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 ring-2 ring-teal-500/20 scale-[1.01]'
                        : [
                            theme.borderSecondary,
                            'hover:border-teal-500/70',
                            'active:scale-[0.98]',
                          ],
                      theme.bgCard,
                    ]"
                    class="group px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer min-w-0"
                    @click="formData.gridColumns = cols.value"
                  >
                    <div class="flex items-center justify-center gap-3">
                      <div
                        :class="formData.gridColumns === cols.value ? 'bg-teal-500/20' : ''"
                        class="p-2.5 rounded-lg transition-all duration-300"
                      >
                        <Grid3x3
                          :class="
                            formData.gridColumns === cols.value
                              ? 'text-teal-600 dark:text-teal-400'
                              : ''
                          "
                          class="h-6 w-6 transition-colors duration-200"
                        />
                      </div>
                      <span
                        :class="
                          formData.gridColumns === cols.value
                            ? 'text-teal-600 dark:text-teal-400 font-bold'
                            : theme.textSecondary
                        "
                        class="text-sm font-semibold transition-colors duration-200"
                      >
                        {{ cols.label }}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Thumbnail Size Section -->
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
              >
                <div class="mb-2">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Thumbnail Orientation
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Choose the aspect ratio for gallery thumbnails
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <button
                    v-for="size in thumbnailSizes"
                    :key="size.id"
                    :class="[
                      formData.thumbnailSize === size.id
                        ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 ring-2 ring-teal-500/20 scale-[1.01]'
                        : [
                            theme.borderSecondary,
                            'hover:border-teal-500/70',
                            'active:scale-[0.98]',
                          ],
                      theme.bgCard,
                    ]"
                    :disabled="formData.gridStyle === 'masonry' && size.id === 'large'"
                    class="group px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-0"
                    @click="formData.thumbnailSize = size.id"
                  >
                    <div class="flex items-center justify-center gap-3">
                      <div
                        :class="formData.thumbnailSize === size.id ? 'bg-teal-500/20' : ''"
                        class="p-2.5 rounded-lg transition-all duration-300"
                      >
                        <Grid3x3
                          :class="
                            formData.thumbnailSize === size.id
                              ? 'text-teal-600 dark:text-teal-400'
                              : ''
                          "
                          class="h-6 w-6 transition-colors duration-200"
                        />
                      </div>
                      <span
                        :class="
                          formData.thumbnailSize === size.id
                            ? 'text-teal-600 dark:text-teal-400 font-bold'
                            : theme.textSecondary
                        "
                        class="text-sm font-semibold transition-colors duration-200"
                      >
                        {{ size.label }}
                      </span>
                    </div>
                  </button>
                </div>
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <p
                    v-if="formData.gridStyle === 'masonry'"
                    class="text-xs mt-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400"
                  >
                    Landscape orientation is not available for masonry layout
                  </p>
                </Transition>
              </div>

              <!-- Grid Spacing Section -->
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
              >
                <div class="mb-2">
                  <div class="flex items-center justify-between mb-2.5">
                    <h3 :class="theme.textPrimary" class="text-lg font-bold">Grid Spacing</h3>
                    <span
                      :class="theme.textSecondary"
                      class="text-sm font-bold px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400"
                    >
                      {{ formData.gridSpacing }}px
                    </span>
                  </div>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Adjust the gap between gallery items (1-100px)
                  </p>
                </div>
                <div class="px-2 py-2">
                  <Slider
                    v-model="gridSpacingSlider"
                    :max="100"
                    :min="1"
                    :step="1"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- Tab Icons Section -->
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
              >
                <div class="mb-2">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Tab Icons
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Choose how tab icons are displayed
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <button
                    v-for="nav in navigationStyles"
                    :key="nav.id"
                    :class="[
                      formData.navigationStyle === nav.id
                        ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 ring-2 ring-teal-500/20 scale-[1.01]'
                        : [
                            theme.borderSecondary,
                            'hover:border-teal-500/70',
                            'active:scale-[0.98]',
                          ],
                      theme.bgCard,
                    ]"
                    class="group px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer min-w-0"
                    @click="formData.navigationStyle = nav.id"
                  >
                    <div class="flex items-center justify-center gap-3">
                      <div
                        :class="[
                          formData.navigationStyle === nav.id
                            ? 'border-teal-500 bg-teal-500/10'
                            : [
                                theme.borderSecondary,
                                'group-hover:border-teal-500/50',
                                'bg-gray-100/50 dark:bg-gray-800/50',
                              ],
                        ]"
                        class="w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-all duration-300"
                      >
                        <component
                          :is="getNavigationStyleIcon(nav.id)"
                          :class="
                            formData.navigationStyle === nav.id
                              ? 'text-teal-600 dark:text-teal-400'
                              : theme.textSecondary
                          "
                          class="h-5 w-5 transition-colors duration-200"
                        />
                      </div>
                      <span
                        :class="
                          formData.navigationStyle === nav.id
                            ? 'text-teal-600 dark:text-teal-400 font-bold'
                            : theme.textSecondary
                        "
                        class="text-sm font-semibold transition-colors duration-200"
                      >
                        {{ nav.label }}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Bottom Navigation -->
            <div
              :class="theme.borderSecondary"
              class="mt-8 pt-6 border-t flex-shrink-0 bg-gradient-to-r from-transparent via-gray-50/50 dark:via-gray-900/50 to-transparent"
            >
              <div class="flex justify-between items-center">
                <Button
                  :class="[
                    theme.textSecondary,
                    theme.bgButtonHover,
                    'hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  ]"
                  :disabled="isSubmitting || isSaving"
                  class="px-4 py-2 rounded-lg font-medium"
                  variant="ghost"
                  @click="goBack"
                >
                  ← Back
                </Button>
                <div class="flex items-center gap-4">
                  <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-x-2"
                    enter-to-class="opacity-100 scale-100 translate-x-0"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-x-0"
                    leave-to-class="opacity-0 scale-95 translate-x-2"
                  >
                    <div
                      v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
                      class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50"
                    >
                      <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      <span class="text-xs font-medium text-amber-700 dark:text-amber-400"
                        >Unsaved changes</span
                      >
                    </div>
                  </Transition>
                  <Button
                    :disabled="isSubmitting || isSaving || !hasUnsavedChanges"
                    class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-200 px-6 py-2.5 font-medium"
                    @click="handleSave"
                  >
                    <Loader2 v-if="isSubmitting || isSaving" class="mr-2 h-4 w-4 animate-spin" />
                    <Check v-else-if="!hasUnsavedChanges" class="mr-2 h-4 w-4" />
                    <span v-if="isSubmitting || isSaving">Saving...</span>
                    <span v-else-if="!hasUnsavedChanges">Saved</span>
                    <span v-else>Save Changes</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview Panel -->
          <div class="lg:col-span-3">
            <div class="sticky top-24">
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="rounded-xl border-2 overflow-hidden backdrop-blur-md bg-white/80 dark:bg-gray-900/80"
              >
                <div
                  :class="theme.borderSecondary"
                  class="p-5 border-b bg-gradient-to-r from-teal-50/50 to-blue-50/50 dark:from-teal-950/30 dark:to-blue-950/30"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3
                        :class="theme.textPrimary"
                        class="text-lg font-semibold flex items-center gap-2"
                      >
                        <div class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                        Live Preview
                      </h3>
                      <p :class="theme.textSecondary" class="text-xs mt-1.5">
                        See exactly how your design will look
                      </p>
                    </div>
                    <Button
                      :class="[
                        theme.textSecondary,
                        'hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200',
                      ]"
                      class="shrink-0 hover:bg-white/80 dark:hover:bg-gray-800/80"
                      size="sm"
                      title="Open preview in new tab"
                      variant="ghost"
                      @click="handleOpenPreviewInNewTab"
                    >
                      <ExternalLink class="h-4 w-4 mr-1.5" />
                      <span class="text-xs font-medium">Open</span>
                    </Button>
                  </div>
                </div>
                <div
                  class="h-[800px] overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-gray-950/50 relative"
                >
                  <!-- Loading State -->
                  <Transition
                    enter-active-class="transition-opacity duration-200"
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="transition-opacity duration-200"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <div
                      v-if="isLoading"
                      class="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-sm z-10"
                    >
                      <div class="flex flex-col items-center gap-3">
                        <Loader2 class="h-8 w-8 animate-spin text-teal-500" />
                        <p :class="theme.textSecondary" class="text-sm font-medium">
                          Loading preview...
                        </p>
                      </div>
                    </div>
                  </Transition>
                  <!-- Full Collection Preview -->
                  <CollectionPreview
                    v-if="!isLoading"
                    :preview-collection="mockPreviewCollection"
                    :preview-design-config="previewDesignConfig"
                    :preview-media="mockPreviewMedia"
                    :preview-mode="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unsaved Changes Modal -->
      <UnsavedChangesModal
        v-model="showUnsavedChangesModal"
        :is-saving="isSubmitting || isSaving"
        @cancel="handleCancelNavigation"
        @discard="handleDiscardAndLeave"
        @save="handleSaveAndLeave"
      />
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { Check, ExternalLink, Grid3x3, LayoutGrid, Loader2, Type, Image as ImageIcon } from 'lucide-vue-next'
import {
  gridStyles,
  gridColumnsOptions,
  thumbnailSizes,
  navigationStyles,
  getGridStyleIcon,
  getNavigationStyleIcon,
} from '@/utils/designConstants'
import { Button } from '@/components/shadcn/button'
import { Slider } from '@/components/shadcn/slider'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import ContentLoader from '@/components/molecules/ContentLoader.vue'
import CollectionPreview from '@/views/user/memora/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const isLoading = ref(false)

// UI State
// Sidebar collapse state with persistence
const { isSidebarCollapsed } = useSidebarCollapse()
const isSaving = ref(false)
const isSubmitting = ref(false)
const showUnsavedChangesModal = ref(false)

// Grid defaults (used for form initialization and preview)
const gridStyle = 'vertical'
const gridColumns = 3
const thumbnailSize = 'medium'
const gridSpacing = 16
const navigationStyle = 'icon-text'

// Grid form data
const formData = reactive({
  gridStyle,
  gridColumns,
  thumbnailSize,
  gridSpacing,
  navigationStyle,
})

// Store original loaded data for comparison
const originalData = ref(null)

const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoading.value) {
    return false
  }
  return (
    formData.gridStyle !== originalData.value.gridStyle ||
    formData.gridColumns !== originalData.value.gridColumns ||
    formData.thumbnailSize !== originalData.value.thumbnailSize ||
    formData.gridSpacing !== originalData.value.gridSpacing ||
    formData.navigationStyle !== originalData.value.navigationStyle
  )
})

const previewDesignConfig = computed(() => {
  if (!collection.value) {
    // Fallback to formData if collection not loaded
    return {
      cover: 'none',
      coverFocalPoint: { x: 50, y: 50 },
      fontFamily: 'sans',
      fontStyle: 'bold',
      colorPalette: 'light',
      gridStyle: formData.gridStyle,
      gridColumns: formData.gridColumns,
      thumbnailSize: formData.thumbnailSize,
      gridSpacing: formData.gridSpacing,
      navigationStyle: formData.navigationStyle,
    }
  }

  const collectionInStore = galleryStore.collections.find(c => c.id === collection.value?.id)
  if (!collectionInStore) {
    // Fallback to formData if not in store
    return {
      cover: 'none',
      coverFocalPoint: { x: 50, y: 50 },
      fontFamily: 'sans',
      fontStyle: 'bold',
      colorPalette: 'light',
      gridStyle: formData.gridStyle,
      gridColumns: formData.gridColumns,
      thumbnailSize: formData.thumbnailSize,
      gridSpacing: formData.gridSpacing,
      navigationStyle: formData.navigationStyle,
    }
  }

  // Use organized design structure from API response
  const coverDesign = collectionInStore.design?.cover || collectionInStore.coverDesign || {}
  const typographyDesign = collectionInStore.design?.typography || collectionInStore.typographyDesign || {}
  const colorDesign = collectionInStore.design?.color || collectionInStore.colorDesign || {}
  const gridDesign = collectionInStore.design?.grid || collectionInStore.gridDesign || {}

  return {
    cover: coverDesign.cover || 'none',
    coverFocalPoint: coverDesign.coverFocalPoint || { x: 50, y: 50 },
    fontFamily: typographyDesign.fontFamily || 'sans',
    fontStyle: typographyDesign.fontStyle || 'bold',
    colorPalette: colorDesign.colorPalette || 'light',
    gridStyle: formData.gridStyle ?? gridDesign.gridStyle ?? 'vertical',
    gridColumns: formData.gridColumns ?? gridDesign.gridColumns ?? 3,
    thumbnailSize: formData.thumbnailSize ?? gridDesign.thumbnailOrientation ?? gridDesign.thumbnailSize ?? 'medium',
    gridSpacing: formData.gridSpacing ?? gridDesign.gridSpacing ?? 16,
    navigationStyle: formData.navigationStyle ?? gridDesign.tabStyle ?? gridDesign.navigationStyle ?? 'icon-text',
  }
})

// Watch formData and immediately update the collection in store (optimistic update)
watch(
  () => formData,
  newData => {
    if (!collection.value || isLoading.value || !originalData.value) return

    // Optimistically update the collection in the store
    const index = galleryStore.collections.findIndex(c => c.id === collection.value?.id)
    if (index !== -1) {
      const collectionInStore = galleryStore.collections[index]
      if (!collectionInStore.design) {
        collectionInStore.design = {}
      }
      collectionInStore.design.grid = { ...newData }
      // Trigger reactivity by updating the array reference
      galleryStore.collections = [...galleryStore.collections]
    }
  },
  { deep: true }
)

// Computed property to convert gridSpacing number to array for Slider component
const gridSpacingSlider = computed({
  get() {
    return [formData.gridSpacing]
  },
  set(value) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number') {
      formData.gridSpacing = Math.max(1, Math.min(100, value[0]))
    }
  },
})

// Load collection data
const loadCollectionData = async () => {
  const collectionId = route.params.uuid
  if (!collectionId) {
    router.push({ name: 'manageCollections' })
    return
  }

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    if (!collectionData) {
      throw new Error('Collection not found')
    }

    collection.value = collectionData

    // Load grid design data - use organized design.grid structure from API
    const gridDesign =
      collectionData.design?.grid ||
      collectionData.gridDesign ||
      (collectionData.design
        ? {
            gridStyle: collectionData.design.gridStyle,
            gridColumns: collectionData.design.gridColumns,
            thumbnailSize: collectionData.design.thumbnailOrientation || collectionData.design.thumbnailSize,
            gridSpacing: collectionData.design.gridSpacing,
            navigationStyle: collectionData.design.tabStyle || collectionData.design.navigationStyle,
          }
        : {})
    // Calculate gridSpacing based on thumbnailSize if not provided (matching preset behavior)
    let calculatedGridSpacing = gridSpacing
    const finalThumbnailSize = gridDesign.thumbnailSize || thumbnailSize
    if (typeof gridDesign.gridSpacing === 'number') {
      calculatedGridSpacing = gridDesign.gridSpacing
    } else if (gridDesign.gridSpacing === 'large') {
      calculatedGridSpacing = 24
    } else if (gridDesign.gridSpacing === 'normal' || gridDesign.gridSpacing === 'medium') {
      calculatedGridSpacing = 16
    } else if (finalThumbnailSize && !gridDesign.gridSpacing) {
      // Calculate from thumbnailSize if gridSpacing not provided
      if (finalThumbnailSize === 'small') {
        calculatedGridSpacing = 8
      } else if (finalThumbnailSize === 'medium') {
        calculatedGridSpacing = 16
      } else if (finalThumbnailSize === 'large') {
        calculatedGridSpacing = 24
      }
    }

    const loadedData = {
      gridStyle: gridDesign.gridStyle || gridStyle,
      gridColumns: gridDesign.gridColumns || gridColumns,
      thumbnailSize: gridDesign.thumbnailOrientation || gridDesign.thumbnailSize || finalThumbnailSize,
      gridSpacing: calculatedGridSpacing,
      navigationStyle: gridDesign.tabStyle || gridDesign.navigationStyle || navigationStyle,
    }
    Object.assign(formData, loadedData)
    originalData.value = { ...loadedData }
  } catch (error) {
    toast.error('Failed to load collection', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
    router.push({ name: 'collectionPhotos', params: { uuid: route.params.uuid } })
  } finally {
    isLoading.value = false
  }
}

// Watch for route changes
watch(
  () => route.params.uuid,
  () => {
    loadCollectionData()
  },
  { immediate: true }
)

// Watch for grid style changes - disable large thumbnail size for masonry
watch(
  () => formData.gridStyle,
  newStyle => {
    if (newStyle === 'masonry' && formData.thumbnailSize === 'large') {
      formData.thumbnailSize = 'medium'
    }
  }
)

// Save grid design
const saveGridDesign = async () => {
  if (!collection.value) {
    toast.error('Collection not found')
    return false
  }

  try {
    isSaving.value = true
    await galleryStore.updateCollection(collection.value.id, {
      gridDesign: {
        ...formData,
        tabStyle: formData.navigationStyle,
        thumbnailOrientation: formData.thumbnailSize,
        navigationStyle: undefined, // Remove old field
        thumbnailSize: undefined, // Remove old field
      },
    })

    if (originalData.value) {
      originalData.value = { ...formData }
    }
    return true
  } catch (error) {
    toast.error('Failed to save grid design', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
    return false
  } finally {
    isSaving.value = false
  }
}

const handleSave = async () => {
  const success = await saveGridDesign()
  if (success) {
    toast.success('Grid design saved successfully')
  }
}

// Discard function to reset form data to original state
const discardChanges = () => {
  if (originalData.value) {
    Object.assign(formData, originalData.value)
  }
}

const { handleSaveAndLeave, handleDiscardAndLeave, handleCancelNavigation } =
  useUnsavedChangesGuard({
    hasUnsavedChanges,
    isSubmitting,
    isSaving,
    saveFunction: saveGridDesign,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })

const goBack = async () => {
  isSubmitting.value = true
  try {
    const success = await saveGridDesign()
    if (success) {
      router.push({
        name: 'collectionPhotos',
        params: { uuid: route.params.uuid },
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleOpenPreviewInNewTab = async () => {
  const collectionId = route.params.uuid
  if (!collectionId) {
    toast.error('Collection not found')
    return
  }

  // Save current design changes before opening preview
  const success = await saveGridDesign()
  if (success) {
    const previewUrl = router.resolve({
      name: 'collectionPreview',
      params: { id: collectionId },
    }).href
    window.open(previewUrl, '_blank')
  }
}

// Fallback image URL
const fallbackImageUrl =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop'

// Mock data for preview
const mockPreviewCollection = computed(() => ({
  id: collection.value?.id || 'mock-id',
  name: collection.value?.name || 'Mock Collection',
  date: new Date().toISOString().split('T')[0],
  eventDate: new Date().toISOString().split('T')[0],
  thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'draft',
  category: 'wedding',
}))

const mockPreviewMedia = computed(() => {
  const photoIds = [
    '1519741497674-611481863552',
    '1516589178581-6cd7833ae3b2',
    '1511285560929-80b456fea0bc',
    '1521119989659-a83eee488004',
    '1475721027785-f74eccf877e2',
    '1511578314322-379afb476865',
    '1494790008762-728dbb2e86b0',
    '1500648767791-00dcc994a43e',
    '1505373877841-8d25f7d46678',
    '1478147427282-58a87a120781',
    '1515934751635-c81c6bc9a2d8',
    '1522673607200-164d1b6ce486',
  ]

  return photoIds.map((id, index) => ({
    id: `photo-${index}`,
    collectionId: collection.value?.id || 'mock-id',
    url: `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop`,
    thumbnail: `https://images.unsplash.com/photo-${id}?w=300&h=300&fit=crop`,
    type: 'image',
    title: `Photo ${index + 1}`,
    order: index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
})
</script>

<style scoped>
/* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(51, 85, 105, 0.4);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(51, 85, 105, 0.6);
}
</style>
