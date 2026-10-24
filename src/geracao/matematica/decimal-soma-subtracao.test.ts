import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { decimalSomaSubtracao } from './decimal-soma-subtracao.js'

describe('gerador matematica.decimal-soma-subtracao', () => {
  it('soma: o gabarito bate com (a+b)/escala', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = decimalSomaSubtracao(rng, { operacao: 'soma', casas: 1 })
      const a = item.dados.a as number
      const b = item.dados.b as number
      const escala = item.dados.escala as number
      expect(item.gabarito).toBeCloseTo((a + b) / escala, 10)
    }
  })

  it('subtração: nunca gera um gabarito negativo', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 100; i++) {
      const item = decimalSomaSubtracao(rng, { operacao: 'subtracao', casas: 2 })
      expect(item.gabarito as number).toBeGreaterThanOrEqual(0)
    }
  })
})
