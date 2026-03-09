import { describe, it, expect } from 'vitest'
import { useImagePlaceholder } from '@/shared/composables/useImagePlaceholder'
import { PLACEHOLDER_IMAGE_DATA_URL } from '@/shared/utils/placeholderImage'

describe('useImagePlaceholder', () => {
  it('returns a function', () => {
    const handler = useImagePlaceholder()
    expect(typeof handler).toBe('function')
  })

  it('sets event.target.src to placeholder when image fails', () => {
    const handler = useImagePlaceholder()
    const target = { src: 'https://example.com/broken.png' }
    handler({ target } as unknown as Event)

    expect(target.src).toBe(PLACEHOLDER_IMAGE_DATA_URL)
  })

  it('does not overwrite when target.src is already the placeholder', () => {
    const handler = useImagePlaceholder()
    const target = { src: PLACEHOLDER_IMAGE_DATA_URL }
    handler({ target } as unknown as Event)

    expect(target.src).toBe(PLACEHOLDER_IMAGE_DATA_URL)
  })

  it('handles missing target without throwing', () => {
    const handler = useImagePlaceholder()
    expect(() => handler({ target: null } as unknown as Event)).not.toThrow()
    expect(() => handler({ target: undefined } as unknown as Event)).not.toThrow()
  })
})
