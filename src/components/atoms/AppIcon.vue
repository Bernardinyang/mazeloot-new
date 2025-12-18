<template>
  <div
    :class="[
      'rounded-xl flex items-center justify-center relative',
      'transition-all duration-300 hover:scale-105',
      containerClass,
      size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-8 w-8' : 'h-16 w-16',
    ]"
  >
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
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute"
      >
        <path
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          class="dark:fill-gray-800 light:fill-gray-200"
          stroke="currentColor"
          stroke-width="1.5"
          :class="theme.iconTextColor"
        />
        <path
          d="M22 6l-10 7L2 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          :class="theme.iconTextColor"
        />
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
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="url(#photosGradient)" />
        <defs>
          <linearGradient id="photosGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: #ff3b30" />
            <stop offset="16.66%" style="stop-color: #ff9500" />
            <stop offset="33.33%" style="stop-color: #ffcc00" />
            <stop offset="50%" style="stop-color: #34c759" />
            <stop offset="66.66%" style="stop-color: #007aff" />
            <stop offset="83.33%" style="stop-color: #5856d6" />
            <stop offset="100%" style="stop-color: #af52de" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="6" fill="white" opacity="0.3" />
        <circle cx="12" cy="12" r="3" fill="white" opacity="0.5" />
      </svg>
    </template>

    <!-- Mail Custom -->
    <template v-else-if="customType === 'mail'">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          fill="#007AFF"
          stroke="currentColor"
          stroke-width="1.5"
          :class="theme.iconTextColor"
        />
        <path
          d="M22 6l-10 7L2 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          :class="theme.iconTextColor"
        />
      </svg>
    </template>

    <!-- Contacts Custom -->
    <template v-else-if="customType === 'contacts'">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="8"
          r="4"
          class="dark:fill-gray-600 light:fill-gray-400"
          stroke="currentColor"
          stroke-width="0.5"
          :class="theme.iconTextColor"
        />
        <path
          d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          :class="theme.iconTextColor"
        />
      </svg>
      <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 flex flex-col gap-0.5">
        <div class="w-1 h-3 bg-green-500 rounded"></div>
        <div class="w-1 h-3 bg-orange-500 rounded"></div>
        <div class="w-1 h-3 bg-blue-500 rounded"></div>
      </div>
    </template>

    <!-- Drive Custom -->
    <template v-else-if="customType === 'drive'">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 6h16v12H4V6z" fill="#007AFF" />
        <path
          d="M4 6l8-4 8 4"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="theme.iconTextColor"
        />
        <path
          d="M4 6v12h16V6"
          stroke="currentColor"
          stroke-width="1.5"
          :class="theme.iconTextColor"
        />
      </svg>
    </template>

    <!-- Memora - Photo Gallery -->
    <template v-else-if="customType === 'memora'">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative z-10 drop-shadow-lg"
      >
        <defs>
          <linearGradient id="memoraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: #6366f1; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #5b5ff0; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #4f46e5; stop-opacity: 1" />
          </linearGradient>
          <linearGradient id="memoraHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.3); stop-opacity: 1" />
            <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0); stop-opacity: 0" />
          </linearGradient>
          <filter id="memoraShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <!-- Main shape with 3D effect -->
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          fill="url(#memoraGradient)"
          filter="url(#memoraShadow)"
        />
        <!-- Highlight for 3D depth -->
        <rect x="3" y="3" width="18" height="9" rx="3" fill="url(#memoraHighlight)" />
        <!-- Inner content -->
        <circle cx="9" cy="9" r="2" fill="white" opacity="0.95" />
        <path
          d="M21 15l-5-5L7 19l-4-4"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.95"
        />
      </svg>
    </template>

    <!-- Connect Stream - Community/Newsfeed -->
    <template v-else-if="customType === 'connect-stream'">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative z-10 drop-shadow-lg"
      >
        <defs>
          <radialGradient id="connectStreamGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color: #10b981; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #059669; stop-opacity: 1" />
          </radialGradient>
          <linearGradient id="connectStreamHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.3); stop-opacity: 1" />
            <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0); stop-opacity: 0" />
          </linearGradient>
          <filter id="connectStreamShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="url(#connectStreamGradient)"
          filter="url(#connectStreamShadow)"
        />
        <ellipse cx="12" cy="8" rx="8" ry="4" fill="url(#connectStreamHighlight)" />
        <circle cx="8" cy="10" r="1.5" fill="white" opacity="0.95" />
        <circle cx="12" cy="10" r="1.5" fill="white" opacity="0.95" />
        <circle cx="16" cy="10" r="1.5" fill="white" opacity="0.95" />
        <path
          d="M6 14h12M6 17h12M6 20h8"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          opacity="0.95"
        />
      </svg>
    </template>

    <!-- Creator IQ - Analytics Creative -->
    <template v-else-if="customType === 'creator-iq'">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative z-10 drop-shadow-lg"
      >
        <defs>
          <linearGradient id="creatorIqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: #8b5cf6; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #7c3aed; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #6d28d9; stop-opacity: 1" />
          </linearGradient>
          <linearGradient id="creatorIqHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.3); stop-opacity: 1" />
            <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0); stop-opacity: 0" />
          </linearGradient>
          <filter id="creatorIqShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          fill="url(#creatorIqGradient)"
          filter="url(#creatorIqShadow)"
        />
        <rect x="3" y="3" width="18" height="9" rx="3" fill="url(#creatorIqHighlight)" />
        <path
          d="M7 18l4-6 4 4 4-8"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.95"
        />
        <circle cx="7" cy="18" r="1.5" fill="white" opacity="0.95" />
        <circle cx="11" cy="12" r="1.5" fill="white" opacity="0.95" />
        <circle cx="15" cy="16" r="1.5" fill="white" opacity="0.95" />
        <circle cx="19" cy="10" r="1.5" fill="white" opacity="0.95" />
      </svg>
    </template>

    <!-- Gear Hub - Marketplace/Rental -->
    <template v-else-if="customType === 'gear-hub'">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative z-10 drop-shadow-lg"
      >
        <defs>
          <radialGradient id="gearHubGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color: #f59e0b; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #f97316; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #d97706; stop-opacity: 1" />
          </radialGradient>
          <radialGradient id="gearHubHighlight" cx="30%" cy="30%" r="40%">
            <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.4); stop-opacity: 1" />
            <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0); stop-opacity: 0" />
          </radialGradient>
          <filter id="gearHubShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#gearHubGradient)" filter="url(#gearHubShadow)" />
        <circle cx="12" cy="12" r="10" fill="url(#gearHubHighlight)" />
        <path
          d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.53 15.53l2.83 2.83M5.64 18.36l2.83-2.83M15.53 8.47l2.83-2.83"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          opacity="0.95"
        />
        <circle cx="12" cy="12" r="3" fill="white" opacity="0.3" />
      </svg>
    </template>

    <!-- Vendor IQ - Analytics Marketplace -->
    <template v-else-if="customType === 'vendor-iq'">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative z-10 drop-shadow-lg"
      >
        <defs>
          <linearGradient id="vendorIqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: #ec4899; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #e91e63; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #db2777; stop-opacity: 1" />
          </linearGradient>
          <linearGradient id="vendorIqHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.3); stop-opacity: 1" />
            <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0); stop-opacity: 0" />
          </linearGradient>
          <filter id="vendorIqShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          fill="url(#vendorIqGradient)"
          filter="url(#vendorIqShadow)"
        />
        <rect x="3" y="3" width="18" height="9" rx="3" fill="url(#vendorIqHighlight)" />
        <rect x="6" y="7" width="12" height="2" rx="1" fill="white" opacity="0.95" />
        <rect x="6" y="11" width="9" height="2" rx="1" fill="white" opacity="0.95" />
        <rect x="6" y="15" width="10" height="2" rx="1" fill="white" opacity="0.95" />
        <circle cx="17" cy="8" r="1.5" fill="white" opacity="0.95" />
        <circle cx="17" cy="12" r="1.5" fill="white" opacity="0.95" />
        <circle cx="17" cy="16" r="1.5" fill="white" opacity="0.95" />
      </svg>
    </template>

    <!-- GigFinder - Job Listing -->
    <template v-else-if="customType === 'gig-finder'">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative z-10 drop-shadow-lg"
      >
        <defs>
          <linearGradient id="gigFinderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: #3b82f6; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #2563eb; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #1d4ed8; stop-opacity: 1" />
          </linearGradient>
          <linearGradient id="gigFinderHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.3); stop-opacity: 1" />
            <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0); stop-opacity: 0" />
          </linearGradient>
          <filter id="gigFinderShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
          fill="url(#gigFinderGradient)"
          filter="url(#gigFinderShadow)"
        />
        <path d="M4 7h16v4H4z" fill="url(#gigFinderHighlight)" />
        <path
          d="M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2H8V5z"
          fill="url(#gigFinderGradient)"
          opacity="0.8"
        />
        <rect x="7" y="12" width="10" height="1.5" rx="0.75" fill="white" opacity="0.95" />
        <rect x="7" y="15" width="7" height="1.5" rx="0.75" fill="white" opacity="0.95" />
        <rect x="7" y="18" width="8" height="1.5" rx="0.75" fill="white" opacity="0.95" />
      </svg>
    </template>

    <!-- Profolio - Services/Portfolio -->
    <template v-else-if="customType === 'profolio'">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative z-10 drop-shadow-lg"
      >
        <defs>
          <linearGradient id="profolioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: #14b8a6; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #0d9488; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #0f766e; stop-opacity: 1" />
          </linearGradient>
          <linearGradient id="profolioHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.3); stop-opacity: 1" />
            <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0); stop-opacity: 0" />
          </linearGradient>
          <filter id="profolioShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="3"
          fill="url(#profolioGradient)"
          filter="url(#profolioShadow)"
        />
        <rect x="4" y="4" width="16" height="8" rx="3" fill="url(#profolioHighlight)" />
        <path
          d="M4 8h16M8 4v4M16 4v4"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          opacity="0.95"
        />
        <circle cx="9" cy="13" r="1.5" fill="white" opacity="0.95" />
        <circle cx="15" cy="13" r="1.5" fill="white" opacity="0.95" />
        <path d="M9 17h6" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.95" />
        <path
          d="M12 20v-3"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          opacity="0.95"
        />
      </svg>
    </template>
  </div>
</template>

<script setup>
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

defineProps({
  icon: {
    type: Object,
    default: undefined,
  },
  iconClass: {
    type: String,
    default: undefined,
  },
  containerClass: {
    type: String,
    default: undefined,
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value),
  },
  customType: {
    type: String,
    default: undefined,
    validator: value =>
      !value ||
      [
        'calendar',
        'notes',
        'reminders',
        'invites',
        'photos',
        'mail',
        'contacts',
        'drive',
        'memora',
        'connect-stream',
        'creator-iq',
        'gear-hub',
        'vendor-iq',
        'gig-finder',
        'profolio',
      ].includes(value),
  },
})
</script>
