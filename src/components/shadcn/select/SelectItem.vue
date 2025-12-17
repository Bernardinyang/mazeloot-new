<script setup>
import { computed, inject, ref } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { CheckIcon } from '@radix-icons/vue'
import { SelectItem, SelectItemIndicator, SelectItemText, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  value: String,
  disabled: Boolean,
  label: String,
  class: String,
})

const delegatedProps = reactiveOmit(props, 'class', 'label')

const forwardedProps = useForwardProps(delegatedProps)

const theme = useThemeClasses()

// Get search query from parent SelectContent
const searchQuery = inject('selectSearchQuery', ref(''))

// Filter items based on search query
const isVisible = computed(() => {
  if (!searchQuery.value) return true
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return true

  // Use label prop if provided, otherwise fall back to value
  const textToSearch = (props.label || String(props.value || '')).toLowerCase()
  return textToSearch.includes(query)
})
</script>

<template>
  <SelectItem
    v-if="isVisible"
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        theme.textPrimary,
        theme.bgButtonHover,
        props.class
      )
    "
  >
    <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicator>
        <CheckIcon class="h-4 w-4" />
      </SelectItemIndicator>
    </span>

    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
