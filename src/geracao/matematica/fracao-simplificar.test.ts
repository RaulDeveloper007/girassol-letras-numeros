import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { fracaoSimplificar } from './fracao-simplificar.js'

describe('gerador matematica.fracao-simplificar', () => {
  it('o gabarito é a forma mais simples e equivale ao valor original', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = fracaoSimplificar(rng, { denominadoresBase: [2, 3, 4, 5], multiplicadorMax: 5 })
      const numerador = item.dados.numerador as number
      const denominador = item.dados.denominador as number
      const [numeradorGab, denominadorGab] = (item.gabarito as string).split('/').map(Number)

      expect(numerador / denominador).toBeCloseTo(numeradorGab! / denominadorGab!, 10)

      // A fração sorteada nunca já deve estar simplificada (senão o
      // exercício não teria o que simplificar).
      expect(denominador).not.toBe(denominadorGab)
    }
  })
})
