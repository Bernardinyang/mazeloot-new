<template>
  <Button type="button" variant="outline" class="w-full" @click="$emit('click')">
    <IconGoogle class="mr-2" :size="16" />
    {{ text }}
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/shadcn/button'
import IconGoogle from '@/icons/IconGoogle.vue'

withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: 'Sign in with Google',
  }
)

defineEmits<{
  click: []
}>()
</script>
