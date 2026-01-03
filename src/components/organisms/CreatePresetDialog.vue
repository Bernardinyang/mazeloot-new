<template>
  <SidebarModal
    :model-value="open"
    title="Create New Preset"
    description="Create a new preset from scratch or start from a template."
    content-class="sm:max-w-md"
    @update:model-value="$emit('update:open', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Template Selection -->
        <div v-if="!selectedTemplate" class="space-y-2">
          <label class="text-sm font-medium" :class="theme.textPrimary">
            Start From Template
            <span class="text-xs font-normal" :class="theme.textSecondary">(optional)</span>
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="template in templates"
              :key="template.id"
              type="button"
              @click="selectedTemplate = template"
              class="p-4 rounded-xl border-2 transition-all duration-300 text-left hover:border-teal-500/50 hover:shadow-md"
              :class="[
                theme.borderSecondary,
                theme.bgCard,
                selectedTemplate?.id === template.id
                  ? 'border-teal-500/50 bg-teal-50 dark:bg-teal-950/20 shadow-sm'
                  : 'hover:bg-teal-50 dark:hover:bg-teal-950/20',
              ]"
            >
              <h4 class="font-semibold text-sm mb-1" :class="theme.textPrimary">
                {{ template.name }}
              </h4>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                {{ template.description }}
              </p>
            </button>
            <button
              type="button"
              @click="selectedTemplate = null"
              class="p-4 rounded-xl border-2 transition-all duration-300 text-left hover:border-teal-500/50 hover:shadow-md"
              :class="[
                theme.borderSecondary,
                theme.bgCard,
                selectedTemplate === null
                  ? 'border-teal-500/50 bg-teal-50 dark:bg-teal-950/20 shadow-sm'
                  : 'hover:bg-teal-50 dark:hover:bg-teal-950/20',
              ]"
            >
              <h4 class="font-semibold text-sm mb-1" :class="theme.textPrimary">Blank Preset</h4>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">Start from scratch</p>
            </button>
          </div>
        </div>

        <!-- Selected Template Info -->
        <div
          v-if="selectedTemplate"
          class="p-4 rounded-xl border-2 transition-all duration-300"
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            'border-teal-500/30 bg-teal-50 dark:bg-teal-950/20',
          ]"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="flex-1">
              <p class="text-sm font-semibold mb-1" :class="theme.textPrimary">
                Using template: {{ selectedTemplate.name }}
              </p>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                {{ selectedTemplate.description }}
              </p>
            </div>
            <button
              type="button"
              @click="selectedTemplate = null"
              class="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
        <!-- Preset Name -->
        <div class="space-y-2">
          <label class="text-sm font-semibold" :class="theme.textPrimary">
            Preset Name
            <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="formData.name"
            placeholder="e.g. Wedding Preset, Portrait Session..."
            :class="[
              theme.bgInput,
              theme.borderInput,
              theme.textInput,
              'border-2 transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50',
              errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
            ]"
            @keydown.enter="handleSubmit"
            autofocus
          />
          <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
          <p v-else class="text-xs leading-relaxed" :class="theme.textSecondary">
            This name will help you identify this preset later.
          </p>
        </div>

        <!-- Preset Description -->
        <div class="space-y-2">
          <label class="text-sm font-semibold" :class="theme.textPrimary">
            Description
            <span class="text-xs font-normal" :class="theme.textSecondary">(optional)</span>
          </label>
          <textarea
            v-model="formData.description"
            placeholder="Add a description to help you remember what this preset is for..."
            :class="[
              theme.bgInput,
              theme.borderInput,
              theme.textInput,
              'w-full min-h-[100px] resize-y border-2 transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 rounded-lg px-4 py-3 leading-relaxed',
              errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
            ]"
            rows="4"
          />
          <p v-if="errors.description" class="text-xs text-red-500 mt-1">{{ errors.description }}</p>
          <p v-else class="text-xs leading-relaxed" :class="theme.textSecondary">
            Optional description to help you remember what this preset is for.
          </p>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            variant="outline"
            :class="[theme.borderSecondary, theme.textPrimary, 'hover:bg-gray-100 dark:hover:bg-gray-800']"
            :disabled="isSubmitting"
            @click="handleCancel"
          >
            Cancel
          </Button>
          <Button
            :disabled="!formData.name.trim() || isSubmitting"
            class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
            @click="handleSubmit"
          >
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSubmitting ? 'Creating...' : 'Create Preset' }}
          </Button>
        </div>
      </template>
  </SidebarModal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { useThemeClasses } from '@/composables/useThemeClasses'
import SidebarModal from '@/components/molecules/SidebarModal.vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open', 'create'])

const theme = useThemeClasses()

const formData = reactive({
  name: '',
  description: '',
  category: '',
})

const selectedTemplate = ref(null)
const errors = ref({})
const isSubmitting = ref(false)

const categories = ['Wedding', 'Portrait', 'Event', 'Commercial', 'Other']

const templates = [
  {
    id: 'wedding',
    name: 'Wedding Collection',
    description: 'Perfect for wedding galleries',
    category: 'Wedding',
  },
  {
    id: 'portrait',
    name: 'Portrait Session',
    description: 'Ideal for portrait photography',
    category: 'Portrait',
  },
  {
    id: 'event',
    name: 'Event Gallery',
    description: 'Great for events and parties',
    category: 'Event',
  },
]

const handleCancel = () => {
  formData.name = ''
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Please enter a preset name'
    return
  }

  isSubmitting.value = true
  try {
    const createData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      category: formData.category || null,
    }
    
    if (selectedTemplate.value) {
      createData.templateId = selectedTemplate.value.id
      if (!createData.category && selectedTemplate.value.category) {
        createData.category = selectedTemplate.value.category
      }
    }
    
    await emit('create', createData)
    // Reset form and close dialog on success
    formData.name = ''
    formData.description = ''
    formData.category = ''
    selectedTemplate.value = null
    errors.value = {}
    emit('update:open', false)
  } catch (error) {
    // Handle validation errors
    if (error?.response?.data?.errors) {
      const apiErrors = error.response.data.errors
      if (apiErrors.name) {
        errors.value.name = Array.isArray(apiErrors.name) ? apiErrors.name[0] : apiErrors.name
      }
    } else if (error?.message) {
      errors.value.name = error.message
    } else {
      errors.value.name = 'Failed to create preset. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Reset form when dialog closes
watch(
  () => props.open,
  newValue => {
    if (!newValue) {
      formData.name = ''
      formData.description = ''
      formData.category = ''
      selectedTemplate.value = null
      errors.value = {}
    }
  }
)
</script>
