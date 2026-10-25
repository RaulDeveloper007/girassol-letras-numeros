import { listarAlunos, removerAluno } from '../../dados/alunos.js'
import { listarProgressoPorAluno, obterOuCriarProgresso, salvarProgresso } from '../../dados/progresso.js'
import { listarProducoesPendentesDeRevisao, marcarCorrecaoRevisada } from '../../dados/correcoes.js'
import { listarTentativasDeFalaEncaminhadas } from '../../dados/tentativas-de-fala.js'
import { listarRevisoesDevidas } from '../../dados/revisoes-agendadas.js'
import { listarComentarios, salvarComentario, obterConfiguracoesOrientador, salvarConfiguracoesOrientador } from '../../dados/orientador.js'
import { exportarBackup, baixarArquivoDeBackup, importarBackup } from '../../dados/backup.js'
import { buscarBloco, carregarFase, primeiroBlocoDaProximaFase, proximoBlocoId } from '../../curriculo/loader.js'
import { obterFolhasAlvoPorDia } from '../../progressao/tarefa-diaria.js'

const DISCIPLINAS = ['matematica', 'portugues', 'ingles']
const NOMES_DISCIPLINA = { matematica: 'Matemática', portugues: 'Português', ingles: 'Inglês' }

function formatarData(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

async function avancarManualmente(progresso) {
  const fase = await carregarFase(progresso.disciplina, progresso.faseAtual)
  const proximoId = proximoBlocoId(fase, progresso.blocoAtualId)

  if (proximoId) {
    const encontrado = buscarBloco(fase, proximoId)
    return salvarProgresso({ ...progresso, nivelAtual: encontrado?.nivel.numero ?? progresso.nivelAtual, blocoAtualId: proximoId })
  }

  const proximaFase = await primeiroBlocoDaProximaFase(progresso.disciplina, progresso.faseAtual)
  if (!proximaFase) return progresso // já é o último bloco de todo o currículo disponível

  return salvarProgresso({
    ...progresso,
    faseAtual: proximaFase.faseNumero,
    nivelAtual: proximaFase.nivelNumero,
    blocoAtualId: proximaFase.blocoId,
  })
}

function renderSubjectPanel({ disciplina, progresso, bloco, configuracoes, onChange }) {
  const section = document.createElement('section')
  section.className = 'guardian-subject-panel'
  const folhasAlvo = obterFolhasAlvoPorDia(disciplina, configuracoes)
  section.innerHTML = `
    <h2>${NOMES_DISCIPLINA[disciplina]}</h2>
    <p>Posição atual: <strong>Fase ${progresso.faseAtual} · Nível ${progresso.nivelAtual}</strong></p>
    <p class="placeholder-note">${bloco?.habilidade ?? 'Bloco não encontrado no currículo.'}</p>
    <p class="placeholder-note">Diagnóstico: ${
      { pendente: 'ainda não feito', 'em-andamento': 'em andamento', concluido: 'concluído' }[progresso.statusDiagnostico]
    }</p>
    <div class="level-adjust">
      <button type="button" class="avancar-manual-button">Avançar manualmente →</button>
    </div>
    <div class="level-adjust">
      <label for="folhas-dia-${disciplina}">Folhas por dia nesta disciplina:</label>
      <input type="number" id="folhas-dia-${disciplina}" class="folhas-dia-input" min="1" max="10" value="${folhasAlvo}" />
    </div>
  `

  section.querySelector('.avancar-manual-button').addEventListener('click', async () => {
    await avancarManualmente(progresso)
    onChange()
  })

  const input = section.querySelector('.folhas-dia-input')
  input.addEventListener('change', async () => {
    const valor = Math.min(10, Math.max(1, Number(input.value) || folhasAlvo))
    input.value = String(valor)
    await salvarConfiguracoesOrientador({
      folhasPorDiaPorDisciplina: { ...configuracoes.folhasPorDiaPorDisciplina, [disciplina]: valor },
    })
    // Não chama onChange() aqui de propósito: isso re-renderizaria o painel
    // inteiro só por causa de um número, perdendo o foco do campo. A tarefa
    // de hoje já em andamento não muda retroativamente -- o novo valor só
    // vale a partir da tarefa de amanhã (ver obterOuCriarTarefaDeHoje).
  })

  return section
}

function renderFilaDeFala(tentativas) {
  const section = document.createElement('section')
  section.className = 'guardian-backup'
  section.innerHTML = `
    <h2>Fala pendente de atenção</h2>
    ${
      tentativas.length === 0
        ? '<p class="placeholder-note">Nenhuma tentativa de fala precisando de atenção agora.</p>'
        : tentativas
            .map(
              (t) => `
          <div class="guardian-fila-item">
            <p><strong>Transcrição:</strong> "${t.transcricao}" (${t.idioma})</p>
            <p class="placeholder-note">Similaridade: ${Math.round(t.similaridade * 100)}% · ${formatarData(t.criadoEm)}</p>
          </div>
        `
            )
            .join('')
    }
  `
  return section
}

function renderFilaDeProducoes(producoes, onChange) {
  const section = document.createElement('section')
  section.className = 'guardian-backup'
  section.innerHTML = `
    <h2>Produções livres pendentes de revisão</h2>
    ${
      producoes.length === 0
        ? '<p class="placeholder-note">Nenhuma produção livre pendente agora.</p>'
        : producoes
            .map(
              (p, i) => `
          <div class="guardian-fila-item">
            <p><strong>${p.item.enunciado.split('\n')[0]}</strong></p>
            <p>${p.tentativa?.resposta?.texto ?? '(sem resposta registrada)'}</p>
            <button type="button" class="marcar-revisado-button" data-indice="${i}">Marcar como revisado</button>
          </div>
        `
            )
            .join('')
    }
  `

  section.querySelectorAll('.marcar-revisado-button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const producao = producoes[Number(btn.dataset.indice)]
      await marcarCorrecaoRevisada(producao.correcao.itemId)
      onChange()
    })
  })

  return section
}

function renderRevisaoEspacada(revisoes) {
  const section = document.createElement('section')
  section.className = 'guardian-backup'
  section.innerHTML = `
    <h2>Revisão espaçada devida hoje</h2>
    ${
      revisoes.length === 0
        ? '<p class="placeholder-note">Nenhuma revisão devida agora -- tudo em dia.</p>'
        : `<ul>${revisoes.map((r) => `<li>${r.blocoId} (desde ${formatarData(r.proximaRevisaoEm)})</li>`).join('')}</ul>`
    }
  `
  return section
}

function renderComentarios(comentarios, alunoId, onChange) {
  const section = document.createElement('section')
  section.className = 'guardian-backup'
  section.innerHTML = `
    <h2>Recado para o aluno</h2>
    <textarea id="novo-comentario" rows="3" placeholder="Escreva um recado..." class="autoavaliacao-rubrica__texto"></textarea>
    <button type="button" id="enviar-comentario">Enviar recado</button>
    <div class="guardian-comentarios">
      ${comentarios
        .slice()
        .reverse()
        .map((c) => `<p class="placeholder-note">${formatarData(c.criadoEm)} — ${c.texto} ${c.lidoPeloAluno ? '(lido)' : '(não lido)'}</p>`)
        .join('')}
    </div>
  `

  section.querySelector('#enviar-comentario').addEventListener('click', async () => {
    const textarea = section.querySelector('#novo-comentario')
    const texto = textarea.value.trim()
    if (!texto) return
    await salvarComentario(alunoId, texto)
    onChange()
  })

  return section
}

export function renderDashboard(container) {
  let alunos = []
  let selectedStudentId = null

  container.innerHTML = `<p class="placeholder-note">Carregando dados…</p>`

  async function render() {
    if (!selectedStudentId) {
      container.innerHTML = `<p class="placeholder-note">Nenhum aluno cadastrado ainda.</p>`
      return
    }

    const alunoAtual = alunos.find((a) => a.id === selectedStudentId)
    const progressoList = await listarProgressoPorAluno(selectedStudentId)
    const progressoPorDisciplina = Object.fromEntries(progressoList.map((p) => [p.disciplina, p]))

    container.innerHTML = `
      <div class="guardian-tabs" id="student-tabs">
        ${alunos
          .map(
            (aluno) =>
              `<button class="guardian-tab ${aluno.id === selectedStudentId ? 'is-active' : ''}" data-student="${aluno.id}">${aluno.avatarIcone} ${aluno.nomeExibicao}</button>`
          )
          .join('')}
      </div>
      <button type="button" id="remove-student" class="remove-student-button">🗑 Remover perfil de ${alunoAtual?.nomeExibicao ?? 'aluno'}</button>
      <div id="subject-panels"></div>
      <div id="fila-fala"></div>
      <div id="fila-producoes"></div>
      <div id="revisao-espacada"></div>
      <div id="comentarios"></div>
      <div class="guardian-backup">
        <h2>Backup</h2>
        <p class="placeholder-note">Exporte para levar o progresso de um aparelho para outro, e importe para restaurar.</p>
        <button type="button" id="export-backup">⬇ Exportar backup (JSON)</button>
        <label class="import-label">
          ⬆ Importar backup (JSON)
          <input type="file" id="import-backup" accept="application/json" hidden />
        </label>
        <p class="placeholder-note" id="backup-status"></p>
      </div>
      <div class="guardian-backup">
        <h2>Diagnóstico técnico</h2>
        <p><a href="#/verificar-voz">🎤 Verificar voz (síntese e reconhecimento)</a></p>
        <p><a href="#/diagnostico">🧭 Teste diagnóstico adaptativo</a></p>
      </div>
    `

    container.querySelectorAll('.guardian-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedStudentId = btn.dataset.student
        render()
      })
    })

    container.querySelector('#remove-student').addEventListener('click', async () => {
      const confirmed = window.confirm(`Remover o perfil de ${alunoAtual?.nomeExibicao ?? 'aluno'}? Isso não pode ser desfeito.`)
      if (!confirmed) return
      await removerAluno(selectedStudentId)
      alunos = await listarAlunos()
      selectedStudentId = alunos[0]?.id ?? null
      render()
    })

    const configuracoes = await obterConfiguracoesOrientador()
    const panels = container.querySelector('#subject-panels')
    for (const disciplina of DISCIPLINAS) {
      const progresso = progressoPorDisciplina[disciplina] ?? (await obterOuCriarProgresso(selectedStudentId, disciplina))
      const fase = await carregarFase(disciplina, progresso.faseAtual)
      const encontrado = buscarBloco(fase, progresso.blocoAtualId)
      panels.appendChild(renderSubjectPanel({ disciplina, progresso, bloco: encontrado?.bloco, configuracoes, onChange: render }))
    }

    const tentativasDeFala = await listarTentativasDeFalaEncaminhadas()
    container.querySelector('#fila-fala').replaceWith(renderFilaDeFala(tentativasDeFala))

    const producoesPendentes = await listarProducoesPendentesDeRevisao()
    container.querySelector('#fila-producoes').replaceWith(renderFilaDeProducoes(producoesPendentes, render))

    const revisoesDevidas = await listarRevisoesDevidas(selectedStudentId)
    container.querySelector('#revisao-espacada').replaceWith(renderRevisaoEspacada(revisoesDevidas))

    const comentarios = await listarComentarios(selectedStudentId)
    container.querySelector('#comentarios').replaceWith(renderComentarios(comentarios, selectedStudentId, render))

    container.querySelector('#export-backup').addEventListener('click', async () => {
      const backup = await exportarBackup()
      baixarArquivoDeBackup(backup)
      await salvarConfiguracoesOrientador({ ultimoBackupEm: new Date().toISOString() })
      container.querySelector('#backup-status').textContent = 'Backup exportado! Veja a pasta de downloads do navegador.'
    })

    container.querySelector('#import-backup').addEventListener('change', async (event) => {
      const file = event.target.files[0]
      if (!file) return
      const statusEl = container.querySelector('#backup-status')
      try {
        const text = await file.text()
        const backup = JSON.parse(text)
        await importarBackup(backup)
        statusEl.textContent = 'Backup importado com sucesso!'
        alunos = await listarAlunos()
        selectedStudentId = alunos[0]?.id ?? null
        render()
      } catch (error) {
        statusEl.textContent = `Erro ao importar: ${error.message}`
      }
    })
  }

  async function init() {
    alunos = await listarAlunos()
    selectedStudentId = alunos[0]?.id ?? null
    render()
  }

  init()

  return () => {}
}
