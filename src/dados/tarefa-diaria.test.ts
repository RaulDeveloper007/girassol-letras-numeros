import { describe, expect, it } from 'vitest'
import { criarBancoParaTeste } from './banco.js'
import { salvarConfiguracoesOrientador } from './orientador.js'
import { obterOuCriarTarefaDeHoje, registrarFolhaConcluidaHoje } from './tarefa-diaria.js'
import { dataDeHojeLocal } from '../progressao/tarefa-diaria.js'

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-tarefa-diaria-${Math.random().toString(36).slice(2)}`)
}

describe('tarefa diária', () => {
  it('cria a tarefa de hoje zerada, com o alvo padrão, na primeira leitura', async () => {
    const banco = bancoDeTeste()
    const tarefa = await obterOuCriarTarefaDeHoje('aluno-1', 'matematica', banco)
    expect(tarefa.data).toBe(dataDeHojeLocal())
    expect(tarefa.folhasConcluidas).toBe(0)
    expect(tarefa.folhasAlvo).toBe(2) // FOLHAS_ALVO_PADRAO
    banco.close()
  })

  it('usa o alvo configurado pelo responsável pra essa disciplina', async () => {
    const banco = bancoDeTeste()
    await salvarConfiguracoesOrientador({ folhasPorDiaPorDisciplina: { matematica: 5 } }, banco)

    const tarefa = await obterOuCriarTarefaDeHoje('aluno-1', 'matematica', banco)
    expect(tarefa.folhasAlvo).toBe(5)
    banco.close()
  })

  it('registrarFolhaConcluidaHoje soma 1 e não recria a tarefa', async () => {
    const banco = bancoDeTeste()
    await obterOuCriarTarefaDeHoje('aluno-1', 'matematica', banco)

    const depoisDaPrimeira = await registrarFolhaConcluidaHoje('aluno-1', 'matematica', banco)
    expect(depoisDaPrimeira.folhasConcluidas).toBe(1)

    const depoisDaSegunda = await registrarFolhaConcluidaHoje('aluno-1', 'matematica', banco)
    expect(depoisDaSegunda.folhasConcluidas).toBe(2)
    banco.close()
  })

  it('disciplinas diferentes do mesmo aluno têm tarefas independentes', async () => {
    const banco = bancoDeTeste()
    await registrarFolhaConcluidaHoje('aluno-1', 'matematica', banco)

    const portugues = await obterOuCriarTarefaDeHoje('aluno-1', 'portugues', banco)
    expect(portugues.folhasConcluidas).toBe(0)
    banco.close()
  })
})
