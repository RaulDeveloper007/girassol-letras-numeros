import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { areaTriangulo } from './area-triangulo.js'

describe('gerador matematica.area-triangulo', () => {
  it('o gabarito bate com (base × altura) / 2 e sai sempre inteiro', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = areaTriangulo(rng, { baseMax: 12, alturaMax: 12 })
      const base = item.dados.base as number
      const altura = item.dados.altura as number
      expect(item.gabarito).toBe((base * altura) / 2)
      expect(Number.isInteger(item.gabarito as number)).toBe(true)
    }
  })
})
