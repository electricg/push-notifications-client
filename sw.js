/* global self */
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {
  console.log('Received push');
  let notificationTitle = 'Hello';
  const notificationOptions = {
    body: 'Default push message',
    icon: 'icon.png',
    tag: 'simple-push-demo-notification'
  };

  if (event.data) {
    const dataText = event.data.text();
    notificationTitle = 'Message from electric_g';
    notificationOptions.body = dataText;
  }

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(
        notificationTitle, notificationOptions),
    ])
  );
});