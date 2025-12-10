<template>
  <CenterModal
    v-model="isOpen"
    :title="title"
    :description="description"
    content-class="sm:max-w-[425px] animate-scale-in"
  >
    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <p class="text-sm" :class="theme.textSecondary">
          Are you sure you want to move
          <span class="font-semibold" :class="theme.textPrimary">
            {{ itemName }}
          </span>
          into
          <span class="font-semibold" :class="theme.textPrimary"> {{ targetFolderName }} </span>?
        </p>
        <p v-if="warningMessage" class="text-sm text-yellow-600 dark:text-yellow-400">
          {{ warningMessage }}
        </p>
      </div>
    </div>

    <template #footer>
      <Button variant="outline" @click="handleCancel"> Cancel </Button>
      <Button :class="['bg-teal-500 hover:bg-teal-600 text-white']" @click="handleConfirm">
        Move
      </Button>
    </template>
  </CenterModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/shadcn/button'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

interface Props {
  modelValue: boolean
  itemName: string
  targetFolderName: string
  warningMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  warningMessage: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const title = computed(() => 'Move Collection')
const description = computed(() => 'This action will move the collection to the selected folder.')

const handleConfirm = () => {
  emit('confirm')
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>
