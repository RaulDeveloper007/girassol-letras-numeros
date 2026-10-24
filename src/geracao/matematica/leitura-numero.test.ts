import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { leituraNumero } from './leitura-numero.js'

describe('gerador matematica.leitura-numero', () => {
  it('o gabarito é sempre o próprio número sorteado, dentro de min/max', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = leituraNumero(rng, { min: 11, max: 100 })
      expect(item.gabarito).toBe(item.dados.numero)
      expect(item.gabarito as number).toBeGreaterThanOrEqual(11)
      expect(item.gabarito as number).toBeLessThanOrEqual(100)
    }
  })
})
