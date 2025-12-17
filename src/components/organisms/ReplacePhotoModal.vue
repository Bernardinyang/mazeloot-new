<template>
  <CenterModal
    :model-value="props.modelValue"
    content-class="sm:max-w-[500px]"
    title="REPLACE PHOTO"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 py-4">
      <p :class="theme.textSecondary" class="text-sm">
        Select a new image file to replace the current photo:
      </p>
      <div class="space-y-2">
        <input
          ref="fileInputRef"
          accept="image/*"
          class="hidden"
          type="file"
          @change="handleFileChange"
        />
        <Button
          :disabled="props.isReplacing"
          class="w-full"
          variant="outline"
          @click="fileInputRef?.click()"
        >
          <Loader2 v-if="props.isReplacing" class="h-4 w-4 mr-2 animate-spin" />
          <ImagePlus v-else class="h-4 w-4 mr-2" />
          {{ props.isReplacing ? 'Replacing...' : 'Replace Photo' }}
        </Button>
      </div>
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <Button :disabled="props.isReplacing" variant="outline" @click="emit('cancel')">
          Cancel
        </Button>
      </div>
    </template>
  </CenterModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ImagePlus, Loader2 } from 'lucide-vue-next'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()
const fileInputRef = ref(null)

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  isReplacing: { type: Boolean, required: true },
})

const emit = defineEmits(['update:modelValue', 'file-change', 'cancel'])

const handleFileChange = event => {
  emit('file-change', event)
  // Allow selecting the same file again
  if (fileInputRef.value) fileInputRef.value.value = ''
}

watch(
  () => props.modelValue,
  open => {
    if (!open && fileInputRef.value) fileInputRef.value.value = ''
  }
)
</script>
