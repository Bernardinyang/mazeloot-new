<template>
  <DashboardLayout>
    <template #breadcrumb>
      <div class="flex items-center gap-2">
        <router-link :to="{ name: 'projects' }" class="hover:underline">Projects</router-link>
        <span>/</span>
        <span>{{ project?.name || 'Loading...' }}</span>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
      <Loader2 class="h-10 w-10 animate-spin text-teal-500 mb-4" />
      <p :class="['text-sm font-medium', theme.textSecondary]">Loading project details...</p>
    </div>

    <div v-else-if="project" class="space-y-6">
      <!-- Project Header Card -->
      <div
        :class="[
          'rounded-xl border p-6 transition-all',
          theme.bgCardSolid,
          theme.borderSecondary,
          'shadow-sm',
        ]"
        :style="{
          borderLeftWidth: '4px',
          borderLeftColor: project.color || '#3B82F6',
        }"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <div
                class="h-5 w-5 rounded-full flex-shrink-0"
                :style="{ backgroundColor: project.color || '#3B82F6' }"
              ></div>
              <h1 :class="theme.textPrimary" class="text-2xl font-bold">{{ project.name }}</h1>
              <StatusBadge v-if="project.status" :status="project.status" />
            </div>
            <p v-if="project.description" :class="['text-sm leading-relaxed', theme.textSecondary]">
              {{ project.description }}
            </p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              :class="[
                theme.borderSecondary,
                theme.textPrimary,
                'hover:bg-gray-50 dark:hover:bg-gray-800',
              ]"
              @click="handleEdit"
            >
              <Pencil class="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <!-- Phase Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Selections Phase -->
        <div
          v-if="project.hasSelections"
          :class="[
            'group border rounded-xl p-6 cursor-pointer transition-all',
            'hover:shadow-lg hover:border-teal-500/50',
            'bg-teal-50/30 dark:bg-teal-950/10',
            theme.borderSecondary,
          ]"
          @click="navigateToPhase('selections')"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0"
              >
                <CheckSquare class="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 :class="theme.textPrimary" class="text-lg font-semibold">Selections</h3>
            </div>
            <StatusBadge :status="selection?.status || 'draft'" />
          </div>
          <p :class="['text-sm mb-4', theme.textSecondary]">
            Raw media upload for client selection
          </p>
          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between text-sm">
              <span :class="theme.textSecondary">Media Items</span>
              <span :class="['font-semibold', theme.textPrimary]">
                {{ selection?.mediaCount ?? selection?.media_count ?? selectionMediaCount ?? 0 }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span :class="theme.textSecondary">Media Sets</span>
              <span :class="['font-semibold', theme.textPrimary]">
                {{ selection?.mediaSets?.length ?? 0 }}
              </span>
            </div>
            <div
              v-if="
                selection?.selectedCount !== undefined || selection?.selected_count !== undefined
              "
              class="flex items-center justify-between text-sm"
            >
              <span :class="theme.textSecondary">Selected</span>
              <span :class="['font-semibold', theme.textPrimary]">
                {{ selection?.selectedCount ?? selection?.selected_count ?? 0 }}
              </span>
            </div>
          </div>
          <div
            class="flex items-center justify-between pt-3 border-t"
            :class="theme.borderSecondary"
          >
            <span :class="['text-xs', theme.textTertiary]">Click to view details</span>
            <ChevronRight
              class="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
              :class="theme.textSecondary"
            />
          </div>
        </div>

        <!-- Proofing Phase -->
        <div
          v-if="project.hasProofing"
          :class="[
            'group border rounded-xl p-6 cursor-pointer transition-all',
            'hover:shadow-lg hover:border-purple-500/50',
            'bg-purple-50/30 dark:bg-purple-950/10',
            theme.borderSecondary,
          ]"
          @click="navigateToPhase('proofing')"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0"
              >
                <Eye class="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 :class="theme.textPrimary" class="text-lg font-semibold">Proofing</h3>
            </div>
            <StatusBadge :status="proofing?.status || 'draft'" />
          </div>
          <p :class="['text-sm mb-4', theme.textSecondary]">
            Edited media review with client feedback
          </p>
          <div class="space-y-2 mb-4">
            <div
              v-if="proofing?.maxRevisions !== undefined"
              class="flex items-center justify-between text-sm"
            >
              <span :class="theme.textSecondary">Revisions</span>
              <span :class="['font-semibold', theme.textPrimary]">
                {{ proofing?.currentRevision ?? 0 }}/{{ proofing.maxRevisions }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span :class="theme.textSecondary">Media Items</span>
              <span :class="['font-semibold', theme.textPrimary]">
                {{ proofing?.mediaCount ?? 0 }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span :class="theme.textSecondary">Media Sets</span>
              <span :class="['font-semibold', theme.textPrimary]">
                {{
                  proofing?.setCount ||
                  proofing?.setsCount ||
                  proofing?.mediaSetsCount ||
                  proofing?.mediaSetCount ||
                  (Array.isArray(proofing?.mediaSets) ? proofing.mediaSets.length : 0) ||
                  (Array.isArray(proofing?.sets) ? proofing.sets.length : 0) ||
                  0
                }}
              </span>
            </div>
          </div>
          <div
            class="flex items-center justify-between pt-3 border-t"
            :class="theme.borderSecondary"
          >
            <span :class="['text-xs', theme.textTertiary]">Click to view details</span>
            <ChevronRight
              class="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
              :class="theme.textSecondary"
            />
          </div>
        </div>

        <!-- Collections Phase -->
        <div
          v-if="project.hasCollections"
          :class="[
            'group border rounded-xl p-6 cursor-pointer transition-all',
            'hover:shadow-lg hover:border-blue-500/50',
            'bg-blue-50/30 dark:bg-blue-950/10',
            theme.borderSecondary,
          ]"
          @click="navigateToPhase('collections')"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0"
              >
                <FolderOpen class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 :class="theme.textPrimary" class="text-lg font-semibold">Collections</h3>
            </div>
            <div
              :class="[
                projectCollections.length > 0 ? 'bg-blue-500' : 'bg-gray-500',
                'text-white text-xs px-2.5 py-1 rounded-full font-semibold',
              ]"
            >
              {{ projectCollections.length }}
            </div>
          </div>
          <p :class="['text-sm mb-4', theme.textSecondary]">Final approved media for sharing</p>
          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between text-sm">
              <span :class="theme.textSecondary">Total Collections</span>
              <span :class="['font-semibold', theme.textPrimary]">
                {{ projectCollections.length }}
              </span>
            </div>
          </div>
          <div
            class="flex items-center justify-between pt-3 border-t"
            :class="theme.borderSecondary"
          >
            <span :class="['text-xs', theme.textTertiary]">Click to view details</span>
            <ChevronRight
              class="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
              :class="theme.textSecondary"
            />
          </div>
        </div>
      </div>

      <!-- Project Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Configuration Section -->
        <div
          v-if="hasConfiguration"
          :class="[theme.bgCardSolid, theme.borderSecondary, 'border rounded-xl p-6 shadow-sm']"
        >
          <div class="flex items-center gap-2.5 mb-4">
            <Settings class="h-4 w-4 text-teal-500 dark:text-teal-400" />
            <h3 :class="['text-sm font-semibold uppercase tracking-wide', theme.textPrimary]">
              Configuration
            </h3>
          </div>
          <div class="space-y-3.5">
            <div class="flex items-center justify-between">
              <span :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">
                Preset
              </span>
              <span :class="['text-sm font-medium', theme.textPrimary]">
                {{ project.preset?.name || project.presetId || 'None' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">
                Watermark
              </span>
              <span :class="['text-sm font-medium', theme.textPrimary]">
                {{ project.watermark?.name || project.watermarkId || 'None' }}
              </span>
            </div>
            <div v-if="project.color" class="flex items-center justify-between">
              <span :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">
                Color
              </span>
              <div class="flex items-center gap-2">
                <div
                  class="h-4 w-4 rounded border flex-shrink-0"
                  :style="{ backgroundColor: project.color }"
                  :class="theme.borderSecondary"
                ></div>
                <span :class="['text-sm font-mono', theme.textPrimary]">{{ project.color }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Section -->
        <div :class="[theme.bgCardSolid, theme.borderSecondary, 'border rounded-xl p-6 shadow-sm']">
          <div class="flex items-center gap-2.5 mb-4">
            <Clock class="h-4 w-4 text-teal-500 dark:text-teal-400" />
            <h3 :class="['text-sm font-semibold uppercase tracking-wide', theme.textPrimary]">
              Timeline
            </h3>
          </div>
          <div class="space-y-3.5">
            <div class="flex items-center justify-between">
              <span :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">
                Created
              </span>
              <span :class="['text-sm', theme.textPrimary]">
                {{ formatDate(project.createdAt) }}
              </span>
            </div>
            <div v-if="project.updatedAt" class="flex items-center justify-between">
              <span :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">
                Last Updated
              </span>
              <span :class="['text-sm', theme.textPrimary]">
                {{ formatDate(project.updatedAt) }}
              </span>
            </div>
            <div v-if="project.eventDate || project.date" class="flex items-center justify-between">
              <span :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">
                Event Date
              </span>
              <span :class="['text-sm', theme.textPrimary]">
                {{ formatDate(project.eventDate || project.date) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <div
        :class="[
          'h-16 w-16 rounded-full flex items-center justify-center mb-4',
          'bg-red-500/10 dark:bg-red-500/20',
        ]"
      >
        <AlertCircle class="h-8 w-8 text-red-500 dark:text-red-400" />
      </div>
      <p :class="['text-base font-semibold mb-1', theme.textPrimary]">Project not found</p>
      <p :class="['text-sm', theme.textSecondary]">
        The project you're looking for doesn't exist or has been deleted.
      </p>
      <Button
        variant="outline"
        class="mt-4"
        :class="[theme.borderSecondary, theme.textPrimary]"
        @click="router.push({ name: 'projects' })"
      >
        Back to Projects
      </Button>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Loader2,
  ChevronRight,
  CheckSquare,
  Eye,
  FolderOpen,
  Settings,
  Clock,
  Pencil,
  AlertCircle,
} from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProjectStore } from '@/stores/project'
import { useSelectionStore } from '@/stores/selection'
import { useProofingStore } from '@/stores/proofing'
import { useMediaApi } from '@/api/media'
import { capitalize } from '@/lib/utils'
import { toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()

const projectStore = useProjectStore()
const selectionStore = useSelectionStore()
const proofingStore = useProofingStore()
const mediaApi = useMediaApi()

const project = ref(null)
const selection = ref(null)
const proofing = ref(null)
const projectCollections = ref([])
const selectionMediaCount = ref(0)
const isLoading = ref(true)

const loadProject = async () => {
  isLoading.value = true
  try {
    const projectId = route.params.id
    const projectData = await projectStore.fetchProject(projectId)
    project.value = projectData

    // Load phases from project data (already included in backend response)
    if (projectData.selection) {
      selection.value = projectData.selection
      // Use mediaCount from selection if available, otherwise fetch it
      if (selection.value.mediaCount !== undefined) {
        selectionMediaCount.value = selection.value.mediaCount
      } else {
        try {
          const media = await mediaApi.fetchPhaseMedia('selection', selection.value.id)
          selectionMediaCount.value = media.length
        } catch (error) {
          // If media fetch fails, default to 0
          selectionMediaCount.value = 0
        }
      }
    }

    if (projectData.proofing) {
      proofing.value = projectData.proofing
    }

    if (projectData.collection) {
      projectCollections.value = [projectData.collection]
    }
  } catch (error) {
    // Check if it's a 404 error (project not found)
    const isNotFound =
      error?.status === 404 ||
      error?.response?.status === 404 ||
      error?.message?.toLowerCase().includes('not found') ||
      error?.message?.toLowerCase().includes('no query results')

    if (isNotFound) {
      toast.error('Project not found', {
        description: 'The project you are looking for does not exist or has been deleted.',
      })
      // Redirect to projects list
      router.push({ name: 'projects' })
    } else {
      toast.error('Failed to load project', {
        description: error?.message || 'An unexpected error occurred while loading the project.',
      })
    }
  } finally {
    isLoading.value = false
  }
}

const navigateToPhase = phase => {
  const projectId = route.params.id
  if (phase === 'collections') {
    router.push({
      name: 'projectCollections',
      params: { id: projectId },
    })
  } else if (phase === 'selections' && selection.value?.id) {
    router.push({
      name: 'selectionDetail',
      params: { id: selection.value.id },
    })
  } else if (phase === 'proofing' && proofing.value?.id) {
    router.push({
      name: 'proofingDetail',
      params: { id: proofing.value.id },
    })
  } else {
    router.push({
      name: `project${phase.charAt(0).toUpperCase() + phase.slice(1)}`,
      params: { id: projectId },
    })
  }
}

const hasConfiguration = computed(() => {
  if (!project.value) return false
  return (
    project.value.presetId ||
    project.value.watermarkId ||
    project.value.preset ||
    project.value.watermark ||
    project.value.color
  )
})

const formatDate = dateString => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

const handleEdit = () => {
  // Emit edit event or navigate to edit page
  // For now, we'll just show a toast
  toast.info('Edit functionality coming soon')
}

onMounted(() => {
  loadProject()
})
</script>
