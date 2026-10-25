import '../../styles/folha-digital.css'
import { navigateTo } from '../../app/router.js'
import { buscarBloco, carregarFase } from '../../curriculo/loader.js'
import { montarFolha } from '../../geracao/montar-folha.js'
import { registrarTodosOsGeradores } from '../../geracao/registrar-todos.js'
import { avaliaNumerico, avaliaSimbolico } from '../../correcao/simbolico.js'
import { avaliaTextual } from '../../correcao/textual.js'
import { TOLERANCIA_PADRAO_POR_ESTAGIO } from '../../correcao/fala.js'
import { createWritingCanvas } from '../../components/writing-canvas.js'
import { createBigKeyboard } from '../../components/big-keyboard.js'
import { criarCronometroPadrao } from '../../components/cronometro-padrao.js'
import { criarPlayerAudio } from '../../components/player-audio.js'
import { criarMicrofone } from '../../components/microfone.js'
import { criarBotaoReconhecerEscrita } from '../../components/botao-reconhecer-escrita.js'
import { renderizarMatematica } from '../../components/katex-render.js'

let geradoresRegistrados = false

// Ainda não existe conteúdo de fala no currículo declarativo (isso é
// Etapa 9/10). Este item fixo só serve pra provar que o componente de
// microfone funciona de ponta a ponta dentro do fluxo da folha.
const ITEM_DEMO_FALA = {
  tipo: 'fala-repetir',
  enunciado: 'Escute e repita em voz alta.',
  dados: { fraseAlvo: 'Eu gosto de estudar.', idioma: 'pt-BR' },
  gabarito: 'Eu gosto de estudar.',
}

// A resposta certa chega em formatos bem diferentes dependendo do tipo do
// item (um número, um texto exato como "3/4", uma expressão algébrica) --
// cada um precisa do seu próprio motor de correção, não só avaliaNumerico.
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

function formatarTempo(segundos) {
  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0')
  const segs = String(segundos % 60).padStart(2, '0')
  return `${minutos}:${segs}`
}

export function renderFolhaDigital(root) {
  if (!geradoresRegistrados) {
    registrarTodosOsGeradores()
    geradoresRegistrados = true
  }

  root.innerHTML = `
    <main class="screen screen-folha-digital">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <p class="placeholder-note">Preparando a folha…</p>
    </main>
  `
  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/responsavel'))

  let writingCanvas = null
  let currentKeyboard = null
  let microfone = null
  let player = null
  let cronometro = null
  let botaoReconhecer = null

  let faseInfo = null
  let blocoAtual = null
  let itens = []
  let resultados = []
  let currentIndex = 0
  let modoRefazer = false
  let filaRefazer = []

  function limparControlesDeResposta() {
    if (writingCanvas) {
      writingCanvas.destroy()
      writingCanvas = null
    }
    if (currentKeyboard) {
      currentKeyboard.destroy()
      currentKeyboard = null
    }
    if (microfone) {
      microfone.destroy()
      microfone = null
    }
    if (player) {
      player.destroy()
      player = null
    }
    if (botaoReconhecer) {
      botaoReconhecer.destroy()
      botaoReconhecer = null
    }
  }

  function renderCasca() {
    root.innerHTML = `
      <main class="screen screen-folha-digital">
        <button class="back-button" id="go-back" aria-label="Voltar">←</button>
        <header class="folha-cabecalho">
          <div>
            <h1>Passo Certo</h1>
            <p class="folha-meta">Matemática · ${faseInfo.titulo} · Fase ${faseInfo.faseNumero}</p>
          </div>
          <span id="cronometro-slot"></span>
        </header>
        <section id="exemplo-resolvido" class="exemplo-resolvido"></section>
        <p class="sheet-progress" id="progresso-texto"></p>
        <div id="area-item"></div>
        <div id="canvas-slot"></div>
        <div class="sheet-nav" id="area-nav">
          <button id="go-prev">← Anterior</button>
          <button id="go-next">Próximo →</button>
        </div>
      </main>
    `
    root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/responsavel'))
    root.querySelector('#go-prev').addEventListener('click', () => {
      if (!modoRefazer && currentIndex > 0) {
        currentIndex -= 1
        renderItemAtual()
      }
    })
    root.querySelector('#go-next').addEventListener('click', handleNext)

    root.querySelector('#exemplo-resolvido').innerHTML = `
      <h2>Exemplo</h2>
      <p>${blocoAtual.exemploResolvido.enunciado}</p>
      <ol>${blocoAtual.exemploResolvido.passoAPasso.map((passo) => `<li>${passo}</li>`).join('')}</ol>
    `
  }

  function registrarResultado(indice, correto) {
    const resultado = resultados[indice]
    if (!resultado.respondido) {
      resultado.respondido = true
      resultado.corretoPrimeiraTentativa = correto
    }
    resultado.corretoFinal = correto
  }

  function avancarFilaRefazer() {
    filaRefazer.shift()
    if (filaRefazer.length === 0) {
      finalizarFolha()
    } else {
      renderItemAtual()
    }
  }

  function renderItemAtual() {
    const indice = modoRefazer ? filaRefazer[0] : currentIndex
    const item = itens[indice]
    const resultadoExistente = resultados[indice]

    root.querySelector('#progresso-texto').textContent = modoRefazer
      ? `Refazendo: faltam ${filaRefazer.length} item(ns) errado(s)`
      : `Item ${currentIndex + 1} de ${itens.length}`

    const area = root.querySelector('#area-item')
    area.innerHTML = `
      <div class="item-enunciado" id="item-enunciado"></div>
      <div id="item-player-slot"></div>
      <div id="item-resposta"></div>
      <div class="item-feedback" id="item-feedback"></div>
    `

    const enunciadoEl = area.querySelector('#item-enunciado')
    if (item.dados?.operador) {
      renderizarMatematica(enunciadoEl, `${item.dados.a} ${item.dados.operador} ${item.dados.b} = \\,?`)
    } else {
      enunciadoEl.textContent = item.enunciado
    }

    player = criarPlayerAudio(area.querySelector('#item-player-slot'), {
      texto: item.enunciado,
      idioma: item.dados?.idioma ?? 'pt-BR',
    })

    if (writingCanvas) writingCanvas.destroy()
    writingCanvas = createWritingCanvas(root.querySelector('#canvas-slot'))

    if (currentKeyboard) {
      currentKeyboard.destroy()
      currentKeyboard = null
    }
    if (microfone) {
      microfone.destroy()
      microfone = null
    }
    if (botaoReconhecer) {
      botaoReconhecer.destroy()
      botaoReconhecer = null
    }

    const feedbackEl = area.querySelector('#item-feedback')
    function mostrarFeedback(correto) {
      feedbackEl.textContent = correto ? '✅ Muito bem!' : '❌ Tente de novo!'
      feedbackEl.className = `item-feedback ${correto ? 'is-correct' : 'is-wrong'}`
    }

    if (item.tipo === 'fala-repetir') {
      microfone = criarMicrofone(area.querySelector('#item-resposta'), {
        fraseAlvo: item.dados.fraseAlvo,
        idioma: item.dados.idioma,
        tolerancia: TOLERANCIA_PADRAO_POR_ESTAGIO.intermediario,
        onDecisao: (decisao) => {
          if (decisao.tipo === 'aceito') {
            registrarResultado(indice, true)
            if (modoRefazer) avancarFilaRefazer()
          } else if (decisao.tipo === 'encaminhar-orientador') {
            registrarResultado(indice, false)
            if (modoRefazer) avancarFilaRefazer()
          }
          atualizarNav(indice)
        },
      })
    } else {
      currentKeyboard = createBigKeyboard(area.querySelector('#item-resposta'), {
        mode: 'numeric',
        onSubmit: async (valor) => {
          if (!valor) return
          const resultado = await avaliarResposta(item, valor)
          mostrarFeedback(resultado.correto)
          registrarResultado(indice, resultado.correto)
          if (modoRefazer) {
            if (resultado.correto) avancarFilaRefazer()
          } else {
            atualizarNav(indice)
          }
        },
      })
      if (resultadoExistente.respondido && !modoRefazer) {
        mostrarFeedback(resultadoExistente.corretoFinal)
      }

      // Toda a Folha Digital hoje é Matemática (ver iniciar()) -- o
      // reconhecimento cobre dígitos e símbolos (ver reconhecimento/alfabeto.ts).
      botaoReconhecer = criarBotaoReconhecerEscrita(root.querySelector('#canvas-slot'), {
        writingCanvas,
        onReconhecido: (texto) => currentKeyboard.setValue(texto),
      })
    }

    atualizarNav(indice)
  }

  function atualizarNav(indice) {
    const navEl = root.querySelector('#area-nav')
    navEl.style.display = modoRefazer ? 'none' : 'flex'
    if (modoRefazer) return

    root.querySelector('#go-prev').disabled = currentIndex === 0
    root.querySelector('#go-next').disabled = !resultados[indice].respondido
    root.querySelector('#go-next').textContent = currentIndex === itens.length - 1 ? 'Concluir →' : 'Próximo →'
  }

  function handleNext() {
    if (currentIndex < itens.length - 1) {
      currentIndex += 1
      renderItemAtual()
      return
    }

    const indicesErrados = resultados
      .map((resultado, i) => (!resultado.corretoFinal ? i : null))
      .filter((i) => i !== null)

    if (indicesErrados.length === 0) {
      finalizarFolha()
      return
    }

    modoRefazer = true
    filaRefazer = indicesErrados
    renderItemAtual()
  }

  function finalizarFolha() {
    if (cronometro) cronometro.parar()
    const tempoGasto = cronometro ? cronometro.getSegundos() : 0
    limparControlesDeResposta()

    const acertosPrimeiraTentativa = resultados.filter((r) => r.corretoPrimeiraTentativa).length
    const notaPrimeiraTentativa = Math.round((acertosPrimeiraTentativa / resultados.length) * 100)

    root.innerHTML = `
      <main class="screen screen-folha-digital">
        <h1>Folha concluída! 🌻</h1>
        <p class="result-summary">Nota da primeira tentativa: <strong>${notaPrimeiraTentativa}%</strong></p>
        <p class="result-summary">
          Tempo: <strong>${formatarTempo(tempoGasto)}</strong>
          (padrão: ${formatarTempo(blocoAtual.tempoPadraoSegundos)})
        </p>
        <p class="placeholder-note">
          Pré-visualização da Folha Digital (Etapa 6) — ainda não grava progresso
          real no perfil (isso entra quando o Dexie v2 for ligado à UI).
        </p>
        <button id="go-responsavel">Voltar ao painel</button>
      </main>
    `
    root.querySelector('#go-responsavel').addEventListener('click', () => navigateTo('#/responsavel'))
  }

  async function iniciar() {
    faseInfo = await carregarFase('matematica', 1)
    const encontrado = buscarBloco(faseInfo, 'mat-f01-n01-b02')
    if (!encontrado) throw new Error('Bloco de demonstração não encontrado no currículo.')
    blocoAtual = encontrado.bloco

    const { itens: itensGerados } = montarFolha({ bloco: blocoAtual, quantidadeItens: 5 })
    itens = [...itensGerados, ITEM_DEMO_FALA]
    resultados = itens.map(() => ({ respondido: false, corretoPrimeiraTentativa: null, corretoFinal: null }))

    renderCasca()
    cronometro = criarCronometroPadrao(root.querySelector('#cronometro-slot'), {
      tempoPadraoSegundos: blocoAtual.tempoPadraoSegundos,
    })
    renderItemAtual()
  }

  iniciar()

  return () => {
    if (cronometro) cronometro.destroy()
    limparControlesDeResposta()
  }
}
