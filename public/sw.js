// public/sw.js
// Runs in browser background — receives push even when app is closed

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let title   = "New Notification";
  let body    = "";
  let url     = "/";

  try {
    // WebPushService.sendPush() sends plain string message
    // If you later upgrade to JSON payload, parse here
    body = event.data.text();
  } catch (e) {
    body = "You have a new notification";
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:    "/icons/icon-192.png",
      badge:   "/icons/badge-72.png",
      data:    { url },
      vibrate: [100, 50, 100],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // App already open → focus it and navigate
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            client.navigate(targetUrl);
            return;
          }
        }
        // App closed → open new tab
        if (clients.openWindow) return clients.openWindow(targetUrl);
      })
  );
});

self.addEventListener("install",  () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));