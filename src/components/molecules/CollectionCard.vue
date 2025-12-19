<template>
  <div
    ref="cardRef"
    :style="{
      ...tiltStyle,
      width: containerWidth,
      height: containerHeight,
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
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      containerClass,
      theme.bgCard,
      theme.shadowCard,
      'border-2',
      isDragging ? 'opacity-50 scale-95' : '',
      isDragOver ? 'ring-2 ring-primary ring-offset-2' : '',
      props.isMoving ? 'animate-move-out' : '',
    ]"
    :draggable="
      collectionData && !collectionData.isFolder && !isFolder && !collectionData.disableDrag
    "
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="$emit('click')"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    tabindex="0"
    role="button"
    :aria-label="captionText || altText"
  >
    <!-- Collection-specific gradient background (only shown when no image) -->
    <div
      v-if="!imageSrc && !previewImages?.length && !isFolder"
      :style="{
        background: `linear-gradient(to bottom right, ${cardColorLight}, ${cardColorDark})`,
        opacity: '0.6',
      }"
      class="absolute inset-0 dark:opacity-40"
    ></div>

    <!-- Image Container -->
    <div
      :class="['relative overflow-hidden', imageContainerClass]"
      :style="{ height: imageHeight, width: imageWidth }"
    >
      <!-- Folder Preview Grid (2x2) -->
      <div
        v-if="previewImages && previewImages.length > 0"
        class="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 bg-gray-200/50 dark:bg-gray-800/50 p-0.5 relative"
      >
        <!-- Subtle color overlay for brand consistency -->
        <div
          :style="{
            background: `linear-gradient(to bottom right, ${cardColor}15, transparent)`,
          }"
          class="absolute inset-0 pointer-events-none z-10"
        ></div>
        <!-- Folder Badge Indicator (Top Left) -->
        <div
          v-if="isFolder"
          class="absolute top-2 left-2 z-30 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-md border"
          :class="theme.borderSecondary"
        >
          <Folder class="h-3 w-3" :class="theme.textSecondary" />
          <span class="text-xs font-medium" :class="theme.textSecondary">Folder</span>
        </div>

        <!-- Lock Icon Overlay on Folder Preview Grid (Bottom Left to avoid conflict with dropdown) -->
        <div
          v-if="isLocked && isFolder"
          class="absolute bottom-2 left-2 z-30 flex items-center justify-center w-7 h-7 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border"
          :class="theme.borderSecondary"
        >
          <Lock class="h-3.5 w-3.5" :class="theme.textSecondary" />
        </div>
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

      <!-- Single Image -->
      <div v-else-if="imageSrc && !isFolder" class="relative w-full h-full overflow-hidden">
        <img
          :src="imageSrc"
          :alt="altText"
          class="w-full h-full object-cover transition-transform duration-500 ease-out"
          :style="{ transform: isHovering ? `scale(${scaleOnHover})` : 'scale(1)' }"
          loading="lazy"
          @error="handleImageError($event)"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300"
          :class="isHovering || isDropdownOpen ? 'opacity-100' : 'opacity-70'"
        />
        <!-- Subtle color overlay for brand consistency -->
        <div
          :style="{
            background: `linear-gradient(to bottom right, ${cardColor}15, transparent)`,
          }"
          class="absolute inset-0 pointer-events-none"
        ></div>
        <!-- Project Indicator (if collection is part of a project) -->
        <div
          v-if="collectionData?.projectId"
          class="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-lg border text-xs font-medium bg-purple-500/95 text-white border-purple-600/50"
        >
          Project
        </div>
        <!-- Lock Icon Overlay on Collection Image - Bottom Left to avoid conflict with dropdown -->
        <div
          v-if="isLocked"
          class="absolute bottom-3 left-3 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border"
          :class="theme.borderSecondary"
        >
          <Lock class="h-4 w-4" :class="theme.textSecondary" />
        </div>
      </div>

      <!-- Folder Icon (when no preview images) -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center relative"
        :class="theme.bgCardSolid"
      >
        <!-- Gradient background for collections without images -->
        <div
          :style="{
            background: `linear-gradient(to bottom right, ${cardColorLight}, ${cardColorDark})`,
            opacity: '0.6',
          }"
          class="absolute inset-0 dark:opacity-40"
        ></div>
        <div class="relative z-10 flex flex-col items-center gap-3">
          <!-- Folder Icon with Lock Overlay -->
          <div class="relative">
            <div
              v-if="isFolder"
              :style="{
                background: `linear-gradient(to bottom right, ${cardColor}, ${cardColorDark})`,
                borderColor: `${cardColor}80`,
              }"
              class="w-20 h-20 rounded-xl flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110"
            >
              <component v-if="folderIcon" :is="folderIcon" class="h-10 w-10 text-white" />
              <Folder v-else class="h-10 w-10 text-white" />
            </div>
            <template v-else>
              <component
                v-if="folderIcon"
                :is="folderIcon"
                class="h-20 w-20 transition-transform duration-300 group-hover:scale-110"
                :class="theme.textTertiary"
              />
              <Folder
                v-else
                class="h-20 w-20 transition-transform duration-300 group-hover:scale-110"
                :class="theme.textTertiary"
              />
            </template>
            <!-- Lock Icon Overlay on Folder -->
            <div
              v-if="isLocked"
              class="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 shadow-md"
              :class="theme.borderSecondary"
            >
              <Lock class="h-3.5 w-3.5" :class="theme.textSecondary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Lock Badge Overlay on Preview Grid - Bottom Left to avoid conflict with dropdown -->
      <div
        v-if="isLocked && previewImages && previewImages.length > 0"
        class="absolute bottom-2 left-2 z-30 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border"
        :class="theme.borderSecondary"
      >
        <Lock class="h-3.5 w-3.5" :class="theme.textSecondary" />
        <span class="text-xs font-medium" :class="theme.textSecondary">Locked</span>
      </div>

      <!-- Overlay -->
      <div
        v-if="displayOverlayContent"
        :class="[
          'absolute inset-0 transition-colors duration-300',
          isHovering ? 'bg-black/20' : 'bg-black/0',
        ]"
      />

      <!-- Badge Icon - Top Right (if locked folder or folder with preview has badge) -->
      <div
        v-if="
          badge &&
          ((isLocked && previewImages && previewImages.length > 0) ||
            (isFolder && previewImages && previewImages.length > 0))
        "
        class="absolute top-3 right-3 z-20 transition-all duration-300"
        :class="isHovering ? 'scale-110' : 'scale-100'"
      >
        <div
          class="w-7 h-7 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg flex items-center justify-center border"
          :class="theme.borderSecondary"
        >
          <component
            v-if="badgeIcon"
            :is="badgeIcon"
            class="h-3.5 w-3.5"
            :class="theme.textSecondary"
          />
        </div>
      </div>

      <!-- Action Buttons Container - Top Right (visible on hover or when dropdown is open, higher z-index to be above lock badges) -->
      <div
        v-if="showMenu || showStar"
        class="absolute top-3 right-3 z-40 flex items-center gap-2 transition-all duration-300"
        :class="
          isHovering || isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        "
      >
        <!-- Star Icon -->
        <Button
          v-if="showStar"
          variant="ghost"
          size="icon-sm"
          class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg border transition-all duration-200 hover:scale-110"
          :class="theme.borderSecondary"
          @click.stop="$emit('star-click')"
          :aria-label="isStarred ? 'Unstar item' : 'Star item'"
        >
          <Star
            :class="[
              'h-4 w-4 transition-all duration-200',
              isStarred
                ? 'fill-yellow-400 text-yellow-400 scale-110'
                : 'text-gray-500 hover:text-yellow-400',
            ]"
          />
        </Button>

        <!-- Three-dot Menu -->
        <DropdownMenu v-if="showMenu" v-model:open="isDropdownOpen">
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon-sm"
              class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg border transition-all duration-200 hover:scale-110"
              :class="theme.borderSecondary"
              aria-label="More options"
              @click.stop
            >
              <MoreVertical class="h-4 w-4" :class="theme.textSecondary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[160px]']"
          >
            <slot name="menu-items">
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('edit', collectionData)"
              >
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('duplicate', collectionData)"
              >
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('share', collectionData)"
              >
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem
                :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
                @click.stop="$emit('delete', collectionData)"
              >
                <span>Delete</span>
              </DropdownMenuItem>
            </slot>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Overlay Content -->
      <div
        v-if="displayOverlayContent && overlayContent"
        class="absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300"
        :class="isHovering || isDropdownOpen ? 'opacity-100' : 'opacity-0'"
      >
        <div :class="['text-white text-center', overlayContentClass]">
          <slot name="overlay-content">
            <p v-if="captionText">{{ captionText }}</p>
          </slot>
        </div>
      </div>
    </div>

    <!-- Card Content (Below Image) -->
    <div v-if="showContent" :class="['p-4 pt-3 space-y-1.5', contentClass]">
      <slot name="content">
        <div v-if="captionText" class="flex items-start gap-2.5 min-h-[24px]">
          <!-- Always show folder icon for folders, or use provided icon -->
          <component
            v-if="isFolder && !icon"
            :is="Folder"
            :style="{ color: cardColor }"
            class="h-4 w-4 mt-0.5 shrink-0"
          />
          <component
            v-else-if="icon"
            :is="icon"
            :style="{ color: cardColor }"
            class="h-4 w-4 mt-0.5 shrink-0"
          />
          <h3
            :style="{ color: isHovering ? cardColor : undefined }"
            class="font-semibold text-base leading-tight line-clamp-2 transition-colors duration-200"
            :class="[!isHovering && theme.textPrimary]"
            :title="captionText"
          >
            {{ captionText }}
          </h3>
        </div>
        <div
          v-if="subtitle"
          class="flex items-center gap-3 text-sm mt-1"
          :class="theme.textSecondary"
        >
          <slot name="subtitle">
            <span class="line-clamp-1">{{ subtitle }}</span>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Folder, Star, MoreVertical, Lock } from 'lucide-vue-next'
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

const theme = useThemeClasses()

const props = defineProps({
  imageSrc: {
    type: [String, null],
    default: null,
  },
  altText: {
    type: String,
    default: 'Card image',
  },
  captionText: {
    type: String,
    default: undefined,
  },
  subtitle: {
    type: String,
    default: undefined,
  },
  containerHeight: {
    type: String,
    default: 'auto',
  },
  containerWidth: {
    type: String,
    default: '100%',
  },
  imageHeight: {
    type: String,
    default: '100%',
  },
  imageWidth: {
    type: String,
    default: '100%',
  },
  rotateAmplitude: {
    type: Number,
    default: 12,
  },
  scaleOnHover: {
    type: Number,
    default: 1.05,
  },
  showMobileWarning: {
    type: Boolean,
    default: false,
  },
  showTooltip: {
    type: Boolean,
    default: true,
  },
  displayOverlayContent: {
    type: Boolean,
    default: false,
  },
  overlayContent: {
    type: String,
    default: undefined,
  },
  showContent: {
    type: Boolean,
    default: true,
  },
  showMenu: {
    type: Boolean,
    default: true,
  },
  showStar: {
    type: Boolean,
    default: true,
  },
  isStarred: {
    type: Boolean,
    default: false,
  },
  badge: {
    type: Boolean,
    default: false,
  },
  badgeIcon: {
    type: Object,
    default: undefined,
  },
  icon: {
    type: Object,
    default: undefined,
  },
  folderIcon: {
    type: Object,
    default: undefined,
  },
  containerClass: {
    type: String,
    default: '',
  },
  imageContainerClass: {
    type: String,
    default: '',
  },
  contentClass: {
    type: String,
    default: '',
  },
  overlayContentClass: {
    type: String,
    default: '',
  },
  previewImages: {
    type: Array,
    default: () => [],
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  isFolder: {
    type: Boolean,
    default: false,
  },
  collectionData: {
    type: Object,
    default: undefined,
  },
  isMoving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'star-click',
  'click',
  'drag-start',
  'drag-end',
  'drop',
  'edit',
  'duplicate',
  'delete',
  'share',
])

// Color support
const cardColor = computed(() => {
  return props.collectionData?.color || generateRandomColorFromPalette()
})

const cardColorLight = computed(() => {
  return lightenColor(cardColor.value, 80)
})

const cardColorDark = computed(() => {
  return darkenColor(cardColor.value, 30)
})

// Generate preview grid (always 4 cells, fill with null if less than 4 images)
const previewGrid = computed(() => {
  if (!props.previewImages || props.previewImages.length === 0) {
    return [null, null, null, null]
  }
  const grid = [...props.previewImages]
  // Fill remaining slots with null to show empty placeholders
  while (grid.length < 4) {
    grid.push(null)
  }
  return grid.slice(0, 4)
})

// Fallback placeholder image (SVG data URL)
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='

// Handle image load errors
const handleImageError = event => {
  const img = event.target
  if (img.src !== placeholderImage) {
    img.src = placeholderImage
  }
}

// Tilt effect
const cardRef = ref(null)
const rotateX = ref(0)
const rotateY = ref(0)
const isHovering = ref(false)
const isDropdownOpen = ref(false)

// Drag and drop
const isDragging = ref(false)
const isDragOver = ref(false)
const draggedItem = ref(null)

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

// Drag and drop handlers
const handleDragStart = e => {
  // Prevent dragging folders
  if (props.isFolder || props.collectionData?.isFolder) {
    e.preventDefault()
    return
  }

  isDragging.value = true
  draggedItem.value = props.collectionData || {
    id: props.captionText,
    isFolder: props.isFolder,
  }
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify(draggedItem.value))
  }
  emit('drag-start', draggedItem.value)
}

const handleDragEnd = () => {
  isDragging.value = false
  draggedItem.value = null
  emit('drag-end')
}

const handleDragOver = e => {
  // Only allow drop on folders
  if (props.isFolder && !isDragging.value) {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = e => {
  e.preventDefault()
  isDragOver.value = false

  if (!props.isFolder) return

  try {
    const data = e.dataTransfer?.getData('application/json')
    if (data) {
      const item = JSON.parse(data)
      const targetFolder = props.collectionData || {
        id: props.captionText,
        name: props.captionText,
        isFolder: props.isFolder,
      }
      emit('drop', item, targetFolder)
    }
  } catch (error) {
    console.error('Failed to parse drag data:', error)
  }
}
</script>
