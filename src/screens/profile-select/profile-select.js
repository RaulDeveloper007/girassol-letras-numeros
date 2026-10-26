import { navigateTo } from '../../app/router.js'
import { setState } from '../../app/state.js'
import { listarAlunos } from '../../dados/alunos.js'
import { saudacaoPorHorario } from '../../app/saudacao.js'

export function renderProfileSelect(root) {
  root.innerHTML = `
    <main class="screen screen-profile-select">
      <h1>👣 Passo Certo</h1>
      <h2 id="greeting">${saudacaoPorHorario()}!</h2>
      <p>Quem vai estudar hoje?</p>
      <div class="profile-grid" id="profile-grid"></div>
      <button class="link-button" id="go-guardian">⚙ Responsável</button>
    </main>
  `

  root.querySelector('#go-guardian').addEventListener('click', () => {
    navigateTo('#/responsavel')
  })

  listarAlunos().then((alunos) => {
    const grid = root.querySelector('#profile-grid')
    const studentCards = alunos
      .map(
        (aluno) =>
          `<button class="profile-card" data-student="${aluno.id}"><span class="card-icon">${aluno.avatarIcone}</span><span class="card-label">${aluno.nomeExibicao}</span></button>`
      )
      .join('')
    const addCard = `<button class="profile-card profile-card--add" id="add-student"><span class="card-icon">➕</span><span class="card-label">Novo aluno</span></button>`

    grid.innerHTML = studentCards + addCard

    grid.querySelectorAll('.profile-card[data-student]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setState({ activeStudentId: btn.dataset.student })
        navigateTo('#/aluno')
      })
    })

    grid.querySelector('#add-student').addEventListener('click', () => navigateTo('#/novo-aluno'))
  })

  return () => {}
}
