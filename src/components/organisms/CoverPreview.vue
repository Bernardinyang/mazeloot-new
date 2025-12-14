<template>
  <div class="w-full h-full relative overflow-hidden">
    <!-- 1. Modern - Geometric accents -->
    <div
      v-if="type === 'modern'"
      class="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative"
    >
      <div class="absolute top-2 left-2 w-2 h-2 rounded-full bg-teal-500/30"></div>
      <div class="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-teal-500/20"></div>
      <div class="absolute top-3 right-3 w-1.5 h-1.5 bg-teal-500/40 rotate-45"></div>
      <span class="text-[8px] font-bold text-gray-900 dark:text-white z-10">TITLE</span>
    </div>

    <!-- 2. Elegant - Frame -->
    <div
      v-else-if="type === 'elegant'"
      class="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center relative p-1.5"
    >
      <div class="absolute inset-1 border-2 border-teal-500/50 rounded-lg"></div>
      <span class="text-[7px] font-semibold text-gray-800 dark:text-white z-10">TITLE</span>
    </div>

    <!-- 3. Bold - Horizontal lines -->
    <div
      v-else-if="type === 'bold'"
      class="w-full h-full bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center relative"
    >
      <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-teal-500 -translate-y-3"></div>
      <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-teal-500 translate-y-3"></div>
      <span class="text-[8px] font-black text-gray-900 dark:text-white z-10">TITLE</span>
    </div>

    <!-- 4. Asymmetric - Left aligned with accent -->
    <div
      v-else-if="type === 'asymmetric'"
      class="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 relative"
    >
      <div class="absolute left-0 top-1/2 w-1 h-4 bg-teal-500 -translate-y-1/2"></div>
      <div class="absolute bottom-2 left-2 w-8 h-0.5 bg-teal-500"></div>
      <span class="absolute bottom-1 left-2 text-[7px] font-semibold text-gray-900 dark:text-white"
        >TITLE</span
      >
    </div>

    <!-- Left - Title on left side -->
    <div
      v-else-if="type === 'left'"
      class="w-full h-full bg-gradient-to-br from-sky-200 to-blue-300 dark:from-sky-800 dark:to-blue-900 relative"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-black/20"></div>
      <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[7px] font-bold text-white z-10"
        >TITLE</span
      >
    </div>

    <!-- Center - Title centered -->
    <div
      v-else-if="type === 'center'"
      class="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300 dark:from-amber-800 dark:to-orange-900 relative"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-black/20"></div>
      <span
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] font-bold text-white z-10"
        >TITLE</span
      >
    </div>

    <!-- Novel - Title bottom center -->
    <div
      v-else-if="type === 'novel'"
      class="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900 dark:to-yellow-800 relative"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-black/10"></div>
      <span
        class="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] font-semibold text-white z-10"
        >TITLE</span
      >
    </div>

    <!-- Vintage - Title bottom center -->
    <div
      v-else-if="type === 'vintage'"
      class="w-full h-full bg-gradient-to-br from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 relative"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-black/15"></div>
      <span
        class="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] font-semibold text-white z-10"
        >TITLE</span
      >
    </div>

    <!-- Stripe - Title on horizontal white stripe -->
    <div
      v-else-if="type === 'stripe'"
      class="w-full h-full bg-gradient-to-br from-blue-200 to-cyan-300 dark:from-blue-800 dark:to-cyan-900 relative"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-black/10"></div>
      <div
        class="absolute top-1/2 left-0 right-0 h-3 bg-white/90 dark:bg-gray-800/90 -translate-y-1/2"
      ></div>
      <span
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] font-bold text-gray-900 dark:text-white z-10"
        >TITLE</span
      >
    </div>

    <!-- Divider - Title on both halves of split -->
    <div v-else-if="type === 'divider'" class="w-full h-full flex relative">
      <div
        class="w-1/2 h-full relative"
        :style="{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=300&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'left',
        }"
      >
        <div class="absolute inset-0 bg-black/20"></div>
        <span
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[6px] font-semibold text-white z-10"
          >TITLE</span
        >
      </div>
      <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white"></div>
      <div
        class="w-1/2 h-full relative"
        :style="{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=300&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'right',
        }"
      >
        <div class="absolute inset-0 bg-black/20"></div>
        <span
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[6px] font-semibold text-white z-10"
          >TITLE</span
        >
      </div>
    </div>

    <!-- Journal - Small image, title below -->
    <div
      v-else-if="type === 'journal'"
      class="w-full h-full bg-white dark:bg-gray-800 flex flex-col relative"
    >
      <div
        class="w-full h-2/3 relative"
        :style="{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      ></div>
      <div class="flex-1 flex items-center justify-center">
        <span class="text-[7px] font-semibold text-gray-900 dark:text-white">TITLE</span>
      </div>
    </div>

    <!-- Stamp - Small image, title below -->
    <div
      v-else-if="type === 'stamp'"
      class="w-full h-full bg-white dark:bg-gray-800 flex flex-col relative"
    >
      <div
        class="w-3/4 h-2/3 mx-auto mt-2 relative rounded-sm overflow-hidden"
        :style="{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=200&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      ></div>
      <div class="flex-1 flex items-center justify-center">
        <span class="text-[7px] font-semibold text-gray-900 dark:text-white">TITLE</span>
      </div>
    </div>

    <!-- 5. Geometric - Shapes -->
    <div
      v-else-if="type === 'geometric'"
      class="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 flex items-center justify-center relative"
    >
      <div class="absolute top-2 left-2 w-3 h-3 bg-teal-500/40 rotate-45"></div>
      <div class="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-teal-500/30"></div>
      <div class="absolute top-3 right-3 w-2 h-2 bg-teal-500/50"></div>
      <span class="text-[8px] font-bold text-gray-900 dark:text-white z-10">TITLE</span>
    </div>

    <!-- 6. Classic - Border -->
    <div
      v-else-if="type === 'classic'"
      class="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center relative"
    >
      <div class="absolute inset-0 border border-teal-500/60"></div>
      <span class="text-[8px] font-semibold text-gray-900 dark:text-white z-10">TITLE</span>
    </div>

    <!-- 7. Split - Vertical divider -->
    <div v-else-if="type === 'split'" class="w-full h-full flex relative">
      <div
        class="w-1/2 h-full bg-gradient-to-br from-rose-200 to-pink-200 dark:from-rose-900 dark:to-pink-900"
      ></div>
      <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-teal-500 -translate-x-1/2"></div>
      <div
        class="w-1/2 h-full bg-gradient-to-br from-violet-200 to-purple-200 dark:from-violet-900 dark:to-purple-900 flex items-center justify-center"
      >
        <span class="text-[7px] font-semibold text-gray-900 dark:text-white">TITLE</span>
      </div>
    </div>

    <!-- 8. Spotlight - Inset frame -->
    <div
      v-else-if="type === 'spotlight'"
      class="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 flex items-center justify-center relative p-2"
    >
      <div class="absolute inset-1.5 border border-teal-500/50 rounded-md"></div>
      <div class="absolute inset-0 bg-teal-500/5 rounded-full blur-xl"></div>
      <span class="text-[7px] font-semibold text-gray-900 dark:text-white z-10">TITLE</span>
    </div>

    <!-- 9. Minimalist - Single line -->
    <div
      v-else-if="type === 'minimalist'"
      class="w-full h-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center relative"
    >
      <span class="text-[8px] font-light text-gray-900 dark:text-white mb-1">TITLE</span>
      <div class="w-6 h-px bg-teal-500"></div>
    </div>

    <!-- 10. Celebration - Sparkles -->
    <div
      v-else-if="type === 'celebration'"
      class="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900 dark:to-rose-900 flex items-center justify-center relative"
    >
      <div class="absolute top-2 left-2 w-1 h-1 bg-teal-500 rounded-full"></div>
      <div class="absolute top-3 right-3 w-1 h-1 bg-teal-500 rounded-full"></div>
      <div class="absolute bottom-2 left-3 w-1 h-1 bg-teal-500 rounded-full"></div>
      <div class="absolute bottom-3 right-2 w-1 h-1 bg-teal-500 rounded-full"></div>
      <span class="text-[8px] font-bold text-gray-900 dark:text-white z-10">TITLE</span>
    </div>

    <!-- 11. Joy - Title with avatar in O, crosses background -->
    <div
      v-else-if="type === 'joy'"
      class="w-full h-full bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <!-- Background crosses pattern -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-2 left-2 w-0.5 h-0.5 bg-red-400 rotate-45"></div>
        <div class="absolute top-3 right-3 w-0.5 h-0.5 bg-red-400 rotate-45"></div>
        <div class="absolute bottom-2 left-4 w-0.5 h-0.5 bg-red-400 rotate-45"></div>
        <div class="absolute bottom-3 right-2 w-0.5 h-0.5 bg-red-400 rotate-45"></div>
        <div class="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-red-400 rotate-45"></div>
      </div>
      <!-- Title with avatar placeholder -->
      <div class="flex items-center gap-1 z-10">
        <span class="text-[6px] font-bold text-red-600 dark:text-red-400">J</span>
        <div class="w-2 h-2 rounded-full bg-teal-500/30 border border-teal-500/50"></div>
        <span class="text-[6px] font-bold text-red-600 dark:text-red-400">Y</span>
      </div>
    </div>

    <!-- 11. Horizon - Bottom left -->
    <div
      v-else-if="type === 'horizon'"
      class="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900 dark:to-blue-900 relative"
    >
      <div class="absolute bottom-2 left-2 w-6 h-0.5 bg-teal-500"></div>
      <span class="absolute bottom-1 left-2 text-[7px] font-semibold text-gray-900 dark:text-white"
        >TITLE</span
      >
    </div>

    <!-- 12. Floating - Top center -->
    <div
      v-else-if="type === 'floating'"
      class="w-full h-full bg-gradient-to-br from-lime-100 to-green-100 dark:from-lime-900 dark:to-green-900 relative"
    >
      <div
        class="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-500/30"
      ></div>
      <div class="absolute top-1.5 left-1/4 w-1 h-1 bg-teal-500/40 rounded-full"></div>
      <div class="absolute top-1.5 right-1/4 w-1 h-1 bg-teal-500/40 rounded-full"></div>
      <span
        class="absolute top-3 left-1/2 -translate-x-1/2 text-[7px] font-semibold text-gray-900 dark:text-white"
        >TITLE</span
      >
    </div>

    <!-- 13. Corner - Top right -->
    <div
      v-else-if="type === 'corner'"
      class="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 relative"
    >
      <div class="absolute top-0 right-0 w-1 h-6 bg-teal-500"></div>
      <span
        class="absolute top-2 right-2 text-[7px] font-semibold text-gray-900 dark:text-white text-right"
        >TITLE</span
      >
    </div>

    <!-- 14. Diagonal - Creative diagonal -->
    <div
      v-else-if="type === 'diagonal'"
      class="w-full h-full bg-gradient-to-br from-fuchsia-100 to-purple-100 dark:from-fuchsia-900 dark:to-purple-900 relative"
    >
      <div class="absolute top-0 left-0 w-3/5 h-2/5 bg-teal-500/20"></div>
      <div class="absolute bottom-2 right-2 w-2 h-2 bg-teal-500/40 rotate-45"></div>
      <span
        class="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-semibold text-gray-900 dark:text-white"
        >TITLE</span
      >
    </div>

    <!-- 15. Layered - Multiple sections -->
    <div v-else-if="type === 'layered'" class="w-full h-full relative">
      <div class="absolute top-0 left-0 right-0 h-2/5 bg-teal-500/20"></div>
      <div class="absolute bottom-0 left-0 right-0 h-2/5 bg-teal-500/30"></div>
      <span
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] font-semibold text-gray-900 dark:text-white z-10"
        >TITLE</span
      >
    </div>

    <!-- 16. Framed - Double frame -->
    <div
      v-else-if="type === 'framed'"
      class="w-full h-full bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900 dark:to-cyan-900 flex items-center justify-center relative p-1"
    >
      <div class="absolute inset-0 border border-teal-500/40"></div>
      <div class="absolute inset-1 border border-teal-500/60"></div>
      <span class="text-[7px] font-semibold text-gray-900 dark:text-white z-10">TITLE</span>
    </div>

    <!-- Frame - White frame at bottom with title -->
    <div
      v-else-if="type === 'frame'"
      class="w-full h-full bg-gradient-to-br from-slate-200 to-gray-300 dark:from-slate-800 dark:to-gray-700 relative"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 px-2 py-1.5">
        <span class="text-[7px] font-semibold text-gray-900 dark:text-white block text-center"
          >TITLE</span
        >
      </div>
    </div>

    <!-- 17. Minimal - Ultra clean -->
    <div
      v-else-if="type === 'minimal'"
      class="w-full h-full bg-white dark:bg-gray-800 flex items-center justify-center"
    >
      <span class="text-[8px] font-light text-gray-900 dark:text-white">TITLE</span>
    </div>

    <!-- 18. Dynamic - Multiple lines -->
    <div
      v-else-if="type === 'dynamic'"
      class="w-full h-full bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 flex items-center justify-center relative"
    >
      <div class="absolute top-1/2 left-0 right-0 h-px bg-teal-500/60 -translate-y-4"></div>
      <div class="absolute top-1/2 left-0 right-0 h-px bg-teal-500/40 -translate-y-2"></div>
      <div class="absolute top-1/2 left-0 right-0 h-px bg-teal-500/40 translate-y-2"></div>
      <div class="absolute top-1/2 left-0 right-0 h-px bg-teal-500/60 translate-y-4"></div>
      <span class="text-[7px] font-bold text-gray-900 dark:text-white z-10">TITLE</span>
    </div>

    <!-- 19. Structured - Vertical lines -->
    <div
      v-else-if="type === 'structured'"
      class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center relative"
    >
      <div class="absolute left-2 top-0 bottom-0 w-0.5 bg-teal-500/50"></div>
      <div class="absolute right-2 top-0 bottom-0 w-0.5 bg-teal-500/50"></div>
      <span class="text-[8px] font-semibold text-gray-900 dark:text-white z-10">TITLE</span>
    </div>

    <!-- 20. Artistic - Creative mixed -->
    <div
      v-else-if="type === 'artistic'"
      class="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 relative"
    >
      <div class="absolute left-0 top-1/2 w-1 h-3 bg-teal-500 -translate-y-1/2"></div>
      <div class="absolute bottom-2 left-2 w-5 h-0.5 bg-teal-500"></div>
      <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500/30"></div>
      <div class="absolute bottom-3 left-3 w-1.5 h-1.5 bg-teal-500/40 rotate-45"></div>
      <span class="absolute bottom-1 left-2 text-[7px] font-semibold text-gray-900 dark:text-white"
        >TITLE</span
      >
    </div>

    <!-- None - Navbar style preview -->
    <div v-else-if="type === 'none'" class="w-full h-full bg-white dark:bg-gray-800 flex flex-col">
      <div class="h-1/3 border-b border-gray-200 dark:border-gray-700 flex items-center px-1">
        <div class="flex-1">
          <div class="h-1.5 w-12 bg-gray-300 dark:bg-gray-600 rounded mb-0.5"></div>
          <div class="h-1 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div class="flex gap-0.5">
          <div class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <span class="text-[6px] text-gray-400 dark:text-gray-500">No Cover</span>
      </div>
    </div>

    <!-- Default fallback -->
    <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      <span class="text-[7px] text-gray-500">TITLE</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: string
}>()
</script>
