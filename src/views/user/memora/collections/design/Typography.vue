<template>
  <CollectionLayout
    :collection="collection"
    :is-loading="isLoading"
    :is-editing-name="false"
    :editing-name="''"
    :is-saving-name="false"
    v-model:collection-status="collectionStatus"
    :is-saving-status="false"
    :event-date="eventDate"
    :selected-preset-id="selectedPresetId"
    :selected-preset-name="selectedPresetName"
    :selected-watermark="selectedWatermark"
    :selected-watermark-name="selectedWatermarkName"
    :presets="presets"
    :watermarks="watermarks"
    v-model:active-tab="activeTab"
    v-model:is-sidebar-collapsed="isSidebarCollapsed"
    @go-back="goBack"
    @handle-status-change="handleStatusChange"
    @handle-date-change="handleDateChange"
    @handle-preset-change="handlePresetChange"
    @handle-watermark-change="handleWatermarkChange"
  >
    <template #sidebar>
      <!-- DESIGN Section - Expanded -->
      <div v-if="activeTab === 'design' && !isSidebarCollapsed" class="space-y-5">
        <!-- Design Sub-Navigation -->
        <div class="space-y-1">
          <router-link
            :to="{ name: 'collectionCover', params: { uuid: route.params.uuid } }"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
            :class="
              route.name === 'collectionCover'
                ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
                : [theme.textSecondary, 'hover:bg-gray-100 dark:hover:bg-gray-800']
            "
          >
            <ImageIcon class="h-4 w-4 shrink-0" />
            <span class="text-sm font-medium">Cover</span>
          </router-link>
          <router-link
            :to="{ name: 'collectionTypography', params: { uuid: route.params.uuid } }"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
            :class="
              route.name === 'collectionTypography'
                ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
                : [theme.textSecondary, 'hover:bg-gray-100 dark:hover:bg-gray-800']
            "
          >
            <span class="text-lg font-bold">T</span>
            <span class="text-sm font-medium">Typography</span>
          </router-link>
          <router-link
            :to="{ name: 'collectionColor', params: { uuid: route.params.uuid } }"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
            :class="
              route.name === 'collectionColor'
                ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
                : [theme.textSecondary, 'hover:bg-gray-100 dark:hover:bg-gray-800']
            "
          >
            <div class="w-4 h-4 rounded border" :class="theme.borderSecondary"></div>
            <span class="text-sm font-medium">Color</span>
          </router-link>
          <router-link
            :to="{ name: 'collectionGrid', params: { uuid: route.params.uuid } }"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
            :class="
              route.name === 'collectionGrid'
                ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
                : [theme.textSecondary, 'hover:bg-gray-100 dark:hover:bg-gray-800']
            "
          >
            <Grid3x3 class="h-4 w-4 shrink-0" />
            <span class="text-sm font-medium">Grid</span>
          </router-link>
        </div>
      </div>

      <!-- DESIGN Section - Collapsed (Icon Only) -->
      <div
        v-if="activeTab === 'design' && isSidebarCollapsed"
        class="flex flex-col items-center gap-2 pt-4"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                :to="{ name: 'collectionCover', params: { uuid: route.params.uuid } }"
                class="p-2.5 rounded-lg transition-all duration-200"
                :class="
                  route.name === 'collectionCover'
                    ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400'
                    : [theme.textSecondary, 'hover:bg-gray-100 dark:hover:bg-gray-800']
                "
              >
                <ImageIcon class="h-5 w-5" />
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right" :class="[theme.bgCard, theme.borderCard]">
              <p class="text-sm font-semibold" :class="theme.textPrimary">Cover</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                :to="{ name: 'collectionTypography', params: { uuid: route.params.uuid } }"
                class="p-2.5 rounded-lg transition-all duration-200"
                :class="
                  route.name === 'collectionTypography'
                    ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400'
                    : [theme.textSecondary, 'hover:bg-gray-100 dark:hover:bg-gray-800']
                "
              >
                <span class="text-lg font-bold">T</span>
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right" :class="[theme.bgCard, theme.borderCard]">
              <p class="text-sm font-semibold" :class="theme.textPrimary">Typography</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                :to="{ name: 'collectionColor', params: { uuid: route.params.uuid } }"
                class="p-2.5 rounded-lg transition-all duration-200"
                :class="
                  route.name === 'collectionColor'
                    ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400'
                    : [theme.textSecondary, 'hover:bg-gray-100 dark:hover:bg-gray-800']
                "
              >
                <div class="w-5 h-5 rounded border" :class="theme.borderSecondary"></div>
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right" :class="[theme.bgCard, theme.borderCard]">
              <p class="text-sm font-semibold" :class="theme.textPrimary">Color</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                :to="{ name: 'collectionGrid', params: { uuid: route.params.uuid } }"
                class="p-2.5 rounded-lg transition-all duration-200"
                :class="
                  route.name === 'collectionGrid'
                    ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400'
                    : [theme.textSecondary, 'hover:bg-gray-100 dark:hover:bg-gray-800']
                "
              >
                <Grid3x3 class="h-5 w-5" />
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right" :class="[theme.bgCard, theme.borderCard]">
              <p class="text-sm font-semibold" :class="theme.textPrimary">Grid</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </template>

    <template #content>
      <div
        class="mx-auto p-8 pb-16 transition-all duration-300 h-full overflow-y-auto"
        :class="isSidebarCollapsed ? 'max-w-[calc(100vw-8rem)]' : 'max-w-7xl'"
      >
        <div class="mb-10">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold" :class="theme.textPrimary">Typography</h1>
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
              <p class="text-sm leading-relaxed max-w-2xl" :class="theme.textSecondary">
                Select fonts that match your brand and style. See your changes in real-time in the
                preview panel.
              </p>
            </div>
            <!-- Quick Stats -->
            <div class="hidden md:flex gap-4">
              <div
                class="px-4 py-2 rounded-lg border"
                :class="[theme.borderSecondary, theme.bgCard]"
              >
                <div class="text-xs" :class="theme.textTertiary">Font Style</div>
                <div class="text-sm font-semibold mt-0.5" :class="theme.textPrimary">
                  {{ fontStyles.find(s => s.id === formData.fontStyle)?.label || 'Bold' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-12rem)]">
          <!-- Main Content -->
          <div class="lg:col-span-2 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto space-y-12 pr-2 min-h-0">
              <!-- Typography Section -->
              <div
                class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
                :class="[theme.borderSecondary, theme.bgCard]"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Typography</h3>
                    <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                      Select fonts that match your brand and style
                    </p>
                  </div>
                </div>
                <div class="space-y-5">
                  <!-- Font Families -->
                  <div>
                    <label
                      class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                      :class="theme.textSecondary"
                      >Font Family</label
                    >
                    <FontFamilySelect
                      v-model="formData.fontFamily"
                      placeholder="Select font family"
                    />
                  </div>
                  <!-- Font Weights/Styles -->
                  <div>
                    <label
                      class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                      :class="theme.textSecondary"
                      >Font Style</label
                    >
                    <div class="grid grid-cols-3 gap-3">
                      <button
                        v-for="style in fontStyles"
                        :key="style.id"
                        @click="formData.fontStyle = style.id"
                        class="group px-5 py-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                        :class="[
                          formData.fontStyle === style.id
                            ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 ring-2 ring-teal-500/20'
                            : [
                                theme.borderSecondary,
                                'hover:border-teal-500/70',
                                'active:scale-[0.98]',
                              ],
                          theme.bgCard,
                        ]"
                      >
                        <span
                          class="text-base font-medium block text-center transition-colors duration-200"
                          :class="[
                            formData.fontStyle === style.id
                              ? 'text-teal-600 dark:text-teal-400 font-bold'
                              : theme.textPrimary,
                            style.class,
                          ]"
                        >
                          {{ style.label }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Navigation -->
            <div
              class="mt-8 pt-6 border-t flex-shrink-0 bg-gradient-to-r from-transparent via-gray-50/50 dark:via-gray-900/50 to-transparent"
              :class="theme.borderSecondary"
            >
              <div class="flex justify-between items-center">
                <Button
                  @click="goBack"
                  variant="ghost"
                  :disabled="isSubmitting || isSaving"
                  class="px-4 py-2 rounded-lg font-medium"
                  :class="[
                    theme.textSecondary,
                    theme.bgButtonHover,
                    'hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  ]"
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
                    @click="handleSave"
                    :disabled="isSubmitting || isSaving || !hasUnsavedChanges"
                    class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-200 px-6 py-2.5 font-medium"
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
                class="rounded-xl border-2 overflow-hidden backdrop-blur-md bg-white/80 dark:bg-gray-900/80"
                :class="[theme.borderSecondary, theme.bgCard]"
              >
                <div
                  class="p-5 border-b bg-gradient-to-r from-teal-50/50 to-blue-50/50 dark:from-teal-950/30 dark:to-blue-950/30"
                  :class="theme.borderSecondary"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3
                        class="text-lg font-semibold flex items-center gap-2"
                        :class="theme.textPrimary"
                      >
                        <div class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                        Live Preview
                      </h3>
                      <p class="text-xs mt-1.5" :class="theme.textSecondary">
                        See exactly how your design will look
                      </p>
                    </div>
                    <Button
                      @click="handleOpenPreviewInNewTab"
                      variant="ghost"
                      size="sm"
                      class="shrink-0 hover:bg-white/80 dark:hover:bg-gray-800/80"
                      :class="[
                        theme.textSecondary,
                        'hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200',
                      ]"
                      title="Open preview in new tab"
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
                        <p class="text-sm font-medium" :class="theme.textSecondary">
                          Loading preview...
                        </p>
                      </div>
                    </div>
                  </Transition>
                  <!-- Full Collection Preview -->
                  <CollectionPreview
                    v-if="!isLoading"
                    :preview-mode="true"
                    :preview-collection="mockPreviewCollection"
                    :preview-media="mockPreviewMedia"
                    :preview-design-config="previewDesignConfig"
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
        @save="handleSaveAndLeave"
        @discard="handleDiscardAndLeave"
        @cancel="handleCancelNavigation"
      />
    </template>
  </CollectionLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { Check, Loader2, Grid3x3, ExternalLink, ImageIcon } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import CollectionLayout from '@/components/organisms/CollectionLayout.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import FontFamilySelect from '@/components/organisms/FontFamilySelect.vue'
import CollectionPreview from '@/views/user/memora/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { usePresetStore } from '@/stores/preset'
import type { Collection } from '@/api/collections'
import type { MediaItem } from '@/api/media'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const presetStore = usePresetStore()

// Collection data
const collection = ref<Collection | null>(null)
const isLoading = ref(false)
const collectionStatus = ref<'draft' | 'published'>('draft')
const eventDate = ref<Date | null>(null)
const selectedPresetId = ref<string>('none')
const selectedPresetName = computed(() => {
  if (selectedPresetId.value === 'none') return null
  const preset = presets.value.find((p: any) => p.id === selectedPresetId.value)
  return preset?.name || null
})
const selectedWatermark = ref('none')
const selectedWatermarkName = computed(() => {
  if (selectedWatermark.value === 'none') return null
  const watermark = watermarks.value.find((w: any) => w.id === selectedWatermark.value)
  return watermark?.name || null
})
const presets = computed(() => presetStore.presets)
const watermarks = computed(() => galleryStore.watermarks || [])

// UI State
const activeTab = ref<'photos' | 'design' | 'settings' | 'activities'>('design')
// Sidebar collapse state with persistence
const { isSidebarCollapsed } = useSidebarCollapse()
const isSaving = ref(false)
const isSubmitting = ref(false)
const showUnsavedChangesModal = ref(false)

// Typography form data
const formData = ref({
  fontFamily: 'sans',
  fontStyle: 'bold',
})

// Store original loaded data for comparison
const originalData = ref<typeof formData.value | null>(null)

// Check if there are actual unsaved changes
const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoading.value) {
    return false
  }
  return (
    formData.value.fontFamily !== originalData.value.fontFamily ||
    formData.value.fontStyle !== originalData.value.fontStyle
  )
})

// Get merged design config for preview (from collection store)
const previewDesignConfig = computed(() => {
  if (!collection.value) {
    // Fallback to formData if collection not loaded
    return {
      cover: 'left',
      coverFocalPoint: { x: 50, y: 50 },
      fontFamily: formData.value.fontFamily,
      fontStyle: formData.value.fontStyle,
      colorPalette: 'light',
      gridStyle: 'vertical',
      gridColumns: 3,
      thumbnailSize: 'regular',
      gridSpacing: 16,
      navigationStyle: 'icon-only',
    }
  }

  const collectionInStore = galleryStore.collections.find(c => c.id === collection.value?.id)
  if (!collectionInStore) {
    // Fallback to formData if not in store
    return {
      cover: 'left',
      coverFocalPoint: { x: 50, y: 50 },
      fontFamily: formData.value.fontFamily,
      fontStyle: formData.value.fontStyle,
      colorPalette: 'light',
      gridStyle: 'vertical',
      gridColumns: 3,
      thumbnailSize: 'regular',
      gridSpacing: 16,
      navigationStyle: 'icon-only',
    }
  }

  // Get all design configs from the collection in store (which is updated by the watcher)
  const coverDesign = (collectionInStore as any).coverDesign || {}
  const typographyDesign = (collectionInStore as any).typographyDesign || {}
  const colorDesign = (collectionInStore as any).colorDesign || {}
  const gridDesign = (collectionInStore as any).gridDesign || {}

  // Return merged config from store
  return {
    cover: coverDesign.cover || 'left',
    coverFocalPoint: coverDesign.coverFocalPoint || { x: 50, y: 50 },
    fontFamily: typographyDesign.fontFamily || formData.value.fontFamily || 'sans',
    fontStyle: typographyDesign.fontStyle || formData.value.fontStyle || 'bold',
    colorPalette: colorDesign.colorPalette || 'light',
    gridStyle: gridDesign.gridStyle || 'vertical',
    gridColumns: gridDesign.gridColumns || 3,
    thumbnailSize: gridDesign.thumbnailSize || 'regular',
    gridSpacing: gridDesign.gridSpacing || 16,
    navigationStyle: gridDesign.navigationStyle || 'icon-only',
  }
})

// Watch formData and immediately update the collection in store (optimistic update)
watch(
  () => formData.value,
  newData => {
    if (!collection.value || isLoading.value || !originalData.value) return

    // Optimistically update the collection in the store
    const index = galleryStore.collections.findIndex(c => c.id === collection.value?.id)
    if (index !== -1) {
      const collectionInStore = galleryStore.collections[index]
      ;(collectionInStore as any).typographyDesign = { ...newData }
      // Trigger reactivity by updating the array reference
      galleryStore.collections = [...galleryStore.collections]
    }
  },
  { deep: true }
)

// Font styles
const fontStyles = [
  { id: 'timeless', label: 'Timeless', class: 'font-light' },
  { id: 'bold', label: 'BOLD', class: 'font-bold' },
  { id: 'subtle', label: 'SUBTLE', class: 'font-normal' },
]

// Load collection data
const loadCollectionData = async () => {
  const collectionId = route.params.uuid as string
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
    collectionStatus.value =
      collectionData.status === 'active' ? 'published' : collectionData.status || 'draft'
    eventDate.value = collectionData.eventDate ? new Date(collectionData.eventDate) : null

    // Set preset if available
    const presetId = (collectionData as any).presetId
    selectedPresetId.value = presetId != null ? String(presetId) : 'none'

    // Set watermark if available
    const watermarkId = (collectionData as any).watermarkId
    selectedWatermark.value = watermarkId != null ? String(watermarkId) : 'none'

    // Load typography design data
    const typographyDesign = (collectionData as any).typographyDesign || {}
    const loadedData = {
      fontFamily: typographyDesign.fontFamily || 'sans',
      fontStyle: typographyDesign.fontStyle || 'bold',
    }
    formData.value = { ...loadedData }
    originalData.value = { ...loadedData }
  } catch (error: any) {
    toast.error('Failed to load collection', {
      description: error.message || 'An error occurred',
    })
    router.push({ name: 'manageCollections' })
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

// Watch for activeTab changes and navigate accordingly
watch(activeTab, (newTab: 'photos' | 'design' | 'settings' | 'activities') => {
  if (!collection.value) return

  if (newTab === 'photos') {
    router.push({
      name: 'collectionPhotos',
      params: { uuid: collection.value.id },
    })
  }

  if (newTab === 'settings') {
    router.push({
      name: 'collectionSettingsGeneral',
      params: { uuid: collection.value.id },
    })
  }
})

// Save typography design
const saveTypographyDesign = async (): Promise<boolean> => {
  if (!collection.value) {
    toast.error('Collection not found')
    return false
  }

  try {
    isSaving.value = true
    await galleryStore.updateCollection(collection.value.id, {
      typographyDesign: formData.value,
    } as any)

    // Update original data after successful save
    if (originalData.value) {
      originalData.value = { ...formData.value }
    }
    return true
  } catch (error: any) {
    toast.error('Failed to save typography design', {
      description: error.message || 'An error occurred while saving.',
    })
    return false
  } finally {
    isSaving.value = false
  }
}

// Handle status change
const handleStatusChange = async (newStatus: string) => {
  if (!collection.value || !newStatus) return

  try {
    // Map 'published' to 'active' for the API
    const apiStatus =
      newStatus === 'published' ? 'active' : (newStatus as 'draft' | 'active' | 'archived')
    await galleryStore.updateCollection(collection.value.id, {
      status: apiStatus,
    } as any)

    collectionStatus.value = newStatus as 'draft' | 'published'
    toast.success('Collection status updated successfully')
  } catch (error: any) {
    toast.error('Failed to update collection status', {
      description: error.message || 'An error occurred while updating.',
    })
  }
}

// Handle date change
const handleDateChange = async (newDate: Date | null) => {
  if (!collection.value) return

  try {
    // Convert Date to ISO string for storage, or null to clear
    const dateString = newDate instanceof Date ? newDate.toISOString() : newDate || null
    await galleryStore.updateCollection(collection.value.id, {
      eventDate: dateString,
    } as any)

    eventDate.value = newDate
    toast.success('Event date updated successfully')
  } catch (error: any) {
    toast.error('Failed to update event date', {
      description: error.message || 'An error occurred while updating.',
    })
  }
}

const handleSave = async () => {
  const success = await saveTypographyDesign()
  if (success) {
    toast.success('Typography design saved successfully', {
      description: 'Typography settings have been updated.',
      icon: Check,
    })
  }
}

// Discard function to reset form data to original state
const discardChanges = () => {
  if (originalData.value) {
    formData.value = { ...originalData.value }
  }
}

// Set up unsaved changes guard
const { handleSaveAndLeave, handleDiscardAndLeave, handleCancelNavigation } =
  useUnsavedChangesGuard({
    hasUnsavedChanges,
    isSubmitting,
    isSaving,
    saveFunction: saveTypographyDesign,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })

const goBack = async () => {
  isSubmitting.value = true
  try {
    const success = await saveTypographyDesign()
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

const handlePresetChange = async (presetId: string) => {
  selectedPresetId.value = presetId
}

const handleWatermarkChange = async (watermarkId: string) => {
  selectedWatermark.value = watermarkId
}

const handleOpenPreviewInNewTab = async () => {
  const collectionId = route.params.uuid as string
  if (!collectionId) {
    toast.error('Collection not found')
    return
  }

  // Save current design changes before opening preview
  const success = await saveTypographyDesign()
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
const mockPreviewCollection = computed<Collection>(() => ({
  id: collection.value?.id || 'preview',
  name: collection.value?.name || 'My Sample Collection',
  date: collection.value?.eventDate || '2025-09-01',
  eventDate: collection.value?.eventDate || '2025-09-01',
  thumbnail: collection.value?.thumbnail || fallbackImageUrl,
  createdAt: collection.value?.createdAt || new Date().toISOString(),
  updatedAt: collection.value?.updatedAt || new Date().toISOString(),
  status: collection.value?.status || 'active',
  category: collection.value?.category || 'event',
}))

const mockPreviewMedia = computed<MediaItem[]>(() => {
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
    id: `preview-${index}`,
    collectionId: collection.value?.id || 'preview',
    url: `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop`,
    thumbnail: `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop`,
    type: 'image' as const,
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
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 10px;
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.4);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 0.6);
}
</style>
