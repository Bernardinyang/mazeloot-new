<template>
  <div class="flex items-center gap-1.5">
    <span :class="theme.textSecondary" class="text-xs font-mono leading-none">
      {{ showPassword ? password : '••••••••' }}
    </span>
    <div class="flex items-center gap-0.5">
      <button
        :title="showPassword ? 'Hide password' : 'Show password'"
        class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        type="button"
        @click.stop="togglePasswordVisibility"
      >
        <EyeOff v-if="showPassword" :class="theme.textTertiary" class="h-3 w-3" />
        <Eye v-else :class="theme.textTertiary" class="h-3 w-3" />
      </button>
      <button
        class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Copy password"
        type="button"
        @click.stop="handleCopyPassword"
      >
        <Copy :class="theme.textTertiary" class="h-3 w-3" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Copy, Eye, EyeOff } from 'lucide-vue-next'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()

const props = defineProps({
  password: {
    type: String,
    required: true,
  },
})

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleCopyPassword = async () => {
  if (!props.password) {
    toast.error('No password available', {
      description: 'This selection does not have a password.',
    })
    return
  }

  try {
    await navigator.clipboard.writeText(props.password)
    toast.success('Password copied!', {
      description: 'Password has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description: 'Could not copy password to clipboard. Please try again.',
    })
  }
}
</script>
