import { watchEffect, onMounted } from 'vue'

/**
 * Composable for managing OpenGraph and Twitter Card meta tags
 * @param {Object} options
 * @param {import('vue').Ref} options.title - Page title (can include branding name)
 * @param {import('vue').Ref} options.description - Page description (bio/description)
 * @param {import('vue').Ref} options.image - Cover photo URL
 * @param {import('vue').Ref} options.isLoading - Loading state to prevent premature updates
 */
export function useOpenGraphMeta({ title, description, image, isLoading }) {
  // Helper to set meta tag
  const setMetaTag = (property, content) => {
    if (!content) return
    let meta = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      if (property.startsWith('og:')) {
        meta.setAttribute('property', property)
      } else {
        meta.setAttribute('name', property)
      }
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  // Update OpenGraph meta tags
  const updateMetaTags = () => {
    if (isLoading?.value) return
    
    const titleValue = title?.value || ''
    const descriptionValue = description?.value || ''
    const imageValue = image?.value || ''
    const url = window.location.href

    // Update title
    if (titleValue) {
      document.title = titleValue
    }

    // OpenGraph tags
    setMetaTag('og:title', titleValue)
    setMetaTag('og:description', descriptionValue)
    if (imageValue) {
      setMetaTag('og:image', imageValue)
    }
    setMetaTag('og:url', url)
    setMetaTag('og:type', 'website')

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', titleValue)
    setMetaTag('twitter:description', descriptionValue)
    if (imageValue) {
      setMetaTag('twitter:image', imageValue)
    }
  }

  // Watch for changes and update meta tags
  watchEffect(() => {
    if (!isLoading?.value && (title?.value || description?.value || image?.value)) {
      updateMetaTags()
    }
  })

  // Update on mount
  onMounted(() => {
    updateMetaTags()
  })

  return {
    updateMetaTags,
  }
}
