/**
 * Projects API composable
 * Handles all project-related API calls
 * Uses localStorage for persistence until backend is ready
 */

import { storage } from '@/shared/utils/storage'
import { generateUUID } from '@/shared/utils/uuid'
import { delay } from '@/shared/utils/delay'
import { generateRandomColorFromPalette } from '@/shared/utils/colors'
import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'
import { API_CONFIG } from '@/shared/api/config'

const PROJECTS_STORAGE_KEY = 'mazeloot_projects'
const SELECTIONS_STORAGE_KEY = 'mazeloot_selections'
const PROOFING_STORAGE_KEY = 'mazeloot_proofing'

/**
 * Get all projects from localStorage
 */
const getAllProjects = () => {
  const projects = storage.get(PROJECTS_STORAGE_KEY)
  if (!projects || projects.length === 0) {
    return []
  }
  return projects
}

/**
 * Save projects to localStorage
 */
const saveProjects = projects => {
  storage.set(PROJECTS_STORAGE_KEY, projects)
}

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
 * Get all proofing from localStorage
 */
const getAllProofing = () => {
  const proofing = storage.get(PROOFING_STORAGE_KEY)
  if (!proofing || proofing.length === 0) {
    return []
  }
  return proofing
}

/**
 * Save proofing to localStorage
 */
const saveProofing = proofing => {
  storage.set(PROOFING_STORAGE_KEY, proofing)
}

export function useProjectsApi() {
  /**
   * Fetch all projects with optional search, filter, and pagination parameters
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status
   * @param {string} params.search - Search query
   * @param {string} params.parentId - Filter by parent ID
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}|Array>}
   */
  const fetchProjects = async params => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const queryParams = new URLSearchParams()

        if (params?.status && params.status !== 'all') {
          queryParams.append('status', params.status)
        }

        if (params?.search && params.search.trim()) {
          queryParams.append('search', params.search.trim())
        }

        if (params?.sortBy) {
          queryParams.append('sortBy', params.sortBy)
        }

        if (params?.parentId !== undefined) {
          queryParams.append('parentId', params.parentId || '')
        }

        if (params?.page) {
          queryParams.append('page', params.page.toString())
        }

        if (params?.perPage) {
          queryParams.append('per_page', params.perPage.toString())
        }

        const endpoint = `/v1/memora/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        const response = await apiClient.get(endpoint)

        return response.data
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation with pagination support
    await delay(500)

    let projects = getAllProjects()

    // Filter by parentId if provided
    if (params?.parentId !== undefined) {
      projects = projects.filter(p => p.parentId === params.parentId)
    } else if (params?.parentId === null) {
      // If explicitly null, show only root-level items
      projects = projects.filter(p => p.parentId === null)
    }

    // Apply other filters if provided
    if (params?.status && params.status !== 'all') {
      projects = projects.filter(p => p.status === params.status)
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      projects = projects.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const page = params?.page || 1
    const perPage = params?.perPage || 10
    const total = projects.length
    const totalPages = Math.ceil(total / perPage)
    const start = (page - 1) * perPage
    const end = start + perPage
    const paginatedProjects = projects.slice(start, end)

    // Return paginated response format
    return {
      data: paginatedProjects,
      pagination: {
        page,
        limit: perPage,
        total,
        totalPages,
      },
    }
  }

  /**
   * Fetch single project by ID
   */
  const fetchProject = async id => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const response = await apiClient.get(`/v1/memora/projects/${id}`)
        return response.data
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(500)

    const projects = getAllProjects()
    const project = projects.find(p => p.id === id)

    if (!project) {
      throw new Error(`Project not found: ${id}`)
    }

    const selections = getAllSelections().filter(s => s.projectId === id)
    const proofing = getAllProofing().filter(p => p.projectId === id)
    const collections = storage.get('mazeloot_collections') || []
    const projectCollections = collections.filter(c => c.projectId === id)

    return {
      ...project,
      selection: selections[0] || null,
      proofing: proofing[0] || null,
      collection: projectCollections[0] || null,
    }
  }

  /**
   * Create new project
   */
  const createProject = async data => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        // Prepare request payload matching backend StoreProjectRequest
        const payload = {
          name: data.name,
          description: data.description || null,
          status: data.status || 'draft',
          hasSelections: data.hasSelections || false,
          hasProofing: data.hasProofing || false,
          hasCollections: data.hasCollections || false,
          parentId: data.parentId || null,
          presetId: data.presetId || data.settings?.presetId || null,
          watermarkId: data.watermarkId || data.settings?.watermarkId || null,
          settings: data.settings || {},
          color: data.color || null,
          // Phase settings
          selectionSettings: data.selectionSettings || null,
          proofingSettings: data.proofingSettings || null,
          collectionSettings: data.collectionSettings || null,
        }

        // Include mediaSets if provided
        if (data.mediaSets && Array.isArray(data.mediaSets) && data.mediaSets.length > 0) {
          payload.mediaSets = data.mediaSets.map(set => ({
            name: set.name,
            description: set.description || null,
            order: set.order || 0,
          }))
        }

        const response = await apiClient.post('/v1/memora/projects', payload)
        return response.data
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(1000)

    const projects = getAllProjects()

    let preset = null
    if (data.presetId) {
      // Use preset store to get preset
      const { usePresetStore } = await import('@/domains/memora/stores/preset')
      const presetStore = usePresetStore()
      preset = presetStore.getPresetById(data.presetId)
    }

    // Convert preset photoSets to mediaSets if preset exists
    let mediaSets = data.mediaSets
    if (preset && preset.photoSets && preset.photoSets.length > 0) {
      mediaSets = preset.photoSets.map((setName, index) => ({
        id: `set-${generateUUID()}`,
        name: setName,
        description: '',
        count: 0,
        order: index,
      }))
    } else if (!mediaSets) {
      // Default to Highlights if no sets provided
      mediaSets = [{ id: 'highlights', name: 'Highlights', count: 0, order: 0 }]
    }

    // Determine watermarkId
    let watermarkId = data.watermarkId
    if (!watermarkId && preset && preset.defaultWatermarkId && preset.defaultWatermarkId !== 'none') {
      watermarkId = preset.defaultWatermarkId
    }

    // Parse collection tags from preset
    let tags = []
    if (preset && preset.collectionTags) {
      if (typeof preset.collectionTags === 'string') {
        tags = preset.collectionTags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      } else if (Array.isArray(preset.collectionTags)) {
        tags = [...preset.collectionTags]
      }
    }

    // Build project object
    const newProject = {
      id: generateUUID(),
      name: data.name,
      description: data.description || '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: data.parentId || null,
      date: data.eventDate
        ? typeof data.eventDate === 'string'
          ? data.eventDate
          : data.eventDate.toISOString()
        : undefined,
      mediaSets: mediaSets,
      color: data.color || generateRandomColorFromPalette(),
      settings: {
        // Shared settings that all phases inherit
        presetId: data.presetId || undefined,
        watermarkId: watermarkId || undefined,
        tags: tags,
        // Apply preset settings if available
        ...(preset && {
          emailRegistration: preset.emailRegistration ?? false,
          galleryAssist: preset.galleryAssist ?? false,
          slideshow: preset.slideshow ?? true,
          socialSharing: preset.socialSharing ?? true,
          language: preset.language || 'en',
        }),
      },
      hasSelections: data.hasSelections || false,
      hasProofing: data.hasProofing || false,
      hasCollections: data.hasCollections || false,
    }

    projects.push(newProject)
    saveProjects(projects)

    const selections = getAllSelections()
    const proofing = getAllProofing()

    if (data.hasSelections) {
      const newSelection = {
        id: generateUUID(),
        projectId: newProject.id,
        name: 'Selections',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        selectionCompletedAt: null,
        autoDeleteDate: null,
      }
      selections.push(newSelection)
      saveSelections(selections)
    }

    if (data.hasProofing) {
      const newProofing = {
        id: generateUUID(),
        projectId: newProject.id,
        name: 'Proofing',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        maxRevisions: data.maxRevisions || 5,
        currentRevision: 0,
      }
      proofing.push(newProofing)
      saveProofing(proofing)
    }

    if (data.hasCollections) {
      const collections = storage.get('mazeloot_collections') || []
      const newCollection = {
        id: generateUUID(),
        name: `${newProject.name} - Collection`,
        description: 'Collection for final approved media',
        projectId: newProject.id,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mediaSets: newProject.mediaSets,
        itemCount: 0,
        isStarred: false,
        isLocked: false,
        isFolder: false,
        // Inherit project settings
        presetId: newProject.settings.presetId,
        watermarkId: newProject.settings.watermarkId,
        tags: newProject.settings.tags || [],
      }
      collections.push(newCollection)
      storage.set('mazeloot_collections', collections)
    }

    return newProject
  }

  /**
   * Update project
   */
  const updateProject = async (id, data) => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        // Prepare request payload matching backend UpdateProjectRequest
        const payload = {}

        if (data.name !== undefined) payload.name = data.name
        if (data.description !== undefined) payload.description = data.description
        if (data.status !== undefined) payload.status = data.status
        if (data.settings !== undefined) payload.settings = data.settings
        if (data.color !== undefined) payload.color = data.color
        if (data.presetId !== undefined) payload.presetId = data.presetId
        if (data.watermarkId !== undefined) payload.watermarkId = data.watermarkId
        if (data.eventDate !== undefined) {
          payload.eventDate = data.eventDate
            ? typeof data.eventDate === 'string'
              ? data.eventDate
              : data.eventDate.toISOString()
            : null
        }

        // Include mediaSets if provided
        if (data.mediaSets !== undefined) {
          payload.mediaSets = data.mediaSets.map(set => ({
            name: set.name,
            description: set.description || null,
            order: set.order || 0,
          }))
        }

        // Include phase flags and settings if provided
        if (data.hasSelections !== undefined) payload.hasSelections = data.hasSelections
        if (data.hasProofing !== undefined) payload.hasProofing = data.hasProofing
        if (data.hasCollections !== undefined) payload.hasCollections = data.hasCollections
        
        if (data.selectionSettings !== undefined) {
          payload.selectionSettings = {
            name: data.selectionSettings.name,
            description: data.selectionSettings.description || null,
            selectionLimit: data.selectionSettings.selectionLimit || 0,
          }
        }
        
        if (data.proofingSettings !== undefined) {
          payload.proofingSettings = {
            name: data.proofingSettings.name,
            description: data.proofingSettings.description ?? null,
            maxRevisions: data.proofingSettings.maxRevisions || 5,
          }
        }
        
        if (data.collectionSettings !== undefined) {
          payload.collectionSettings = {
            name: data.collectionSettings.name,
            description: data.collectionSettings.description || null,
          }
        }

        const response = await apiClient.patch(`/v1/memora/projects/${id}`, payload)
        return response.data
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(500)

    const projects = getAllProjects()
    const index = projects.findIndex(p => p.id === id)

    if (index === -1) {
      throw new Error('Project not found')
    }

    let dateValue = projects[index].date
    if (data.eventDate !== undefined) {
      if (data.eventDate === null) {
        dateValue = undefined
      } else {
        dateValue =
          typeof data.eventDate === 'string' ? data.eventDate : data.eventDate.toISOString()
      }
    }

    projects[index] = {
      ...projects[index],
      name: data.name !== undefined ? data.name : projects[index].name,
      description: data.description !== undefined ? data.description : projects[index].description,
      date: dateValue,
      color: data.color !== undefined ? data.color : projects[index].color,
      presetId: data.presetId !== undefined ? data.presetId : projects[index].presetId,
      watermarkId: data.watermarkId !== undefined ? data.watermarkId : projects[index].watermarkId,
      updatedAt: new Date().toISOString(),
    }

    saveProjects(projects)

    return projects[index]
  }

  /**
   * Delete project
   */
  const deleteProject = async id => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        await apiClient.delete(`/v1/memora/projects/${id}`)
        return
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(500)

    const projects = getAllProjects()
    const filtered = projects.filter(p => p.id !== id)

    // Also delete associated phases
    const selections = getAllSelections()
    const filteredSelections = selections.filter(s => s.projectId !== id)
    saveSelections(filteredSelections)

    const proofing = getAllProofing()
    const filteredProofing = proofing.filter(p => p.projectId !== id)
    saveProofing(filteredProofing)

    // Note: Collections linked to project should be handled separately
    // They might be converted to standalone collections

    saveProjects(filtered)
  }

  /**
   * Get all phases for a project
   */
  const getProjectPhases = async projectId => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const response = await apiClient.get(`/v1/memora/projects/${projectId}/phases`)
        // Backend returns { selection, proofing, collection } format
        // Convert to frontend expected format
        const phases = response.data
        return {
          selection: phases.selection ? [phases.selection] : [],
          proofing: phases.proofing ? [phases.proofing] : [],
          collections: phases.collection ? [phases.collection] : [],
        }
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(300)

    const selections = getAllSelections().filter(s => s.projectId === projectId)
    const proofing = getAllProofing().filter(p => p.projectId === projectId)
    const collections = storage.get('mazeloot_collections') || []
    const projectCollections = collections.filter(c => c.projectId === projectId)

    return {
      selections,
      proofing,
      collections: projectCollections,
    }
  }

  /**
   * Toggle star status
   */
  const toggleStar = async (id, isStarred) => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const response = await apiClient.post(`/v1/memora/projects/${id}/star`)
        // Return the starred status from the response
        return response.data?.data || response.data
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(300)

    const projects = getAllProjects()
    const index = projects.findIndex(p => p.id === id)

    if (index !== -1) {
      projects[index].isStarred = isStarred
      projects[index].starred = isStarred
      saveProjects(projects)
    }
  }

  return {
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectPhases,
    toggleStar,
  }
}
