import '../../styles/create-profile.css'
import { navigateTo } from '../../app/router.js'
import { setState } from '../../app/state.js'
import { criarAluno } from '../../dados/alunos.js'
import { obterOuCriarProgresso } from '../../dados/progresso.js'

const DISCIPLINAS = ['matematica', 'portugues', 'ingles']

const ICONS = ['🌼', '🌻', '🌸', '🌷', '🌺', '🌹']
// Faixa etária do app é 3 a 90 (aprendizagem ao longo da vida, não só
// crianças) -- o limite de 12 aqui era um resquício de antes do app
// cobrir adultos.
const MIN_AGE = 3
const MAX_AGE = 90
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
        <input type="number" id="age-value" inputmode="numeric" min="${MIN_AGE}" max="${MAX_AGE}" value="${age}" />
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

  const ageInput = root.querySelector('#age-value')

  function setAge(novaIdade) {
    age = Math.min(MAX_AGE, Math.max(MIN_AGE, novaIdade))
    ageInput.value = String(age)
  }

  root.querySelector('#age-dec').addEventListener('click', () => setAge(age - 1))
  root.querySelector('#age-inc').addEventListener('click', () => setAge(age + 1))
  ageInput.addEventListener('change', () => setAge(Number(ageInput.value) || DEFAULT_AGE))

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

    const aluno = await criarAluno({ nomeExibicao: firstName, idade: age, avatarIcone: selectedIcon })
    // Progresso inicial em Fase 1 · Nível 1 pras três disciplinas -- a
    // posição real de cada uma só é decidida pelo desempenho (ou pelo
    // diagnóstico adaptativo), nunca pela idade.
    await Promise.all(DISCIPLINAS.map((disciplina) => obterOuCriarProgresso(aluno.id, disciplina)))

    setState({ activeStudentId: aluno.id })
    navigateTo('#/aluno')
  })

  return () => {}
}
