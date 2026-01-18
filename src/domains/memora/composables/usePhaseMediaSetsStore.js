import { useCollectionMediaSetsSidebarStore } from '@/domains/memora/stores/collectionMediaSetsSidebar'
import { useSelectionMediaSetsSidebarStore } from '@/domains/memora/stores/selectionMediaSetsSidebar'
import { useRawFileMediaSetsSidebarStore } from '@/domains/memora/stores/rawFileMediaSetsSidebar'
import { useProofingMediaSetsSidebarStore } from '@/domains/memora/stores/proofingMediaSetsSidebar'

/**
 * Get the appropriate media sets store based on phase type
 * @param {string} phaseType - 'collection' | 'selection' | 'rawFile' | 'proofing'
 * @returns {object} The media sets sidebar store instance
 */
export function usePhaseMediaSetsStore(phaseType) {
  switch (phaseType) {
    case 'collection':
      return useCollectionMediaSetsSidebarStore()
    case 'selection':
      return useSelectionMediaSetsSidebarStore()
    case 'rawFile':
      return useRawFileMediaSetsSidebarStore()
    case 'proofing':
      return useProofingMediaSetsSidebarStore()
    default:
      throw new Error(`Unknown phase type: ${phaseType}`)
  }
}
