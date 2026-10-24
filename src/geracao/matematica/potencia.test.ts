import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { potencia } from './potencia.js'

describe('gerador matematica.potencia', () => {
  it('o gabarito bate com base ** expoente', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = potencia(rng, { bases: [2, 3, 4, 5], expoentes: [2, 3] })
      const base = item.dados.base as number
      const expoente = item.dados.expoente as number
      expect(item.gabarito).toBe(base ** expoente)
    }
  })

  it('usa o símbolo de expoente correto no enunciado (² ou ³)', () => {
    const rng = criarRng(2)
    const item2 = potencia(rng, { bases: [5], expoentes: [2] })
    expect(item2.enunciado).toBe('5² = ?')
    const item3 = potencia(rng, { bases: [5], expoentes: [3] })
    expect(item3.enunciado).toBe('5³ = ?')
  })
})
