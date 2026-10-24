import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { sucessorAntecessor } from './sucessor-antecessor.js'

describe('gerador matematica.sucessor-antecessor', () => {
  it('sucessor é sempre numero + 1', () => {
    const rng = criarRng(10)
    for (let i = 0; i < 100; i++) {
      const item = sucessorAntecessor(rng, { min: 1, max: 100 })
      if (item.dados.tipoPergunta === 'sucessor') {
        expect(item.gabarito).toBe((item.dados.numero as number) + 1)
      }
    }
  })

  it('antecessor é sempre numero - 1', () => {
    const rng = criarRng(20)
    for (let i = 0; i < 100; i++) {
      const item = sucessorAntecessor(rng, { min: 1, max: 100 })
      if (item.dados.tipoPergunta === 'antecessor') {
        expect(item.gabarito).toBe((item.dados.numero as number) - 1)
      }
    }
  })

  it('o gabarito nunca sai do intervalo [min, max]', () => {
    const rng = criarRng(30)
    for (let i = 0; i < 100; i++) {
      const item = sucessorAntecessor(rng, { min: 5, max: 20 })
      expect(item.gabarito as number).toBeGreaterThanOrEqual(5)
      expect(item.gabarito as number).toBeLessThanOrEqual(20)
    }
  })
})
