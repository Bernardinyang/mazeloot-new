<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" :class="[theme.textPrimary, theme.bgButtonHover, theme.transition]">
        <Sun v-if="themeStore.effectiveTheme === 'dark'" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" :class="['w-48', theme.bgDropdown, theme.borderSecondary]">
      <DropdownMenuLabel :class="theme.textPrimary">Theme</DropdownMenuLabel>
      <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
      <DropdownMenuItem
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer', { [theme.bgHover]: themeStore.theme === 'light' }]"
        @click="themeStore.setTheme('light')"
      >
        <Sun class="mr-2 h-4 w-4" />
        <span>Light</span>
        <Check v-if="themeStore.theme === 'light'" class="ml-auto h-4 w-4" />
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer', { [theme.bgHover]: themeStore.theme === 'dark' }]"
        @click="themeStore.setTheme('dark')"
      >
        <Moon class="mr-2 h-4 w-4" />
        <span>Dark</span>
        <Check v-if="themeStore.theme === 'dark'" class="ml-auto h-4 w-4" />
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer', { [theme.bgHover]: themeStore.theme === 'system' }]"
        @click="themeStore.setTheme('system')"
      >
        <Monitor class="mr-2 h-4 w-4" />
        <span>System</span>
        <Check v-if="themeStore.theme === 'system'" class="ml-auto h-4 w-4" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Sun, Moon, Monitor, Check } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu/index'
import { useThemeStore } from '@/stores/theme'
import { useThemeClasses } from '@/composables/useThemeClasses'

const themeStore = useThemeStore()
const theme = useThemeClasses()
</script>

