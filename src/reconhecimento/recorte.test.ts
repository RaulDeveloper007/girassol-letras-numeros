import { describe, expect, it } from 'vitest'
import { recortarEEscalar } from './recorte.js'

describe('recortarEEscalar', () => {
  it('retorna uma grade do tamanho de saída pedido', () => {
    const tinta = new Float32Array(10 * 10).fill(1)
    const saida = recortarEEscalar(tinta, 10, 10, { minX: 2, maxX: 7, minY: 2, maxY: 7 }, 28)
    expect(saida.length).toBe(28 * 28)
  })

  it('região totalmente vazia produz saída toda zero', () => {
    const tinta = new Float32Array(10 * 10).fill(0)
    const saida = recortarEEscalar(tinta, 10, 10, { minX: 2, maxX: 7, minY: 2, maxY: 7 }, 28)
    expect(Array.from(saida).every((v) => v === 0)).toBe(true)
  })

  it('o centro da saída cai dentro do glifo escalado (valor = 1), e os cantos ficam fora da margem (valor = 0)', () => {
    const tinta = new Float32Array(10 * 10).fill(1)
    const saida = recortarEEscalar(tinta, 10, 10, { minX: 2, maxX: 7, minY: 2, maxY: 7 }, 28, 1.4)
    const centro = saida[14 * 28 + 14]!
    const canto = saida[0]!
    expect(centro).toBeCloseTo(1, 5)
    expect(canto).toBe(0)
  })

  it('uma margem maior deixa uma borda vazia mais larga ao redor do glifo', () => {
    const tinta = new Float32Array(10 * 10).fill(1)
    const saidaMargemPequena = recortarEEscalar(tinta, 10, 10, { minX: 2, maxX: 7, minY: 2, maxY: 7 }, 28, 1.0)
    const saidaMargemGrande = recortarEEscalar(tinta, 10, 10, { minX: 2, maxX: 7, minY: 2, maxY: 7 }, 28, 2.0)

    const somaTinta = (grade: Float32Array) => grade.reduce((soma, v) => soma + v, 0)
    expect(somaTinta(saidaMargemGrande)).toBeLessThan(somaTinta(saidaMargemPequena))
  })
})
