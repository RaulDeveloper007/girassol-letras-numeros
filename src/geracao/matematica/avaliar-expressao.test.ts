import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { avaliarExpressao } from './avaliar-expressao.js'

describe('gerador matematica.avaliar-expressao', () => {
  it('linear: o gabarito bate com a × x + b', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 50; i++) {
      const item = avaliarExpressao(rng, { forma: 'linear', aMax: 9, bMax: 9, xMax: 10 })
      const { a, b, x } = item.dados as { a: number; b: number; x: number }
      expect(item.gabarito).toBe(a * x + b)
    }
  })

  it('distributiva: o gabarito bate com a × (x + b)', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 50; i++) {
      const item = avaliarExpressao(rng, { forma: 'distributiva', aMax: 9, bMax: 9, xMax: 10 })
      const { a, b, x } = item.dados as { a: number; b: number; x: number }
      expect(item.gabarito).toBe(a * (x + b))
    }
  })
})
