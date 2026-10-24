import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { sistema2x2 } from './sistema-2x2.js'

describe('gerador matematica.sistema-2x2', () => {
  it('o par (x, y) usado pra montar o sistema satisfaz as duas equações, e o gabarito bate com o pedido', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = sistema2x2(rng, { maxValor: 10, maxCoeficiente: 5 })
      const { a1, b1, c1, a2, b2, c2, pedir } = item.dados as {
        a1: number
        b1: number
        c1: number
        a2: number
        b2: number
        c2: number
        pedir: string
      }

      // Resolve o sistema por regra de Cramer e confere contra o gabarito.
      const determinante = a1 * b2 - a2 * b1
      expect(determinante).not.toBe(0)
      const x = (c1 * b2 - c2 * b1) / determinante
      const y = (a1 * c2 - a2 * c1) / determinante

      expect(item.gabarito).toBe(pedir === 'x' ? x : y)
    }
  })
})
