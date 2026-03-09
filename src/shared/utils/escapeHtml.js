/**
 * Escape HTML special characters to prevent XSS when building HTML (e.g. search highlight).
 */
const map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(text) {
  if (text == null || typeof text !== 'string') return ''
  return String(text).replace(/[&<>"']/g, (ch) => map[ch])
}
