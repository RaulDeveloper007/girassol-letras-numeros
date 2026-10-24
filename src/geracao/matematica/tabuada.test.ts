import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { tabuada } from './tabuada.js'

describe('gerador matematica.tabuada', () => {
  it('o gabarito é sempre tabela × multiplicador, dentro dos parâmetros', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = tabuada(rng, { tabelas: [2, 3, 5], multiplicadorMax: 10 })
      const a = item.dados.a as number
      const b = item.dados.b as number
      expect([2, 3, 5]).toContain(a)
      expect(b).toBeGreaterThanOrEqual(1)
      expect(b).toBeLessThanOrEqual(10)
      expect(item.gabarito).toBe(a * b)
    }
  })

  it('usa só a tabela pedida quando há uma única opção', () => {
    const rng = criarRng(5)
    const item = tabuada(rng, { tabelas: [7], multiplicadorMax: 10 })
    expect(item.dados.a).toBe(7)
  })
})
