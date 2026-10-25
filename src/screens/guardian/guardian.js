import '../../styles/guardian.css'
import { navigateTo } from '../../app/router.js'
import { obterConfiguracoesOrientador } from '../../dados/orientador.js'
import { renderPinSetup, renderPinUnlock } from './pin-gate.js'
import { renderDashboard } from './dashboard.js'

export function renderGuardian(root) {
  root.innerHTML = `
    <main class="screen screen-guardian">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <div id="guardian-content"><p class="placeholder-note">Carregando…</p></div>
    </main>
  `
  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/'))

  let cleanup = null

  function showDashboard() {
    if (cleanup) cleanup()
    cleanup = renderDashboard(root.querySelector('#guardian-content'))
  }

  async function init() {
    const settings = await obterConfiguracoesOrientador()
    const content = root.querySelector('#guardian-content')

    if (!settings.pinHash) {
      cleanup = renderPinSetup(content, { onDone: showDashboard })
    } else {
      cleanup = renderPinUnlock(content, { onUnlocked: showDashboard })
    }
  }

  init()

  return () => {
    if (cleanup) cleanup()
  }
}
