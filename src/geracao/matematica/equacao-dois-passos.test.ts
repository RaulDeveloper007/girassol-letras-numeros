import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { equacaoDoisPassos } from './equacao-dois-passos.js'

describe('gerador matematica.equacao-dois-passos', () => {
  it('soma: ax + b = c implica gabarito = (c - b) / a', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 50; i++) {
      const item = equacaoDoisPassos(rng, { operacao: 'soma', maxCoeficiente: 9, maxX: 15, maxConstante: 20 })
      const a = item.dados.a as number
      const b = item.dados.b as number
      const c = item.dados.c as number
      expect(c).toBe(a * (item.gabarito as number) + b)
    }
  })

  it('subtracao: ax - b = c implica gabarito = (c + b) / a', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 50; i++) {
      const item = equacaoDoisPassos(rng, { operacao: 'subtracao', maxCoeficiente: 9, maxX: 15, maxConstante: 20 })
      const a = item.dados.a as number
      const b = item.dados.b as number
      const c = item.dados.c as number
      expect(c).toBe(a * (item.gabarito as number) - b)
    }
  })
})
