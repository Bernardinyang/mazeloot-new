<template>
  <SidebarModal
    v-model="isOpen"
    title="Selection Details"
    :description="selection?.name || 'Selection information'"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <!-- Content -->
    <div v-else-if="selection" class="space-y-6">
      <!-- Project Information Card -->
      <InfoCard
        v-if="project"
        title="Project"
        :description="project.description"
        :icon="FolderKanban"
      >
        <router-link
          :to="{ name: 'projectDashboard', params: { id: project.id } }"
          :class="[
            'text-sm font-semibold hover:underline transition-colors',
            theme.textPrimary,
            'hover:text-teal-500 dark:hover:text-teal-400',
          ]"
        >
          {{ project.name }}
        </router-link>
      </InfoCard>

      <!-- Basic Information Section -->
      <DetailSection title="Basic Information">
        <DetailField label="ID" :value="selection.id" format="mono" />
        <DetailField label="Name" :value="selection.name" />
        <DetailField label="Status">
          <StatusBadge :status="selection.status || 'draft'" />
        </DetailField>
        <DetailField
          v-if="selection.projectId"
          label="Project ID"
          :value="selection.projectId"
          format="mono"
        />
      </DetailSection>

      <!-- Media Statistics Section -->
      <DetailSection v-if="selection.mediaCount !== undefined" title="Media Statistics">
        <div class="grid grid-cols-3 gap-4">
          <div :class="['text-center p-3 rounded-lg', theme.bgCardSolid]">
            <div :class="['text-2xl font-bold', theme.textPrimary]">
              {{ selection.mediaCount || 0 }}
            </div>
            <div :class="['text-xs mt-1', theme.textSecondary]">Total</div>
          </div>
          <div :class="['text-center p-3 rounded-lg', theme.bgCardSolid]">
            <div :class="['text-2xl font-bold text-green-600 dark:text-green-400']">
              {{ selection.selectedMediaCount || 0 }}
            </div>
            <div :class="['text-xs mt-1', theme.textSecondary]">Selected</div>
          </div>
          <div :class="['text-center p-3 rounded-lg', theme.bgCardSolid]">
            <div :class="['text-2xl font-bold', theme.textPrimary]">
              {{ (selection.mediaCount || 0) - (selection.selectedMediaCount || 0) }}
            </div>
            <div :class="['text-xs mt-1', theme.textSecondary]">Unselected</div>
          </div>
        </div>
      </DetailSection>

      <!-- Sets Section -->
      <DetailSection v-if="hasSets" title="Sets" container-class="pt-4 border-t">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="set in selection.mediaSets"
            :key="set.id || set"
            :class="[
              'px-2.5 py-1 rounded-md text-xs font-medium',
              theme.bgCardSolid,
              theme.textPrimary,
              'border',
              theme.borderSecondary,
            ]"
          >
            {{ typeof set === 'string' ? set : set.name }}
          </span>
        </div>
      </DetailSection>

      <!-- Timeline Section -->
      <DetailSection title="Timeline" container-class="pt-4 border-t">
        <DetailField label="Created At" :value="selection.createdAt" format="date" />
        <DetailField
          v-if="selection.updatedAt"
          label="Updated At"
          :value="selection.updatedAt"
          format="date"
        />
        <DetailField
          v-if="selection.selectionCompletedAt"
          label="Completed At"
          :value="selection.selectionCompletedAt"
          format="date"
        />
        <DetailField v-if="selection.autoDeleteDate" label="Auto-Delete Date" format="date">
          <div class="flex items-center gap-2">
            <span :class="theme.textPrimary">{{ formatDate(selection.autoDeleteDate) }}</span>
            <span
              :class="[
                'text-xs px-2 py-0.5 rounded',
                getDaysUntil(selection.autoDeleteDate) > 7
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : getDaysUntil(selection.autoDeleteDate) > 0
                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400',
              ]"
            >
              {{ getDaysUntil(selection.autoDeleteDate) }} days remaining
            </span>
          </div>
        </DetailField>
      </DetailSection>

      <!-- Additional Properties Section -->
      <DetailSection
        v-if="hasAdditionalFields"
        title="Additional Properties"
        container-class="pt-4 border-t"
      >
        <div class="space-y-2">
          <div
            v-for="(value, key) in selection"
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
            @click="handleViewSelection"
          >
            <Eye class="h-4 w-4 mr-2" />
            View Selection
          </Button>
          <Button
            v-if="selection.status !== 'completed'"
            variant="outline"
            class="w-full"
            :class="[theme.borderSecondary, theme.textPrimary]"
            @click="handleComplete"
          >
            <CheckCircle2 class="h-4 w-4 mr-2" />
            Complete Selection
          </Button>
        </ActionButtonGroup>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle class="h-12 w-12 mb-4" :class="theme.textTertiary" />
      <p :class="['text-sm font-medium', theme.textPrimary]">Selection not found</p>
      <p :class="['text-xs mt-1', theme.textSecondary]">
        The selection you're looking for doesn't exist or has been deleted.
      </p>
    </div>
  </SidebarModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, FolderKanban, Eye, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import DetailSection from '@/components/molecules/DetailSection.vue'
import DetailField from '@/components/molecules/DetailField.vue'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
import InfoCard from '@/components/molecules/InfoCard.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSelectionStore } from '@/stores/selection'
import { useProjectStore } from '@/stores/project'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  selectionId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const theme = useThemeClasses()
const router = useRouter()
const selectionStore = useSelectionStore()
const projectStore = useProjectStore()

const selection = ref(null)
const project = ref(null)
const isLoading = ref(false)

const excludedKeys = [
  'id',
  'name',
  'status',
  'projectId',
  'mediaCount',
  'selectedMediaCount',
  'createdAt',
  'updatedAt',
  'selectionCompletedAt',
  'autoDeleteDate',
  'media',
  'projectName',
  'mediaSets',
]

const hasSets = computed(() => {
  if (!selection.value) return false
  return (
    selection.value.mediaSets &&
    Array.isArray(selection.value.mediaSets) &&
    selection.value.mediaSets.length > 0
  )
})

const hasAdditionalFields = computed(() => {
  if (!selection.value) return false
  return Object.keys(selection.value).some(
    key =>
      !excludedKeys.includes(key) &&
      selection.value[key] !== null &&
      selection.value[key] !== undefined
  )
})

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const loadData = async () => {
  if (!props.selectionId) return

  isLoading.value = true
  try {
    const selectionData = await selectionStore.fetchSelection(props.selectionId)
    selection.value = selectionData

    if (selectionData.projectId) {
      try {
        const projectData = await projectStore.fetchProject(selectionData.projectId)
        project.value = projectData
      } catch (err) {
        console.warn('Failed to load project:', err)
      }
    }
  } catch (error) {
    console.error('Failed to load selection:', error)
  } finally {
    isLoading.value = false
  }
}

const formatDate = dateStr => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getDaysUntil = dateStr => {
  if (!dateStr) return 0
  const date = new Date(dateStr)
  const now = new Date()
  const diff = date - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const formatKey = key => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const handleViewSelection = () => {
  if (!selection.value) return

  if (selection.value.projectId) {
    router.push({
      name: 'projectSelections',
      params: { id: selection.value.projectId },
      query: { selectionId: selection.value.id },
    })
  } else {
    router.push({
      name: 'projectSelections',
      params: { id: 'standalone' },
      query: { selectionId: selection.value.id },
    })
  }
  isOpen.value = false
}

const handleComplete = async () => {
  if (!selection.value) return
  // TODO: Implement complete selection
  console.log('Complete selection:', selection.value.id)
}

watch(
  () => props.selectionId,
  () => {
    if (props.selectionId && isOpen.value) {
      loadData()
    }
  },
  { immediate: true }
)

watch(isOpen, newVal => {
  if (newVal && props.selectionId) {
    loadData()
  }
})
</script>
