import { describe, expect, it } from 'vitest'
import { criarBancoParaTeste } from './banco.js'
import {
  listarCorrecoesPendentesDeRevisao,
  listarProducoesPendentesDeRevisao,
  marcarCorrecaoRevisada,
  obterCorrecao,
  salvarCorrecao,
} from './correcoes.js'

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-correcoes-${Math.random().toString(36).slice(2)}`)
}

describe('correcoes', () => {
  it('salva e recupera uma correção pelo itemId', async () => {
    const banco = bancoDeTeste()
    await salvarCorrecao({ itemId: 'item-1', metodo: 'numerico', correto: true, revisadoPeloOrientador: false }, banco)
    const correcao = await obterCorrecao('item-1', banco)
    expect(correcao?.correto).toBe(true)
    banco.close()
  })

  it('lista só correções por rubrica (produção livre) ainda não revisadas', async () => {
    const banco = bancoDeTeste()
    await salvarCorrecao({ itemId: 'item-numerico', metodo: 'numerico', correto: true, revisadoPeloOrientador: false }, banco)
    await salvarCorrecao({ itemId: 'item-redacao-1', metodo: 'rubrica', correto: false, revisadoPeloOrientador: false }, banco)
    await salvarCorrecao({ itemId: 'item-redacao-2', metodo: 'rubrica', correto: false, revisadoPeloOrientador: true }, banco)

    const pendentes = await listarCorrecoesPendentesDeRevisao(banco)
    expect(pendentes.map((c) => c.itemId)).toEqual(['item-redacao-1'])
    banco.close()
  })

  it('marcarCorrecaoRevisada tira o item da fila de pendentes', async () => {
    const banco = bancoDeTeste()
    await salvarCorrecao({ itemId: 'item-redacao-1', metodo: 'rubrica', correto: false, revisadoPeloOrientador: false }, banco)
    await marcarCorrecaoRevisada('item-redacao-1', banco)

    const pendentes = await listarCorrecoesPendentesDeRevisao(banco)
    expect(pendentes).toEqual([])
    banco.close()
  })
})

describe('listarProducoesPendentesDeRevisao', () => {
  it('junta a correção pendente com o item e a resposta escrita pelo aluno', async () => {
    const banco = bancoDeTeste()
    await banco.itens.put({
      id: 'item-redacao-1',
      folhaId: 'folha-1',
      tipo: 'producao-livre',
      enunciado: 'Escreva sobre seu animal favorito.',
      dados: {},
      gabarito: null,
      respostaPrimeiraTentativaId: 'tentativa-1',
      respostaFinalId: 'tentativa-1',
    })
    await banco.tentativas.put({
      id: 'tentativa-1',
      itemId: 'item-redacao-1',
      numero: 1,
      resposta: { texto: 'Eu gosto do meu gato.', pontuacoesPorCriterio: {} },
      corretoNaHora: false,
      tempoGastoSegundos: 60,
      criadoEm: new Date().toISOString(),
    })
    await salvarCorrecao({ itemId: 'item-redacao-1', metodo: 'rubrica', correto: false, revisadoPeloOrientador: false }, banco)

    const pendentes = await listarProducoesPendentesDeRevisao(banco)
    expect(pendentes).toHaveLength(1)
    expect(pendentes[0]?.item.enunciado).toBe('Escreva sobre seu animal favorito.')
    expect(pendentes[0]?.tentativa?.resposta).toEqual({ texto: 'Eu gosto do meu gato.', pontuacoesPorCriterio: {} })
    banco.close()
  })
})
