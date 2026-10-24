import { navigateTo } from '../../app/router.js'
import { getState, setState } from '../../app/state.js'

export function renderSheetResult(root) {
  const { lastSheetSummary } = getState()

  if (!lastSheetSummary) {
    navigateTo('#/aluno')
    return
  }

  const { correctCount, totalGraded, totalExercises, elapsedSeconds, leveledUp, newStage } = lastSheetSummary
  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')
  const seconds = String(elapsedSeconds % 60).padStart(2, '0')

  root.innerHTML = `
    <main class="screen screen-sheet-result">
      <h1>Muito bem! 🌻</h1>
      <p class="result-summary">
        Você acertou <strong>${correctCount} de ${totalGraded}</strong>
        ${totalGraded !== totalExercises ? `(de ${totalExercises} exercícios)` : ''}
        em <strong>${minutes}:${seconds}</strong>.
      </p>
      ${leveledUp ? `<p class="level-up-banner">🎉 Você avançou para <strong>${newStage.label}</strong>!</p>` : ''}
      <button id="go-home">Voltar para a trilha</button>
    </main>
  `

  root.querySelector('#go-home').addEventListener('click', () => {
    setState({ lastSheetSummary: null })
    navigateTo('#/aluno')
  })
}
