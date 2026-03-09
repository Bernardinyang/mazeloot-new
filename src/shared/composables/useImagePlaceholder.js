import { PLACEHOLDER_IMAGE_DATA_URL } from '@/shared/utils/placeholderImage'

/** Handler for img @error to show placeholder instead of broken icon. */
export function useImagePlaceholder() {
  return e => {
    const img = e?.target
    if (!img || img.src === PLACEHOLDER_IMAGE_DATA_URL) return
    img.src = PLACEHOLDER_IMAGE_DATA_URL
  }
}
