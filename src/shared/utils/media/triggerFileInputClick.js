export const triggerFileInputClick = inputEl => {
  if (!inputEl) {
    console.warn('File input ref is not available')
    return
  }
  
  // Handle both ref objects and direct elements
  const element = inputEl.value || inputEl
  if (element && typeof element.click === 'function') {
    element.click()
  } else {
    console.warn('File input element not found or click method not available', { inputEl, element })
  }
}
