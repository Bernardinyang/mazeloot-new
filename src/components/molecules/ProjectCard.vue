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
      'group relative rounded-xl overflow-hidden cursor-pointer',
      'transform-gpu transition-all duration-300',
      'hover:scale-[1.02] hover:-translate-y-1',
      'border-2 hover:border-opacity-100',
      theme.bgCard,
      theme.shadowCard,
    ]"
    @click="$emit('click', project)"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    tabindex="0"
    role="button"
  >
    <!-- Project-specific gradient background (only shown when no cover image) -->
    <div
      v-if="!coverImage"
      :style="{
        background: `linear-gradient(to bottom right, ${cardColorLight}, ${cardColorDark})`,
        opacity: '0.6',
      }"
      class="absolute inset-0 dark:opacity-40"
    ></div>

    <!-- Image/Icon Container -->
    <div class="relative aspect-[4/3] flex items-center justify-center overflow-hidden">
      <!-- Cover Image -->
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="project.name"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Gradient overlay when image is present for better contrast -->
      <div
        v-if="coverImage"
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300"
        :class="isHovering || isDropdownOpen ? 'opacity-100' : 'opacity-70'"
      ></div>

      <!-- Subtle color overlay for brand consistency -->
      <div
        v-if="coverImage"
        :style="{
          background: `linear-gradient(to bottom right, ${cardColor}15, transparent)`,
        }"
        class="absolute inset-0 pointer-events-none"
      ></div>

      <!-- Project phases indicator -->
      <div
        class="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50"
      >
        <Folder class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Project</span>
      </div>

      <!-- Large centered icon with unique styling (shown when no cover image) -->
      <div
        v-if="!coverImage"
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
            class="w-2 h-2 rounded-full bg-teal-500"
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

      <!-- Action buttons -->
      <div
        class="absolute top-3 right-3 z-40 flex items-center gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <Button
          v-if="showStar"
          variant="ghost"
          size="icon"
          class="h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
          @click.stop="$emit('star-click', project)"
        >
          <Star
            :class="[
              'h-4 w-4',
              project.isStarred || project.starred
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-600 dark:text-gray-400',
            ]"
          />
        </Button>
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
              :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
              @click.stop="$emit('delete', project)"
            >
              <span>Delete</span>
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
          :style="{ color: isHovering ? cardColor : undefined }"
          class="font-semibold text-base leading-tight line-clamp-2 transition-colors duration-200"
          :class="[!isHovering && theme.textPrimary]"
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
import { Folder, Star, MoreVertical } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { lightenColor, darkenColor, generateRandomColorFromPalette } from '@/utils/colors'

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
})

const emit = defineEmits(['click', 'star-click', 'edit', 'delete', 'view-details'])

const theme = useThemeClasses()
const isDropdownOpen = ref(false)
const isHovering = ref(false)

const coverImage = computed(() => {
  return props.project?.thumbnail || props.project?.image || null
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
  event.target.style.display = 'none'
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
