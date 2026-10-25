import { navigateTo } from '../../app/router.js'
import { getState, setState } from '../../app/state.js'
import { contarFolhasFinalizadasHoje } from '../../dados/sessao.js'
import { FOLHAS_POR_DIA_POR_DISCIPLINA } from '../../progressao/cota-diaria.js'

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
            <span class="card-note" id="nota-${d.id}"></span>
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

  // Só informativo aqui -- quem de fato bloqueia a prática depois da cota
  // diária é a própria tela de prática (ver screens/praticar/praticar.js).
  DISCIPLINAS.forEach(async (disciplina) => {
    const feitasHoje = await contarFolhasFinalizadasHoje(activeStudentId, disciplina.id)
    const nota = root.querySelector(`#nota-${disciplina.id}`)
    if (!nota) return
    nota.textContent = `${Math.min(feitasHoje, FOLHAS_POR_DIA_POR_DISCIPLINA)}/${FOLHAS_POR_DIA_POR_DISCIPLINA} hoje`
  })
}
