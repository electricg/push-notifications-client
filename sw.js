/* global self, clients */
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {
  console.log('Received push');
  var notificationTitle = 'Hello';
  var notificationOptions = {
    body: 'Default push message',
    icon: 'icon.png'
  };

  if (event.data) {
    notificationTitle = 'Message from electric_g';
    notificationOptions.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click', event.notification);
  // Android doesn't close the notification when you click it
  // See http://crbug.com/463146
  event.notification.close();
  var url = 'https://electricg.github.io/push-notifications-client/';
  // Check if there's already a tab open with this URL.
  // If yes: focus on the tab.
  // If no: open a tab with the URL.
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      console.log('WindowClients', windowClients);
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        console.log('WindowClient', client);
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});