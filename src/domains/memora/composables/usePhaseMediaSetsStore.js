import { useCollectionMediaSetsSidebarStore } from '@/domains/memora/stores/collectionMediaSetsSidebar'
import { useSelectionMediaSetsSidebarStore } from '@/domains/memora/stores/selectionMediaSetsSidebar'
import { useProofingMediaSetsSidebarStore } from '@/domains/memora/stores/proofingMediaSetsSidebar'
import { useRawFilesMediaSetsSidebarStore } from '@/domains/memora/stores/rawFilesMediaSetsSidebar'

/**
 * Get the appropriate media sets store based on phase type
 * @param {string} phaseType - 'collection' | 'selection' | 'proofing' | 'raw_files'
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
    case 'raw_files':
      return useRawFilesMediaSetsSidebarStore()
    default:
      throw new Error(`Unknown phase type: ${phaseType}`)
  }
}
