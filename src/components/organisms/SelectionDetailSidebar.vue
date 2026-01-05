<template>
  <SidebarModal
    v-model="isOpen"
    title="Selection Details"
    :description="selection?.name || 'Selection information'"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
      <Loader2 class="h-10 w-10 animate-spin text-teal-500 mb-4" />
      <p :class="['text-sm font-medium', theme.textSecondary]">Loading selection details...</p>
    </div>

    <!-- Content -->
    <div v-else-if="selection" class="space-y-0">
      <!-- Project Information Card -->
      <div v-if="project" class="pb-6">
        <div
          :class="[
            'group rounded-xl border p-4 transition-all hover:shadow-md hover:border-teal-500/50',
            theme.bgCardSolid,
            theme.borderSecondary,
          ]"
        >
          <div class="flex items-center gap-2 mb-3">
            <FolderKanban class="h-4 w-4 text-teal-500" />
            <h3 :class="['text-sm font-semibold', theme.textPrimary]">Project</h3>
          </div>
          <router-link
            :to="{ name: 'projectDashboard', params: { id: project.id } }"
            :class="[
              'text-sm font-semibold hover:underline transition-colors inline-flex items-center gap-1.5 group/link',
              theme.textPrimary,
              'hover:text-teal-500 dark:hover:text-teal-400',
            ]"
          >
            {{ project.name }}
            <Eye class="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </router-link>
          <p v-if="project.description" :class="['text-xs mt-2', theme.textSecondary]">
            {{ project.description }}
          </p>
        </div>
      </div>

      <!-- Divider after Project -->
      <div v-if="project" :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"></div>

      <!-- Basic Information Section -->
      <div class="pt-2 pb-6">
        <DetailSection title="Basic Information" :icon="Info">
          <div class="space-y-3.5">
            <DetailField label="ID" :value="selection.id" format="mono" />
            <DetailField label="Name" :value="selection.name" />
            <DetailField label="Status">
              <StatusBadge :status="selection.status || 'draft'" />
            </DetailField>
            <DetailField v-if="selection.hasPassword" label="Password Protected">
              <div class="flex items-center gap-2">
                <Shield class="h-4 w-4 text-teal-500" />
                <span :class="['text-sm', theme.textPrimary]">Yes</span>
              </div>
            </DetailField>
            <DetailField
              v-if="selection.projectId"
              label="Project ID"
              :value="selection.projectId"
              format="mono"
            />
          </div>
        </DetailSection>
      </div>

      <!-- Divider after Basic Information -->
      <div :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"></div>

      <!-- Media Statistics Section -->
      <div v-if="selection.mediaCount !== undefined" class="pt-2 pb-6">
        <DetailSection title="Media Statistics" :icon="BarChart3">
          <div class="grid grid-cols-3 gap-3">
            <!-- Total Media Card -->
            <div
              :class="[
                'text-center p-4 rounded-xl border transition-all hover:shadow-lg hover:scale-[1.02]',
                'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
                theme.borderSecondary,
              ]"
            >
              <div class="flex items-center justify-center mb-1.5">
                <ImageIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div :class="['text-2xl font-bold mb-1', 'text-blue-600 dark:text-blue-400']">
                {{ selection.mediaCount || 0 }}
              </div>
              <div
                :class="[
                  'text-[10px] font-medium uppercase tracking-wide',
                  'text-blue-600/70 dark:text-blue-400/70',
                ]"
              >
                Total
              </div>
            </div>

            <!-- Selected Media Card -->
            <div
              :class="[
                'text-center p-4 rounded-xl border transition-all hover:shadow-lg hover:scale-[1.02]',
                'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20',
                theme.borderSecondary,
              ]"
            >
              <div class="flex items-center justify-center mb-1.5">
                <CheckSquare class="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div :class="['text-2xl font-bold mb-1', 'text-green-600 dark:text-green-400']">
                {{ selection.selectedMediaCount || 0 }}
              </div>
              <div
                :class="[
                  'text-[10px] font-medium uppercase tracking-wide',
                  'text-green-600/70 dark:text-green-400/70',
                ]"
              >
                Selected
              </div>
            </div>

            <!-- Unselected Media Card -->
            <div
              :class="[
                'text-center p-4 rounded-xl border transition-all hover:shadow-lg hover:scale-[1.02]',
                'bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/30',
                theme.borderSecondary,
              ]"
            >
              <div class="flex items-center justify-center mb-1.5">
                <XSquare class="h-4 w-4" :class="theme.textSecondary" />
              </div>
              <div :class="['text-2xl font-bold mb-1', theme.textPrimary]">
                {{ (selection.mediaCount || 0) - (selection.selectedMediaCount || 0) }}
              </div>
              <div
                :class="['text-[10px] font-medium uppercase tracking-wide', theme.textSecondary]"
              >
                Unselected
              </div>
            </div>
          </div>
        </DetailSection>
      </div>

      <!-- Divider after Media Statistics -->
      <div
        v-if="selection.mediaCount !== undefined"
        :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"
      ></div>

      <!-- Sets Section -->
      <div v-if="hasSets" class="pt-2 pb-6">
        <DetailSection title="Media Sets" :icon="Folder">
          <div class="flex flex-wrap gap-2.5">
            <div
              v-for="set in selection.mediaSets"
              :key="set.id || set"
              :class="[
                'group px-3.5 py-2 rounded-lg border transition-all hover:shadow-md hover:border-teal-500/50 cursor-pointer',
                theme.bgCardSolid,
                theme.borderSecondary,
              ]"
            >
              <div class="flex items-center gap-2">
                <Folder class="h-3.5 w-3.5" :class="theme.textSecondary" />
                <span :class="['text-sm font-medium', theme.textPrimary]">
                  {{ typeof set === 'string' ? set : set.name }}
                </span>
                <span
                  v-if="set.count !== undefined"
                  :class="[
                    'text-xs px-1.5 py-0.5 rounded-full',
                    'bg-teal-500/10 text-teal-600 dark:text-teal-400',
                  ]"
                >
                  {{ set.count }}
                </span>
              </div>
            </div>
          </div>
        </DetailSection>
      </div>

      <!-- Divider after Sets -->
      <div v-if="hasSets" :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"></div>

      <!-- Timeline Section -->
      <div class="pt-2 pb-6">
        <DetailSection title="Timeline" :icon="Clock">
          <div class="space-y-3.5">
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
              <div class="flex items-center gap-2 flex-wrap">
                <span :class="['text-sm', theme.textPrimary]">{{
                  formatDate(selection.autoDeleteDate)
                }}</span>
                <span
                  :class="[
                    'text-xs px-2.5 py-1 rounded-full font-medium',
                    getDaysUntil(selection.autoDeleteDate) > 7
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                      : getDaysUntil(selection.autoDeleteDate) > 0
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
                  ]"
                >
                  {{ getDaysUntil(selection.autoDeleteDate) }} days remaining
                </span>
              </div>
            </DetailField>
          </div>
        </DetailSection>
      </div>

      <!-- Divider after Timeline -->
      <div
        v-if="hasAdditionalFields"
        :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"
      ></div>

      <!-- Additional Properties Section -->
      <div v-if="hasAdditionalFields" class="pt-2 pb-6">
        <DetailSection title="Additional Properties" :icon="FileText">
          <div class="space-y-3.5">
            <!-- Cover Photo -->
            <DetailField v-if="selection.coverPhotoUrl" label="Cover Photo">
              <div class="flex items-center gap-2">
                <img
                  :src="selection.coverPhotoUrl"
                  alt="Cover photo"
                  class="h-10 w-10 rounded object-cover border"
                  :class="theme.borderSecondary"
                  @error="handleImageError"
                />
                <a
                  :href="selection.coverPhotoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="[
                    'text-sm text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 hover:underline',
                  ]"
                >
                  View Image
                </a>
              </div>
            </DetailField>

            <!-- Completed By Email -->
            <DetailField v-if="selection.completedByEmail" label="Completed By">
              <span :class="['text-sm', theme.textPrimary]">{{ selection.completedByEmail }}</span>
            </DetailField>

            <!-- Starred Status -->
            <DetailField v-if="selection.isStarred !== undefined" label="Starred">
              <div class="flex items-center gap-2">
                <Star
                  :class="[
                    'h-4 w-4',
                    selection.isStarred ? 'fill-yellow-400 text-yellow-400' : theme.textSecondary,
                  ]"
                />
                <span :class="['text-sm', theme.textPrimary]">
                  {{ selection.isStarred ? 'Yes' : 'No' }}
                </span>
              </div>
            </DetailField>

            <!-- Other fields that might exist -->
            <div
              v-for="(value, key) in selection"
              :key="key"
              v-if="
                !excludedKeys.includes(key) &&
                value !== null &&
                value !== undefined &&
                ![
                  'color',
                  'coverPhotoUrl',
                  'cover_photo_url',
                  'completedByEmail',
                  'completed_by_email',
                  'isStarred',
                  'starred',
                ].includes(key)
              "
            >
              <DetailField :label="formatKey(key)" :value="value" layout="horizontal" />
            </div>
          </div>
        </DetailSection>
      </div>

      <!-- Divider before Actions -->
      <div :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"></div>

      <!-- Actions Section -->
      <div class="pt-2 pb-2">
        <ActionButtonGroup>
          <Button
            variant="default"
            class="w-full bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all"
            @click="handleViewSelection"
          >
            <Eye class="h-4 w-4 mr-2" />
            View Selection
          </Button>
        </ActionButtonGroup>
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
      <p :class="['text-base font-semibold mb-1', theme.textPrimary]">Selection not found</p>
      <p :class="['text-sm', theme.textSecondary]">
        The selection you're looking for doesn't exist or has been deleted.
      </p>
    </div>
  </SidebarModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Loader2,
  FolderKanban,
  Eye,
  AlertCircle,
  Info,
  BarChart3,
  Folder,
  Clock,
  FileText,
  Shield,
  Image as ImageIcon,
  CheckSquare,
  XSquare,
  Star,
} from 'lucide-vue-next'
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
  'project_uuid',
  'mediaCount',
  'selectedMediaCount',
  'selectedCount',
  'createdAt',
  'created_at',
  'updatedAt',
  'updated_at',
  'selectionCompletedAt',
  'selection_completed_at',
  'autoDeleteDate',
  'auto_delete_date',
  'hasPassword',
  'media',
  'projectName',
  'mediaSets',
  'isStarred',
  'starred',
  'uuid',
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

  const hasCoverPhoto = selection.value.coverPhotoUrl || selection.value.cover_photo_url
  const hasCompletedBy = selection.value.completedByEmail || selection.value.completed_by_email
  const hasStarred =
    selection.value.isStarred !== undefined || selection.value.starred !== undefined

  const hasOtherFields = Object.keys(selection.value).some(
    key =>
      !excludedKeys.includes(key) &&
      ![
        'color',
        'coverPhotoUrl',
        'cover_photo_url',
        'completedByEmail',
        'completed_by_email',
        'isStarred',
        'starred',
      ].includes(key) &&
      selection.value[key] !== null &&
      selection.value[key] !== undefined
  )

  return hasCoverPhoto || hasCompletedBy || hasStarred || hasOtherFields
})

const handleImageError = event => {
  const img = event.target
  img.style.display = 'none'
}

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
      } catch (err) {}
    }
  } catch (error) {
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

watch(
  () => [props.selectionId, isOpen.value],
  ([newSelectionId, newIsOpen]) => {
    if (newSelectionId && newIsOpen) {
      loadData()
    } else if (!newIsOpen) {
      // Clear selection when sidebar closes
      selection.value = null
      project.value = null
    }
  },
  { immediate: true }
)
</script>
