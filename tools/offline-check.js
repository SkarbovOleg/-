(async () => {
  const regs = await navigator.serviceWorker.getRegistrations();
  const keys = await caches.keys();
  let cached = 0;
  for (const key of keys) cached += (await (await caches.open(key)).keys()).length;
  return {
    controlled: Boolean(navigator.serviceWorker.controller),
    registrations: regs.length,
    caches: keys,
    cachedEntries: cached,
    title: document.title,
    rendered: document.querySelectorAll('section').length,
    h1: document.querySelector('h1') ? document.querySelector('h1').textContent.replace(/\s+/g, ' ').trim() : null
  };
})()
