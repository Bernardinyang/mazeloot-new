<script setup>
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/shadcn/button'
import { Sheet, SheetContent } from '@/shared/components/shadcn/sheet'
import { SIDEBAR_WIDTH_MOBILE, useSidebar } from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  side: {
    type: String,
    default: 'left',
  },
  variant: {
    type: String,
    default: 'sidebar',
  },
  collapsible: {
    type: String,
    default: 'offcanvas',
  },
  class: {
    type: String,
    default: '',
  },
})

const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
</script>

<template>
  <div
    v-if="props.collapsible === 'none'"
    :class="
      cn('flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground', props.class)
    "
    v-bind="$attrs"
  >
    <slot />
  </div>

  <Sheet v-else-if="isMobile" :open="openMobile" v-bind="$attrs" @update:open="setOpenMobile">
    <SheetContent
      data-sidebar="sidebar"
      data-mobile="true"
      :side="props.side"
      class="w-[--sidebar-width] max-w-[min(18rem,100vw-2rem)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
      :style="{
        '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
      }"
    >
      <div class="flex h-full w-full flex-col overflow-y-auto overscroll-contain">
        <div class="sticky top-0 z-10 flex shrink-0 items-center justify-end border-b border-sidebar-border bg-sidebar px-2 pt-[env(safe-area-inset-top)] pb-2">
          <Button
            variant="ghost"
            size="icon"
            class="min-h-[44px] min-w-[44px] touch-manipulation -mr-1"
            aria-label="Close menu"
            @click="setOpenMobile(false)"
          >
            <span class="sr-only">Close menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>
        <div class="flex-1 min-h-0 pb-[env(safe-area-inset-bottom)]">
          <slot />
        </div>
      </div>
    </SheetContent>
  </Sheet>

  <div
    v-else
    class="group peer hidden md:block"
    :data-state="state"
    :data-collapsible="state === 'collapsed' ? props.collapsible : 'none'"
    :data-variant="props.variant"
    :data-side="props.side"
  >
    <!-- This is what handles the sidebar gap on desktop  -->
    <div
      :class="
        cn(
          'duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          props.variant === 'floating' || props.variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
        )
      "
    />
    <div
      :class="
        cn(
          'duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex',
          props.side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          props.variant === 'floating' || props.variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+_2px)]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
          props.class
        )
      "
      v-bind="$attrs"
    >
      <div
        data-sidebar="sidebar"
        class="flex h-full w-full flex-col text-sidebar-foreground bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
