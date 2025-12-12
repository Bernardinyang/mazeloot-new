<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent :class="[theme.bgCard, theme.borderCard, 'sm:max-w-[500px]']">
      <DialogHeader>
        <DialogTitle :class="theme.textPrimary">Create New Folder</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Folder Name -->
        <FormFieldWithError label="Folder Name" :error="errors.name" required>
          <Input
            v-model="formData.name"
            placeholder="e.g. Dance Recital"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            required
          />
        </FormFieldWithError>

        <!-- Event Date -->
        <FormFieldWithError label="Event Date">
          <DatePicker
            v-model="formData.eventDate"
            placeholder="Event Date"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          />
        </FormFieldWithError>

        <!-- Show on Homepage -->
        <ToggleSwitch
          v-model="formData.showOnHomepage"
          label="Show on Homepage"
          :show-info="true"
          @info-click="showHomepageInfo = !showHomepageInfo"
        />

        <!-- Global Folder Password -->
        <ToggleSwitch
          v-model="formData.globalPassword"
          label="Global Folder Password"
          :show-info="true"
          @info-click="showPasswordInfo = !showPasswordInfo"
        />

        <!-- Password Input (shown when global password is enabled) -->
        <FormFieldWithError v-if="formData.globalPassword" label="Password">
          <Input
            v-model="formData.password"
            type="password"
            placeholder="Enter folder password"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          />
        </FormFieldWithError>

        <!-- Actions -->
        <FormDialogFooter
          :is-submitting="isSubmitting"
          :disabled="!formData.name.trim()"
          submit-label="Create Folder"
          submitting-label="Creating..."
          @cancel="$emit('update:open', false)"
        />
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import DatePicker from '@/components/shadcn/DatePicker.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import FormFieldWithError from '@/components/molecules/FormFieldWithError.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import FormDialogFooter from '@/components/molecules/FormDialogFooter.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  create: [
    data: {
      name: string
      eventDate?: Date | string | null
      showOnHomepage?: boolean
      password?: string | null
    },
  ]
}>()

const theme = useThemeClasses()

const formData = ref({
  name: '',
  eventDate: null as Date | string | null,
  showOnHomepage: true,
  globalPassword: false,
  password: '',
})

const errors = ref<{ name?: string }>({})
const isSubmitting = ref(false)
const showHomepageInfo = ref(false)
const showPasswordInfo = ref(false)

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Folder name is required'
    return
  }

  isSubmitting.value = true
  try {
    emit('create', {
      name: formData.value.name.trim(),
      eventDate: formData.value.eventDate,
      showOnHomepage: formData.value.showOnHomepage,
      password:
        formData.value.globalPassword && formData.value.password
          ? formData.value.password.trim()
          : null,
    })
    // Reset form
    formData.value = {
      name: '',
      eventDate: null,
      showOnHomepage: true,
      globalPassword: false,
      password: '',
    }
    emit('update:open', false)
  } catch (error) {
    console.error('Failed to create folder:', error)
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
        eventDate: null,
        showOnHomepage: true,
        globalPassword: false,
        password: '',
      }
      errors.value = {}
    }
  }
)
</script>
