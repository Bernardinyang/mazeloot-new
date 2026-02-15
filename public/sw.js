const CACHE_NAME = 'mazeloot-v1'
const STATIC_CACHE_NAME = 'mazeloot-static-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache).catch((err) => {
          console.log('Cache addAll failed:', err)
        })
      }),
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        // Cache static assets
        return cache.addAll([
          '/manifest.json',
          '/icon-192.png',
          '/icon-512.png',
        ]).catch((err) => {
          console.log('Static cache failed:', err)
        })
      })
    ])
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip API requests and external resources
  if (
    url.pathname.includes('/api/') ||
    url.pathname.includes('/v1/') ||
    !url.origin.startsWith(self.location.origin)
  ) {
    return
  }

  // Cache strategy: Network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone()

        // Cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const cacheToUse = url.pathname.match(/\.(png|jpg|jpeg|svg|ico|json)$/) 
            ? STATIC_CACHE_NAME 
            : CACHE_NAME

          caches.open(cacheToUse).then((cache) => {
            cache.put(request, responseToCache)
          })
        }

        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((response) => {
          return response || new Response('Offline', { status: 503 })
        })
      })
  )
})

