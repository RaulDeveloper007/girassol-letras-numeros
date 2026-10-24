import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { percentualProblema } from './percentual-problema.js'

describe('gerador matematica.percentual-problema', () => {
  it('o gabarito é o preço menos o desconto, e nunca é negativo', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = percentualProblema(rng, { percentuais: [10, 20, 25, 50], precoMultiplo: 20, precoMax: 10 })
      const preco = item.dados.preco as number
      const desconto = item.dados.desconto as number
      expect(item.gabarito).toBeCloseTo(preco - desconto, 10)
      expect(item.gabarito as number).toBeGreaterThanOrEqual(0)
    }
  })
})
