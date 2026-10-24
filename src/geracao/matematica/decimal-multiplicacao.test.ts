import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { decimalMultiplicacao } from './decimal-multiplicacao.js'

describe('gerador matematica.decimal-multiplicacao', () => {
  it('por-inteiro: o gabarito bate com base × multiplicador', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 50; i++) {
      const item = decimalMultiplicacao(rng, { modo: 'por-inteiro', casas: 2 })
      const baseEscalada = item.dados.baseEscalada as number
      const escala = item.dados.escala as number
      const multiplicador = item.dados.multiplicador as number
      expect(item.gabarito).toBeCloseTo((baseEscalada / escala) * multiplicador, 10)
    }
  })

  it('por-potencia-de-10: o gabarito bate com base × 10 ou × 100', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 50; i++) {
      const item = decimalMultiplicacao(rng, { modo: 'por-potencia-de-10', casas: 2 })
      const baseEscalada = item.dados.baseEscalada as number
      const escala = item.dados.escala as number
      const potencia = item.dados.potencia as number
      expect([10, 100]).toContain(potencia)
      expect(item.gabarito).toBeCloseTo((baseEscalada / escala) * potencia, 10)
    }
  })
})
