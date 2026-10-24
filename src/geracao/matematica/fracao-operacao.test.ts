import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { fracaoOperacao } from './fracao-operacao.js'

function valor(fracao: string): number {
  const [n, d] = fracao.split('/').map(Number)
  return n! / d!
}

describe('gerador matematica.fracao-operacao', () => {
  it('soma: o gabarito bate com a soma dos valores sorteados', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = fracaoOperacao(rng, { operacao: 'soma', denominadores: [2, 3, 4, 5] })
      const esperado = valor(`${item.dados.numeradorA}/${item.dados.denominadorA}`) + valor(`${item.dados.numeradorB}/${item.dados.denominadorB}`)
      expect(valor(item.gabarito as string)).toBeCloseTo(esperado, 10)
    }
  })

  it('subtração: nunca gera um gabarito negativo', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 100; i++) {
      const item = fracaoOperacao(rng, { operacao: 'subtracao', denominadores: [2, 3, 4, 5] })
      expect(valor(item.gabarito as string)).toBeGreaterThanOrEqual(0)
    }
  })

  it('multiplicação: o gabarito bate com o produto dos valores sorteados', () => {
    const rng = criarRng(3)
    for (let i = 0; i < 50; i++) {
      const item = fracaoOperacao(rng, { operacao: 'multiplicacao', denominadores: [2, 3, 4, 5], denominadoresIguais: false })
      const esperado = valor(`${item.dados.numeradorA}/${item.dados.denominadorA}`) * valor(`${item.dados.numeradorB}/${item.dados.denominadorB}`)
      expect(valor(item.gabarito as string)).toBeCloseTo(esperado, 10)
    }
  })

  it('divisão: o gabarito bate com a divisão dos valores sorteados', () => {
    const rng = criarRng(4)
    for (let i = 0; i < 50; i++) {
      const item = fracaoOperacao(rng, { operacao: 'divisao', denominadores: [2, 3, 4, 5], denominadoresIguais: false })
      const esperado = valor(`${item.dados.numeradorA}/${item.dados.denominadorA}`) / valor(`${item.dados.numeradorB}/${item.dados.denominadorB}`)
      expect(valor(item.gabarito as string)).toBeCloseTo(esperado, 10)
    }
  })
})
