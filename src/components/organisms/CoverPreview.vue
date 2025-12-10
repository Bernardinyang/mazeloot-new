<template>
  <div class="w-full h-full relative overflow-hidden">
    <!-- Center - Rocky coastline with arch -->
    <div
      v-if="type === 'center'"
      class="w-full h-full bg-gradient-to-br from-slate-500 via-slate-600 to-cyan-600 flex items-center justify-center relative"
    >
      <!-- Arch shape simulation -->
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-6 rounded-t-full bg-slate-400/50"
      ></div>
      <span
        class="text-[9px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 relative"
        >TITLE</span
      >
    </div>

    <!-- Joy - Red JOY text with baby image -->
    <div
      v-else-if="type === 'joy'"
      class="w-full h-full bg-white flex flex-col items-center justify-center relative p-1"
    >
      <div class="text-[10px] font-black text-red-600 leading-tight mb-0.5 tracking-tight">JOY</div>
      <!-- Baby in O -->
      <div
        class="w-4 h-4 rounded-full bg-pink-200 border border-pink-300 mb-0.5 flex items-center justify-center"
      >
        <div class="w-2 h-2 rounded-full bg-pink-400"></div>
      </div>
      <span class="text-[7px] font-semibold text-gray-800">TITLE</span>
    </div>

    <!-- Left - Tropical coastline -->
    <div
      v-else-if="type === 'left'"
      class="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-400 relative"
    >
      <!-- Wave simulation -->
      <div class="absolute bottom-0 left-0 right-0 h-2 bg-cyan-300/50 rounded-t-full"></div>
      <span
        class="absolute bottom-1 left-1 text-[8px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
        >TITLE</span
      >
    </div>

    <!-- Novel - Split with text left, image right -->
    <div v-else-if="type === 'novel'" class="w-full h-full flex relative">
      <div class="w-1/2 h-full bg-white flex items-center pl-1">
        <span class="text-[8px] font-semibold text-gray-900">TITLE</span>
      </div>
      <div
        class="w-1/2 h-full bg-gradient-to-br from-amber-200 via-orange-300 to-amber-400 relative overflow-hidden"
      >
        <!-- Sand dune simulation -->
        <div class="absolute bottom-0 left-0 right-0 h-3 bg-amber-500/30 rounded-t-full"></div>
      </div>
    </div>

    <!-- Vintage - Forest with title below -->
    <div
      v-else-if="type === 'vintage'"
      class="w-full h-full bg-gradient-to-br from-green-700 via-green-800 to-green-900 flex flex-col items-center justify-end pb-1 relative"
    >
      <!-- Tree simulation -->
      <div class="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-green-900"></div>
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-green-600"></div>
      <span
        class="text-[8px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] mb-0.5 relative z-10"
        >TITLE</span
      >
    </div>

    <!-- Frame - Mountains with white frame -->
    <div
      v-else-if="type === 'frame'"
      class="w-full h-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 flex items-center justify-center relative p-1"
    >
      <!-- Mountain peaks simulation -->
      <div class="absolute bottom-1 left-0 right-0 h-2">
        <div class="absolute left-1/4 bottom-0 w-2 h-2 bg-orange-600/50 rotate-45"></div>
        <div class="absolute left-1/2 bottom-0 w-2 h-2 bg-pink-600/50 rotate-45"></div>
        <div class="absolute right-1/4 bottom-0 w-2 h-2 bg-purple-600/50 rotate-45"></div>
      </div>
      <div class="absolute inset-0.5 border border-white rounded-sm"></div>
      <span
        class="text-[8px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 relative"
        >TITLE</span
      >
    </div>

    <!-- Stripe - Valley with horizontal lines -->
    <div
      v-else-if="type === 'stripe'"
      class="w-full h-full bg-gradient-to-br from-green-300 via-emerald-400 to-teal-400 flex flex-col items-center justify-center relative"
    >
      <!-- Stream simulation -->
      <div class="absolute bottom-1 left-0 right-0 h-1 bg-teal-500/50 rounded-full"></div>
      <div class="absolute top-1/2 left-0 right-0 h-px bg-white/80 -translate-y-1/2"></div>
      <div class="absolute top-1/2 left-0 right-0 h-px bg-white/80 -translate-y-1/2 mt-2"></div>
      <span
        class="text-[8px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 relative"
        >TITLE</span
      >
    </div>

    <!-- Divider - Split with vertical line -->
    <div v-else-if="type === 'divider'" class="w-full h-full flex relative">
      <div
        class="w-1/2 h-full bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 flex items-center justify-center relative"
      >
        <!-- Rocky texture -->
        <div class="absolute inset-0 opacity-30">
          <div class="absolute top-1 left-1 w-1 h-1 bg-orange-700 rounded-full"></div>
          <div class="absolute top-2 right-1 w-1 h-1 bg-red-700 rounded-full"></div>
        </div>
        <span
          class="text-[8px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 relative"
          >TITLE</span
        >
      </div>
      <div class="absolute left-1/2 top-0 bottom-0 w-px bg-white -translate-x-1/2 z-10"></div>
      <div class="w-1/2 h-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 relative">
        <!-- Waterfall simulation -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gray-500/50"></div>
      </div>
    </div>

    <!-- Journal - Image left, text right -->
    <div v-else-if="type === 'journal'" class="w-full h-full flex relative">
      <div
        class="w-1/2 h-full bg-gradient-to-br from-cyan-300 via-blue-400 to-teal-400 relative overflow-hidden"
      >
        <!-- River simulation -->
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-cyan-500/50 rounded-t-full"></div>
        <div class="absolute top-1 left-1 w-1 h-1 bg-green-400 rounded-full"></div>
        <div class="absolute top-2 right-1 w-1 h-1 bg-green-500 rounded-full"></div>
      </div>
      <div class="w-1/2 h-full bg-white flex items-center justify-end pr-1">
        <span class="text-[8px] font-semibold text-gray-900">TITLE</span>
      </div>
    </div>

    <!-- Stamp - Small square image at top -->
    <div
      v-else-if="type === 'stamp'"
      class="w-full h-full bg-white flex flex-col items-center justify-start pt-1"
    >
      <div
        class="w-7 h-7 bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 rounded-sm mb-1 border border-gray-200 shadow-sm"
      >
        <!-- Wave simulation -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-cyan-600/50 rounded-b-sm"></div>
      </div>
      <span class="text-[8px] font-semibold text-gray-900">TITLE</span>
    </div>

    <!-- Outline - Waterfall with white square outline -->
    <div
      v-else-if="type === 'outline'"
      class="w-full h-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 flex items-center justify-center relative"
    >
      <!-- Waterfall simulation -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-gray-500/40"></div>
      <div class="absolute inset-1.5 border-2 border-white rounded-sm"></div>
      <span
        class="text-[8px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10 relative"
        >TITLE</span
      >
    </div>

    <!-- Classic - Lake with icons -->
    <div
      v-else-if="type === 'classic'"
      class="w-full h-full bg-gradient-to-br from-blue-200 via-cyan-300 to-blue-400 relative"
    >
      <!-- Mountain reflection simulation -->
      <div class="absolute bottom-0 left-0 right-0 h-2 bg-blue-500/30 rounded-t-full"></div>
      <div class="absolute top-1 left-1 w-1 h-1 bg-white/50 rounded-full"></div>
      <span
        class="absolute bottom-1 left-1 text-[7px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
        >TITLE</span
      >
      <div class="absolute bottom-1 right-1 flex gap-0.5">
        <Heart class="w-1.5 h-1.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        <Share2 class="w-1.5 h-1.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        <Download class="w-1.5 h-1.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
      </div>
    </div>

    <!-- None - Diagonal line -->
    <div
      v-else-if="type === 'none'"
      class="w-full h-full bg-white dark:bg-gray-800 flex items-center justify-center relative"
    >
      <div class="absolute w-10 h-0.5 bg-gray-400 dark:bg-gray-500 rotate-45"></div>
    </div>

    <!-- More - Three dots -->
    <div
      v-else-if="type === 'more'"
      class="w-full h-full bg-white dark:bg-gray-800 flex items-center justify-center"
    >
      <div class="flex flex-col gap-0.5">
        <div class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
        <div class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
        <div class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
      </div>
    </div>

    <!-- Default fallback -->
    <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
  </div>
</template>

<script setup lang="ts">
import { Heart, Share2, Download } from 'lucide-vue-next'

defineProps<{
  type: string
}>()
</script>
