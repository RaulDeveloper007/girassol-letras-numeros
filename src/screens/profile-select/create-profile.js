import '../../styles/create-profile.css'
import { navigateTo } from '../../app/router.js'
import { setState } from '../../app/state.js'
import { createStudentProfile } from '../../app/onboarding.js'

const ICONS = ['🌼', '🌻', '🌸', '🌷', '🌺', '🌹']
const MIN_AGE = 3
const MAX_AGE = 12
const DEFAULT_AGE = 6

export function renderCreateProfile(root) {
  let selectedIcon = ICONS[0]
  let age = DEFAULT_AGE

  root.innerHTML = `
    <main class="screen screen-create-profile">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <h1>Novo aluno</h1>

      <label class="field-label" for="student-name">Qual é o nome?</label>
      <input type="text" id="student-name" class="text-input" maxlength="20" placeholder="Nome" autocomplete="off" />

      <p class="field-label">Quantos anos tem?</p>
      <div class="age-stepper">
        <button type="button" id="age-dec" aria-label="Diminuir idade">−</button>
        <span id="age-value">${age}</span>
        <button type="button" id="age-inc" aria-label="Aumentar idade">+</button>
      </div>

      <p class="field-label">Escolha um ícone</p>
      <div class="icon-grid" id="icon-grid">
        ${ICONS.map(
          (icon) => `<button type="button" class="icon-option ${icon === selectedIcon ? 'is-selected' : ''}" data-icon="${icon}">${icon}</button>`
        ).join('')}
      </div>

      <p class="form-error" id="form-error"></p>
      <button type="button" id="create-student">Criar perfil</button>
    </main>
  `

  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/'))

  root.querySelector('#age-dec').addEventListener('click', () => {
    age = Math.max(MIN_AGE, age - 1)
    root.querySelector('#age-value').textContent = String(age)
  })
  root.querySelector('#age-inc').addEventListener('click', () => {
    age = Math.min(MAX_AGE, age + 1)
    root.querySelector('#age-value').textContent = String(age)
  })

  root.querySelectorAll('.icon-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedIcon = btn.dataset.icon
      root.querySelectorAll('.icon-option').forEach((b) => b.classList.remove('is-selected'))
      btn.classList.add('is-selected')
    })
  })

  root.querySelector('#create-student').addEventListener('click', async () => {
    const nameInput = root.querySelector('#student-name')
    const firstName = nameInput.value.trim()
    const errorEl = root.querySelector('#form-error')

    if (!firstName) {
      errorEl.textContent = 'Digite um nome para continuar.'
      return
    }

    const student = await createStudentProfile({ firstName, age, avatarIcon: selectedIcon })
    setState({ activeStudentId: student.id })
    navigateTo('#/aluno')
  })

  return () => {}
}
