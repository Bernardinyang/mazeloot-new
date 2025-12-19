/**
 * Selections API composable
 * Handles all selection phase-related API calls
 * Uses localStorage for persistence until backend is ready
 */

import { storage } from '@/utils/storage'
import { generateUUID } from '@/utils/uuid'
import { delay } from '@/utils/delay'
import { generateRandomColorFromPalette } from '@/utils/colors'

const SELECTIONS_STORAGE_KEY = 'mazeloot_selections'
const MEDIA_STORAGE_KEY = 'mazeloot_media'
const DELETED_MEDIA_STORAGE_KEY = 'mazeloot_deleted_media'

/**
 * Get all selections from localStorage
 */
const getAllSelections = () => {
  const selections = storage.get(SELECTIONS_STORAGE_KEY)
  if (!selections || selections.length === 0) {
    return []
  }
  return selections
}

/**
 * Save selections to localStorage
 */
const saveSelections = selections => {
  storage.set(SELECTIONS_STORAGE_KEY, selections)
}

/**
 * Get all media from localStorage
 */
const getAllMedia = () => {
  const media = storage.get(MEDIA_STORAGE_KEY)
  if (!media || media.length === 0) {
    return []
  }
  return media
}

/**
 * Save media to localStorage
 */
const saveMedia = media => {
  storage.set(MEDIA_STORAGE_KEY, media)
}

/**
 * Get deleted media (for recovery)
 */
const getDeletedMedia = () => {
  const deleted = storage.get(DELETED_MEDIA_STORAGE_KEY)
  if (!deleted || deleted.length === 0) {
    return []
  }
  return deleted
}

/**
 * Save deleted media (for recovery)
 */
const saveDeletedMedia = deleted => {
  storage.set(DELETED_MEDIA_STORAGE_KEY, deleted)
}

export function useSelectionsApi() {
  /**
   * Create selection phase
   */
  const createSelection = async (projectId, data) => {
    await delay(500)

    const selections = getAllSelections()

    const newSelection = {
      id: generateUUID(),
      projectId,
      name: data.name || 'Selections',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      selectionCompletedAt: null,
      autoDeleteDate: null,
      color: data.color || generateRandomColorFromPalette(),
      mediaSets: data.mediaSets || [],
    }

    selections.push(newSelection)
    saveSelections(selections)

    return newSelection
  }

  /**
   * Fetch selection by ID
   */
  const fetchSelection = async id => {
    await delay(300)

    const selections = getAllSelections()
    const selection = selections.find(s => s.id === id)

    if (!selection) {
      throw new Error(`Selection not found: ${id}`)
    }

    // Get media for this selection
    const allMedia = getAllMedia()
    const selectionMedia = allMedia.filter(m => m.phase === 'selection' && m.phaseId === id)

    return {
      ...selection,
      media: selectionMedia,
    }
  }

  /**
   * Update selection
   */
  const updateSelection = async (id, data) => {
    await delay(300)

    const selections = getAllSelections()
    const index = selections.findIndex(s => s.id === id)

    if (index === -1) {
      throw new Error('Selection not found')
    }

    selections[index] = {
      ...selections[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    saveSelections(selections)

    return selections[index]
  }

  /**
   * Complete selection - mark as completed and set auto-delete date
   */
  const completeSelection = async id => {
    await delay(500)

    const selections = getAllSelections()
    const index = selections.findIndex(s => s.id === id)

    if (index === -1) {
      throw new Error('Selection not found')
    }

    const now = new Date()
    const autoDeleteDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

    selections[index] = {
      ...selections[index],
      status: 'completed',
      selectionCompletedAt: now.toISOString(),
      autoDeleteDate: autoDeleteDate.toISOString(),
      updatedAt: now.toISOString(),
    }

    saveSelections(selections)

    // Get unselected media and mark for deletion
    const allMedia = getAllMedia()
    const selectionMedia = allMedia.filter(
      m => m.phase === 'selection' && m.phaseId === id && !m.isSelected
    )

    // Move unselected media to deleted media (for recovery)
    const deletedMedia = getDeletedMedia()
    selectionMedia.forEach(media => {
      deletedMedia.push({
        ...media,
        deletedAt: now.toISOString(),
        selectionId: id,
        canRecoverUntil: autoDeleteDate.toISOString(),
      })
    })

    saveDeletedMedia(deletedMedia)

    // Remove unselected media from active media
    const selectedMedia = allMedia.filter(
      m => !(m.phase === 'selection' && m.phaseId === id && !m.isSelected)
    )
    saveMedia(selectedMedia)

    return selections[index]
  }

  /**
   * Recover deleted media (within 30 days)
   */
  const recoverDeletedMedia = async selectionId => {
    await delay(500)

    const deletedMedia = getDeletedMedia()
    const now = new Date()

    // Find media that can still be recovered
    const recoverable = deletedMedia.filter(
      m => m.selectionId === selectionId && new Date(m.canRecoverUntil) > now
    )

    if (recoverable.length === 0) {
      throw new Error('No recoverable media found or recovery period expired')
    }

    // Restore media to active media
    const allMedia = getAllMedia()
    recoverable.forEach(media => {
      const { deletedAt, selectionId, canRecoverUntil, ...restoredMedia } = media
      allMedia.push(restoredMedia)
    })

    saveMedia(allMedia)

    // Remove from deleted media
    const remainingDeleted = deletedMedia.filter(
      m => !(m.selectionId === selectionId && new Date(m.canRecoverUntil) > now)
    )
    saveDeletedMedia(remainingDeleted)

    return recoverable
  }

  /**
   * Get only selected media
   */
  const getSelectedMedia = async selectionId => {
    await delay(300)

    const allMedia = getAllMedia()
    return allMedia.filter(
      m => m.phase === 'selection' && m.phaseId === selectionId && m.isSelected === true
    )
  }

  /**
   * Copy selected filenames for editing
   */
  const copyFilenames = async selectionId => {
    await delay(300)

    const selectedMedia = await getSelectedMedia(selectionId)
    const filenames = selectedMedia.map(m => m.title || m.filename || '').filter(Boolean)

    return filenames
  }

  /**
   * Fetch all selections (both standalone and project-linked)
   */
  const fetchAllSelections = async () => {
    await delay(300)

    const selections = getAllSelections()
    const allMedia = getAllMedia()

    // Get projects for project name lookup
    const { useProjectsApi } = await import('@/api/projects')
    const projectsApi = useProjectsApi()
    let projects = []
    try {
      projects = await projectsApi.fetchProjects({ parentId: null })
    } catch (err) {
      console.warn('Failed to load projects for selection enrichment:', err)
    }

    // Enrich each selection with media count and project name
    return selections.map(selection => {
      const selectionMedia = allMedia.filter(
        m => m.phase === 'selection' && m.phaseId === selection.id
      )
      const project = selection.projectId ? projects.find(p => p.id === selection.projectId) : null
      return {
        ...selection,
        mediaCount: selectionMedia.length,
        selectedMediaCount: selectionMedia.filter(m => m.isSelected).length,
        projectName: project?.name || null,
      }
    })
  }

  /**
   * Toggle star status
   */
  const toggleStar = async (id, isStarred) => {
    await delay(300)

    const selections = getAllSelections()
    const index = selections.findIndex(s => s.id === id)

    if (index !== -1) {
      selections[index].isStarred = isStarred
      selections[index].starred = isStarred
      saveSelections(selections)
    }
  }

  return {
    createSelection,
    fetchSelection,
    fetchAllSelections,
    updateSelection,
    completeSelection,
    recoverDeletedMedia,
    getSelectedMedia,
    copyFilenames,
    toggleStar,
  }
}
