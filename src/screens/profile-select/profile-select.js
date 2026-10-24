import { navigateTo } from '../../app/router.js'
import { setState } from '../../app/state.js'
import { ensureSeedStudents } from '../../data/students-repo.js'

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

  ensureSeedStudents().then((students) => {
    const grid = root.querySelector('#profile-grid')
    grid.innerHTML = students
      .map((student) => `<button class="profile-card" data-student="${student.id}">${student.avatarIcon} ${student.firstName}</button>`)
      .join('')

    grid.querySelectorAll('.profile-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        setState({ activeStudentId: btn.dataset.student })
        navigateTo('#/aluno')
      })
    })
  })
}
