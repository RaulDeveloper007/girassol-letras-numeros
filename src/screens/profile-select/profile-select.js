import { navigateTo } from '../../app/router.js'
import { setState } from '../../app/state.js'

export function renderProfileSelect(root) {
  root.innerHTML = `
    <main class="screen screen-profile-select">
      <h1>🌻 Girassol das Letras e Números</h1>
      <p>Quem vai estudar hoje?</p>
      <div class="profile-grid">
        <button class="profile-card" data-student="crianca-5">🌼 Criança 1</button>
        <button class="profile-card" data-student="crianca-8">🌻 Criança 2</button>
      </div>
      <button class="link-button" id="go-guardian">⚙ Responsável</button>
    </main>
  `

  root.querySelectorAll('.profile-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      setState({ activeStudentId: btn.dataset.student })
      navigateTo('#/aluno')
    })
  })

  root.querySelector('#go-guardian').addEventListener('click', () => {
    navigateTo('#/responsavel')
  })
}
