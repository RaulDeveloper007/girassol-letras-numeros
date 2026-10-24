import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { decimalFracao } from './decimal-fracao.js'

describe('gerador matematica.decimal-fracao', () => {
  it('fracao-para-decimal: o gabarito é numerador/denominador', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 50; i++) {
      const item = decimalFracao(rng, { direcao: 'fracao-para-decimal', casas: 1 })
      const numerador = item.dados.numerador as number
      const denominador = item.dados.denominador as number
      expect(item.gabarito).toBeCloseTo(numerador / denominador, 10)
      expect(item.tipo).toBe('numerico')
    }
  })

  it('decimal-para-fracao: o gabarito é a fração correspondente, como texto', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 50; i++) {
      const item = decimalFracao(rng, { direcao: 'decimal-para-fracao', casas: 2 })
      expect(item.gabarito).toBe(`${item.dados.numerador}/${item.dados.denominador}`)
      expect(item.tipo).toBe('textual')
    }
  })
})
