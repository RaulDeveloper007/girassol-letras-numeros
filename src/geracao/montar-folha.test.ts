import { beforeEach, describe, expect, it } from 'vitest'
import type { BlocoDeclarado } from '../curriculo/tipos.js'
import { escolherInteiro } from './aleatorio.js'
import { montarFolha } from './montar-folha.js'
import { limparRegistro, registrarGerador } from './registro.js'
import type { FuncaoGeradora } from './tipos.js'

function blocoDeTeste(geradorId: string): BlocoDeclarado {
  return {
    id: 'bloco-teste',
    habilidade: 'teste',
    exemploResolvido: { enunciado: '', passoAPasso: [] },
    geradorId,
    parametrosGerador: {},
    tempoPadraoSegundos: 60,
    criterioDominio: { folhasConsecutivas: 1, acertoMinimo: 100, dentroDoTempoPadrao: false },
    tiposDeItem: ['numerico'],
  }
}

beforeEach(() => {
  limparRegistro()
})

describe('montarFolha', () => {
  it('gera a quantidade de itens pedida', () => {
    const gerador: FuncaoGeradora = (rng) => ({
      tipo: 'numerico',
      enunciado: `item-${escolherInteiro(rng, 1, 1000)}`,
      dados: {},
      gabarito: 1,
    })
    registrarGerador('g1', gerador)

    const { itens } = montarFolha({ bloco: blocoDeTeste('g1'), quantidadeItens: 6 })
    expect(itens).toHaveLength(6)
  })

  it('evita repetir o mesmo enunciado dentro da mesma folha quando há variedade suficiente', () => {
    // Universo de só 5 enunciados possíveis, pedindo 5 itens: só fecha sem
    // repetir se o anti-repetição dentro da folha estiver funcionando.
    const gerador: FuncaoGeradora = (rng) => {
      const n = escolherInteiro(rng, 1, 5)
      return { tipo: 'numerico', enunciado: `item-${n}`, dados: { n }, gabarito: n }
    }
    registrarGerador('g2', gerador)

    const { itens } = montarFolha({ bloco: blocoDeTeste('g2'), quantidadeItens: 5, tentativasMaximasPorItem: 20 })
    const enunciados = itens.map((item) => item.enunciado)
    expect(new Set(enunciados).size).toBe(5)
  })

  it('tenta de novo a folha inteira para não repetir a assinatura anterior', () => {
    const gerador: FuncaoGeradora = (rng) => {
      const n = escolherInteiro(rng, 1, 1000)
      return { tipo: 'numerico', enunciado: `item-${n}`, dados: { n }, gabarito: n }
    }
    registrarGerador('g3', gerador)

    const primeira = montarFolha({ bloco: blocoDeTeste('g3'), quantidadeItens: 4 })
    const segunda = montarFolha({
      bloco: blocoDeTeste('g3'),
      quantidadeItens: 4,
      assinaturaParaEvitar: primeira.assinatura,
    })

    expect(segunda.assinatura).not.toBe(primeira.assinatura)
  })

  it('desiste depois do limite de tentativas em vez de travar quando repetir é inevitável', () => {
    // Só existe UM enunciado possível -- é impossível não repetir.
    const gerador: FuncaoGeradora = () => ({ tipo: 'numerico', enunciado: 'único', dados: {}, gabarito: 1 })
    registrarGerador('g4', gerador)

    const primeira = montarFolha({ bloco: blocoDeTeste('g4'), quantidadeItens: 2 })
    const segunda = montarFolha({
      bloco: blocoDeTeste('g4'),
      quantidadeItens: 2,
      assinaturaParaEvitar: primeira.assinatura,
      tentativasMaximasDeFolha: 3,
    })

    // Não trava e devolve uma folha mesmo repetindo a assinatura.
    expect(segunda.itens).toHaveLength(2)
    expect(segunda.assinatura).toBe(primeira.assinatura)
  })
})
