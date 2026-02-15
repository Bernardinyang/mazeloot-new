<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Cross2Icon } from '@radix-icons/vue'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/shared/lib/utils'

const props = withDefaults(defineProps<DialogContentProps & { class?: HTMLAttributes['class']; hideClose?: boolean }>(), {
  hideClose: false
})
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'hideClose')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      :class="
        cn(
          'dialog-overlay-animate fixed inset-0 z-50 bg-black/80 backdrop-blur-sm will-change-opacity',
          typeof props.class === 'string' && props.class.includes('overlay-z-') ? 'z-[200]' : ''
        )
      "
    />
    <DialogContent
      v-bind="forwarded"
      :class="
        cn(
          'dialog-content-animate fixed left-1/2 top-1/2 z-50 grid w-full max-w-[min(calc(100vw-2rem),calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-2rem))] sm:max-w-lg max-h-[min(90dvh,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1rem))] -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-4 sm:p-6 shadow-lg overflow-y-auto will-change-transform sm:rounded-lg m-[max(0.5rem,env(safe-area-inset-top))] mr-[max(0.5rem,env(safe-area-inset-right))] mb-[max(0.5rem,env(safe-area-inset-bottom))] ml-[max(0.5rem,env(safe-area-inset-left))] sm:m-2',
          props.class
        )
      "
    >
      <slot />

      <DialogClose
        v-if="!hideClose"
        class="absolute right-2 sm:right-4 top-2 sm:top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <Cross2Icon class="w-4 h-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
