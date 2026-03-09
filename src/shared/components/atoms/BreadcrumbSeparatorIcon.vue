<template>
  <ChevronRight
    :class="[BREADCRUMB_SEPARATOR_ICON_CLASS, $attrs.class]"
    aria-hidden="true"
  />
</template>

<script setup>
import { ChevronRight } from '@/shared/utils/lucideAnimated'
import { BREADCRUMB_SEPARATOR_ICON_CLASS } from '@/shared/constants/breadcrumb'
</script>
