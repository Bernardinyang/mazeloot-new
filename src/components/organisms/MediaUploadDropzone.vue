<template>
  <div
    v-if="props.isEmpty"
    :class="[
      theme.borderSecondary,
      props.isDragging
        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 scale-[1.01] shadow-xl ring-4 ring-teal-500/20'
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
            ? 'bg-teal-100 dark:bg-teal-900/40 scale-110 ring-4 ring-teal-500/30'
            : '',
        ]"
        class="p-6 rounded-full transition-all duration-300"
      >
        <ImagePlus
          :class="[props.isDragging ? 'text-teal-600 dark:text-teal-400 scale-110 rotate-6' : '']"
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
            class="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-semibold underline underline-offset-4 transition-colors"
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
import { ImagePlus } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'

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
