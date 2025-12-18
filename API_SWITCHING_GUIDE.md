# API Switching Guide

This guide shows exactly how to switch from mock data to real API endpoints.

## Quick Start

### Using Mock Data (Development)

1. **Set environment variable:**

   ```bash
   # .env.development
   VITE_USE_REAL_API=false
   ```

2. **That's it!** The app will use localStorage/IndexedDB for all data.

### Using Real API (Production)

1. **Set environment variable:**

   ```bash
   # .env.production
   VITE_USE_REAL_API=true
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

2. **Ensure backend endpoints match** the contracts in `API_CONTRACTS.md`

3. **No code changes needed!** The abstraction layer handles everything.

---

## How It Works

### Architecture Pattern

```
┌─────────────────┐
│   UI Components  │  ← Use stores/composables (no direct API calls)
└────────┬─────────┘
         │
┌────────▼─────────┐
│   Pinia Stores   │  ← Manage state, optimistic updates
└────────┬─────────┘
         │
┌────────▼─────────┐
│  API Composables │  ← Abstract data source (mock OR real)
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│ Mock  │ │  Real   │
│ Data  │ │   API   │
└───────┘ └─────────┘
```

### Code Example

**API Composable (`src/api/projects.js`):**

```javascript
import { API_CONFIG } from './config'
import { apiClient } from './client'

// Mock implementation (localStorage)
const mockProjectsApi = {
  async fetchProjects(params) {
    await delay(300)
    const projects = storage.get('projects') || []
    // ... filter by params
    return projects
  },
}

// Real API implementation
const realProjectsApi = {
  async fetchProjects(params) {
    const query = new URLSearchParams(params).toString()
    const { data } = await apiClient.get(`/projects?${query}`)
    return data
  },
}

// Export composable that switches based on config
export function useProjectsApi() {
  const api = API_CONFIG.USE_REAL_API ? realProjectsApi : mockProjectsApi

  return {
    fetchProjects: api.fetchProjects.bind(api),
    // ... other methods
  }
}
```

**Store (`src/stores/project.js`):**

```javascript
import { useProjectsApi } from '@/api/projects'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const projectsApi = useProjectsApi() // ← Automatically uses mock or real

  const fetchProjects = async params => {
    projects.value = await projectsApi.fetchProjects(params)
  }

  return { projects, fetchProjects }
})
```

**Component (uses store, no API knowledge):**

```vue
<script setup>
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()

onMounted(() => {
  projectStore.fetchProjects() // ← Works with both mock and real API!
})
</script>
```

---

## Environment Variables

### Development (.env.development)

```bash
# Use mock data
VITE_USE_REAL_API=false

# Optional: Set base URL (not used when USE_REAL_API=false)
VITE_API_BASE_URL=/api
```

### Staging (.env.staging)

```bash
# Use real API (staging server)
VITE_USE_REAL_API=true
VITE_API_BASE_URL=https://api-staging.yourdomain.com
```

### Production (.env.production)

```bash
# Use real API (production server)
VITE_USE_REAL_API=true
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## Testing the Switch

### Step 1: Verify Mock Data Works

1. Start dev server: `npm run dev`
2. Create a project
3. Check browser DevTools → Application → Local Storage
4. You should see `mazeloot_projects` key with your data

### Step 2: Test Real API Connection

1. Set `VITE_USE_REAL_API=true` in `.env.development`
2. Set `VITE_API_BASE_URL` to your backend URL
3. Restart dev server
4. Check Network tab - you should see API calls to your backend
5. Verify responses match `API_CONTRACTS.md`

### Step 3: Handle CORS (if needed)

If you see CORS errors, configure your backend:

```javascript
// Backend CORS config (example)
app.use(
  cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true,
  })
)
```

---

## Troubleshooting

### Issue: "Network error" when switching to real API

**Solution:**

- Check `VITE_API_BASE_URL` is correct
- Verify backend is running
- Check CORS configuration
- Verify authentication token is being sent

### Issue: "404 Not Found" errors

**Solution:**

- Verify endpoint paths match `API_CONTRACTS.md` exactly
- Check backend route definitions
- Ensure base URL doesn't have trailing slash

### Issue: Data structure mismatch

**Solution:**

- Compare backend response to `API_CONTRACTS.md`
- Check response wrapper: `{ data: ... }` format
- Verify field names match exactly (case-sensitive)

### Issue: Mock data persists after switching

**Solution:**

- Clear browser localStorage/IndexedDB
- Or use browser DevTools → Application → Clear storage

---

## Migration Checklist

When backend is ready:

- [ ] Set `VITE_USE_REAL_API=true`
- [ ] Set `VITE_API_BASE_URL` to production URL
- [ ] Test all endpoints match `API_CONTRACTS.md`
- [ ] Verify authentication works
- [ ] Test error handling (network errors, 404s, etc.)
- [ ] Test optimistic updates still work
- [ ] Clear mock data from localStorage (optional)
- [ ] Deploy!

---

## Benefits of This Architecture

✅ **Zero UI Changes**: Components don't know about API implementation  
✅ **Easy Testing**: Mock data for unit tests, real API for integration tests  
✅ **Parallel Development**: Frontend and backend teams work independently  
✅ **Gradual Migration**: Switch endpoints one at a time if needed  
✅ **Type Safety**: Clear contracts prevent mismatches

---

## Advanced: Per-Endpoint Switching

If you need to switch some endpoints but not others:

```javascript
// src/api/config.js
export const API_CONFIG = {
  USE_REAL_API: import.meta.env.VITE_USE_REAL_API === 'true',
  USE_REAL_PROJECTS_API: import.meta.env.VITE_USE_REAL_PROJECTS_API === 'true',
  USE_REAL_SELECTIONS_API: import.meta.env.VITE_USE_REAL_SELECTIONS_API === 'true',
  // ... etc
}

// src/api/projects.js
export function useProjectsApi() {
  const api = API_CONFIG.USE_REAL_PROJECTS_API ? realProjectsApi : mockProjectsApi
  // ...
}
```

This allows gradual migration: switch projects API first, then selections, etc.

---

## Questions?

- See `API_CONTRACTS.md` for exact endpoint specifications
- See `PROJECT_IMPLEMENTATION_PLAN.md` for full architecture details
