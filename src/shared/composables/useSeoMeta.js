import { watchEffect, onMounted, computed } from 'vue'

const BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : 'https://mazeloot.com'

const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`
const DEFAULT_DESCRIPTION = 'Professional gallery and client proofing platform for creatives. Share, organize, and deliver your work beautifully.'

/**
 * Enhanced SEO composable for managing meta tags, OpenGraph, Twitter Cards, and structured data
 * @param {Object} options
 * @param {string|import('vue').Ref<string>} options.title - Page title
 * @param {string|import('vue').Ref<string>} options.description - Page description
 * @param {string|import('vue').Ref<string>} options.image - OG image URL
 * @param {string|import('vue').Ref<string>} options.url - Canonical URL (defaults to current URL)
 * @param {string|import('vue').Ref<string>} options.type - OG type (default: 'website')
 * @param {import('vue').Ref} options.isLoading - Loading state to prevent premature updates
 * @param {Object} options.structuredData - Structured data (JSON-LD) to inject
 */
export function useSeoMeta({ 
  title, 
  description, 
  image, 
  url,
  type = 'website',
  isLoading,
  structuredData
}) {
  // Helper to get reactive value
  const getValue = (val) => {
    return typeof val === 'object' && val?.value !== undefined ? val.value : val
  }

  // Helper to set or update meta tag
  const setMetaTag = (property, content, isProperty = false) => {
    if (!content) return
    
    const selector = isProperty 
      ? `meta[property="${property}"]` 
      : `meta[name="${property}"]`
    
    let meta = document.querySelector(selector)
    if (!meta) {
      meta = document.createElement('meta')
      if (isProperty) {
        meta.setAttribute('property', property)
      } else {
        meta.setAttribute('name', property)
      }
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  // Helper to set or update link tag
  const setLinkTag = (rel, href) => {
    if (!href) return
    
    let link = document.querySelector(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', rel)
      document.head.appendChild(link)
    }
    link.setAttribute('href', href)
  }

  // Helper to inject structured data
  const injectStructuredData = (data) => {
    if (!data) return
    
    // Remove existing structured data script
    const existing = document.querySelector('script[type="application/ld+json"][data-seo-meta]')
    if (existing) {
      existing.remove()
    }

    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.setAttribute('data-seo-meta', 'true')
    script.textContent = JSON.stringify(data, null, 2)
    document.head.appendChild(script)
  }

  // Update all meta tags
  const updateMetaTags = () => {
    if (isLoading?.value) return
    
    const titleValue = getValue(title) || 'Mazeloot - Professional Gallery Platform for Creatives'
    const descriptionValue = getValue(description) || DEFAULT_DESCRIPTION
    const imageValue = getValue(image) || DEFAULT_IMAGE
    const urlValue = getValue(url) || window.location.href
    const typeValue = getValue(type) || 'website'

    // Update document title
    document.title = titleValue

    // Basic meta tags
    setMetaTag('description', descriptionValue)
    setMetaTag('theme-color', '#8B5CF6', false)

    // OpenGraph tags
    setMetaTag('og:title', titleValue, true)
    setMetaTag('og:description', descriptionValue, true)
    setMetaTag('og:image', imageValue, true)
    setMetaTag('og:url', urlValue, true)
    setMetaTag('og:type', typeValue, true)
    setMetaTag('og:site_name', 'Mazeloot', true)
    setMetaTag('og:locale', 'en_US', true)

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image', false)
    setMetaTag('twitter:title', titleValue, false)
    setMetaTag('twitter:description', descriptionValue, false)
    setMetaTag('twitter:image', imageValue, false)

    // Canonical URL
    setLinkTag('canonical', urlValue)

    // Structured data
    if (structuredData) {
      const dataValue = typeof structuredData === 'object' && structuredData?.value !== undefined 
        ? structuredData.value 
        : structuredData
      injectStructuredData(dataValue)
    }
  }

  // Watch for changes and update meta tags
  watchEffect(() => {
    if (!isLoading?.value) {
      updateMetaTags()
    }
  })

  // Update on mount
  onMounted(() => {
    updateMetaTags()
  })

  return {
    updateMetaTags,
    BASE_URL,
  }
}
