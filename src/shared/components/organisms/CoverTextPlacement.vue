<template>
  <div
    class="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
  >
    <!-- Center - TITLE centered -->
    <div v-if="type === 'center'" class="w-full h-full flex items-center justify-center">
      <span class="text-[10px] font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm"
        >TITLE</span
      >
    </div>

    <!-- Joy - Large JOY text with TITLE below -->
    <div
      v-else-if="type === 'joy'"
      class="w-full h-full flex flex-col items-center justify-center p-1"
    >
      <div class="text-[12px] font-black text-red-600 dark:text-red-500 leading-none mb-0.5">
        JOY
      </div>
      <span class="text-[7px] font-bold text-gray-800 dark:text-gray-200">TITLE</span>
    </div>

    <!-- Left - TITLE bottom-left -->
    <div v-else-if="type === 'left'" class="w-full h-full relative">
      <span
        class="absolute bottom-0.5 left-0.5 text-[9px] font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm"
        >TITLE</span
      >
    </div>

    <!-- Novel - TITLE on left side -->
    <div v-else-if="type === 'novel'" class="w-full h-full flex relative">
      <div class="w-1/2 h-full flex items-center pl-0.5">
        <span class="text-[9px] font-bold text-gray-900 dark:text-gray-100">TITLE</span>
      </div>
      <div class="w-1/2 h-full bg-gray-300 dark:bg-gray-600"></div>
    </div>

    <!-- Vintage - TITLE centered at bottom -->
    <div
      v-else-if="type === 'vintage'"
      class="w-full h-full flex flex-col items-center justify-end pb-0.5"
    >
      <span class="text-[9px] font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm mb-0.5"
        >TITLE</span
      >
    </div>

    <!-- Frame - TITLE centered with frame -->
    <div
      v-else-if="type === 'frame'"
      class="w-full h-full flex items-center justify-center relative p-0.5"
    >
      <div class="absolute inset-0.5 border border-gray-600 dark:border-gray-400 rounded-sm"></div>
      <span
        class="text-[9px] font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm z-10 relative"
        >TITLE</span
      >
    </div>

    <!-- Stripe - TITLE with horizontal lines above and below -->
    <div
      v-else-if="type === 'stripe'"
      class="w-full h-full flex flex-col items-center justify-center relative"
    >
      <div
        class="absolute top-1/2 left-0 right-0 h-px bg-gray-600 dark:bg-gray-400 -translate-y-1/2"
      ></div>
      <div
        class="absolute top-1/2 left-0 right-0 h-px bg-gray-600 dark:bg-gray-400 -translate-y-1/2 mt-1.5"
      ></div>
      <span
        class="text-[9px] font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm z-10 relative"
        >TITLE</span
      >
    </div>

    <!-- Divider - TITLE on left side with vertical divider -->
    <div v-else-if="type === 'divider'" class="w-full h-full flex relative">
      <div class="w-1/2 h-full flex items-center justify-center">
        <span
          class="text-[9px] font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm z-10 relative"
          >TITLE</span
        >
      </div>
      <div
        class="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600 dark:bg-gray-400 -translate-x-1/2 z-10"
      ></div>
      <div class="w-1/2 h-full bg-gray-400 dark:bg-gray-700"></div>
    </div>

    <!-- Journal - TITLE on right side -->
    <div v-else-if="type === 'journal'" class="w-full h-full flex relative">
      <div class="w-1/2 h-full bg-gray-300 dark:bg-gray-600"></div>
      <div class="w-1/2 h-full flex items-center justify-end pr-0.5">
        <span class="text-[9px] font-bold text-gray-900 dark:text-gray-100">TITLE</span>
      </div>
    </div>

    <!-- Stamp - TITLE below small square -->
    <div
      v-else-if="type === 'stamp'"
      class="w-full h-full flex flex-col items-center justify-start pt-0.5"
    >
      <div
        class="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-sm mb-0.5 border border-gray-300 dark:border-gray-700"
      ></div>
      <span class="text-[9px] font-bold text-gray-900 dark:text-gray-100">TITLE</span>
    </div>

    <!-- Outline - TITLE in white square outline -->
    <div
      v-else-if="type === 'outline'"
      class="w-full h-full flex items-center justify-center relative"
    >
      <div class="absolute inset-1 border-2 border-white dark:border-gray-200 rounded-sm"></div>
      <span class="text-[9px] font-bold text-white dark:text-gray-100 drop-shadow-sm z-10 relative"
        >TITLE</span
      >
    </div>

    <!-- Classic - TITLE bottom-left with icons bottom-right -->
    <div v-else-if="type === 'classic'" class="w-full h-full relative">
      <span
        class="absolute bottom-0.5 left-0.5 text-[8px] font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm"
        >TITLE</span
      >
      <div class="absolute bottom-0.5 right-0.5 flex gap-0.5">
        <Heart class="w-1.5 h-1.5 text-gray-700 dark:text-gray-300 drop-shadow-sm" />
        <Share2 class="w-1.5 h-1.5 text-gray-700 dark:text-gray-300 drop-shadow-sm" />
        <Download class="w-1.5 h-1.5 text-gray-700 dark:text-gray-300 drop-shadow-sm" />
      </div>
    </div>

    <!-- None - Diagonal line -->
    <div
      v-else-if="type === 'none'"
      class="w-full h-full flex items-center justify-center relative"
    >
      <div class="absolute w-8 h-px bg-gray-400 dark:bg-gray-500 rotate-45"></div>
    </div>

    <!-- More - Three dots -->
    <div v-else-if="type === 'more'" class="w-full h-full flex items-center justify-center">
      <div class="flex flex-col gap-0.5">
        <div class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
        <div class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
        <div class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
      </div>
    </div>

    <!-- Default fallback -->
    <div v-else class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { Heart, Share2, Download } from '@/shared/utils/lucideAnimated'

defineProps({
  type: {
    type: String,
    required: true,
  },
})
</script>
