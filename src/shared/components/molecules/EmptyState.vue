<template>
  <div :class="['flex flex-col items-center justify-center py-16 text-center', containerClass]">
    <div v-if="icon" :class="['mb-4 p-4 rounded-full', iconBgClass || theme.bgCardSolid]">
      <component :is="icon" :class="['h-8 w-8', iconClass || theme.textTertiary]" />
    </div>
    <h3 :class="['text-base font-semibold mb-2', theme.textPrimary]">{{ message }}</h3>
    <p v-if="description" :class="['text-sm max-w-sm mx-auto mb-6', theme.textSecondary]">
      {{ description }}
    </p>
    <Button
      v-if="actionLabel"
      :variant="actionVariant || 'success'"
      :size="actionSize || 'sm'"
      :class="actionClass"
      :style="actionStyle"
      @click="$emit('action')"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <component v-if="actionIcon" :is="actionIcon" class="h-4 w-4 mr-2" />
      {{ actionLabel }}
    </Button>
  </div>
</template>

<script setup>
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  iconClass: {
    type: String,
    default: '',
  },
  iconBgClass: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '',
  },
  actionIcon: {
    type: [Object, Function],
    default: null,
  },
  actionVariant: {
    type: String,
    default: 'default',
  },
  actionSize: {
    type: String,
    default: 'sm',
  },
  actionClass: {
    type: String,
    default: '',
  },
  actionStyle: {
    type: Object,
    default: () => ({}),
  },
  actionHoverColor: {
    type: String,
    default: '',
  },
  containerClass: {
    type: String,
    default: '',
  },
})

const theme = useThemeClasses()

const handleMouseEnter = e => {
  if (props.actionHoverColor && props.actionStyle?.backgroundColor) {
    e.target.style.backgroundColor = props.actionHoverColor
  }
}

const handleMouseLeave = e => {
  if (props.actionStyle?.backgroundColor) {
    e.target.style.backgroundColor = props.actionStyle.backgroundColor
  }
}

defineEmits(['action'])
</script>
