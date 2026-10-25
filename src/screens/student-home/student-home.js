import { navigateTo } from '../../app/router.js'
import { getState, setState } from '../../app/state.js'

const DISCIPLINAS = [
  { id: 'matematica', icone: '➕', nome: 'Matemática' },
  { id: 'portugues', icone: '📝', nome: 'Português' },
  { id: 'ingles', icone: '🔤', nome: 'Inglês' },
]

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
        ${DISCIPLINAS.map(
          (d) => `
          <button class="subject-card" data-subject="${d.id}">
            <span class="card-icon">${d.icone}</span>
            <span class="card-label">${d.nome}</span>
          </button>
        `
        ).join('')}
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
