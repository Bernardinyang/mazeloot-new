<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent :class="[theme.bgCard, theme.borderCard, 'sm:max-w-[500px]']">
      <DialogHeader>
        <DialogTitle :class="theme.textPrimary">Create New Folder</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Folder Name -->
        <div class="space-y-2">
          <label :class="['text-sm font-medium', theme.textPrimary]">
            Folder Name <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="formData.name"
            placeholder="e.g. Dance Recital"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            required
          />
          <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Event Date -->
        <div class="space-y-2">
          <label :class="['text-sm font-medium', theme.textPrimary]"> Event Date </label>
          <DatePicker
            v-model="formData.eventDate"
            placeholder="Event Date"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          />
        </div>

        <!-- Show on Homepage -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <label :class="['text-sm font-medium', theme.textPrimary]"> Show on Homepage </label>
            <button
              type="button"
              class="relative inline-flex items-center justify-center w-4 h-4 rounded-full"
              :class="theme.textTertiary"
              @click="showHomepageInfo = !showHomepageInfo"
            >
              <Info class="w-4 h-4" />
            </button>
          </div>
          <label class="relative inline-flex items-center cursor-pointer group">
            <input type="checkbox" v-model="formData.showOnHomepage" class="sr-only peer" />
            <div
              class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
            ></div>
            <span
              class="ml-3 text-sm font-medium"
              :class="formData.showOnHomepage ? theme.textPrimary : theme.textSecondary"
            >
              {{ formData.showOnHomepage ? 'On' : 'Off' }}
            </span>
          </label>
        </div>

        <!-- Global Folder Password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <label :class="['text-sm font-medium', theme.textPrimary]">
              Global Folder Password
            </label>
            <button
              type="button"
              class="relative inline-flex items-center justify-center w-4 h-4 rounded-full"
              :class="theme.textTertiary"
              @click="showPasswordInfo = !showPasswordInfo"
            >
              <Info class="w-4 h-4" />
            </button>
          </div>
          <label class="relative inline-flex items-center cursor-pointer group">
            <input type="checkbox" v-model="formData.globalPassword" class="sr-only peer" />
            <div
              class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
            ></div>
            <span
              class="ml-3 text-sm font-medium"
              :class="formData.globalPassword ? theme.textPrimary : theme.textSecondary"
            >
              {{ formData.globalPassword ? 'On' : 'Off' }}
            </span>
          </label>
        </div>

        <!-- Password Input (shown when global password is enabled) -->
        <div v-if="formData.globalPassword" class="space-y-2">
          <Input
            v-model="formData.password"
            type="password"
            placeholder="Enter folder password"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          />
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
            <span v-else>Create Folder</span>
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
import DatePicker from '@/components/shadcn/DatePicker.vue'
import { Info, Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'

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
