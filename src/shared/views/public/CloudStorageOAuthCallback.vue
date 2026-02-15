<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div class="text-center space-y-4">
      <Loader2 class="w-8 h-8 animate-spin text-accent mx-auto" />
      <p class="text-gray-600 dark:text-gray-400">Processing OAuth callback...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from '@/shared/utils/lucideAnimated'
import { publicCollectionDownloadUrl } from '@/shared/utils/memoraPublicUrls'

const route = useRoute()
const router = useRouter()

// Generate access token for download page
const generateDownloadPageAccessToken = (collectionId) => {
  const token = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
  localStorage.setItem(`download_page_access_${collectionId}`, JSON.stringify({ token, expiresAt }))
  return token
}

onMounted(() => {
  // #region agent log
  console.log('OAuth callback page onMounted - DEBUG', {
    routeQuery: route.query,
    urlSearch: window.location.search
  });
  fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CloudStorageOAuthCallback.vue:onMounted',message:'OAuth callback page loaded',data:{routeQuery:route.query,urlSearch:window.location.search},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  const query = route.query
  const collectionId = query.collection_id || query.collectionId
  const projectId = query.project_id || query.projectId
  
  // #region agent log
  console.log('OAuth callback redirecting - DEBUG', {
    collectionId,
    projectId,
    query
  });
  fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CloudStorageOAuthCallback.vue:onMounted',message:'Redirecting to download page',data:{collectionId,projectId,hasSuccess:!!query.success,hasService:!!query.service},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Generate access token for OAuth callback redirect
  let accessToken = null
  if (collectionId) {
    accessToken = generateDownloadPageAccessToken(collectionId)
  }

  // If we have collection_id and project_id, redirect to download page
  if (collectionId && projectId) {
    router.replace({
      path: publicCollectionDownloadUrl(projectId, collectionId),
      query: {
        collectionId,
        accessToken,
        success: query.success,
        service: query.service,
        download_token: query.download_token,
        destination: query.destination,
        error: query.error,
        error_code: query.error_code,
        collection_id: collectionId,
        project_id: projectId,
      },
    })
  } else if (collectionId) {
    router.replace({
      path: publicCollectionDownloadUrl(projectId || 'default', collectionId),
      query: {
        collectionId,
        accessToken,
        success: query.success,
        service: query.service,
        download_token: query.download_token,
        destination: query.destination,
        error: query.error,
        error_code: query.error_code,
        collection_id: collectionId,
        project_id: projectId || 'default',
      },
    })
  } else {
    // No collection ID, show error and redirect to home
    router.replace({ name: 'home' })
  }
})
</script>
