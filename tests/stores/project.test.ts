import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectStore } from '@/stores/project'

const mockApi = {
  fetchProjects: vi.fn(),
  fetchProject: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}

vi.mock('@/api/projects', () => ({
  useProjectsApi: () => mockApi,
}))

describe('Project Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const store = useProjectStore()

    expect(store.projects).toEqual([])
    expect(store.currentProject).toBeNull()
    expect(store.isLoading).toBe(false)
  })

  it('should fetch projects', async () => {
    const store = useProjectStore()
    const mockProjects = [
      { id: '1', name: 'Project 1' },
      { id: '2', name: 'Project 2' },
    ]

    mockApi.fetchProjects.mockResolvedValue(mockProjects)

    await store.fetchProjects()

    expect(store.projects).toEqual(mockProjects)
    expect(store.isLoading).toBe(false)
  })

  it('should fetch single project', async () => {
    const store = useProjectStore()
    const mockProject = { id: '1', name: 'Project 1' }

    mockApi.fetchProject.mockResolvedValue(mockProject)

    await store.fetchProject('1')

    expect(store.currentProject).toEqual(mockProject)
  })

  it('should create project', async () => {
    const store = useProjectStore()
    const newProject = { name: 'New Project' }
    const createdProject = { id: '1', ...newProject }

    mockApi.createProject.mockResolvedValue(createdProject)

    await store.createProject(newProject)

    expect(store.projects).toContainEqual(createdProject)
  })

  it('should update project', async () => {
    const store = useProjectStore()
    store.projects = [{ id: '1', name: 'Old Name' }]
    const updatedProject = { id: '1', name: 'New Name' }

    mockApi.updateProject.mockResolvedValue(updatedProject)

    await store.updateProject('1', { name: 'New Name' })

    expect(store.projects.find(p => p.id === '1')?.name).toBe('New Name')
  })

  it('should delete project', async () => {
    const store = useProjectStore()
    store.projects = [{ id: '1', name: 'Project 1' }]

    mockApi.deleteProject.mockResolvedValue(undefined)

    await store.deleteProject('1')

    expect(store.projects.find(p => p.id === '1')).toBeUndefined()
  })
})

