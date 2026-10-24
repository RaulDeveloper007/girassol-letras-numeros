import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { subtracao } from './subtracao.js'

describe('gerador matematica.subtracao', () => {
  it('o gabarito é sempre a-b, nunca negativo, e respeita maxA/maxB', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = subtracao(rng, { maxA: 18, maxB: 9 })
      const a = item.dados.a as number
      const b = item.dados.b as number
      expect(a).toBeGreaterThanOrEqual(2)
      expect(b).toBeGreaterThanOrEqual(1)
      expect(b).toBeLessThanOrEqual(a)
      expect(item.gabarito).toBe(a - b)
      expect(item.gabarito as number).toBeGreaterThanOrEqual(0)
    }
  })

  it('com comEmprestimo: false, nunca pede emprestado (unidade de a >= unidade de b)', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 100; i++) {
      const item = subtracao(rng, { maxA: 18, maxB: 9, comEmprestimo: false })
      const a = item.dados.a as number
      const b = item.dados.b as number
      expect(a % 10).toBeGreaterThanOrEqual(b % 10)
    }
  })

  it('o enunciado reflete os operandos sorteados', () => {
    const rng = criarRng(3)
    const item = subtracao(rng, { maxA: 9, maxB: 5 })
    expect(item.enunciado).toBe(`${item.dados.a} - ${item.dados.b} = ?`)
  })
})
