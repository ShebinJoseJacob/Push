self.addEventListener('push', function(event) {
    const data = event.data.json();  // Parse the incoming push message
  
    const title = data.title || "Default Title";
    const options = {
      body: data.body || "Default body text",
      icon: "icon.png",  // Replace with your icon path
      badge: "badge.png" // Replace with your badge path (optional)
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://example.com') // Replace with your URL
    );
});
