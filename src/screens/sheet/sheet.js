import { navigateTo } from '../../app/router.js'
import { getState } from '../../app/state.js'
import { createWritingCanvas } from '../../components/writing-canvas.js'

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
        Escreva o rascunho aqui embaixo. Os exercícios reais (geradores de
        folha) chegam na Etapa 4; o teclado grande de resposta, na Etapa 5.
      </p>
      <div id="canvas-slot"></div>
      <button id="go-result">Simular conclusão da folha →</button>
    </main>
  `

  const writingCanvas = createWritingCanvas(root.querySelector('#canvas-slot'))

  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/aluno'))
  root.querySelector('#go-result').addEventListener('click', () => navigateTo('#/resultado'))

  return () => writingCanvas.destroy()
}
