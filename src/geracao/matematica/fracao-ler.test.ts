import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { fracaoLer } from './fracao-ler.js'

describe('gerador matematica.fracao-ler', () => {
  it('o gabarito bate com numerador/denominador sorteados e respeita os limites', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = fracaoLer(rng, { denominadores: [2, 3, 4, 5] })
      const numerador = item.dados.numerador as number
      const denominador = item.dados.denominador as number
      expect([2, 3, 4, 5]).toContain(denominador)
      expect(numerador).toBeGreaterThanOrEqual(1)
      expect(numerador).toBeLessThan(denominador)
      expect(item.gabarito).toBe(`${numerador}/${denominador}`)
    }
  })
})
