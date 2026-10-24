import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { percentualConversao } from './percentual-conversao.js'

describe('gerador matematica.percentual-conversao', () => {
  it('percentual-para-fracao: o gabarito é a fração simplificada correspondente', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 50; i++) {
      const item = percentualConversao(rng, { direcao: 'percentual-para-fracao', percentuais: [10, 20, 25, 50, 75] })
      const percentual = item.dados.percentual as number
      const [n, d] = (item.gabarito as string).split('/').map(Number)
      expect(n! / d!).toBeCloseTo(percentual / 100, 10)
    }
  })

  it('fracao-para-percentual: o gabarito é o número do percentual original', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 50; i++) {
      const item = percentualConversao(rng, { direcao: 'fracao-para-percentual', percentuais: [10, 20, 25, 50, 75] })
      const numerador = item.dados.numerador as number
      const denominador = item.dados.denominador as number
      expect(numerador / denominador).toBeCloseTo((item.gabarito as number) / 100, 10)
    }
  })
})
