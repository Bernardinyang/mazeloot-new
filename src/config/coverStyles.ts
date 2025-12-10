/**
 * Cover Style Configuration
 * Defines all decorative elements (borders, lines, frames, dividers) for each cover style
 */

export type TextPosition = 'center' | 'left' | 'right' | 'bottom' | 'top'
export type TextAlignment = 'left' | 'center' | 'right'
export type BorderSide = 'top' | 'right' | 'bottom' | 'left'
export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double'
export type ColorSource = 'accent' | 'primary' | 'text' | 'custom'
export type LinePosition = 'above' | 'below' | 'center'
export type DividerType = 'vertical' | 'horizontal'
export type FrameType = 'full' | 'partial' | 'double' | 'inset'
export type DecorationType = 'circle' | 'square' | 'dot' | 'sparkle'

export interface HorizontalLine {
  position: LinePosition
  offset: number // pixels from text
  width: number // line thickness
  color: ColorSource
  length: 'full' | 'partial' // full width or partial
  customColor?: string
}

export interface VerticalLine {
  position: 'left' | 'right' | 'center'
  offset: number
  width: number
  color: ColorSource
  height: 'full' | 'partial'
  customColor?: string
}

export interface BorderConfig {
  enabled: boolean
  sides: BorderSide[]
  width: number
  style: BorderStyle
  color: ColorSource
  customColor?: string
  radius: number
}

export interface LineConfig {
  horizontal: HorizontalLine[]
  vertical: VerticalLine[]
}

export interface DividerConfig {
  enabled: boolean
  type: DividerType
  position: number // percentage or pixels
  width: number
  color: ColorSource
  style: BorderStyle
  customColor?: string
}

export interface FrameConfig {
  enabled: boolean
  type: FrameType
  sides: BorderSide[]
  width: number
  color: ColorSource
  customColor?: string
  padding: number
  radius: number
}

export interface BackgroundSection {
  position: 'left' | 'right' | 'top' | 'bottom'
  width: number // percentage
  color: ColorSource
  customColor?: string
  gradient?: boolean
}

export interface Decoration {
  type: DecorationType
  position: { x: number; y: number } // percentage
  size: number
  color: ColorSource
  customColor?: string
  opacity: number
}

export interface CoverStyleConfig {
  id: string
  label: string
  textPosition: TextPosition
  textAlignment: TextAlignment
  borders: BorderConfig
  lines: LineConfig
  dividers: DividerConfig
  frame: FrameConfig
  backgroundSections: BackgroundSection[]
  decorations: Decoration[]
  specialLayout?: 'joy' | 'split' | 'story' // Special layout types that need custom rendering
}

export const coverStyleConfigs: Record<string, CoverStyleConfig> = {
  center: {
    id: 'center',
    label: 'Summit',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [],
    decorations: [
      { type: 'dot', position: { x: 25, y: 25 }, size: 8, color: 'accent', opacity: 0.2 },
      { type: 'dot', position: { x: 75, y: 33 }, size: 6, color: 'accent', opacity: 0.3 },
      { type: 'dot', position: { x: 33, y: 75 }, size: 4, color: 'accent', opacity: 0.25 },
    ],
  },
  joy: {
    id: 'joy',
    label: 'Celebration',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [],
    decorations: [
      { type: 'sparkle', position: { x: 25, y: 25 }, size: 6, color: 'accent', opacity: 0.4 },
      { type: 'sparkle', position: { x: 75, y: 33 }, size: 4, color: 'accent', opacity: 0.5 },
      { type: 'sparkle', position: { x: 33, y: 75 }, size: 6, color: 'accent', opacity: 0.35 },
    ],
    specialLayout: 'joy',
  },
  left: {
    id: 'left',
    label: 'Horizon',
    textPosition: 'bottom',
    textAlignment: 'left',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [
        {
          position: 'above',
          offset: 16,
          width: 2,
          color: 'accent',
          length: 'partial',
        },
      ],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [],
    decorations: [],
  },
  novel: {
    id: 'novel',
    label: 'Split',
    textPosition: 'center',
    textAlignment: 'left',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [
      { position: 'left', width: 50, color: 'primary', gradient: false },
      { position: 'right', width: 50, color: 'accent', gradient: false },
    ],
    decorations: [],
    specialLayout: 'split',
  },
  vintage: {
    id: 'vintage',
    label: 'Timeless',
    textPosition: 'bottom',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [],
    decorations: [],
  },
  frame: {
    id: 'frame',
    label: 'Gallery',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: true,
      type: 'full',
      sides: ['top', 'right', 'bottom', 'left'],
      width: 4,
      color: 'accent',
      padding: 32,
      radius: 8,
    },
    backgroundSections: [],
    decorations: [],
  },
  stripe: {
    id: 'stripe',
    label: 'Elegant',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [
        {
          position: 'above',
          offset: 20,
          width: 1,
          color: 'accent',
          length: 'full',
        },
        {
          position: 'below',
          offset: 20,
          width: 1,
          color: 'accent',
          length: 'full',
        },
      ],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [
      { position: 'top', width: 33, color: 'accent', gradient: false },
      { position: 'bottom', width: 33, color: 'accent', gradient: false },
    ],
    decorations: [],
  },
  divider: {
    id: 'divider',
    label: 'Contrast',
    textPosition: 'center',
    textAlignment: 'left',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: true,
      type: 'vertical',
      position: 50, // 50% from left
      width: 2,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [
      { position: 'left', width: 50, color: 'primary', gradient: false },
      { position: 'right', width: 50, color: 'accent', gradient: false },
    ],
    decorations: [],
  },
  journal: {
    id: 'journal',
    label: 'Story',
    textPosition: 'center',
    textAlignment: 'right',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [
      { position: 'left', width: 50, color: 'primary', gradient: false },
      { position: 'right', width: 50, color: 'primary', gradient: false },
    ],
    decorations: [],
    specialLayout: 'story',
  },
  stamp: {
    id: 'stamp',
    label: 'Minimal',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [],
    decorations: [
      {
        type: 'square',
        position: { x: 50, y: 20 },
        size: 32,
        color: 'accent',
        opacity: 0.7,
      },
    ],
  },
  outline: {
    id: 'outline',
    label: 'Focus',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: true,
      type: 'inset',
      sides: ['top', 'right', 'bottom', 'left'],
      width: 4,
      color: 'accent',
      padding: 32,
      radius: 8,
    },
    backgroundSections: [],
    decorations: [],
  },
  classic: {
    id: 'classic',
    label: 'Heritage',
    textPosition: 'bottom',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [],
    decorations: [],
  },
  none: {
    id: 'none',
    label: 'Clean',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [],
    decorations: [],
  },
  more: {
    id: 'more',
    label: 'Custom',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: false,
      sides: [],
      width: 0,
      style: 'solid',
      color: 'accent',
      radius: 0,
    },
    lines: {
      horizontal: [],
      vertical: [],
    },
    dividers: {
      enabled: false,
      type: 'vertical',
      position: 0,
      width: 0,
      color: 'accent',
      style: 'solid',
    },
    frame: {
      enabled: false,
      type: 'full',
      sides: [],
      width: 0,
      color: 'accent',
      padding: 0,
      radius: 0,
    },
    backgroundSections: [],
    decorations: [
      { type: 'dot', position: { x: 50, y: 40 }, size: 4, color: 'accent', opacity: 0.7 },
      { type: 'dot', position: { x: 50, y: 50 }, size: 4, color: 'accent', opacity: 0.7 },
      { type: 'dot', position: { x: 50, y: 60 }, size: 4, color: 'accent', opacity: 0.7 },
    ],
  },
}

/**
 * Get cover style configuration by ID
 */
export function getCoverStyleConfig(coverId: string): CoverStyleConfig {
  return coverStyleConfigs[coverId] || coverStyleConfigs.center
}
