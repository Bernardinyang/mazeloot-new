<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <ContentLoader v-if="isLoading" message="Loading cover styles..." />
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
                Configure your collection cover settings. See your changes in real-time in
                the preview panel.
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-12rem)]">
          <!-- Main Content -->
          <div class="lg:col-span-2 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto space-y-12 pr-2 min-h-0">
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
                    :preview-media="[]"
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
                backgroundPosition: `${formData.coverFocalPoint.x}% ${formData.coverFocalPoint.y}%`,
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
import { computed, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { Check, ExternalLink, Eye, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import ContentLoader from '@/components/molecules/ContentLoader.vue'
import CollectionPreview from '@/views/user/memora/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { toast } from '@/utils/toast'

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
const formData = reactive({
  coverLayoutUuid: null,
  coverFocalPoint: { x: 50, y: 50 },
})

// Store original loaded data for comparison
const originalData = ref(null)

const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoading.value) {
    return false
  }
  return (
    formData.coverLayoutUuid !== originalData.value.coverLayoutUuid ||
    formData.coverFocalPoint.x !== originalData.value.coverFocalPoint.x ||
    formData.coverFocalPoint.y !== originalData.value.coverFocalPoint.y
  )
})

// IMPORTANT: formData values always take priority to ensure live preview reflects current form state
const previewDesignConfig = computed(() => {
  const defaults = {
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
    return {
      ...defaults,
      coverFocalPoint: formData.coverFocalPoint || defaults.coverFocalPoint,
    }
  }

  const collectionInStore = galleryStore.collections.find(c => c.id === collection.value?.id)
  if (!collectionInStore) {
    return {
      ...defaults,
      coverFocalPoint: formData.coverFocalPoint || defaults.coverFocalPoint,
    }
  }

  // Use organized design structure from API response
  const coverDesign = collectionInStore.design?.cover || collectionInStore.coverDesign || {}
  const typographyDesign = collectionInStore.design?.typography || collectionInStore.typographyDesign || {}
  const colorDesign = collectionInStore.design?.color || collectionInStore.colorDesign || {}
  const gridDesign = collectionInStore.design?.grid || collectionInStore.gridDesign || {}

  return {
    ...defaults,
    ...typographyDesign,
    ...colorDesign,
    ...gridDesign,
    coverLayoutUuid: formData.coverLayoutUuid ?? coverDesign.coverLayoutUuid ?? null,
    coverFocalPoint:
      formData.coverFocalPoint ?? coverDesign.coverFocalPoint ?? defaults.coverFocalPoint,
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
      collectionInStore.design.cover = {
        coverLayoutUuid: newData.coverLayoutUuid,
        coverFocalPoint: newData.coverFocalPoint,
      }
      // Trigger reactivity by updating the array reference
      galleryStore.collections = [...galleryStore.collections]
    }
  },
  { deep: true }
)


const handleFocalPointClick = event => {
  if (!focalPointImageContainer.value) return

  const rect = focalPointImageContainer.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  // Clamp values between 0 and 100
  formData.coverFocalPoint = {
    x: Math.min(100, Math.max(0, x)),
    y: Math.min(100, Math.max(0, y)),
  }
}

const handleCoverPhotoClick = () => {
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
      toast.error('Collection not found', {
        description:
          'The collection you are trying to edit no longer exists. Redirecting to collections...',
      })
      router.push({ name: 'manageCollections' })
      return
    }

    collection.value = collectionData

    // Load cover design data - use organized design.cover structure from API
    const coverDesign = collectionData.design?.cover || collectionData.coverDesign || {}

    const loadedData = {
      coverLayoutUuid: coverDesign.coverLayoutUuid || null,
      coverFocalPoint:
        coverDesign.coverFocalPoint && typeof coverDesign.coverFocalPoint === 'object'
          ? { ...coverDesign.coverFocalPoint }
          : { x: 50, y: 50 },
    }
    Object.assign(formData, loadedData)
    originalData.value = { ...loadedData }

    collectionCoverImage.value = collectionData.thumbnail || null
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('Collection not found') || errorMessage === 'Collection not found') {
      toast.error('Collection not found', {
        description:
          'The collection you are trying to edit no longer exists. Redirecting to collections...',
      })
      router.push({ name: 'manageCollections' })
    } else {
      toast.error('Failed to load collection', {
        description: errorMessage,
      })
      router.push({ name: 'manageCollections' })
    }
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

    // Ensure we're saving the complete coverDesign object
    const coverDesignData = {
      coverLayoutUuid: formData.coverLayoutUuid,
      coverFocalPoint: formData.coverFocalPoint || { x: 50, y: 50 },
    }

    // Ensure coverFocalPoint is always an object with x and y
    if (!coverDesignData.coverFocalPoint || typeof coverDesignData.coverFocalPoint !== 'object') {
      coverDesignData.coverFocalPoint = { x: 50, y: 50 }
    }

    // Ensure coverFocalPoint has x and y properties
    if (!coverDesignData.coverFocalPoint.x || !coverDesignData.coverFocalPoint.y) {
      coverDesignData.coverFocalPoint = {
        x: coverDesignData.coverFocalPoint.x ?? 50,
        y: coverDesignData.coverFocalPoint.y ?? 50,
      }
    }

    await galleryStore.updateCollection(collection.value.id, {
      coverDesign: coverDesignData,
    })

    if (originalData.value) {
      originalData.value = { ...formData }
    }
    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('Collection not found') || errorMessage === 'Collection not found') {
      toast.error('Collection not found', {
        description:
          'The collection you are trying to edit no longer exists. Redirecting to collections...',
      })
      // Navigate back to collections list
      router.push({ name: 'manageCollections' })
      return false
    }

    toast.error('Failed to save cover design', {
      description: errorMessage,
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
    Object.assign(formData, originalData.value)
  }
}

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
  name: collection.value?.name || 'Sample Collection',
  date: collection.value?.date || new Date().toISOString().split('T')[0],
  eventDate: collection.value?.eventDate || null,
  thumbnail: collection.value?.image || collection.value?.thumbnail || fallbackImageUrl,
  image: collection.value?.image || collection.value?.thumbnail || fallbackImageUrl,
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
