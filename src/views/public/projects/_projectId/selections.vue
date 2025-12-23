<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
    </div>

    <div v-else-if="selection" class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ project?.name || 'Selections' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Please select your favorite media from the options below
        </p>
      </div>

      <!-- Instructions -->
      <div
        v-if="selection.status !== 'completed'"
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
      >
        <p class="text-sm text-blue-800 dark:text-blue-200">
          Click on media items to select them. Selected items will be marked with a checkmark.
        </p>
      </div>

      <!-- Completed Message -->
      <div
        v-else
        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
      >
        <p class="text-sm text-green-800 dark:text-green-200">
          Selection has been completed. Thank you!
        </p>
      </div>

      <!-- Media Grid -->
      <div v-if="mediaItems.length > 0" class="space-y-6">
        <div class="flex items-center justify-between">
          <p class="text-gray-700 dark:text-gray-300 font-medium">
            {{ selectedCount }} of {{ mediaItems.length }} selected
          </p>
          <Button
            v-if="selection.status !== 'completed'"
            class="bg-teal-500 hover:bg-teal-600 text-white"
            @click="handleComplete"
          >
            Complete Selection
          </Button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="item in mediaItems"
            :key="item.id"
            :class="[
              'relative cursor-pointer rounded-lg overflow-hidden transition-all',
              item.isSelected
                ? 'ring-4 ring-teal-500 scale-105'
                : 'hover:scale-105 hover:shadow-lg',
            ]"
            @click="handleToggleSelection(item.id)"
          >
            <img
              v-if="item.type === 'image'"
              :src="item.thumbnail || item.url"
              :alt="item.title"
              class="w-full aspect-square object-cover"
            />
            <video v-else :src="item.url" class="w-full aspect-square object-cover" />
            <div
              v-if="item.isSelected"
              class="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1"
            >
              <CheckCircle2 class="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">No media available yet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2, CheckCircle2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { useProjectStore } from '@/stores/project'
import { useSelectionStore } from '@/stores/selection'
import { useMediaApi } from '@/api/media'
import { useSelectionWorkflow } from '@/composables/useSelectionWorkflow'

const route = useRoute()

const projectStore = useProjectStore()
const selectionStore = useSelectionStore()
const mediaApi = useMediaApi()

const projectId = computed(() => route.params.projectId)
const project = ref(null)
const selection = ref(null)
const mediaItems = ref([])
const isLoading = ref(true)

const selectedCount = computed(() => mediaItems.value.filter(m => m.isSelected).length)

const loadData = async () => {
  isLoading.value = true
  try {
    const projectData = await projectStore.fetchProject(projectId.value)
    project.value = projectData

    if (projectData.selections && projectData.selections.length > 0) {
      const selectionData = await selectionStore.fetchSelection(projectData.selections[0].id)
      selection.value = selectionData
      mediaItems.value = selectionData.media || []
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const loadMediaItems = async () => {
  if (!selection.value) return
  try {
    const media = await mediaApi.fetchPhaseMedia('selection', selection.value.id)
    mediaItems.value = media
  } catch (error) {}
}

const { markMediaSelected, completeSelection } = useSelectionWorkflow({
  selectionId: computed(() => selection.value?.id),
  loadMediaItems,
})

const handleToggleSelection = async mediaId => {
  if (selection.value?.status === 'completed') return

  try {
    const item = mediaItems.value.find(m => m.id === mediaId)
    if (item && !item.isSelected) {
      await markMediaSelected(mediaId)
    } else {
      await mediaApi.updateMedia(mediaId, {
        isSelected: false,
        selectedAt: null,
      })
      await loadMediaItems()
    }
  } catch (error) {}
}

const handleComplete = async () => {
  try {
    await completeSelection()
    await loadData()
  } catch (error) {}
}

onMounted(() => {
  loadData()
})
</script>
