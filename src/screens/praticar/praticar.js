import '../../styles/folha-digital.css'
import { navigateTo } from '../../app/router.js'
import { getState } from '../../app/state.js'
import { buscarBloco, carregarFase, primeiroBlocoDaProximaFase, proximoBlocoId } from '../../curriculo/loader.js'
import { registrarTodosOsGeradores } from '../../geracao/registrar-todos.js'
import { avaliaNumerico, avaliaSimbolico } from '../../correcao/simbolico.js'
import { avaliaTextual } from '../../correcao/textual.js'
import { TOLERANCIA_PADRAO_POR_ESTAGIO } from '../../correcao/fala.js'
import { avaliaTesteDeConclusao } from '../../progressao/teste-de-conclusao.js'
import { decidirProximoPassoNoCurriculo } from '../../progressao/orquestracao.js'
import { contarSequenciaAtual } from '../../progressao/dominio.js'
import { obterOuCriarProgresso, salvarProgresso } from '../../dados/progresso.js'
import { finalizarFolha, iniciarFolha, iniciarTesteDeConclusao, listarFolhasPorBloco, registrarTentativa } from '../../dados/sessao.js'
import { salvarCorrecao } from '../../dados/correcoes.js'
import { salvarTentativaDeFala } from '../../dados/tentativas-de-fala.js'
import { registrarResultadoDeRevisao } from '../../dados/revisoes-agendadas.js'
import { registrarTesteDeConclusao } from '../../dados/testes-de-conclusao.js'
import { obterOuCriarTarefaDeHoje, registrarFolhaConcluidaHoje } from '../../dados/tarefa-diaria.js'
import { folhasRestantesHoje, tarefaConcluidaHoje } from '../../progressao/tarefa-diaria.js'
import { createWritingCanvas } from '../../components/writing-canvas.js'
import { createBigKeyboard } from '../../components/big-keyboard.js'
import { criarCronometroPadrao } from '../../components/cronometro-padrao.js'
import { criarPlayerAudio } from '../../components/player-audio.js'
import { criarMicrofone } from '../../components/microfone.js'
import { criarBotaoReconhecerEscrita } from '../../components/botao-reconhecer-escrita.js'
import { criarAutoavaliacaoRubrica } from '../../components/autoavaliacao-rubrica.js'
import { renderizarMatematica } from '../../components/katex-render.js'

let geradoresRegistrados = false

const NOMES_DISCIPLINA = { matematica: 'Matemática', portugues: 'Português', ingles: 'Inglês' }
const QUANTIDADE_ITENS_POR_FOLHA = 5
const TIPOS_DE_FALA = ['fala-repetir', 'fala-leitura', 'fala-resposta']
// Tempo pra ver o feedback (certo/errado) antes do avanço automático pro
// próximo item -- não existe mais botão de "Próximo": confirmar já avança.
const ATRASO_AUTO_AVANCO_MS = 900

function metodoDeCorrecao(tipo) {
  if (tipo === 'textual') return 'textual'
  if (tipo === 'simbolico') return 'simbolico'
  if (TIPOS_DE_FALA.includes(tipo)) return 'fala'
  if (tipo === 'producao-livre') return 'rubrica'
  return 'numerico'
}

async function avaliarResposta(item, valor) {
  if (item.tipo === 'textual') {
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

export function renderPraticar(root) {
  if (!geradoresRegistrados) {
    registrarTodosOsGeradores()
    geradoresRegistrados = true
  }

  const { activeStudentId, activeSubject } = getState()
  if (!activeStudentId || !activeSubject) {
    navigateTo('#/')
    return
  }
  const alunoId = activeStudentId
  const disciplina = activeSubject

  root.innerHTML = `
    <main class="screen screen-folha-digital">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <p class="placeholder-note">Preparando a folha…</p>
    </main>
  `
  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/aluno'))

  let writingCanvas = null
  let currentKeyboard = null
  let microfone = null
  let player = null
  let cronometro = null
  let botaoReconhecer = null
  let autoavaliacao = null

  let faseInfo = null
  let blocoAtual = null
  let nivelDoTesteAtual = null
  let folhaDb = null
  let itensDb = []
  let resultados = []
  let currentIndex = 0
  let modoRefazer = false
  let filaRefazer = []
  let ehTesteDeConclusao = false
  let inicioDoItemEm = 0

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
    if (autoavaliacao) {
      autoavaliacao.destroy()
      autoavaliacao = null
    }
  }

  /**
   * Tela de fim de folha/teste que respeita o bloquinho diário: só oferece
   * "fazer a próxima folha de hoje" enquanto a tarefa do dia (ver
   * dados/tarefa-diaria.js) ainda não foi cumprida nesta disciplina. Uma
   * vez cumprida, a disciplina trava até o dia seguinte -- não existe
   * "praticar mais" aqui, de propósito: o método é o bloquinho fixo, não
   * a prática livre.
   */
  async function telaFinalDoDia(root, { titulo, linhas }) {
    const tarefa = await obterOuCriarTarefaDeHoje(alunoId, disciplina)
    const concluidaHoje = tarefaConcluidaHoje(tarefa)
    const restantes = folhasRestantesHoje(tarefa)

    root.innerHTML = `
      <main class="screen screen-folha-digital">
        <h1>${titulo}</h1>
        ${linhas.map((linha) => `<p class="result-summary">${linha}</p>`).join('')}
        <p class="placeholder-note">
          ${
            concluidaHoje
              ? `Tarefa de hoje em ${NOMES_DISCIPLINA[disciplina] ?? disciplina} concluída (${tarefa.folhasConcluidas}/${tarefa.folhasAlvo}). Pronto até amanhã!`
              : `Faltam ${restantes} folha(s) hoje em ${NOMES_DISCIPLINA[disciplina] ?? disciplina} (${tarefa.folhasConcluidas}/${tarefa.folhasAlvo}).`
          }
        </p>
        ${!concluidaHoje ? '<button id="continuar-hoje">Fazer a próxima folha de hoje →</button>' : ''}
        <button id="go-aluno">Voltar</button>
      </main>
    `
    root.querySelector('#go-aluno').addEventListener('click', () => navigateTo('#/aluno'))
    if (!concluidaHoje) {
      root.querySelector('#continuar-hoje').addEventListener('click', () => iniciar())
    }
  }

  function renderCasca() {
    root.innerHTML = `
      <main class="screen screen-folha-digital">
        <button class="back-button" id="go-back" aria-label="Voltar">←</button>
        <header class="folha-cabecalho">
          <div>
            <h1>Passo Certo</h1>
            <p class="folha-meta">
              ${NOMES_DISCIPLINA[disciplina] ?? disciplina} · ${ehTesteDeConclusao ? 'Teste de conclusão de nível' : `${faseInfo.titulo} · Fase ${faseInfo.faseNumero}`}
            </p>
          </div>
          <span id="cronometro-slot"></span>
        </header>
        ${
          ehTesteDeConclusao
            ? '<p class="placeholder-note">Esse teste mistura um item de cada bloco do nível, pra confirmar que o domínio é de verdade. Precisa de 100% pra passar.</p>'
            : '<section id="exemplo-resolvido" class="exemplo-resolvido"></section>'
        }
        <p class="sheet-progress" id="progresso-texto"></p>
        <div id="area-item"></div>
        <div id="canvas-slot"></div>
      </main>
    `
    root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/aluno'))

    if (!ehTesteDeConclusao) {
      root.querySelector('#exemplo-resolvido').innerHTML = `
        <h2>Exemplo</h2>
        <p>${blocoAtual.exemploResolvido.enunciado}</p>
        <ol>${blocoAtual.exemploResolvido.passoAPasso.map((passo) => `<li>${passo}</li>`).join('')}</ol>
      `
    }
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
      finalizarSessao()
    } else {
      renderItemAtual()
    }
  }

  function renderItemAtual() {
    const indice = modoRefazer ? filaRefazer[0] : currentIndex
    const item = itensDb[indice]
    const resultadoExistente = resultados[indice]
    inicioDoItemEm = Date.now()
    // Trava contra clique duplo: sem isso, confirmar duas vezes rápido antes
    // do avanço automático disparar agendaria dois avanços e pularia um item.
    let avancoEmAndamento = false
    function agendarAvanco(fn) {
      if (avancoEmAndamento) return
      avancoEmAndamento = true
      window.setTimeout(fn, ATRASO_AUTO_AVANCO_MS)
    }

    // Sempre começa do zero pra cada item -- nenhum controle do item
    // anterior deve sobreviver (senão ouvintes/canvas antigos se acumulam).
    limparControlesDeResposta()

    root.querySelector('#progresso-texto').textContent = modoRefazer
      ? `Refazendo: faltam ${filaRefazer.length} item(ns) errado(s)`
      : `Item ${currentIndex + 1} de ${itensDb.length}`

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

    const precisaDeAudio = Boolean(item.dados?.textoFala) || item.tipo === 'fala-repetir' || item.tipo === 'escuta-escolha'
    if (precisaDeAudio) {
      player = criarPlayerAudio(area.querySelector('#item-player-slot'), {
        texto: item.dados?.textoFala ?? item.enunciado,
        idioma: item.dados?.idioma ?? 'pt-BR',
      })
    }

    const feedbackEl = area.querySelector('#item-feedback')
    function mostrarFeedback(correto) {
      feedbackEl.textContent = correto ? '✅ Muito bem!' : '❌ Tente de novo!'
      feedbackEl.className = `item-feedback ${correto ? 'is-correct' : 'is-wrong'}`
    }

    function tempoGastoNoItemSegundos() {
      return Math.max(1, Math.round((Date.now() - inicioDoItemEm) / 1000))
    }

    if (item.tipo === 'producao-livre') {
      autoavaliacao = criarAutoavaliacaoRubrica(area.querySelector('#item-resposta'), {
        rubrica: item.dados.rubrica,
        onEnviar: async ({ texto, pontuacoesPorCriterio }) => {
          await registrarTentativa(item, { texto, pontuacoesPorCriterio }, false, tempoGastoNoItemSegundos())
          await salvarCorrecao({ itemId: item.id, metodo: 'rubrica', correto: false, revisadoPeloOrientador: false })
          registrarResultado(indice, false)
          feedbackEl.textContent = '📨 Enviado para revisão do responsável.'
          feedbackEl.className = 'item-feedback'
          agendarAvanco(avancarOuFinalizarPasse)
        },
      })
    } else if (TIPOS_DE_FALA.includes(item.tipo)) {
      microfone = criarMicrofone(area.querySelector('#item-resposta'), {
        fraseAlvo: item.dados.fraseAlvo,
        idioma: item.dados.idioma,
        tolerancia: TOLERANCIA_PADRAO_POR_ESTAGIO.intermediario,
        onDecisao: async (decisao, avaliacao, resultadoReconhecimento) => {
          if (decisao.tipo === 'tentar-de-novo') return

          const correto = decisao.tipo === 'aceito'

          await salvarTentativaDeFala({
            itemId: item.id,
            transcricao: resultadoReconhecimento.transcricao,
            idioma: item.dados.idioma,
            camadaUsada: resultadoReconhecimento.camada,
            similaridade: avaliacao.similaridade,
            aceito: correto,
            encaminhadoParaOrientador: decisao.tipo === 'encaminhar-orientador',
          })
          await registrarTentativa(item, resultadoReconhecimento.transcricao, correto, tempoGastoNoItemSegundos())
          await salvarCorrecao({ itemId: item.id, metodo: 'fala', correto, revisadoPeloOrientador: false })

          registrarResultado(indice, correto)
          agendarAvanco(modoRefazer ? avancarFilaRefazer : avancarOuFinalizarPasse)
        },
      })
    } else {
      writingCanvas = createWritingCanvas(root.querySelector('#canvas-slot'))

      currentKeyboard = createBigKeyboard(area.querySelector('#item-resposta'), {
        mode: disciplina === 'matematica' ? 'numeric' : 'alpha',
        onSubmit: async (valor) => {
          if (!valor) return
          const resultado = await avaliarResposta(item, valor)
          await registrarTentativa(item, valor, resultado.correto, tempoGastoNoItemSegundos())
          await salvarCorrecao({
            itemId: item.id,
            metodo: metodoDeCorrecao(item.tipo),
            correto: resultado.correto,
            detalhe: resultado.detalhe,
            revisadoPeloOrientador: false,
          })

          mostrarFeedback(resultado.correto)
          registrarResultado(indice, resultado.correto)
          if (modoRefazer) {
            if (resultado.correto) agendarAvanco(avancarFilaRefazer)
          } else {
            agendarAvanco(avancarOuFinalizarPasse)
          }
        },
      })
      if (resultadoExistente.respondido && !modoRefazer) {
        mostrarFeedback(resultadoExistente.corretoFinal)
      }

      if (disciplina === 'matematica') {
        botaoReconhecer = criarBotaoReconhecerEscrita(root.querySelector('#canvas-slot'), {
          writingCanvas,
          onReconhecido: (texto) => currentKeyboard.setValue(texto),
        })
      }
    }
  }

  // Único ponto de avanço do app: usado depois de CADA resposta confirmada
  // (certa ou errada -- o erro só vira ciclo de refazer no fim da passada),
  // tanto na folha normal quanto no teste de conclusão. Não existe mais
  // navegação manual (Anterior/Próximo): confirmar a resposta já avança.
  function avancarOuFinalizarPasse() {
    if (currentIndex < itensDb.length - 1) {
      currentIndex += 1
      renderItemAtual()
      return
    }

    if (ehTesteDeConclusao) {
      finalizarSessao()
      return
    }

    // Produção livre nunca tem um "certo/errado" real (sempre vai pra
    // revisão do responsável) -- não faz sentido entrar no ciclo de
    // refazer por causa disso.
    const indicesErrados = resultados
      .map((resultado, i) => (!resultado.corretoFinal && itensDb[i].tipo !== 'producao-livre' ? i : null))
      .filter((i) => i !== null)

    if (indicesErrados.length === 0) {
      finalizarSessao()
      return
    }

    modoRefazer = true
    filaRefazer = indicesErrados
    renderItemAtual()
  }

  async function calcularFolhasRecentesPara(bloco) {
    const folhasAnteriores = await listarFolhasPorBloco(alunoId, bloco.id)
    return folhasAnteriores
      .filter((f) => f.finalizadaEm)
      .sort((a, b) => a.numeroDaTentativaNoBloco - b.numeroDaTentativaNoBloco)
      .map((f) => ({
        notaPrimeiraTentativa: f.notaPrimeiraTentativa,
        tempoSegundos: f.tempoGastoSegundos,
        tempoPadraoSegundos: f.tempoPadraoSegundos,
      }))
  }

  async function finalizarSessao() {
    if (cronometro) cronometro.parar()
    const tempoGasto = cronometro ? cronometro.getSegundos() : 0
    limparControlesDeResposta()

    if (ehTesteDeConclusao) {
      return finalizarTesteDeConclusao()
    }

    if (blocoAtual.tiposDeItem.includes('producao-livre')) {
      await finalizarFolha(folhaDb.id, {
        notaPrimeiraTentativa: 0,
        tempoGastoSegundos: tempoGasto,
        houveRefazer: false,
        itensQueFalharamPrimeiro: [],
      })
      await registrarFolhaConcluidaHoje(alunoId, disciplina)
      telaFinalDoDia(root, {
        titulo: 'Resposta enviada! 📨',
        linhas: [
          'Sua produção foi enviada para a revisão do responsável.',
          'Esse tipo de atividade não avança sozinha -- o responsável decide quando avançar, no painel.',
        ],
      })
      return
    }

    const acertosPrimeiraTentativa = resultados.filter((r) => r.corretoPrimeiraTentativa).length
    const notaPrimeiraTentativa = Math.round((acertosPrimeiraTentativa / resultados.length) * 100)
    const itensQueFalharamPrimeiro = resultados.map((r, i) => (!r.corretoPrimeiraTentativa ? itensDb[i].id : null)).filter(Boolean)

    await finalizarFolha(folhaDb.id, {
      notaPrimeiraTentativa,
      tempoGastoSegundos: tempoGasto,
      houveRefazer: itensQueFalharamPrimeiro.length > 0,
      itensQueFalharamPrimeiro,
    })
    await registrarResultadoDeRevisao(alunoId, blocoAtual.id, notaPrimeiraTentativa === 100)
    await registrarFolhaConcluidaHoje(alunoId, disciplina)

    const folhasRecentes = await calcularFolhasRecentesPara(blocoAtual)
    const passo = decidirProximoPassoNoCurriculo({
      fase: faseInfo,
      blocoAtualId: blocoAtual.id,
      folhasRecentes,
      criterio: blocoAtual.criterioDominio,
    })

    if (passo.tipo === 'avancar-bloco') {
      const progresso = await obterOuCriarProgresso(alunoId, disciplina)
      const encontrado = buscarBloco(faseInfo, passo.proximoBlocoId)
      await salvarProgresso({ ...progresso, nivelAtual: encontrado?.nivel.numero ?? progresso.nivelAtual, blocoAtualId: passo.proximoBlocoId })
    }
    // 'repetir-bloco': nada muda. 'teste-de-conclusao': só dispara na
    // próxima visita a esta tela (ver iniciar()), não muda progresso agora.

    const mensagem =
      passo.tipo === 'repetir-bloco'
        ? (() => {
            const sequencia = contarSequenciaAtual(folhasRecentes, blocoAtual.criterioDominio)
            return sequencia > 0
              ? `Continue praticando este mesmo assunto -- você já está com ${sequencia} de ${blocoAtual.criterioDominio.folhasConsecutivas} folhas perfeitas seguidas!`
              : 'Continue praticando este mesmo assunto -- quase lá!'
          })()
        : passo.tipo === 'avancar-bloco'
          ? 'Você avançou pro próximo assunto. 🎉'
          : 'Você vai fazer um teste de conclusão deste nível na próxima vez.'

    telaFinalDoDia(root, {
      titulo: 'Folha concluída! ✅',
      linhas: [
        `Nota da primeira tentativa: <strong>${notaPrimeiraTentativa}%</strong>`,
        `Tempo: <strong>${formatarTempo(tempoGasto)}</strong> (padrão: ${formatarTempo(blocoAtual.tempoPadraoSegundos)})`,
        mensagem,
      ],
    })
  }

  async function finalizarTesteDeConclusao() {
    const resultado = avaliaTesteDeConclusao(resultados.map((r, i) => ({ id: itensDb[i].id, correto: r.corretoFinal })))
    await registrarTesteDeConclusao({
      alunoId,
      disciplina,
      faseNumero: faseInfo.faseNumero,
      nivelNumero: nivelDoTesteAtual,
      itensIds: itensDb.map((i) => i.id),
      resultado,
    })

    if (resultado === 'reprovado') {
      telaFinalDoDia(root, {
        titulo: 'Quase lá! 💪',
        linhas: [
          'O teste de conclusão não passou dessa vez -- sem problema, vamos reforçar.',
          'Você vai continuar praticando o mesmo assunto antes de tentar o teste de novo.',
        ],
      })
      return
    }

    const progresso = await obterOuCriarProgresso(alunoId, disciplina)
    const proximoIdNaFase = proximoBlocoId(faseInfo, blocoAtual.id)

    if (proximoIdNaFase) {
      const encontrado = buscarBloco(faseInfo, proximoIdNaFase)
      await salvarProgresso({ ...progresso, nivelAtual: encontrado.nivel.numero, blocoAtualId: proximoIdNaFase })
      telaFinalDoDia(root, { titulo: 'Nível concluído! 🎉', linhas: ['Você passou no teste com 100% de acerto e avançou pro próximo nível.'] })
      return
    }

    const proximaFase = await primeiroBlocoDaProximaFase(disciplina, faseInfo.faseNumero)
    if (proximaFase) {
      await salvarProgresso({
        ...progresso,
        faseAtual: proximaFase.faseNumero,
        nivelAtual: proximaFase.nivelNumero,
        blocoAtualId: proximaFase.blocoId,
      })
      telaFinalDoDia(root, { titulo: 'Fase concluída! 🎉', linhas: ['Você passou no teste com 100% de acerto e avançou pra próxima fase!'] })
      return
    }

    telaFinalDoDia(root, {
      titulo: 'Parabéns! 🎉',
      linhas: ['Você concluiu todo o currículo disponível nesta disciplina até agora.'],
    })
  }

  async function iniciarBlocoNormal(bloco) {
    ehTesteDeConclusao = false
    blocoAtual = bloco
    const quantidade = bloco.tiposDeItem.includes('producao-livre') ? 1 : QUANTIDADE_ITENS_POR_FOLHA
    const sessao = await iniciarFolha(alunoId, bloco, quantidade)
    folhaDb = sessao.folha
    itensDb = sessao.itens
    resultados = itensDb.map(() => ({ respondido: false, corretoPrimeiraTentativa: null, corretoFinal: null }))
    currentIndex = 0
    modoRefazer = false
    filaRefazer = []

    renderCasca()
    cronometro = criarCronometroPadrao(root.querySelector('#cronometro-slot'), { tempoPadraoSegundos: bloco.tempoPadraoSegundos })
    renderItemAtual()
  }

  async function iniciarTeste(nivel) {
    ehTesteDeConclusao = true
    nivelDoTesteAtual = nivel.numero
    blocoAtual = nivel.blocos.at(-1)
    const sessao = await iniciarTesteDeConclusao(alunoId, nivel.blocos, blocoAtual.id)
    folhaDb = sessao.folha
    itensDb = sessao.itens
    resultados = itensDb.map(() => ({ respondido: false, corretoPrimeiraTentativa: null, corretoFinal: null }))
    currentIndex = 0

    renderCasca()
    cronometro = criarCronometroPadrao(root.querySelector('#cronometro-slot'), { tempoPadraoSegundos: folhaDb.tempoPadraoSegundos })
    renderItemAtual()
  }

  async function iniciar() {
    // Guarda contra navegação direta pelo hash (ex.: voltar do histórico do
    // navegador) depois que a tarefa de hoje já foi cumprida -- a tela
    // inicial do aluno já esconde o botão, mas essa trava garante que não
    // existe um caminho pra começar mais uma folha fora do bloquinho do dia.
    const tarefaAgora = await obterOuCriarTarefaDeHoje(alunoId, disciplina)
    if (tarefaConcluidaHoje(tarefaAgora)) {
      return telaFinalDoDia(root, {
        titulo: 'Tarefa de hoje já concluída ✅',
        linhas: [`Você já fez ${tarefaAgora.folhasConcluidas} de ${tarefaAgora.folhasAlvo} folhas hoje em ${NOMES_DISCIPLINA[disciplina] ?? disciplina}.`],
      })
    }

    const progresso = await obterOuCriarProgresso(alunoId, disciplina)
    faseInfo = await carregarFase(disciplina, progresso.faseAtual)
    const encontrado = buscarBloco(faseInfo, progresso.blocoAtualId)
    if (!encontrado) throw new Error(`Bloco "${progresso.blocoAtualId}" não encontrado no currículo de ${disciplina}.`)

    // Produção livre nunca é testada/avançada automaticamente -- é sempre
    // o responsável quem decide avançar, no painel.
    if (encontrado.bloco.tiposDeItem.includes('producao-livre')) {
      return iniciarBlocoNormal(encontrado.bloco)
    }

    const folhasRecentes = await calcularFolhasRecentesPara(encontrado.bloco)
    const passo = decidirProximoPassoNoCurriculo({
      fase: faseInfo,
      blocoAtualId: encontrado.bloco.id,
      folhasRecentes,
      criterio: encontrado.bloco.criterioDominio,
    })

    if (passo.tipo === 'teste-de-conclusao') {
      return iniciarTeste(encontrado.nivel)
    }

    await iniciarBlocoNormal(encontrado.bloco)
  }

  iniciar()

  return () => {
    if (cronometro) cronometro.destroy()
    limparControlesDeResposta()
  }
}
