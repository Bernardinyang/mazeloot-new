<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/avatar'

defineProps<{
  name: string
  avatar?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
}
</script>

<template>
  <Avatar :class="[sizeClasses[size || 'md'], 'rounded-lg']">
    <AvatarImage :src="avatar" :alt="name" />
    <AvatarFallback class="rounded-lg">
      {{ name.charAt(0).toUpperCase() }}
    </AvatarFallback>
  </Avatar>
</template>

