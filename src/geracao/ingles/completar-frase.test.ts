import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { completarFrase } from './completar-frase.js'

describe('gerador ingles.completar-frase', () => {
  it('o enunciado mostra a frase com lacuna sorteada, e o gabarito é a resposta correspondente', () => {
    const rng = criarRng(1)
    const frases = [
      { frase: 'I ___ happy.', resposta: 'am' },
      { frase: 'She ___ a teacher.', resposta: 'is' },
    ]
    for (let i = 0; i < 50; i++) {
      const item = completarFrase(rng, { frases })
      const escolhida = frases.find((f) => f.resposta === item.gabarito)
      expect(escolhida).toBeDefined()
      expect(item.enunciado).toBe(`Complete a frase: ${escolhida!.frase}`)
    }
  })
})
