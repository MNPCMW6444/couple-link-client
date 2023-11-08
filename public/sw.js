self.addEventListener('push', function (event) {
    const data = event.data.json();

    const options = {
        body: data.body,
        icon: 'icons/icon.png',
        badge: 'icons/badge.png',
        // Include any other options you want to set
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});


self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    debugger;
    // Handle the notification click
});
