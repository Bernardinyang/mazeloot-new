<template>
  <div
    ref="cardRef"
    :style="{
      ...tiltStyle,
      '--index': index,
      '--card-color': cardColor,
      '--card-color-light': cardColorLight,
      '--card-color-dark': cardColorDark,
      borderColor: `${cardColor}33`,
    }"
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
    role="button"
    tabindex="0"
    @click="$emit('click', proofing)"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
  >
    <!-- Proofing-specific gradient background (only shown when no cover image) -->
    <div
      v-if="!coverImage"
      :style="{
        background: `linear-gradient(to bottom right, ${cardColorLight}, ${cardColorDark})`,
        opacity: '0.4',
      }"
      class="absolute inset-0 dark:opacity-20"
    ></div>

    <!-- Image/Icon Container -->
    <div class="relative aspect-[4/3] flex items-center justify-center overflow-hidden">
      <!-- Cover Image -->
      <img
        v-if="coverImage && !isVideoCover"
        :src="coverImage"
        :alt="proofing.name"
        :style="coverImageStyle"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Cover Video -->
      <video
        v-if="coverImage && isVideoCover"
        :src="coverImage"
        :poster="coverVideoPoster"
        :style="coverImageStyle"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        muted
        loop
        autoplay
        playsinline
        preload="metadata"
        @error="handleVideoError"
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
          class="w-20 h-20 rounded-full flex items-center justify-center border-2"
        >
          <Eye class="h-10 w-10 text-white" />
        </div>
      </div>

      <!-- Project Badge -->
      <div
        v-if="proofing?.project?.name || proofing?.projectId"
        class="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      >
        <div class="flex items-center gap-1.5">
          <FolderKanban class="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          <span class="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1 max-w-[120px]">
            {{ proofing?.project?.name || 'Project' }}
          </span>
        </div>
      </div>


      <!-- Starred Badge and Lock Icon -->
      <div class="absolute bottom-3 left-3 z-30 flex items-center gap-2">
        <div
          v-if="proofing?.isStarred || proofing?.starred"
          class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400/90 dark:bg-yellow-500/90 backdrop-blur-sm shadow-lg"
          title="Starred"
        >
          <Star class="h-4 w-4 fill-white text-white" />
        </div>
        <div
          v-if="proofing?.hasPassword || proofing?.password"
          class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600/90 dark:bg-gray-500/90 backdrop-blur-sm shadow-lg"
          title="Password protected"
        >
          <Lock class="h-4 w-4 text-white" />
        </div>
      </div>

      <!-- Action buttons -->
      <div
        :class="[
          'absolute top-3 right-3 z-40 flex items-center gap-2 transition-all duration-300',
          isDropdownOpen || isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        ]"
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
            proofing.isStarred || proofing.starred
              ? '[&_svg]:fill-yellow-400 [&_svg]:text-yellow-400'
              : '[&_svg]:text-gray-600 dark:[&_svg]:text-gray-400',
          ]"
          @click.stop="$emit('star-click', proofing)"
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
              @click.stop="$emit('view-details', proofing)"
            >
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              :disabled="isDeleting || isDuplicating"
              @click.stop="$emit('edit', proofing)"
            >
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              :disabled="isDeleting || isDuplicating"
              @click.stop="$emit('duplicate', proofing)"
            >
              <span v-if="isDuplicating">Duplicating...</span>
              <span v-else>Duplicate</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
              :disabled="isDeleting || isDuplicating"
              @click.stop="$emit('delete', proofing)"
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
        <Eye :style="{ color: cardColor }" class="h-4 w-4 mt-0.5 shrink-0" />
        <h3
          class="font-semibold text-base leading-tight line-clamp-2"
          :class="theme.textPrimary"
          :title="proofing.name"
        >
          {{ proofing.name }}
        </h3>
      </div>
      <div class="flex items-center justify-between gap-3 text-sm mt-1" :class="theme.textSecondary">
        <slot name="subtitle">
          <span class="line-clamp-1">{{ subtitle || getMediaAndSetCount(proofing) }}</span>
        </slot>
        <div v-if="proofing.status" class="shrink-0">
          <StatusBadge :status="proofing.status" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Eye, Star, MoreVertical, FolderKanban, Lock } from '@/shared/utils/lucideAnimated'
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
import { useFocalPoint, getFocalPointFromEntity } from '@/shared/composables/useFocalPoint'
import { capitalize } from '@/shared/lib/utils'
import StatusBadge from '@/shared/components/atoms/StatusBadge.vue'

const props = defineProps({
  proofing: {
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
  isDuplicating: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click', 'star-click', 'edit', 'delete', 'duplicate', 'view-details'])

const theme = useThemeClasses()
const isDropdownOpen = ref(false)
const isHovering = ref(false)

// Tilt effect
const cardRef = ref(null)
const rotateX = ref(0)
const rotateY = ref(0)

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
    props.proofing?.coverPhotoUrl ||
    props.proofing?.cover_photo_url ||
    props.proofing?.thumbnail ||
    props.proofing?.image ||
    null
  )
})

const isVideoCover = computed(() => {
  if (!coverImage.value) return false
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.m4v']
  const lowerUrl = coverImage.value.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
})

const focalPoint = computed(() => getFocalPointFromEntity(props.proofing))
const { imageStyle: coverImageStyle } = useFocalPoint(focalPoint)

const coverVideoPoster = computed(() => {
  if (!isVideoCover.value) return null
  // Try to get thumbnail from proofing if available
  return props.proofing?.thumbnail || null
})

const cardColor = computed(() => {
  return props.proofing?.color || generateRandomColorFromPalette()
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

const handleVideoError = event => {
  event.target.style.display = 'none'
}

const getSubtitle = proofing => {
  if (!proofing) return ''
  const parts = []
  // Only show essential info on card - rest in detail sidebar
  if (proofing.mediaCount !== undefined) {
    const count = proofing.mediaCount
    const labelText = count === 1 ? 'item' : 'items'
    parts.push(`${count} ${labelText}`)
  }
  return parts.join(' • ')
}

const getMediaAndSetCount = proofing => {
  if (!proofing) return ''
  const parts = []

  // Media count
  if (proofing.mediaCount !== undefined) {
    const mediaCount = proofing.mediaCount
    const mediaLabel = mediaCount === 1 ? 'media' : 'media'
    parts.push(`${mediaCount} ${mediaLabel}`)
  }

  // Set count
  const setCount =
    proofing.setCount ||
    proofing.setsCount ||
    proofing.mediaSetsCount ||
    proofing.mediaSetCount ||
    (Array.isArray(proofing.mediaSets) ? proofing.mediaSets.length : 0) ||
    (Array.isArray(proofing.sets) ? proofing.sets.length : 0) ||
    0
  if (setCount > 0 || proofing.mediaSets !== undefined || proofing.sets !== undefined) {
    const setLabel = setCount === 1 ? 'set' : 'sets'
    parts.push(`${setCount} ${setLabel}`)
  }

  return parts.join(' • ')
}
</script>
