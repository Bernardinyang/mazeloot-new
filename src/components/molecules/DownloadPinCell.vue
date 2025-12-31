<template>
  <div class="flex items-center gap-1.5">
    <span :class="theme.textSecondary" class="text-xs font-mono leading-none">
      {{ showPin ? pin : '••••' }}
    </span>
    <div class="flex items-center gap-0.5">
      <button
        :title="showPin ? 'Hide PIN' : 'Show PIN'"
        class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        type="button"
        @click.stop="togglePinVisibility"
      >
        <EyeOff v-if="showPin" :class="theme.textTertiary" class="h-3 w-3" />
        <Eye v-else :class="theme.textTertiary" class="h-3 w-3" />
      </button>
      <button
        class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Copy PIN"
        type="button"
        @click.stop="handleCopyPin"
      >
        <Copy :class="theme.textTertiary" class="h-3 w-3" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Copy, Eye, EyeOff } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()

const props = defineProps({
  pin: {
    type: String,
    required: true,
  },
})

const showPin = ref(false)

const togglePinVisibility = () => {
  showPin.value = !showPin.value
}

const handleCopyPin = async () => {
  if (!props.pin) {
    toast.error('No PIN available', {
      description: 'This collection does not have a download PIN.',
    })
    return
  }

  try {
    await navigator.clipboard.writeText(props.pin)
    toast.success('PIN copied!', {
      description: 'Download PIN has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description: 'Could not copy PIN to clipboard. Please try again.',
    })
  }
}
</script>

