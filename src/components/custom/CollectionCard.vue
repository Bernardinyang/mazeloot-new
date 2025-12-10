<template>
  <div
    ref="cardRef"
    :style="{ ...tiltStyle, width: containerWidth, height: containerHeight }"
    :class="[
      'group relative rounded-xl overflow-hidden cursor-pointer',
      'transform-gpu will-change-transform',
      'hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-black/40',
      'transition-all duration-300 ease-out',
      'hover:border-opacity-100',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      containerClass,
      theme.bgCard,
      theme.borderCard,
      theme.shadowCard,
      'border',
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="$emit('click')"
    tabindex="0"
    role="button"
    :aria-label="captionText || altText"
  >
    <!-- Image Container -->
    <div
      :class="[
        'relative overflow-hidden',
        imageContainerClass
      ]"
      :style="{ height: imageHeight, width: imageWidth }"
    >
      <!-- Folder Preview Grid (2x2) -->
      <div
        v-if="previewImages && previewImages.length > 0"
        class="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 bg-gray-200/50 dark:bg-gray-800/50 p-0.5"
      >
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
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <div class="w-8 h-8 rounded border-2 border-dashed" :class="theme.borderSecondary"></div>
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
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
      
      <!-- Folder Icon (when no preview images) -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center relative"
        :class="theme.bgCardSolid"
      >
        <div class="relative z-10 flex flex-col items-center gap-3">
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
          <div v-if="isLocked" class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 dark:bg-gray-800/90">
            <Lock class="h-3.5 w-3.5" :class="theme.textSecondary" />
            <span class="text-xs font-medium" :class="theme.textSecondary">Locked</span>
          </div>
        </div>
      </div>
      
      <!-- Lock Badge Overlay on Preview Grid - Top Left to avoid overlap with action buttons -->
      <div
        v-if="isLocked && previewImages && previewImages.length > 0"
        class="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border"
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
          isHovering ? 'bg-black/20' : 'bg-black/0'
        ]"
      />

      <!-- Badge Icon - Top Left (always visible if present, but below lock if locked) -->
      <div
        v-if="badge && !(isLocked && previewImages && previewImages.length > 0)"
        class="absolute top-3 left-3 z-20 transition-all duration-300"
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
      
      <!-- Badge Icon - Top Right (if locked folder has badge) -->
      <div
        v-if="badge && isLocked && previewImages && previewImages.length > 0"
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

      <!-- Action Buttons Container - Top Right (visible on hover) -->
      <div
        v-if="showMenu || showStar"
        class="absolute top-3 right-3 z-20 flex items-center gap-2 transition-all duration-300"
        :class="isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <!-- Star Icon -->
        <Button
          v-if="showStar"
          variant="ghost"
          size="icon-sm"
          class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg border transition-all duration-200 hover:scale-110"
          :class="theme.borderSecondary"
          @click.stop="$emit('star-click')"
          :aria-label="isStarred ? 'Unstar collection' : 'Star collection'"
        >
          <Star
            :class="[
              'h-4 w-4 transition-all duration-200',
              isStarred ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-500 hover:text-yellow-400'
            ]"
          />
        </Button>

        <!-- Three-dot Menu -->
        <DropdownMenu v-if="showMenu">
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon-sm"
              class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg border transition-all duration-200 hover:scale-110"
              :class="theme.borderSecondary"
              aria-label="More options"
            >
              <MoreVertical class="h-4 w-4" :class="theme.textSecondary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[160px]']">
            <slot name="menu-items">
              <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']">
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
        :class="isHovering ? 'opacity-100' : 'opacity-0'"
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
          <component
            v-if="icon"
            :is="icon"
            class="h-4 w-4 mt-0.5 shrink-0"
            :class="theme.textSecondary"
          />
          <h3 
            class="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200"
            :class="theme.textPrimary"
            :title="captionText"
          >
            {{ captionText }}
          </h3>
        </div>
        <div v-if="subtitle" class="flex items-center gap-3 text-sm mt-1" :class="theme.textSecondary">
          <slot name="subtitle">
            <span class="line-clamp-1">{{ subtitle }}</span>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
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

const theme = useThemeClasses()

const props = withDefaults(defineProps<{
  imageSrc?: string | null
  altText?: string
  captionText?: string
  subtitle?: string
  containerHeight?: string
  containerWidth?: string
  imageHeight?: string
  imageWidth?: string
  rotateAmplitude?: number
  scaleOnHover?: number
  showMobileWarning?: boolean
  showTooltip?: boolean
  displayOverlayContent?: boolean
  overlayContent?: string
  showContent?: boolean
  showMenu?: boolean
  showStar?: boolean
  isStarred?: boolean
  badge?: boolean
  badgeIcon?: Component
  icon?: Component
  folderIcon?: Component
  containerClass?: string
  imageContainerClass?: string
  contentClass?: string
  overlayContentClass?: string
  previewImages?: string[]
  isLocked?: boolean
  isFolder?: boolean
}>(), {
  altText: 'Card image',
  containerHeight: 'auto',
  containerWidth: '100%',
  imageHeight: '100%',
  imageWidth: '100%',
  rotateAmplitude: 12,
  scaleOnHover: 1.05,
  showMobileWarning: false,
  showTooltip: true,
  displayOverlayContent: false,
  showContent: true,
  showMenu: true,
  showStar: true,
  isStarred: false,
  badge: false,
  containerClass: '',
  imageContainerClass: '',
  contentClass: '',
  overlayContentClass: '',
  previewImages: () => [],
  isLocked: false,
  isFolder: false,
})

const emit = defineEmits<{
  'star-click': []
  'click': []
}>()

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

// Tilt effect
const cardRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const isHovering = ref(false)

const handleMouseMove = (e: MouseEvent) => {
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
  isHovering.value = false
  rotateX.value = 0
  rotateY.value = 0
}

const tiltStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
  transition: isHovering.value ? 'none' : 'transform 0.5s ease-out',
}))
</script>

