<template>
  <div
    :class="[
      BREADCRUMB_LIST_CLASS,
      theme.textPrimary,
      theme.transitionColors,
    ]"
  >
    <template v-for="(seg, i) in segments">
      <RouterLink
        v-if="seg.to"
        :key="`link-${i}`"
        :to="seg.to"
        :class="[BREADCRUMB_LINK_CLASS, theme.textPrimary, theme.transitionColors]"
      >
        {{ seg.label }}
      </RouterLink>
      <span v-else :key="`label-${i}`" class="truncate">{{ seg.label }}</span>
      <BreadcrumbSeparatorIcon
        v-if="i < segments.length - 1"
        :key="`sep-${i}`"
        :class="theme.textTertiary"
      />
    </template>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { BREADCRUMB_LIST_CLASS, BREADCRUMB_LINK_CLASS } from '@/shared/constants/breadcrumb'
import BreadcrumbSeparatorIcon from '@/shared/components/atoms/BreadcrumbSeparatorIcon.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

defineProps({
  segments: {
    type: Array,
    required: true,
    validator: (val) =>
      val.every((s) => s && typeof s.label === 'string' && (s.to === undefined || typeof s.to === 'object')),
  },
})

const theme = useThemeClasses()
</script>
