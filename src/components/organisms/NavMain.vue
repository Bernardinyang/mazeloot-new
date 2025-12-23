<script setup>
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
  useSidebar,
} from '@/components/shadcn/sidebar'
import { RouterLink } from 'vue-router'
import { useNavigation } from '@/composables/useNavigation'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: 'Main',
  },
})

const { isActiveRoute, route } = useNavigation()
const { state, isMobile } = useSidebar()
const isCollapsed = computed(() => state === 'collapsed')

const isLabelOnly = item => {
  return !item.name && !item.url && !item.icon && (!item.items || item.items.length === 0)
}

const isItemActive = item => {
  if (isActiveRoute(item.url, item.name)) {
    return true
  }

  if (item.items && item.items.length > 0) {
    return item.items.some(subItem => isActiveRoute(subItem.url, subItem.name))
  }

  return false
}

const shouldBeOpen = item => {
  return isItemActive(item)
}

// Initialize open states for all collapsible items
const initializeOpenStates = () => {
  const states = {}
  ;(props.items || []).forEach(item => {
    if (item.items && item.items.length > 0) {
      states[item.title] = shouldBeOpen(item)
    }
  })
  return states
}

// Track open state for each collapsible item
const openStates = ref(initializeOpenStates())

// Watch route changes and update open states reactively
watch(
  () => route.path,
  () => {
    ;(props.items || []).forEach(item => {
      if (item.items && item.items.length > 0) {
        openStates.value[item.title] = shouldBeOpen(item)
      }
    })
  },
  { immediate: true }
)

// Group items by labels
const groupedItems = computed(() => {
  const groups = []
  let currentGroup = null

  for (const item of props.items || []) {
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

  return groups.length > 0 ? groups : [{ label: props.label, items: props.items || [] }]
})
</script>

<template>
  <template v-for="(group, _groupIndex) in groupedItems" :key="`group-${_groupIndex}`">
    <SidebarGroup>
      <!-- Match shadcn demo: label exists, sidebar styles hide it in collapsed mode -->
      <SidebarGroupLabel>{{ group.label }}</SidebarGroupLabel>
      <SidebarMenu>
        <template v-for="item in group.items" :key="item.title">
          <!-- Items with sub-items -->
          <SidebarMenuItem v-if="item.items && item.items.length > 0">
            <!-- Match shadcn demo: always Collapsible; sub-menu is hidden via sidebar CSS in collapsed mode -->
            <Collapsible v-model:open="openStates[item.title]" as-child class="group/collapsible">
              <div>
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
                          :class="{
                            'bg-sidebar-accent text-sidebar-accent-foreground': isActiveRoute(
                              subItem.url,
                              subItem.name
                            ),
                          }"
                          :to="subItem.name ? { name: subItem.name } : subItem.url || '#'"
                        >
                          <span>{{ subItem.title }}</span>
                        </RouterLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </SidebarMenuItem>

          <!-- Items without sub-items: Direct link -->
          <SidebarMenuItem v-else>
            <SidebarMenuButton :tooltip="item.title" as-child>
              <RouterLink
                :class="{
                  'bg-sidebar-accent text-sidebar-accent-foreground': isActiveRoute(
                    item.url,
                    item.name
                  ),
                }"
                :to="item.name ? { name: item.name } : item.url || '#'"
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
