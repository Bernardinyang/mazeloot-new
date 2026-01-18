<template>
  <div
    :style="{
      '--index': index,
      '--card-color': cardColor,
      '--card-color-light': cardColorLight,
      '--card-color-dark': cardColorDark,
      borderColor: `${cardColor}33`,
    }"
    :class="[
      'group relative rounded-xl overflow-hidden',
      'transform-gpu transition-all duration-300',
      isDeleting
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1',
      'border-2 hover:border-opacity-100',
      theme.bgCard,
      theme.shadowCard,
    ]"
    @click="!isDeleting && $emit('click', project)"
    @mouseenter="!isDeleting && (isHovering = true)"
    @mouseleave="isHovering = false"
    tabindex="0"
    role="button"
  >
    <!-- Loading Overlay -->
    <div
      v-if="isDeleting"
      class="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl"
    >
      <div class="flex flex-col items-center gap-2">
        <Loader2 class="h-8 w-8 animate-spin text-white" />
        <span class="text-sm font-medium text-white">Deleting...</span>
      </div>
    </div>
    <!-- Project-specific gradient background (only shown when no preview images) -->
    <div
      v-if="!hasPreviewImages"
      :style="{
        background: `linear-gradient(to bottom right, ${cardColorLight}, ${cardColorDark})`,
        opacity: '0.6',
      }"
      class="absolute inset-0 dark:opacity-40"
    ></div>

    <!-- Image/Icon Container -->
    <div class="relative aspect-[4/3] flex items-center justify-center overflow-hidden">
      <!-- Lock Icon (top left) -->
      <div class="absolute top-3 left-3 z-30 flex items-center gap-2">
        <div
          v-if="project.hasPassword || project.password"
          class="flex items-center justify-center w-7 h-7 rounded-full bg-gray-600/90 dark:bg-gray-500/90 backdrop-blur-sm shadow-lg"
          title="Password protected"
        >
          <Lock class="h-4 w-4 fill-white text-white" />
        </div>
      </div>

      <!-- Starred Badge Indicator (bottom left) -->
      <div class="absolute bottom-3 left-3 z-30">
        <div
          v-if="project.isStarred || project.starred"
          class="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400/90 dark:bg-yellow-500/90 backdrop-blur-sm shadow-lg"
          title="Starred"
        >
          <Star class="h-4 w-4 fill-white text-white" />
        </div>
      </div>

      <!-- Preview Images Grid (2x2) -->
      <div
        v-if="hasPreviewImages"
        class="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 bg-gray-200/50 dark:bg-gray-800/50 p-0.5 relative"
      >
        <!-- Subtle color overlay for brand consistency -->
        <div
          :style="{
            background: `linear-gradient(to bottom right, ${cardColor}15, transparent)`,
          }"
          class="absolute inset-0 pointer-events-none z-10"
        ></div>
        <div
          v-for="(preview, index) in previewGrid"
          :key="index"
          class="relative bg-gray-100 dark:bg-gray-800 overflow-hidden group/preview transition-all duration-300"
          :class="preview ? 'hover:brightness-110' : ''"
        >
          <img
            v-if="preview"
            :src="preview"
            :alt="`Preview ${index + 1}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover/preview:scale-105"
            loading="lazy"
            @error="handleImageError($event)"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <div
              class="w-8 h-8 rounded border-2 border-dashed"
              :class="theme.borderSecondary"
            ></div>
          </div>
        </div>
      </div>

      <!-- Gradient overlay when preview images are present for better contrast -->
      <div
        v-if="hasPreviewImages"
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300"
        :class="isHovering || isDropdownOpen ? 'opacity-100' : 'opacity-70'"
      ></div>

      <!-- Project phases indicator -->
      <div
        class="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50"
      >
        <Folder class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Project</span>
      </div>

      <!-- Large centered icon with unique styling (shown when no preview images) -->
      <div
        v-if="!hasPreviewImages"
        class="relative z-10 flex flex-col items-center justify-center gap-4 p-8 transition-transform duration-300 group-hover:scale-110"
      >
        <div
          :style="{
            background: `linear-gradient(to bottom right, ${cardColor}, ${cardColorDark})`,
            borderColor: `${cardColor}80`,
          }"
          class="w-20 h-20 rounded-xl flex items-center justify-center border-2 rotate-12 group-hover:rotate-0 transition-transform duration-300"
        >
          <Folder class="h-10 w-10 text-white" />
        </div>
        <!-- Phase indicators -->
        <div class="flex items-center gap-2">
          <div
            v-if="project.hasSelections"
            class="w-2 h-2 rounded-full bg-violet-500"
            title="Has Selections"
          ></div>
          <div
            v-if="project.hasProofing"
            class="w-2 h-2 rounded-full bg-purple-500"
            title="Has Proofing"
          ></div>
          <div
            v-if="project.hasCollections"
            class="w-2 h-2 rounded-full bg-blue-500"
            title="Has Collections"
          ></div>
        </div>
      </div>

      <!-- Action buttons (top right) -->
      <div
        class="absolute top-3 right-3 z-40 flex items-center gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <Button
          v-if="showStar"
          variant="ghost"
          size="icon"
          class="h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 [&_svg]:transition-all"
          :disabled="isStarring"
          :loading="isStarring"
          :icon="!isStarring ? Star : null"
          :class="[
            project.isStarred || project.starred
              ? '[&_svg]:fill-yellow-400 [&_svg]:text-yellow-400'
              : '[&_svg]:text-gray-600 dark:[&_svg]:text-gray-400',
          ]"
          @click.stop="$emit('star-click', project)"
        />
        <DropdownMenu v-model:open="isDropdownOpen">
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
              @click.stop
            >
              <MoreVertical class="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[180px]']"
          >
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="$emit('view-details', project)"
            >
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="$emit('edit', project)"
            >
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[
                'text-red-500 hover:bg-red-500/10',
                isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              ]"
              :disabled="isDeleting"
              @click.stop="!isDeleting && $emit('delete', project)"
            >
              <span v-if="isDeleting">Deleting...</span>
              <span v-else>Delete</span>
            </DropdownMenuItem>
            <slot name="menu-items-append" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- Card Content -->
    <div class="relative p-4 pt-3 space-y-1.5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div class="flex items-start gap-2.5 min-h-[24px]">
        <Folder :style="{ color: cardColor }" class="h-4 w-4 mt-0.5 shrink-0" />
        <h3
          :class="theme.textPrimary"
          class="font-semibold text-base leading-tight line-clamp-2"
          :title="project.name"
        >
          {{ project.name }}
        </h3>
      </div>
      <div class="flex items-center gap-3 text-sm mt-1" :class="theme.textSecondary">
        <slot name="subtitle">
          <span class="line-clamp-1">{{ subtitle || getSubtitle(project) }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Folder, Star, MoreVertical, Lock, Loader2 } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { lightenColor, darkenColor, generateRandomColorFromPalette } from '@/shared/utils/colors'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
  subtitle: {
    type: String,
    default: null,
  },
  showStar: {
    type: Boolean,
    default: true,
  },
  isDeleting: {
    type: Boolean,
    default: false,
  },
  isStarring: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click', 'star-click', 'edit', 'delete', 'view-details'])

const theme = useThemeClasses()
const isDropdownOpen = ref(false)
const isHovering = ref(false)

const previewImages = computed(() => {
  return props.project?.previewImages || []
})

const previewGrid = computed(() => {
  const images = previewImages.value.slice(0, 4)
  // Always return 4 items (fill with null if less than 4)
  while (images.length < 4) {
    images.push(null)
  }
  return images
})

const hasPreviewImages = computed(() => {
  return previewImages.value && previewImages.value.length > 0
})

const cardColor = computed(() => {
  return props.project?.color || generateRandomColorFromPalette()
})

const cardColorLight = computed(() => {
  return lightenColor(cardColor.value, 80)
})

const cardColorDark = computed(() => {
  return darkenColor(cardColor.value, 30)
})

const handleImageError = event => {
  // Hide the broken image
  if (event.target) {
    event.target.style.display = 'none'
  }
}

const getSubtitle = project => {
  const parts = []
  if (project.hasSelections || project.hasProofing || project.hasCollections) {
    const phases = []
    if (project.hasSelections) phases.push('Selections')
    if (project.hasProofing) phases.push('Proofing')
    if (project.hasCollections) phases.push('Collections')
    parts.push(phases.join(', '))
  }
  const date = project.date || project.createdAt
  if (date) {
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    parts.push(formattedDate)
  }
  return parts.join(' • ')
}
</script>
