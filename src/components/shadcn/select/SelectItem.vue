<script setup lang="ts">
import { computed, inject } from 'vue'
import type { SelectItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { CheckIcon } from '@radix-icons/vue'
import { SelectItem, SelectItemIndicator, SelectItemText, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class']; label?: string }>()

const delegatedProps = reactiveOmit(props, 'class', 'label')

const forwardedProps = useForwardProps(delegatedProps)

// Get search query from parent SelectContent
const searchQuery = inject<{ value: string }>('selectSearchQuery', { value: '' })

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
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
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
