<template>
  <SidebarModal
    v-model="isOpen"
    title="Project Details"
    :description="project?.name || 'Project information'"
    content-class="sm:max-w-lg"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
      <Loader2 class="h-10 w-10 animate-spin text-accent mb-4" />
      <p :class="['text-sm font-medium', theme.textSecondary]">Loading project details...</p>
    </div>

    <!-- Content -->
    <div v-else-if="project" class="space-y-0">
      <!-- Project Header Card -->
      <div class="pb-6">
        <div
          :class="[
            'group rounded-xl border p-5 transition-all',
            theme.bgCardSolid,
            theme.borderSecondary,
          ]"
          :style="{
            borderLeftWidth: '4px',
            borderLeftColor: project.color || '#3B82F6',
          }"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <div
                  class="h-4 w-4 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: project.color || '#3B82F6' }"
                ></div>
                <h3 :class="['text-lg font-semibold', theme.textPrimary]">{{ project.name }}</h3>
              </div>
              <p
                v-if="project.description"
                :class="['text-sm leading-relaxed', theme.textSecondary]"
              >
                {{ project.description }}
              </p>
            </div>
            <StatusBadge v-if="project.status" :status="project.status" />
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div :class="['h-px mb-6 bg-gray-200 dark:bg-gray-700']"></div>

      <!-- Basic Information Section -->
      <div class="pb-6 pt-2">
        <DetailSection title="Basic Information" :icon="Info">
          <div class="space-y-3.5">
            <DetailField label="Project ID" :value="project.id" format="mono" />
            <DetailField
              v-if="project.date || project.eventDate"
              label="Event Date"
              :value="project.date || project.eventDate"
              format="date"
            />
            <DetailField v-if="project.color" label="Color">
              <div class="flex items-center gap-2.5">
                <div
                  class="h-5 w-5 rounded border flex-shrink-0"
                  :style="{ backgroundColor: project.color }"
                  :class="theme.borderSecondary"
                ></div>
                <span :class="theme.textPrimary" class="text-sm font-mono">{{
                  project.color
                }}</span>
              </div>
            </DetailField>
          </div>
        </DetailSection>
      </div>

      <!-- Selections Phase Section -->
      <div
        v-if="project.hasSelections"
        class="pb-6 pt-6 border-t rounded-lg -mx-6 px-6"
        :class="[theme.borderSecondary, 'bg-accent/10 dark:bg-accent/10']"
      >
        <DetailSection title="Selections" :icon="CheckSquare">
          <div
            :class="[
              'group flex items-center justify-between p-4 rounded-lg border transition-all mb-5',
              'hover:shadow-md hover:border-accent/50 cursor-pointer',
              'bg-white dark:bg-gray-900',
              theme.borderSecondary,
            ]"
            @click="handleViewSelection"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"
              >
                <CheckSquare class="h-5 w-5 text-accent" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span :class="['text-sm font-semibold', theme.textPrimary]">View Selections</span>
                </div>
                <p :class="['text-xs mt-1', theme.textSecondary]">
                  Click to view selection details
                </p>
              </div>
            </div>
            <Eye
              class="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
              :class="theme.textSecondary"
            />
          </div>

          <div v-if="selection" class="space-y-3.5">
            <DetailField label="Status" layout="horizontal">
              <StatusBadge :status="selection.status" />
            </DetailField>

            <DetailField label="Media Items" layout="horizontal">
              <span :class="theme.textPrimary" class="text-sm font-medium">
                {{ selection?.mediaCount ?? selection?.media_count ?? 0 }}
              </span>
            </DetailField>

            <DetailField label="Media Sets" layout="horizontal">
              <span :class="theme.textPrimary" class="text-sm font-medium">
                {{ selection?.mediaSets?.length || 0 }} set{{
                  (selection?.mediaSets?.length || 0) !== 1 ? 's' : ''
                }}
              </span>
            </DetailField>

            <DetailField
              v-if="
                selection?.selectedCount !== undefined || selection?.selected_count !== undefined
              "
              label="Selected Items"
              layout="horizontal"
            >
              <span :class="theme.textPrimary" class="text-sm font-medium">
                {{ selection?.selectedCount ?? selection?.selected_count ?? 0 }}
              </span>
            </DetailField>

            <DetailField v-if="selection?.name" label="Name" layout="horizontal">
              <span :class="theme.textPrimary" class="text-sm">{{ selection.name }}</span>
            </DetailField>

            <DetailField v-if="selection?.description" label="Description" layout="horizontal">
              <span :class="theme.textSecondary" class="text-sm leading-relaxed">{{
                selection.description
              }}</span>
            </DetailField>
          </div>
        </DetailSection>
      </div>

      <!-- Proofing Phase Section -->
      <div
        v-if="project.hasProofing"
        class="pb-6 pt-6 border-t rounded-lg -mx-6 px-6"
        :class="[theme.borderSecondary, 'bg-purple-50/30 dark:bg-purple-950/10']"
      >
        <DetailSection title="Proofing" :icon="Eye">
          <router-link
            v-if="proofing"
            :to="{
              name: 'projectProofing',
              params: { id: project.id },
            }"
            :class="[
              'group flex items-center justify-between p-4 rounded-lg border transition-all mb-5',
              'hover:shadow-md hover:border-purple-500/50 cursor-pointer',
              'bg-white dark:bg-gray-900',
              theme.borderSecondary,
            ]"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0"
              >
                <Eye class="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span :class="['text-sm font-semibold', theme.textPrimary]">View Proofing</span>
                </div>
                <p :class="['text-xs mt-1', theme.textSecondary]">Click to view proofing details</p>
              </div>
            </div>
            <Eye
              class="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
              :class="theme.textSecondary"
            />
          </router-link>

          <div v-if="proofing" class="space-y-3.5">
            <DetailField label="Status" layout="horizontal">
              <StatusBadge :status="proofing.status" />
            </DetailField>

            <DetailField
              v-if="proofing?.mediaCount !== undefined"
              label="Media Items"
              layout="horizontal"
            >
              <span :class="theme.textPrimary" class="text-sm font-medium">
                {{ proofing.mediaCount || 0 }}
              </span>
            </DetailField>

            <DetailField label="Media Sets" layout="horizontal">
              <span :class="theme.textPrimary" class="text-sm font-medium">
                {{ proofingSetCount }} set{{ proofingSetCount !== 1 ? 's' : '' }}
              </span>
            </DetailField>

            <DetailField
              v-if="proofing?.maxRevisions !== undefined"
              label="Max Revisions"
              layout="horizontal"
            >
              <span :class="theme.textPrimary" class="text-sm font-medium">
                {{ proofing.maxRevisions }}
              </span>
            </DetailField>

            <DetailField
              v-if="proofing?.currentRevision !== undefined"
              label="Current Revision"
              layout="horizontal"
            >
              <span :class="theme.textPrimary" class="text-sm font-medium">
                {{ proofing.currentRevision }}
              </span>
            </DetailField>

            <DetailField v-if="proofing?.name" label="Name" layout="horizontal">
              <span :class="theme.textPrimary" class="text-sm">{{ proofing.name }}</span>
            </DetailField>
          </div>
        </DetailSection>
      </div>

      <!-- Collections Phase Section -->
      <div
        v-if="project.hasCollections"
        class="pb-6 pt-6 border-t rounded-lg -mx-6 px-6"
        :class="[theme.borderSecondary, 'bg-blue-50/30 dark:bg-blue-950/10']"
      >
        <DetailSection title="Collections" :icon="FolderOpen">
          <div class="space-y-3.5 mb-5">
            <DetailField label="Total Collections" layout="horizontal">
              <span :class="theme.textPrimary" class="text-sm font-medium">
                {{ projectCollections.length }} collection{{
                  projectCollections.length !== 1 ? 's' : ''
                }}
              </span>
            </DetailField>
          </div>

          <div v-if="projectCollections.length > 0" class="space-y-2">
            <label
              :class="[
                'text-xs font-medium uppercase tracking-wider mb-3 block',
                theme.textTertiary,
              ]"
            >
              Collections
            </label>
            <div class="space-y-2.5">
              <div
                v-for="collection in projectCollections"
                :key="collection.id"
                :class="[
                  'p-3.5 rounded-lg border transition-all hover:shadow-sm',
                  'bg-white dark:bg-gray-900',
                  theme.borderSecondary,
                ]"
              >
                <div class="flex items-center justify-between gap-2">
                  <span :class="['text-sm font-medium', theme.textPrimary]">
                    {{ collection.name }}
                  </span>
                  <StatusBadge v-if="collection.status" :status="collection.status" size="sm" />
                </div>
                <p
                  v-if="collection.description"
                  :class="['text-xs mt-2 leading-relaxed', theme.textSecondary]"
                >
                  {{ collection.description }}
                </p>
              </div>
            </div>
          </div>
        </DetailSection>
      </div>

      <!-- Configuration Section -->
      <div v-if="hasConfiguration" class="pb-6 pt-6 border-t" :class="theme.borderSecondary">
        <DetailSection title="Configuration" :icon="Settings">
          <div class="space-y-3.5">
            <DetailField v-if="project.preset" label="Preset" layout="horizontal">
              <div class="flex items-center gap-2">
                <span :class="theme.textPrimary" class="text-sm font-medium">{{
                  project.preset.name
                }}</span>
              </div>
            </DetailField>
            <DetailField
              v-else-if="project.presetId"
              label="Preset"
              :value="project.presetId"
              format="mono"
              layout="horizontal"
            />
            <DetailField v-if="project.watermark" label="Watermark" layout="horizontal">
              <div class="flex items-center gap-2">
                <span :class="theme.textPrimary" class="text-sm font-medium">{{
                  project.watermark.name
                }}</span>
              </div>
            </DetailField>
            <DetailField
              v-else-if="project.watermarkId"
              label="Watermark"
              :value="project.watermarkId"
              format="mono"
              layout="horizontal"
            />
          </div>
        </DetailSection>
      </div>

      <!-- Timeline Section -->
      <div class="pb-6 pt-6 border-t" :class="theme.borderSecondary">
        <DetailSection title="Timeline" :icon="Clock">
          <div class="space-y-3.5">
            <DetailField
              label="Created"
              :value="project.createdAt"
              format="date"
              layout="horizontal"
            />
            <DetailField
              v-if="project.updatedAt"
              label="Last Updated"
              :value="project.updatedAt"
              format="date"
              layout="horizontal"
            />
          </div>
        </DetailSection>
      </div>

      <!-- Actions Section -->
      <div class="pt-6 border-t" :class="theme.borderSecondary">
        <div class="flex flex-col gap-2.5">
          <Button
            variant="default"
            :icon="Eye"
            class="w-full shadow-sm hover:shadow-md transition-all"
            @click="handleViewProject"
          >
            View Project
          </Button>
          <Button
            variant="outline"
            class="w-full"
            :class="[
              theme.borderSecondary,
              theme.textPrimary,
              'hover:bg-gray-50 dark:hover:bg-gray-800',
            ]"
            @click="handleEdit"
          >
            <Pencil class="h-4 w-4 mr-2" />
            Edit Project
          </Button>
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
    </div>
  </SidebarModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Loader2,
  Eye,
  Pencil,
  AlertCircle,
  CheckSquare,
  FolderOpen,
  Info,
  Clock,
  Settings,
} from 'lucide-vue-next'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import DetailSection from '@/components/molecules/DetailSection.vue'
import DetailField from '@/components/molecules/DetailField.vue'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
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

// Extract phase data from project
const selection = computed(() => {
  return project.value?.selection || null
})

const proofing = computed(() => {
  return project.value?.proofing || null
})

const proofingSetCount = computed(() => {
  if (!proofing.value) return 0
  return (
    proofing.value.setCount ||
    proofing.value.setsCount ||
    proofing.value.mediaSetsCount ||
    proofing.value.mediaSetCount ||
    (Array.isArray(proofing.value.mediaSets) ? proofing.value.mediaSets.length : 0) ||
    (Array.isArray(proofing.value.sets) ? proofing.value.sets.length : 0) ||
    0
  )
})

const projectCollections = computed(() => {
  if (!project.value?.collection) return []
  return [project.value.collection]
})

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
  'selections',
  'proofing',
  'collections',
]

const hasConfiguration = computed(() => {
  if (!project.value) return false
  return project.value.presetId || project.value.watermarkId
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

const handleViewSelection = () => {
  if (!project.value) return

  // If selection exists, route to selection detail
  if (selection.value?.id) {
    router.push({
      name: 'selectionDetail',
      params: { id: selection.value.id },
    })
  } else {
    // If no selection exists yet, route to project selections page
    router.push({
      name: 'projectSelections',
      params: { id: project.value.id },
    })
  }

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
