<template>
  <div class="relative my-6">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-border"></div>
    </div>
    <div class="relative flex justify-center text-xs uppercase">
      <span class="bg-background px-2 text-muted-foreground">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text?: string
}>(), {
  text: 'Or continue with'
})
</script>

