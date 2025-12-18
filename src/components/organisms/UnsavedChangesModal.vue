<template>
  <CenterModal
    v-model="isOpen"
    title="Unsaved Changes"
    description="You have unsaved changes that will be lost if you leave this page."
    content-class="sm:max-w-[550px]"
  >
    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <p class="text-sm" :class="theme.textSecondary">
          Are you sure you want to leave? Your unsaved changes will be lost.
        </p>
        <p class="text-xs" :class="theme.textTertiary">
          You can save your changes before leaving, or discard them and continue.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          :disabled="isSaving"
          :class="[
            theme.textSecondary,
            theme.bgButtonHover,
            'hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ]"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <div class="flex items-center gap-2">
          <Button
            :disabled="isSaving"
            class="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            @click="handleDiscard"
          >
            Discard Changes
          </Button>
          <Button
            :disabled="isSaving"
            class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
            @click="handleSave"
          >
            <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save & Leave</span>
          </Button>
        </div>
      </div>
    </template>
  </CenterModal>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'save', 'discard', 'cancel'])

const theme = useThemeClasses()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const handleSave = () => {
  emit('save')
}

const handleDiscard = () => {
  emit('discard')
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>
