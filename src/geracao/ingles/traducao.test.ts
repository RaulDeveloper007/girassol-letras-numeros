import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { traducao } from './traducao.js'

describe('gerador ingles.traducao', () => {
  it('o enunciado mostra a palavra em português sorteada, e o gabarito é a tradução correspondente', () => {
    const rng = criarRng(1)
    const pares = [
      { portugues: 'vermelho', ingles: 'red' },
      { portugues: 'cachorro', ingles: 'dog' },
    ]
    for (let i = 0; i < 50; i++) {
      const item = traducao(rng, { pares })
      const escolhido = pares.find((p) => p.ingles === item.gabarito)
      expect(escolhido).toBeDefined()
      expect(item.enunciado).toBe(`Como se diz "${escolhido!.portugues}" em inglês?`)
    }
  })

  it('repassa variantesAceitas pras regras de correção', () => {
    const rng = criarRng(2)
    const item = traducao(rng, { pares: [{ portugues: 'carro', ingles: 'car', variantesAceitas: ['automobile'] }] })
    expect(item.dados.regrasTextuais).toEqual({ variantesAceitas: ['automobile'] })
  })
})
