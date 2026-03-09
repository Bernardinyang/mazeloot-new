import DOMPurify from 'dompurify'

/**
 * Sanitize HTML for safe v-html rendering (e.g. CMS/API content).
 * Allows common prose tags and attributes; strips scripts and event handlers.
 */
export function sanitizeHtml(dirty, options = {}) {
  if (dirty == null || typeof dirty !== 'string') return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'code', 'pre', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ...options,
  })
}
