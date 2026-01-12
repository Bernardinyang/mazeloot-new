<template>
  <SidebarModal
    v-model="isOpen"
    title="Proofing Details"
    :description="proofing?.name || 'Proofing information'"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <!-- Content -->
    <div v-else-if="proofing" class="space-y-6">
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
            'hover:text-accent',
          ]"
        >
          {{ project.name }}
        </router-link>
      </InfoCard>

      <!-- Basic Information Section -->
      <DetailSection title="Basic Information">
        <DetailField label="ID" :value="proofing.id" format="mono" />
        <DetailField label="Name" :value="proofing.name" />
        <DetailField label="Status">
          <StatusBadge :status="proofing.status || 'draft'" />
        </DetailField>
        <DetailField
          v-if="proofing.projectId"
          label="Project ID"
          :value="proofing.projectId"
          format="mono"
        />
      </DetailSection>

      <!-- Media Statistics Section -->
      <DetailSection v-if="proofing.mediaCount !== undefined" title="Media Statistics">
        <div class="grid grid-cols-3 gap-4">
          <div :class="['text-center p-3 rounded-lg', theme.bgCardSolid]">
            <div :class="['text-2xl font-bold', theme.textPrimary]">
              {{ proofing.mediaCount || 0 }}
            </div>
            <div :class="['text-xs mt-1', theme.textSecondary]">Total</div>
          </div>
          <div :class="['text-center p-3 rounded-lg', theme.bgCardSolid]">
            <div :class="['text-2xl font-bold text-green-600 dark:text-green-400']">
              {{ proofing.completedMediaCount || 0 }}
            </div>
            <div :class="['text-xs mt-1', theme.textSecondary]">Completed</div>
          </div>
          <div :class="['text-center p-3 rounded-lg', theme.bgCardSolid]">
            <div :class="['text-2xl font-bold text-yellow-600 dark:text-yellow-400']">
              {{ (proofing.mediaCount || 0) - (proofing.completedMediaCount || 0) }}
            </div>
            <div :class="['text-xs mt-1', theme.textSecondary]">Pending</div>
          </div>
        </div>
        <div v-if="proofing.feedbackCount !== undefined" class="mt-3">
          <DetailField label="Feedback Count" :value="proofing.feedbackCount" format="number" />
        </div>
      </DetailSection>

      <!-- Revision Information Section -->
      <DetailSection
        v-if="proofing.maxRevisions !== undefined || proofing.currentRevision !== undefined"
        title="Revision Settings"
      >
        <DetailField
          v-if="proofing.maxRevisions !== undefined"
          label="Max Revisions"
          :value="`${proofing.maxRevisions} per media item`"
        />
        <DetailField
          v-if="proofing.currentRevision !== undefined"
          label="Current Revision"
          :value="`Revision ${proofing.currentRevision}`"
        />
      </DetailSection>

      <!-- Timeline Section -->
      <DetailSection title="Timeline">
        <DetailField label="Created At" :value="proofing.createdAt" format="date" />
        <DetailField
          v-if="proofing.updatedAt"
          label="Updated At"
          :value="proofing.updatedAt"
          format="date"
        />
      </DetailSection>

      <!-- Additional Properties Section -->
      <DetailSection
        v-if="hasAdditionalFields"
        title="Additional Properties"
        container-class="pt-4 border-t"
      >
        <div class="space-y-2">
          <div
            v-for="(value, key) in proofing"
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
            :icon="Eye"
            class="w-full"
            @click="handleViewProofing"
          >
            View Proofing
          </Button>
          <Button
            v-if="proofing.status !== 'completed'"
            variant="outline"
            class="w-full"
            :class="[theme.borderSecondary, theme.textPrimary]"
            @click="handleComplete"
          >
            <CheckCircle2 class="h-4 w-4 mr-2" />
            Complete Proofing
          </Button>
        </ActionButtonGroup>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle class="h-12 w-12 mb-4" :class="theme.textTertiary" />
      <p :class="['text-sm font-medium', theme.textPrimary]">Proofing not found</p>
      <p :class="['text-xs mt-1', theme.textSecondary]">
        The proofing you're looking for doesn't exist or has been deleted.
      </p>
    </div>
  </SidebarModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, FolderKanban, Eye, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import SidebarModal from '@/shared/modals/SidebarModal.vue'
import DetailSection from '@/shared/components/molecules/DetailSection.vue'
import DetailField from '@/shared/components/molecules/DetailField.vue'
import StatusBadge from '@/shared/components/molecules/StatusBadge.vue'
import InfoCard from '@/shared/components/molecules/InfoCard.vue'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import { useProjectStore } from '@/domains/memora/stores/project'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  proofingId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const theme = useThemeClasses()
const router = useRouter()
const proofingStore = useProofingStore()
const projectStore = useProjectStore()

const proofing = ref(null)
const project = ref(null)
const isLoading = ref(false)

const excludedKeys = [
  'id',
  'name',
  'status',
  'projectId',
  'mediaCount',
  'completedMediaCount',
  'feedbackCount',
  'createdAt',
  'updatedAt',
  'maxRevisions',
  'currentRevision',
  'media',
  'feedback',
  'projectName',
]

const hasAdditionalFields = computed(() => {
  if (!proofing.value) return false
  return Object.keys(proofing.value).some(
    key =>
      !excludedKeys.includes(key) &&
      proofing.value[key] !== null &&
      proofing.value[key] !== undefined
  )
})

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const loadData = async () => {
  if (!props.proofingId) return

  isLoading.value = true
  try {
    const proofingData = await proofingStore.fetchProofing(props.proofingId)
    proofing.value = proofingData

    if (proofingData.projectId) {
      try {
        const projectData = await projectStore.fetchProject(proofingData.projectId)
        project.value = projectData
      } catch (err) {}
    }
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

const handleViewProofing = () => {
  if (!proofing.value) return

  if (proofing.value.projectId) {
    router.push({
      name: 'projectProofing',
      params: { id: proofing.value.projectId },
      query: { proofingId: proofing.value.id },
    })
  } else {
    router.push({
      name: 'projectProofing',
      params: { id: 'standalone' },
      query: { proofingId: proofing.value.id },
    })
  }
  isOpen.value = false
}

const handleComplete = async () => {
  if (!proofing.value) return
  // TODO: Implement complete proofing
}

watch(
  () => props.proofingId,
  () => {
    if (props.proofingId && isOpen.value) {
      loadData()
    }
  },
  { immediate: true }
)

watch(isOpen, newVal => {
  if (newVal && props.proofingId) {
    loadData()
  }
})
</script>
