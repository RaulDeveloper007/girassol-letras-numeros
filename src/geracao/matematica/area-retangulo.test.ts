import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { areaRetangulo } from './area-retangulo.js'

describe('gerador matematica.area-retangulo', () => {
  it('o gabarito bate com base × altura', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = areaRetangulo(rng, { ladoMax: 12 })
      const base = item.dados.base as number
      const altura = item.dados.altura as number
      expect(item.gabarito).toBe(base * altura)
    }
  })
})
