// Tela inicial do aluno: antes, um grid de disciplinas pra escolher
// livremente e praticar à vontade. Agora mostra a TAREFA DE HOJE de cada
// disciplina (quantas folhas já feitas / quantas faltam) e trava a
// disciplina assim que a quantidade do dia é cumprida -- a disciplina do
// método é o bloquinho diário fixo, não a prática livre.
import { navigateTo } from '../../app/router.js'
import { getState, setState } from '../../app/state.js'
import { obterOuCriarTarefaDeHoje } from '../../dados/tarefa-diaria.js'
import { folhasRestantesHoje, tarefaConcluidaHoje } from '../../progressao/tarefa-diaria.js'

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
      <h1>Tarefa de hoje</h1>
      <p class="placeholder-note">Faça as folhas de cada disciplina na ordem -- quando a quantidade de hoje
      estiver completa, a disciplina fica pronta até amanhã.</p>
      <div class="subject-grid" id="subject-grid">
        ${DISCIPLINAS.map((d) => `<div class="subject-card is-loading" data-subject="${d.id}">Carregando…</div>`).join('')}
      </div>
    </main>
  `

  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/'))

  async function carregarCartoes() {
    for (const disciplina of DISCIPLINAS) {
      const tarefa = await obterOuCriarTarefaDeHoje(activeStudentId, disciplina.id)
      const concluida = tarefaConcluidaHoje(tarefa)
      const restantes = folhasRestantesHoje(tarefa)

      const cartao = root.querySelector(`.subject-card[data-subject="${disciplina.id}"]`)
      cartao.classList.remove('is-loading')
      cartao.classList.toggle('is-done', concluida)
      cartao.innerHTML = `
        <span class="card-icon">${concluida ? '✅' : disciplina.icone}</span>
        <span class="card-label">${disciplina.nome}</span>
        <span class="card-progress">${tarefa.folhasConcluidas}/${tarefa.folhasAlvo} folhas hoje</span>
        ${concluida ? '<span class="card-status">Pronto até amanhã</span>' : ''}
      `

      if (concluida) {
        cartao.setAttribute('aria-disabled', 'true')
        cartao.setAttribute('title', 'Tarefa de hoje já concluída -- volte amanhã.')
      } else {
        cartao.addEventListener('click', () => {
          setState({ activeSubject: disciplina.id })
          navigateTo('#/praticar')
        })
        cartao.setAttribute('role', 'button')
        cartao.setAttribute('tabindex', '0')
        cartao.setAttribute('title', `Faltam ${restantes} folha(s) hoje`)
      }
    }
  }

  carregarCartoes()
}
