<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent :class="[theme.bgCard, theme.borderCard, 'sm:max-w-[500px]']">
      <DialogHeader>
        <DialogTitle :class="['text-lg font-semibold uppercase', theme.textPrimary]">
          CREATE NEW PRESET
        </DialogTitle>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Preset Name -->
        <div class="space-y-2">
          <label :class="['text-sm font-medium', theme.textPrimary]">
            Give your new preset a name
          </label>
          <Input
            v-model="formData.name"
            placeholder="e.g. Weddings"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            required
          />
          <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Actions -->
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
            class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            <span v-if="isSubmitting">Creating...</span>
            <span v-else>Create</span>
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  create: [data: { name: string }]
}>()

const theme = useThemeClasses()

const formData = ref({
  name: '',
})

const errors = ref<{ name?: string }>({})
const isSubmitting = ref(false)

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Preset name is required'
    return
  }

  isSubmitting.value = true
  try {
    emit('create', {
      name: formData.value.name.trim(),
    })
    // Wait to show loading state (matches parent handler delay)
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Reset form
    formData.value = {
      name: '',
    }
    emit('update:open', false)
  } catch (error) {
    console.error('Failed to create preset:', error)
    // Keep dialog open on error so user can retry
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
      }
      errors.value = {}
    }
  }
)
</script>
