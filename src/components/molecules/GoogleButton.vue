<template>
  <Button
    :disabled="disabled || loading"
    type="button"
    variant="outline"
    class="w-full"
    @click="$emit('click')"
  >
    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
    <IconGoogle v-else class="mr-2" :size="16" />
    {{ loading ? 'Signing in...' : text }}
  </Button>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import IconGoogle from '@/icons/IconGoogle.vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Sign in with Google',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>
