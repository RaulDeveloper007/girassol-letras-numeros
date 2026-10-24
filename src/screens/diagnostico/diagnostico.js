import '../../styles/diagnostico.css'
import { navigateTo } from '../../app/router.js'
import { listarBlocosLineares } from '../../diagnostico/orquestracao.js'
import { calcularIndiceDePartida, diagnosticoConcluido, iniciarDiagnostico, registrarResposta } from '../../diagnostico/algoritmo.js'
import { montarFolha } from '../../geracao/montar-folha.js'
import { registrarTodosOsGeradores } from '../../geracao/registrar-todos.js'
import { avaliaNumerico, avaliaSimbolico } from '../../correcao/simbolico.js'
import { avaliaTextual } from '../../correcao/textual.js'
import { createWritingCanvas } from '../../components/writing-canvas.js'
import { createBigKeyboard } from '../../components/big-keyboard.js'

let geradoresRegistrados = false

// Mesmo motor de despacho por tipo usado na Folha Digital -- o gabarito de
// um item de fração/álgebra não é um número, então avaliaNumerico sozinho
// reprovaria qualquer resposta certa.
async function avaliarResposta(item, valor) {
  if (item.tipo === 'textual') {
    return avaliaTextual(valor, String(item.gabarito))
  }
  if (item.tipo === 'simbolico') {
    return avaliaSimbolico(valor, String(item.gabarito))
  }
  return avaliaNumerico(valor, Number(item.gabarito))
}

const DISCIPLINAS = [
  { id: 'matematica', label: 'Matemática' },
  { id: 'portugues', label: 'Português' },
  { id: 'ingles', label: 'Inglês' },
]

export function renderDiagnostico(root) {
  if (!geradoresRegistrados) {
    registrarTodosOsGeradores()
    geradoresRegistrados = true
  }

  root.innerHTML = `
    <main class="screen screen-diagnostico">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <h1>Teste diagnóstico</h1>
      <p>O ponto de partida é definido só pelo que o aluno já sabe — nunca
      pela idade. Escolha a disciplina para começar.</p>
      <div class="diagnostico-disciplinas" id="area-disciplinas"></div>
      <div id="area-diagnostico"></div>
    </main>
  `
  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/responsavel'))

  let writingCanvas = null
  let currentKeyboard = null

  function limparControles() {
    if (writingCanvas) {
      writingCanvas.destroy()
      writingCanvas = null
    }
    if (currentKeyboard) {
      currentKeyboard.destroy()
      currentKeyboard = null
    }
  }

  const areaDisciplinas = root.querySelector('#area-disciplinas')
  areaDisciplinas.innerHTML = DISCIPLINAS.map(
    (d) => `<button type="button" class="diagnostico-disciplina-btn" data-disciplina="${d.id}">${d.label}</button>`
  ).join('')

  areaDisciplinas.querySelectorAll('.diagnostico-disciplina-btn').forEach((btn) => {
    btn.addEventListener('click', () => iniciarParaDisciplina(btn.dataset.disciplina))
  })

  async function iniciarParaDisciplina(disciplina) {
    limparControles()
    const areaDiagnostico = root.querySelector('#area-diagnostico')
    areaDiagnostico.innerHTML = '<p class="placeholder-note">Carregando currículo…</p>'

    const pontos = await listarBlocosLineares(disciplina)

    if (pontos.length === 0) {
      areaDiagnostico.innerHTML = `
        <p class="placeholder-note">
          Ainda não há currículo declarado para esta disciplina (isso é
          trabalho das Etapas 8/9/10). O diagnóstico aqui fica disponível
          assim que houver pelo menos um bloco.
        </p>
      `
      return
    }

    let estado = iniciarDiagnostico(pontos.length)
    rodarPasso(disciplina, pontos, estado)
  }

  async function rodarPasso(disciplina, pontos, estado) {
    limparControles()
    const areaDiagnostico = root.querySelector('#area-diagnostico')

    if (diagnosticoConcluido(estado)) {
      const indicePartida = calcularIndiceDePartida(estado)
      const pontoDePartida = pontos[indicePartida]
      areaDiagnostico.innerHTML = `
        <div class="diagnostico-resultado">
          <h2>Diagnóstico concluído 🌻</h2>
          <p>Ponto de partida: <strong>Fase ${pontoDePartida.faseNumero} · Nível ${pontoDePartida.nivelNumero}</strong></p>
          <p class="placeholder-note">Bloco: ${pontoDePartida.bloco.habilidade}</p>
          <p class="placeholder-note">Respondeu ${estado.tentativas.length} pergunta(s) de calibração.</p>
          <button type="button" id="go-responsavel">Voltar ao painel</button>
        </div>
      `
      areaDiagnostico.querySelector('#go-responsavel').addEventListener('click', () => navigateTo('#/responsavel'))
      return
    }

    const ponto = pontos[estado.indiceAtual]
    const { itens } = montarFolha({ bloco: ponto.bloco, quantidadeItens: 1 })
    const item = itens[0]

    areaDiagnostico.innerHTML = `
      <p class="diagnostico-progresso">Pergunta de calibração ${estado.tentativas.length + 1}</p>
      <p class="item-enunciado">${item.enunciado}</p>
      <div id="diagnostico-resposta"></div>
      <div class="item-feedback" id="diagnostico-feedback"></div>
    `

    const canvasSlot = document.createElement('div')
    areaDiagnostico.appendChild(canvasSlot)
    writingCanvas = createWritingCanvas(canvasSlot)

    currentKeyboard = createBigKeyboard(areaDiagnostico.querySelector('#diagnostico-resposta'), {
      mode: 'numeric',
      onSubmit: async (valor) => {
        if (!valor) return
        const resultado = await avaliarResposta(item, valor)
        const feedbackEl = areaDiagnostico.querySelector('#diagnostico-feedback')
        feedbackEl.textContent = resultado.correto ? '✅' : '❌'

        const proximoEstado = registrarResposta(estado, resultado.correto)
        window.setTimeout(() => rodarPasso(disciplina, pontos, proximoEstado), 700)
      },
    })
  }

  return () => limparControles()
}
