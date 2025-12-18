<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
    </div>

    <div v-else-if="proofing" class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ project?.name || 'Proofing' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Review the edited media and provide your feedback
        </p>
      </div>

      <!-- Media with Feedback -->
      <div v-if="mediaItems.length > 0" class="space-y-8">
        <div
          v-for="item in mediaItems"
          :key="item.id"
          class="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Media Preview -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ item.title }}
                </h3>
                <span
                  v-if="item.revisionNumber"
                  class="text-xs px-2 py-1 rounded bg-blue-500 text-white"
                >
                  Revision {{ item.revisionNumber }}
                </span>
              </div>
              <img
                v-if="item.type === 'image'"
                :src="item.thumbnail || item.url"
                :alt="item.title"
                class="w-full rounded-lg"
              />
              <video v-else :src="item.url" controls class="w-full rounded-lg" />

              <!-- Mark as Approved -->
              <div class="mt-4">
                <Button
                  v-if="!item.isCompleted"
                  class="w-full bg-green-500 hover:bg-green-600 text-white"
                  @click="handleMarkApproved(item.id)"
                >
                  Mark as Approved
                </Button>
                <div
                  v-else
                  class="w-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-center py-2 rounded-lg"
                >
                  ✓ Approved
                </div>
              </div>
            </div>

            <!-- Feedback Section -->
            <div class="space-y-4">
              <FeedbackList :feedback="getMediaFeedback(item.id)" />
              <FeedbackPanel
                v-if="proofing.status !== 'completed'"
                :media-id="item.id"
                :is-submitting="isSubmittingFeedback"
                @submit="handleAddFeedback(item.id, $event)"
              />
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
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import FeedbackPanel from '@/components/molecules/FeedbackPanel.vue'
import FeedbackList from '@/components/molecules/FeedbackList.vue'
import { useProjectStore } from '@/stores/project'
import { useProofingStore } from '@/stores/proofing'
import { useProofingWorkflow } from '@/composables/useProofingWorkflow'

const route = useRoute()

const projectStore = useProjectStore()
const proofingStore = useProofingStore()

const projectId = computed(() => route.params.projectId)
const project = ref(null)
const proofing = ref(null)
const mediaItems = ref([])
const feedback = ref([])
const isSubmittingFeedback = ref(false)
const isLoading = ref(true)

const loadData = async () => {
  isLoading.value = true
  try {
    const projectData = await projectStore.fetchProject(projectId.value)
    project.value = projectData

    if (projectData.proofing && projectData.proofing.length > 0) {
      const proofingData = await proofingStore.fetchProofing(projectData.proofing[0].id)
      proofing.value = proofingData
      mediaItems.value = proofingData.media || []
      feedback.value = proofingData.feedback || []
    }
  } catch (error) {
    console.error('Failed to load proofing:', error)
  } finally {
    isLoading.value = false
  }
}

const { addFeedback, markMediaApproved } = useProofingWorkflow({
  proofingId: computed(() => proofing.value?.id),
  loadMediaItems: loadData,
})

const handleAddFeedback = async (mediaId, [type, content]) => {
  isSubmittingFeedback.value = true
  try {
    await addFeedback(mediaId, type, content)
    await loadData()
  } catch (error) {
    console.error('Failed to add feedback:', error)
  } finally {
    isSubmittingFeedback.value = false
  }
}

const handleMarkApproved = async mediaId => {
  try {
    await markMediaApproved(mediaId)
    await loadData()
  } catch (error) {
    console.error('Failed to mark approved:', error)
  }
}

const getMediaFeedback = mediaId => {
  return feedback.value.filter(f => f.mediaId === mediaId)
}

onMounted(() => {
  loadData()
})
</script>
