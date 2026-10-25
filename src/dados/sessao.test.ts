import { describe, expect, it } from 'vitest'
import { carregarFase } from '../curriculo/loader.js'
import { registrarTodosOsGeradores } from '../geracao/registrar-todos.js'
import { criarBancoParaTeste } from './banco.js'
import {
  contarFolhasFinalizadasHoje,
  finalizarFolha,
  iniciarFolha,
  iniciarTesteDeConclusao,
  listarFolhasPorBloco,
  registrarTentativa,
} from './sessao.js'

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

    const primeira = await iniciarFolha('aluno-1', bloco, 3, 'matematica', banco)
    expect(primeira.itens).toHaveLength(3)
    expect(primeira.folha.numeroDaTentativaNoBloco).toBe(1)
    expect(primeira.folha.blocoId).toBe(bloco.id)

    const itensSalvos = await banco.itens.where('folhaId').equals(primeira.folha.id).toArray()
    expect(itensSalvos).toHaveLength(3)

    const segunda = await iniciarFolha('aluno-1', bloco, 3, 'matematica', banco)
    expect(segunda.folha.numeroDaTentativaNoBloco).toBe(2)
    banco.close()
  })

  it('registrarTentativa grava a tentativa e aponta respostaPrimeiraTentativaId/respostaFinalId no item', async () => {
    const banco = bancoDeTeste()
    const bloco = await blocoDeTeste()
    const { itens } = await iniciarFolha('aluno-1', bloco, 1, 'matematica', banco)
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
    const { folha } = await iniciarFolha('aluno-1', bloco, 2, 'matematica', banco)

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
    await iniciarFolha('aluno-1', bloco, 1, 'matematica', banco)
    await iniciarFolha('aluno-1', bloco, 1, 'matematica', banco)
    await iniciarFolha('aluno-2', bloco, 1, 'matematica', banco)

    const folhasDoAluno1 = await listarFolhasPorBloco('aluno-1', bloco.id, banco)
    expect(folhasDoAluno1).toHaveLength(2)
    banco.close()
  })

  it('iniciarTesteDeConclusao gera um item de cada bloco do nível, não N itens de um só bloco', async () => {
    const banco = bancoDeTeste()
    const fase = await carregarFase('matematica', 1)
    const blocosDoNivel1 = fase.niveis[0]!.blocos

    const { folha, itens } = await iniciarTesteDeConclusao('aluno-1', blocosDoNivel1, blocosDoNivel1.at(-1)!.id, 'matematica', banco)
    expect(itens).toHaveLength(blocosDoNivel1.length)
    expect(folha.blocoId).toBe(blocosDoNivel1.at(-1)!.id)
    expect(folha.numeroDaTentativaNoBloco).toBe(0)
    banco.close()
  })

  it('contarFolhasFinalizadasHoje só conta folhas finalizadas hoje, da disciplina pedida', async () => {
    const banco = bancoDeTeste()
    const bloco = await blocoDeTeste()
    const hoje = new Date('2026-03-10T12:00:00')
    const ontem = new Date('2026-03-09T12:00:00')

    const { folha: folhaHoje1 } = await iniciarFolha('aluno-1', bloco, 1, 'matematica', banco)
    const { folha: folhaHoje2 } = await iniciarFolha('aluno-1', bloco, 1, 'matematica', banco)
    const { folha: folhaOutraDisciplina } = await iniciarFolha('aluno-1', bloco, 1, 'portugues', banco)
    const { folha: folhaOntem } = await iniciarFolha('aluno-1', bloco, 1, 'matematica', banco)
    const { folha: folhaNaoFinalizada } = await iniciarFolha('aluno-1', bloco, 1, 'matematica', banco)

    await banco.folhas.update(folhaHoje1.id, { finalizadaEm: hoje.toISOString() })
    await banco.folhas.update(folhaHoje2.id, { finalizadaEm: hoje.toISOString() })
    await banco.folhas.update(folhaOutraDisciplina.id, { finalizadaEm: hoje.toISOString() })
    await banco.folhas.update(folhaOntem.id, { finalizadaEm: ontem.toISOString() })
    void folhaNaoFinalizada // finalizadaEm continua null, de propósito

    const contagem = await contarFolhasFinalizadasHoje('aluno-1', 'matematica', hoje, banco)
    expect(contagem).toBe(2)
    banco.close()
  })
})
