self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "MakeMyTour Flight Update",
      message: event.data ? event.data.text() : "A flight has been updated.",
    };
  }

  const title = data.title || "MakeMyTour Flight Update";

  const options = {
    body: data.message || "Your tracked flight has changed.",
    icon: "/icons/flight-notification.png",
    badge: "/icons/flight-notification.png",
    tag: data.flightNumber || "flight-status",
    data: {
      url: data.url || "/flight-status",
      flightNumber: data.flightNumber || "",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/flight-status",
    self.location.origin,
  ).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (
            client.url.startsWith(self.location.origin) &&
            "focus" in client
          ) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }

        return clients.openWindow(targetUrl);
      }),
  );
});
