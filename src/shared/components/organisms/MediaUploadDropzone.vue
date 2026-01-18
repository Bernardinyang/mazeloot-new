<template>
  <div
    v-if="props.isEmpty"
    :class="[
      theme.borderSecondary,
      props.isDragging
        ? 'border-accent bg-accent/10 dark:bg-accent/20 scale-[1.01] shadow-xl ring-4 ring-accent/20'
        : '',
      ,
    ]"
    class="border-2 border-dashed rounded-2xl p-20 text-center transition-all duration-300 bg-white dark:bg-gray-900"
    @dragleave="emit('update:isDragging', false)"
    @drop="emit('drop', $event)"
    @dragover.prevent="emit('update:isDragging', true)"
  >
    <div class="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto">
      <div
        :class="[
          props.isDragging
            ? 'bg-accent/20 dark:bg-accent/40 scale-110 ring-4 ring-accent/30'
            : '',
        ]"
        class="p-6 rounded-full transition-all duration-300"
      >
        <ImagePlus
          :class="[props.isDragging ? 'text-accent scale-110 rotate-6' : '']"
          class="h-12 w-12 transition-all duration-300"
        />
      </div>
      <div class="space-y-3">
        <p :class="theme.textPrimary" class="text-xl font-bold">
          Drag media here to upload
        </p>
        <p :class="theme.textSecondary" class="text-sm">
          or
          <button
            class="text-accent hover:text-accent/80 font-semibold underline underline-offset-4 transition-colors"
            @click="emit('browse')"
          >
            browse files
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ImagePlus } from '@/shared/utils/lucideAnimated'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  isEmpty: {
    type: Boolean,
    required: true,
  },
  isDragging: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['browse', 'drop', 'update:isDragging'])
</script>
