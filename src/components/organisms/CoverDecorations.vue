<template>
  <div class="absolute inset-0 pointer-events-none">
    <!-- Background Sections -->
    <div
      v-for="(section, index) in config.backgroundSections"
      :key="`section-${index}`"
      class="absolute"
      :class="getSectionClasses(section)"
      :style="getSectionStyle(section)"
    ></div>

    <!-- Divider -->
    <div
      v-if="config.dividers.enabled"
      class="absolute"
      :class="getDividerClasses()"
      :style="getDividerStyle()"
    ></div>

    <!-- Horizontal Lines -->
    <div
      v-for="(line, index) in config.lines.horizontal"
      :key="`h-line-${index}`"
      class="absolute"
      :style="getHorizontalLineStyle(line)"
    ></div>

    <!-- Vertical Lines -->
    <div
      v-for="(line, index) in config.lines.vertical"
      :key="`v-line-${index}`"
      class="absolute"
      :style="getVerticalLineStyle(line)"
    ></div>

    <!-- Frame -->
    <div
      v-if="config.frame.enabled"
      class="absolute"
      :class="getFrameClasses()"
      :style="getFrameStyle()"
    ></div>

    <!-- Borders -->
    <div v-if="config.borders.enabled" class="absolute inset-0" :style="getBorderStyle()"></div>

    <!-- Decorations -->
    <div
      v-for="(decoration, index) in config.decorations"
      :key="`decoration-${index}`"
      class="absolute"
      :style="getDecorationStyle(decoration)"
    >
      <div
        v-if="decoration.type === 'dot' || decoration.type === 'circle'"
        class="rounded-full"
        :style="{
          width: `${decoration.size}px`,
          height: `${decoration.size}px`,
          backgroundColor: getColor(decoration.color, decoration.customColor),
          opacity: decoration.opacity,
        }"
      ></div>
      <div
        v-else-if="decoration.type === 'square'"
        class="rounded-sm"
        :style="{
          width: `${decoration.size}px`,
          height: `${decoration.size}px`,
          backgroundColor: getColor(decoration.color, decoration.customColor),
          opacity: decoration.opacity,
        }"
      ></div>
      <div
        v-else-if="decoration.type === 'sparkle'"
        class="rounded-full"
        :style="{
          width: `${decoration.size}px`,
          height: `${decoration.size}px`,
          backgroundColor: getColor(decoration.color, decoration.customColor),
          opacity: decoration.opacity,
          boxShadow: `0 0 ${decoration.size * 2}px ${getColor(decoration.color, decoration.customColor)}`,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  CoverStyleConfig,
  BackgroundSection,
  HorizontalLine,
  VerticalLine,
  Decoration,
} from '@/config/coverStyles'

const props = defineProps<{
  config: CoverStyleConfig
  paletteColors: string[] // [background, accent, text]
}>()

// Color helper
const getColor = (colorSource: string, customColor?: string): string => {
  if (customColor) return customColor
  if (colorSource === 'accent') return props.paletteColors[1]
  if (colorSource === 'primary') return props.paletteColors[0]
  if (colorSource === 'text') return props.paletteColors[2]
  return props.paletteColors[1] // default to accent
}

// Background Sections
const getSectionClasses = (section: BackgroundSection) => {
  const classes: string[] = []
  if (section.position === 'left') {
    classes.push('left-0 top-0 bottom-0')
  } else if (section.position === 'right') {
    classes.push('right-0 top-0 bottom-0')
  } else if (section.position === 'top') {
    classes.push('top-0 left-0 right-0')
  } else if (section.position === 'bottom') {
    classes.push('bottom-0 left-0 right-0')
  }
  return classes.join(' ')
}

const getSectionStyle = (section: BackgroundSection) => {
  const color = getColor(section.color, section.customColor)
  const style: Record<string, string> = {}

  if (section.position === 'left' || section.position === 'right') {
    style.width = `${section.width}%`
    style.height = '100%'
  } else {
    style.height = `${section.width}%`
    style.width = '100%'
  }

  if (section.gradient) {
    if (section.position === 'left' || section.position === 'right') {
      style.background = `linear-gradient(to ${section.position === 'left' ? 'right' : 'left'}, ${color} 0%, transparent 100%)`
    } else {
      style.background = `linear-gradient(to ${section.position === 'top' ? 'bottom' : 'top'}, ${color} 0%, transparent 100%)`
    }
  } else {
    style.backgroundColor = color
  }

  return style
}

// Divider
const getDividerClasses = () => {
  if (props.config.dividers.type === 'vertical') {
    return 'top-0 bottom-0'
  }
  return 'left-0 right-0'
}

const getDividerStyle = () => {
  const color = getColor(props.config.dividers.color, props.config.dividers.customColor)
  const style: Record<string, string> = {
    backgroundColor: color,
    borderStyle: props.config.dividers.style,
  }

  if (props.config.dividers.type === 'vertical') {
    style.left = `${props.config.dividers.position}%`
    style.width = `${props.config.dividers.width}px`
    style.transform = 'translateX(-50%)'
  } else {
    style.top = `${props.config.dividers.position}%`
    style.height = `${props.config.dividers.width}px`
    style.transform = 'translateY(-50%)'
  }

  return style
}

// Horizontal Lines
const getHorizontalLineStyle = (line: HorizontalLine) => {
  const color = getColor(line.color, line.customColor)
  const style: Record<string, string> = {
    left: '0',
    right: '0',
    height: `${line.width}px`,
    backgroundColor: color,
    borderStyle: 'solid',
  }

  // Position relative to center
  if (line.position === 'above') {
    style.top = `calc(50% - ${line.offset}px)`
    style.transform = 'translateY(-50%)'
  } else if (line.position === 'below') {
    style.top = `calc(50% + ${line.offset}px)`
    style.transform = 'translateY(-50%)'
  } else {
    style.top = '50%'
    style.transform = 'translateY(-50%)'
  }

  if (line.length === 'partial') {
    style.width = '60%'
    style.left = '20%'
    style.right = 'auto'
  }

  return style
}

// Vertical Lines
const getVerticalLineStyle = (line: VerticalLine) => {
  const color = getColor(line.color, line.customColor)
  const style: Record<string, string> = {
    top: '0',
    bottom: '0',
    width: `${line.width}px`,
    backgroundColor: color,
    borderStyle: 'solid',
  }

  if (line.position === 'left') {
    style.left = `${line.offset}px`
  } else if (line.position === 'right') {
    style.right = `${line.offset}px`
  } else {
    style.left = '50%'
    style.transform = 'translateX(-50%)'
  }

  if (line.height === 'partial') {
    style.height = '60%'
    style.top = '20%'
    style.bottom = 'auto'
  }

  return style
}

// Frame
const getFrameClasses = () => {
  return 'inset-0'
}

const getFrameStyle = () => {
  const color = getColor(props.config.frame.color, props.config.frame.customColor)
  const style: Record<string, string> = {
    borderWidth: `${props.config.frame.width}px`,
    borderStyle: 'solid',
    borderColor: color,
    borderRadius: `${props.config.frame.radius}px`,
    padding: `${props.config.frame.padding}px`,
    pointerEvents: 'none',
  }

  // Handle frame types
  if (props.config.frame.type === 'inset') {
    style.top = `${props.config.frame.padding}px`
    style.left = `${props.config.frame.padding}px`
    style.right = `${props.config.frame.padding}px`
    style.bottom = `${props.config.frame.padding}px`
    style.width = 'auto'
    style.height = 'auto'
  }

  // Handle partial frames - set border width to 0 first, then apply to specific sides
  if (props.config.frame.sides.length < 4) {
    style.borderTopWidth = '0'
    style.borderRightWidth = '0'
    style.borderBottomWidth = '0'
    style.borderLeftWidth = '0'
    props.config.frame.sides.forEach(side => {
      const sideKey =
        `border${side.charAt(0).toUpperCase() + side.slice(1)}Width` as keyof typeof style
      style[sideKey] = `${props.config.frame.width}px`
    })
  }

  return style
}

// Borders
const getBorderStyle = () => {
  const color = getColor(props.config.borders.color, props.config.borders.customColor)
  const style: Record<string, string> = {
    borderStyle: props.config.borders.style,
    borderColor: color,
    borderRadius: `${props.config.borders.radius}px`,
  }

  // Set border width for each side
  props.config.borders.sides.forEach(side => {
    style[`border${side.charAt(0).toUpperCase() + side.slice(1)}Width`] =
      `${props.config.borders.width}px`
  })

  return style
}

// Decorations
const getDecorationStyle = (decoration: Decoration) => {
  return {
    left: `${decoration.position.x}%`,
    top: `${decoration.position.y}%`,
    transform: 'translate(-50%, -50%)',
  }
}
</script>
