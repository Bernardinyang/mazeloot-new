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

        <!-- Color -->
        <ColorSelector v-model="formData.color" />

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

<script setup>
import { ref, reactive, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import DatePicker from '@/components/shadcn/DatePicker.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import FormFieldWithError from '@/components/molecules/FormFieldWithError.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import FormDialogFooter from '@/components/molecules/FormDialogFooter.vue'
import ColorSelector from '@/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/utils/colors'

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open', 'create'])

const theme = useThemeClasses()

const formData = reactive({
  name: '',
  eventDate: null,
  showOnHomepage: true,
  globalPassword: false,
  password: '',
  color: generateRandomColorFromPalette(), // Random color from palette
})

const errors = ref({})
const isSubmitting = ref(false)
const showHomepageInfo = ref(false)
const showPasswordInfo = ref(false)

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Folder name is required'
    return
  }

  isSubmitting.value = true
  try {
    emit('create', {
      name: formData.name.trim(),
      eventDate: formData.eventDate,
      showOnHomepage: formData.showOnHomepage,
      password: formData.globalPassword && formData.password ? formData.password.trim() : null,
      color: formData.color,
    })
    // Reset form
    formData.name = ''
    formData.eventDate = null
    formData.showOnHomepage = true
    formData.globalPassword = false
    formData.password = ''
    formData.color = generateRandomColorFromPalette()
    emit('update:open', false)
  } catch (error) {
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
      formData.eventDate = null
      formData.showOnHomepage = true
      formData.globalPassword = false
      formData.password = ''
      formData.color = generateRandomColorFromPalette()
      errors.value = {}
    }
  }
)
</script>
