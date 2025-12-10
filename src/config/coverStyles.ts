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
  // 1. Modern - Clean centered with subtle geometric accents
  modern: {
    id: 'modern',
    label: 'Modern',
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
      { type: 'circle', position: { x: 20, y: 20 }, size: 12, color: 'accent', opacity: 0.15 },
      { type: 'circle', position: { x: 80, y: 80 }, size: 16, color: 'accent', opacity: 0.12 },
      { type: 'square', position: { x: 75, y: 25 }, size: 8, color: 'accent', opacity: 0.2 },
    ],
  },
  // 2. Elegant Frame - Sophisticated border frame
  elegant: {
    id: 'elegant',
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
      width: 3,
      color: 'accent',
      padding: 40,
      radius: 12,
    },
    backgroundSections: [],
    decorations: [],
  },
  // 3. Bold Statement - Strong horizontal lines
  bold: {
    id: 'bold',
    label: 'Bold',
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
          offset: 24,
          width: 3,
          color: 'accent',
          length: 'full',
        },
        {
          position: 'below',
          offset: 24,
          width: 3,
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
    backgroundSections: [],
    decorations: [],
  },
  // 4. Asymmetric - Dynamic left-aligned with accent line
  asymmetric: {
    id: 'asymmetric',
    label: 'Asymmetric',
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
          offset: 20,
          width: 2,
          color: 'accent',
          length: 'partial',
        },
      ],
      vertical: [
        {
          position: 'left',
          offset: -40,
          width: 4,
          color: 'accent',
          height: 'partial',
        },
      ],
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
  // 5. Geometric - Modern geometric shapes
  geometric: {
    id: 'geometric',
    label: 'Geometric',
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
      { type: 'square', position: { x: 25, y: 30 }, size: 20, color: 'accent', opacity: 0.25 },
      { type: 'circle', position: { x: 75, y: 70 }, size: 24, color: 'accent', opacity: 0.2 },
      { type: 'square', position: { x: 50, y: 15 }, size: 12, color: 'accent', opacity: 0.3 },
    ],
  },
  // 6. Classic Border - Traditional border treatment
  classic: {
    id: 'classic',
    label: 'Classic',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: true,
      sides: ['top', 'right', 'bottom', 'left'],
      width: 2,
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
  // 7. Split Screen - Vertical divider with dual backgrounds
  split: {
    id: 'split',
    label: 'Split',
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
      enabled: true,
      type: 'vertical',
      position: 50,
      width: 3,
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
  // 8. Spotlight - Centered with decorative elements
  spotlight: {
    id: 'spotlight',
    label: 'Spotlight',
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
      width: 2,
      color: 'accent',
      padding: 48,
      radius: 16,
    },
    backgroundSections: [],
    decorations: [
      { type: 'circle', position: { x: 50, y: 50 }, size: 200, color: 'accent', opacity: 0.08 },
    ],
  },
  // 9. Minimalist - Ultra clean with single accent
  minimalist: {
    id: 'minimalist',
    label: 'Minimalist',
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
          position: 'below',
          offset: 16,
          width: 1,
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
  // 10. Celebration - Joyful with sparkles
  celebration: {
    id: 'celebration',
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
      { type: 'sparkle', position: { x: 20, y: 25 }, size: 8, color: 'accent', opacity: 0.5 },
      { type: 'sparkle', position: { x: 80, y: 30 }, size: 6, color: 'accent', opacity: 0.6 },
      { type: 'sparkle', position: { x: 30, y: 75 }, size: 7, color: 'accent', opacity: 0.45 },
      { type: 'sparkle', position: { x: 70, y: 70 }, size: 5, color: 'accent', opacity: 0.55 },
    ],
    specialLayout: 'joy',
  },
  // 11. Horizon - Bottom left placement with accent line
  horizon: {
    id: 'horizon',
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
          offset: 18,
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
  // 12. Floating - Top center with decorative elements
  floating: {
    id: 'floating',
    label: 'Floating',
    textPosition: 'top',
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
      { type: 'circle', position: { x: 50, y: 30 }, size: 20, color: 'accent', opacity: 0.2 },
      { type: 'dot', position: { x: 30, y: 25 }, size: 6, color: 'accent', opacity: 0.3 },
      { type: 'dot', position: { x: 70, y: 25 }, size: 6, color: 'accent', opacity: 0.3 },
    ],
  },
  // 13. Corner - Top right placement
  corner: {
    id: 'corner',
    label: 'Corner',
    textPosition: 'top',
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
      vertical: [
        {
          position: 'right',
          offset: -30,
          width: 3,
          color: 'accent',
          height: 'partial',
        },
      ],
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
  // 14. Diagonal - Creative diagonal placement
  diagonal: {
    id: 'diagonal',
    label: 'Diagonal',
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
    backgroundSections: [{ position: 'top', width: 60, color: 'primary', gradient: true }],
    decorations: [
      { type: 'square', position: { x: 25, y: 75 }, size: 16, color: 'accent', opacity: 0.25 },
    ],
  },
  // 15. Layered - Multiple background sections
  layered: {
    id: 'layered',
    label: 'Layered',
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
    backgroundSections: [
      { position: 'top', width: 40, color: 'primary', gradient: false },
      { position: 'bottom', width: 40, color: 'accent', gradient: false },
    ],
    decorations: [],
  },
  // 16. Framed - Double frame effect
  framed: {
    id: 'framed',
    label: 'Framed',
    textPosition: 'center',
    textAlignment: 'center',
    borders: {
      enabled: true,
      sides: ['top', 'right', 'bottom', 'left'],
      width: 2,
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
      width: 2,
      color: 'accent',
      padding: 36,
      radius: 8,
    },
    backgroundSections: [],
    decorations: [],
  },
  // 17. Minimal - Ultra clean, no decorations
  minimal: {
    id: 'minimal',
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
    decorations: [],
  },
  // 18. Dynamic - Multiple horizontal lines
  dynamic: {
    id: 'dynamic',
    label: 'Dynamic',
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
          offset: 32,
          width: 2,
          color: 'accent',
          length: 'full',
        },
        {
          position: 'above',
          offset: 20,
          width: 1,
          color: 'accent',
          length: 'partial',
        },
        {
          position: 'below',
          offset: 20,
          width: 1,
          color: 'accent',
          length: 'partial',
        },
        {
          position: 'below',
          offset: 32,
          width: 2,
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
    backgroundSections: [],
    decorations: [],
  },
  // 19. Structured - Grid-like with vertical lines
  structured: {
    id: 'structured',
    label: 'Structured',
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
      vertical: [
        {
          position: 'left',
          offset: -50,
          width: 2,
          color: 'accent',
          height: 'full',
        },
        {
          position: 'right',
          offset: -50,
          width: 2,
          color: 'accent',
          height: 'full',
        },
      ],
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
  // 20. Artistic - Creative placement with mixed elements
  artistic: {
    id: 'artistic',
    label: 'Artistic',
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
      horizontal: [
        {
          position: 'above',
          offset: 24,
          width: 1,
          color: 'accent',
          length: 'partial',
        },
      ],
      vertical: [
        {
          position: 'left',
          offset: -35,
          width: 3,
          color: 'accent',
          height: 'partial',
        },
      ],
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
      { type: 'circle', position: { x: 80, y: 30 }, size: 14, color: 'accent', opacity: 0.3 },
      { type: 'square', position: { x: 15, y: 70 }, size: 10, color: 'accent', opacity: 0.25 },
    ],
  },
  // None - No cover photo, content as navbar
  none: {
    id: 'none',
    label: 'None',
    textPosition: 'top',
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
    backgroundSections: [],
    decorations: [],
    specialLayout: 'none',
  },
}

/**
 * Get cover style configuration by ID
 */
export function getCoverStyleConfig(coverId: string): CoverStyleConfig {
  return coverStyleConfigs[coverId] || coverStyleConfigs.modern
}
