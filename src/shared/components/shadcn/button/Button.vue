<script setup>
import { computed, useAttrs, useSlots } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/shared/lib/utils'
import { buttonVariants } from '.'
import { Loader2 } from 'lucide-vue-next'

const emit = defineEmits(['click'])

const props = defineProps({
  as: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'default',
    validator: value =>
      [
        'default',
        'accent',
        'primary',
        'destructive',
        'success',
        'warning',
        'outline',
        'secondary',
        'ghost',
        'link',
      ].includes(value),
  },
  size: {
    type: String,
    default: 'default',
  },
  class: {
    type: String,
    default: '',
  },
  asChild: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingLabel: {
    type: String,
    default: 'Loading...',
  },
  icon: {
    type: [Object, String],
    default: null,
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: value => ['left', 'right'].includes(value),
  },
})

const attrs = useAttrs()
const slots = useSlots()

const buttonClasses = computed(() => {
  return cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)
})

const isDisabled = computed(() => {
  return props.loading || attrs.disabled
})

const isIconButton = computed(() => {
  return props.size === 'icon' || props.size === 'icon-sm' || props.size === 'icon-lg'
})

const isIconOnly = computed(() => {
  if (!isIconButton.value) return false
  const hasSlotContent = !!slots.default
  const hasOnlyIcon = !hasSlotContent && props.icon && !props.loadingLabel
  return !hasSlotContent || hasOnlyIcon
})
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="buttonClasses"
    :disabled="isDisabled"
    v-bind="$attrs"
    @click="emit('click', $event)"
  >
    <template v-if="isIconOnly">
      <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
      <component :is="icon" v-else-if="icon" class="h-4 w-4" />
      <slot v-else />
    </template>
    <template v-else>
      <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
      <component :is="icon" v-else-if="icon && iconPosition === 'left'" class="h-4 w-4" />
      <span v-if="loading">{{ loadingLabel }}</span>
      <slot v-else />
      <component
        :is="icon"
        v-if="icon && iconPosition === 'right' && !loading"
        class="ml-2 h-4 w-4"
      />
    </template>
  </Primitive>
</template>
