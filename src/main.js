import './styles/base.css'
import { startRouter } from './app/router.js'

startRouter(document.querySelector('#app'))

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.error('Falha ao registrar o service worker:', error)
    })
  })
}
