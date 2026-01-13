import { onUnmounted, watch } from 'vue'

export function useMediaViewerFlow({
  selectedMedia,
  selectedMediaForView,
  currentViewIndex,
  showMediaViewer,
} = {}) {
  const openMediaViewer = item => {
    selectedMedia.value = item
  }

  const closeMediaViewer = () => {
    selectedMedia.value = null
    selectedMediaForView.value = []
    currentViewIndex.value = 0
    showMediaViewer.value = false
  }

  const navigateSlideshow = direction => {
    const newIndex = currentViewIndex.value + direction
    if (newIndex >= 0 && newIndex < selectedMediaForView.value.length) {
      currentViewIndex.value = newIndex
    }
  }

  const handleSlideshowKeydown = event => {
    if (!showMediaViewer.value) return

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      navigateSlideshow(-1)
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      navigateSlideshow(1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closeMediaViewer()
    }
  }

  watch(showMediaViewer, isOpen => {
    if (isOpen) {
      document.addEventListener('keydown', handleSlideshowKeydown)
    } else {
      document.removeEventListener('keydown', handleSlideshowKeydown)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleSlideshowKeydown)
  })

  return {
    openMediaViewer,
    closeMediaViewer,
    navigateSlideshow,
  }
}
