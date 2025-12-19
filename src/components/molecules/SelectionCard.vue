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
      'hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-black/40',
      'hover:scale-[1.02] hover:-translate-y-1',
      'border-2 hover:border-opacity-100',
      theme.bgCard,
      theme.shadowCard,
    ]"
    @click="$emit('click', selection)"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    tabindex="0"
    role="button"
  >
    <!-- Selection-specific gradient background (only shown when no cover image) -->
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
        :alt="selection?.name || 'Selection'"
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

      <!-- Large centered icon with unique styling (shown when no cover image) -->
      <div
        v-if="!coverImage"
        class="relative z-10 flex flex-col items-center justify-center gap-3 p-8 transition-transform duration-300 group-hover:scale-110"
      >
        <div
          :style="{
            background: `linear-gradient(to bottom right, ${cardColor}, ${cardColorDark})`,
            borderColor: `${cardColor}80`,
          }"
          class="w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center border-2"
        >
          <CheckSquare class="h-10 w-10 text-white" />
        </div>
        <div
          v-if="selection?.status"
          :style="{
            backgroundColor: `${cardColor}20`,
            color: 'white',
            borderColor: `${cardColor}40`,
          }"
          class="px-3 py-1 rounded-full text-xs font-semibold border"
        >
          {{ capitalize(selection.status) }}
        </div>
      </div>

      <!-- Decorative elements -->
      <div
        class="absolute top-4 right-4 w-16 h-16 rounded-full bg-teal-200/30 dark:bg-teal-800/30 blur-xl"
      ></div>
      <div
        class="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-blue-200/30 dark:bg-blue-800/30 blur-lg"
      ></div>

      <!-- Action buttons -->
      <div
        class="absolute top-3 right-3 z-40 flex items-center gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <Button
          v-if="showStar"
          variant="ghost"
          size="icon"
          class="h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
          @click.stop="$emit('star-click', selection)"
        >
          <Star
            :class="[
              'h-4 w-4',
              selection?.isStarred || selection?.starred
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
              @click.stop="$emit('view-details', selection)"
            >
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="$emit('edit', selection)"
            >
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
              @click.stop="$emit('delete', selection)"
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
        <CheckSquare :style="{ color: cardColor }" class="h-4 w-4 mt-0.5 shrink-0" />
        <h3
          :style="{ color: isHovering ? cardColor : undefined }"
          class="font-semibold text-base leading-tight line-clamp-2 transition-colors duration-200"
          :class="[!isHovering && theme.textPrimary]"
          :title="selection?.name || 'Untitled Selection'"
        >
          {{ selection?.name || 'Untitled Selection' }}
        </h3>
      </div>
      <div class="flex items-center gap-3 text-sm mt-1" :class="theme.textSecondary">
        <slot name="subtitle">
          <span class="line-clamp-1">{{ subtitle || getSubtitle(selection) }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CheckSquare, Star, MoreVertical } from 'lucide-vue-next'
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
import { capitalize } from '@/lib/utils'

const props = defineProps({
  selection: {
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
  return props.selection?.thumbnail || props.selection?.image || null
})

const cardColor = computed(() => {
  return props.selection?.color || generateRandomColorFromPalette()
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

const getSubtitle = selection => {
  if (!selection) return ''
  const parts = []
  // Only show essential info on card - rest in detail sidebar
  if (selection.mediaCount !== undefined) {
    const count = selection.mediaCount
    const labelText = count === 1 ? 'item' : 'items'
    parts.push(`${count} ${labelText}`)
  }
  return parts.join(' • ')
}
</script>
