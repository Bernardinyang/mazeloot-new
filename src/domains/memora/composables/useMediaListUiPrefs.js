/**
 * Small UI-only handlers extracted from Photos.vue.
 * Keeps behavior identical.
 */
export function useMediaListUiPrefs({
  sortOrder,
  isSortMenuOpen,
  gridSize,
  isViewMenuOpen,
  showFilename,
}) {
  const handleSortChange = value => {
    sortOrder.value = value
    isSortMenuOpen.value = false
  }

  const handleGridSizeChange = value => {
    gridSize.value = value
    isViewMenuOpen.value = false
  }

  const handleFilenameToggle = event => {
    const target = event.target
    showFilename.value = target.checked
  }

  return { handleSortChange, handleGridSizeChange, handleFilenameToggle }
}
