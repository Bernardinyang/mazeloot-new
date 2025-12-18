<template>
  <SidebarModal
    v-model="isOpen"
    title="Project Details"
    :description="project?.name || 'Project information'"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <!-- Content -->
    <div v-else-if="project" class="space-y-6">
      <!-- Basic Information Section -->
      <DetailSection title="Basic Information">
        <DetailField label="ID" :value="project.id" format="mono" />
        <DetailField label="Name" :value="project.name" />
        <DetailField v-if="project.description" label="Description" :value="project.description" />
        <DetailField v-if="project.status" label="Status">
          <StatusBadge :status="project.status" />
        </DetailField>
        <DetailField
          v-if="project.parentId"
          label="Parent ID"
          :value="project.parentId"
          format="mono"
        />
      </DetailSection>

      <!-- Project Phases Section -->
      <DetailSection
        v-if="project.hasSelections || project.hasProofing || project.hasCollections"
        title="Project Phases"
        container-class="pt-4 border-t"
      >
        <div class="grid grid-cols-1 gap-3">
          <div
            v-if="project.hasSelections"
            :class="['flex items-center justify-between p-3 rounded-lg', theme.bgCardSolid]"
          >
            <div class="flex items-center gap-2">
              <CheckSquare class="h-4 w-4" :class="theme.textSecondary" />
              <span :class="['text-sm font-medium', theme.textPrimary]">Selections</span>
            </div>
            <span
              class="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400"
            >
              Enabled
            </span>
          </div>
          <div
            v-if="project.hasProofing"
            :class="['flex items-center justify-between p-3 rounded-lg', theme.bgCardSolid]"
          >
            <div class="flex items-center gap-2">
              <Eye class="h-4 w-4" :class="theme.textSecondary" />
              <span :class="['text-sm font-medium', theme.textPrimary]">Proofing</span>
            </div>
            <span
              class="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400"
            >
              Enabled
            </span>
          </div>
          <div
            v-if="project.hasCollections"
            :class="['flex items-center justify-between p-3 rounded-lg', theme.bgCardSolid]"
          >
            <div class="flex items-center gap-2">
              <FolderOpen class="h-4 w-4" :class="theme.textSecondary" />
              <span :class="['text-sm font-medium', theme.textPrimary]">Collections</span>
            </div>
            <span
              class="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400"
            >
              Enabled
            </span>
          </div>
        </div>
      </DetailSection>

      <!-- Configuration Section -->
      <DetailSection v-if="hasConfiguration" title="Configuration" container-class="pt-4 border-t">
        <DetailField
          v-if="project.presetId"
          label="Preset ID"
          :value="project.presetId"
          format="mono"
          layout="horizontal"
        />
        <DetailField
          v-if="project.watermarkId"
          label="Watermark ID"
          :value="project.watermarkId"
          format="mono"
          layout="horizontal"
        />
        <div v-if="project.mediaSets && project.mediaSets.length > 0" class="space-y-2">
          <label :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]"
            >Media Sets</label
          >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="set in project.mediaSets"
              :key="set.id || set"
              :class="[
                'px-2.5 py-1 rounded-md text-xs font-medium',
                theme.bgCardSolid,
                theme.textPrimary,
                'border',
                theme.borderSecondary,
              ]"
            >
              {{ set.name || set }}
            </span>
          </div>
        </div>
        <div v-if="project.tags && project.tags.length > 0" class="space-y-2">
          <label :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]"
            >Tags</label
          >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              :class="[
                'px-2.5 py-1 rounded-md text-xs font-medium',
                theme.bgCardSolid,
                theme.textPrimary,
                'border',
                theme.borderSecondary,
              ]"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </DetailSection>

      <!-- Timeline Section -->
      <DetailSection title="Timeline" container-class="pt-4 border-t">
        <DetailField label="Created At" :value="project.createdAt" format="date" />
        <DetailField
          v-if="project.updatedAt"
          label="Updated At"
          :value="project.updatedAt"
          format="date"
        />
        <DetailField v-if="project.date" label="Date" :value="project.date" format="date" />
      </DetailSection>

      <!-- Additional Properties Section -->
      <DetailSection
        v-if="hasAdditionalFields"
        title="Additional Properties"
        container-class="pt-4 border-t"
      >
        <div class="space-y-2">
          <div
            v-for="(value, key) in project"
            :key="key"
            v-if="!excludedKeys.includes(key) && value !== null && value !== undefined"
          >
            <DetailField :label="formatKey(key)" :value="value" layout="horizontal" />
          </div>
        </div>
      </DetailSection>

      <!-- Actions Section -->
      <div class="pt-4 border-t" :class="theme.borderSecondary">
        <ActionButtonGroup>
          <Button
            variant="default"
            class="w-full bg-teal-500 hover:bg-teal-600 text-white"
            @click="handleViewProject"
          >
            <Eye class="h-4 w-4 mr-2" />
            View Project
          </Button>
          <Button
            variant="outline"
            class="w-full"
            :class="[theme.borderSecondary, theme.textPrimary]"
            @click="handleEdit"
          >
            <Pencil class="h-4 w-4 mr-2" />
            Edit Project
          </Button>
        </ActionButtonGroup>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle class="h-12 w-12 mb-4" :class="theme.textTertiary" />
      <p :class="['text-sm font-medium', theme.textPrimary]">Project not found</p>
      <p :class="['text-xs mt-1', theme.textSecondary]">
        The project you're looking for doesn't exist or has been deleted.
      </p>
    </div>
  </SidebarModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, Eye, Pencil, AlertCircle, CheckSquare, FolderOpen } from 'lucide-vue-next'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import DetailSection from '@/components/molecules/DetailSection.vue'
import DetailField from '@/components/molecules/DetailField.vue'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProjectStore } from '@/stores/project'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  projectId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'edit'])

const theme = useThemeClasses()
const router = useRouter()
const projectStore = useProjectStore()

const project = ref(null)
const isLoading = ref(false)

const excludedKeys = [
  'id',
  'name',
  'description',
  'status',
  'parentId',
  'createdAt',
  'updatedAt',
  'date',
  'hasSelections',
  'hasProofing',
  'hasCollections',
  'mediaSets',
  'presetId',
  'watermarkId',
  'tags',
  'selections',
  'proofing',
  'collections',
]

const hasConfiguration = computed(() => {
  if (!project.value) return false
  return (
    project.value.presetId ||
    project.value.watermarkId ||
    (project.value.mediaSets && project.value.mediaSets.length > 0) ||
    (project.value.tags && project.value.tags.length > 0)
  )
})

const hasAdditionalFields = computed(() => {
  if (!project.value) return false
  return Object.keys(project.value).some(
    key =>
      !excludedKeys.includes(key) && project.value[key] !== null && project.value[key] !== undefined
  )
})

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const loadData = async () => {
  if (!props.projectId) return

  isLoading.value = true
  try {
    const projectData = await projectStore.fetchProject(props.projectId)
    project.value = projectData
  } catch (error) {
    console.error('Failed to load project:', error)
  } finally {
    isLoading.value = false
  }
}

const formatKey = key => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const handleViewProject = () => {
  if (!project.value) return
  router.push({
    name: 'projectDashboard',
    params: { id: project.value.id },
  })
  isOpen.value = false
}

const handleEdit = () => {
  emit('edit', project.value)
  isOpen.value = false
}

watch(
  () => props.projectId,
  () => {
    if (props.projectId && isOpen.value) {
      loadData()
    }
  },
  { immediate: true }
)

watch(isOpen, newVal => {
  if (newVal && props.projectId) {
    loadData()
  }
})
</script>
