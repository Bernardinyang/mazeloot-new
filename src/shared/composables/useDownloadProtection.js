import { onUnmounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import { toast } from '@/shared/utils/toast'

/**
 * Composable for download protection
 * Prevents unauthorized downloads via right-click, keyboard shortcuts, screenshots, etc.
 * Uses VueUse for event handling and keyboard shortcut detection
 */
export function useDownloadProtection(options = {}) {
  const {
    enabled = true,
    showWarnings = false,
    onScreenshotDetected = null,
  } = options

  if (!enabled) {
    return { cleanup: () => {} }
  }

  // Block right-click context menu
  useEventListener(document, 'contextmenu', (e) => {
    e.preventDefault()
    if (showWarnings) {
      toast.warning('Right-click is disabled')
    }
  })

  // Block drag and drop on images
  useEventListener(document, 'dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault()
      if (showWarnings) {
        toast.warning('Drag and drop is disabled')
      }
    }
  })

  // Block text selection
  useEventListener(document, 'selectstart', (e) => {
    if (e.target && typeof e.target.closest === 'function' && e.target.closest('.protected-content, img, video')) {
      e.preventDefault()
    }
  })

  // Block copy/paste shortcuts on protected content
  useEventListener(document, 'copy', (e) => {
    if (e.target && typeof e.target.closest === 'function' && e.target.closest('.protected-content, img, video')) {
      e.preventDefault()
      if (showWarnings) {
        toast.warning('Copying is disabled')
      }
    }
  })

  // Keyboard shortcut blocking
  useEventListener(document, 'keydown', (e) => {
    // Save shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      e.stopPropagation()
      if (showWarnings) {
        toast.warning('This action is disabled')
      }
      return
    }

    // Dev tools shortcuts
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault()
      e.stopPropagation()
      if (showWarnings) {
        toast.warning('This action is disabled')
      }
      return
    }

    // F12
    if (e.key === 'F12') {
      e.preventDefault()
      e.stopPropagation()
      if (showWarnings) {
        toast.warning('This action is disabled')
      }
      return
    }

    // View source
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault()
      e.stopPropagation()
      if (showWarnings) {
        toast.warning('This action is disabled')
      }
      return
    }

    // Select all (only on protected content)
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      const target = e.target
      if (target && typeof target.closest === 'function' && target.closest('.protected-content, img, video')) {
        e.preventDefault()
        e.stopPropagation()
        if (showWarnings) {
          toast.warning('This action is disabled')
        }
        return
      }
    }
  })

  // Screenshot detection
  useEventListener(document, 'keydown', (e) => {
    // Print Screen key (keyCode 44)
    if (e.keyCode === 44 || e.key === 'PrintScreen') {
      if (onScreenshotDetected) {
        onScreenshotDetected(e)
      }
      if (showWarnings) {
        toast.warning('Screenshots are not allowed')
      }
    }

    // Windows + Shift + S (Windows screenshot tool)
    if (e.key === 's' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
      if (onScreenshotDetected) {
        onScreenshotDetected(e)
      }
      if (showWarnings) {
        toast.warning('Screenshots are not allowed')
      }
    }

    // Mac screenshot shortcuts: Cmd+Shift+3 or Cmd+Shift+4
    if ((e.key === '3' || e.key === '4') && e.shiftKey && e.metaKey) {
      if (onScreenshotDetected) {
        onScreenshotDetected(e)
      }
      if (showWarnings) {
        toast.warning('Screenshots are not allowed')
      }
    }

    // Alt + Print Screen
    if ((e.keyCode === 44 || e.key === 'PrintScreen') && e.altKey) {
      if (onScreenshotDetected) {
        onScreenshotDetected(e)
      }
      if (showWarnings) {
        toast.warning('Screenshots are not allowed')
      }
    }
  })

  // Dev tools detection via visibility change
  useEventListener(document, 'visibilitychange', () => {
    if (document.hidden) {
      // Tab switched away - could be opening dev tools
      // Limited effectiveness but can log
    }
  })

  // Add CSS protection class to body
  const addCSSProtection = () => {
    const style = document.createElement('style')
    style.id = 'download-protection-styles'
    style.textContent = `
      .protected-content,
      .protected-content img,
      .protected-content video {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
    `
    document.head.appendChild(style)
  }

  addCSSProtection()

  // Cleanup function
  const cleanup = () => {
    const style = document.getElementById('download-protection-styles')
    if (style) {
      style.remove()
    }
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    cleanup,
  }
}
