import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { equacaoUmPasso } from './equacao-um-passo.js'

describe('gerador matematica.equacao-um-passo', () => {
  it('soma: x + a = b implica gabarito = b - a', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 50; i++) {
      const item = equacaoUmPasso(rng, { operacao: 'soma', maxX: 20, maxA: 10 })
      const [, a, b] = item.enunciado.match(/^x \+ (\d+) = (\d+)\./)!.map(Number)
      expect(item.gabarito).toBe(b! - a!)
    }
  })

  it('subtracao: x - a = b nunca gera b negativo', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 50; i++) {
      const item = equacaoUmPasso(rng, { operacao: 'subtracao', maxX: 20, maxA: 10 })
      const [, a, b] = item.enunciado.match(/^x - (\d+) = (-?\d+)\./)!.map(Number)
      expect(b!).toBeGreaterThanOrEqual(0)
      expect(item.gabarito).toBe(b! + a!)
    }
  })

  it('multiplicacao: a × x = b implica gabarito = b / a', () => {
    const rng = criarRng(3)
    for (let i = 0; i < 50; i++) {
      const item = equacaoUmPasso(rng, { operacao: 'multiplicacao', maxX: 10, maxA: 10 })
      const [, a, b] = item.enunciado.match(/^(\d+)x = (\d+)\./)!.map(Number)
      expect(item.gabarito).toBe(b! / a!)
    }
  })

  it('divisao: x ÷ a = b implica gabarito = a × b', () => {
    const rng = criarRng(4)
    for (let i = 0; i < 50; i++) {
      const item = equacaoUmPasso(rng, { operacao: 'divisao', maxX: 10, maxA: 10 })
      const [, a, b] = item.enunciado.match(/^x ÷ (\d+) = (\d+)\./)!.map(Number)
      expect(item.gabarito).toBe(a! * b!)
    }
  })
})
