<template>
  <CenterModal
    :model-value="props.modelValue"
    content-class="sm:max-w-[600px]"
    title="DUPLICATE FILES DETECTED"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 py-4">
      <p :class="theme.textSecondary" class="text-sm">
        The following file{{
          props.duplicateFiles.length > 1 ? 's' : props.duplicateFiles.length === 1 ? 's' : ''
        }}
        in this set. Choose an action for each:
      </p>
      <div class="space-y-3 max-h-[400px] overflow-y-auto">
        <div
          v-for="item in props.duplicateFiles"
          :key="item.file.name"
          :class="[theme.bgInput, theme.borderSecondary]"
          class="flex items-center justify-between p-3 rounded-lg border"
        >
          <div class="flex-1 min-w-0">
            <p :class="theme.textPrimary" class="text-sm font-medium truncate">
              {{ item.file.name }}
            </p>
            <p :class="theme.textTertiary" class="text-xs mt-1">Existing</p>
          </div>
          <div class="flex items-center gap-2 ml-4">
            <button
              :class="[
                duplicateFileActions[item.file.name] === 'replace'
                  ? 'bg-accent text-accent-foreground border-accent'
                  : theme.bgInput,
                theme.borderSecondary,
                duplicateFileActions[item.file.name] === 'replace' ? '' : theme.textPrimary,
                'hover:' + theme.bgButtonHover,
              ]"
              class="px-3 py-1.5 text-xs rounded-lg border transition-colors"
              @click="emit('set-action', item.file.name, 'replace')"
            >
              Replace
            </button>
            <button
              :class="[
                duplicateFileActions[item.file.name] === 'skip'
                  ? 'bg-red-500 text-white border-red-500'
                  : theme.bgInput,
                theme.borderSecondary,
                duplicateFileActions[item.file.name] === 'skip' ? '' : theme.textPrimary,
                'hover:' + theme.bgButtonHover,
              ]"
              class="px-3 py-1.5 text-xs rounded-lg border transition-colors"
              @click="emit('set-action', item.file.name, 'skip')"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
      <div :class="theme.borderSecondary" class="flex items-center gap-2 pt-2 border-t">
        <button
          :class="[
            theme.bgInput,
            theme.borderSecondary,
            theme.textPrimary,
            'hover:' + theme.bgButtonHover,
          ]"
          class="text-xs px-3 py-1.5 rounded-lg border transition-colors"
          @click="emit('replace-all')"
        >
          Replace All
        </button>
        <button
          :class="[
            theme.bgInput,
            theme.borderSecondary,
            theme.textPrimary,
            'hover:' + theme.bgButtonHover,
          ]"
          class="text-xs px-3 py-1.5 rounded-lg border transition-colors"
          @click="emit('skip-all')"
        >
          Skip All
        </button>
      </div>
    </div>
    <template #footer>
      <ActionButtonGroup
        :disabled="props.isUploading"
        :loading="props.isUploading"
        cancel-label="Cancel"
        confirm-label="Continue"
        loading-label="Uploading..."
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </CenterModal>
</template>

<script setup>
import { computed } from 'vue'
import CenterModal from '@/shared/modals/CenterModal.vue'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  duplicateFiles: { type: Array, required: true },
  duplicateFileActions: { type: Object, required: true }, // Object with filename -> action mapping
  isUploading: { type: Boolean, required: true },
})

const emit = defineEmits([
  'update:modelValue',
  'set-action',
  'replace-all',
  'skip-all',
  'cancel',
  'confirm',
])

// Use computed to ensure reactivity
const duplicateFileActions = computed(() => props.duplicateFileActions)
</script>
