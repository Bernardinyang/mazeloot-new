<template>
  <ProofingLayout
    :is-loading="isLoading"
    :proofing="proofing"
    :overall-progress="overallProgress"
    @go-back="goBack"
  >
    <template #content>
      <div class="p-8">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Comments</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            View and reply to all comments across media in this proofing
          </p>
        </div>

        <!-- Comments Dashboard -->
        <CommentsDashboard
          :media="allMediaWithComments"
          :is-loading="isLoadingMedia"
          @open-comments="handleOpenComments"
        />

        <!-- Media Comment Lightbox -->
        <MediaCommentLightbox
          v-model="showCommentsPanel"
          :initial-index="selectedMediaIndex"
          :items="allMediaWithComments"
          :proofing-id="proofingId"
          :project-id="projectId"
          @close="handleCloseLightbox"
        />
      </div>
    </template>
  </ProofingLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProofingLayout from '@/layouts/ProofingLayout.vue'
import CommentsDashboard from '@/components/organisms/CommentsDashboard.vue'
import MediaCommentLightbox from '@/components/organisms/MediaCommentLightbox.vue'
import { useProofingStore } from '@/stores/proofing'
import { useProofingApi } from '@/api/proofing'
import { useProofingProgress } from '@/composables/useProofingProgress'

const route = useRoute()
const router = useRouter()
const proofingStore = useProofingStore()
const proofingApi = useProofingApi()

const proofingId = computed(() => route.params.id)
const projectId = computed(() => route.params.projectId || null)

const isLoading = ref(true)
const isLoadingMedia = ref(true)
const proofing = ref(null)
const allMedia = ref([])
const selectedMedia = ref(null)
const selectedMediaIndex = ref(0)
const showCommentsPanel = ref(false)

const overallProgress = computed(() => {
  if (!proofing.value) return { selected: 0, total: 0, percentage: 0 }
  return useProofingProgress(proofing.value)
})

const allMediaWithComments = computed(() => {
  return allMedia.value.filter(media => {
    const feedback = media.feedback || []
    return feedback.length > 0
  })
})

const goBack = () => {
  router.push({
    name: 'proofingDetail',
    params: { id: proofingId.value },
  })
}

const loadProofing = async () => {
  try {
    isLoading.value = true
    const data = await proofingStore.fetchProofing(proofingId.value, projectId.value)
    proofing.value = data
  } catch (error) {
    console.error('Failed to load proofing:', error)
  } finally {
    isLoading.value = false
  }
}

const loadMedia = async () => {
  try {
    isLoadingMedia.value = true

    // Load all media sets and their media
    if (!proofing.value) return

    const sets = proofing.value.mediaSets || []
    const allMediaItems = []

    for (const set of sets) {
      try {
        // Use the API client directly to fetch media for each set
        const { apiClient } = await import('@/api/client')
        let endpoint
        if (projectId.value) {
          endpoint = `/v1/projects/${projectId.value}/proofing/${proofingId.value}/sets/${set.id}/media`
        } else {
          endpoint = `/v1/proofing/${proofingId.value}/sets/${set.id}/media`
        }

        const response = await apiClient.get(endpoint)
        const mediaData = response.data?.data || response.data || []

        // Add setId to each media item for reference
        const mediaWithSetId = Array.isArray(mediaData)
          ? mediaData.map(item => ({ ...item, setId: set.id }))
          : []

        allMediaItems.push(...mediaWithSetId)
      } catch (error) {
        console.error(`Failed to load media for set ${set.id}:`, error)
      }
    }

    allMedia.value = allMediaItems
  } catch (error) {
    console.error('Failed to load media:', error)
  } finally {
    isLoadingMedia.value = false
  }
}

const handleOpenComments = media => {
  // Find the index of the selected media in the filtered list
  const index = allMediaWithComments.value.findIndex(m => m.id === media.id)
  selectedMediaIndex.value = index >= 0 ? index : 0
  selectedMedia.value = media
  showCommentsPanel.value = true
}

const handleCloseLightbox = async () => {
  showCommentsPanel.value = false
  // Reload media to get updated comment counts
  await loadMedia()
}

onMounted(async () => {
  await loadProofing()
  await loadMedia()
})
</script>
