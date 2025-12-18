<template>
  <BreadcrumbSeparator :class="['hidden md:block', theme.textTertiary]" />
</template>

<script setup>
import { BreadcrumbSeparator } from '@/components/shadcn/breadcrumb'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()
</script>
