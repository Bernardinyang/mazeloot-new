<template>
  <div class="p-6 text-center">
    <component :is="icon" v-if="icon" :class="['h-8 w-8 mx-auto mb-2', theme.textSecondary]" />
    <p :class="[theme.textSecondary, 'text-sm']">{{ message }}</p>
    <Button 
      v-if="actionLabel" 
      variant="outline" 
      size="sm" 
      :class="[theme.textPrimary, theme.borderCard, theme.bgButtonHover, 'mt-4']"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = withDefaults(defineProps<{
  message: string
  actionLabel?: string
  icon?: any
}>(), {
  actionLabel: '',
})

defineEmits<{
  action: []
}>()

const theme = useThemeClasses()
</script>

