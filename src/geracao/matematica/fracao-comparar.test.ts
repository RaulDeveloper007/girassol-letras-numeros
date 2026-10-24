import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { fracaoComparar } from './fracao-comparar.js'

describe('gerador matematica.fracao-comparar', () => {
  it('o gabarito é sempre a fração de maior valor entre as duas sorteadas', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = fracaoComparar(rng, { denominadores: [2, 3, 4, 5, 6, 8] })
      const fracaoA = item.dados.fracaoA as string
      const fracaoB = item.dados.fracaoB as string
      const valorFracao = (f: string) => {
        const [n, d] = f.split('/').map(Number)
        return n! / d!
      }
      const esperado = valorFracao(fracaoA) > valorFracao(fracaoB) ? fracaoA : fracaoB
      expect(item.gabarito).toBe(esperado)
    }
  })
})
