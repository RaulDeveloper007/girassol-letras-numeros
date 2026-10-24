import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { perimetroRetangulo } from './perimetro-retangulo.js'

describe('gerador matematica.perimetro-retangulo', () => {
  it('o gabarito bate com 2 × (base + altura)', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = perimetroRetangulo(rng, { ladoMax: 15 })
      const base = item.dados.base as number
      const altura = item.dados.altura as number
      expect(item.gabarito).toBe(2 * (base + altura))
    }
  })
})
