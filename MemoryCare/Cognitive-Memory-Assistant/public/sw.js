const CACHE_NAME = 'memorycare-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});

self.addEventListener('reminder-schedule', (event) => {
  const { reminder } = event.data;
  if (!reminder) return;
  scheduleNotification(reminder);
});

function scheduleNotification(reminder) {
  const now = Date.now();
  const [hours, minutes] = reminder.time.split(':').map(Number);
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target.getTime() <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now;

  const timerId = `reminder-${reminder.id}`;
  if (self._activeTimers && self._activeTimers[timerId]) {
    clearTimeout(self._activeTimers[timerId]);
  }

  if (!self._activeTimers) self._activeTimers = {};

  self._activeTimers[timerId] = setTimeout(() => {
    self.registration.showNotification('MemoryCare Reminder', {
      body: reminder.name + (reminder.description ? `\n${reminder.description}` : ''),
      icon: '/assets/icon-192.png',
      badge: '/assets/icon-192.png',
      tag: timerId,
      renotify: true,
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      data: { reminderId: reminder.id },
    });
    delete self._activeTimers[timerId];
  }, delay);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const existing = clients.find((c) => c.url.includes('/reminders'));
      if (existing) return existing.focus();
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow('/reminders');
    })
  );
});

self.addEventListener('message', (event) => {
  const { type, reminders } = event.data || {};
  if (type === 'SYNC_REMINDERS' && Array.isArray(reminders)) {
    if (!self._activeTimers) self._activeTimers = {};
    Object.keys(self._activeTimers).forEach((key) => {
      clearTimeout(self._activeTimers[key]);
      delete self._activeTimers[key];
    });
    reminders
      .filter((r) => !r.completed)
      .forEach((reminder) => scheduleNotification(reminder));
  }
  if (type === 'CANCEL_REMINDER') {
    const timerId = `reminder-${event.data.reminderId}`;
    if (self._activeTimers && self._activeTimers[timerId]) {
      clearTimeout(self._activeTimers[timerId]);
      delete self._activeTimers[timerId];
    }
  }
});
