<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div v-if="isLoading" class="mx-auto p-8 pb-16 transition-all duration-300 h-full overflow-y-auto">
        <!-- Skeleton Header -->
        <div class="mb-10">
          <div class="flex items-start justify-between mb-4">
            <div>
              <Skeleton class="h-9 w-32 rounded-lg mb-2" />
              <Skeleton class="h-4 w-96 rounded-md" />
            </div>
          </div>
        </div>

        <!-- Skeleton Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-12rem)]">
          <!-- Skeleton Main Content -->
          <div class="lg:col-span-2 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto space-y-12 pr-2 min-h-0">
              <div class="space-y-6 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex-1">
                    <Skeleton class="h-6 w-32 rounded-md mb-2" />
                    <Skeleton class="h-3 w-64 rounded-md" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <Skeleton
                    v-for="i in 4"
                    :key="i"
                    class="h-24 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <!-- Skeleton Bottom Navigation -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div class="flex justify-between items-center">
                <Skeleton class="h-10 w-20 rounded-lg" />
                <Skeleton class="h-10 w-32 rounded-lg" />
              </div>
            </div>
          </div>

          <!-- Skeleton Preview Panel -->
          <div class="lg:col-span-3">
            <div class="sticky top-24">
              <div class="rounded-xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="p-5 border-b border-gray-200 dark:border-gray-800">
                  <Skeleton class="h-6 w-32 rounded-md mb-1" />
                  <Skeleton class="h-3 w-48 rounded-md" />
                </div>
                <div class="h-[800px] bg-gray-50/50 dark:bg-gray-950/50">
                  <div class="p-8 space-y-4">
                    <Skeleton class="h-64 w-full rounded-lg" />
                    <div class="grid grid-cols-3 gap-4">
                      <Skeleton
                        v-for="i in 9"
                        :key="i"
                        class="h-32 rounded-lg aspect-square"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mx-auto p-8 pb-16 transition-all duration-300 h-full overflow-y-auto">
        <div class="mb-10">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 :class="theme.textPrimary" class="text-3xl font-bold">Color</h1>
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
                Select colors that match your brand and style. See your changes in real-time in the
                preview panel.
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-12rem)]">
          <!-- Main Content -->
          <div class="lg:col-span-2 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto space-y-12 pr-2 min-h-0">
              <!-- Color Section -->
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                      Color Palette
                    </h3>
                    <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                      Choose a color scheme that reflects your collection's mood
                    </p>
                  </div>
                  <div
                    class="px-3 py-1.5 rounded-lg bg-accent/10 dark:bg-accent/20 border border-accent/20 dark:border-accent/30"
                  >
                    <span class="text-xs font-semibold text-accent">
                      {{
                        colorPalettes.find(p => p.id === formData.colorPalette)?.label || 'Light'
                      }}
                    </span>
                  </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  <button
                    v-for="palette in colorPalettes"
                    :key="palette.id"
                    :class="[
                      formData.colorPalette === palette.id
                        ? 'border-accent ring-2 ring-accent/30 scale-[1.02]'
                        : [
                            theme.borderSecondary,
                            'hover:border-accent/70',
                            'active:scale-[0.98]',
                          ],
                      theme.bgCard,
                    ]"
                    class="group flex flex-col gap-3 p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.05] cursor-pointer relative"
                    @click="formData.colorPalette = palette.id"
                  >
                    <!-- Selected indicator -->
                    <Transition
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="opacity-0 scale-75"
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition-all duration-150 ease-in"
                      leave-from-class="opacity-100 scale-100"
                      leave-to-class="opacity-0 scale-75"
                    >
                      <div
                        v-if="formData.colorPalette === palette.id"
                        class="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-accent flex items-center justify-center ring-2 ring-white dark:ring-gray-900"
                      >
                        <Check class="h-3.5 w-3.5 text-white" />
                      </div>
                    </Transition>

                    <div class="flex gap-2.5 justify-center relative">
                      <div
                        v-for="(color, index) in palette.colors.slice(0, 3)"
                        :key="index"
                        :class="{ 'delay-75': index === 1, 'delay-150': index === 2 }"
                        :style="{ backgroundColor: color }"
                        class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 transition-transform duration-300 group-hover:scale-125"
                      ></div>
                    </div>
                    <span
                      :class="
                        formData.colorPalette === palette.id
                          ? 'text-accent font-bold'
                          : ''
                      "
                      class="text-xs font-semibold text-center transition-colors duration-200 mt-1"
                    >
                      {{ palette.label }}
                    </span>
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
                    'hover:text-accent hover:bg-accent/10 dark:hover:bg-accent/20 transition-all duration-200',
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
                    variant="primary"
                    :disabled="!hasUnsavedChanges"
                    :loading="isSubmitting || isSaving"
                    :icon="!hasUnsavedChanges ? Check : null"
                    loading-label="Saving..."
                    class="hover:scale-105 active:scale-95 transition-all duration-200 px-6 py-2.5 font-medium"
                    @click="handleSave"
                  >
                    {{ !hasUnsavedChanges ? 'Saved' : 'Save Changes' }}
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
                  class="p-5 border-b bg-gradient-to-r from-violet-50/50 to-blue-50/50 dark:from-violet-950/30 dark:to-blue-950/30"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3
                        :class="theme.textPrimary"
                        class="text-lg font-semibold flex items-center gap-2"
                      >
                        <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                        Live Preview
                      </h3>
                      <p :class="theme.textSecondary" class="text-xs mt-1.5">
                        See exactly how your design will look
                      </p>
                    </div>
                    <Button
                      :class="[
                        theme.textSecondary,
                        'hover:text-accent transition-all duration-200',
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
                        <Loader2 class="h-8 w-8 animate-spin text-accent" />
                        <p :class="theme.textSecondary" class="text-sm font-medium">
                          Loading preview...
                        </p>
                      </div>
                    </div>
                  </Transition>
                  <!-- Full Collection Preview -->
                  <CollectionPreview
                    v-if="!isLoading"
                    :preview-collection="previewCollection"
                    :preview-design-config="previewDesignConfig"
                    :preview-media="previewMedia"
                    :preview-is-loading="isLoadingMedia"
                    :preview-mode="true"
                    :disable-actions="true"
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
import { useUnsavedChangesGuard } from '@/shared/composables/useUnsavedChangesGuard'
import { Check, ExternalLink, Loader2 } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import CollectionLayout from '@/shared/layouts/CollectionLayout.vue'
import UnsavedChangesModal from '@/domains/memora/modals/UnsavedChangesModal.vue'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import CollectionPreview from '@/domains/memora/views/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useCollectionsApi } from '@/domains/memora/api/collections'
import { toast } from '@/shared/utils/toast'
import { getColorPalettesArray } from '@/shared/utils/colors'

const description = ''

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const collectionsApi = useCollectionsApi()

// Collection data
const collection = ref(null)
const isLoading = ref(false)
const previewMedia = ref([])
const isLoadingMedia = ref(false)

// UI State
// Sidebar collapse state with persistence
const { isSidebarCollapsed } = useSidebarCollapse()
const isSaving = ref(false)
const isSubmitting = ref(false)
const showUnsavedChangesModal = ref(false)

// Color form data
const formData = reactive({
  colorPalette: 'light',
})

// Store original loaded data for comparison
const originalData = ref(null)

const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoading.value) {
    return false
  }
  return formData.colorPalette !== originalData.value.colorPalette
})

const previewDesignConfig = computed(() => {
  const defaults = {
    cover: 'none',
    coverLayoutUuid: null,
    coverFocalPoint: { x: 50, y: 50 },
    fontFamily: 'sans',
    fontStyle: 'normal',
    colorPalette: 'light',
    gridStyle: 'vertical',
    gridColumns: 3,
    thumbnailSize: 'medium',
    gridSpacing: 16,
    navigationStyle: 'icon-text',
  }

  if (!collection.value) {
    return {
      ...defaults,
      colorPalette: formData.colorPalette ?? defaults.colorPalette,
    }
  }

  const collectionInStore = galleryStore.collections.find(c => c.id === collection.value?.id)
  if (!collectionInStore) {
    return {
      ...defaults,
      colorPalette: formData.colorPalette ?? defaults.colorPalette,
    }
  }

  // Merge all design configs from store, with current tab's formData taking priority
  const coverDesign = collectionInStore.design?.cover || collectionInStore.coverDesign || {}
  const typographyDesign = collectionInStore.design?.typography || collectionInStore.typographyDesign || {}
  const colorDesign = collectionInStore.design?.color || collectionInStore.colorDesign || {}
  const gridDesign = collectionInStore.design?.grid || collectionInStore.gridDesign || {}

  // If collection has cover image but no cover design set, default to 'center' instead of 'none'
  const hasCoverImage = collectionInStore?.image || collectionInStore?.thumbnail
  const defaultCoverType = hasCoverImage ? 'center' : 'none'

  return {
    ...defaults,
    // Cover config from store - use 'center' as default if image exists, otherwise 'none'
    cover: coverDesign.cover ?? defaultCoverType,
    coverLayoutUuid: coverDesign.coverLayoutUuid ?? defaults.coverLayoutUuid,
    coverFocalPoint: coverDesign.coverFocalPoint ?? defaults.coverFocalPoint,
    // Typography config from store
    fontFamily: typographyDesign.fontFamily ?? defaults.fontFamily,
    fontStyle: typographyDesign.fontStyle ?? defaults.fontStyle,
    // Color config: current formData takes priority over store
    colorPalette: formData.colorPalette ?? colorDesign.colorPalette ?? defaults.colorPalette,
    // Grid config from store
    gridStyle: gridDesign.gridStyle ?? defaults.gridStyle,
    gridColumns: gridDesign.gridColumns ?? defaults.gridColumns,
    thumbnailSize: gridDesign.thumbnailOrientation ?? gridDesign.thumbnailSize ?? defaults.thumbnailSize,
    gridSpacing: gridDesign.gridSpacing ?? defaults.gridSpacing,
    navigationStyle: gridDesign.tabStyle ?? gridDesign.navigationStyle ?? defaults.navigationStyle,
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
      collectionInStore.design.color = { ...newData }
      // Trigger reactivity by updating the array reference
      galleryStore.collections = [...galleryStore.collections]
    }
  },
  { deep: true }
)

// Color palettes
const colorPalettes = getColorPalettesArray()

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

    // Load color design data - use organized design.color structure from API
    const colorDesign =
      collectionData.design?.color ||
      collectionData.colorDesign ||
      (collectionData.design
        ? {
            colorPalette: collectionData.design.colorPalette,
          }
        : {})
    const loadedData = {
      colorPalette: colorDesign.colorPalette || 'light',
    }
    Object.assign(formData, loadedData)
    originalData.value = { ...loadedData }
  } catch (error) {
    // Use exact backend error message
    const errorMessage = error?.message || error?.response?.data?.message || 'Failed to load collection'
    toast.error(errorMessage)
    router.push({ name: 'collectionPhotos', params: { uuid: collection.value?.id } })
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

// Load preview media
const loadPreviewMedia = async () => {
  if (!collection.value?.id) {
    previewMedia.value = []
    return
  }

  isLoadingMedia.value = true
  try {
    const mediaSets = collection.value?.mediaSets || []
    
    if (mediaSets.length === 0) {
      previewMedia.value = []
      return
    }

    const allMedia = []
    for (const set of mediaSets) {
      try {
        const response = await collectionsApi.fetchSetMedia(collection.value.id, set.id, {
          perPage: 50,
        })
        
        const mediaItems = Array.isArray(response?.data) 
          ? response.data 
          : (Array.isArray(response) ? response : [])
        
        allMedia.push(...mediaItems.map(item => ({
          ...item,
          setId: set.id,
          setName: set.name,
        })))
      } catch (error) {
        console.error(`Failed to load media for set ${set.id}:`, error)
      }
    }
    
    previewMedia.value = allMedia
  } catch (error) {
    console.error('Failed to load preview media:', error)
    previewMedia.value = []
  } finally {
    isLoadingMedia.value = false
  }
}

// Watch collection and load media
watch(
  () => collection.value?.id,
  async (newId) => {
    if (newId) {
      await loadPreviewMedia()
    } else {
      previewMedia.value = []
    }
  },
  { immediate: true }
)

// Save color design
const saveColorDesign = async () => {
  if (!collection.value) {
    toast.error('Collection not found')
    return false
  }

  try {
    isSaving.value = true
    await galleryStore.updateCollection(collection.value.id, {
      colorDesign: formData,
    })

    if (originalData.value) {
      originalData.value = { ...formData }
    }
    return true
  } catch (error) {
    // Use exact backend error message
    const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save color design'
    toast.error(errorMessage)
    return false
  } finally {
    isSaving.value = false
  }
}

const handleSave = async () => {
  const success = await saveColorDesign()
  if (success) {
    toast.success('Color design saved successfully')
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
    saveFunction: saveColorDesign,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })

const goBack = async () => {
  isSubmitting.value = true
  try {
    const success = await saveColorDesign()
    if (success) {
      router.push({
        name: 'collectionPhotos',
        params: { uuid: collection.value.id },
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
  const success = await saveColorDesign()
  if (success) {
    const previewUrl = router.resolve({
      name: 'collectionPreview',
      params: { id: collectionId },
    }).href
    window.open(previewUrl, '_blank')
  }
}

// Preview collection - use real collection data
const previewCollection = computed(() => {
  if (!collection.value) return null
  
  return {
    id: collection.value.id,
    name: collection.value.name,
    date: collection.value.date,
    eventDate: collection.value.eventDate,
    image: collection.value.image,
    thumbnail: collection.value.thumbnail,
    createdAt: collection.value.createdAt,
    updatedAt: collection.value.updatedAt,
    status: collection.value.status,
    category: collection.value.category,
    mediaSets: collection.value.mediaSets,
  }
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
  background: rgba(163, 163, 184, 0.3);
  border-radius: 4px;
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(163, 163, 184, 0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(85, 85, 105, 0.4);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(85, 85, 105, 0.6);
}
</style>


