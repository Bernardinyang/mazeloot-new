<template>
  <div :class="['h-16 w-16 rounded-xl flex items-center justify-center relative', theme.bgIconContainer, theme.iconBorder, theme.shadowIcon, theme.bgIconHover, containerClass]">
    <!-- Simple Icon -->
    <component v-if="icon && !customType" :is="icon" :class="[iconClass, theme.iconTextColor]" />
    
    <!-- Calendar Custom -->
    <template v-else-if="customType === 'calendar'">
      <div class="text-[8px] font-bold text-red-500 mt-1">TUE</div>
      <div :class="['text-xl font-bold', theme.textPrimary]">9</div>
    </template>
    
    <!-- Notes Custom -->
    <template v-else-if="customType === 'notes'">
        <div class="h-3 bg-yellow-500 rounded-t-xl w-full"></div>
        <div class="flex-1 flex flex-col gap-1 p-2 w-full">
          <div :class="['h-0.5 rounded w-full', theme.borderPrimary]"></div>
          <div :class="['h-0.5 rounded w-3/4', theme.borderPrimary]"></div>
          <div :class="['h-0.5 rounded w-5/6', theme.borderPrimary]"></div>
        </div>
    </template>
    
    <!-- Reminders Custom -->
    <template v-else-if="customType === 'reminders'">
      <div class="flex items-center gap-1.5 w-full">
        <div class="w-2 h-2 rounded-full bg-blue-500"></div>
        <div :class="['h-0.5 rounded flex-1', theme.borderSecondary]"></div>
      </div>
      <div class="flex items-center gap-1.5 w-full">
        <div class="w-2 h-2 rounded-full bg-red-500"></div>
        <div :class="['h-0.5 rounded flex-1', theme.borderSecondary]"></div>
      </div>
      <div class="flex items-center gap-1.5 w-full">
        <div class="w-2 h-2 rounded-full bg-orange-500"></div>
        <div :class="['h-0.5 rounded flex-1', theme.borderSecondary]"></div>
      </div>
    </template>
    
    <!-- Invites Custom -->
    <template v-else-if="customType === 'invites'">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" class="dark:fill-gray-800 light:fill-gray-200" stroke="currentColor" stroke-width="1.5" :class="theme.iconTextColor"/>
        <path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" :class="theme.iconTextColor"/>
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="flex flex-wrap gap-0.5">
          <div class="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
        </div>
      </div>
    </template>
    
    <!-- Photos Custom -->
    <template v-else-if="customType === 'photos'">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="url(#photosGradient)"/>
        <defs>
          <linearGradient id="photosGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF3B30"/>
            <stop offset="16.66%" style="stop-color:#FF9500"/>
            <stop offset="33.33%" style="stop-color:#FFCC00"/>
            <stop offset="50%" style="stop-color:#34C759"/>
            <stop offset="66.66%" style="stop-color:#007AFF"/>
            <stop offset="83.33%" style="stop-color:#5856D6"/>
            <stop offset="100%" style="stop-color:#AF52DE"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="6" fill="white" opacity="0.3"/>
        <circle cx="12" cy="12" r="3" fill="white" opacity="0.5"/>
      </svg>
    </template>
    
    <!-- Mail Custom -->
    <template v-else-if="customType === 'mail'">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#007AFF" stroke="currentColor" stroke-width="1.5" :class="theme.iconTextColor"/>
        <path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" :class="theme.iconTextColor"/>
      </svg>
    </template>
    
    <!-- Contacts Custom -->
    <template v-else-if="customType === 'contacts'">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" class="dark:fill-gray-600 light:fill-gray-400" stroke="currentColor" stroke-width="0.5" :class="theme.iconTextColor"/>
        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" :class="theme.iconTextColor"/>
      </svg>
      <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 flex flex-col gap-0.5">
        <div class="w-1 h-3 bg-green-500 rounded"></div>
        <div class="w-1 h-3 bg-orange-500 rounded"></div>
        <div class="w-1 h-3 bg-blue-500 rounded"></div>
      </div>
    </template>
    
    <!-- Drive Custom -->
    <template v-else-if="customType === 'drive'">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6h16v12H4V6z" fill="#007AFF"/>
        <path d="M4 6l8-4 8 4" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" :class="theme.iconTextColor"/>
        <path d="M4 6v12h16V6" stroke="currentColor" stroke-width="1.5" :class="theme.iconTextColor"/>
      </svg>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

defineProps<{
  icon?: Component
  iconClass?: string
  containerClass?: string
  customType?: 'calendar' | 'notes' | 'reminders' | 'invites' | 'photos' | 'mail' | 'contacts' | 'drive'
}>()
</script>

