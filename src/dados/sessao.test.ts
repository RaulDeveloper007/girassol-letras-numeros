import { describe, expect, it } from 'vitest'
import { carregarFase } from '../curriculo/loader.js'
import { registrarTodosOsGeradores } from '../geracao/registrar-todos.js'
import { criarBancoParaTeste } from './banco.js'
import { finalizarFolha, iniciarFolha, listarFolhasPorBloco, registrarTentativa } from './sessao.js'

registrarTodosOsGeradores()

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-sessao-${Math.random().toString(36).slice(2)}`)
}

async function blocoDeTeste() {
  const fase = await carregarFase('matematica', 1)
  return fase.niveis[0]!.blocos[0]!
}

describe('sessao', () => {
  it('iniciarFolha gera e persiste a folha e seus itens, numerando a tentativa no bloco', async () => {
    const banco = bancoDeTeste()
    const bloco = await blocoDeTeste()

    const primeira = await iniciarFolha('aluno-1', bloco, 3, banco)
    expect(primeira.itens).toHaveLength(3)
    expect(primeira.folha.numeroDaTentativaNoBloco).toBe(1)
    expect(primeira.folha.blocoId).toBe(bloco.id)

    const itensSalvos = await banco.itens.where('folhaId').equals(primeira.folha.id).toArray()
    expect(itensSalvos).toHaveLength(3)

    const segunda = await iniciarFolha('aluno-1', bloco, 3, banco)
    expect(segunda.folha.numeroDaTentativaNoBloco).toBe(2)
    banco.close()
  })

  it('registrarTentativa grava a tentativa e aponta respostaPrimeiraTentativaId/respostaFinalId no item', async () => {
    const banco = bancoDeTeste()
    const bloco = await blocoDeTeste()
    const { itens } = await iniciarFolha('aluno-1', bloco, 1, banco)
    const item = itens[0]!

    const primeiraTentativa = await registrarTentativa(item, 'errado', false, 4, banco)
    expect(primeiraTentativa.numero).toBe(1)

    const itemAposPrimeira = await banco.itens.get(item.id)
    expect(itemAposPrimeira?.respostaPrimeiraTentativaId).toBe(primeiraTentativa.id)
    expect(itemAposPrimeira?.respostaFinalId).toBe(primeiraTentativa.id)

    const segundaTentativa = await registrarTentativa(item, 'certo', true, 3, banco)
    expect(segundaTentativa.numero).toBe(2)

    const itemAposSegunda = await banco.itens.get(item.id)
    // A primeira tentativa registrada continua sendo a referência de nota --
    // só a resposta final muda.
    expect(itemAposSegunda?.respostaPrimeiraTentativaId).toBe(primeiraTentativa.id)
    expect(itemAposSegunda?.respostaFinalId).toBe(segundaTentativa.id)
    banco.close()
  })

  it('finalizarFolha grava nota, tempo e o estado do ciclo de refazer', async () => {
    const banco = bancoDeTeste()
    const bloco = await blocoDeTeste()
    const { folha } = await iniciarFolha('aluno-1', bloco, 2, banco)

    await finalizarFolha(
      folha.id,
      { notaPrimeiraTentativa: 50, tempoGastoSegundos: 120, houveRefazer: true, itensQueFalharamPrimeiro: ['item-x'] },
      banco
    )

    const folhaFinal = await banco.folhas.get(folha.id)
    expect(folhaFinal?.finalizadaEm).toBeTruthy()
    expect(folhaFinal?.notaPrimeiraTentativa).toBe(50)
    expect(folhaFinal?.tempoGastoSegundos).toBe(120)
    expect(folhaFinal?.cicloDeRefazer).toEqual({ ativo: true, itensPendentesIds: ['item-x'] })
    banco.close()
  })

  it('listarFolhasPorBloco retorna só as folhas daquele aluno e bloco', async () => {
    const banco = bancoDeTeste()
    const bloco = await blocoDeTeste()
    await iniciarFolha('aluno-1', bloco, 1, banco)
    await iniciarFolha('aluno-1', bloco, 1, banco)
    await iniciarFolha('aluno-2', bloco, 1, banco)

    const folhasDoAluno1 = await listarFolhasPorBloco('aluno-1', bloco.id, banco)
    expect(folhasDoAluno1).toHaveLength(2)
    banco.close()
  })
})
