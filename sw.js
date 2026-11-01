const CACHE = "meloair-shell-v1";
const SHELL = ["./", "index.html", "css/styles.css", "js/config.js", "js/app.js", "manifest.webmanifest", "icons/meloair.svg", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(event.request,copy)); }
    return response;
  }).catch(()=>caches.match("index.html"))));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "./", self.location.origin).href;
  event.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    for (const client of list) if (client.url.startsWith(self.location.origin) && "focus" in client) return client.focus();
    return self.clients.openWindow(target);
  }));
});
self.addEventListener("push", event => {
  let data={title:"MeloAir",body:"Tienes un nuevo recordatorio de mantenimiento."};
  try { if(event.data) data={...data,...event.data.json()}; } catch {}
  event.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:data.url||"./"},tag:data.tag||"meloair-push"}));
});
