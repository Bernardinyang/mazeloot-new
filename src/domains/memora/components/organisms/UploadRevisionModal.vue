<template>
  <CenterModal
    :model-value="props.modelValue"
    content-class="sm:max-w-[600px]"
    body-class="max-h-[calc(100vh-200px)] overflow-y-auto"
    title="UPLOAD REVISION"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 py-4">
      <p :class="theme.textSecondary" class="text-sm">
        Upload a revised version of this media. Review the action items below and mark which ones
        have been completed in this revision.
      </p>

      <!-- Action Items from Approved Closure Request -->
      <div v-if="isLoadingTodos || todos.length > 0" class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium">Action Items</label>
        <div
          v-if="isLoadingTodos"
          class="space-y-2 max-h-[200px] overflow-y-auto border rounded-lg p-3"
          :class="[theme.bgInput, theme.borderInput]"
        >
          <div class="flex items-center justify-center py-8">
            <Loader2 class="h-6 w-6 animate-spin" :class="theme.textSecondary" />
            <span :class="theme.textSecondary" class="ml-2 text-sm">Loading action items...</span>
          </div>
        </div>
        <div
          v-else-if="todos.length > 0"
          class="space-y-2 max-h-[200px] overflow-y-auto border rounded-lg p-3"
          :class="[theme.bgInput, theme.borderInput]"
        >
          <div
            v-for="(todo, index) in todos"
            :key="index"
            class="flex items-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <input
              :id="`todo-${index}`"
              v-model="completedTodos"
              :value="index"
              :disabled="props.isUploading || isUploadingFile"
              class="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              type="checkbox"
            />
            <label
              :for="`todo-${index}`"
              :class="[theme.textPrimary, 'text-sm flex-1 cursor-pointer']"
            >
              {{ typeof todo === 'string' ? todo : todo.text }}
            </label>
          </div>
        </div>
        <p v-if="!isLoadingTodos && todos.length > 0" :class="theme.textTertiary" class="text-xs">
          Check the items that have been addressed in this revision
        </p>
        <p
          v-else-if="!isLoadingTodos && todos.length === 0"
          :class="theme.textTertiary"
          class="text-xs"
        >
          No action items found for this media
        </p>
      </div>

      <!-- Revision Number -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium">Revision Number</label>
        <Input
          v-model.number="formData.revisionNumber"
          :class="[
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            isRevisionLimitExceeded ? 'border-red-500' : '',
          ]"
          :disabled="props.isUploading || isUploadingFile || isLoadingTodos"
          min="1"
          :max="props.maxRevisions"
          placeholder="1"
          type="number"
        />
        <p
          v-if="isRevisionLimitExceeded"
          class="text-xs text-red-600 dark:text-red-400 font-medium"
        >
          Maximum revision limit ({{ props.maxRevisions }}) has been reached. Cannot upload this
          revision.
        </p>
        <p
          v-else-if="isLastRevision"
          class="text-xs text-amber-600 dark:text-amber-400 font-medium"
        >
          Warning: This is the last allowed revision ({{ formData.revisionNumber }} of
          {{ props.maxRevisions }}). No more revisions will be allowed after this.
        </p>
        <p
          v-else-if="isSecondToLastRevision"
          class="text-xs text-amber-600 dark:text-amber-400 font-medium"
        >
          Warning: This is the second-to-last revision ({{ formData.revisionNumber }} of
          {{ props.maxRevisions }}). Only one more revision will be allowed after this.
        </p>
        <p v-else :class="theme.textTertiary" class="text-xs">
          {{
            isLoadingTodos
              ? 'Calculating...'
              : `The revision number for this upload (e.g., 1, 2, 3...). Maximum: ${props.maxRevisions} revisions.`
          }}
        </p>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium">Description</label>
        <Textarea
          v-model="formData.description"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          :disabled="props.isUploading || isUploadingFile"
          :maxlength="1000"
          placeholder="Describe what changes were made in this revision..."
          rows="4"
        />
        <p :class="theme.textTertiary" class="text-xs">
          Optional: Provide details about what was changed in this revision
        </p>
      </div>

      <!-- File Upload -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium">Revised Media File</label>
        <input
          ref="fileInputRef"
          accept="image/*,video/*"
          class="hidden"
          type="file"
          @change="handleFileChange"
        />
        <Button
          :disabled="props.isUploading || isUploadingFile"
          class="w-full"
          variant="outline"
          @click="fileInputRef?.click()"
        >
          <Loader2 v-if="isUploadingFile" class="h-4 w-4 mr-2 animate-spin" />
          <Upload v-else-if="!uploadedUserFileUuid" class="h-4 w-4 mr-2" />
          <CheckCircle2 v-else class="h-4 w-4 mr-2 text-green-600" />
          {{
            isUploadingFile
              ? 'Uploading...'
              : uploadedUserFileUuid
                ? 'File Uploaded'
                : selectedFile
                  ? selectedFile.name
                  : 'Select File'
          }}
        </Button>
        <p v-if="selectedFile && !uploadError" :class="theme.textSecondary" class="text-xs">
          {{ uploadedUserFileUuid ? 'Uploaded: ' : 'Selected: ' }}{{ selectedFile.name }} ({{
            formatFileSize(selectedFile.size)
          }})
        </p>
        <p v-if="uploadError" class="text-xs text-red-600 dark:text-red-400">
          {{ uploadError }}
        </p>
      </div>

      <!-- Media Preview -->
      <div v-if="selectedFile && previewUrl && !uploadError" class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium">Preview</label>
        <div class="border rounded-lg overflow-hidden" :class="[theme.borderInput]">
          <img
            v-if="isImageFile"
            :src="previewUrl"
            alt="Preview"
            class="w-full max-h-[400px] object-contain"
          />
          <video v-else :src="previewUrl" controls class="w-full max-h-[400px]" />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <Button
          :disabled="props.isUploading || isUploadingFile"
          variant="outline"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          :disabled="!isFormValid || props.isUploading || isUploadingFile"
          class="bg-amber-500 hover:bg-amber-600 text-white"
          @click="handleConfirm"
        >
          <Loader2 v-if="props.isUploading" class="h-4 w-4 mr-2 animate-spin" />
          <span v-if="props.isUploading">Creating Revision...</span>
          <span v-else>Create Revision</span>
        </Button>
      </div>
    </template>
  </CenterModal>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Upload, Loader2, CheckCircle2 } from 'lucide-vue-next'
import CenterModal from '@/shared/components/molecules/CenterModal.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useProofingApi } from '@/domains/memora/api/proofing'

import { apiClient } from '@/shared/api/client'

const theme = useThemeClasses()
const proofingApi = useProofingApi()
const fileInputRef = ref(null)
const selectedFile = ref(null)
const uploadedUserFileUuid = ref(null)
const isUploadingFile = ref(false)
const uploadError = ref(null)
const todos = ref([])
const completedTodos = ref([])
const isLoadingTodos = ref(false)
const previewUrl = ref(null)

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  isUploading: { type: Boolean, default: false },
  mediaItem: { type: Object, default: null },
  currentRevisionNumber: { type: Number, default: 1 },
  maxRevisions: { type: Number, default: 5 },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const formData = ref({
  revisionNumber: props.currentRevisionNumber,
  description: '',
})

const isRevisionLimitExceeded = computed(() => {
  return formData.value.revisionNumber > props.maxRevisions
})

const isLastRevision = computed(() => {
  return formData.value.revisionNumber === props.maxRevisions
})

const isSecondToLastRevision = computed(() => {
  return formData.value.revisionNumber === props.maxRevisions - 1
})

const isFormValid = computed(() => {
  return (
    formData.value.revisionNumber > 0 &&
    formData.value.revisionNumber <= props.maxRevisions &&
    uploadedUserFileUuid.value !== null &&
    !props.isUploading &&
    !isUploadingFile.value
  )
})

const isImageFile = computed(() => {
  return selectedFile.value?.type?.startsWith('image/')
})

const handleFileChange = async event => {
  const file = event.target.files?.[0]
  if (!file) return

  // Clean up previous preview URL
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }

  // Create preview URL
  previewUrl.value = URL.createObjectURL(file)
  selectedFile.value = file
  uploadError.value = null
  isUploadingFile.value = true

  try {
    // Determine upload endpoint based on file type
    const isImage = file.type.startsWith('image/')
    const uploadEndpoint = isImage ? '/v1/images/upload' : '/v1/uploads'

    // Upload file immediately
    const uploadResponse = await apiClient.upload(uploadEndpoint, file, {
      purpose: 'proofing_revision',
    })

    // Extract userFileUuid from response
    const userFileUuid =
      uploadResponse.data?.userFileUuid ||
      uploadResponse.data?.data?.userFileUuid ||
      uploadResponse.userFileUuid

    if (!userFileUuid) {
      throw new Error('Upload response missing userFileUuid')
    }

    uploadedUserFileUuid.value = userFileUuid
  } catch (error) {
    console.error('Failed to upload file:', error)
    uploadError.value = error?.message || 'Failed to upload file'
    selectedFile.value = null
    uploadedUserFileUuid.value = null
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  } finally {
    isUploadingFile.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
  resetForm()
}

const handleConfirm = () => {
  if (!isFormValid.value) return

  emit('confirm', {
    revisionNumber: formData.value.revisionNumber,
    description: formData.value.description,
    userFileUuid: uploadedUserFileUuid.value,
    completedTodos: completedTodos.value,
  })
}

const resetForm = () => {
  formData.value = {
    revisionNumber: props.currentRevisionNumber,
    description: '',
  }
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  selectedFile.value = null
  uploadedUserFileUuid.value = null
  uploadError.value = null
  isUploadingFile.value = false
  todos.value = []
  completedTodos.value = []
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const loadClosureRequests = async () => {
  if (!props.mediaItem?.id && !props.mediaItem?.uuid) return

  isLoadingTodos.value = true
  try {
    const mediaId = props.mediaItem.id || props.mediaItem.uuid
    const result = await proofingApi.getMediaClosureRequests(mediaId)
    const closureRequests = result.closure_requests || []

    // Find the most recent approved closure request (latest as source of truth)
    const approvedRequests = closureRequests.filter(req => req.status === 'approved')
    if (approvedRequests.length > 0) {
      // Sort by created_at descending and get the first one (latest)
      const sorted = approvedRequests.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0)
        const dateB = new Date(b.created_at || b.createdAt || 0)
        return dateB - dateA
      })
      const latestApprovedRequest = sorted[0]
      if (latestApprovedRequest && latestApprovedRequest.todos) {
        todos.value = latestApprovedRequest.todos
      }
    }
  } catch (error) {
    console.error('Failed to load closure requests:', error)
  } finally {
    isLoadingTodos.value = false
  }
}

const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

watch(
  () => props.modelValue,
  async open => {
    if (open) {
      formData.value.revisionNumber = props.currentRevisionNumber
      await loadClosureRequests()
    } else {
      resetForm()
    }
  }
)

watch(
  () => props.currentRevisionNumber,
  newVal => {
    if (props.modelValue) {
      formData.value.revisionNumber = newVal
    }
  }
)

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>
