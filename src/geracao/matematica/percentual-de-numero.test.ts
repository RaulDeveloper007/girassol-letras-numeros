import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { percentualDeNumero } from './percentual-de-numero.js'

describe('gerador matematica.percentual-de-numero', () => {
  it('o gabarito bate com percentual% do número sorteado, e sai inteiro', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = percentualDeNumero(rng, { percentuais: [10, 20, 25, 50, 75], baseMax: 20, multiploDeBase: 20 })
      const percentual = item.dados.percentual as number
      const numero = item.dados.numero as number
      expect(item.gabarito).toBeCloseTo((numero * percentual) / 100, 10)
      expect(Number.isInteger(item.gabarito as number)).toBe(true)
    }
  })
})
