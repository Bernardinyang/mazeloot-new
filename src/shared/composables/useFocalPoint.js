import { computed } from 'vue'

/**
 * Get focal point style for an image or video element
 * @param {Object|string|null} focalPoint - Focal point object {x, y} or null
 * @param {string} defaultPosition - Default position (e.g., 'center', '50% 50%')
 * @returns {Object} Style object with objectPosition property
 */
export function useFocalPoint(focalPoint, defaultPosition = '50% 50%') {
  const objectPosition = computed(() => {
    if (!focalPoint) return defaultPosition
    
    // Handle both object format {x, y} and string format
    let x = 50
    let y = 50
    
    if (typeof focalPoint === 'object' && focalPoint !== null) {
      x = focalPoint.x ?? 50
      y = focalPoint.y ?? 50
    } else if (typeof focalPoint === 'string') {
      // Try to parse if it's a JSON string
      try {
        const parsed = JSON.parse(focalPoint)
        if (parsed && typeof parsed === 'object') {
          x = parsed.x ?? 50
          y = parsed.y ?? 50
        }
      } catch {
        // If parsing fails, use default
      }
    }
    
    return `${x}% ${y}%`
  })

  const backgroundPosition = computed(() => {
    return objectPosition.value
  })

  return {
    objectPosition,
    backgroundPosition,
    imageStyle: computed(() => ({
      objectPosition: objectPosition.value,
    })),
    backgroundStyle: computed(() => ({
      backgroundPosition: backgroundPosition.value,
    })),
  }
}

/**
 * Get focal point from entity (collection, selection, proofing)
 * @param {Object} entity - Entity object
 * @returns {Object|null} Focal point object {x, y} or null
 */
export function getFocalPointFromEntity(entity) {
  if (!entity) return null
  
  // Try different possible field names
  const focalPoint = 
    entity.coverFocalPoint ||
    entity.cover_focal_point ||
    entity.design?.cover?.coverFocalPoint ||
    entity.design?.cover?.cover_focal_point ||
    entity.coverDesign?.coverFocalPoint ||
    entity.coverDesign?.cover_focal_point ||
    null
  
  if (!focalPoint) return null
  
  // Ensure it's an object with x and y
  if (typeof focalPoint === 'object' && focalPoint.x !== undefined && focalPoint.y !== undefined) {
    return { x: focalPoint.x, y: focalPoint.y }
  }
  
  // Try parsing if it's a string
  if (typeof focalPoint === 'string') {
    try {
      const parsed = JSON.parse(focalPoint)
      if (parsed && typeof parsed === 'object' && parsed.x !== undefined && parsed.y !== undefined) {
        return { x: parsed.x, y: parsed.y }
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  return null
}
