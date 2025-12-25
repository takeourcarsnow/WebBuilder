/**
 * PWA Export Generator
 * Generates PWA files (manifest.json, service-worker.js) for offline capability
 */

import type { Website } from '@/types';

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'portrait' | 'landscape';
  themeColor: string;
  backgroundColor: string;
  categories: string[];
}

export function generateManifest(website: Website, config?: Partial<PWAConfig>): string {
  const { settings, name } = website;
  
  const manifest = {
    name: config?.name || settings.title || name,
    short_name: config?.shortName || name.substring(0, 12),
    description: config?.description || settings.description || settings.seo?.metaDescription || '',
    start_url: config?.startUrl || '/',
    display: config?.display || 'standalone',
    orientation: config?.orientation || 'any',
    theme_color: config?.themeColor || settings.theme.primaryColor,
    background_color: config?.backgroundColor || settings.theme.backgroundColor,
    categories: config?.categories || ['website', 'business'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    screenshots: [],
    prefer_related_applications: false,
    related_applications: [],
    scope: '/',
    lang: 'en',
    dir: 'ltr',
  };

  return JSON.stringify(manifest, null, 2);
}

export function generateServiceWorker(): string {
  return `// Service Worker for PWA
const CACHE_NAME = 'website-cache-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/icon-192.png',
  '/icon-512.png',
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Stale-while-revalidate for other requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Update cache with fresh response
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Return cached response or offline fallback
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement data sync logic here
  console.log('Background sync triggered');
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'Notification';
  const options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
`;
}

export function generateOfflinePage(website: Website): string {
  const { settings, name } = website;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - ${name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: ${settings.fonts.body};
      background-color: ${settings.theme.backgroundColor};
      color: ${settings.theme.textColor};
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }
    h1 {
      font-family: ${settings.fonts.heading};
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      opacity: 0.7;
      max-width: 400px;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      background-color: ${settings.theme.primaryColor};
      color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="icon">📡</div>
  <h1>You're Offline</h1>
  <p>It looks like you've lost your internet connection. Please check your connection and try again.</p>
  <button onclick="location.reload()">Try Again</button>
</body>
</html>`;
}

export function generatePWARegistration(): string {
  return `// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      
      console.log('Service Worker registered:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, show update prompt
              if (confirm('New content available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

// Check online/offline status
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
  console.log('Back online');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
  console.log('Gone offline');
});
`;
}

export interface PWAExportFiles {
  manifest: string;
  serviceWorker: string;
  offlinePage: string;
  registration: string;
}

export function generatePWAFiles(website: Website, config?: Partial<PWAConfig>): PWAExportFiles {
  return {
    manifest: generateManifest(website, config),
    serviceWorker: generateServiceWorker(),
    offlinePage: generateOfflinePage(website),
    registration: generatePWARegistration(),
  };
}

export function downloadPWAFiles(website: Website, config?: Partial<PWAConfig>): void {
  const files = generatePWAFiles(website, config);
  
  // Create a zip-like download experience
  const downloads = [
    { content: files.manifest, filename: 'manifest.json', type: 'application/json' },
    { content: files.serviceWorker, filename: 'service-worker.js', type: 'application/javascript' },
    { content: files.offlinePage, filename: 'offline.html', type: 'text/html' },
    { content: files.registration, filename: 'pwa-registration.js', type: 'application/javascript' },
  ];

  downloads.forEach(({ content, filename, type }) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

// Instructions for PWA integration
export const PWA_SETUP_INSTRUCTIONS = `
# PWA Setup Instructions

## Files Generated:
1. **manifest.json** - Add to your root directory and link in HTML head:
   \`<link rel="manifest" href="/manifest.json">\`

2. **service-worker.js** - Place in root directory (must be at root for scope)

3. **offline.html** - Fallback page when offline

4. **pwa-registration.js** - Include in your main HTML:
   \`<script src="/pwa-registration.js"></script>\`

## Required Icons:
Create PNG icons in these sizes:
- icon-192.png (192x192)
- icon-512.png (512x512)

## HTML Head Tags to Add:
\`\`\`html
<meta name="theme-color" content="#YOUR_THEME_COLOR">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="/icon-192.png">
\`\`\`

## Testing:
1. Serve over HTTPS (or localhost)
2. Open DevTools > Application > Service Workers
3. Check "Offline" to test offline functionality
4. Use Lighthouse to audit PWA compliance
`;
