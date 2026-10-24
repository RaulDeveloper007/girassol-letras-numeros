import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { adicao } from './adicao.js'

describe('gerador matematica.adicao', () => {
  it('o gabarito é sempre a+b, e os operandos respeitam maxA/maxB', () => {
    const rng = criarRng(20)
    for (let i = 0; i < 50; i++) {
      const item = adicao(rng, { maxA: 9, maxB: 9 })
      const a = item.dados.a as number
      const b = item.dados.b as number
      expect(a).toBeGreaterThanOrEqual(1)
      expect(a).toBeLessThanOrEqual(9)
      expect(b).toBeGreaterThanOrEqual(1)
      expect(b).toBeLessThanOrEqual(9)
      expect(item.gabarito).toBe(a + b)
    }
  })

  it('com comReserva: false, nunca gera uma soma que "vai um"', () => {
    const rng = criarRng(30)
    for (let i = 0; i < 100; i++) {
      const item = adicao(rng, { maxA: 9, maxB: 9, comReserva: false })
      const a = item.dados.a as number
      const b = item.dados.b as number
      expect((a % 10) + (b % 10)).toBeLessThanOrEqual(9)
    }
  })

  it('o enunciado reflete os operandos sorteados', () => {
    const rng = criarRng(1)
    const item = adicao(rng, { maxA: 5, maxB: 5 })
    expect(item.enunciado).toBe(`${item.dados.a} + ${item.dados.b} = ?`)
  })
})
