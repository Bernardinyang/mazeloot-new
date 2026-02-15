const CACHE_VERSION = '__CACHE_VERSION__'
const CACHE_NAME = 'mazeloot-' + CACHE_VERSION
const STATIC_CACHE_NAME = 'mazeloot-static-' + CACHE_VERSION
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]

self.addEventListener('install', (event) => {
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

self.addEventListener('push', (event) => {
  if (!event.data) return
  event.waitUntil(
    event.data.json().then((data) => {
      const title = data.title || 'Notification'
      const body = data.body || ''
      const url = data.url || '/'
      const id = data.id
      return self.registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: id ? `notification-${id}` : undefined,
        data: { url, id },
      })
    }).catch(() => {})
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
    return
  }
  if (event.data?.type === 'SHOW_NOTIFICATION' && event.data?.title) {
    const { title, body, id, url } = event.data
    const options = {
      body: body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: id ? `notification-${id}` : undefined,
      data: { url: url || '/', id },
    }
    event.waitUntil(self.registration.showNotification(title, options))
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const data = event.notification.data || {}
  let targetUrl = data.url || '/'
  if (targetUrl.startsWith('/') && !targetUrl.startsWith('//')) {
    targetUrl = self.location.origin + targetUrl
  }
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl).then(() => client.focus())
          return
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
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

