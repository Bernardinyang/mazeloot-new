# Project-Based Media Management System - Frontend Implementation Plan

## Architecture Principles

### API Abstraction Layer

All API calls go through composables that abstract the data source. This allows:

- **Development**: Use mock data (localStorage/IndexedDB)
- **Production**: Swap to real API endpoints with zero UI changes
- **Testing**: Easy to mock and test

### Key Patterns

1. **API Composables**: Return functions that match expected API contract
2. **Stores**: Use API composables, manage state with optimistic updates
3. **Workflow Composables**: Business logic that orchestrates API calls
4. **Clear Contracts**: JSDoc comments document expected request/response shapes

---

## Phase 1: API Layer (API-Agnostic Design)

### 1.1 API Configuration (`src/api/config.js`)

Central configuration for switching between mock and real APIs.

```javascript
/**
 * API Configuration
 * Controls whether to use mock data or real API endpoints
 */

export const API_CONFIG = {
  // Set to true to use real API endpoints, false for mock data
  USE_REAL_API: import.meta.env.VITE_USE_REAL_API === 'true',

  // Base URL for real API (falls back to /api)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',

  // Mock data delay (simulate network latency)
  MOCK_DELAY: 300,
}
```

### 1.2 Projects API (`src/api/projects.js`)

**API Contract Documentation:**

```javascript
/**
 * Projects API Composable
 *
 * API Contract (when USE_REAL_API = true):
 *
 * GET    /api/projects                    - List projects (query: status, search, parentId)
 * GET    /api/projects/:id                - Get single project with phases
 * POST   /api/projects                    - Create project
 * PATCH  /api/projects/:id                - Update project
 * DELETE /api/projects/:id                - Delete project
 * GET    /api/projects/:id/phases         - Get all phases for project
 *
 * Request/Response Shapes:
 *
 * createProject(data: {
 *   name: string
 *   description?: string
 *   status?: 'draft' | 'active' | 'archived'
 *   hasSelections?: boolean
 *   hasProofing?: boolean
 *   hasCollections?: boolean
 *   parentId?: string | null
 *   mediaSets?: Array<{id: string, name: string, ...}>
 *   settings?: object
 *   presetId?: string
 *   watermarkId?: string
 * }) => Promise<Project>
 *
 * fetchProjects(params?: {
 *   status?: 'draft' | 'active' | 'archived' | 'all'
 *   search?: string
 *   parentId?: string | null
 * }) => Promise<Project[]>
 *
 * Project Shape:
 * {
 *   id: string (UUID)
 *   name: string
 *   description?: string
 *   status: 'draft' | 'active' | 'archived'
 *   createdAt: string (ISO date)
 *   updatedAt: string (ISO date)
 *   mediaSets: Array<{id: string, name: string, description?: string, count: number, order: number}>
 *   settings: object
 *   hasSelections: boolean
 *   hasProofing: boolean
 *   hasCollections: boolean
 *   parentId: string | null
 *   presetId?: string
 *   watermarkId?: string
 * }
 */

import { API_CONFIG } from './config'
import { apiClient } from './client'
import { storage } from '@/utils/storage'
import { generateUUID } from '@/utils/uuid'
import { delay } from '@/utils/delay'

const PROJECTS_STORAGE_KEY = 'mazeloot_projects'

// Mock implementation
const mockProjectsApi = {
  // ... localStorage-based implementation
}

// Real API implementation
const realProjectsApi = {
  async fetchProjects(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.status && params.status !== 'all') queryParams.append('status', params.status)
    if (params.search) queryParams.append('search', params.search)
    if (params.parentId !== undefined) queryParams.append('parentId', params.parentId || '')

    const query = queryParams.toString()
    const endpoint = `/projects${query ? `?${query}` : ''}`
    const { data } = await apiClient.get(endpoint)
    return data
  },

  async fetchProject(id) {
    const { data } = await apiClient.get(`/projects/${id}`)
    return data
  },

  async createProject(projectData) {
    const { data } = await apiClient.post('/projects', projectData)
    return data
  },

  async updateProject(id, updates) {
    const { data } = await apiClient.patch(`/projects/${id}`, updates)
    return data
  },

  async deleteProject(id) {
    await apiClient.delete(`/projects/${id}`)
  },

  async getProjectPhases(projectId) {
    const { data } = await apiClient.get(`/projects/${projectId}/phases`)
    return data
  },
}

export function useProjectsApi() {
  const api = API_CONFIG.USE_REAL_API ? realProjectsApi : mockProjectsApi

  return {
    fetchProjects: api.fetchProjects.bind(api),
    fetchProject: api.fetchProject.bind(api),
    createProject: api.createProject.bind(api),
    updateProject: api.updateProject.bind(api),
    deleteProject: api.deleteProject.bind(api),
    getProjectPhases: api.getProjectPhases.bind(api),
  }
}
```

### 1.3 Selections API (`src/api/selections.js`)

**API Contract:**

```javascript
/**
 * Selections API Composable
 *
 * API Contract:
 *
 * GET    /api/projects/:projectId/selections/:id        - Get selection with media
 * POST   /api/projects/:projectId/selections             - Create selection phase
 * PATCH  /api/projects/:projectId/selections/:id         - Update selection
 * POST   /api/projects/:projectId/selections/:id/complete - Complete selection
 * POST   /api/projects/:projectId/selections/:id/recover  - Recover deleted media
 * GET    /api/projects/:projectId/selections/:id/selected - Get selected media only
 * GET    /api/projects/:projectId/selections/:id/filenames - Get selected filenames
 *
 * Selection Shape:
 * {
 *   id: string
 *   projectId: string
 *   name: string (default: "Selections")
 *   status: 'draft' | 'active' | 'completed'
 *   selectionCompletedAt: string | null (ISO date)
 *   autoDeleteDate: string (ISO date, 30 days after completion)
 *   createdAt: string
 *   updatedAt: string
 * }
 */
```

### 1.4 Proofing API (`src/api/proofing.js`)

**API Contract:**

```javascript
/**
 * Proofing API Composable
 *
 * API Contract:
 *
 * GET    /api/projects/:projectId/proofing/:id          - Get proofing with media and feedback
 * POST   /api/projects/:projectId/proofing               - Create proofing phase
 * PATCH  /api/projects/:projectId/proofing/:id           - Update proofing
 * POST   /api/projects/:projectId/proofing/:id/revisions - Upload new revision
 * POST   /api/media/:mediaId/feedback                    - Add client feedback
 * PATCH  /api/media/:mediaId/complete                    - Mark media as approved
 * POST   /api/projects/:projectId/proofing/:id/complete  - Mark proofing as completed
 * POST   /api/projects/:projectId/proofing/:id/move-to-collection - Move approved to collection
 *
 * Proofing Shape:
 * {
 *   id: string
 *   projectId: string
 *   name: string (default: "Proofing")
 *   status: 'draft' | 'active' | 'completed'
 *   maxRevisions: number
 *   currentRevision: number
 *   createdAt: string
 *   updatedAt: string
 * }
 *
 * Feedback Shape:
 * {
 *   id: string
 *   mediaId: string
 *   type: 'text' | 'video' | 'audio'
 *   content: string | URL
 *   createdAt: string
 *   createdBy: string (client identifier)
 * }
 */
```

### 1.5 Media API Updates (`src/api/media.js`)

Add phase-aware methods:

```javascript
/**
 * Enhanced Media API with Phase Support
 *
 * New API Contract:
 *
 * GET    /api/media/phase/:phaseType/:phaseId            - Get media for specific phase
 * POST   /api/media/move-between-phases                  - Move media between phases
 * POST   /api/media/:id/low-res-copy                    - Generate low-res copy
 * PATCH  /api/media/:id/select                           - Mark media as selected (selection phase)
 * GET    /api/media/:id/revisions                       - Get all revisions for media
 *
 * Phase Types: 'selection' | 'proofing' | 'collection'
 */
```

---

## Phase 2: Stores (State Management)

### 2.1 Project Store (`src/stores/project.js`)

```javascript
/**
 * Project Store
 * Manages project state with optimistic updates
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProjectsApi } from '@/api/projects'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const projectsApi = useProjectsApi()

  // Computed
  const activeProjects = computed(() => projects.value.filter(p => p.status === 'active'))

  const draftProjects = computed(() => projects.value.filter(p => p.status === 'draft'))

  // Actions with optimistic updates
  const fetchProjects = async params => {
    isLoading.value = true
    error.value = null
    try {
      projects.value = await projectsApi.fetchProjects(params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createProject = async data => {
    // Optimistic update
    const tempProject = { ...data, id: `temp-${Date.now()}`, createdAt: new Date().toISOString() }
    projects.value.push(tempProject)

    try {
      const newProject = await projectsApi.createProject(data)
      // Replace temp with real
      const index = projects.value.findIndex(p => p.id === tempProject.id)
      if (index !== -1) projects.value[index] = newProject
      return newProject
    } catch (err) {
      // Revert
      projects.value = projects.value.filter(p => p.id !== tempProject.id)
      throw err
    }
  }

  // ... other actions

  return {
    projects,
    currentProject,
    isLoading,
    error,
    activeProjects,
    draftProjects,
    fetchProjects,
    createProject,
    // ... other actions
  }
})
```

### 2.2 Selection Store (`src/stores/selection.js`)

Similar pattern for selection management.

### 2.3 Proofing Store (`src/stores/proofing.js`)

Similar pattern for proofing management.

---

## Phase 3: Workflow Composables

### 3.1 Selection Workflow (`src/composables/useSelectionWorkflow.js`)

```javascript
/**
 * Selection Workflow Composable
 * Orchestrates selection phase operations
 */

import { ref } from 'vue'
import { useSelectionsApi } from '@/api/selections'
import { useMediaApi } from '@/api/media'
import { useSelectionStore } from '@/stores/selection'

export function useSelectionWorkflow(selectionId) {
  const isLoading = ref(false)
  const error = ref(null)

  const selectionsApi = useSelectionsApi()
  const mediaApi = useMediaApi()
  const selectionStore = useSelectionStore()

  const uploadRawMedia = async files => {
    // Upload files to selection phase
    // Uses mediaApi.addMedia with phase: 'selection', phaseId: selectionId
  }

  const markMediaSelected = async mediaId => {
    // Mark media as selected
    // Uses mediaApi.markMediaSelected(mediaId)
  }

  const completeSelection = async () => {
    // Complete selection, schedule auto-delete
    // Uses selectionsApi.completeSelection(selectionId)
  }

  const recoverDeletedMedia = async () => {
    // Restore deleted files within 30-day window
    // Uses selectionsApi.recoverDeletedMedia(selectionId)
  }

  const copySelectedFilenames = async () => {
    // Get selected filenames for editing workflow
    // Uses selectionsApi.copyFilenames(selectionId)
  }

  return {
    isLoading,
    error,
    uploadRawMedia,
    markMediaSelected,
    completeSelection,
    recoverDeletedMedia,
    copySelectedFilenames,
  }
}
```

### 3.2 Proofing Workflow (`src/composables/useProofingWorkflow.js`)

Similar pattern for proofing operations.

---

## Phase 4: UI Components

### 4.1 Project Creation Dialog (`src/components/organisms/CreateProjectDialog.vue`)

Uses `useProjectStore().createProject()` - no direct API calls.

### 4.2 Project Dashboard (`src/views/user/memora/projects/ProjectDashboard.vue`)

Uses `useProjectStore()` to fetch and display projects.

### 4.3 Selection Phase View (`src/views/user/memora/projects/selections/SelectionPhase.vue`)

Uses `useSelectionWorkflow()` for all operations.

### 4.4 Proofing Phase View (`src/views/user/memora/projects/proofing/ProofingPhase.vue`)

Uses `useProofingWorkflow()` for all operations.

---

## Phase 5: Routes

### 5.1 Project Routes (`src/router/routes/projects.js`)

```javascript
export const projectRoutes = [
  {
    path: '/memora/projects',
    name: 'projects',
    component: () => import('@/views/user/memora/projects/ProjectsList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/memora/projects/create',
    name: 'createProject',
    component: () => import('@/views/user/memora/projects/CreateProject.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/memora/projects/:id',
    name: 'projectDashboard',
    component: () => import('@/views/user/memora/projects/ProjectDashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/memora/projects/:id/selections',
    name: 'selectionPhase',
    component: () => import('@/views/user/memora/projects/selections/SelectionPhase.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/memora/projects/:id/proofing',
    name: 'proofingPhase',
    component: () => import('@/views/user/memora/projects/proofing/ProofingPhase.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/memora/projects/:id/collections',
    name: 'collectionPhase',
    component: () => import('@/views/user/memora/projects/collections/CollectionPhase.vue'),
    meta: { requiresAuth: true },
  },
]
```

### 5.2 Public/Client Routes (`src/router/routes/public.js`)

```javascript
export const publicProjectRoutes = [
  {
    path: '/p/:projectId/selections',
    name: 'publicSelection',
    component: () => import('@/views/public/projects/SelectionView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/p/:projectId/proofing',
    name: 'publicProofing',
    component: () => import('@/views/public/projects/ProofingView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/p/:projectId/collection',
    name: 'publicCollection',
    component: () => import('@/views/public/projects/CollectionView.vue'),
    meta: { requiresAuth: false },
  },
]
```

---

## Implementation Checklist

### Step 1: Foundation (API Layer)

- [ ] Create `src/api/config.js` for API configuration
- [ ] Create `src/api/projects.js` with mock + real API implementations
- [ ] Create `src/api/selections.js` with mock + real API implementations
- [ ] Create `src/api/proofing.js` with mock + real API implementations
- [ ] Update `src/api/media.js` with phase-aware methods

### Step 2: State Management

- [ ] Create `src/stores/project.js`
- [ ] Create `src/stores/selection.js`
- [ ] Create `src/stores/proofing.js`

### Step 3: Workflows

- [ ] Create `src/composables/useSelectionWorkflow.js`
- [ ] Create `src/composables/useProofingWorkflow.js`
- [ ] Create `src/utils/autoDeleteService.js` (background service)

### Step 4: UI Components

- [ ] Create `src/components/organisms/CreateProjectDialog.vue`
- [ ] Create `src/views/user/memora/projects/ProjectsList.vue`
- [ ] Create `src/views/user/memora/projects/ProjectDashboard.vue`
- [ ] Create `src/views/user/memora/projects/selections/SelectionPhase.vue`
- [ ] Create `src/views/user/memora/projects/proofing/ProofingPhase.vue`
- [ ] Create `src/views/user/memora/projects/collections/CollectionPhase.vue`

### Step 5: Feedback System

- [ ] Create `src/components/molecules/FeedbackPanel.vue`
- [ ] Create `src/components/molecules/FeedbackList.vue`
- [ ] Create `src/components/molecules/RevisionHistory.vue`

### Step 6: Routes

- [ ] Create `src/router/routes/projects.js`
- [ ] Create `src/router/routes/public.js`
- [ ] Update `src/router/index.js` to include new routes

### Step 7: Integration

- [ ] Update `src/api/collections.js` to support project-linked collections
- [ ] Update `src/stores/gallery.js` to handle project collections
- [ ] Update collection views to show project context

---

## Switching from Mock to Real API

### Option 1: Environment Variable (Recommended)

```bash
# .env.development
VITE_USE_REAL_API=false
VITE_API_BASE_URL=/api

# .env.production
VITE_USE_REAL_API=true
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Option 2: Runtime Configuration

Add a config endpoint that returns API settings, or use a feature flag.

### Migration Steps

1. **Backend Ready**: Set `VITE_USE_REAL_API=true`
2. **Test Endpoints**: Verify all API endpoints match the documented contracts
3. **Update Base URL**: Set `VITE_API_BASE_URL` to your production API
4. **Remove Mock Data**: Optionally remove localStorage mock data initialization

**No UI changes required!** The abstraction layer handles everything.

---

## API Contract Documentation

Each API composable includes JSDoc comments documenting:

- **Endpoints**: HTTP method and path
- **Request Shapes**: Expected parameters and data structures
- **Response Shapes**: Returned data structures
- **Error Handling**: Expected error responses

This serves as the contract between frontend and backend teams.

---

## Testing Strategy

### Unit Tests

- Test API composables with both mock and real API modes
- Test stores with mocked API composables
- Test workflow composables in isolation

### Integration Tests

- Test full workflows with mock data
- Test API switching mechanism
- Test optimistic updates and error recovery

### E2E Tests

- Test complete user flows
- Test with real API endpoints (staging environment)

---

## File Structure

```
src/
├── api/
│   ├── config.js              # API configuration
│   ├── projects.js            # Projects API (mock + real)
│   ├── selections.js          # Selections API (mock + real)
│   ├── proofing.js            # Proofing API (mock + real)
│   └── media.js               # Enhanced Media API
├── stores/
│   ├── project.js             # Project store
│   ├── selection.js           # Selection store
│   └── proofing.js            # Proofing store
├── composables/
│   ├── useSelectionWorkflow.js
│   └── useProofingWorkflow.js
├── components/
│   ├── organisms/
│   │   └── CreateProjectDialog.vue
│   └── molecules/
│       ├── FeedbackPanel.vue
│       ├── FeedbackList.vue
│       └── RevisionHistory.vue
├── views/
│   ├── user/
│   │   └── memora/
│   │       └── projects/
│   │           ├── ProjectsList.vue
│   │           ├── ProjectDashboard.vue
│   │           ├── selections/
│   │           │   └── SelectionPhase.vue
│   │           ├── proofing/
│   │           │   └── ProofingPhase.vue
│   │           └── collections/
│   │               └── CollectionPhase.vue
│   └── public/
│       └── projects/
│           ├── SelectionView.vue
│           ├── ProofingView.vue
│           └── CollectionView.vue
└── router/
    └── routes/
        ├── projects.js
        └── public.js
```

---

## Next Steps

1. Start with **Phase 1** (API Layer) - this is the foundation
2. Implement mock data that matches expected API responses exactly
3. Build UI components using stores (they'll work with both mock and real APIs)
4. When backend is ready, simply flip the `USE_REAL_API` flag

The architecture ensures **zero UI changes** when switching from mock to real APIs!
