import { navigateTo } from '../../app/router.js'
import { getState, setState } from '../../app/state.js'

export function renderStudentHome(root) {
  const { activeStudentId } = getState()

  if (!activeStudentId) {
    navigateTo('#/')
    return
  }

  root.innerHTML = `
    <main class="screen screen-student-home">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <h1>O que vamos estudar?</h1>
      <div class="subject-grid">
        <button class="subject-card" data-subject="matematica"><span class="card-icon">➕</span><span class="card-label">Matemática</span></button>
        <button class="subject-card" data-subject="portugues"><span class="card-icon">📝</span><span class="card-label">Português</span></button>
        <button class="subject-card" data-subject="ingles"><span class="card-icon">🔤</span><span class="card-label">Inglês</span></button>
      </div>
    </main>
  `

  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/'))

  root.querySelectorAll('.subject-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      setState({ activeSubject: btn.dataset.subject })
      navigateTo('#/praticar')
    })
  })
}
