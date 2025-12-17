<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
        <div class="text-center space-y-4">
          <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
          <p :class="theme.textSecondary" class="text-sm">Loading cover styles...</p>
        </div>
      </div>
      <div v-else class="p-8 pb-16 transition-all duration-300 w-full h-full overflow-y-auto">
        <div class="mb-10">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 :class="theme.textPrimary" class="text-3xl font-bold">Cover</h1>
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 scale-95 -translate-x-2"
                  enter-to-class="opacity-100 scale-100 translate-x-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-x-0"
                  leave-to-class="opacity-0 scale-95 -translate-x-2"
                >
                  <div
                    v-if="hasUnsavedChanges && !isSaving"
                    class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                    <span>Unsaved changes</span>
                  </div>
                </Transition>
              </div>
              <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
                Choose a cover layout style for your collection. See your changes in real-time in
                the preview panel.
              </p>
            </div>
            <!-- Quick Stats -->
            <div class="hidden md:flex gap-4">
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="px-4 py-2 rounded-lg border"
              >
                <div :class="theme.textTertiary" class="text-xs">Cover Style</div>
                <div :class="theme.textPrimary" class="text-sm font-semibold mt-0.5">
                  {{ coverOptions.find(c => c.id === formData.cover)?.label || 'Left' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-12rem)]">
          <!-- Main Content -->
          <div class="lg:col-span-2 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto space-y-12 pr-2 min-h-0">
              <!-- Cover Layout Section -->
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                      Cover Layout
                    </h3>
                    <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                      Choose how your collection title appears on the cover
                    </p>
                  </div>
                  <div
                    class="px-3 py-1.5 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/20 dark:border-teal-500/30"
                  >
                    <span class="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {{ coverOptions.find(c => c.id === formData.cover)?.label || 'Left' }}
                    </span>
                  </div>
                </div>

                <!-- Cover Layout Presets Grid -->
                <div
                  class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                >
                  <div v-for="cover in coverOptions" :key="cover.id" class="flex flex-col gap-3">
                    <button
                      :class="[
                        formData.cover === cover.id
                          ? 'border-teal-500 ring-2 ring-teal-500/30 scale-[1.02]'
                          : [
                              theme.borderSecondary,
                              'hover:border-teal-500/70',
                              'active:scale-[0.98]',
                            ],
                        theme.bgCard,
                      ]"
                      class="group relative aspect-square rounded-xl border-2 transition-all duration-300 hover:scale-[1.05] overflow-hidden cursor-pointer"
                      @click="formData.cover = cover.id"
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
                          v-if="formData.cover === cover.id"
                          class="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-900"
                        >
                          <Check class="h-3.5 w-3.5 text-white" />
                        </div>
                      </Transition>

                      <!-- Cover previews based on type -->
                      <div class="w-full h-full">
                        <CoverPreview :type="cover.id" />
                      </div>
                    </button>
                    <!-- Cover style label -->
                    <span
                      :class="
                        formData.cover === cover.id
                          ? 'text-teal-600 dark:text-teal-400 font-bold'
                          : theme.textSecondary
                      "
                      class="text-xs md:text-sm font-semibold text-center transition-all duration-200"
                    >
                      {{ cover.label }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Cover Focal Point Section -->
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="space-y-5 p-6 rounded-2xl border-2 transition-shadow duration-300"
              >
                <div class="mb-2">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Cover Focal Point
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Choose where to focus the cover image for optimal cropping
                  </p>
                </div>
                <Button
                  :class="[theme.borderSecondary, theme.bgCard, theme.textPrimary]"
                  class="w-full group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 transition-all duration-200"
                  variant="outline"
                  @click="showFocalPointModal = true"
                >
                  <Eye
                    class="h-4 w-4 mr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                  />
                  <span>Set Focal Point</span>
                </Button>
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

      <!-- Focal Point Modal -->
      <Dialog :open="showFocalPointModal" @update:open="showFocalPointModal = $event">
        <DialogContent
          :class="[theme.bgCard, theme.borderCard, 'sm:max-w-4xl p-0', 'focal-point-dialog']"
        >
          <DialogHeader class="px-6 pt-6 pb-4">
            <DialogTitle :class="['text-lg font-semibold uppercase', theme.textPrimary]">
              SET FOCAL POINT
            </DialogTitle>
          </DialogHeader>

          <div class="px-6 pb-6">
            <div
              ref="focalPointImageContainer"
              :style="{
                aspectRatio: '16/9',
                backgroundImage: collectionCoverImage
                  ? `url(${collectionCoverImage})`
                  : collection.thumbnail
                    ? `url(${collection.thumbnail})`
                    : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }"
              class="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-crosshair"
              @click="handleFocalPointClick"
            >
              <!-- Focal Point Indicator -->
              <div
                :style="{
                  left: `${formData.coverFocalPoint.x}%`,
                  top: `${formData.coverFocalPoint.y}%`,
                  transform: 'translate(-50%, -50%)',
                }"
                class="absolute w-8 h-8 rounded-full border-4 border-white bg-green-500 pointer-events-none transition-all duration-100"
              >
                <div class="w-full h-full rounded-full bg-white/30"></div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 mt-4">
              <Button
                :class="[theme.textSecondary, theme.bgButtonHover]"
                type="button"
                variant="ghost"
                @click="showFocalPointModal = false"
              >
                Cancel
              </Button>
              <Button
                class="bg-teal-500 hover:bg-teal-600 text-white"
                type="button"
                @click="showFocalPointModal = false"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { Check, ExternalLink, Eye, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import CoverPreview from '@/components/organisms/CoverPreview.vue'
import CollectionPreview from '@/views/user/memora/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { toast } from 'vue-sonner'
// Cover options - matching the image description
import { coverStyleConfigs } from '@/config/coverStyles'

const description = ''

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const isLoading = ref(false)

// Sidebar collapse state with persistence
const { isSidebarCollapsed } = useSidebarCollapse()
const showFocalPointModal = ref(false)
const focalPointImageContainer = ref(null)
const collectionCoverImage = ref(null)
const isSaving = ref(false)
const isSubmitting = ref(false)
const showUnsavedChangesModal = ref(false)

// Cover form data
const formData = ref({
  cover: 'none',
  coverFocalPoint: { x: 50, y: 50 },
})

// Store original loaded data for comparison
const originalData = ref(null)

// Check if there are actual unsaved changes
const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoading.value) {
    return false
  }
  return (
    formData.value.cover !== originalData.value.cover ||
    formData.value.coverFocalPoint.x !== originalData.value.coverFocalPoint.x ||
    formData.value.coverFocalPoint.y !== originalData.value.coverFocalPoint.y
  )
})

// Get merged design config for preview (from collection store)
const previewDesignConfig = computed(() => {
  const defaults = {
    cover: 'none',
    coverFocalPoint: { x: 50, y: 50 },
    fontFamily: 'sans',
    fontStyle: 'normal',
    colorPalette: 'light',
    gridStyle: 'classic',
    gridColumns: 3,
    thumbnailSize: 'medium',
    gridSpacing: 'normal',
    navigationStyle: 'icon-text',
  }

  if (!collection.value) {
    // Fallback to formData if collection not loaded
    return {
      ...defaults,
      cover: formData.value.cover,
      coverFocalPoint: formData.value.coverFocalPoint || defaults.coverFocalPoint,
    }
  }

  const collectionInStore = galleryStore.collections.find(c => c.id === collection.value?.id)
  if (!collectionInStore) {
    // Fallback to formData if not in store
    return {
      ...defaults,
      cover: formData.value.cover,
      coverFocalPoint: formData.value.coverFocalPoint || defaults.coverFocalPoint,
    }
  }

  // Get all design configs from the collection in store (which is updated by the watcher)
  // Check for separate design properties first, then fallback to unified design object
  const coverDesign =
    collectionInStore.coverDesign ||
    (collectionInStore.design
      ? {
          cover: collectionInStore.design.cover,
          coverFocalPoint: collectionInStore.design.coverFocalPoint,
        }
      : {})
  const typographyDesign =
    collectionInStore.typographyDesign ||
    (collectionInStore.design
      ? {
          fontFamily: collectionInStore.design.fontFamily,
          fontStyle: collectionInStore.design.fontStyle,
        }
      : {})
  const colorDesign =
    collectionInStore.colorDesign ||
    (collectionInStore.design
      ? {
          colorPalette: collectionInStore.design.colorPalette,
        }
      : {})
  const gridDesign =
    collectionInStore.gridDesign ||
    (collectionInStore.design
      ? {
          gridStyle: collectionInStore.design.gridStyle,
          gridColumns: collectionInStore.design.gridColumns,
          thumbnailSize: collectionInStore.design.thumbnailSize,
          gridSpacing: collectionInStore.design.gridSpacing,
          navigationStyle: collectionInStore.design.navigationStyle,
        }
      : {})

  // Return merged config from store
  return {
    ...defaults,
    ...typographyDesign,
    ...colorDesign,
    ...gridDesign,
    ...coverDesign,
    cover: coverDesign.cover ?? formData.value.cover,
    coverFocalPoint:
      coverDesign.coverFocalPoint ?? formData.value.coverFocalPoint ?? defaults.coverFocalPoint,
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
      collectionInStore.coverDesign = { ...newData }
      // Trigger reactivity by updating the array reference
      galleryStore.collections = [...galleryStore.collections]
    }
  },
  { deep: true }
)

const coverOptions = Object.values(coverStyleConfigs).map(config => ({
  id: config.id,
  label: config.label,
}))

// Handle focal point click
const handleFocalPointClick = event => {
  if (!focalPointImageContainer.value) return

  const rect = focalPointImageContainer.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  // Clamp values between 0 and 100
  formData.value.coverFocalPoint = {
    x: Math.min(100, Math.max(0, x)),
    y: Math.min(100, Math.max(0, y)),
  }
}

// Handle cover photo click
const handleCoverPhotoClick = () => {
  // TODO
  toast.info('Cover Photo', {
    description,
  })
}

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

    // Load cover design data
    // Check for coverDesign first, then fallback to design object (for backward compatibility)
    const coverDesign =
      collectionData.coverDesign ||
      (collectionData.design
        ? {
            cover: collectionData.design.cover,
            coverFocalPoint: collectionData.design.coverFocalPoint,
          }
        : {})
    const loadedData = {
      cover: coverDesign.cover || 'none',
      coverFocalPoint:
        coverDesign.coverFocalPoint && typeof coverDesign.coverFocalPoint === 'object'
          ? { ...coverDesign.coverFocalPoint }
          : { x: 50, y: 50 },
    }
    formData.value = { ...loadedData }
    originalData.value = { ...loadedData }

    // Set cover image
    collectionCoverImage.value = collectionData.thumbnail || null
  } catch (error) {
    toast.error('Failed to load collection', {
      description,
    })
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

// Save cover design
const saveCoverDesign = async () => {
  if (!collection.value) {
    toast.error('Collection not found')
    return false
  }

  try {
    isSaving.value = true
    await galleryStore.updateCollection(collection.value.id, {
      coverDesign: formData.value,
    })

    // Update original data after successful save
    if (originalData.value) {
      originalData.value = { ...formData.value }
    }
    return true
  } catch (error) {
    toast.error('Failed to save cover design', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
    return false
  } finally {
    isSaving.value = false
  }
}

const handleSave = async () => {
  const success = await saveCoverDesign()
  if (success) {
    toast.success('Cover design saved successfully', {
      description,
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
    saveFunction: saveCoverDesign,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })

const goBack = async () => {
  isSubmitting.value = true
  try {
    const success = await saveCoverDesign()
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
  const success = await saveCoverDesign()
  if (success) {
    const previewUrl = router.resolve({
      name: 'collectionPreview',
      params: { uuid: collectionId },
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
  name: collection.value?.name || 'Sample Collection',
  date: collection.value?.date || new Date().toISOString().split('T')[0],
  eventDate: collection.value?.eventDate || null,
  thumbnail: collection.value?.thumbnail || fallbackImageUrl,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'active',
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
    id: `mock-media-${id}`,
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
/* Hide the default DialogContent close button in focal point modal */
:deep(.focal-point-dialog > button[class*='absolute'][class*='right-4'][class*='top-4']) {
  display: none;
}

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
