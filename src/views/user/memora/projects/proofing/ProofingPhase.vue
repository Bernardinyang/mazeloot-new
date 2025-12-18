<template>
  <DashboardLayout>
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <router-link v-if="project?.id" :to="{ name: 'projects' }" class="hover:underline">
                Projects
              </router-link>
              <router-link v-else :to="{ name: 'proofing' }" class="hover:underline">
                Proofing
              </router-link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="project?.id" />
          <BreadcrumbItem v-if="project?.id">
            <BreadcrumbLink as-child>
              <router-link
                :to="{ name: 'projectDashboard', params: { id: projectId } }"
                class="hover:underline"
              >
                {{ project?.name }}
              </router-link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Proofing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </template>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <div v-else-if="proofing" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 :class="theme.textPrimary" class="text-2xl font-bold">Proofing</h1>
          <p :class="theme.textSecondary" class="mt-1">Review edited media with client feedback</p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            v-if="proofing.status !== 'completed'"
            variant="default"
            size="sm"
            class="bg-teal-500 hover:bg-teal-600 text-white"
            @click="handleComplete"
          >
            Complete Proofing
          </Button>
          <Button
            v-if="proofing.status === 'completed' && projectCollections.length > 0"
            variant="default"
            size="sm"
            class="bg-purple-500 hover:bg-purple-600 text-white"
            @click="handleMoveToCollection"
          >
            Move to Collection
          </Button>
        </div>
      </div>

      <!-- Status Info -->
      <div :class="[theme.bgCard, theme.borderCard, 'border rounded-xl p-4']">
        <div class="flex items-center justify-between">
          <div>
            <p :class="theme.textPrimary" class="font-medium">
              Revision {{ proofing.currentRevision }}/{{ proofing.maxRevisions }}
            </p>
            <p :class="theme.textSecondary" class="text-sm mt-1">
              {{ completedCount }}/{{ mediaItems.length }} media approved
            </p>
          </div>
          <div
            :class="[
              proofing.status === 'completed' ? 'bg-green-500' : 'bg-purple-500',
              'text-white text-xs px-2 py-1 rounded-full',
            ]"
          >
            {{ proofing.status }}
          </div>
        </div>
      </div>

      <!-- Upload Revision Area -->
      <div
        v-if="proofing.status !== 'completed'"
        :class="[
          theme.bgCard,
          theme.borderCard,
          'border-2 border-dashed rounded-xl p-8 text-center',
        ]"
      >
        <input
          ref="fileInputRef"
          accept="image/*,video/*"
          class="hidden"
          multiple
          type="file"
          @change="handleFileSelect"
        />
        <Button
          variant="outline"
          size="lg"
          :class="[theme.borderSecondary, theme.textPrimary]"
          @click="fileInputRef?.click()"
        >
          <Upload class="mr-2 h-5 w-5" />
          Upload Edited Media
        </Button>
        <p :class="theme.textSecondary" class="text-sm mt-2">
          Upload edited versions for client review
        </p>
      </div>

      <!-- Media Grid with Feedback -->
      <div v-if="mediaItems.length > 0" class="space-y-6">
        <div
          v-for="item in mediaItems"
          :key="item.id"
          :class="[theme.bgCard, theme.borderCard, 'border rounded-xl p-6']"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Media Preview -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span :class="theme.textPrimary" class="font-medium">{{ item.title }}</span>
                  <span
                    v-if="item.revisionNumber"
                    class="text-xs px-2 py-0.5 rounded bg-blue-500 text-white"
                  >
                    Rev {{ item.revisionNumber }}
                  </span>
                </div>
                <Button
                  v-if="!item.isCompleted && proofing.status !== 'completed'"
                  variant="outline"
                  size="sm"
                  :class="[theme.borderSecondary, theme.textPrimary]"
                  @click="handleMarkApproved(item.id)"
                >
                  Mark Approved
                </Button>
                <span
                  v-else-if="item.isCompleted"
                  class="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white"
                >
                  Approved
                </span>
              </div>
              <img
                v-if="item.type === 'image'"
                :src="item.thumbnail || item.url"
                :alt="item.title"
                class="w-full rounded-lg"
              />
              <video v-else :src="item.url" controls class="w-full rounded-lg" />
            </div>

            <!-- Feedback Section -->
            <div class="space-y-4">
              <FeedbackList :feedback="getMediaFeedback(item.id)" />
              <FeedbackPanel
                v-if="proofing.status !== 'completed'"
                :media-id="item.id"
                :is-submitting="isSubmittingFeedback"
                @submit="handleAddFeedback(item.id, $event)"
                @cancel="selectedMediaId = null"
              />
            </div>
          </div>

          <!-- Revision History -->
          <div v-if="item.revisionNumber > 1" class="mt-4">
            <RevisionHistory :revisions="mediaRevisions[item.id] || []" />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p :class="theme.textSecondary">No media uploaded yet</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, Upload } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn/breadcrumb'
import FeedbackPanel from '@/components/molecules/FeedbackPanel.vue'
import FeedbackList from '@/components/molecules/FeedbackList.vue'
import RevisionHistory from '@/components/molecules/RevisionHistory.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProjectStore } from '@/stores/project'
import { useProofingStore } from '@/stores/proofing'
import { useMediaApi } from '@/api/media'
import { useProofingWorkflow } from '@/composables/useProofingWorkflow'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()

const projectStore = useProjectStore()
const proofingStore = useProofingStore()
const mediaApi = useMediaApi()

const projectId = computed(() => route.params.id)
const project = ref(null)
const proofing = ref(null)
const mediaItems = ref([])
const feedback = ref([])
const projectCollections = ref([])
const fileInputRef = ref(null)
const selectedMediaId = ref(null)
const isSubmittingFeedback = ref(false)
const isLoading = ref(true)
const mediaRevisions = ref({})

const completedCount = computed(() => mediaItems.value.filter(m => m.isCompleted).length)

const loadData = async () => {
  isLoading.value = true
  try {
    // Check if this is a standalone proofing (via query param) or project-linked
    const proofingIdFromQuery = route.query.proofingId

    if (proofingIdFromQuery) {
      // Load standalone proofing directly
      const proofingData = await proofingStore.fetchProofing(proofingIdFromQuery)
      proofing.value = proofingData
      mediaItems.value = proofingData.media || []
      feedback.value = proofingData.feedback || []

      // Load revision history
      await loadMediaRevisions()

      // If it has a projectId, load the project for breadcrumb and collections
      if (proofingData.projectId && projectId.value !== 'standalone') {
        try {
          const projectData = await projectStore.fetchProject(proofingData.projectId)
          project.value = projectData

          // Get project collections
          if (projectData.collections) {
            projectCollections.value = projectData.collections
          }
        } catch (err) {
          // Project not found, but continue with standalone proofing
          console.warn('Project not found for proofing:', err)
        }
      }
    } else if (projectId.value && projectId.value !== 'standalone') {
      // Load project and its proofing phase
      const projectData = await projectStore.fetchProject(projectId.value)
      project.value = projectData

      // Get proofing phase
      if (projectData.proofing && projectData.proofing.length > 0) {
        const proofingData = await proofingStore.fetchProofing(projectData.proofing[0].id)
        proofing.value = proofingData
        mediaItems.value = proofingData.media || []
        feedback.value = proofingData.feedback || []

        // Load revision history
        await loadMediaRevisions()
      }

      // Get project collections
      if (projectData.collections) {
        projectCollections.value = projectData.collections
      }
    }
  } catch (error) {
    console.error('Failed to load proofing phase:', error)
  } finally {
    isLoading.value = false
  }
}

const loadMediaItems = async () => {
  if (!proofing.value) return
  try {
    const media = await mediaApi.fetchPhaseMedia('proofing', proofing.value.id)
    mediaItems.value = media
  } catch (error) {
    console.error('Failed to load media:', error)
  }
}

const {
  uploadEditedMedia,
  addFeedback,
  markMediaApproved,
  completeProofing,
  moveApprovedToCollection,
} = useProofingWorkflow({
  proofingId: () => proofing.value?.id,
  loadMediaItems,
})

const handleFileSelect = async event => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  try {
    // For now, upload as new media (in production, link to original selection media)
    await uploadEditedMedia(files, null, 'highlights')
    event.target.value = ''
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const handleAddFeedback = async (mediaId, [type, content]) => {
  isSubmittingFeedback.value = true
  try {
    await addFeedback(mediaId, type, content)
    // Reload proofing to get updated feedback
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
  } catch (error) {
    console.error('Failed to mark approved:', error)
  }
}

const handleComplete = async () => {
  try {
    await completeProofing()
    await loadData()
  } catch (error) {
    console.error('Failed to complete proofing:', error)
  }
}

const handleMoveToCollection = async () => {
  try {
    // Pass null to let the API create a collection if needed
    const collectionId = projectCollections.value.length > 0 ? projectCollections.value[0].id : null
    await moveApprovedToCollection(collectionId)
    await loadData()
    // Reload project to get the new collection
    if (project.value) {
      const updatedProject = await projectStore.fetchProject(project.value.id)
      project.value = updatedProject
      if (updatedProject.collections) {
        projectCollections.value = updatedProject.collections
      }
    }
  } catch (error) {
    console.error('Failed to move to collection:', error)
  }
}

const getMediaFeedback = mediaId => {
  return feedback.value.filter(f => f.mediaId === mediaId)
}

const loadMediaRevisions = async () => {
  if (!proofing.value) return
  try {
    const allMedia = await mediaApi.fetchPhaseMedia('proofing', proofing.value.id)
    // Group revisions by originalMediaId
    const revisionsMap = {}
    for (const media of allMedia) {
      const originalId = media.originalMediaId || media.id
      if (!revisionsMap[originalId]) {
        revisionsMap[originalId] = []
      }
      revisionsMap[originalId].push(media)
    }
    mediaRevisions.value = revisionsMap
  } catch (error) {
    console.error('Failed to load revisions:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>
