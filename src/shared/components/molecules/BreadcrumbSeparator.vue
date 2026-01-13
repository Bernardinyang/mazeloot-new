<template>
  <BreadcrumbSeparator :class="['hidden md:block', theme.textTertiary]" />
</template>

<script setup>
import { BreadcrumbSeparator } from '@/shared/components/shadcn/breadcrumb'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()
</script>
