<template>
  <Sidebar collapsible="icon" variant="inset">
    <SidebarHeader>
      <div
        :class="[
          'px-3 py-4 flex items-center justify-center dark:border-b rounded-lg',
          'group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3',
          theme.bgCard,
          theme.borderPrimary,
          'bg-sidebar-background',
        ]"
      >
        <MazelootLogo
          :show-text="state !== 'collapsed'"
          :use-favicon="state === 'collapsed'"
          class="group-data-[collapsible=icon]:scale-95"
          size="md"
        />
      </div>
      <div
        :class="[
          'py-2 px-3',
          {
            'py-2': state === 'collapsed',
          },
        ]"
        class="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-lg mx-2"
      >
        <div
          :class="[
            'flex items-center gap-2 px-2 py-1.5 rounded-md',
            'bg-white/10 dark:bg-white/5',
            'backdrop-blur-sm',
          ]"
        >
          <Shield class="h-4 w-4 text-white shrink-0" />
          <span
            v-if="state !== 'collapsed'"
            class="text-xs font-medium text-white"
          >
            Admin Panel
          </span>
        </div>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          <template v-for="item in navItems" :key="item.name">
            <!-- Items with children -->
            <SidebarMenuItem v-if="item.children && item.children.length > 0">
              <Collapsible v-model:open="openStates[item.name]" as-child class="group/collapsible">
                <div>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton>
                      <component :is="getIcon(item.icon)" class="h-5 w-5 shrink-0" />
                      <span>{{ item.label }}</span>
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem v-for="child in item.children" :key="child.name">
                        <SidebarMenuSubButton as-child size="sm">
                          <router-link
                            :to="child.to"
                            :class="{
                              'bg-sidebar-accent text-sidebar-accent-foreground': isActive(child.to),
                            }"
                          >
                            <span>{{ child.label }}</span>
                          </router-link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </SidebarMenuItem>

            <!-- Items without children -->
            <SidebarMenuItem v-else>
              <SidebarMenuButton
                :as-child="true"
                :is-active="isActive(item.to)"
              >
                <router-link
                  :to="item.to"
                  class="flex items-center gap-3"
                >
                  <component :is="getIcon(item.icon)" class="h-5 w-5 shrink-0" />
                  <span>{{ item.label }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </template>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <NavUser :user="userData" />
    </SidebarFooter>
  </Sidebar>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import NavUser from '@/shared/components/organisms/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/shared/components/shadcn/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/shadcn/collapsible'
import {
  LayoutDashboard,
  Users,
  Package,
  Star,
  BarChart3,
  Shield,
  FileText,
  User,
  ChevronRight,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Sparkles,
  CreditCard,
  Mail,
  ClipboardList,
  Heart,
  Server,
  AlertTriangle,
  HelpCircle,
} from 'lucide-vue-next'

const props = defineProps({
  navItems: {
    type: Array,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
  },
})

const route = useRoute()
const theme = useThemeClasses()
const { state } = useSidebar()

const iconMap = {
  LayoutDashboard,
  Users,
  Package,
  Star,
  BarChart3,
  FileText,
  User,
  Shield,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Sparkles,
  CreditCard,
  Mail,
  ClipboardList,
  Heart,
  Server,
  AlertTriangle,
  HelpCircle,
}

const getIcon = (iconName) => {
  return iconMap[iconName] || LayoutDashboard
}

const openStates = ref({ memora: true })

const isActive = (to) => {
  if (!to) return false
  if (typeof to === 'string') {
    return route.path === to
  }
  return route.name === to?.name
}
</script>
