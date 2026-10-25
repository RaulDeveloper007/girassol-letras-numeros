import '../../styles/diagnostico.css'
import { navigateTo } from '../../app/router.js'
import { getState, setState } from '../../app/state.js'
import { obterOuCriarProgresso, salvarProgresso } from '../../dados/progresso.js'
import { listarBlocosLineares } from '../../diagnostico/orquestracao.js'
import { calcularIndiceDePartida, diagnosticoConcluido, iniciarDiagnostico, registrarResposta } from '../../diagnostico/algoritmo.js'
import { montarFolha } from '../../geracao/montar-folha.js'
import { registrarTodosOsGeradores } from '../../geracao/registrar-todos.js'
import { avaliaNumerico, avaliaSimbolico } from '../../correcao/simbolico.js'
import { avaliaTextual } from '../../correcao/textual.js'
import { TOLERANCIA_PADRAO_POR_ESTAGIO } from '../../correcao/fala.js'
import { createWritingCanvas } from '../../components/writing-canvas.js'
import { createBigKeyboard } from '../../components/big-keyboard.js'
import { criarPlayerAudio } from '../../components/player-audio.js'
import { criarMicrofone } from '../../components/microfone.js'
import { criarBotaoReconhecerEscrita } from '../../components/botao-reconhecer-escrita.js'

let geradoresRegistrados = false

const TIPOS_DE_FALA = ['fala-repetir', 'fala-leitura', 'fala-resposta']

// Um item de áudio/fala precisa de ouvir algo (o modelo a repetir, a
// pergunta) sem que a resposta já apareça escrita no enunciado visível --
// por isso o texto falado vem de dados.textoFala, nunca do enunciado.
function precisaDePlayerDeAudio(item) {
  return Boolean(item.dados?.textoFala) || item.tipo === 'fala-repetir' || item.tipo === 'escuta-escolha'
}

// Mesmo motor de despacho por tipo usado na Folha Digital -- o gabarito de
// um item de fração/álgebra não é um número, então avaliaNumerico sozinho
// reprovaria qualquer resposta certa.
async function avaliarResposta(item, valor) {
  if (item.tipo === 'textual') {
    // Alguns itens (ex. pontuação/maiúsculas) precisam desligar a
    // normalização padrão -- senão "o gato." passaria como igual a
    // "O gato.", justamente o que o exercício está testando.
    return avaliaTextual(valor, String(item.gabarito), item.dados?.regrasTextuais ?? {})
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

  const { activeStudentId, diagnosticoObrigatorio } = getState()
  if (!activeStudentId) {
    navigateTo('#/')
    return
  }

  // Modo obrigatório: todo perfil novo passa pelas 3 disciplinas em
  // sequência antes de liberar a tela inicial (ver create-profile.js) --
  // sem escolha de disciplina, sem pular. Fora desse fluxo (link do
  // painel do responsável), o diagnóstico continua opcional e por
  // disciplina escolhida à mão.
  const modoObrigatorio = Boolean(diagnosticoObrigatorio)
  let indiceObrigatorioAtual = 0

  root.innerHTML = `
    <main class="screen screen-diagnostico">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <h1>Teste diagnóstico</h1>
      <p>O ponto de partida é definido só pelo que o aluno já sabe — nunca
      pela idade.${modoObrigatorio ? ' Antes de começar, vamos descobrir onde o aluno já está em cada disciplina.' : ' Escolha a disciplina para começar.'}</p>
      ${modoObrigatorio ? '' : '<div class="diagnostico-disciplinas" id="area-disciplinas"></div>'}
      <div id="area-diagnostico"></div>
    </main>
  `
  root.querySelector('#go-back').addEventListener('click', () => navigateTo(modoObrigatorio ? '#/' : '#/responsavel'))

  let writingCanvas = null
  let currentKeyboard = null
  let player = null
  let microfone = null
  let botaoReconhecer = null

  function limparControles() {
    if (writingCanvas) {
      writingCanvas.destroy()
      writingCanvas = null
    }
    if (currentKeyboard) {
      currentKeyboard.destroy()
      currentKeyboard = null
    }
    if (player) {
      player.destroy()
      player = null
    }
    if (microfone) {
      microfone.destroy()
      microfone = null
    }
    if (botaoReconhecer) {
      botaoReconhecer.destroy()
      botaoReconhecer = null
    }
  }

  if (!modoObrigatorio) {
    const areaDisciplinas = root.querySelector('#area-disciplinas')
    areaDisciplinas.innerHTML = DISCIPLINAS.map(
      (d) => `<button type="button" class="diagnostico-disciplina-btn" data-disciplina="${d.id}">${d.label}</button>`
    ).join('')

    areaDisciplinas.querySelectorAll('.diagnostico-disciplina-btn').forEach((btn) => {
      btn.addEventListener('click', () => iniciarParaDisciplina(btn.dataset.disciplina))
    })
  }

  async function iniciarParaDisciplina(disciplina) {
    limparControles()
    const areaDiagnostico = root.querySelector('#area-diagnostico')
    areaDiagnostico.innerHTML = '<p class="placeholder-note">Carregando currículo…</p>'

    const pontos = await listarBlocosLineares(disciplina)

    if (pontos.length === 0) {
      // No modo obrigatório não existe seletor de disciplina pra escapar
      // disto -- sem um botão de continuar, o aluno ficaria preso aqui
      // pra sempre se algum currículo estivesse vazio.
      const proximaDisciplina = modoObrigatorio ? DISCIPLINAS[indiceObrigatorioAtual + 1] : null
      areaDiagnostico.innerHTML = `
        <p class="placeholder-note">
          Ainda não há currículo declarado para esta disciplina (isso é
          trabalho das Etapas 8/9/10). O diagnóstico aqui fica disponível
          assim que houver pelo menos um bloco.
        </p>
        ${
          modoObrigatorio
            ? `<button type="button" id="pular-disciplina">${proximaDisciplina ? `Continuar para ${proximaDisciplina.label} →` : 'Começar a praticar'}</button>`
            : ''
        }
      `
      if (modoObrigatorio) {
        indiceObrigatorioAtual += 1
        areaDiagnostico.querySelector('#pular-disciplina').addEventListener('click', () => {
          if (proximaDisciplina) {
            iniciarParaDisciplina(proximaDisciplina.id)
          } else {
            setState({ diagnosticoObrigatorio: false })
            navigateTo('#/aluno')
          }
        })
      }
      return
    }

    // Registra que o diagnóstico começou -- só muda de 'pendente' pra
    // 'em-andamento' na primeira vez; se o responsável reiniciar um
    // diagnóstico já concluído, o status some só quando ESTE terminar.
    const progressoAtual = await obterOuCriarProgresso(activeStudentId, disciplina)
    if (progressoAtual.statusDiagnostico === 'pendente') {
      await salvarProgresso({ ...progressoAtual, statusDiagnostico: 'em-andamento' })
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

      // O ponto todo do diagnóstico é reposicionar o aluno de verdade --
      // sem isso ele só mostra um número e não muda nada na prática.
      const progressoAtual = await obterOuCriarProgresso(activeStudentId, disciplina)
      await salvarProgresso({
        ...progressoAtual,
        faseAtual: pontoDePartida.faseNumero,
        nivelAtual: pontoDePartida.nivelNumero,
        blocoAtualId: pontoDePartida.bloco.id,
        statusDiagnostico: 'concluido',
        blocosDeReforcoPendentes: [],
      })

      const resumoComum = `
        <p>Ponto de partida: <strong>Fase ${pontoDePartida.faseNumero} · Nível ${pontoDePartida.nivelNumero}</strong></p>
        <p class="placeholder-note">Bloco: ${pontoDePartida.bloco.habilidade}</p>
        <p class="placeholder-note">Respondeu ${estado.tentativas.length} pergunta(s) de calibração.</p>
        <p class="placeholder-note">Progresso do aluno nesta disciplina já foi atualizado para esse ponto.</p>
      `

      if (modoObrigatorio) {
        const disciplinaAtual = DISCIPLINAS[indiceObrigatorioAtual]
        indiceObrigatorioAtual += 1
        const proximaDisciplina = DISCIPLINAS[indiceObrigatorioAtual]

        if (proximaDisciplina) {
          areaDiagnostico.innerHTML = `
            <div class="diagnostico-resultado">
              <h2>Diagnóstico de ${disciplinaAtual.label} concluído ✅</h2>
              ${resumoComum}
              <button type="button" id="proxima-disciplina">Continuar para ${proximaDisciplina.label} →</button>
            </div>
          `
          areaDiagnostico
            .querySelector('#proxima-disciplina')
            .addEventListener('click', () => iniciarParaDisciplina(proximaDisciplina.id))
          return
        }

        // As 3 disciplinas foram diagnosticadas -- acabou o fluxo
        // obrigatório, libera a tela inicial do aluno de verdade.
        setState({ diagnosticoObrigatorio: false })
        areaDiagnostico.innerHTML = `
          <div class="diagnostico-resultado">
            <h2>Diagnóstico de ${disciplinaAtual.label} concluído ✅</h2>
            ${resumoComum}
            <p>Pronto! O aluno já está posicionado no ponto certo nas três disciplinas.</p>
            <button type="button" id="ir-aluno">Começar a praticar</button>
          </div>
        `
        areaDiagnostico.querySelector('#ir-aluno').addEventListener('click', () => navigateTo('#/aluno'))
        return
      }

      areaDiagnostico.innerHTML = `
        <div class="diagnostico-resultado">
          <h2>Diagnóstico concluído ✅</h2>
          ${resumoComum}
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
      <div id="diagnostico-player-slot"></div>
      <div id="diagnostico-resposta"></div>
      <div class="item-feedback" id="diagnostico-feedback"></div>
    `

    const feedbackEl = areaDiagnostico.querySelector('#diagnostico-feedback')
    function avancarComResultado(correto) {
      feedbackEl.textContent = correto ? '✅' : '❌'
      const proximoEstado = registrarResposta(estado, correto)
      window.setTimeout(() => rodarPasso(disciplina, pontos, proximoEstado), 700)
    }

    if (precisaDePlayerDeAudio(item)) {
      player = criarPlayerAudio(areaDiagnostico.querySelector('#diagnostico-player-slot'), {
        texto: item.dados?.textoFala ?? item.enunciado,
        idioma: item.dados?.idioma ?? 'pt-BR',
      })
    }

    if (TIPOS_DE_FALA.includes(item.tipo)) {
      microfone = criarMicrofone(areaDiagnostico.querySelector('#diagnostico-resposta'), {
        fraseAlvo: item.dados?.fraseAlvo ?? String(item.gabarito),
        idioma: item.dados?.idioma ?? 'pt-BR',
        tolerancia: TOLERANCIA_PADRAO_POR_ESTAGIO.intermediario,
        onDecisao: (decisao) => {
          if (decisao.tipo === 'aceito' || decisao.tipo === 'encaminhar-orientador') {
            avancarComResultado(decisao.tipo === 'aceito')
          }
        },
      })
      return
    }

    const canvasSlot = document.createElement('div')
    areaDiagnostico.appendChild(canvasSlot)
    writingCanvas = createWritingCanvas(canvasSlot)

    currentKeyboard = createBigKeyboard(areaDiagnostico.querySelector('#diagnostico-resposta'), {
      mode: disciplina === 'matematica' ? 'numeric' : 'alpha',
      onSubmit: async (valor) => {
        if (!valor) return
        const resultado = await avaliarResposta(item, valor)
        avancarComResultado(resultado.correto)
      },
    })

    // O reconhecimento de escrita só cobre dígitos e símbolos de Matemática
    // (ver reconhecimento/alfabeto.ts) -- Português/Inglês continuam só
    // pelo teclado até existir reconhecimento de letras manuscritas.
    if (disciplina === 'matematica') {
      botaoReconhecer = criarBotaoReconhecerEscrita(canvasSlot, {
        writingCanvas,
        onReconhecido: (texto) => currentKeyboard.setValue(texto),
      })
    }
  }

  if (modoObrigatorio) {
    iniciarParaDisciplina(DISCIPLINAS[0].id)
  }

  return () => limparControles()
}
