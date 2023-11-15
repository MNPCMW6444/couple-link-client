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
    const notificationData = event.notification.data;

    event.notification.close();
    event.waitUntil(
        clients.matchAll({type: 'window'}).then(windowClients => {
            const chatUrl = `https://dualchatgpt.com/chat?pairId=${notificationData.pairId}&sessionId=${notificationData.sessionId}`;


            for (var i = 0; i < windowClients?.length; i++) {
                var client = windowClients[i];
                if (client.url.startsWith(chatUrl) && 'focus' in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(chatUrl);
            }
        })
    );
});
