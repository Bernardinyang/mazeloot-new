<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent :class="[theme.bgCard, theme.borderCard]">
      <DialogHeader>
        <DialogTitle :class="theme.textPrimary">Create New Collection</DialogTitle>
        <DialogDescription :class="theme.textSecondary">
          Create a new collection to organize your photos and media.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label :class="['text-sm font-medium', theme.textPrimary]">
            Collection Name <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="formData.name"
            placeholder="Enter collection name"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            required
          />
          <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <div class="space-y-2">
          <label :class="['text-sm font-medium', theme.textPrimary]">
            Description (Optional)
          </label>
          <Textarea
            v-model="formData.description"
            placeholder="Enter collection description"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            rows="3"
          />
        </div>

        <div class="space-y-2">
          <label :class="['text-sm font-medium', theme.textPrimary]"> Category </label>
          <Select v-model="formData.category">
            <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
              <SelectItem value="wedding" :class="[theme.textPrimary, theme.bgButtonHover]"
                >Wedding</SelectItem
              >
              <SelectItem value="portrait" :class="[theme.textPrimary, theme.bgButtonHover]"
                >Portrait</SelectItem
              >
              <SelectItem value="event" :class="[theme.textPrimary, theme.bgButtonHover]"
                >Event</SelectItem
              >
              <SelectItem value="other" :class="[theme.textPrimary, theme.bgButtonHover]"
                >Other</SelectItem
              >
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            :class="[theme.textSecondary, theme.bgButtonHover]"
            @click="$emit('update:open', false)"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            :disabled="isSubmitting || !formData.name.trim()"
            class="bg-teal-500 hover:bg-teal-600 text-white"
          >
            <span v-if="isSubmitting">Creating...</span>
            <span v-else>Create Collection</span>
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import Textarea from '@/components/shadcn/Textarea.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  create: [data: { name: string; description?: string; category?: string }]
}>()

const theme = useThemeClasses()

const formData = ref({
  name: '',
  description: '',
  category: 'other' as 'wedding' | 'portrait' | 'event' | 'other',
})

const errors = ref<{ name?: string }>({})
const isSubmitting = ref(false)

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Collection name is required'
    return
  }

  isSubmitting.value = true
  try {
    emit('create', {
      name: formData.value.name.trim(),
      description: formData.value.description.trim() || undefined,
      category: formData.value.category,
    })
    // Reset form
    formData.value = {
      name: '',
      description: '',
      category: 'other',
    }
    emit('update:open', false)
  } catch (error) {
    console.error('Failed to create collection:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Reset form when dialog closes
watch(
  () => props.open,
  newValue => {
    if (!newValue) {
      formData.value = {
        name: '',
        description: '',
        category: 'other',
      }
      errors.value = {}
    }
  }
)
</script>
