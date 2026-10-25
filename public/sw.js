const CACHE_NAME = 'passo-certo-shell-v3'

const CORE_ASSETS = ['./', './index.html', './manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  // O documento HTML (navegação) usa network-first: ele é a única URL
  // estável que diz quais arquivos JS/CSS (com hash no nome) carregar. Se
  // ficasse em cache-first como o resto, o app nunca buscaria uma versão
  // publicada depois da primeira -- ficaria preso para sempre na primeira
  // vez que alguém abriu o site. JS/CSS com hash no nome são seguros em
  // cache-first, porque qualquer mudança de conteúdo já gera um nome novo.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() => caches.match(request).then((cached) => cached ?? caches.match('./index.html')))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached

      return fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => Response.error())
    })
  )
})
