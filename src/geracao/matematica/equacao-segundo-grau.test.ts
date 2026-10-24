import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { equacaoSegundoGrau } from './equacao-segundo-grau.js'

describe('gerador matematica.equacao-segundo-grau', () => {
  it('as duas raízes sorteadas são sempre diferentes, e o gabarito é a maior', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = equacaoSegundoGrau(rng, { raizMax: 10 })
      const { r1, r2 } = item.dados as { r1: number; r2: number }
      expect(r1).not.toBe(r2)
      expect(item.gabarito).toBe(Math.max(r1, r2))
    }
  })

  it('soma e produto das raízes batem com os coeficientes do enunciado', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 50; i++) {
      const item = equacaoSegundoGrau(rng, { raizMax: 10 })
      const { r1, r2, somaRaizes, produtoRaizes } = item.dados as {
        r1: number
        r2: number
        somaRaizes: number
        produtoRaizes: number
      }
      expect(somaRaizes).toBe(r1 + r2)
      expect(produtoRaizes).toBe(r1 * r2)
    }
  })
})
