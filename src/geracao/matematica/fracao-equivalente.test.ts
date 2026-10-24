import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { fracaoEquivalente } from './fracao-equivalente.js'

describe('gerador matematica.fracao-equivalente', () => {
  it('o gabarito mantém o mesmo valor da fração base', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = fracaoEquivalente(rng, { denominadoresBase: [2, 3, 4, 5], multiplicadorMax: 5 })
      const numeradorBase = item.dados.numeradorBase as number
      const denominadorBase = item.dados.denominadorBase as number
      const denominadorAlvo = item.dados.denominadorAlvo as number
      expect(denominadorAlvo % denominadorBase).toBe(0)
      expect((item.gabarito as number) / denominadorAlvo).toBeCloseTo(numeradorBase / denominadorBase, 10)
    }
  })

  it('o enunciado mostra a fração base e o denominador alvo', () => {
    const rng = criarRng(2)
    const item = fracaoEquivalente(rng, { denominadoresBase: [2], multiplicadorMax: 3 })
    expect(item.enunciado).toBe(`${item.dados.numeradorBase}/${item.dados.denominadorBase} = ?/${item.dados.denominadorAlvo}`)
  })
})
