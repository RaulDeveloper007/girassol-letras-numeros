import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { sequencia } from './sequencia.js'

describe('gerador matematica.sequencia', () => {
  it('o gabarito bate com o número escondido da sequência real', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = sequencia(rng, { maxInicio: 20, passos: [1, 2, 5], tamanho: 5 })
      const numeros = item.dados.numeros as number[]
      const indiceOculto = item.dados.indiceOculto as number
      expect(item.gabarito).toBe(numeros[indiceOculto])
    }
  })

  it('a sequência tem o passo constante pedido', () => {
    const rng = criarRng(2)
    const item = sequencia(rng, { maxInicio: 10, passos: [5], tamanho: 4 })
    const numeros = item.dados.numeros as number[]
    for (let i = 1; i < numeros.length; i++) {
      expect(numeros[i]! - numeros[i - 1]!).toBe(5)
    }
  })

  it('nunca esconde um dos dois primeiros números (precisa de pista pro padrão)', () => {
    const rng = criarRng(3)
    for (let i = 0; i < 50; i++) {
      const item = sequencia(rng, { maxInicio: 20, passos: [1], tamanho: 5 })
      expect(item.dados.indiceOculto as number).toBeGreaterThanOrEqual(2)
    }
  })
})
