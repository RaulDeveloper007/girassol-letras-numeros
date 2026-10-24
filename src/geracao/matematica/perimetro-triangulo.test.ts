import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { perimetroTriangulo } from './perimetro-triangulo.js'

describe('gerador matematica.perimetro-triangulo', () => {
  it('os três lados sempre respeitam a desigualdade triangular', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 200; i++) {
      const item = perimetroTriangulo(rng, { ladoMax: 15 })
      const ladoA = item.dados.ladoA as number
      const ladoB = item.dados.ladoB as number
      const ladoC = item.dados.ladoC as number
      expect(ladoA + ladoB).toBeGreaterThan(ladoC)
      expect(ladoA + ladoC).toBeGreaterThan(ladoB)
      expect(ladoB + ladoC).toBeGreaterThan(ladoA)
      expect(item.gabarito).toBe(ladoA + ladoB + ladoC)
    }
  })
})
