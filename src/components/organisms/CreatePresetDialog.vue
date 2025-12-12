<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent :class="[theme.bgCard, theme.borderCard, 'sm:max-w-[480px]']">
      <DialogHeader>
        <DialogTitle :class="['text-xl font-bold', theme.textPrimary]">
          Create New Preset
        </DialogTitle>
        <p class="text-sm mt-1.5" :class="theme.textSecondary">
          Give your preset a name to get started. You can customize all settings after creating it.
        </p>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-5 mt-2">
        <!-- Preset Name -->
        <div class="space-y-2">
          <label class="text-sm font-medium" :class="theme.textPrimary">
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
              errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
            ]"
            @keydown.enter="handleSubmit"
            autofocus
          />
          <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
          <p v-else class="text-xs" :class="theme.textSecondary">
            This name will help you identify this preset later.
          </p>
        </div>

        <!-- Actions -->
        <FormDialogFooter
          :is-submitting="isSubmitting"
          :disabled="!formData.name.trim()"
          submit-label="Create Preset"
          submitting-label="Creating..."
          @cancel="handleCancel"
        />
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { useThemeClasses } from '@/composables/useThemeClasses'
import FormDialogFooter from '@/components/molecules/FormDialogFooter.vue'
import { delay } from '@/utils/delay'

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

const handleCancel = () => {
  formData.value = { name: '' }
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Please enter a preset name'
    return
  }

  isSubmitting.value = true
  try {
    emit('create', {
      name: formData.value.name.trim(),
    })
    // Wait to show loading state (matches parent handler delay)
    await delay(1000)
    // Reset form
    formData.value = {
      name: '',
    }
    errors.value = {}
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
  (newValue: boolean) => {
    if (!newValue) {
      formData.value = {
        name: '',
      }
      errors.value = {}
    }
  }
)
</script>
