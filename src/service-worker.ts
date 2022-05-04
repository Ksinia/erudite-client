/// <reference lib="WebWorker" />
declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: unknown };

export {};

const ignored = self.__WB_MANIFEST;

self.addEventListener("push", (event: PushEvent) => {
  var data: any = {};
  if (event.data) {
    data = event.data.json();
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "just a title", {
      body: data.message,
      tag: data.gameId,
      requireInteraction: true,
      silent: false,
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
      })
      .then(function (clientList: readonly WindowClient[]) {
        const gameId = event.notification.tag;
        const gameUrl = `/game/${gameId}`; // TODO: What if no game id???
        for (var i = 0; i < clientList.length; i++) {
          if (new URL(clientList[i].url).pathname.startsWith(gameUrl))
            return clientList[i].focus();
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(gameUrl);
        }
      })
  );
});
