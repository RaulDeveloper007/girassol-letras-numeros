import { navigateTo } from '../../app/router.js'
import { getState, setState } from '../../app/state.js'
import { saudacaoPorHorario } from '../../app/saudacao.js'
import { obterAluno } from '../../dados/alunos.js'

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
      <h1 id="student-greeting">${saudacaoPorHorario()}!</h1>
      <p>O que vamos estudar?</p>
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

  // O nome vem do perfil do aluno ativo; textContent evita interpretar
  // qualquer marcação digitada no nome.
  obterAluno(activeStudentId).then((aluno) => {
    const titulo = root.querySelector('#student-greeting')
    if (aluno && titulo) titulo.textContent = `${saudacaoPorHorario()}, ${aluno.nomeExibicao}!`
  })

  root.querySelectorAll('.subject-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      setState({ activeSubject: btn.dataset.subject })
      navigateTo('#/praticar')
    })
  })
}
