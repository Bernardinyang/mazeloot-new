<template>
  <Button
    :disabled="disabled || loading"
    type="button"
    variant="outline"
    class="w-full"
    :loading="loading"
    loading-label="Signing in..."
    :icon="!loading ? IconGoogle : null"
    @click="$emit('click')"
  >
    {{ text }}
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
