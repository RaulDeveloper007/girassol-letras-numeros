import { navigateTo } from '../../app/router.js'

export function renderGuardian(root) {
  root.innerHTML = `
    <main class="screen screen-guardian">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <h1>Painel do responsável</h1>
      <p class="placeholder-note">
        Proteção por PIN, histórico, ajuste de nível e backup JSON chegam na Etapa 6.
      </p>
    </main>
  `

  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/'))
}
