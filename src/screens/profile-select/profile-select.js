import { navigateTo } from '../../app/router.js'
import { setState } from '../../app/state.js'
import { listStudents } from '../../data/students-repo.js'

export function renderProfileSelect(root) {
  root.innerHTML = `
    <main class="screen screen-profile-select">
      <h1>🌻 Girassol das Letras e Números</h1>
      <p>Quem vai estudar hoje?</p>
      <div class="profile-grid" id="profile-grid"></div>
      <button class="link-button" id="go-guardian">⚙ Responsável</button>
    </main>
  `

  root.querySelector('#go-guardian').addEventListener('click', () => {
    navigateTo('#/responsavel')
  })

  listStudents().then((students) => {
    const grid = root.querySelector('#profile-grid')
    const studentCards = students
      .map(
        (student) =>
          `<button class="profile-card" data-student="${student.id}"><span class="card-icon">${student.avatarIcon}</span><span class="card-label">${student.firstName}</span></button>`
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
