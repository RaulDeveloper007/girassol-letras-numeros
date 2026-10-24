import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { raiz } from './raiz.js'

describe('gerador matematica.raiz', () => {
  it('a raiz sorteada, elevada ao índice, bate com o radicando', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = raiz(rng, { indices: [2, 3], raizMax: 12 })
      const radicando = item.dados.radicando as number
      const indice = item.dados.indice as number
      expect((item.gabarito as number) ** indice).toBe(radicando)
    }
  })

  it('usa o símbolo correto (√ para índice 2, ∛ para índice 3)', () => {
    const rng = criarRng(2)
    const item2 = raiz(rng, { indices: [2], raizMax: 10 })
    expect(item2.enunciado.startsWith('√')).toBe(true)
    const item3 = raiz(rng, { indices: [3], raizMax: 10 })
    expect(item3.enunciado.startsWith('∛')).toBe(true)
  })
})
