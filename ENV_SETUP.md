# Environment Setup Guide

## Backend URL Configuration

The application automatically detects the environment based on the hostname and uses the appropriate backend URL.

### Setup

Create a `.env` file in the `mazeloot-frontend` directory with the following variables:

```bash
# Local backend URL (used for localhost development)
VITE_API_BASE_URL_LOCAL=http://localhost:8000/api

# Development backend URL (used when hostname contains .vercel.app)
VITE_API_BASE_URL_DEV=https://api-dev.mazeloot.com/api

# Production/Live backend URL (used when hostname is mazeloot.com)
VITE_API_BASE_URL_LIVE=https://api.mazeloot.com/api

# Optional: Override auto-detection by explicitly setting this
# If set, this will be used regardless of environment
# VITE_API_BASE_URL=

# Whether to use real API (set to false to use mock data)
VITE_USE_REAL_API=true

# Maximum file upload size in megabytes (applies to both images and videos)
# If not set, defaults to 50MB for videos and 10MB for images
VITE_MAX_UPLOAD_SIZE_MB=50
```

### How It Works

The system detects the environment based on the **hostname** of the loaded page:

1. **Local Environment** (localhost, 127.0.0.1, etc.):
   - Automatically uses `VITE_API_BASE_URL_LOCAL`
   - Defaults to `http://localhost:8000/api` if not set
   - Used when running `npm run dev` locally

2. **Dev Environment** (hostname contains `.vercel.app`):
   - Automatically uses `VITE_API_BASE_URL_DEV`
   - Defaults to `https://api-dev.mazeloot.com/api` if not set
   - Used for Vercel preview/staging deployments

3. **Live Environment** (hostname is `mazeloot.com` or ends with `.mazeloot.com`):
   - Automatically uses `VITE_API_BASE_URL_LIVE`
   - Defaults to `https://api.mazeloot.com/api` if not set
   - Used for production deployments

4. **Override** (optional):
   - If `VITE_API_BASE_URL` is set, it will be used regardless of hostname
   - This is useful for testing or specific deployment scenarios

### Example `.env` File

```bash
# Local backend (for localhost development)
VITE_API_BASE_URL_LOCAL=http://localhost:8000/api

# Development backend (for Vercel preview deployments)
VITE_API_BASE_URL_DEV=https://api-dev.mazeloot.com/api

# Production backend (for live mazeloot.com)
VITE_API_BASE_URL_LIVE=https://api.mazeloot.com/api

# Use real API (not mock data)
VITE_USE_REAL_API=true

# Maximum file upload size in megabytes
# If not set, defaults to 50MB for videos and 10MB for images
VITE_MAX_UPLOAD_SIZE_MB=50
```

### Hostname Detection Examples

- `localhost:5173` → Uses `VITE_API_BASE_URL_LOCAL`
- `127.0.0.1:5173` → Uses `VITE_API_BASE_URL_LOCAL`
- `my-app.vercel.app` → Uses `VITE_API_BASE_URL_DEV`
- `mazeloot.com` → Uses `VITE_API_BASE_URL_LIVE`
- `www.mazeloot.com` → Uses `VITE_API_BASE_URL_LIVE`

### Verification

After setting up your `.env` file, restart your development server:

```bash
npm run dev
```

The API client will automatically use the correct backend URL based on the hostname. You can verify this by:

1. Opening the browser console - you'll see a log message showing:
   - The detected hostname
   - The environment (local/dev/live)
   - The API base URL being used

2. Checking the Network tab in DevTools to see which backend URL is being called

## File Upload Configuration

### Maximum Upload Size

You can configure the maximum file upload size using the `VITE_MAX_UPLOAD_SIZE_MB` environment variable:

```bash
# Set maximum upload size to 50MB (applies to both images and videos)
VITE_MAX_UPLOAD_SIZE_MB=50
```

**Default Behavior:**

- If `VITE_MAX_UPLOAD_SIZE_MB` is not set:
  - Videos default to 50MB
  - Images default to 10MB
- If `VITE_MAX_UPLOAD_SIZE_MB` is set:
  - Both videos and images use the specified size limit

**Example:**

```bash
# Allow uploads up to 100MB for both images and videos
VITE_MAX_UPLOAD_SIZE_MB=100

# Allow uploads up to 25MB for both images and videos
VITE_MAX_UPLOAD_SIZE_MB=25
```

**Note:** Make sure the backend is configured with a matching or higher limit. The backend configuration is in `mazeloot-backend/config/upload.php`.
