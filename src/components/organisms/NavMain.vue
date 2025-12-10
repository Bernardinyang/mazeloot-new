<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/shadcn/sidebar'
import { RouterLink } from 'vue-router'
import type { NavItem } from '@/types/navigation'
import { useNavigation } from '@/composables/useNavigation'

const props = withDefaults(
  defineProps<{
    items: NavItem[]
    label?: string
  }>(),
  {
    label: 'Main',
  }
)

const { isActiveRoute, route } = useNavigation()

// Check if an item is label-only (only has title, no navigation properties)
const isLabelOnly = (item: NavItem): boolean => {
  return !item.name && !item.url && !item.icon && (!item.items || item.items.length === 0)
}

// Check if an item or any of its children is active
const isItemActive = (item: NavItem): boolean => {
  // Check if the item itself is active
  if (isActiveRoute(item.url, item.name)) {
    return true
  }

  // Check if any child item is active
  if (item.items && item.items.length > 0) {
    return item.items.some(subItem => isActiveRoute(subItem.url, subItem.name))
  }

  return false
}

// Check if a collapsible should be open (if item or any child is active)
const shouldBeOpen = (item: NavItem): boolean => {
  return isItemActive(item)
}

// Initialize open states for all collapsible items
const initializeOpenStates = () => {
  const states: Record<string, boolean> = {}
  props.items.forEach(item => {
    if (item.items && item.items.length > 0) {
      states[item.title] = shouldBeOpen(item)
    }
  })
  return states
}

// Track open state for each collapsible item
const openStates = ref<Record<string, boolean>>(initializeOpenStates())

// Watch route changes and update open states reactively
watch(
  () => route.path,
  () => {
    props.items.forEach(item => {
      if (item.items && item.items.length > 0) {
        // Update open state based on whether item or any child is active
        openStates.value[item.title] = shouldBeOpen(item)
      }
    })
  },
  { immediate: true }
)

// Group items by labels
const groupedItems = computed(() => {
  const groups: Array<{ label: string; items: NavItem[] }> = []
  let currentGroup: { label: string; items: NavItem[] } | null = null

  for (const item of props.items) {
    if (isLabelOnly(item)) {
      // Start a new group
      if (currentGroup) {
        groups.push(currentGroup)
      }
      currentGroup = { label: item.title, items: [] }
    } else {
      // Add to current group or create default group
      if (!currentGroup) {
        currentGroup = { label: props.label, items: [] }
      }
      currentGroup.items.push(item)
    }
  }

  // Push the last group
  if (currentGroup) {
    groups.push(currentGroup)
  }

  return groups.length > 0 ? groups : [{ label: props.label, items: props.items }]
})
</script>

<template>
  <template v-for="(group, groupIndex) in groupedItems" :key="`group-${groupIndex}`">
    <SidebarGroup>
      <SidebarGroupLabel>{{ group.label }}</SidebarGroupLabel>
      <SidebarMenu>
        <template v-for="item in group.items" :key="item.title">
          <!-- Items with sub-items: Collapsible -->
          <Collapsible
            v-if="item.items && item.items.length > 0"
            as-child
            v-model:open="openStates[item.title]"
            class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton :tooltip="item.title">
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                  <ChevronRight
                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                    <SidebarMenuSubButton as-child size="sm">
                      <RouterLink
                        :to="subItem.name ? { name: subItem.name } : subItem.url || '#'"
                        :class="{
                          'bg-sidebar-accent text-sidebar-accent-foreground': isActiveRoute(
                            subItem.url,
                            subItem.name
                          ),
                        }"
                      >
                        <span>{{ subItem.title }}</span>
                      </RouterLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <!-- Items without sub-items: Direct link -->
          <SidebarMenuItem v-else>
            <SidebarMenuButton as-child :tooltip="item.title">
              <RouterLink
                :to="item.name ? { name: item.name } : item.url || '#'"
                :class="{
                  'bg-sidebar-accent text-sidebar-accent-foreground': isActiveRoute(
                    item.url,
                    item.name
                  ),
                }"
              >
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </template>
      </SidebarMenu>
    </SidebarGroup>
  </template>
</template>
