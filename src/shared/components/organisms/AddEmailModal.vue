<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
          Add Allowed Emails
        </DialogTitle>
        <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
          At least one email address must be added before publishing this
          {{ context === 'proofing' ? 'proofing' : context === 'rawFile' ? 'raw file' : 'selection' }}.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 mt-6">
        <div class="space-y-3 max-w-2xl">
          <div v-for="(email, index) in emails" :key="`email-${index}-${email || ''}`" class="flex items-center gap-2">
            <Input
              :model-value="emails[index]"
              :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              class="flex-1"
              placeholder="email@example.com"
              type="email"
              @update:model-value="value => (emails[index] = value)"
            />
            <Button
              variant="ghost"
              size="sm"
              :class="[theme.textSecondary, theme.bgButtonHover]"
              aria-label="Remove email"
              @click="removeEmail(index)"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              :class="[theme.borderSecondary, theme.textPrimary]"
              @click="addEmail"
            >
              <Plus class="h-4 w-4 mr-2" />
              Add Email
            </Button>
            <Button
              v-if="hasExistingEmails"
              variant="ghost"
              size="sm"
              :class="[theme.textSecondary, 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30']"
              :disabled="isSaving"
              @click="handleRemoveAll"
            >
              Remove all emails
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter class="mt-6">
        <Button
          variant="outline"
          :class="[theme.borderSecondary, theme.textPrimary]"
          @click="handleGoToSettings"
        >
          Open General Settings
        </Button>
        <Button
          :disabled="!hasValidEmails || isSaving"
          :style="{
            backgroundColor: selectionColor,
          }"
          class="text-white"
          :loading="isSaving"
          loading-label="Saving..."
          @click="handleSaveAndPublish"
        >
          Save & Publish
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { Input } from '@/shared/components/shadcn/input'
import { Button } from '@/shared/components/shadcn/button'
import { Plus, X, Loader2 } from '@/shared/utils/lucideAnimated'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useRouter } from 'vue-router'
import { useSelectionsApi } from '@/domains/memora/api/selections'
import { useProofingApi } from '@/domains/memora/api/proofing'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { toast } from '@/shared/utils/toast'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  selectionId: {
    type: String,
    required: true,
  },
  currentEmails: {
    type: Array,
    default: () => [],
  },
  selectionColor: {
    type: String,
    default: '#8B5CF6', // Will be set dynamically, fallback for SSR
  },
  context: {
    type: String,
    default: 'selection', // 'selection', 'proofing', or 'rawFile'
    validator: value => ['selection', 'proofing', 'rawFile'].includes(value),
  },
  projectId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'saved', 'save-and-publish'])

const theme = useThemeClasses()
const router = useRouter()
const selectionsApi = useSelectionsApi()
const proofingApi = useProofingApi()
const rawFilesApi = useRawFilesApi()

const emails = ref([''])
const isSaving = ref(false)

// Initialize emails from props
watch(
  () => props.open,
  newVal => {
    if (newVal) {
      const existingEmails = props.currentEmails || []
      emails.value = existingEmails.length > 0 ? [...existingEmails] : ['']
    }
  },
  { immediate: true }
)

const hasValidEmails = computed(() => {
  const validEmails = emails.value.filter(email => {
    if (!email || !email.trim()) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  })
  return validEmails.length > 0
})

const hasExistingEmails = computed(() => {
  const list = props.currentEmails || []
  return Array.isArray(list) && list.length > 0 && list.some(e => e && String(e).trim())
})

const addEmail = () => {
  emails.value.push('')
}

const removeEmail = index => {
  emails.value.splice(index, 1)
  if (emails.value.length === 0) {
    emails.value = ['']
  }
}

const handleRemoveAll = async () => {
  isSaving.value = true
  try {
    let updatedItem = null
    if (props.context === 'proofing') {
      updatedItem = await proofingApi.updateProofing(props.projectId, props.selectionId, {
        allowedEmails: [],
      })
    } else if (props.context === 'rawFile') {
      updatedItem = await rawFilesApi.updateRawFile(props.selectionId, { allowedEmails: [] })
    } else {
      updatedItem = await selectionsApi.updateSelection(props.selectionId, { allowedEmails: [] })
    }
    toast.success('Emails removed', { description: 'Allowed emails cleared. Anyone with the link can access.' })
    emails.value = ['']
    emit('saved', [])
    emit('save-and-publish', { emails: [], updatedItem })
    emit('update:open', false)
  } catch (error) {
    toast.error('Failed to remove emails', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isSaving.value = false
  }
}

const handleGoToSettings = () => {
  emit('update:open', false)
  if (props.context === 'proofing') {
    router.push({
      name: 'proofingDetail',
      params: { id: props.selectionId },
      query: { tab: 'settings', section: 'general' },
    })
  } else if (props.context === 'rawFile') {
    router.push({
      name: 'rawFileDetail',
      params: { id: props.selectionId },
      query: { tab: 'settings', section: 'general' },
    })
  } else {
    router.push({
      name: 'selectionDetail',
      params: { id: props.selectionId },
      query: { tab: 'settings', section: 'general' },
    })
  }
}

const handleSave = async () => {
  if (!hasValidEmails.value) {
    toast.error('Invalid email', {
      description: 'Please enter at least one valid email address.',
    })
    return
  }

  isSaving.value = true
  try {
    // Filter and validate emails
    const validEmails = emails.value
      .map(email => (email || '').trim().toLowerCase())
      .filter(email => {
        if (!email) return false
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      })

    // Remove duplicates
    const uniqueEmails = [...new Set(validEmails)]

    if (uniqueEmails.length === 0) {
      toast.error('Invalid email', {
        description: 'Please enter at least one valid email address.',
      })
      return
    }

    // Save emails using the appropriate API
    let updatedItem = null
    if (props.context === 'proofing') {
      updatedItem = await proofingApi.updateProofing(props.projectId, props.selectionId, {
        allowedEmails: uniqueEmails,
      })
    } else if (props.context === 'rawFile') {
      updatedItem = await rawFilesApi.updateRawFile(props.selectionId, {
        allowedEmails: uniqueEmails,
      })
    } else {
      updatedItem = await selectionsApi.updateSelection(props.selectionId, {
        allowedEmails: uniqueEmails,
      })
    }

    toast.success('Emails saved', {
      description: `${uniqueEmails.length} email(s) added successfully.`,
    })

    emit('saved', uniqueEmails)
    emit('save-and-publish', { emails: uniqueEmails, updatedItem })
    emit('update:open', false)
  } catch (error) {
    toast.error('Failed to save emails', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isSaving.value = false
  }
}

const handleSaveAndPublish = async () => {
  await handleSave()
}
</script>
