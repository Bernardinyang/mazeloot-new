<template>
  <DashboardLayout>
    <template #breadcrumb>
      <div class="flex items-center gap-2">
        <router-link :to="{ name: 'projects' }" class="hover:underline">Projects</router-link>
        <span>/</span>
        <span>{{ project?.name || 'Loading...' }}</span>
      </div>
    </template>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <div v-else-if="project" class="space-y-6">
      <!-- Project Header -->
      <div class="flex items-start justify-between">
        <div>
          <h1 :class="theme.textPrimary" class="text-2xl font-bold">{{ project.name }}</h1>
          <p v-if="project.description" :class="theme.textSecondary" class="mt-1">
            {{ project.description }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" :class="[theme.textSecondary, theme.bgButtonHover]">
            Settings
          </Button>
        </div>
      </div>

      <!-- Phase Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Selections Phase -->
        <div
          v-if="project.hasSelections"
          :class="[
            theme.bgCard,
            theme.borderCard,
            'border rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow',
          ]"
          @click="navigateToPhase('selections')"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 :class="theme.textPrimary" class="text-lg font-semibold">Selections</h3>
            <div
              :class="[
                selection?.status === 'completed' ? 'bg-green-500' : 'bg-blue-500',
                'text-white text-xs px-2 py-1 rounded-full',
              ]"
            >
              {{ capitalize(selection?.status || 'draft') }}
            </div>
          </div>
          <p :class="theme.textSecondary" class="text-sm mb-4">
            Raw media upload for client selection
          </p>
          <div class="flex items-center justify-between text-sm">
            <span :class="theme.textSecondary">Media: {{ selectionMediaCount }}</span>
            <ChevronRight class="h-4 w-4" :class="theme.textSecondary" />
          </div>
        </div>

        <!-- Proofing Phase -->
        <div
          v-if="project.hasProofing"
          :class="[
            theme.bgCard,
            theme.borderCard,
            'border rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow',
          ]"
          @click="navigateToPhase('proofing')"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 :class="theme.textPrimary" class="text-lg font-semibold">Proofing</h3>
            <div
              :class="[
                proofing?.status === 'completed' ? 'bg-green-500' : 'bg-purple-500',
                'text-white text-xs px-2 py-1 rounded-full',
              ]"
            >
              {{ capitalize(proofing?.status || 'draft') }}
            </div>
          </div>
          <p :class="theme.textSecondary" class="text-sm mb-4">
            Edited media review with client feedback
          </p>
          <div class="flex items-center justify-between text-sm">
            <span :class="theme.textSecondary">
              Revisions: {{ proofing?.currentRevision || 0 }}/{{ proofing?.maxRevisions || 5 }}
            </span>
            <ChevronRight class="h-4 w-4" :class="theme.textSecondary" />
          </div>
        </div>

        <!-- Collections Phase -->
        <div
          v-if="project.hasCollections"
          :class="[
            theme.bgCard,
            theme.borderCard,
            'border rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow',
          ]"
          @click="navigateToPhase('collections')"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 :class="theme.textPrimary" class="text-lg font-semibold">Collections</h3>
            <div
              :class="[
                projectCollections.length > 0 ? 'bg-green-500' : 'bg-gray-500',
                'text-white text-xs px-2 py-1 rounded-full',
              ]"
            >
              {{ projectCollections.length }}
            </div>
          </div>
          <p :class="theme.textSecondary" class="text-sm mb-4">Final approved media for sharing</p>
          <div class="flex items-center justify-between text-sm">
            <span :class="theme.textSecondary">Collections: {{ projectCollections.length }}</span>
            <ChevronRight class="h-4 w-4" :class="theme.textSecondary" />
          </div>
        </div>
      </div>

      <!-- Project Settings Summary -->
      <div :class="[theme.bgCard, theme.borderCard, 'border rounded-xl p-6']">
        <h3 :class="theme.textPrimary" class="text-lg font-semibold mb-4">Project Settings</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p :class="theme.textSecondary" class="text-xs mb-1">Media Sets</p>
            <p :class="theme.textPrimary" class="text-sm font-medium">
              {{ project.mediaSets?.length || 0 }}
            </p>
          </div>
          <div>
            <p :class="theme.textSecondary" class="text-xs mb-1">Preset</p>
            <p :class="theme.textPrimary" class="text-sm font-medium">
              {{ project.settings?.presetId ? 'Applied' : 'None' }}
            </p>
          </div>
          <div>
            <p :class="theme.textSecondary" class="text-xs mb-1">Watermark</p>
            <p :class="theme.textPrimary" class="text-sm font-medium">
              {{ project.settings?.watermarkId ? 'Applied' : 'None' }}
            </p>
          </div>
          <div>
            <p :class="theme.textSecondary" class="text-xs mb-1">Status</p>
            <p :class="theme.textPrimary" class="text-sm font-medium">
              {{ capitalize(project.status) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p :class="theme.textSecondary">Project not found</p>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, ChevronRight } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProjectStore } from '@/stores/project'
import { useSelectionStore } from '@/stores/selection'
import { useProofingStore } from '@/stores/proofing'
import { useMediaApi } from '@/api/media'
import { capitalize } from '@/lib/utils'

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

    // Load phases
    if (projectData.selections && projectData.selections.length > 0) {
      selection.value = projectData.selections[0]
      const media = await mediaApi.fetchPhaseMedia('selection', selection.value.id)
      selectionMediaCount.value = media.length
    }

    if (projectData.proofing && projectData.proofing.length > 0) {
      proofing.value = projectData.proofing[0]
    }

    if (projectData.collections) {
      projectCollections.value = projectData.collections
    }
  } catch (error) {
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
  } else {
    router.push({
      name: `project${phase.charAt(0).toUpperCase() + phase.slice(1)}`,
      params: { id: projectId },
    })
  }
}

onMounted(() => {
  loadProject()
})
</script>
