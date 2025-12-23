/**
 * Project Store
 * Manages project state and operations
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProjectsApi } from '@/api/projects'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const projectsApi = useProjectsApi()

  /**
   * Fetch all projects
   */
  const fetchProjects = async params => {
    isLoading.value = true
    error.value = null

    try {
      const fetchedProjects = await projectsApi.fetchProjects(params)
      projects.value = fetchedProjects
      return fetchedProjects
    } catch (err) {
      error.value = err.message || 'Failed to fetch projects'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch single project by ID
   */
  const fetchProject = async id => {
    isLoading.value = true
    error.value = null

    try {
      const project = await projectsApi.fetchProject(id)
      currentProject.value = project
      return project
    } catch (err) {
      error.value = err.message || 'Failed to fetch project'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create new project
   */
  const createProject = async data => {
    isLoading.value = true
    error.value = null

    try {
      const newProject = await projectsApi.createProject(data)
      projects.value.push(newProject)
      return newProject
    } catch (err) {
      error.value = err.message || 'Failed to create project'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update project
   */
  const updateProject = async (id, data) => {
    isLoading.value = true
    error.value = null

    try {
      const updated = await projectsApi.updateProject(id, data)

      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = updated
      }

      if (currentProject.value && currentProject.value.id === id) {
        currentProject.value = updated
      }

      return updated
    } catch (err) {
      error.value = err.message || 'Failed to update project'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete project
   */
  const deleteProject = async id => {
    isLoading.value = true
    error.value = null

    try {
      await projectsApi.deleteProject(id)

      // Remove from projects array
      projects.value = projects.value.filter(p => p.id !== id)

      // Clear current project if it's the one being deleted
      if (currentProject.value && currentProject.value.id === id) {
        currentProject.value = null
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete project'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get project phases
   */
  const getProjectPhases = async projectId => {
    isLoading.value = true
    error.value = null

    try {
      const phases = await projectsApi.getProjectPhases(projectId)
      return phases
    } catch (err) {
      error.value = err.message || 'Failed to fetch project phases'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle star status with optimistic update
   */
  const toggleStar = async projectId => {
    const project = projects.value.find(p => p.id === projectId)
    if (!project) return

    const wasStarred = project.isStarred || project.starred || false
    const newStarredState = !wasStarred

    // Optimistic update - update UI immediately
    project.isStarred = newStarredState
    project.starred = newStarredState

    if (currentProject.value && currentProject.value.id === projectId) {
      currentProject.value.isStarred = newStarredState
      currentProject.value.starred = newStarredState
    }

    try {
      // Sync with server in background
      await projectsApi.toggleStar(projectId, newStarredState)
    } catch (err) {
      // Revert optimistic update on error
      project.isStarred = wasStarred
      project.starred = wasStarred
      if (currentProject.value && currentProject.value.id === projectId) {
        currentProject.value.isStarred = wasStarred
        currentProject.value.starred = wasStarred
      }
      throw err
    }
  }

  return {
    projects,
    currentProject,
    isLoading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectPhases,
    toggleStar,
  }
})
