# API Contracts - Project-Based Media Management

This document defines the exact API contract between frontend and backend. All endpoints should match these specifications exactly.

## Base URL

- Development: `/api` (or `VITE_API_BASE_URL`)
- Production: Configured via `VITE_API_BASE_URL` environment variable

## Authentication

All authenticated endpoints require:

```
Authorization: Bearer <token>
```

## Response Format

All successful responses follow this format:

```json
{
  "data": <response_data>,
  "status": 200,
  "statusText": "OK"
}
```

Error responses:

```json
{
  "message": "Error message",
  "code": "ERROR_CODE",
  "status": 400,
  "errors": {
    "field": ["Error message"]
  }
}
```

---

## Projects API

### List Projects

**GET** `/api/projects`

**Query Parameters:**

- `status` (optional): `'draft' | 'active' | 'archived' | 'all'` (default: 'all')
- `search` (optional): string - search by name/description
- `parentId` (optional): string | null - filter by parent folder

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Summer Wedding 2024",
      "description": "Beautiful outdoor wedding",
      "status": "active",
      "createdAt": "2024-06-15T10:00:00Z",
      "updatedAt": "2024-06-20T15:30:00Z",
      "mediaSets": [
        {
          "id": "uuid",
          "name": "Highlights",
          "description": "",
          "count": 45,
          "order": 0
        }
      ],
      "settings": {},
      "hasSelections": true,
      "hasProofing": true,
      "hasCollections": true,
      "parentId": null,
      "presetId": "uuid",
      "watermarkId": "uuid"
    }
  ]
}
```

### Get Single Project

**GET** `/api/projects/:id`

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "name": "Summer Wedding 2024",
    "description": "Beautiful outdoor wedding",
    "status": "active",
    "createdAt": "2024-06-15T10:00:00Z",
    "updatedAt": "2024-06-20T15:30:00Z",
    "mediaSets": [...],
    "settings": {},
    "hasSelections": true,
    "hasProofing": true,
    "hasCollections": true,
    "parentId": null,
    "presetId": "uuid",
    "watermarkId": "uuid",
    "phases": {
      "selection": { "id": "uuid", "status": "active" },
      "proofing": { "id": "uuid", "status": "draft" },
      "collection": { "id": "uuid", "status": "active" }
    }
  }
}
```

### Create Project

**POST** `/api/projects`

**Request Body:**

```json
{
  "name": "Summer Wedding 2024",
  "description": "Beautiful outdoor wedding",
  "status": "draft",
  "hasSelections": true,
  "hasProofing": true,
  "hasCollections": true,
  "parentId": null,
  "mediaSets": [
    {
      "name": "Highlights",
      "description": "",
      "order": 0
    }
  ],
  "settings": {},
  "presetId": "uuid",
  "watermarkId": "uuid"
}
```

**Response:** Same as Get Single Project

### Update Project

**PATCH** `/api/projects/:id`

**Request Body:** (all fields optional)

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "status": "active",
  "mediaSets": [...],
  "settings": {...}
}
```

**Response:** Same as Get Single Project

### Delete Project

**DELETE** `/api/projects/:id`

**Response:**

```json
{
  "data": null,
  "status": 204
}
```

### Get Project Phases

**GET** `/api/projects/:id/phases`

**Response:**

```json
{
  "data": {
    "selection": {
      "id": "uuid",
      "projectId": "uuid",
      "name": "Selections",
      "status": "active",
      "selectionCompletedAt": null,
      "autoDeleteDate": null,
      "createdAt": "2024-06-15T10:00:00Z",
      "updatedAt": "2024-06-15T10:00:00Z"
    },
    "proofing": {
      "id": "uuid",
      "projectId": "uuid",
      "name": "Proofing",
      "status": "draft",
      "maxRevisions": 3,
      "currentRevision": 0,
      "createdAt": "2024-06-15T10:00:00Z",
      "updatedAt": "2024-06-15T10:00:00Z"
    },
    "collection": {
      "id": "uuid",
      "projectId": "uuid",
      "name": "Collection",
      "status": "active",
      "createdAt": "2024-06-15T10:00:00Z",
      "updatedAt": "2024-06-15T10:00:00Z"
    }
  }
}
```

---

## Selections API

### Get Selection

**GET** `/api/projects/:projectId/selections/:id`

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "name": "Selections",
    "status": "active",
    "selectionCompletedAt": null,
    "autoDeleteDate": null,
    "createdAt": "2024-06-15T10:00:00Z",
    "updatedAt": "2024-06-15T10:00:00Z",
    "mediaCount": 150,
    "selectedCount": 45
  }
}
```

### Create Selection Phase

**POST** `/api/projects/:projectId/selections`

**Request Body:**

```json
{
  "name": "Selections"
}
```

**Response:** Same as Get Selection

### Update Selection

**PATCH** `/api/projects/:projectId/selections/:id`

**Request Body:**

```json
{
  "name": "Updated Name",
  "status": "active"
}
```

**Response:** Same as Get Selection

### Complete Selection

**POST** `/api/projects/:projectId/selections/:id/complete`

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "status": "completed",
    "selectionCompletedAt": "2024-06-20T10:00:00Z",
    "autoDeleteDate": "2024-07-20T10:00:00Z"
  }
}
```

### Recover Deleted Media

**POST** `/api/projects/:projectId/selections/:id/recover`

**Request Body:**

```json
{
  "mediaIds": ["uuid1", "uuid2"]
}
```

**Response:**

```json
{
  "data": {
    "recoveredCount": 2
  }
}
```

### Get Selected Media

**GET** `/api/projects/:projectId/selections/:id/selected`

**Query Parameters:**

- `setId` (optional): string - filter by media set

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "phase": "selection",
      "phaseId": "uuid",
      "collectionId": null,
      "setId": "uuid",
      "isSelected": true,
      "selectedAt": "2024-06-18T10:00:00Z",
      "url": "https://...",
      "thumbnail": "https://...",
      "type": "image",
      "filename": "IMG_001.jpg",
      "order": 0,
      "createdAt": "2024-06-15T10:00:00Z"
    }
  ]
}
```

### Get Selected Filenames

**GET** `/api/projects/:projectId/selections/:id/filenames`

**Response:**

```json
{
  "data": {
    "filenames": ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg"],
    "count": 3
  }
}
```

---

## Proofing API

### Get Proofing

**GET** `/api/projects/:projectId/proofing/:id`

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "name": "Proofing",
    "status": "active",
    "maxRevisions": 3,
    "currentRevision": 1,
    "createdAt": "2024-06-15T10:00:00Z",
    "updatedAt": "2024-06-20T15:30:00Z",
    "mediaCount": 45,
    "completedCount": 30,
    "pendingCount": 15
  }
}
```

### Create Proofing Phase

**POST** `/api/projects/:projectId/proofing`

**Request Body:**

```json
{
  "name": "Proofing",
  "maxRevisions": 3
}
```

**Response:** Same as Get Proofing

### Update Proofing

**PATCH** `/api/projects/:projectId/proofing/:id`

**Request Body:**

```json
{
  "name": "Updated Name",
  "maxRevisions": 5,
  "status": "active"
}
```

**Response:** Same as Get Proofing

### Upload Revision

**POST** `/api/projects/:projectId/proofing/:id/revisions`

**Request Body:** (multipart/form-data)

```
mediaId: uuid
file: <file>
revisionNumber: 2
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "mediaId": "uuid",
    "revisionNumber": 2,
    "url": "https://...",
    "thumbnail": "https://...",
    "createdAt": "2024-06-20T10:00:00Z"
  }
}
```

### Add Feedback

**POST** `/api/media/:mediaId/feedback`

**Request Body:**

```json
{
  "type": "text",
  "content": "Please adjust the brightness",
  "createdBy": "client-identifier"
}
```

**OR for video/audio:**

```json
{
  "type": "video",
  "content": "https://...", // URL to uploaded video
  "createdBy": "client-identifier"
}
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "mediaId": "uuid",
    "type": "text",
    "content": "Please adjust the brightness",
    "createdAt": "2024-06-20T10:00:00Z",
    "createdBy": "client-identifier"
  }
}
```

### Mark Media Completed

**PATCH** `/api/media/:mediaId/complete`

**Request Body:**

```json
{
  "isCompleted": true
}
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "isCompleted": true,
    "completedAt": "2024-06-20T10:00:00Z"
  }
}
```

### Complete Proofing

**POST** `/api/projects/:projectId/proofing/:id/complete`

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "status": "completed",
    "completedAt": "2024-06-20T10:00:00Z"
  }
}
```

### Move to Collection

**POST** `/api/projects/:projectId/proofing/:id/move-to-collection`

**Request Body:**

```json
{
  "mediaIds": ["uuid1", "uuid2"],
  "collectionId": "uuid"
}
```

**Response:**

```json
{
  "data": {
    "movedCount": 2,
    "collectionId": "uuid"
  }
}
```

---

## Media API (Enhanced)

### Get Phase Media

**GET** `/api/media/phase/:phaseType/:phaseId`

**Query Parameters:**

- `setId` (optional): string - filter by media set
- `phaseType`: `'selection' | 'proofing' | 'collection'`

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "phase": "selection",
      "phaseId": "uuid",
      "collectionId": null,
      "setId": "uuid",
      "isSelected": false,
      "selectedAt": null,
      "revisionNumber": null,
      "feedback": [],
      "isCompleted": false,
      "originalMediaId": null,
      "lowResCopyUrl": null,
      "url": "https://...",
      "thumbnail": "https://...",
      "type": "image",
      "filename": "IMG_001.jpg",
      "order": 0,
      "createdAt": "2024-06-15T10:00:00Z"
    }
  ]
}
```

### Move Media Between Phases

**POST** `/api/media/move-between-phases`

**Request Body:**

```json
{
  "mediaIds": ["uuid1", "uuid2"],
  "fromPhase": "selection",
  "fromPhaseId": "uuid",
  "toPhase": "proofing",
  "toPhaseId": "uuid"
}
```

**Response:**

```json
{
  "data": {
    "movedCount": 2,
    "media": [...]
  }
}
```

### Generate Low-Res Copy

**POST** `/api/media/:id/low-res-copy`

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "lowResCopyUrl": "https://...",
    "createdAt": "2024-06-20T10:00:00Z"
  }
}
```

### Mark Media Selected

**PATCH** `/api/media/:id/select`

**Request Body:**

```json
{
  "isSelected": true
}
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "isSelected": true,
    "selectedAt": "2024-06-20T10:00:00Z"
  }
}
```

### Get Media Revisions

**GET** `/api/media/:id/revisions`

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "mediaId": "uuid",
      "revisionNumber": 1,
      "url": "https://...",
      "thumbnail": "https://...",
      "createdAt": "2024-06-18T10:00:00Z"
    },
    {
      "id": "uuid",
      "mediaId": "uuid",
      "revisionNumber": 2,
      "url": "https://...",
      "thumbnail": "https://...",
      "createdAt": "2024-06-20T10:00:00Z"
    }
  ]
}
```

---

## Error Codes

- `PROJECT_NOT_FOUND` (404)
- `SELECTION_NOT_FOUND` (404)
- `PROOFING_NOT_FOUND` (404)
- `MEDIA_NOT_FOUND` (404)
- `INVALID_PHASE` (400)
- `INVALID_STATUS` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `VALIDATION_ERROR` (400)
- `NETWORK_ERROR` (0)

---

## Pagination (Future)

For endpoints that return lists, pagination will be added:

**Query Parameters:**

- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 50)

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

---

## Notes

1. All dates are ISO 8601 strings (UTC)
2. All IDs are UUIDs (v4)
3. File uploads use `multipart/form-data`
4. All other requests use `application/json`
5. Empty arrays/objects are returned as `[]`/`{}`, not `null`
6. Optional fields can be `null` or omitted entirely
