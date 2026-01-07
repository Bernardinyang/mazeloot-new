import { useCollectionMediaSetsSidebarStore } from '@/stores/collectionMediaSetsSidebar'
import { useSelectionMediaSetsSidebarStore } from '@/stores/selectionMediaSetsSidebar'
import { useProofingMediaSetsSidebarStore } from '@/stores/proofingMediaSetsSidebar'

/**
 * Get the appropriate media sets store based on phase type
 * @param {string} phaseType - 'collection' | 'selection' | 'proofing'
 * @returns {object} The media sets sidebar store instance
 */
export function usePhaseMediaSetsStore(phaseType) {
  switch (phaseType) {
    case 'collection':
      return useCollectionMediaSetsSidebarStore()
    case 'selection':
      return useSelectionMediaSetsSidebarStore()
    case 'proofing':
      return useProofingMediaSetsSidebarStore()
    default:
      throw new Error(`Unknown phase type: ${phaseType}`)
  }
}
