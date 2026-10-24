import { navigateTo } from '../../app/router.js'

export function renderSheetResult(root) {
  root.innerHTML = `
    <main class="screen screen-sheet-result">
      <h1>Muito bem! 🌻</h1>
      <p class="placeholder-note">
        Resumo de acertos, tempo e regra de avanço de nível chegam na Etapa 5.
      </p>
      <button id="go-home">Voltar para a trilha</button>
    </main>
  `

  root.querySelector('#go-home').addEventListener('click', () => navigateTo('#/aluno'))
}
