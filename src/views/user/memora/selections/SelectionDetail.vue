<template>
  <CollectionLayout :collection="collectionForLayout" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-all duration-300">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textTertiary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm font-medium">Loading selection...</p>
          </div>
        </div>

        <div v-else class="p-8">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold" :class="theme.textPrimary">
              {{ selection?.name || 'Selection' }}
            </h2>
            <p v-if="selection" class="text-sm mt-1" :class="theme.textSecondary">
              {{ mediaItems.length }} {{ mediaItems.length === 1 ? 'item' : 'items' }}
            </p>
          </div>

          <!-- Media Grid -->
          <div
            v-if="mediaItems.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <div
              v-for="item in mediaItems"
              :key="item.id"
              class="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800"
            >
              <img
                v-if="item.url || item.thumbnail"
                :src="item.thumbnail || item.url"
                :alt="item.name || 'Media item'"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
                :class="theme.textSecondary"
              >
                <span>No image</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <p :class="theme.textSecondary" class="text-lg mb-4">No media in this selection yet</p>
            <p :class="theme.textTertiary" class="text-sm">
              Upload media to get started with your selection workflow.
            </p>
          </div>
        </div>
      </main>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSelectionStore } from '@/stores/selection'
import { useMediaApi } from '@/api/media'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const selectionStore = useSelectionStore()
const mediaApi = useMediaApi()

const selection = ref(null)
const mediaItems = ref([])
const isLoading = ref(false)

// Convert selection to collection-like format for CollectionLayout
const collectionForLayout = computed(() => {
  if (!selection.value) return null
  return {
    id: selection.value.id,
    name: selection.value.name,
    title: selection.value.name,
    status: selection.value.status === 'completed' ? 'published' : 'draft',
    date: selection.value.createdAt,
    presetId: null,
    watermarkId: null,
    mediaSets: [],
  }
})

const loadSelection = async () => {
  const selectionId = route.params.id
  if (!selectionId) return

  isLoading.value = true
  try {
    // Fetch selection with media
    const selectionData = await selectionStore.fetchSelection(selectionId)
    selection.value = selectionData

    // Load media for this selection
    // Use fetchPhaseMedia to get selection media
    try {
      const selectionMedia = await mediaApi.fetchPhaseMedia('selection', selectionId)
      mediaItems.value = selectionMedia || []
    } catch (error) {
      console.error('Failed to load selection media:', error)
      mediaItems.value = []
    }
  } catch (error) {
    console.error('Failed to load selection:', error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'selections' })
}

onMounted(() => {
  loadSelection()
})

watch(
  () => route.params.id,
  () => {
    loadSelection()
  }
)
</script>
