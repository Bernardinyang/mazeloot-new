<template>
  <div
    ref="cardRef"
    :class="[
      'group relative rounded-xl overflow-hidden cursor-pointer',
      'transform-gpu',
      'hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-black/40',
      'transition-shadow duration-300 ease-out',
      'hover:border-opacity-100',
      'border-2',
      theme.bgCard,
      theme.shadowCard,
    ]"
    :style="{
      ...tiltStyle,
      '--index': index,
      '--card-color': cardColor,
      '--card-color-light': cardColorLight,
      '--card-color-dark': cardColorDark,
      borderColor: `${cardColor}33`,
    }"
    role="button"
    tabindex="0"
    @click="$emit('click', selection)"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
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
      <!-- Project Badge -->
      <div
        v-if="selection?.project?.name || selection?.projectId"
        class="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      >
        <div class="flex items-center gap-1.5">
          <FolderKanban class="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          <span class="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1 max-w-[120px]">
            {{ selection?.project?.name || 'Project' }}
          </span>
        </div>
      </div>


      <!-- Starred Badge and Lock Icon -->
      <div class="absolute bottom-3 left-3 z-30 flex items-center gap-2">
        <div
          v-if="selection?.isStarred || selection?.starred"
          class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400/90 dark:bg-yellow-500/90 backdrop-blur-sm shadow-lg"
          title="Starred"
        >
          <Star class="h-4 w-4 fill-white text-white" />
        </div>
        <div
          v-if="selection?.hasPassword || selection?.password"
          class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600/90 dark:bg-gray-500/90 backdrop-blur-sm shadow-lg"
          title="Password protected"
        >
          <Lock class="h-4 w-4 text-white" />
        </div>
      </div>
      <!-- Cover Video -->
      <video
        v-if="coverImage && isVideoCover"
        ref="videoRef"
        :src="coverImage"
        :style="coverImageStyle"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        autoplay
        loop
        muted
        playsinline
      />
      <!-- Cover Image -->
      <img
        v-else-if="coverImage"
        :alt="selection?.name || 'Selection'"
        :src="coverImage"
        :style="coverImageStyle"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Gradient overlay when image is present for better contrast -->
      <div
        v-if="coverImage"
        :class="isHovering || isDropdownOpen ? 'opacity-100' : 'opacity-70'"
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300"
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
      </div>

      <!-- Decorative elements -->
      <div
        class="absolute top-4 right-4 w-16 h-16 rounded-full bg-accent/30 dark:bg-accent/30 blur-xl"
      ></div>
      <div
        class="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-blue-200/30 dark:bg-blue-800/30 blur-lg"
      ></div>

      <!-- Action buttons -->
      <div
        :class="[
          'absolute top-3 right-3 z-40 flex items-center gap-2 transition-all duration-300',
          isDropdownOpen || isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        ]"
      >
        <Button
          v-if="showStar"
          class="h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 [&_svg]:transition-all"
          size="icon"
          variant="ghost"
          :disabled="isStarring"
          :loading="isStarring"
          :icon="!isStarring ? Star : null"
          :class="[
            selection?.isStarred || selection?.starred
              ? '[&_svg]:fill-yellow-400 [&_svg]:text-yellow-400'
              : '[&_svg]:text-gray-600 dark:[&_svg]:text-gray-400',
          ]"
          @click.stop="$emit('star-click', selection)"
        />
        <DropdownMenu v-model:open="isDropdownOpen">
          <DropdownMenuTrigger as-child>
            <Button
              class="h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
              size="icon"
              variant="ghost"
              @click.stop
            >
              <MoreVertical class="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[180px]']"
            align="end"
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
              :disabled="isDeleting"
              @click.stop="$emit('edit', selection)"
            >
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
              :disabled="isDeleting"
              @click.stop="$emit('delete', selection)"
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
        <CheckSquare :style="{ color: cardColor }" class="h-4 w-4 mt-0.5 shrink-0" />
        <h3
          :class="theme.textPrimary"
          :title="selection?.name || 'Untitled Selection'"
          class="font-semibold text-base leading-tight line-clamp-2"
        >
          {{ selection?.name || 'Untitled Selection' }}
        </h3>
      </div>
      <div :class="theme.textSecondary" class="flex items-center justify-between gap-3 text-sm mt-1">
        <slot name="subtitle">
          <span class="line-clamp-1">{{ getMediaAndListCount(selection) }}</span>
        </slot>
        <div v-if="selection?.status" class="shrink-0">
          <StatusBadge :status="selection.status" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { CheckSquare, Lock, MoreVertical, Star, FolderKanban } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { darkenColor, generateRandomColorFromPalette, lightenColor } from '@/utils/colors'
import { useFocalPoint, getFocalPointFromEntity } from '@/composables/useFocalPoint'
import { capitalize } from '@/lib/utils'
import StatusBadge from '@/components/atoms/StatusBadge.vue'

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
  rotateAmplitude: {
    type: Number,
    default: 8,
  },
  isStarring: {
    type: Boolean,
    default: false,
  },
  isDeleting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click', 'star-click', 'edit', 'delete', 'view-details'])

const theme = useThemeClasses()
const isDropdownOpen = ref(false)
const isHovering = ref(false)

// Tilt effect
const cardRef = ref(null)
const rotateX = ref(0)
const rotateY = ref(0)
const videoRef = ref(null)

const handleMouseMove = e => {
  if (!cardRef.value) return

  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateXValue = ((y - centerY) / centerY) * -props.rotateAmplitude
  const rotateYValue = ((x - centerX) / centerX) * props.rotateAmplitude

  rotateX.value = rotateXValue
  rotateY.value = rotateYValue
}

const handleMouseEnter = () => {
  isHovering.value = true
}

const handleMouseLeave = () => {
  // Keep hover state if dropdown is open
  if (!isDropdownOpen.value) {
    isHovering.value = false
    rotateX.value = 0
    rotateY.value = 0
  }
}

// Watch dropdown state - when it closes, reset hover if mouse is not over card
watch(isDropdownOpen, isOpen => {
  if (!isOpen && !isHovering.value) {
    rotateX.value = 0
    rotateY.value = 0
  }
})

const tiltStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) translateZ(0)`,
  transition:
    isHovering.value || isDropdownOpen.value
      ? 'none'
      : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  willChange: isHovering.value || isDropdownOpen.value ? 'transform' : 'auto',
}))

const coverImage = computed(() => {
  // Priority: coverPhotoUrl > cover_photo_url > thumbnail > image
  return (
    props.selection?.coverPhotoUrl ||
    props.selection?.cover_photo_url ||
    props.selection?.thumbnail ||
    props.selection?.image ||
    null
  )
})

const isVideoCover = computed(() => {
  const url = coverImage.value
  if (!url) return false
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
})

const focalPoint = computed(() => getFocalPointFromEntity(props.selection))
const { imageStyle: coverImageStyle } = useFocalPoint(focalPoint)

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

const getMediaAndListCount = selection => {
  if (!selection) return ''
  const parts = []

  // Media count
  if (selection.mediaCount !== undefined) {
    const mediaCount = selection.mediaCount
    const mediaLabel = mediaCount === 1 ? 'media' : 'media'
    parts.push(`${mediaCount} ${mediaLabel}`)
  }

  // List count
  const listCount = selection.listCount || selection.listsCount || (selection.lists?.length ?? 0)
  if (listCount > 0) {
    const listLabel = listCount === 1 ? 'list' : 'lists'
    parts.push(`${listCount} ${listLabel}`)
  }

  const setCount =
    selection.setCount ||
    selection.setsCount ||
    selection.mediaSetsCount ||
    selection.mediaSetCount ||
    (Array.isArray(selection.mediaSets) ? selection.mediaSets.length : 0) ||
    (Array.isArray(selection.sets) ? selection.sets.length : 0) ||
    0
  if (setCount > 0 || selection.mediaSets !== undefined || selection.sets !== undefined) {
    const setLabel = setCount === 1 ? 'set' : 'sets'
    parts.push(`${setCount} ${setLabel}`)
  }

  return parts.join(' • ')
}
</script>
