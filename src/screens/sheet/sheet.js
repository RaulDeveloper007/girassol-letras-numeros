import { navigateTo } from '../../app/router.js'
import { getState } from '../../app/state.js'

const SUBJECT_LABELS = {
  math: 'Matemática',
  portuguese: 'Português',
  english: 'Inglês',
}

export function renderSheet(root) {
  const { activeStudentId, activeSubject } = getState()

  if (!activeStudentId || !activeSubject) {
    navigateTo('#/')
    return
  }

  root.innerHTML = `
    <main class="screen screen-sheet">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <h1>${SUBJECT_LABELS[activeSubject] ?? activeSubject}</h1>
      <p class="placeholder-note">
        Aqui vai a folha de exercícios, com canvas de escrita e teclado grande
        (Etapa 3: canvas; Etapa 4: geradores de folha).
      </p>
      <button id="go-result">Simular conclusão da folha →</button>
    </main>
  `

  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/aluno'))
  root.querySelector('#go-result').addEventListener('click', () => navigateTo('#/resultado'))
}
