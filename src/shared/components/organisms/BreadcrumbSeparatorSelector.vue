<template>
  <BreadcrumbSeparator :class="separatorClass">
    <component :is="separatorComponent" />
  </BreadcrumbSeparator>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronRightIcon } from '@radix-icons/vue'
import { ChevronRight, ChevronLeft, Slash, Circle } from '@/shared/utils/lucideAnimated'
import { BreadcrumbSeparator } from '@/shared/components/shadcn/breadcrumb'

const props = defineProps({
  separator: {
    type: String,
    default: 'chevron-right',
    validator: value => ['chevron-right', 'chevron-left', 'slash', 'dot', 'custom'].includes(value),
  },
  separatorClass: {
    type: [String, Array, Object],
    default: '',
  },
  customSeparator: {
    type: [String, Object, Function],
    default: null,
  },
})

const separatorComponents = {
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  slash: Slash,
  dot: Circle,
}

const separatorComponent = computed(() => {
  if (props.separator === 'custom' && props.customSeparator) {
    return props.customSeparator
  }
  return separatorComponents[props.separator] || separatorComponents['chevron-right']
})
</script>
