<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        :class="[
          theme.textPrimary,
          theme.bgButtonHover,
          'light:hover:text-gray-900 dark:hover:text-gray-100',
          theme.transition,
          'min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 touch-manipulation',
        ]"
        size="icon"
        variant="ghost"
      >
        <Sun v-if="themeStore.effectiveTheme === 'dark'" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent :class="['w-48', theme.bgDropdown, theme.borderSecondary]" align="end">
      <DropdownMenuLabel :class="theme.textPrimary">Theme</DropdownMenuLabel>
      <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
      <DropdownMenuItem
        :class="[
          theme.textPrimary,
          theme.bgButtonHover,
          'cursor-pointer',
          { [theme.bgHover]: themeStore.theme === 'light' },
        ]"
        @click="themeStore.setTheme('light')"
      >
        <Sun class="h-4 w-4" />
        <span>Light</span>
        <Check v-if="themeStore.theme === 'light'" class="ml-auto h-4 w-4" />
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="[
          theme.textPrimary,
          theme.bgButtonHover,
          'cursor-pointer',
          { [theme.bgHover]: themeStore.theme === 'dark' },
        ]"
        @click="themeStore.setTheme('dark')"
      >
        <Moon class="h-4 w-4" />
        <span>Dark</span>
        <Check v-if="themeStore.theme === 'dark'" class="ml-auto h-4 w-4" />
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="[
          theme.textPrimary,
          theme.bgButtonHover,
          'cursor-pointer',
          { [theme.bgHover]: themeStore.theme === 'system' },
        ]"
        @click="themeStore.setTheme('system')"
      >
        <Monitor class="h-4 w-4" />
        <span>System</span>
        <Check v-if="themeStore.theme === 'system'" class="ml-auto h-4 w-4" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { Check, Monitor, Moon, Sun } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu/index'
import { useThemeStore } from '@/shared/stores/theme'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const themeStore = useThemeStore()
const theme = useThemeClasses()
</script>
