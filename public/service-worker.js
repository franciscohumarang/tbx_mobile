// Service Worker for TBX Mobile App
const CACHE_NAME = 'tbx-mobile-v2'; // Increment cache version to force refresh
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// Maintain a map of sent notifications to prevent duplicates
const sentNotifications = new Map();

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches and reset notification state
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Clear any existing notifications
  event.waitUntil(
    self.registration.getNotifications().then(notifications => {
      notifications.forEach(notification => notification.close());
    })
  );
  
  // Reset notification tracking
  sentNotifications.clear();
});

// Fetch event - don't cache notification requests
self.addEventListener('fetch', (event) => {
  // Don't cache API requests or notification-related requests
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/notifications')) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Push event - handle push notifications with duplicate prevention
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  // Check for duplicate notifications
  const notificationId = `${data.data.type}_${data.data.medicationId}`;
  if (sentNotifications.has(notificationId)) {
    console.log('Duplicate notification prevented:', notificationId);
    return;
  }
  
  // Track this notification to prevent duplicates
  sentNotifications.set(notificationId, Date.now());
  
  // Show the notification
  event.waitUntil(
    self.registration.showNotification(data.title, data)
  );
});

// Notification click event - handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Open confirmation page or main app
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then((clientList) => {
        // If a window already exists, focus it
        if (clientList.length > 0) {
          clientList[0].navigate(`/medication/${event.notification.data.medicationId}`);
          clientList[0].focus();
        } else {
          // Otherwise open a new window
          clients.openWindow(`/medication/${event.notification.data.medicationId}`);
        }
      })
  );
}); 