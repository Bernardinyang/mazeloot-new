<template>
  <SidebarModal
    v-model="isOpen"
    title="Raw Files Details"
    :description="rawFiles?.name || 'Raw files information'"
  >
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
      <Loader2 class="h-10 w-10 animate-spin text-violet-500 mb-4" />
      <p :class="['text-sm font-medium', theme.textSecondary]">Loading raw files details...</p>
    </div>

    <div v-else-if="rawFiles" class="space-y-0">
      <div v-if="project" class="pb-6">
        <div
          :class="[
            'group rounded-xl border p-4 transition-all hover:shadow-md hover:border-violet-500/50',
            theme.bgCardSolid,
            theme.borderSecondary,
          ]"
        >
          <div class="flex items-center gap-2 mb-3">
            <FolderKanban class="h-4 w-4 text-violet-500" />
            <h3 :class="['text-sm font-semibold', theme.textPrimary]">Project</h3>
          </div>
          <router-link
            :to="{ name: 'projectDashboard', params: { id: project.id } }"
            :class="[
              'text-sm font-semibold hover:underline transition-colors inline-flex items-center gap-1.5 group/link',
              theme.textPrimary,
              'hover:text-violet-500 dark:hover:text-violet-400',
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

      <div v-if="project" :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"></div>

      <div class="pt-2 pb-6">
        <DetailSection title="Basic Information" :icon="Info">
          <div class="space-y-3.5">
            <DetailField label="ID" :value="rawFiles.id" format="mono" />
            <DetailField label="Name" :value="rawFiles.name" />
            <DetailField label="Status">
              <StatusBadge :status="rawFiles.status || 'draft'" />
            </DetailField>
            <DetailField v-if="rawFiles.hasPassword" label="Password Protected">
              <div class="flex items-center gap-2">
                <Shield class="h-4 w-4 text-violet-500" />
                <span :class="['text-sm', theme.textPrimary]">Yes</span>
              </div>
            </DetailField>
            <DetailField
              v-if="rawFiles.downloadPinEnabled"
              label="Download PIN Enabled"
            >
              <div class="flex items-center gap-2">
                <Shield class="h-4 w-4 text-violet-500" />
                <span :class="['text-sm', theme.textPrimary]">Yes</span>
              </div>
            </DetailField>
            <DetailField
              v-if="rawFiles.projectId"
              label="Project ID"
              :value="rawFiles.projectId"
              format="mono"
            />
          </div>
        </DetailSection>
      </div>

      <div :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"></div>

      <div v-if="rawFiles.mediaCount !== undefined" class="pt-2 pb-6">
        <DetailSection title="Media Statistics" :icon="BarChart3">
          <div class="grid grid-cols-2 gap-3">
            <div
              :class="[
                'text-center p-4 rounded-xl border transition-all hover:shadow-lg hover:scale-[1.02]',
                'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
                theme.borderSecondary,
              ]"
            >
              <div class="flex items-center justify-center mb-1.5">
                <Download class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div :class="['text-2xl font-bold mb-1', 'text-blue-600 dark:text-blue-400']">
                {{ rawFiles.mediaCount || 0 }}
              </div>
              <div
                :class="[
                  'text-[10px] font-medium uppercase tracking-wide',
                  'text-blue-600/70 dark:text-blue-400/70',
                ]"
              >
                Total Files
              </div>
            </div>

            <div
              :class="[
                'text-center p-4 rounded-xl border transition-all hover:shadow-lg hover:scale-[1.02]',
                'bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20',
                theme.borderSecondary,
              ]"
            >
              <div class="flex items-center justify-center mb-1.5">
                <Folder class="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div :class="['text-2xl font-bold mb-1', 'text-violet-600 dark:text-violet-400']">
                {{ rawFiles.setCount || 0 }}
              </div>
              <div
                :class="[
                  'text-[10px] font-medium uppercase tracking-wide',
                  'text-violet-600/70 dark:text-violet-400/70',
                ]"
              >
                Sets
              </div>
            </div>
          </div>
        </DetailSection>
      </div>

      <div
        v-if="rawFiles.mediaCount !== undefined"
        :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"
      ></div>

      <div v-if="hasSets" class="pt-2 pb-6">
        <DetailSection title="Media Sets" :icon="Folder">
          <div class="flex flex-wrap gap-2.5">
            <div
              v-for="set in rawFiles.mediaSets"
              :key="set.id || set"
              :class="[
                'group px-3.5 py-2 rounded-lg border transition-all hover:shadow-md hover:border-violet-500/50 cursor-pointer',
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
                  v-if="set.count !== undefined || set.media_count !== undefined"
                  :class="[
                    'text-xs px-1.5 py-0.5 rounded-full',
                    'bg-violet-500/10 text-violet-600 dark:text-violet-400',
                  ]"
                >
                  {{ set.count || set.media_count }}
                </span>
              </div>
            </div>
          </div>
        </DetailSection>
      </div>

      <div v-if="hasSets" :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"></div>

      <div class="pt-2 pb-6">
        <DetailSection title="Timeline" :icon="Clock">
          <div class="space-y-3.5">
            <DetailField label="Created At" :value="rawFiles.createdAt" format="date" />
            <DetailField
              v-if="rawFiles.updatedAt"
              label="Updated At"
              :value="rawFiles.updatedAt"
              format="date"
            />
          </div>
        </DetailSection>
      </div>

      <div
        v-if="hasAdditionalFields"
        :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"
      ></div>

      <div v-if="hasAdditionalFields" class="pt-2 pb-6">
        <DetailSection title="Additional Properties" :icon="FileText">
          <div class="space-y-3.5">
            <DetailField v-if="rawFiles.coverPhotoUrl" label="Cover Photo">
              <div class="flex items-center gap-2">
                <img
                  :src="rawFiles.coverPhotoUrl"
                  alt="Cover photo"
                  class="h-10 w-10 rounded object-cover border"
                  :class="theme.borderSecondary"
                  @error="handleImageError"
                />
                <a
                  :href="rawFiles.coverPhotoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="[
                    'text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 hover:underline',
                  ]"
                >
                  View Image
                </a>
              </div>
            </DetailField>

            <DetailField v-if="rawFiles.isStarred !== undefined" label="Starred">
              <div class="flex items-center gap-2">
                <Star
                  :class="[
                    'h-4 w-4',
                    rawFiles.isStarred ? 'fill-yellow-400 text-yellow-400' : theme.textSecondary,
                  ]"
                />
                <span :class="['text-sm', theme.textPrimary]">
                  {{ rawFiles.isStarred ? 'Yes' : 'No' }}
                </span>
              </div>
            </DetailField>
          </div>
        </DetailSection>
      </div>

      <div :class="['h-px mt-6 mb-8 bg-gray-200 dark:bg-gray-700']"></div>

      <div class="pt-2 pb-2">
        <ActionButtonGroup>
          <Button
            variant="primary"
            class="w-full shadow-md hover:shadow-lg transition-all"
            @click="handleViewRawFiles"
          >
            <Eye class="h-4 w-4 mr-2" />
            View Raw Files
          </Button>
        </ActionButtonGroup>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <div
        :class="[
          'h-16 w-16 rounded-full flex items-center justify-center mb-4',
          'bg-red-500/10 dark:bg-red-500/20',
        ]"
      >
        <AlertCircle class="h-8 w-8 text-red-500 dark:text-red-400" />
      </div>
      <p :class="['text-base font-semibold mb-1', theme.textPrimary]">Raw files phase not found</p>
      <p :class="['text-sm', theme.textSecondary]">
        The raw files phase you're looking for doesn't exist or has been deleted.
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
  Download,
  Star,
} from 'lucide-vue-next'
import SidebarModal from '@/shared/modals/SidebarModal.vue'
import DetailSection from '@/shared/components/molecules/DetailSection.vue'
import DetailField from '@/shared/components/molecules/DetailField.vue'
import StatusBadge from '@/shared/components/molecules/StatusBadge.vue'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles.js'
import { useProjectStore } from '@/domains/memora/stores/project'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  rawFilesId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const theme = useThemeClasses()
const router = useRouter()
const rawFilesApi = useRawFilesApi()
const projectStore = useProjectStore()

const rawFiles = ref(null)
const project = ref(null)
const isLoading = ref(false)

const excludedKeys = [
  'id',
  'name',
  'status',
  'projectId',
  'project_uuid',
  'mediaCount',
  'setCount',
  'createdAt',
  'created_at',
  'updatedAt',
  'updated_at',
  'hasPassword',
  'media',
  'projectName',
  'mediaSets',
  'isStarred',
  'starred',
  'uuid',
  'downloadPinEnabled',
]

const hasSets = computed(() => {
  if (!rawFiles.value) return false
  return (
    rawFiles.value.mediaSets &&
    Array.isArray(rawFiles.value.mediaSets) &&
    rawFiles.value.mediaSets.length > 0
  )
})

const hasAdditionalFields = computed(() => {
  if (!rawFiles.value) return false

  const hasCoverPhoto = rawFiles.value.coverPhotoUrl || rawFiles.value.cover_photo_url
  const hasStarred =
    rawFiles.value.isStarred !== undefined || rawFiles.value.starred !== undefined

  return hasCoverPhoto || hasStarred
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
  if (!props.rawFilesId) return

  isLoading.value = true
  try {
    const rawFilesData = await rawFilesApi.fetchRawFiles(props.rawFilesId)
    rawFiles.value = rawFilesData

    if (rawFilesData.projectId || rawFilesData.project_uuid) {
      try {
        const projectId = rawFilesData.projectId || rawFilesData.project_uuid
        const projectData = await projectStore.fetchProject(projectId)
        project.value = projectData
      } catch (err) {}
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const handleViewRawFiles = () => {
  if (!rawFiles.value) return

  router.push({
    name: 'rawFilesDetail',
    params: { id: rawFiles.value.id },
  })
  isOpen.value = false
}

watch(
  () => [props.rawFilesId, isOpen.value],
  ([newRawFilesId, newIsOpen]) => {
    if (newRawFilesId && newIsOpen) {
      loadData()
    } else if (!newIsOpen) {
      rawFiles.value = null
      project.value = null
    }
  },
  { immediate: true }
)
</script>
