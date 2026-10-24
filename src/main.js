import './styles/base.css'
import { startRouter } from './app/router.js'

startRouter(document.querySelector('#app'))

// Só registra o service worker em build de produção. Em "npm run dev" ele
// acabava servindo versões antigas em cache de todo o JS/CSS, escondendo
// qualquer alteração nova feita durante o desenvolvimento.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.error('Falha ao registrar o service worker:', error)
    })
  })
}
